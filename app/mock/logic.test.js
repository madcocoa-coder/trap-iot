'use strict';
var assert = require('assert');
var L = require('./logic.js');

var passed = 0;
function test(name, fn) {
  fn();
  passed++;
  console.log('ok - ' + name);
}
function fresh() { return L.createState(); }
function st(s, id) { return L.trapStatus(s, id).status; }
function notes(s, type) {
  return s.server.notifications.filter(function (n) { return !type || n.type === type; });
}
function sensor(s, id) { return s.sensors.filter(function (x) { return x.id === id; })[0]; }

test('1. 通常の作動：圏内で作動 → 通知1件、状態は作動、遅延の印なし', function () {
  var s = fresh();
  L.advance(s, 30);
  var at = s.now;
  assert.strictEqual(L.fireTrap(s, 't1'), true);
  assert.strictEqual(notes(s, 'fire').length, 1);
  assert.strictEqual(notes(s).length, 1);
  assert.strictEqual(notes(s)[0].occurredAt, at);
  assert.strictEqual(notes(s)[0].delayed, false);
  assert.strictEqual(st(s, 't1'), 'fired');
  assert.strictEqual(st(s, 't2'), 'ok');
});

test('2. 圏外中の作動：キューに残り、電波が戻ると遅れて届く', function () {
  var s = fresh();
  L.setSignal(s, 't1', false);
  L.advance(s, 10);
  var at = s.now;
  L.fireTrap(s, 't1');
  L.advance(s, 120);
  assert.strictEqual(notes(s).length, 0, '圏外中は通知が出ない');
  assert.ok(sensor(s, 't1').queue.some(function (e) { return e.type === 'fire'; }), 'キューに作動が残る');
  L.setSignal(s, 't1', true);
  assert.strictEqual(sensor(s, 't1').queue.length, 0);
  var f = notes(s, 'fire');
  assert.strictEqual(f.length, 1);
  assert.strictEqual(f[0].occurredAt, at, '発生時刻は作動した時刻');
  assert.strictEqual(f[0].receivedAt, at + 120);
  assert.strictEqual(f[0].delayed, true);
  assert.strictEqual(st(s, 't1'), 'fired');
});

test('3. 生存確認の途絶：不明になり、通知は1回だけ。電波が戻ると確認済みに戻る', function () {
  var s = fresh();
  L.setSignal(s, 't2', false);
  L.advance(s, 540); // 間隔6時間×1.5 = 540分ちょうどはまだ不明ではない
  assert.strictEqual(st(s, 't2'), 'ok');
  assert.strictEqual(notes(s, 'alive_lost').length, 0);
  L.advance(s, 1);
  assert.strictEqual(st(s, 't2'), 'unknown');
  assert.strictEqual(notes(s, 'alive_lost').length, 1);
  L.advance(s, 1000);
  assert.strictEqual(notes(s, 'alive_lost').length, 1, 'さらに進めても増えない');
  assert.strictEqual(st(s, 't2'), 'unknown');
  L.setSignal(s, 't2', true);
  assert.strictEqual(st(s, 't2'), 'ok');
  assert.strictEqual(notes(s, 'alive_lost').length, 1);
  // 他の罠は影響を受けない
  assert.strictEqual(st(s, 't1'), 'ok');
});

test('4. 通知がない＝かかっていない、とは扱わない：圏外で作動した罠は朝のまとめで「行く」', function () {
  var s = fresh();
  L.setSignal(s, 't3', false);
  L.fireTrap(s, 't3');
  assert.strictEqual(notes(s).length, 0);
  var waited = L.advanceToMorning(s, 6);
  assert.strictEqual(waited, 12 * 60);
  assert.strictEqual(L.formatTime(s.now), '11/15 06:00');
  assert.strictEqual(st(s, 't3'), 'unknown');
  var sum = L.morningSummary(s);
  assert.deepStrictEqual(sum.go.map(function (x) { return x.id; }), ['t3']);
  assert.deepStrictEqual(sum.stay.map(function (x) { return x.id; }), ['t1', 't2', 't4']);
});

test('5. 電池低下：10%で通知1回。0%にして時間を進めると不明になる', function () {
  var s = fresh();
  L.setBattery(s, 't4', 10);
  assert.strictEqual(notes(s, 'battery_low').length, 1);
  assert.strictEqual(L.trapStatus(s, 't4').lowBattery, true);
  assert.strictEqual(L.trapStatus(s, 't4').battery, 10);
  assert.strictEqual(st(s, 't4'), 'ok', '電池低下は3状態とは別のフラグ');
  L.setBattery(s, 't4', 10);
  L.setBattery(s, 't4', 5);
  L.advance(s, 400); // 生存確認(電池5%付き)が届いても再通知しない
  assert.strictEqual(notes(s, 'battery_low').length, 1);
  L.setBattery(s, 't4', 0);
  var before = notes(s).length;
  L.advance(s, 10 * 60);
  assert.strictEqual(st(s, 't4'), 'unknown');
  assert.strictEqual(notes(s, 'alive_lost').length, 1);
  assert.strictEqual(notes(s).length, before + 1);
  assert.strictEqual(sensor(s, 't4').queue.length, 0, '電池0%のセンサーは何も出さない');
});

test('6. 二重送信：同じイベントを2回受け取っても通知は1件', function () {
  var s = fresh();
  L.setSignal(s, 't1', false);
  L.fireTrap(s, 't1');
  var copy = sensor(s, 't1').queue.map(function (e) { return Object.assign({}, e); });
  L.setSignal(s, 't1', true);
  assert.strictEqual(notes(s, 'fire').length, 1);
  L.deliver(s, 't1', copy);
  L.deliver(s, 't1', copy);
  assert.strictEqual(notes(s, 'fire').length, 1);
  assert.strictEqual(notes(s).length, 1);
});

test('7. 掛け直し：作動後に掛け直すと確認済みに戻る', function () {
  var s = fresh();
  L.fireTrap(s, 't2');
  assert.strictEqual(st(s, 't2'), 'fired');
  assert.strictEqual(L.rearm(s, 't2'), true);
  assert.strictEqual(st(s, 't2'), 'ok');
  assert.strictEqual(L.morningSummary(s).go.length, 0);
  // 再び作動すれば、新しい通知が1件出る
  L.fireTrap(s, 't2');
  assert.strictEqual(notes(s, 'fire').length, 2);
  assert.strictEqual(st(s, 't2'), 'fired');
});

test('8. 生存確認の間隔を変えると、不明になるまでの時間が変わる', function () {
  var s1 = fresh();
  L.setAliveInterval(s1, 60);
  L.setSignal(s1, 't1', false);
  L.advance(s1, 91); // 60×1.5 = 90分を超えた
  assert.strictEqual(st(s1, 't1'), 'unknown');

  var s6 = fresh();
  L.setSignal(s6, 't1', false);
  L.advance(s6, 91);
  assert.strictEqual(st(s6, 't1'), 'ok');

  var s24 = fresh();
  L.setAliveInterval(s24, 1440);
  L.setSignal(s24, 't1', false);
  L.advance(s24, 24 * 60 + 12 * 60); // 36時間ちょうどまでは不明でない
  assert.strictEqual(st(s24, 't1'), 'ok');
  L.advance(s24, 1);
  assert.strictEqual(st(s24, 't1'), 'unknown');
});

test('補足：生存確認は間隔どおりの回数だけ発生する', function () {
  var s = fresh();
  L.setSignal(s, 't1', false);
  L.advance(s, 24 * 60);
  assert.strictEqual(sensor(s, 't1').queue.length, 4); // 6時間間隔×24時間
  var s1 = fresh();
  L.setAliveInterval(s1, 60);
  L.setSignal(s1, 't1', false);
  L.advance(s1, 5 * 60);
  assert.strictEqual(sensor(s1, 't1').queue.length, 5);
});

test('補足：キューがあふれたら生存確認から捨て、作動イベントは残る', function () {
  var s = fresh();
  L.setAliveInterval(s, 60);
  L.setSignal(s, 't1', false);
  L.fireTrap(s, 't1');
  var at = s.now;
  L.advance(s, 40 * 60);
  var q = sensor(s, 't1').queue;
  assert.strictEqual(q.length, s.config.queueLimit);
  assert.ok(q.some(function (e) { return e.type === 'fire'; }));
  L.setSignal(s, 't1', true);
  var f = notes(s, 'fire');
  assert.strictEqual(f.length, 1);
  assert.strictEqual(f[0].occurredAt, at);
  assert.strictEqual(st(s, 't1'), 'fired');
});

test('補足：圏外で溜まった生存確認が戻った時に届けば確認済みに戻り、遅れた電池低下は遅延表示', function () {
  var s = fresh();
  L.setSignal(s, 't1', false);
  L.setBattery(s, 't1', 15);
  L.advance(s, 60);
  assert.strictEqual(notes(s, 'battery_low').length, 0);
  L.setSignal(s, 't1', true);
  var n = notes(s, 'battery_low');
  assert.strictEqual(n.length, 1);
  assert.strictEqual(n[0].delayed, true);
});

console.log('\n' + passed + ' tests passed');
