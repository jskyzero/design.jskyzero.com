function initTocSidebar(scheduleOverflow) {
  const inlineToc = document.getElementById('toc-inline');
  const sidebarToc = document.getElementById('toc-sidebar');
  if (!inlineToc || !sidebarToc) return;

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

document.addEventListener('DOMContentLoaded', () => {
  const scheduleOverflow = initTocOverflow();
  initTocSidebar(scheduleOverflow);
  initTocActiveHeading();
  initTocActiveVisibility();
});
