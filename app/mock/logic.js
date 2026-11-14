/*
 * 罠通知モックのロジック（DOMに触らない純粋なロジック）
 * ブラウザ：グローバル TrapLogic。Node：module.exports。
 * 時計はシミュレート。state.now は「2026-11-14 00:00 からの経過分」。乱数は使わない。
 * 関数は state を直接書き換える（createState 以外は state を返す or 結果を返す）。
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.TrapLogic = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var EPOCH = Date.UTC(2026, 10, 14, 0, 0, 0); // 表示用。実時間は使わない
  var KUKURI = 'くくり罠';
  var BOX = '箱罠';

  var DEFAULT_CONFIG = {
    aliveIntervalMin: 360, // 生存確認の間隔（6時間）
    graceFactor: 1.5,      // 「不明」になるまでの倍率
    batteryLowPct: 20,     // これを下回ると電池低下
    lateMin: 10,           // 発生から受信までこれ以上で「遅れて届いた」
    queueLimit: 20         // センサー側の未送信キュー上限
  };

  var DEFAULT_TRAPS = [
    { id: 't1', name: '沢沿い1（例）', type: KUKURI },
    { id: 't2', name: '沢沿い2（例）', type: KUKURI },
    { id: 't3', name: '尾根の分岐（例）', type: KUKURI },
    { id: 't4', name: '杉林の箱罠（例）', type: BOX }
  ];

  // ---------- 状態の作成 ----------
  function createState(opts) {
    opts = opts || {};
    var config = {};
    Object.keys(DEFAULT_CONFIG).forEach(function (k) {
      config[k] = opts[k] !== undefined ? opts[k] : DEFAULT_CONFIG[k];
    });
    var startAt = opts.startAt !== undefined ? opts.startAt : 18 * 60; // 11/14 18:00
    var traps = opts.traps || DEFAULT_TRAPS;
    var state = {
      now: startAt,
      config: config,
      sensors: [],
      server: { seen: {}, traps: {}, notifications: [], nextNotificationId: 1 }
    };
    traps.forEach(function (d) {
      state.sensors.push({
        id: d.id, name: d.name, type: d.type,
        fired: false,            // 作動済みか（false=掛けてある）
        signal: true,            // 電波が届くか
        battery: 100,            // 実際の電池残量（%）
        queue: [],               // 未送信イベント
        seq: 0,                  // 連番（センサーが採番）
        nextAliveAt: startAt + config.aliveIntervalMin,
        lowSent: false           // 電池低下イベントを出した（センサー側）
      });
      state.server.seen[d.id] = {};
      state.server.traps[d.id] = {
        id: d.id, name: d.name, type: d.type,
        fired: false, firedAt: null, fireSeq: 0,
        lastRxAt: startAt,       // 最後に何かを受信した時刻
        evidenceAt: startAt,     // 最後に「生きている」と確認できた発生時刻（設置時に1回確認済みとする）
        battery: 100, batteryAt: startAt,
        lowNotified: false, lostNotified: false
      };
    });
    return state;
  }

  function findSensor(state, id) {
    for (var i = 0; i < state.sensors.length; i++) if (state.sensors[i].id === id) return state.sensors[i];
    throw new Error('unknown trap: ' + id);
  }

  // ---------- センサー側 ----------
  function trimQueue(state, s) {
    // あふれたら生存確認から捨てる。作動イベントは残す。
    var order = ['alive', 'battery_low', 'rearm'];
    while (s.queue.length > state.config.queueLimit) {
      var idx = -1;
      for (var k = 0; k < order.length && idx < 0; k++) {
        for (var i = 0; i < s.queue.length; i++) {
          if (s.queue[i].type === order[k]) { idx = i; break; }
        }
      }
      if (idx < 0) break; // 作動イベントだけなら捨てない
      s.queue.splice(idx, 1);
    }
  }

  function emit(state, s, type, at) {
    if (s.battery <= 0) return null; // 電池0%：何も出せない
    s.seq += 1;
    var ev = { seq: s.seq, type: type, at: at, battery: s.battery };
    s.queue.push(ev);
    trimQueue(state, s);
    return ev;
  }

  function trySend(state, s) {
    if (!s.signal || s.battery <= 0 || s.queue.length === 0) return;
    var batch = s.queue.splice(0, s.queue.length); // 発生順にすべて送る
    deliver(state, s.id, batch);
  }

  // ---------- サーバー側 ----------
  function notify(state, type, trap, occurredAt) {
    var srv = state.server;
    var n = {
      id: srv.nextNotificationId++,
      type: type,                 // 'fire' | 'alive_lost' | 'battery_low'
      trapId: trap.id, trapName: trap.name,
      occurredAt: occurredAt, receivedAt: state.now,
      delayMin: state.now - occurredAt
    };
    n.delayed = n.delayMin >= state.config.lateMin;
    srv.notifications.push(n);
    return n;
  }

  function applyEvent(state, t, ev) {
    if (ev.at > t.evidenceAt) t.evidenceAt = ev.at;
    if (ev.at >= t.batteryAt) {
      t.battery = ev.battery; t.batteryAt = ev.at;
      if (ev.battery < state.config.batteryLowPct) {
        if (!t.lowNotified) { t.lowNotified = true; notify(state, 'battery_low', t, ev.at); }
      } else {
        t.lowNotified = false;
      }
    }
    if (ev.type === 'fire') {
      t.fired = true; t.firedAt = ev.at; t.fireSeq = ev.seq;
      notify(state, 'fire', t, ev.at);
    } else if (ev.type === 'rearm') {
      if (t.fired && ev.seq > t.fireSeq) { t.fired = false; }
    }
  }

  // センサーからの到着。連番で重複を捨てる。
  function deliver(state, trapId, events) {
    var seen = state.server.seen[trapId];
    var t = state.server.traps[trapId];
    var sorted = events.slice().sort(function (a, b) { return a.seq - b.seq; });
    if (sorted.length > 0) t.lastRxAt = state.now;
    sorted.forEach(function (ev) {
      if (seen[ev.seq]) return; // 重複
      seen[ev.seq] = true;
      applyEvent(state, t, ev);
    });
    serverCheck(state);
  }

  function trapStatus(state, id) {
    var t = state.server.traps[id];
    var limit = state.config.aliveIntervalMin * state.config.graceFactor;
    var age = state.now - t.evidenceAt;
    var status = t.fired ? 'fired' : (age > limit ? 'unknown' : 'ok');
    return {
      id: id, name: t.name, type: t.type, status: status,
      lowBattery: t.battery < state.config.batteryLowPct,
      battery: t.battery, lastRxAt: t.lastRxAt, evidenceAt: t.evidenceAt,
      firedAt: t.firedAt, ageMin: age, limitMin: limit
    };
  }

  // 時間経過で起きる判定（通信途絶）。状態が「不明」になった時点で1回だけ通知。
  function serverCheck(state) {
    state.sensors.forEach(function (s) {
      var t = state.server.traps[s.id];
      var st = trapStatus(state, s.id);
      if (st.status === 'unknown') {
        if (!t.lostNotified) { t.lostNotified = true; notify(state, 'alive_lost', t, state.now); }
      } else {
        t.lostNotified = false;
      }
    });
  }

  // ---------- 時間 ----------
  function advance(state, minutes) {
    for (var m = 0; m < minutes; m++) {
      state.now += 1;
      state.sensors.forEach(function (s) {
        while (s.nextAliveAt <= state.now) {
          if (s.battery > 0) emit(state, s, 'alive', s.nextAliveAt);
          s.nextAliveAt += state.config.aliveIntervalMin;
        }
        trySend(state, s);
      });
      serverCheck(state);
    }
    return state;
  }

  function advanceToMorning(state, hour) {
    if (hour === undefined) hour = 6;
    var day = 24 * 60;
    var wait = ((hour * 60 - (state.now % day)) + day) % day;
    if (wait === 0) wait = day;
    advance(state, wait);
    return wait;
  }

  // ---------- 操作 ----------
  function fireTrap(state, id) {
    var s = findSensor(state, id);
    if (s.fired) return false;
    s.fired = true;
    emit(state, s, 'fire', state.now);
    trySend(state, s);
    return true;
  }

  function setSignal(state, id, on) {
    var s = findSensor(state, id);
    s.signal = !!on;
    if (s.signal) trySend(state, s); // 戻ったら、たまっていた分をまとめて再送
    return state;
  }

  function setBattery(state, id, pct) {
    var s = findSensor(state, id);
    pct = Math.max(0, Math.min(100, Math.round(pct)));
    s.battery = pct;
    if (pct >= state.config.batteryLowPct) {
      s.lowSent = false;
    } else if (pct > 0 && !s.lowSent) {
      if (emit(state, s, 'battery_low', state.now)) s.lowSent = true;
      trySend(state, s);
    }
    return state;
  }

  function rearm(state, id) {
    var s = findSensor(state, id);
    if (!s.fired) return false;
    s.fired = false;
    emit(state, s, 'rearm', state.now);
    trySend(state, s);
    return true;
  }

  // 間隔を変えると、各センサーは設定を受けた時点で生存確認を1回出し、そこから数え直す。
  function setAliveInterval(state, minutes) {
    state.config.aliveIntervalMin = minutes;
    state.sensors.forEach(function (s) {
      if (s.battery > 0) emit(state, s, 'alive', state.now);
      s.nextAliveAt = state.now + minutes;
      trySend(state, s);
    });
    serverCheck(state);
    return state;
  }

  // ---------- 読み出し ----------
  function allStatuses(state) {
    return state.sensors.map(function (s) { return trapStatus(state, s.id); });
  }

  // 朝のまとめ。「作動」と「不明」は行く。確認済みの「作動なし」だけ行かなくてよい。
  function morningSummary(state) {
    var go = [], stay = [];
    allStatuses(state).forEach(function (st) {
      (st.status === 'ok' ? stay : go).push(st);
    });
    return { go: go, stay: stay };
  }

  function notifications(state) { // 新しい順
    return state.server.notifications.slice().sort(function (a, b) {
      return b.receivedAt - a.receivedAt || b.id - a.id;
    });
  }

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function formatTime(min) {
    var d = new Date(EPOCH + min * 60000);
    return pad(d.getUTCMonth() + 1) + '/' + pad(d.getUTCDate()) + ' ' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes());
  }
  function formatDuration(min) {
    min = Math.round(min);
    if (min < 60) return min + '分';
    var h = Math.floor(min / 60), m = min % 60;
    return h + '時間' + (m ? m + '分' : '');
  }

  return {
    DEFAULT_CONFIG: DEFAULT_CONFIG,
    createState: createState,
    advance: advance,
    advanceToMorning: advanceToMorning,
    fireTrap: fireTrap,
    setSignal: setSignal,
    setBattery: setBattery,
    rearm: rearm,
    setAliveInterval: setAliveInterval,
    deliver: deliver,
    trapStatus: trapStatus,
    allStatuses: allStatuses,
    morningSummary: morningSummary,
    notifications: notifications,
    formatTime: formatTime,
    formatDuration: formatDuration
  };
});
