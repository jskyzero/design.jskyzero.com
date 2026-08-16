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

document.addEventListener('DOMContentLoaded', initSidebar);
