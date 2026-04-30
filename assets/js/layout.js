function setSidebarOpen(open) {
  const sidebar = document.getElementById('sidebar');
  const toggles = document.querySelectorAll('[aria-controls="sidebar"]');
  if (!sidebar) return;

  sidebar.classList.toggle('open', open);
  document.body.classList.toggle('sidebar-open', open);
  toggles.forEach((toggle) => toggle.setAttribute('aria-expanded', String(open)));
}

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

function initTocSidebar() {
  const inlineToc = document.getElementById('toc-inline');
  const sidebarToc = document.getElementById('toc-sidebar');
  if (!inlineToc || !sidebarToc) return;

  // Pages without an h1 hide the inline TOC, so the sidebar TOC should appear immediately.
  if (inlineToc.hidden) {
    sidebarToc.classList.add('visible');
    sidebarToc.setAttribute('aria-hidden', 'false');
    return;
  }

  if (!window.IntersectionObserver) return;

  const observer = new IntersectionObserver((entries) => {
    const visible = entries[0].isIntersecting;
    sidebarToc.classList.toggle('visible', !visible);
    sidebarToc.setAttribute('aria-hidden', String(visible));
  }, { threshold: 0 });

  observer.observe(inlineToc);
}

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
    // Pick the first visible heading near the reading position as the active item.
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
    if (visible) setActive(visible.target.id);
  }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

  headings.forEach((heading) => observer.observe(heading));
  setActive(headings[0].id);
}

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

    if (wasOverflowing !== shouldOverflow) sidebarToc.scrollTop = Math.min(sidebarToc.scrollTop, sidebarToc.scrollHeight);
  }

  function scheduleUpdateOverflow() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(updateOverflow);
  }

  scheduleUpdateOverflow();
  window.addEventListener('resize', scheduleUpdateOverflow);

  if (window.ResizeObserver) {
    const nav = sidebarToc.querySelector('.toc-nav');
    if (nav) {
      const observer = new ResizeObserver(scheduleUpdateOverflow);
      observer.observe(nav);
    }
  }
}

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

function positionInlineToc() {
  const toc = document.getElementById('toc-inline');
  const h1 = document.getElementsByTagName('h1')[0];
  if (!toc) return;

  // Without an h1 there is no stable inline anchor; let the sidebar TOC carry the outline.
  if (!h1) {
    toc.hidden = true;
    return;
  }

  const pro = document.getElementById('index');
  const anchor = pro && pro.parentElement === h1.parentElement ? pro : h1;
  anchor.parentElement.insertBefore(toc, anchor.nextElementSibling);
}

function formatInlineTocRootBreaks() {
  document.querySelectorAll('#toc-inline .toc-nav > ul > li > a').forEach((link) => {
    const text = link.textContent;
    if (!text || !text.includes('/')) return;

    link.setAttribute('aria-label', text);
    link.textContent = '';

    text.split('/').forEach((part, index, parts) => {
      if (part) link.appendChild(document.createTextNode(part));
      if (index === parts.length - 1) return;

      link.appendChild(document.createElement('br'));

      const slash = document.createElement('span');
      slash.className = 'toc-inline__break-symbol';
      slash.setAttribute('aria-hidden', 'true');
      slash.textContent = '/';
      link.appendChild(slash);

      link.appendChild(document.createElement('br'));
    });
  });
}

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

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  positionInlineToc();
  formatInlineTocRootBreaks();
  initTocSidebar();
  initTocActiveHeading();
  initTocOverflow();
  initTocActiveVisibility();
  initMobileHeader();
});
