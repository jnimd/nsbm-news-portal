// landing page scripts
(function(window) {
  'use strict';

  let currentCategory = 'all';
  let currentSearchQuery = '';
  let activeModalArticleId = null;
  let searchDebounceTimer = null;

  // DOM Elements
  const announcementsContainer = document.getElementById('announcements-container');
  const categoriesContainer = document.getElementById('categories-container');
  const newsGridContainer = document.getElementById('news-grid-container');
  const filterTabsContainer = document.getElementById('filter-tabs-container');
  const searchInput = document.getElementById('news-search-input');
  const searchClearBtn = document.getElementById('search-clear-btn');
  const searchIconSlot = document.getElementById('search-icon-slot');
  const readerModal = document.getElementById('reader-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const commentForm = document.getElementById('modal-comment-form');
  const commentInput = document.getElementById('modal-comment-input');
  const commentsList = document.getElementById('modal-comments-list');
  const clockEl = document.getElementById('current-clock');
  const navAuthBtn = document.getElementById('nav-auth-btn');
  const mobileMenuToggleBtn = document.getElementById('mobile-menu-toggle-btn');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileNavCloseBtn = document.getElementById('mobile-nav-close-btn');
// INITIALIZATION
function init() {
    renderStaticIcons();
    renderClock();
    renderAnnouncements();
    renderCategories();
    renderFilterTabs();
    renderNewsGrid();
    setupEventListeners();
    updateNavAuthButton();
  }

  function renderStaticIcons() {
    if (searchIconSlot && window.AppIcons) {
      searchIconSlot.innerHTML = window.AppIcons.get('search');
    }
    const shareIcon = document.getElementById('modal-share-icon');
    if (shareIcon && window.AppIcons) {
      shareIcon.innerHTML = window.AppIcons.get('share', 'svg-icon-sm');
    }
    const discussionIcon = document.getElementById('modal-discussion-icon');
    if (discussionIcon && window.AppIcons) {
      discussionIcon.innerHTML = window.AppIcons.get('comment', 'svg-icon-sm');
    }
  }
// REAL-TIME COLOMBO CLOCK
function renderClock() {
    if (!clockEl) return;
    function tick() {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      clockEl.textContent = `COLOMBO ${hrs}:${mins}:${secs} LIVE`;
    }
    tick();
    setInterval(tick, 1000);
  }
// USER AUTH STATE IN NAV
function updateNavAuthButton() {
    if (!navAuthBtn) return;
    const user = window.DataStore ? window.DataStore.getCurrentUser() : null;
    if (user) {
      if (user.role === 'admin') {
        navAuthBtn.innerHTML = `${window.AppIcons ? window.AppIcons.get('shield', 'svg-icon-sm') : ''} Admin Desk`;
        navAuthBtn.href = 'admin-dashboard.html';
      } else {
        navAuthBtn.innerHTML = `${window.AppIcons ? window.AppIcons.get('user', 'svg-icon-sm') : ''} ${escapeHTML(user.name.split(' ')[0])} (Portal)`;
        navAuthBtn.href = 'student-dashboard.html';
      }
    } else {
      navAuthBtn.innerHTML = `${window.AppIcons ? window.AppIcons.get('user', 'svg-icon-sm') : ''} Sign In`;
      navAuthBtn.href = 'login.html';
    }
  }
// 1. RENDER FEATURED ANNOUNCEMENTS
function renderAnnouncements() {
    if (!announcementsContainer || !window.DataStore) return;
    const announcements = window.DataStore.getAnnouncements();

    announcementsContainer.innerHTML = announcements.map(item => {
      let cardClass = 'announcement-card';
      let badgeClass = 'badge-academic';
      if (item.badge === 'URGENT') {
        cardClass += ' urgent';
        badgeClass = 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
      } else if (item.badge === 'SPORTS') {
        cardClass += ' sports-ann';
        badgeClass = 'badge-sports';
      } else if (item.badge === 'GENERAL') {
        cardClass += ' general-ann';
        badgeClass = 'badge-general';
      } else {
        cardClass += ' featured-ann';
        badgeClass = 'badge-academic';
      }

      const annIcon = window.AppIcons ? window.AppIcons.get('announcement', 'svg-icon-sm') : '';

      return `
        <div class="${cardClass}">
          <div>
            <div class="announcement-top">
              <span class="announcement-badge ${badgeClass}">${annIcon} ${item.badge}</span>
              <span class="announcement-date">${item.date}</span>
            </div>
            <h3 class="announcement-title">${escapeHTML(item.title)}</h3>
            <p class="announcement-summary">${escapeHTML(item.summary)}</p>
          </div>
          <div class="announcement-footer">
            <span class="text-zinc-400 font-mono text-[11px]">${item.category} Bureau</span>
            <button type="button" class="btn-notice-link" onclick="openAnnouncementModal('${item.id}')">View Notice â†’</button>
          </div>
        </div>
      `;
    }).join('');
  }

  window.openAnnouncementModal = function(id) {
    if (!window.DataStore) return;
    const ann = window.DataStore.getAnnouncements().find(a => a.id === id);
    if (!ann) return;

    openStoryModalMock({
      title: ann.title,
      category: ann.category,
      readTime: '2 min notice',
      author: 'Office of the Vice Chancellor',
      authorRole: 'Campus Administrative Desk',
      date: ann.date,
      content: ann.summary + "\n\nFor further queries, scheduling details, or official verification, please contact the University Helpdesk at Student Services Center (Building 01) or email press@nsbm.ac.lk."
    });
  };
// 2. RENDER CATEGORIES (With Subscription Toggles & SVG Icons)
function renderCategories() {
    if (!categoriesContainer || !window.DataStore) return;
    const categories = window.DataStore.getCategories();
    const articles = window.DataStore.getArticles();

    categoriesContainer.innerHTML = categories.map(cat => {
      const count = articles.filter(a => 
        (a.category && a.category.toLowerCase() === cat.name.toLowerCase()) || 
        (a.categorySlug && a.categorySlug.toLowerCase() === cat.id.toLowerCase())
      ).length;

      const isSub = window.DataStore.isSubscribed(cat.id);
      const iconSVG = window.AppIcons ? window.AppIcons.get(cat.icon || 'general', 'svg-icon-lg') : '';
      const checkSVG = window.AppIcons ? window.AppIcons.get('check', 'svg-icon-sm') : 'âœ“';
      const bellSVG = window.AppIcons ? window.AppIcons.get('bell', 'svg-icon-sm') : '+';

      return `
        <div class="category-card" data-category="${cat.id}">
          <div class="flex items-center justify-between w-full mb-3">
            <div class="category-icon-wrapper" style="color: ${cat.color};">
              ${iconSVG}
            </div>
            <button 
              type="button" 
              class="category-subscribe-btn ${isSub ? 'subscribed' : ''}" 
              data-cat-id="${cat.id}"
              title="${isSub ? 'Subscribed to alerts' : 'Subscribe to category'}"
            >
              ${isSub ? `${checkSVG} Subscribed` : `${bellSVG} Subscribe`}
            </button>
          </div>
          <div class="category-name">${escapeHTML(cat.name)}</div>
          <div class="category-desc text-xs text-zinc-400 mb-2">${escapeHTML(cat.description || '')}</div>
          <div class="category-count">${count} Dispatches</div>
        </div>
      `;
    }).join('');

    // Attach click listeners to filter newsfeed by category
    categoriesContainer.querySelectorAll('.category-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.category-subscribe-btn')) return;
        const catId = card.getAttribute('data-category');
        setCategoryFilter(catId);
        const target = document.getElementById('campus-news-section');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Attach subscribe button listeners
    categoriesContainer.querySelectorAll('.category-subscribe-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const catId = btn.getAttribute('data-cat-id');
        const isSubscribed = window.DataStore.toggleSubscription(catId);
        btn.classList.toggle('subscribed', isSubscribed);
        const checkSVG = window.AppIcons ? window.AppIcons.get('check', 'svg-icon-sm') : 'âœ“';
        const bellSVG = window.AppIcons ? window.AppIcons.get('bell', 'svg-icon-sm') : '+';
        btn.innerHTML = isSubscribed ? `${checkSVG} Subscribed` : `${bellSVG} Subscribe`;
      });
    });
  }
// 3. RENDER FILTER TABS
function renderFilterTabs() {
    if (!filterTabsContainer || !window.DataStore) return;
    const categories = window.DataStore.getCategories();

    const tabsHTML = [
      `<button class="filter-tab ${currentCategory === 'all' ? 'active' : ''}" data-cat="all">All Dispatches</button>`,
      ...categories.map(cat => `
        <button class="filter-tab ${currentCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}">
          ${escapeHTML(cat.name)}
        </button>
      `)
    ].join('');

    filterTabsContainer.innerHTML = tabsHTML;

    filterTabsContainer.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const cat = tab.getAttribute('data-cat');
        setCategoryFilter(cat);
      });
    });
  }

  function setCategoryFilter(category) {
    currentCategory = category;
    if (filterTabsContainer) {
      filterTabsContainer.querySelectorAll('.filter-tab').forEach(tab => {
        if (tab.getAttribute('data-cat') === category) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });
    }
    renderNewsGrid();
  }
// 4. RENDER LATEST CAMPUS NEWS GRID
function renderNewsGrid() {
    if (!newsGridContainer || !window.DataStore) return;

    const filter = {
      category: currentCategory,
      search: currentSearchQuery
    };

    const articles = window.DataStore.getArticles(filter);

    if (articles.length === 0) {
      const newsSVG = window.AppIcons ? window.AppIcons.get('news', 'svg-icon-xl text-zinc-500 mb-3') : '';
      newsGridContainer.innerHTML = `
        <div class="col-span-full py-16 text-center text-zinc-500 font-display">
          ${newsSVG}
          <div class="text-lg text-white font-semibold mb-1">No Dispatches Found</div>
          <p class="text-xs text-zinc-400">Try adjusting your category filter beat or search keywords.</p>
          <button type="button" class="btn-secondary text-xs mt-4" onclick="resetNewsFilter()">Reset Filters</button>
        </div>
      `;
      return;
    }

    newsGridContainer.innerHTML = articles.map(art => {
      const isBookmarked = window.DataStore.isBookmarked(art.id);
      const catSlug = (art.category || 'academic').toLowerCase();
      let badgeClass = 'badge-academic';
      if (catSlug === 'events') badgeClass = 'badge-events';
      if (catSlug === 'sports') badgeClass = 'badge-sports';
      if (catSlug === 'general') badgeClass = 'badge-general';
      if (catSlug === 'computing') badgeClass = 'badge-computing';
      if (catSlug === 'sustainability') badgeClass = 'badge-sustainability';
      if (catSlug === 'campus') badgeClass = 'badge-campus';

      const authorInitial = art.author ? art.author.charAt(0).toUpperCase() : 'N';
      const eyeSVG = window.AppIcons ? window.AppIcons.get('eye', 'svg-icon-sm') : '';
      const bookmarkSVG = window.AppIcons ? (isBookmarked ? window.AppIcons.get('bookmarkFilled') : window.AppIcons.get('bookmark')) : (isBookmarked ? 'â˜…' : 'â˜†');

      return `
        <article class="news-card">
          <div class="news-card-image">
            <img src="${art.image || '1im/ezgif-frame-001.jpg'}" alt="${escapeHTML(art.title)}" loading="lazy" />
            <div class="news-card-badge-floating">
              <span class="badge-category ${badgeClass}">${escapeHTML(art.category)}</span>
            </div>
            <button 
              class="news-card-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" 
              data-id="${art.id}"
              title="${isBookmarked ? 'Remove Bookmark' : 'Save Article'}"
            >
              ${bookmarkSVG}
            </button>
          </div>

          <div class="news-card-body">
            <div class="news-card-meta">
              <span>${art.date}</span>
              <span>&bull;</span>
              <span>${art.readTime || '4 min read'}</span>
              <span>&bull;</span>
              <span class="flex items-center gap-1">${eyeSVG} ${art.views || 0}</span>
            </div>

            <h3 class="news-card-title">${escapeHTML(art.title)}</h3>
            <p class="news-card-excerpt">${escapeHTML(art.excerpt)}</p>

            <div class="news-card-footer">
              <div class="author-chip">
                <div class="author-avatar">${authorInitial}</div>
                <span class="author-name">${escapeHTML(art.author)}</span>
              </div>
              <button class="btn-read-story" data-id="${art.id}">
                Read Story â†’
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach bookmark handlers
    newsGridContainer.querySelectorAll('.news-card-bookmark-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.getAttribute('data-id'), 10);
        const bookmarked = window.DataStore.toggleBookmark(id);
        btn.classList.toggle('bookmarked', bookmarked);
        btn.innerHTML = window.AppIcons ? (bookmarked ? window.AppIcons.get('bookmarkFilled') : window.AppIcons.get('bookmark')) : (bookmarked ? 'â˜…' : 'â˜†');
        btn.title = bookmarked ? 'Remove Bookmark' : 'Save Article';
      });
    });

    // Attach read story handlers
    newsGridContainer.querySelectorAll('.btn-read-story').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'), 10);
        openStoryModal(id);
      });
    });
  }

  window.resetNewsFilter = function() {
    currentCategory = 'all';
    currentSearchQuery = '';
    if (searchInput) searchInput.value = '';
    if (searchClearBtn) searchClearBtn.style.display = 'none';
    renderFilterTabs();
    renderNewsGrid();
  };
// 5. STORY READER MODAL (WITH COMMENTS)
function openStoryModal(articleId) {
    if (!readerModal || !window.DataStore) return;
    const article = window.DataStore.getArticleById(articleId);
    if (!article) return;

    activeModalArticleId = articleId;
    window.DataStore.incrementArticleViews(articleId);

    const catBadge = document.getElementById('modal-cat-badge');
    const readTime = document.getElementById('modal-read-time');
    const title = document.getElementById('modal-title');
    const author = document.getElementById('modal-author');
    const authorRole = document.getElementById('modal-author-role');
    const date = document.getElementById('modal-date');
    const body = document.getElementById('modal-body-content');

    if (catBadge) {
      catBadge.textContent = article.category;
      catBadge.className = `badge-category badge-${(article.category || 'academic').toLowerCase()}`;
    }
    if (readTime) readTime.textContent = article.readTime || '4 min read';
    if (title) title.textContent = article.title;
    if (author) author.textContent = article.author;
    if (authorRole) authorRole.textContent = article.authorRole || 'NSBM Campus Journalist';
    if (date) date.textContent = article.date;

    if (body) {
      const paragraphs = article.content.split('\n\n').filter(p => p.trim().length > 0);
      body.innerHTML = paragraphs.map(p => `<p>${escapeHTML(p)}</p>`).join('');
    }

    renderModalComments(articleId);

    readerModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  window.openStoryModal = openStoryModal;

  function closeStoryModal() {
    if (!readerModal) return;
    readerModal.classList.remove('open');
    document.body.style.overflow = '';
    activeModalArticleId = null;
  }

  function openStoryModalMock(data) {
    if (!readerModal) return;
    document.getElementById('modal-cat-badge').textContent = data.category;
    document.getElementById('modal-read-time').textContent = data.readTime;
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-author').textContent = data.author;
    document.getElementById('modal-author-role').textContent = data.authorRole;
    document.getElementById('modal-date').textContent = data.date;

    const body = document.getElementById('modal-body-content');
    body.innerHTML = data.content.split('\n\n').map(p => `<p>${escapeHTML(p)}</p>`).join('');

    if (commentsList) commentsList.innerHTML = '<div class="text-zinc-400 text-xs py-2 font-mono">Official Campus Directive. Public comments are archived.</div>';

    readerModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function renderModalComments(articleId) {
    if (!commentsList || !window.DataStore) return;
    const comments = window.DataStore.getComments(articleId);

    if (comments.length === 0) {
      commentsList.innerHTML = `
        <div class="text-zinc-400 text-xs py-4 text-center font-mono">
          No comments yet. Be the first to share constructive perspective on this dispatch.
        </div>
      `;
      return;
    }

    commentsList.innerHTML = comments.map(cmt => `
      <div class="comment-item">
        <div class="comment-item-header">
          <div class="flex items-center gap-2">
            <span class="comment-item-author">${escapeHTML(cmt.author)}</span>
            <span class="text-[10px] text-zinc-400 font-mono">(${escapeHTML(cmt.role || 'Reader')})</span>
          </div>
          <span class="comment-item-date">${cmt.date}</span>
        </div>
        <p class="comment-item-text">${escapeHTML(cmt.text)}</p>
      </div>
    `).join('');
  }
// 6. EVENT LISTENERS
function setupEventListeners() {
    // Search with Debounce & Clear Button
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        if (searchClearBtn) {
          searchClearBtn.style.display = val ? 'inline-flex' : 'none';
        }
        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(() => {
          currentSearchQuery = val;
          renderNewsGrid();
        }, 150);
      });
    }

    if (searchClearBtn) {
      searchClearBtn.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
        searchClearBtn.style.display = 'none';
        currentSearchQuery = '';
        renderNewsGrid();
      });
    }

    // Modal Close
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeStoryModal);
    }

    if (readerModal) {
      readerModal.addEventListener('click', (e) => {
        if (e.target === readerModal) {
          closeStoryModal();
        }
      });
    }

    // Mobile Menu Toggle
    if (mobileMenuToggleBtn && mobileNavDrawer) {
      mobileMenuToggleBtn.addEventListener('click', () => {
        mobileNavDrawer.classList.toggle('open');
      });
    }

    if (mobileNavCloseBtn && mobileNavDrawer) {
      mobileNavCloseBtn.addEventListener('click', () => {
        mobileNavDrawer.classList.remove('open');
      });
    }

    // Close mobile nav when clicking any nav link
    if (mobileNavDrawer) {
      mobileNavDrawer.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
          mobileNavDrawer.classList.remove('open');
        });
      });
    }

    // Comment Form Submit
    if (commentForm) {
      commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!activeModalArticleId || !commentInput) return;
        const text = commentInput.value.trim();
        if (!text) return;

        window.DataStore.addComment(activeModalArticleId, text);
        commentInput.value = '';
        renderModalComments(activeModalArticleId);
      });
    }

    // Share Button
    const shareBtn = document.getElementById('modal-share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(window.location.href);
          const original = shareBtn.innerHTML;
          const checkSVG = window.AppIcons ? window.AppIcons.get('check', 'svg-icon-sm') : 'âœ“';
          shareBtn.innerHTML = `${checkSVG} Link Copied!`;
          setTimeout(() => { shareBtn.innerHTML = original; }, 2000);
        }
      });
    }

    // ESC to close modal
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && readerModal && readerModal.classList.contains('open')) {
        closeStoryModal();
      }
    });

    // Newsletter mock
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('newsletter-email');
        const msg = document.getElementById('newsletter-msg');
        if (input) input.value = '';
        if (msg) {
          msg.classList.remove('hidden');
          const checkSVG = window.AppIcons ? window.AppIcons.get('check', 'svg-icon-sm') : 'âœ“';
          msg.innerHTML = `${checkSVG} Subscribed! You will receive weekly official university dispatches.`;
        }
      });
    }
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})(window);


