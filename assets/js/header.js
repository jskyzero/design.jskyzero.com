document.addEventListener('DOMContentLoaded', () => {
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
});
