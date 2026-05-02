/**
 * context-menu.js —— 自定义右键菜单。
 *
 * 在内容章节（.content-section）上右键时弹出菜单，
 * 提供"保存章节为图片"功能（通过 html2canvas 截图）。
 * html2canvas 按需懒加载，不阻塞页面初始渲染。
 */
(function () {
  var menu = null;
  var targetSection = null;

  // 构建菜单 DOM（只创建一次）
  function buildMenu() {
    if (menu) return;
    menu = document.createElement('div');
    menu.className = 'custom-context-menu';
    menu.innerHTML = '<div class="custom-context-menu__item" data-action="save-image"></div>';
    document.body.appendChild(menu);

    menu.addEventListener('click', function (e) {
      var action = e.target.getAttribute('data-action');
      if (action === 'save-image') {
        captureSection(targetSection);
      }
      hideMenu();
    });
  }

  // 显示菜单，自动调整位置避免溢出视口
  function showMenu(x, y, title) {
    var item = menu.querySelector('.custom-context-menu__item');
    item.textContent = '保存「' + title + '」为图片';
    var mw = menu.offsetWidth;
    var mh = menu.offsetHeight;
    var vw = window.innerWidth;
    var vh = window.innerHeight;

    if (x + mw > vw) x = vw - mw - 4;
    if (y + mh > vh) y = vh - mh - 4;
    if (x < 0) x = 4;
    if (y < 0) y = 4;

    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    menu.classList.add('visible');
  }

  function hideMenu() {
    if (menu) menu.classList.remove('visible');
  }

  // Canvas 白边填充
  function padCanvas(canvas, padding, bgColor) {
    var w = canvas.width + padding * 2;
    var h = canvas.height + padding * 2;
    var padded = document.createElement('canvas');
    padded.width = w;
    padded.height = h;
    var ctx = padded.getContext('2d');
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(canvas, padding, padding);
    return padded;
  }

  // Canvas 阴影效果
  function addShadow(canvas, blur) {
    var w = canvas.width + blur * 2;
    var h = canvas.height + blur * 2;
    var shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = w;
    shadowCanvas.height = h;
    var ctx = shadowCanvas.getContext('2d');

    ctx.shadowColor = 'rgba(0, 0, 0, 0.20)';
    ctx.shadowBlur = blur;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 1;
    ctx.drawImage(canvas, blur, blur);

    return shadowCanvas;
  }

  // 读取 CSS 自定义属性
  function getCssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  // 从章节中提取标题作为文件名
  function getSectionTitle(el) {
    var heading = el.querySelector('h1, h2, h3, h4, h5, h6');
    if (!heading) return 'section';
    return heading.textContent.replace(/[\\/:*?"<>|]/g, '').trim() || 'section';
  }

  // 截图并下载
  function captureSection(el) {
    var filename = getSectionTitle(el) + '.png';
    var bgColor = getCssVar('--background-color') || '#ffffff';

    loadHtml2Canvas().then(function () {
      html2canvas(el, {
        backgroundColor: bgColor,
        scale: 2,
        useCORS: true,
        logging: false
      }).then(function (canvas) {
        var padded = padCanvas(canvas, 40, bgColor);
        var result = addShadow(padded, 40);
        var link = document.createElement('a');
        link.download = filename;
        link.href = result.toDataURL('image/png');
        link.click();
      });
    });
  }

  // 按需懒加载 html2canvas
  function loadHtml2Canvas() {
    if (window.html2canvas) return Promise.resolve();

    return new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[data-html2canvas]');
      if (existing) {
        existing.addEventListener('load', resolve, { once: true });
        existing.addEventListener('error', reject, { once: true });
        return;
      }

      var script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      script.async = true;
      script.dataset.html2canvas = 'true';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // 初始化：触摸设备跳过，生产环境所有章节均可右键
  document.addEventListener('DOMContentLoaded', function () {
    var isDev = document.body.getAttribute('data-env') === 'development';
    var isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;

    if (isTouch) return;

    buildMenu();

    document.addEventListener('contextmenu', function (e) {
      var section = e.target.closest('.content-section');

      // 开发环境仅允许有章节标题时弹出
      if (isDev) {
        if (!section) return;
      }

      e.preventDefault();

      if (!section) {
        hideMenu();
        return;
      }

      targetSection = section;
      showMenu(e.clientX, e.clientY, getSectionTitle(section));
    });

    document.addEventListener('click', function (e) {
      if (menu && !menu.contains(e.target)) {
        hideMenu();
      }
    });

    document.addEventListener('scroll', hideMenu);
  });
})();
