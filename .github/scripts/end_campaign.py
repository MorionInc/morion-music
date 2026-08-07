#!/usr/bin/env python3
"""チェロ体験レッスン無料キャンペーン終了時に通常料金へ戻すスクリプト。
2026-09-01 に GitHub Actions から自動実行される。冪等（何度実行しても安全）。"""
import sys, pathlib

root = pathlib.Path(__file__).resolve().parents[2]
idx = root / 'index.html'
llms = root / 'llms.txt'
s = idx.read_text(encoding='utf-8')
t = llms.read_text(encoding='utf-8')
orig_s, orig_t = s, t

REPL_HTML = [
    # 料金表（チェロ）
    ('<tr><th>体験レッスン</th><td><strong style="color:#c0392b">無料</strong>'
     '<span style="font-size:.85em;color:#c0392b">（8月31日受講分まで）</span>'
     '<br><span style="font-size:.85em;color:#777">※通常2,750円 ／ 1回</span></td></tr>',
     '<tr><th>体験レッスン</th><td>2,750円 ／ 1回</td></tr>'),
    # 料金注釈
    ('<span>※ チェロ・コースの体験レッスンは</span><span>2026年8月31日ご受講分まで無料です。</span><span>（ヴァイオリン・ヴィオラは2,750円）</span><br>',
     ''),
    # リード文
    ('<strong>2026年8月31日ご受講分まで、チェロ・コースの体験レッスンを無料で受けていただけます。</strong>',
     ''),
    # ヒーローのバッジ
    ('<span>チェロ体験レッスン無料</span>', '<span>体験レッスンあり</span>'),
    # FAQ表示
    ('<div class="answer">はい、体験レッスンをご用意しています。チェロ・コースは2026年8月31日ご受講分まで無料キャンペーン中です（ヴァイオリン・ヴィオラ・コースは2,750円・税込／1回）。「自分にもできるかな？」という段階のご相談も大歓迎です。まずはお気軽にお問い合わせください。</div>',
     '<div class="answer">はい、体験レッスン（2,750円・税込／1回）をご用意しています。「自分にもできるかな？」という段階のご相談も大歓迎です。まずはお気軽にお問い合わせください。</div>'),
    # FAQ構造化データ
    ('"text": "はい、体験レッスンをご用意しています。チェロ・コースは2026年8月31日ご受講分まで無料キャンペーン中です。ヴァイオリン・ヴィオラ・コースは2,750円（税込・1回）です。まずはお気軽にお問い合わせください。"',
     '"text": "はい、体験レッスン（2,750円・税込／1回）をご用意しています。まずはお気軽にお問い合わせください。"'),
    # 事業構造化データ description
    ('チェロ・コースの体験レッスンは2026年8月31日受講分まで無料。', '体験レッスンあり。'),
    # 体験レッスンOffer（2つを1つに戻す）
    ('''      {
        "@type": "Offer",
        "name": "体験レッスン（チェロ・コース）",
        "price": "0",
        "priceCurrency": "JPY",
        "validThrough": "2026-08-31",
        "description": "チェロ・コースの体験レッスンは2026年8月31日ご受講分まで無料キャンペーン中です。通常価格は2,750円（税込）。"
      },
      {
        "@type": "Offer",
        "name": "体験レッスン（ヴァイオリン・ヴィオラ・コース）",
        "price": "2750",
        "priceCurrency": "JPY",
        "description": "1回のみの体験レッスン。未経験の方も歓迎です。"
      },''',
     '''      {
        "@type": "Offer",
        "name": "体験レッスン",
        "price": "2750",
        "priceCurrency": "JPY",
        "description": "1回のみの体験レッスン。未経験の方も歓迎です。"
      },'''),
    # meta description / OGP
    ('チェロ体験レッスンが8/31まで無料！仙台市青葉区のチェロ・バイオリン・ビオラ教室。大人の初心者・3歳から70代まで歓迎、生徒の大半が未経験スタートです。',
     '仙台市青葉区のチェロ・バイオリン・ビオラ教室。大人の初心者・3歳から70代まで歓迎、生徒の大半が未経験スタートです。体験レッスン2,750円。'),
    ('チェロ体験レッスンが8/31まで無料！仙台市青葉区のチェロ・バイオリン・ビオラ教室。大人の初心者も3歳のお子さまも歓迎。',
     '仙台市青葉区のチェロ・バイオリン・ビオラ教室。大人の初心者も3歳のお子さまも歓迎。体験レッスンあり。'),
    # タイトル
    ('<title>【無料体験】仙台のチェロ・バイオリン教室｜杜音ミュージック</title>',
     '<title>仙台のチェロ・バイオリン教室｜杜音ミュージック【初心者歓迎】</title>'),
    ('<meta property="og:title" content="【無料体験】仙台のチェロ・バイオリン教室｜杜音ミュージック">',
     '<meta property="og:title" content="仙台のチェロ・バイオリン教室｜杜音ミュージック【初心者歓迎】">'),
]

REPL_LLMS = [
    ('チェロ・コースの体験レッスンは2026年8月31日ご受講分まで無料キャンペーン中。', ''),
    ('\n  ※ チェロ・コースの体験レッスンは2026年8月31日ご受講分まで無料キャンペーン中です（ヴァイオリン・ヴィオラ・コースは2,750円）。', ''),
]

for old, new in REPL_HTML:
    if old in s:
        s = s.replace(old, new)
for old, new in REPL_LLMS:
    if old in t:
        t = t.replace(old, new)

if s == orig_s and t == orig_t:
    print('NO_CHANGE: キャンペーン表記は既に解除済みです')
    sys.exit(0)

# JSON-LD の妥当性チェック（壊れた状態で公開しない）
import re, json
for b in re.findall(r'<script type="application/ld\+json">(.*?)</script>', s, re.S):
    json.loads(b)

idx.write_text(s, encoding='utf-8')
llms.write_text(t, encoding='utf-8')
print('CHANGED: 通常料金の表記に戻しました')
