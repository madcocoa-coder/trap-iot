# 調査の出発点（要再確認）

プロジェクト開始前の下調べで見つかった情報。2026-11-14 に検索で確認した範囲。
資料の作成時期が古いものがあり、価格や実績は変わっている可能性がある。
フェーズ0の机上調査では、ここを起点に公式情報で再確認すること。事実として扱わない。

## 既存の捕獲通知製品

| 製品 | 会社 | 通信 | 費用（資料記載） | メモ | 出典 |
|---|---|---|---|---|---|
| ほかパト | アイエスイー（三重県伊勢市） | 150MHz帯LPWA。親機・子機・中継機 | 初期は要問い合わせ。親機 月2,000円（税別）、子機はランニングなし | 46都道府県、親機320台以上、子機7,300台以上。子機にGPS、地図表示。資料は令和6年4月作成 | https://www.maff.go.jp/j/seisan/tyozyu/higai/kikijouhou/attach/pdf/kikijouhou-115.pdf |
| スマートトラップ | huntech（東京都目黒区） | 基地局工事不要（方式は要確認） | 本体33,800円/台、月980円/台（税抜、通信料込み） | 捕獲記録、帳票の自動作成 | https://www.maff.go.jp/j/seisan/tyozyu/higai/kikijouhou/attach/pdf/kikijouhou-140.pdf |
| マタギっ娘 | マクセルフロンティア | LPWA（ZETA）。基地局・中継器・検知ボックス | 基地局298,200円、中継器36,200〜75,200円、検知ボックス31,200円。月額は台あたり500〜1,000円（税抜、購入数で変動） | メッシュ中継。特定小電力で免許不要 | https://www.maff.go.jp/j/seisan/tyozyu/higai/kikijouhou/attach/pdf/kikijouhou-102.pdf |
| ICTハンティング装置 | エナジーワイヤレス（東京） | LPWA、多段中継 | 加速度タグ5.8万円、赤外線タグ6.5万円、中継器33万円。20台ライセンス月4,500円 | 磁気と赤外線の併用で空はじきを判別 | https://www.maff.go.jp/j/seisan/tyozyu/higai/kikijouhou/attach/pdf/kikijouhou-109.pdf |
| オリワナシステム | フォレストシー | 要確認 | 要確認 | 国有林（静岡県浜松市）の実証で使用 | https://www.rinya.maff.go.jp/j/gyoumu/gijutu/kenkyu_happyo/attach/pdf/R3_happyo-7.pdf |
| ワナの番人 | 要確認 | 要確認 | 要確認 | 山口県光市・山口市で導入事例 | https://www.pref.yamaguchi.lg.jp/uploaded/attachment/119285.pdf |
| かかった（Kagatta） | 要確認（販売：イノホイ） | 要確認 | 要確認 | 単三電池6本で約3ヶ月と記載 | https://inohoi.jp/products/kagatta |

農林水産省が鳥獣被害対策の機器情報を製品ごとに公開している（上の maff.go.jp のPDF群）。
一覧ページを探して、未掲載の製品を洗い出すこと。

## 分かっている論点

- 行政指導：静岡県など一部の都道府県は、通知システムの有無にかかわらず原則毎日の見回りを指導している。
  埼玉県の扱いは未確認。
  https://www.rinya.maff.go.jp/kanto/gizyutu/kouryuuhappyoukai/attach/pdf/20230331-134.pdf
- 効果：同じ国有林の実証で、通知ありの班は見回り総時間が94%少なかった（56.8時間に対して3.4時間）。
  https://www.rinya.maff.go.jp/j/gyoumu/gijutu/kenkyu_happyo/attach/pdf/R3_happyo-15.pdf
- 効果：栃木県の実証では、見回りが毎日から3日に1回程度になった。一方、通信環境が悪く捕獲できない期間もあった。
  https://www.pref.tochigi.lg.jp/d04/documents/20251216145549.pdf
- 不満：従来型（携帯回線＋磁石センサー）の課題として、携帯の圏内でしか使えないこと、
  空はじきでも通知が来て無駄足になること、が挙げられている。
  https://www.rinya.maff.go.jp/chubu/gijyutu/siryousitu/attach/pdf/chubu01-161.pdf
- 買い手：ほかパトの購入者は、自治体や猟友会などの団体とされている。個人猟師への販売状況は未確認。
  https://smartisland.mlit.go.jp/wp-data/wp-content/uploads/2024/07/70-72.pdf
- 補助金：国の鳥獣被害防止総合対策交付金に、ICTを使った捕獲のモデル地区を支援する事業がある。
  対象要件は未確認。
  https://www.soumu.go.jp/main_content/000994699.pdf

## まだ調べていないこと

- 個人猟師向けの低価格品、自作事例、海外製品
- 各製品に対する利用者の不満（一次の声）
- 埼玉県・小鹿野町の行政指導、鳥獣被害防止計画、補助制度
- 通信方式ごとの1台あたりコスト（LTE-M、LoRa、Sigfox、衛星など）
