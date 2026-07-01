document.addEventListener('DOMContentLoaded', () => {
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
});
