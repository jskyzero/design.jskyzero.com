function setSidebarOpen(open) {
  const sidebar = document.getElementById('sidebar');
  const toggles = document.querySelectorAll('[aria-controls="sidebar"]');
  if (!sidebar) return;

  sidebar.classList.toggle('open', open);
  document.body.classList.toggle('sidebar-open', open);
  toggles.forEach((toggle) => toggle.setAttribute('aria-expanded', String(open)));
}

function initSidebar() {
  // Safari 的 fixed 元素避免嵌在网格/内容层中；桌面恢复三栏位置。
  const sidebar = document.getElementById('sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  if (!sidebar || !overlay) return;
  const anchor = document.createComment('sidebar desktop position');
  sidebar.before(anchor);
  const media = window.matchMedia('(max-width: 1319px)');
  function placeSidebar() {
    setSidebarOpen(false);
    if (media.matches) {
      document.body.append(sidebar, overlay);
    } else {
      anchor.after(sidebar);
      sidebar.after(overlay);
    }
  }
  media.addEventListener('change', placeSidebar);
  placeSidebar();
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

document.addEventListener('DOMContentLoaded', initSidebar);
