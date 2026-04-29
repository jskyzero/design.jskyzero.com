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
  if (!inlineToc || !sidebarToc || !window.IntersectionObserver) return;

  const observer = new IntersectionObserver((entries) => {
    const visible = entries[0].isIntersecting;
    sidebarToc.classList.toggle('visible', !visible);
    sidebarToc.setAttribute('aria-hidden', String(visible));
  }, { threshold: 0 });

  observer.observe(inlineToc);
}

function positionInlineToc() {
  const toc = document.getElementById('toc-inline');
  const h1 = document.getElementsByTagName('h1')[0];
  if (!toc || !h1) return;

  const pro = document.getElementById('index');
  const anchor = pro && pro.parentElement === h1.parentElement ? pro : h1;
  anchor.parentElement.insertBefore(toc, anchor.nextElementSibling);
}

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  positionInlineToc();
  initTocSidebar();
});
