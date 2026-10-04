// 保留 busuanzi PV + Shields 徽标，先显示上次成功数据，再更新本次访问量。
(function () {
  'use strict';
  var img = document.getElementById('hits-badge');
  if (!img) return;
  var key = 'hits-pv:' + location.hostname;
  var version = 0;
  function fallback() {
    if (img.style.display !== 'none') return;
    img.src = img.getAttribute('data-fallback');
    img.style.display = '';
    img.title = '访问量服务暂不可用';
  }

  function show(pv, cached) {
    var current = ++version;
    var src = 'https://img.shields.io/badge/hits-' + encodeURIComponent(pv) + '-blue';
    function load(retry) {
      var probe = new Image();
      probe.onload = function () {
        if (current !== version) return;
        img.src = probe.src;
        img.style.display = '';
        img.title = cached ? '上次成功获取的访问量' : '站点访问量';
      };
      probe.onerror = function () {
        if (!retry && current === version) {
          setTimeout(function () { load(true); }, 1500);
        } else if (current === version) fallback();
      };
      probe.src = src + (retry ? '?retry=' + Date.now() : '');
    }
    load(false);
  }

  function valid(value) {
    return (typeof value === 'number' || typeof value === 'string') &&
      /^\d+$/.test(String(value));
  }
  try {
    var cached = localStorage.getItem(key);
    if (valid(cached)) show(cached, true);
  } catch (_) { /* Safari 隐私模式可能禁止存储，仍请求实时数据。 */ }

  function request(retry) {
    var callback = 'BusuanziCallback_' + Date.now() + '_' + Math.random().toString(36).slice(2);
    var script = document.createElement('script');
    var settled = false;
    var timer;
    function cleanup() {
      settled = true;
      clearTimeout(timer);
      script.remove();
      // 超时响应可能已经在执行队列中，保留空回调防止 ReferenceError。
      window[callback] = function () {};
      setTimeout(function () { delete window[callback]; }, 60000);
    }
    window[callback] = function (data) {
      if (settled) return;
      if (data && valid(data.site_pv)) {
        var pv = String(data.site_pv);
        try { localStorage.setItem(key, pv); } catch (_) {}
        show(pv, false);
      }
      cleanup();
      fallback();
    };
    script.async = true;
    script.src = 'https://busuanzi.ibruce.info/busuanzi?jsonpCallback=' + callback + '&type=site_pv';
    script.onerror = function () {
      if (settled) return;
      cleanup();
      fallback();
      if (!retry) setTimeout(function () { request(true); }, 1500);
    };
    // 超时不自动重计 PV，避免响应迟到时重复累计访问。
    timer = setTimeout(function () { cleanup(); fallback(); }, 20000);
    document.body.appendChild(script);
  }
  request(false);
})();
