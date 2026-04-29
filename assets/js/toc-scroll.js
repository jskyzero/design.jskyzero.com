/**
 * toc-scroll.js — TOC scroll behavior
 * - Shows TOC inline below post title
 * - When scrolled past, TOC appears in right sidebar (sticky)
 * - Mobile: TOC just stays inline, no floating
 */
(function() {
  var tocInline  = document.getElementById('toc-inline');
  var tocSidebar = document.getElementById('toc-sidebar');
  if (!tocInline || !tocSidebar) return;

  var isMobile = window.innerWidth <= 900;

  function updateTOC() {
    if (isMobile) {
      tocInline.style.display = '';
      tocSidebar.style.display = 'none';
      return;
    }

    var rect = tocInline.getBoundingClientRect();
    var scrolledPast = rect.bottom < 0;

    if (scrolledPast) {
      tocInline.style.visibility = 'hidden';
      tocSidebar.style.opacity = '1';
      tocSidebar.style.pointerEvents = 'auto';
    } else {
      tocInline.style.visibility = '';
      tocSidebar.style.opacity = '0';
      tocSidebar.style.pointerEvents = 'none';
    }
  }

  // Throttled scroll handler
  var ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(function() {
        updateTOC();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Handle resize
  window.addEventListener('resize', function() {
    isMobile = window.innerWidth <= 900;
    updateTOC();
  });

  // Initial check
  updateTOC();
})();
