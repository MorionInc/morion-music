/* ============================================================
   杜音ミュージック フォーム切替設定
   ------------------------------------------------------------
   フォーム配信サービス（formsubmit.co）に障害が起きたとき、
   Googleフォームへ切り替えるための設定です。

   ▼ 切り替え手順（mode を書き換えるだけ）
     'auto'   … 通常。サイト内のフォームで送信し、失敗したら代替手段を案内
     'google' … サイト内のフォームを隠し、Googleフォームを表示する

   ▼ Googleフォームを使う前に、下の google.book / google.contact に
     フォームのURL（/viewform で終わるもの）を貼ってください。
     URLが空のままだと 'google' にしても切り替わりません。
   ============================================================ */
var FORM_CONFIG = {
  mode: 'auto',
  google: {
    book:    '',   // 体験会のご予約フォーム
    contact: ''    // お問い合わせフォーム
  },
  mailTo: 'studio@morionviolin.com',
  tel:    '050-1125-2898'
};

(function () {
  'use strict';
  var cfg = FORM_CONFIG;

  function telHref(){ return 'tel:' + cfg.tel.replace(/-/g, ''); }

  /* 入力済みの内容をメール本文に引き継ぐ */
  function mailHref(form, subject) {
    var lines = [];
    form.querySelectorAll('input,select,textarea').forEach(function (el) {
      if (!el.name || el.name.charAt(0) === '_' || !el.value) return;
      lines.push(el.name + '：' + el.value);
    });
    var body = lines.join('\n') + '\n\n---\n（フォームが不調のため、メールでお送りしています）';
    return 'mailto:' + cfg.mailTo
      + '?subject=' + encodeURIComponent(subject)
      + '&body=' + encodeURIComponent(body);
  }

  /* 送信に失敗したときの案内。Googleフォームが設定されていれば最優先で出す */
  window.showFallback = function (statusEl, form, subject, kind) {
    var g = cfg.google[kind];
    var btns = '';
    if (g) {
      btns += '<a class="fb-btn" href="' + g + '" target="_blank" rel="noopener">'
           +  'Googleフォームで送る</a>';
    }
    btns += '<a class="fb-btn' + (g ? ' fb-sub' : '') + '" href="' + mailHref(form, subject) + '">'
         +  '入力内容をメールで送る</a>'
         +  '<a class="fb-btn fb-tel" href="' + telHref() + '">電話する ' + cfg.tel + '</a>';

    statusEl.innerHTML =
      '<strong>送信できませんでした。</strong><br>'
      + 'ご利用のフォーム配信システムに障害が発生しています。<br>'
      + 'お手数ですが、下記のいずれかでご連絡ください。入力内容は引き継がれます。'
      + '<span class="fb-actions">' + btns + '</span>';
  };

  /* mode:'google' のとき、サイト内フォームを隠してGoogleフォームに差し替える */
  window.applyFormMode = function (formId, wrapEl, kind, heading) {
    if (cfg.mode !== 'google') return false;
    var url = cfg.google[kind];
    if (!url) { console.warn('[forms] GoogleフォームのURLが未設定のため切り替えません'); return false; }
    var embed = url.replace(/\/viewform.*$/, '/viewform?embedded=true');
    wrapEl.innerHTML =
      '<p class="gf-note">' + (heading || 'ただいまフォームを切り替えて運用しています。') + '</p>'
      + '<iframe class="gf-frame" src="' + embed + '" loading="lazy" title="お申し込みフォーム">読み込んでいます…</iframe>'
      + '<p class="gf-note"><a href="' + url + '" target="_blank" rel="noopener">別画面で開く</a>'
      + '　／　お電話：<a href="' + telHref() + '">' + cfg.tel + '</a></p>';
    return true;
  };
})();
