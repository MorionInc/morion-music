/* ============================================================
   杜音ミュージック 計測タグ
   ------------------------------------------------------------
   ▼ Google広告の設定後、下の MM_CONFIG を書き換えてください。
     書き換えるまでタグは一切読み込まれません（サイトは正常に動作します）。

   取得方法：
     Google広告 → ツールと設定 → コンバージョン → 「+新しいコンバージョン」
     → ウェブサイト → 手動でコンバージョンアクションを作成
     発行される「AW-000000000」が adsId、「/」以降が labels の値です。
   ============================================================ */
var MM_CONFIG = {
  adsId: 'AW-XXXXXXXXXX',
  labels: {
    book:    'XXXXXXXXXXXXXXXXXXX',  // ミニコンサートのご予約
    contact: 'XXXXXXXXXXXXXXXXXXX',  // 体験レッスン・お問い合わせ
    tel:     'XXXXXXXXXXXXXXXXXXX'   // 電話番号のクリック
  },
  ga4Id: ''                          // 任意。GA4を使う場合のみ 'G-XXXXXXX'
};

(function () {
  'use strict';
  var cfg = MM_CONFIG;
  var unset = function (v) { return !v || v.indexOf('X') !== -1; };
  var live = !unset(cfg.adsId);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  if (live) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(cfg.adsId);
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', cfg.adsId);
    if (cfg.ga4Id && !unset(cfg.ga4Id)) gtag('config', cfg.ga4Id);
  }

  /* コンバージョン送信。未設定でも呼び出し側は同じように書ける。
     done は必ず1回だけ呼ばれる（計測待ちで遷移が止まらないよう1秒で打ち切り）。*/
  window.MM = {
    ready: live,
    conversion: function (kind, done) {
      var called = false;
      var fire = function () { if (!called) { called = true; done && done(); } };
      var label = cfg.labels && cfg.labels[kind];
      if (!live || unset(label)) { fire(); return; }
      gtag('event', 'conversion', {
        send_to: cfg.adsId + '/' + label,
        event_callback: fire
      });
      setTimeout(fire, 1000);
    }
  };

  /* 電話番号のクリックを計測 */
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('a[href^="tel:"]');
    if (a) window.MM.conversion('tel');
  });
})();
