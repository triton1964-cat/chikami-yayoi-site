/* ==========================================================
   プロジェクト①「男性を赦す」共通スクリプト
   /karma/ と /karma/check/ の両方で読み込む
   ----------------------------------------------------------
   ▼ 公開前にここだけ差し替える
   ========================================================== */
window.KARMA_CONFIG = {
  // LINE公式アカウントの友だち追加URL（例：https://lin.ee/xxxxxxx）
  LINE_URL: '',
  // META Pixel ID（数字のみ）。空なら読み込まない
  META_PIXEL_ID: '',
  // GA4 測定ID（例：G-XXXXXXXXXX）。空なら読み込まない
  GA4_ID: ''
};

/* ---------- 計測タグの読み込み ---------- */
(function () {
  var c = window.KARMA_CONFIG;

  if (c.META_PIXEL_ID) {
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', c.META_PIXEL_ID);
    fbq('track', 'PageView');
  }

  if (c.GA4_ID) {
    var g = document.createElement('script');
    g.async = true;
    g.src = 'https://www.googletagmanager.com/gtag/js?id=' + c.GA4_ID;
    document.head.appendChild(g);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', c.GA4_ID);
  }
})();

/* ---------- イベント送信 ----------
   name  : GA4のイベント名
   meta  : METAの標準イベント名（なければカスタムで送る）
   params: 追加情報（タイプなど）
------------------------------------ */
window.karmaTrack = function (name, meta, params) {
  params = params || {};
  try {
    if (window.gtag) gtag('event', name, params);
    if (window.fbq) {
      if (meta) fbq('track', meta, params);
      else fbq('trackCustom', name, params);
    }
  } catch (e) { /* 計測の失敗で画面を止めない */ }
};

/* ---------- LINE URL（流入元を付与） ---------- */
window.karmaLineUrl = function () {
  var base = window.KARMA_CONFIG.LINE_URL;
  if (!base) return '#line-url-not-set';
  return base;
};

/* ---------- スクロール表示 ---------- */
document.addEventListener('DOMContentLoaded', function () {
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('visible'); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(function (el) { io.observe(el); });
});
