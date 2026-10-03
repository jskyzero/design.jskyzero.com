/**
 * search.js —— 客户端搜索。
 *
 * 按需加载 search.json（Jekyll 构建产物），
 * 在侧栏搜索框中输入时实时过滤并渲染结果。
 * 支持 Ctrl+K 和 / 快捷键聚焦搜索框。
 */
(function() {
  'use strict';

  var posts = [];
  var searchIndexPromise = null;
  var searchInput = document.getElementById('search-input');
  var searchResults = document.getElementById('search-results');

  if (!searchInput || !searchResults) return;

  // 懒加载搜索索引（首次聚焦时触发）
  function loadSearchIndex() {
    if (searchIndexPromise) return searchIndexPromise;

    searchIndexPromise = fetch('/search.json')
      .then(function(response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
      })
      .then(function(data) {
        if (!Array.isArray(data) || data.some(function(post) {
          return !post || typeof post.title !== 'string' || typeof post.url !== 'string' ||
            (post.excerpt != null && typeof post.excerpt !== 'string') ||
            (post.date != null && typeof post.date !== 'string') ||
            (post.categories != null && (!Array.isArray(post.categories) ||
              post.categories.some(function(cat) { return typeof cat !== 'string'; })));
        })) throw new Error('搜索索引格式无效');
        posts = data;
      })
      .catch(function(err) {
        console.error('搜索索引加载失败:', err);
        searchIndexPromise = null;
        throw err;
      });

    return searchIndexPromise;
  }

  // 按查询过滤并渲染结果
  function doSearch(query) {
    searchResults.innerHTML = '';

    if (!query || query.length < 2) {
      searchResults.style.display = 'none';
      return;
    }

    var q = query.toLowerCase();
    var matches = posts.filter(function(post) {
      return post.title.toLowerCase().indexOf(q) !== -1 ||
             (post.excerpt && post.excerpt.toLowerCase().indexOf(q) !== -1) ||
             (post.categories && post.categories.some(function(cat) {
               return cat.toLowerCase().indexOf(q) !== -1;
             }));
    });

    if (matches.length === 0) {
      searchResults.style.display = 'block';
      searchResults.innerHTML = '<div class="search-no-result">无结果</div>';
      return;
    }

    searchResults.style.display = 'block';
    var html = '<ul>';
    matches.slice(0, 20).forEach(function(post) {
      html += '<li><a href="' + escapeHtml(post.url) + '">' + escapeHtml(post.title) + '</a>';
      if (post.date) {
        html += ' <span class="search-date">[' + escapeHtml(post.date) + ']</span>';
      }
      html += '</li>';
    });
    html += '</ul>';
    searchResults.innerHTML = html;
  }

  // HTML 转义
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML.replace(/"/g, '&quot;');
  }

  // 防抖输入搜索
  function runSearch() {
    if (searchInput.value.trim().length < 2) {
      doSearch('');
      return;
    }
    searchResults.style.display = 'block';
    searchResults.innerHTML = '<div class="search-no-result" role="status">正在加载…</div>';
    loadSearchIndex().then(function() {
      doSearch(searchInput.value.trim());
    }).catch(function() {
      if (searchInput.value.trim().length < 2) return doSearch('');
      searchResults.style.display = 'block';
      searchResults.innerHTML = '<div class="search-no-result" role="status">搜索加载失败，请重试。 <button type="button" data-search-retry>重试</button></div>';
    });
  }

  searchResults.addEventListener('click', function(e) {
    if (e.target.closest('[data-search-retry]')) runSearch();
  });

  var timer;
  searchInput.addEventListener('input', function() {
    clearTimeout(timer);
    timer = setTimeout(runSearch, 200);
  });

  // 首次聚焦时预加载索引
  searchInput.addEventListener('focus', function() {
    loadSearchIndex().catch(function() {});
  });

  // 点击外部关闭搜索结果
  document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.style.display = 'none';
    }
  });

  // 快捷键：Ctrl+K 或 / 聚焦搜索框
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && !isInputFocused())) {
      e.preventDefault();
      searchInput.focus();
    }
  });

  function isInputFocused() {
    var tag = document.activeElement ? document.activeElement.tagName : '';
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
  }
})();
