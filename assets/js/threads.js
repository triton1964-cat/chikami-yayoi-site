/* ==========================================================
   光の糸（アニメーション）
   <div class="art-live" data-kind="ascend|infinity"> の中の <canvas> に描く。
   ・画面に映っているときだけ動く（見えないときは止まる）
   ・「視差効果を減らす」設定の人や、描画できない環境では、中の静止画 <img> をそのまま見せる
   ========================================================== */
(function () {
  if (!('IntersectionObserver' in window) || !window.HTMLCanvasElement) return;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return; // 静止画のまま

  function rng(seed) { return function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }; }

  // ---- 立ちのぼる光 ----
  function makeAscend() {
    var r = rng(7), n = 150, pts = 160, phase = [], wt = [];
    for (var i = 0; i < n; i++) { phase.push(Math.PI * i / n + (r() - .5) * .1); wt.push(.5 + r() * .7); }
    return function (ctx, W, H, T) {
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      var g = ctx.createLinearGradient(0, H, W, 0);
      g.addColorStop(0, '#aeb4dc'); g.addColorStop(.55, '#d9c49a'); g.addColorStop(1, '#e8d3a4');
      ctx.strokeStyle = g; ctx.lineWidth = Math.max(.6, W / 1900);
      function P(t) { return [W * (-.05 + 1.1 * t), H * (.9 - .78 * Math.pow(t, 1.25) + .07 * Math.sin(t * 5.2 + T * .25))]; }
      for (var i = 0; i < n; i++) {
        ctx.globalAlpha = .13 * wt[i];
        ctx.beginPath();
        for (var j = 0; j <= pts; j++) {
          var t = j / pts, a = P(t), b = P(Math.min(1, t + .001));
          var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
          var w = H * (.05 + .15 * Math.pow(Math.sin(Math.PI * t), .8));
          var off = w * Math.cos(1.6 * t * 2 * Math.PI + phase[i] - T * .35);
          var x = a[0] + nx * off, y = a[1] + ny * off;
          if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    };
  }

  // ---- ∞ の循環 ----
  function makeInfinity() {
    var r = rng(11), n = 130, pts = 360, phase = [], wt = [];
    for (var i = 0; i < n; i++) { phase.push(Math.PI * i / n + (r() - .5) * .1); wt.push(.5 + r() * .7); }
    return function (ctx, W, H, T) {
      ctx.clearRect(0, 0, W, H);
      var s = Math.min(W * .40, H * .9);
      function P(t) { var a = 2 * Math.PI * t, d = 1 + Math.pow(Math.sin(a), 2); return [W * .5 + s * Math.cos(a) / d, H * .5 + s * Math.sin(a) * Math.cos(a) / d]; }
      var g = ctx.createLinearGradient(W * .1, 0, W * .9, 0);
      g.addColorStop(0, '#b8986a'); g.addColorStop(.5, '#c89478'); g.addColorStop(1, '#c47690');
      ctx.strokeStyle = g; ctx.lineWidth = Math.max(.6, W / 1500);
      for (var i = 0; i < n; i++) {
        ctx.globalAlpha = .09 * wt[i];
        ctx.beginPath();
        for (var j = 0; j <= pts; j++) {
          var t = j / pts, a = P(t), b = P(t + .0005);
          var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
          var w = s * (.1 + .035 * Math.cos(4 * Math.PI * t));
          var off = w * Math.cos(3 * t * 2 * Math.PI + phase[i] + T * .4);
          var x = a[0] + nx * off, y = a[1] + ny * off;
          if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };
  }

  // ---- 火→水→海：左で揺らめく温かい流れが、右で静かな水平線に還る ----
  function makeFireSea() {
    var r = rng(3), n = 170, pts = 200, ph = [], wt = [], jit = [];
    for (var i = 0; i < n; i++) { ph.push(r()); wt.push(.5 + r() * .7); jit.push((r() - .5) * .6); }
    return function (ctx, W, H, T) {
      ctx.clearRect(0, 0, W, H);
      var g = ctx.createLinearGradient(0, 0, W, 0);
      g.addColorStop(0, '#d9743f'); g.addColorStop(.2, '#d9804f'); g.addColorStop(.5, '#c47690'); g.addColorStop(1, '#6f84b8');
      ctx.strokeStyle = g; ctx.lineWidth = Math.max(.6, W / 1900);
      for (var i = 0; i < n; i++) {
        var k = i / n;
        ctx.globalAlpha = .26 * wt[i] * (.55 + .45 * Math.sin(k * Math.PI));
        ctx.beginPath();
        for (var j = 0; j <= pts; j++) {
          var t = j / pts, calm = Math.pow(t, 1.6), amp = H * .3 * (1 - calm);
          var y = H * (.5 + (k - .5) * (.3 + .55 * calm))
                + amp * Math.sin(t * 9 + k * 3.5 + jit[i] + T * .55) * Math.cos(t * 4 - k * 2 - T * .3);
          var x = W * (-.02 + 1.04 * t);
          if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      // 左右の端をやわらかく消す
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'destination-out';
      var fl = ctx.createLinearGradient(0, 0, W * .06, 0); fl.addColorStop(0, 'rgba(0,0,0,1)'); fl.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = fl; ctx.fillRect(0, 0, W * .06, H);
      var fr = ctx.createLinearGradient(W, 0, W * .92, 0); fr.addColorStop(0, 'rgba(0,0,0,1)'); fr.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = fr; ctx.fillRect(W * .92, 0, W * .08, H);
      ctx.globalCompositeOperation = 'source-over';
    };
  }

  var makers = { ascend: makeAscend, infinity: makeInfinity, firesea: makeFireSea };

  function start(box) {
    var make = makers[box.getAttribute('data-kind')]; if (!make) return;
    var canvas = box.querySelector('canvas'); if (!canvas) return;
    var ctx = canvas.getContext('2d'); if (!ctx) return;
    var draw = make(), W = 0, H = 0, raf = null, visible = false, t0 = performance.now();
    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2), rc = box.getBoundingClientRect();
      W = rc.width; H = rc.height;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(ctx, W, H, (performance.now() - t0) / 1000);
    }
    function frame(now) { draw(ctx, W, H, (now - t0) / 1000); raf = visible ? requestAnimationFrame(frame) : null; }
    box.classList.add('is-live');
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(box); else window.addEventListener('resize', resize);
    new IntersectionObserver(function (e) {
      visible = e[0].isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    }, { rootMargin: '100px 0px' }).observe(box);
    resize();
  }

  function init() { document.querySelectorAll('.art-live').forEach(start); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
