# 02 代替手段（フェーズ0 机上調査 B）

確認日：2026-11-14（依頼どおりの表記）

## 重要な制約（最初に読むこと）

この調査セッションでは、WebFetch がすべて名前解決エラーで失敗した。
失敗したホスト：inohoi.jp、wiki.heltec.org、www.pref.saitama.lg.jp、www.maff.go.jp。
Bash でのプロキシ状態確認は権限で拒否され、回避は試していない。
そのため、**URL を実際に開いて内容を確かめることは1件もできていない**。
以下の情報はすべて WebSearch の結果要約（検索エンジン側の要約文）に由来する。
区分は次のとおり使う。

- 【検索要約】：検索結果の要約に書かれていたこと。ページ本文は未確認。
- 【推定】：根拠と計算を示したもの。
- 【未確認】：見つからなかった、または確かめられなかったもの。

PMの手元で、または inohoi.jp / maff.go.jp / wiki.heltec.org / pref.saitama.lg.jp を許可した
セッションで、下の「要再確認URL」を開いて値を確定させる必要がある。
完了条件のうち「URLは実際に開いて確かめたものだけ」を満たせないため、URLは「検索結果に出たURL（未オープン）」として書く。

## (1) 要点

1. 個人が買える低価格品の候補として、イノホイ（inohoi.jp）の振動センサー「アイホスエコ（Ihos Eco）」が検索に出た。
   LINE通知、購入当日から使える、と要約されている。価格・通信方式・月額・技適は【未確認】。
   同社の「kagatta」は法人・自治体限定の記載があり、価格は69,000円（検索要約）。seed の「個人が買えるか」の答えは、kagatta は個人不可の可能性が高い。
2. 日本語の罠通知の自作事例は、今回の検索では見つからなかった（検索語は(4)）。
   見つかったのは海外の類似例（Heltec LoRaHunt、Meshtastic ポッサム罠）のみ。
   LoRaHunt は罠の目視点検義務の代替を想定し、生存確認ping・途絶アラート・電池切れ警告を持つ（検索要約）。
   Heltec の公式 wiki 自体が製品の販促ページである点に注意（日本での技適・920MHz運用は未確認）。
3. 海外の罠通知製品（Skyhawk Trapmate/Kiwi、TrapSmart、MinkPolice、WCS Tele-Trap、Econode SmartTrap）は存在する。
   いずれも日本での技適・対応バンドは【未確認】。携帯回線型は日本の周波数・SIMで動く保証がない。
4. 通信トレイルカメラは、国内で TREL シリーズ（イノホイ取扱い。docomo/KDDI/SoftBank対応、メール送信、SMSで遠隔設定）が確認できた（検索要約）。
   SIM代は月500円前後からの例あり（ipros掲載の製品ページ要約）。本体価格・電池寿命・圏外挙動・罠監視の猟師事例は今回【未確認】。
5. 通信カメラによる罠1基あたりのコストは、本体価格が取れていないため確定できない。
   (3)に計算式と、仮定値を明示した試算を置いた（仮定値は事実ではない）。

## (2) 種類ごとの一覧

### 種類1：個人向けの低価格な捕獲通知品

代表例が3件取れていない（価格が確認できたのは1件、それも法人限定の可能性が高い）。

| 製品 | 会社/販売 | 内容（【検索要約】） | 価格 | 通信/月額/技適 | 出典（未オープン） |
|---|---|---|---|---|---|
| アイホスエコ（Ihos Eco） | イノホイ | 罠に付ける振動センサー。LINEで通知。購入当日から使える | 【未確認】 | 【未確認】 | https://inohoi.jp/products/ihoseco |
| kagatta | イノホイ | 罠の振動をメールで通知。販売ページに法人・自治体限定の記載 | 69,000円 | 【未確認】（seed では単三6本で約3か月） | https://inohoi.jp/products/kagatta |
| 通販（Amazon、楽天、狩猟用品店）の汎用品 | － | 今回【見つからなかった】 | － | － | － |

補足：同じ検索で、huntech スマートトラップが「2017年発売時 本体79,800円＋月2,980円（税抜）」と出た。
seed は「33,800円＋月980円」としており食い違う。年代差の可能性があり、担当Aの再確認に回す（本件は専用品なので私の範囲外）。
補足：イノホイの他の商品ページ（https://inohoi.jp/collections/wana-sensor、https://inohoi.jp/collections/wana-choise/ メーカー直送）は検索に出たが未オープン。

### 種類2：自作事例

日本語の罠通知の自作事例：3件見つからなかった（0件）。

| 事例 | 内容（【検索要約】） | 費用 | 続いているか | 作者の課題 | 出典（未オープン） |
|---|---|---|---|---|---|
| Heltec LoRaHunt | WiFi LoRa 32 V3、磁気スイッチで起床、18650を4本で最大3か月見込み、基地局がWhatsApp/メール通知、ping、途絶・電池切れアラート | 【未確認】 | 【未確認】（製品販促ページの可能性） | 【未確認】 | https://wiki.heltec.org/news/LoRaHunt/LoRaHunt |
| Meshtastic ポッサム罠（Norman Jester） | ラズパイ＋LoRaをMeshtasticに接続、小型動物用ケージ罠 | 【未確認】 | 【未確認】 | 【未確認】 | https://www.hackster.io/news/norman-jester-s-meshtastic-possum-trap-keeps-the-critters-caged-for-as-little-as-possible-7632991ee116 |
| スマートIoTネズミ捕り（sdjmchattie） | 人道的ネズミ捕り器のIoT化 | 【未確認】 | 【未確認】 | 【未確認】 | https://sdjmchattie.github.io/posts/2025/02/15/making-my-humane-mouse-trap-smart |

上の3件は猟（くくり罠・箱罠）ではなく、小動物罠の例。日本の狩猟の参考としては弱い。
Qiita、note、YouTube、同人ハード（BOOTH等）は検索に出てこなかった。検索が不十分の可能性がある。

### 種類3：海外の罠通知製品

| 製品 | 内容（【検索要約】） | 価格 | 通信 | 日本で使えるか | 出典（未オープン） |
|---|---|---|---|---|---|
| Skyhawk Trapmate / Kiwi | 加速度＋リードスイッチ。Kiwi はセルラー一体型、Hub版はセンサー→ハブ→セルラー | 【未確認】 | 2G/3G/4G等（詳細未確認） | 技適・対応バンド【未確認】 | https://livetrap.com/skyhawk-kiwi-remote-trap-monitoring-system.html |
| TrapSmart | クリップが外れて作動を検知、SMS/メール、2時間ごと再通知。くくり罠にも付く旨 | 【未確認】 | 携帯回線 | 【未確認】 | https://www.domyown.com/trapsmart-starter-kit-p-4082.html |
| Tomahawk 系（ゲートウェイ＋センサー） | ゲートウェイ約250ドル、センサー1台約200ドル（古い販売ページの記載と要約） | 約250ドル＋200ドル/台（時期不明） | 【未確認】 | 【未確認】 | 出典URLは検索結果から特定できず、【未確認】 |
| MinkPolice | 機械的動作のある罠に付く。アプリ通知、2G/3G/4G | 【未確認】 | 2G/3G/4G | 【未確認】 | https://predatorfreenz.org/resources/recording-monitoring-options/remote-monitoring-traps/ |
| Econode SmartTrap | LoRaWAN方式 | 【未確認】 | LoRaWAN | 【未確認】 | 同上 |

信頼性の研究（【検索要約】）：Biological Invasions 2021 の研究で、セルラー罠モニターの通知遅延は3分以内、
圏外・罠の損傷・網の一時障害で失敗した例があったが、システムメッセージで気づけた。
https://link.springer.com/article/10.1007/s10530-021-02713-2（未オープン）
日本の技適、対応バンドはいずれの製品も確認できていない。技適表示のない無線機は国内で使えない（電波法）。この点の確認は担当Dの範囲と重なる。

### 種類4：通信機能付きトレイルカメラ

| 項目 | 値（【検索要約】） | 出典（未オープン） |
|---|---|---|
| 国内の代表機種 | TREL シリーズ（trel camera 4g r、4g h、3g h など）。イノホイ取扱い。メール送信、SMSで遠隔設定、docomo/KDDI/SoftBank | https://inohoi.jp/products/trel-camera-4g-r 、https://inohoi.jp/products/trel-camera-4g-h 、https://gigaplus.makeshop.jp/gishop/catalog/trel3g-h_cj.pdf |
| 本体価格 | 【未確認】 | － |
| SIM・月額 | 「通信費(SIM)は500円〜/月」という製品情報あり（機種は特定できず、ipros掲載ページの要約） | https://www.ipros.com/product/detail/2000557177 |
| 電池寿命 | 【未確認】 | － |
| 圏外時の挙動 | 【未確認】 | － |
| 技適 | 【未確認】 | － |
| 猟師が罠監視に使う事例 | 農水省資料に「あいわなクラウド」（写真をAIで獣種判定、メール通知、箱わな・くくりわな対象）。日本遮蔽技研の出没警報（メール）。実際の猟師の運用事例（ブログ・SNS）は【未確認】 | https://www.maff.go.jp/j/seisan/tyozyu/higai/kikijouhou/attach/pdf/kikijouhou-161.pdf 、https://www.maff.go.jp/j/seisan/tyozyu/higai/kikijouhou/attach/pdf/kikijouhou-99.pdf |

注：トレイルカメラは「動物が前を通る」で撮影するため、「罠が作動したか」ではなく「そこに何かいたか」の情報になる（推定。メーカー資料では未確認）。
くくり罠では足が掛かった動物が画角に入る位置に据える必要があるかもしれない（推定）。

## (3) 罠1基あたりの初期費用と月額（通信トレイルカメラ）

本体価格を取得できなかったため、結論は出せない。式と、仮定値を置いた試算を示す。仮定値は事実ではない。

式：
- 初期費用/基 ＝ カメラ本体価格 ＋ SIM初期費用 ＋ 電池・SDカード ＋ 取付金具 ＋ 防護（カバー等）
- 月額/基 ＝ SIM（データ）料金。1台1回線とする。

前提：
- 罠1基につき1台のカメラを置く（くくり罠・箱罠とも）。カメラを複数罠で共用する運用は別途。
- SIM月額：500円（検索要約にある「500円〜/月」を採用。ipros掲載ページの値であり、送信枚数での増減は未確認）。
- カメラ本体：【未確認】。感度分析として2万円・3万円・5万円を仮置きする（根拠なし。実価格を確認次第差し替え）。
- 電池・SD等：3,000円と仮置き（根拠なし）。

| 仮定の本体価格 | 初期費用/基（仮定） | 月額/基 | 12か月の総額/基（推定） |
|---|---|---|---|
| 20,000円 | 23,000円 | 500円 | 29,000円 |
| 30,000円 | 33,000円 | 500円 | 39,000円 |
| 50,000円 | 53,000円 | 500円 | 59,000円 |

目安（初期2万円台・月額500円前後）と比べると、月額は同水準に収まりうる。初期費用は、本体が2万円以下でない限り超える（上の仮定が正しければ）。
実際の本体価格が分かるまで、この比較は確定しない。

## (4) 試した検索語

- 罠 捕獲通知 くくり罠 センサー 通販 個人 購入
- くくり罠 通知 自作 Raspberry Pi OR ESP32 OR LoRa 見回り
- トレイルカメラ 通信 SIM 罠 見回り 箱罠 くくり罠 スマホ 通知
- trap alert sensor snare cellular notification product trap monitor

未実施（セッション制約で時間を使い切った、またはホスト不許可のため）：
Amazon・楽天の個別検索、Qiita/note/YouTube/BOOTH、TREL本体価格、Browning・Spypoint・Reolink 等の海外機の技適、猟師ブログの罠カメラ運用、
圏外時の挙動（「圏外 保存 SDカード 再送」）、電池寿命。

## 要再確認URL（許可があれば最初に開く）

- https://inohoi.jp/products/ihoseco 、https://inohoi.jp/products/kagatta 、https://inohoi.jp/collections/camera 、https://inohoi.jp/products/trel-camera-4g-r
- https://wiki.heltec.org/news/LoRaHunt/LoRaHunt
- https://www.pref.saitama.lg.jp/documents/213537/jirei_4.pdf（埼玉県の事例資料。捕獲通知機器が載っている可能性があり、担当C・Dにも有用）
- https://www.maff.go.jp/j/seisan/tyozyu/higai/kikijouhou/attach/pdf/kikijouhou-161.pdf 、kikijouhou-99.pdf
