/**
 * layout.js —— 全局布局交互逻辑。
 *
 * 包含：侧栏开关、TOC 侧栏显隐、当前标题高亮、
 * TOC 溢出检测与滚动、内联目录分/换行、移动端头部隐藏、
 * 光标拖尾 canvas 动画。
 */
function setSidebarOpen(open) {
  const sidebar = document.getElementById('sidebar');
  const toggles = document.querySelectorAll('[aria-controls="sidebar"]');
  if (!sidebar) return;

  sidebar.classList.toggle('open', open);
  document.body.classList.toggle('sidebar-open', open);
  toggles.forEach((toggle) => toggle.setAttribute('aria-expanded', String(open)));
}

// ------------------------------------------------------------------
// 侧栏开关：按钮点击、关闭按钮、ESC 键
// ------------------------------------------------------------------
function initSidebar() {
  document.querySelectorAll('[aria-controls="sidebar"]').forEach((button) => {
    button.addEventListener('click', () => {
      const sidebar = document.getElementById('sidebar');
      setSidebarOpen(!sidebar.classList.contains('open'));
    });
  });

  document.querySelectorAll('[data-sidebar-close]').forEach((element) => {
    element.addEventListener('click', () => setSidebarOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setSidebarOpen(false);
  });
}

// ------------------------------------------------------------------
// TOC 侧栏显隐：内联目录滚出视野时显示右侧大纲
// ------------------------------------------------------------------
function initTocSidebar(scheduleOverflow) {
  const inlineToc = document.getElementById('toc-inline');
  const sidebarToc = document.getElementById('toc-sidebar');
  if (!inlineToc || !sidebarToc) return;

  // 无 h1 的页面内联目录隐藏，直接显示侧栏大纲
  if (inlineToc.hidden) {
    sidebarToc.classList.add('visible');
    sidebarToc.setAttribute('aria-hidden', 'false');
    if (scheduleOverflow) scheduleOverflow();
    return;
  }

  if (!window.IntersectionObserver) return;

  const observer = new IntersectionObserver((entries) => {
    const visible = entries[0].isIntersecting;
    sidebarToc.classList.toggle('visible', !visible);
    sidebarToc.setAttribute('aria-hidden', String(visible));
    if (!visible && scheduleOverflow) scheduleOverflow();
  }, { threshold: 0 });

  observer.observe(inlineToc);
}

// ------------------------------------------------------------------
// 当前标题高亮：根据阅读位置标记活跃标题
// ------------------------------------------------------------------
function initTocActiveHeading() {
  const sidebarToc = document.getElementById('toc-sidebar');
  if (!sidebarToc || !window.IntersectionObserver) return;

  const links = Array.from(sidebarToc.querySelectorAll('.toc-nav a[href^="#"]'));
  const headings = links
    .map((link) => document.getElementById(decodeURIComponent(link.getAttribute('href').slice(1))))
    .filter(Boolean);
  if (!headings.length) return;

  function setActive(id) {
    links.forEach((link) => {
      link.classList.toggle('active', decodeURIComponent(link.getAttribute('href').slice(1)) === id);
    });
  }

  const observer = new IntersectionObserver((entries) => {
    // 选取最接近阅读位置的首个可见标题作为当前项
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
    if (visible) setActive(visible.target.id);
  }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

  headings.forEach((heading) => observer.observe(heading));
  setActive(headings[0].id);
}

// ------------------------------------------------------------------
// TOC 溢出检测：大纲过长时切换紧凑布局模式
// ------------------------------------------------------------------
function initTocOverflow() {
  const sidebarToc = document.getElementById('toc-sidebar');
  if (!sidebarToc) return;

  var scheduled = false;

  function updateOverflow() {
    scheduled = false;
    const wasOverflowing = sidebarToc.classList.contains('toc-sidebar--overflowing');

    sidebarToc.classList.remove('toc-sidebar--overflowing');
    const shouldOverflow = sidebarToc.scrollHeight > sidebarToc.clientHeight + 1;
    sidebarToc.classList.toggle('toc-sidebar--overflowing', shouldOverflow);

    if (wasOverflowing !== shouldOverflow) {
      sidebarToc.scrollTop = Math.min(sidebarToc.scrollTop, sidebarToc.scrollHeight);
    }
  }

  function scheduleUpdateOverflow() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(updateOverflow);
  }

  scheduleUpdateOverflow();
  window.addEventListener('resize', scheduleUpdateOverflow);

  if (window.ResizeObserver) {
    new ResizeObserver(scheduleUpdateOverflow).observe(sidebarToc);

    const nav = sidebarToc.querySelector('.toc-nav');
    if (nav) {
      new ResizeObserver(scheduleUpdateOverflow).observe(nav);
    }
  }

  return scheduleUpdateOverflow;
}

// ------------------------------------------------------------------
// 自动滚动：保持当前高亮项在大纲可见区域内
// ------------------------------------------------------------------
function initTocActiveVisibility() {
  const sidebarToc = document.getElementById('toc-sidebar');
  if (!sidebarToc || !window.MutationObserver) return;

  var scrolling = false;

  function keepActiveVisible() {
    if (scrolling) return;
    const active = sidebarToc.querySelector('.toc-nav a.active');
    if (!active || !sidebarToc.classList.contains('toc-sidebar--overflowing')) return;

    const sidebarRect = sidebarToc.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    const topGap = 32;
    const bottomGap = 32;

    if (activeRect.top < sidebarRect.top + topGap) {
      scrolling = true;
      sidebarToc.scrollBy({ top: activeRect.top - sidebarRect.top - topGap, behavior: 'instant' });
      requestAnimationFrame(function () { scrolling = false; });
    } else if (activeRect.bottom > sidebarRect.bottom - bottomGap) {
      scrolling = true;
      sidebarToc.scrollBy({ top: activeRect.bottom - sidebarRect.bottom + bottomGap, behavior: 'instant' });
      requestAnimationFrame(function () { scrolling = false; });
    }
  }

  const observer = new MutationObserver(keepActiveVisible);
  sidebarToc.querySelectorAll('.toc-nav a').forEach((link) => {
    observer.observe(link, { attributes: true, attributeFilter: ['class'] });
  });
}

// ------------------------------------------------------------------
// 内联 TOC 一级标题按 "/" 换行（中文竖排效果）
// ------------------------------------------------------------------
function formatInlineTocRootBreaks() {
  document.querySelectorAll('#toc-inline .toc-nav > ul > li > a').forEach((link) => {
    const text = link.textContent;
    if (!text || !text.includes('/')) return;

    link.setAttribute('aria-label', text);
    link.textContent = '';

    text.split('/').forEach((part, index, parts) => {
      if (part) link.appendChild(document.createTextNode(part.trim()));
      if (index !== parts.length - 1) link.appendChild(document.createElement('br'));
    });
  });
}

// ------------------------------------------------------------------
// 移动端顶部导航：向下滚动隐藏、向上滚动显示
// ------------------------------------------------------------------
function initMobileHeader() {
  const header = document.querySelector('header');
  if (!header) return;

  const media = window.matchMedia('(max-width: 900px)');
  let lastScrollY = window.scrollY;

  function update() {
    if (!media.matches || document.body.classList.contains('sidebar-open')) {
      header.classList.remove('header-hidden');
      lastScrollY = window.scrollY;
      return;
    }

    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > lastScrollY;
    header.classList.toggle('header-hidden', scrollingDown && currentScrollY > header.offsetHeight);
    lastScrollY = currentScrollY;
  }

  window.addEventListener('scroll', update, { passive: true });
  media.addEventListener('change', update);
  update();
}

// ------------------------------------------------------------------
// 光标拖尾效果：Canvas 粒子跟随 + 可交互元素放大
// 可通过 window.__cursorTrailConfig 配置 { trailLength, trailTime }
// ------------------------------------------------------------------
function initCursorTrail() {
  var config = window.__cursorTrailConfig || {};
  var trailLength = config.trailLength || 0;
  var trailTime = config.trailTime || 0;

  if (!trailLength || !trailTime) return;

  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '240',
    pointerEvents: 'none',
    mixBlendMode: 'difference'
  });
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const points = Array.from({ length: trailLength }, () => ({ x: 0, y: 0 }));
  const cursor = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let width = 0;
  let height = 0;
  let raf = 0;
  let visible = 0;
  let lastMove = 0;
  let initialized = false;
  let targetScale = 1;
  let scale = 1;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);

    const idle = time - lastMove;
    var fadeRate = trailTime > 0 ? Math.min(1, 16 / trailTime) : 1;
    visible += (1 - visible) * (idle > trailTime ? 0.96 : fadeRate);

    if (targetScale >= scale) {
      scale += (targetScale - scale) * 0.18;
    } else {
      const progress = Math.max(0, Math.min(1, (scale - targetScale) / 2));
      scale += (targetScale - scale) * (0.012 + progress * 0.09);
    }

    points[0].x = cursor.x;
    points[0].y = cursor.y;

    for (let i = 1; i < points.length; i += 1) {
      points[i].x += (points[i - 1].x - points[i].x) * 0.34;
      points[i].y += (points[i - 1].y - points[i].y) * 0.34;
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (let i = points.length - 1; i > 0; i -= 1) {
      const point = points[i];
      const next = points[i - 1];
      const t = 1 - i / points.length;
      if (visible <= 0.003) continue;

      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, ' + (visible * 0.72).toFixed(3) + ')';
      ctx.lineWidth = 0.6 + t * 8.4;
      ctx.moveTo(point.x, point.y);
      ctx.lineTo(next.x, next.y);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.fillStyle = 'rgba(255, 255, 255, ' + (visible * 0.92).toFixed(3) + ')';
    ctx.arc(points[0].x, points[0].y, 5.7 * scale, 0, Math.PI * 2);
    ctx.fill();

    raf = requestAnimationFrame(draw);
  }

  function move(event) {
    cursor.x = event.clientX;
    cursor.y = event.clientY;
    lastMove = performance.now();
    const target = document.elementFromPoint(event.clientX, event.clientY);
    targetScale = target && target.closest('a, button, input, textarea, select, summary, label, [role="button"], [tabindex]:not([tabindex="-1"])') ? 3 : 1;

    if (!initialized) {
      points.forEach((point) => {
        point.x = cursor.x;
        point.y = cursor.y;
      });
      initialized = true;
    }

    if (!raf) raf = requestAnimationFrame(draw);
  }

  resize();
  document.documentElement.classList.add('cursor-trail-enabled');
  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', move, { passive: true });
}

// ------------------------------------------------------------------
// 启动所有交互
// ------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  formatInlineTocRootBreaks();
  const scheduleOverflow = initTocOverflow();
  initTocSidebar(scheduleOverflow);
  initTocActiveHeading();
  initTocActiveVisibility();
  initMobileHeader();
  initCursorTrail();
});
