# 体験会 特設ページ アーカイブ

`/concert/` で公開していたイベント特設ページの保管場所です。
GitHub Pages は `.github/` 配下を配信しないため、ここに置いても公開されません。

| ファイル | 内容 |
|---|---|
| `concert-20261012.html` | 2026年10月12日（月・祝）開催版の完全なページ |
| `event-banner.jpg` / `.webp` | ページ内掲載用バナー（10/12版） |
| `event-banner-og.jpg` | OGP用バナー（10/12版） |

## 開催実績

| 回 | 日程 | 参加 | 入会 |
|---|---|---|---|
| 第1回 | 2026/9/21〜23（全6回） | 11名 | 2名 |
| 第2回 | 2026/10/12（全3回） | — | — |

## 復元手順（次回開催時）

1. **ページを戻す**
   ```
   cp .github/archive/concert-20261012.html concert/index.html
   ```

2. **日程を差し替える**（`concert/index.html` 内）
   - `<title>` / `og:title` … 日付
   - `og:description` / `description` … 日付
   - `og:image:alt` … 日付
   - `.hero .badge` … 「◯月◯日（◯）開催」
   - `.hero-cta` の `<small>` … 受付中の時間帯
   - `.sch-item` … 開催日と時間帯（満員表記 `class="full"` は外す）
   - 予約フォームの `<option>` … 日程の選択肢
   - 構造化データ `BreadcrumbList` … 変更不要

3. **バナー画像を差し替える**
   `images/event-banner.jpg` / `.webp` / `event-banner-og.jpg` を新しい日程のものに。
   ※ページ内は情報量の多い版、OGPは文字の大きい版を使う

4. **トップページ（index.html）を戻す**
   - ヘッダー直下の告知バナー（`.concert-banner`）を復活させる
   - `og:image` をイベントバナーに戻す（通常時は教室写真）

5. **sitemap.xml** に `/concert/` を追加し、`lastmod` を更新

6. **Search Console** でインデックス登録をリクエスト

## 注意

- URL `/concert/` は変更しないこと。PR TIMES・チラシ・配架物からのリンクが
  この URL を指しており、変更すると流入が失われます。
- 予約フォームは `js/forms.js` の設定に従います。障害時は Google フォームへ
  切り替わる仕組みが入っています。
