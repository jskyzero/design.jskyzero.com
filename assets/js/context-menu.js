(function () {
  var menu = null;
  var targetSection = null;

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

  function getCssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function getSectionTitle(el) {
    var heading = el.querySelector('h1, h2, h3, h4, h5, h6');
    if (!heading) return 'section';
    return heading.textContent.replace(/[\\/:*?"<>|]/g, '').trim() || 'section';
  }

  function captureSection(el) {
    var filename = getSectionTitle(el) + '.png';
    var bgColor = getCssVar('--background-color') || '#ffffff';

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
  }

  document.addEventListener('DOMContentLoaded', function () {
    var isDev = document.body.getAttribute('data-env') === 'development';

    buildMenu();

    document.addEventListener('contextmenu', function (e) {
      var section = e.target.closest('.content-section');

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

    // 移动端长按触发
    if ('ontouchstart' in window) {
      var touchTimer = null;
      var touchStartX = 0;
      var touchStartY = 0;
      var touchMoved = false;

      document.addEventListener('touchstart', function (e) {
        if (e.touches.length !== 1) return;
        if (isDev) return;
        var section = e.target.closest('.content-section');
        if (!section) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchMoved = false;
        clearTimeout(touchTimer);
        touchTimer = setTimeout(function () {
          if (!touchMoved) {
            targetSection = section;
            showMenu(touchStartX, touchStartY, getSectionTitle(section));
          }
        }, 500);
      }, { passive: true });

      document.addEventListener('touchmove', function () {
        touchMoved = true;
        clearTimeout(touchTimer);
      }, { passive: true });

      document.addEventListener('touchend', function () {
        clearTimeout(touchTimer);
      });
    }
  });
})();
