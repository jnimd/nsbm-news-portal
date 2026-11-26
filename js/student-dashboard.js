// student dashboard scripts
(function(window) {
  'use strict';

  let currentCategory = 'all';
  let searchQuery = '';
  let dateFilter = '';
  let activeTab = 'browse';
  let activeReaderArticleId = null;
  let searchDebounceTimer = null;

  // DOM Elements
  const tabButtons = document.querySelectorAll('.sidebar-tab-btn');
  const viewPanes = document.querySelectorAll('.dashboard-view-pane');
  const newsListContainer = document.getElementById('student-news-container');
  const bookmarksContainer = document.getElementById('student-bookmarks-container');
  const submissionsContainer = document.getElementById('student-submissions-container');
  const subscriptionsContainer = document.getElementById('student-subscriptions-container');
  const categoryFilterSelect = document.getElementById('student-cat-filter');
  const dateFilterInput = document.getElementById('student-date-filter');
  const searchInput = document.getElementById('student-search-input');
  const resetFiltersBtn = document.getElementById('student-reset-filters');
  const submitArticleForm = document.getElementById('submit-article-form');
  const articleContentTextarea = document.getElementById('sub-content');
  const charCountDisplay = document.getElementById('sub-char-count');
  const submitAlert = document.getElementById('submit-alert');
  const userProfileName = document.getElementById('user-profile-name');
  const userProfileId = document.getElementById('user-profile-id');
  const logoutBtn = document.getElementById('logout-btn');
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const sidebar = document.querySelector('.dashboard-sidebar');

  // Stats elements
  const statPublished = document.getElementById('stat-published-count');
  const statPending = document.getElementById('stat-pending-count');
  const statBookmarks = document.getElementById('stat-bookmarks-count');
  const statSubs = document.getElementById('stat-subs-count');

  // Reader Modal elements
  const readerModal = document.getElementById('student-reader-modal');
  const commentForm = document.getElementById('student-comment-form');
  const commentInput = document.getElementById('student-comment-input');
  const commentsList = document.getElementById('student-comments-list');

  function init() {
    renderStaticIcons();
    setupUserSession();
    setupNavigation();
    setupFilters();
    setupArticleSubmissionForm();
    renderAllViews();
    setupMobileMenu();
    setupReaderModal();
  }
// STATIC SVG ICONS RENDERING
function renderStaticIcons() {
    if (!window.AppIcons) return;
    
    // Sidebar icons
    const iconBrowse = document.getElementById('tab-icon-browse');
    if (iconBrowse) iconBrowse.innerHTML = window.AppIcons.get('news', 'svg-icon-sm');

    const iconSubmit = document.getElementById('tab-icon-submit');
    if (iconSubmit) iconSubmit.innerHTML = window.AppIcons.get('pen', 'svg-icon-sm');

    const iconSubmissions = document.getElementById('tab-icon-submissions');
    if (iconSubmissions) iconSubmissions.innerHTML = window.AppIcons.get('idCard', 'svg-icon-sm');

    const iconBookmarks = document.getElementById('tab-icon-bookmarks');
    if (iconBookmarks) iconBookmarks.innerHTML = window.AppIcons.get('bookmark', 'svg-icon-sm');

    const iconSubscriptions = document.getElementById('tab-icon-subscriptions');
    if (iconSubscriptions) iconSubscriptions.innerHTML = window.AppIcons.get('bell', 'svg-icon-sm');

    const iconPortal = document.getElementById('tab-icon-portal');
    if (iconPortal) iconPortal.innerHTML = window.AppIcons.get('externalLink', 'svg-icon-sm');

    const iconLogout = document.getElementById('tab-icon-logout');
    if (iconLogout) iconLogout.innerHTML = window.AppIcons.get('logout', 'svg-icon-sm');

    const searchIcon = document.getElementById('student-search-icon-slot');
    if (searchIcon) searchIcon.innerHTML = window.AppIcons.get('search');

    // Stat bubble icons
    const statIconPub = document.getElementById('stat-icon-published');
    if (statIconPub) statIconPub.innerHTML = window.AppIcons.get('news');

    const statIconPend = document.getElementById('stat-icon-pending');
    if (statIconPend) statIconPend.innerHTML = window.AppIcons.get('clock');

    const statIconBook = document.getElementById('stat-icon-bookmarks');
    if (statIconBook) statIconBook.innerHTML = window.AppIcons.get('bookmark');

    const statIconSub = document.getElementById('stat-icon-subs');
    if (statIconSub) statIconSub.innerHTML = window.AppIcons.get('bell');

    const discussIcon = document.getElementById('modal-discuss-icon-slot');
    if (discussIcon) discussIcon.innerHTML = window.AppIcons.get('comment', 'svg-icon-sm');
  }
// USER SESSION SETUP (AUTHENTICATED GUARDS)
function setupUserSession() {
    if (!window.DataStore) return;
    let user = window.DataStore.getCurrentUser();
    if (!user) {
      window.location.replace('login.html?redirect=student-dashboard.html');
      return;
    }

    if (userProfileName) userProfileName.textContent = user.name || 'Student Journalist';
    if (userProfileId) userProfileId.textContent = user.studentId || 'NSBM-IT-24-9021';

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        window.DataStore.logout();
        window.location.href = 'index.html';
      });
    }
  }
// TAB NAVIGATION
function setupNavigation() {
    tabButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = btn.getAttribute('data-tab');
        if (!tab) return;

        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        viewPanes.forEach(pane => {
          if (pane.id === `view-${tab}`) {
            pane.classList.add('active');
          } else {
            pane.classList.remove('active');
          }
        });

        activeTab = tab;
        renderAllViews();

        if (sidebar && sidebar.classList.contains('mobile-open')) {
          sidebar.classList.remove('mobile-open');
        }
      });
    });
  }

  function setupMobileMenu() {
    if (mobileToggleBtn && sidebar) {
      mobileToggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = sidebar.classList.toggle('mobile-open');
        document.body.classList.toggle('drawer-open', isOpen);
      });

      // Close mobile drawer when clicking outside the sidebar on touch devices
      document.addEventListener('click', (e) => {
        if (sidebar.classList.contains('mobile-open') && !sidebar.contains(e.target) && !mobileToggleBtn.contains(e.target)) {
          sidebar.classList.remove('mobile-open');
          document.body.classList.remove('drawer-open');
        }
      });
    }
  }
// FILTERS (CATEGORY, SEARCH, DATE)
function setupFilters() {
    if (categoryFilterSelect && window.DataStore) {
      const categories = window.DataStore.getCategories();
      categoryFilterSelect.innerHTML = `
        <option value="all">All Editorial Beats</option>
        ${categories.map(c => `<option value="${c.name.toLowerCase()}">${c.name}</option>`).join('')}
      `;

      categoryFilterSelect.addEventListener('change', (e) => {
        currentCategory = e.target.value;
        renderBrowseNews();
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(() => {
          searchQuery = e.target.value.trim();
          renderBrowseNews();
        }, 150);
      });
    }

    if (dateFilterInput) {
      dateFilterInput.addEventListener('change', (e) => {
        dateFilter = e.target.value;
        renderBrowseNews();
      });
    }

    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener('click', () => {
        currentCategory = 'all';
        searchQuery = '';
        dateFilter = '';
        if (categoryFilterSelect) categoryFilterSelect.value = 'all';
        if (searchInput) searchInput.value = '';
        if (dateFilterInput) dateFilterInput.value = '';
        renderBrowseNews();
      });
    }
  }
// RENDER ALL VIEWS
function renderAllViews() {
    updateStats();
    if (activeTab === 'browse') renderBrowseNews();
    if (activeTab === 'bookmarks') renderBookmarks();
    if (activeTab === 'submissions') renderSubmissions();
    if (activeTab === 'subscriptions') renderSubscriptions();
  }

  function updateStats() {
    if (!window.DataStore) return;
    const articles = window.DataStore.getArticles();
    const user = window.DataStore.getCurrentUser();
    const submissions = window.DataStore.getSubmissions(user ? user.studentId : null);
    const bookmarks = window.DataStore.getBookmarks();
    const subscriptions = window.DataStore.getSubscriptions();

    if (statPublished) statPublished.textContent = articles.length;
    if (statPending) statPending.textContent = submissions.filter(s => s.status === 'pending').length;
    if (statBookmarks) statBookmarks.textContent = bookmarks.length;
    if (statSubs) statSubs.textContent = subscriptions.length;

    // Badges in sidebar
    const bookmarkBadge = document.getElementById('badge-bookmarks-count');
    if (bookmarkBadge) bookmarkBadge.textContent = bookmarks.length;

    const submissionsBadge = document.getElementById('badge-submissions-count');
    if (submissionsBadge) submissionsBadge.textContent = submissions.length;
  }
// 1. RENDER BROWSE NEWS
function renderBrowseNews() {
    if (!newsListContainer || !window.DataStore) return;

    let articles = window.DataStore.getArticles({
      category: currentCategory,
      search: searchQuery
    });

    if (dateFilter) {
      const targetDate = new Date(dateFilter);
      articles = articles.filter(a => {
        const artDate = new Date(a.date);
        return !isNaN(artDate) && artDate.toDateString() === targetDate.toDateString();
      });
    }

    if (articles.length === 0) {
      const searchSVG = window.AppIcons ? window.AppIcons.get('search', 'svg-icon-xl text-zinc-500 mb-2') : '';
      newsListContainer.innerHTML = `
        <div class="col-span-full py-16 text-center text-zinc-500 font-display">
          ${searchSVG}
          <div class="text-base text-white font-semibold">No dispatches match your filter criteria</div>
          <p class="text-xs text-zinc-400 mt-1">Try resetting the keyword search or clearing the date filter.</p>
        </div>
      `;
      return;
    }

    newsListContainer.innerHTML = articles.map(art => {
      const isBookmarked = window.DataStore.isBookmarked(art.id);
      const eyeSVG = window.AppIcons ? window.AppIcons.get('eye', 'svg-icon-sm') : '';
      const bookmarkSVG = window.AppIcons ? (isBookmarked ? window.AppIcons.get('bookmarkFilled') : window.AppIcons.get('bookmark')) : (isBookmarked ? 'â˜…' : 'â˜†');

      return `
        <div class="news-card">
          <div class="news-card-image">
            <img src="${art.image || '1im/ezgif-frame-001.jpg'}" alt="${escapeHTML(art.title)}" loading="lazy" />
            <div class="news-card-badge-floating">
              <span class="badge-category badge-academic">${art.category}</span>
            </div>
            <button 
              class="news-card-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" 
              data-id="${art.id}"
              title="${isBookmarked ? 'Remove Bookmark' : 'Bookmark Article'}"
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
                <div class="author-avatar">${art.author ? art.author.charAt(0) : 'U'}</div>
                <span class="author-name">${escapeHTML(art.author)}</span>
              </div>
              <button class="btn-read-story" onclick="openStoryReaderModal(${art.id})">
                Read & Discuss &rarr;
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach bookmark handlers
    newsListContainer.querySelectorAll('.news-card-bookmark-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'), 10);
        const bookmarked = window.DataStore.toggleBookmark(id);
        btn.classList.toggle('bookmarked', bookmarked);
        btn.innerHTML = window.AppIcons ? (bookmarked ? window.AppIcons.get('bookmarkFilled') : window.AppIcons.get('bookmark')) : (bookmarked ? 'â˜…' : 'â˜†');
        updateStats();
      });
    });
  }
// 2. SUBMIT ARTICLE FORM
function setupArticleSubmissionForm() {
    if (!submitArticleForm) return;

    if (articleContentTextarea && charCountDisplay) {
      articleContentTextarea.addEventListener('input', () => {
        const count = articleContentTextarea.value.length;
        charCountDisplay.textContent = `${count} characters`;
      });
    }

    submitArticleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('sub-title').value.trim();
      const category = document.getElementById('sub-category').value;
      const readTime = document.getElementById('sub-readtime').value || '4 min read';
      const excerpt = document.getElementById('sub-excerpt').value.trim();
      const content = document.getElementById('sub-content').value.trim();
      const image = document.getElementById('sub-image').value || '1im/ezgif-frame-001.jpg';

      if (!title || !content || !excerpt) {
        showSubmitAlert('Please complete all required fields (Headline, Excerpt, Body).', 'error');
        return;
      }

      const user = window.DataStore.getCurrentUser();

      window.DataStore.createSubmission({
        title: title,
        category: category,
        readTime: readTime,
        excerpt: excerpt,
        content: content,
        image: image,
        author: user ? user.name : 'Student Contributor'
      });

      const checkSVG = window.AppIcons ? window.AppIcons.get('check', 'svg-icon-sm') : 'âœ“';
      showSubmitAlert(`${checkSVG} Article submitted successfully! It has been routed to the Chief Editor for review.`, 'success');
      submitArticleForm.reset();
      if (charCountDisplay) charCountDisplay.textContent = '0 characters';

      updateStats();

      // Automatically switch to "My Submissions" tab after 1.2s
      setTimeout(() => {
        const subTabBtn = document.querySelector('.sidebar-tab-btn[data-tab="submissions"]');
        if (subTabBtn) subTabBtn.click();
      }, 1200);
    });
  }

  function showSubmitAlert(msg, type) {
    if (!submitAlert) return;
    submitAlert.innerHTML = msg;
    submitAlert.className = 'auth-alert ' + (type === 'error' ? 'auth-alert-error' : 'auth-alert-success');
    submitAlert.style.display = 'flex';
  }
// 3. RENDER SUBMISSIONS TRACKER
function renderSubmissions() {
    if (!submissionsContainer || !window.DataStore) return;
    const user = window.DataStore.getCurrentUser();
    const submissions = window.DataStore.getSubmissions(user ? user.studentId : null);

    if (submissions.length === 0) {
      const penSVG = window.AppIcons ? window.AppIcons.get('pen', 'svg-icon-xl text-zinc-500 mb-2') : '';
      submissionsContainer.innerHTML = `
        <div class="py-16 text-center text-zinc-500 font-display">
          ${penSVG}
          <div class="text-base text-white font-semibold">No stories submitted yet</div>
          <p class="text-xs text-zinc-400 mt-1">Pitch your first investigative article using the Submit Article tab.</p>
        </div>
      `;
      return;
    }

    submissionsContainer.innerHTML = submissions.map(sub => {
      let statusBadge = `<span class="status-badge status-pending">In Editorial Review</span>`;
      if (sub.status === 'approved') {
        statusBadge = `<span class="status-badge status-approved">Approved & Published</span>`;
      } else if (sub.status === 'rejected') {
        statusBadge = `<span class="status-badge status-rejected">Revisions Requested</span>`;
      }

      return `
        <div class="tracker-card">
          <div class="tracker-top">
            <div>
              <span class="badge-category badge-academic">${escapeHTML(sub.category)}</span>
              <span class="text-xs text-zinc-400 font-mono ml-2">Submitted on ${sub.submittedDate}</span>
            </div>
            ${statusBadge}
          </div>

          <h3 class="tracker-title">${escapeHTML(sub.title)}</h3>
          <p class="text-xs text-zinc-300 leading-relaxed">${escapeHTML(sub.excerpt)}</p>

          ${sub.feedback ? `
            <div class="tracker-feedback">
              <strong class="text-brand-accent text-xs block mb-1">Chief Editor Feedback:</strong>
              ${escapeHTML(sub.feedback)}
            </div>
          ` : `
            <div class="text-[11px] text-zinc-400 font-mono">
              Pending review by Faculty of Computing editorial desk.
            </div>
          `}
        </div>
      `;
    }).join('');
  }
// 4. RENDER BOOKMARKS
function renderBookmarks() {
    if (!bookmarksContainer || !window.DataStore) return;
    const bookmarkedIds = window.DataStore.getBookmarks();
    const allArticles = window.DataStore.getArticles();
    const articles = allArticles.filter(a => bookmarkedIds.includes(a.id));

    if (articles.length === 0) {
      const bookSVG = window.AppIcons ? window.AppIcons.get('bookmark', 'svg-icon-xl text-zinc-500 mb-2') : '';
      bookmarksContainer.innerHTML = `
        <div class="py-16 text-center text-zinc-500 font-display">
          ${bookSVG}
          <div class="text-base text-white font-semibold">No saved bookmarks</div>
          <p class="text-xs text-zinc-400 mt-1">Browse campus news and click the bookmark ribbon to save articles for reference.</p>
        </div>
      `;
      return;
    }

    bookmarksContainer.innerHTML = `
      <div class="news-grid">
        ${articles.map(art => `
          <div class="news-card">
            <div class="news-card-image">
              <img src="${art.image || '1im/ezgif-frame-001.jpg'}" alt="${escapeHTML(art.title)}" />
              <div class="news-card-badge-floating">
                <span class="badge-category badge-academic">${art.category}</span>
              </div>
              <button class="news-card-bookmark-btn bookmarked" data-id="${art.id}" title="Remove Bookmark">
                ${window.AppIcons ? window.AppIcons.get('bookmarkFilled') : 'â˜…'}
              </button>
            </div>
            <div class="news-card-body">
              <div class="news-card-meta">
                <span>${art.date}</span>
                <span>&bull;</span>
                <span>${art.readTime}</span>
              </div>
              <h3 class="news-card-title">${escapeHTML(art.title)}</h3>
              <p class="news-card-excerpt">${escapeHTML(art.excerpt)}</p>
              <div class="news-card-footer">
                <span class="author-name">By ${escapeHTML(art.author)}</span>
                <button class="btn-read-story" onclick="openStoryReaderModal(${art.id})">
                  Read Story &rarr;
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Unbookmark handlers
    bookmarksContainer.querySelectorAll('.news-card-bookmark-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'), 10);
        window.DataStore.toggleBookmark(id);
        updateStats();
        renderBookmarks();
        renderBrowseNews();
      });
    });
  }
// 5. RENDER CATEGORY SUBSCRIPTIONS (Topic 1 Requirement)
function renderSubscriptions() {
    if (!subscriptionsContainer || !window.DataStore) return;
    const categories = window.DataStore.getCategories();
    const articles = window.DataStore.getArticles();

    subscriptionsContainer.innerHTML = categories.map(cat => {
      const isSub = window.DataStore.isSubscribed(cat.id);
      const count = articles.filter(a => 
        (a.category && a.category.toLowerCase() === cat.name.toLowerCase()) || 
        (a.categorySlug && a.categorySlug.toLowerCase() === cat.id.toLowerCase())
      ).length;

      const iconSVG = window.AppIcons ? window.AppIcons.get(cat.icon || 'general', 'svg-icon-lg') : '';
      const checkSVG = window.AppIcons ? window.AppIcons.get('check', 'svg-icon-sm') : 'âœ“';
      const bellSVG = window.AppIcons ? window.AppIcons.get('bell', 'svg-icon-sm') : '+';

      return `
        <div class="category-card" style="align-items: stretch; text-align: left;">
          <div class="flex items-center justify-between mb-3">
            <div class="category-icon-wrapper" style="color: ${cat.color}; margin-bottom: 0;">
              ${iconSVG}
            </div>
            <button 
              type="button" 
              class="category-subscribe-btn ${isSub ? 'subscribed' : ''}" 
              data-cat-id="${cat.id}"
            >
              ${isSub ? `${checkSVG} Subscribed` : `${bellSVG} Subscribe`}
            </button>
          </div>
          <div class="category-name text-base font-bold">${escapeHTML(cat.name)} Beat</div>
          <p class="text-xs text-zinc-400 my-2">${escapeHTML(cat.description || '')}</p>
          <div class="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] font-mono text-zinc-500">
            <span>${count} Active Dispatches</span>
            <span class="${isSub ? 'text-emerald-400' : 'text-zinc-500'} font-semibold">
              ${isSub ? 'Subscribed' : 'Not Subscribed'}
            </span>
          </div>
        </div>
      `;
    }).join('');

    subscriptionsContainer.querySelectorAll('.category-subscribe-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const catId = btn.getAttribute('data-cat-id');
        window.DataStore.toggleSubscription(catId);
        updateStats();
        renderSubscriptions();
      });
    });
  }
// 6. STORY READER MODAL & COMMENTING
function setupReaderModal() {
    if (commentForm) {
      commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!activeReaderArticleId || !commentInput) return;
        const text = commentInput.value.trim();
        if (!text) return;

        window.DataStore.addComment(activeReaderArticleId, text);
        commentInput.value = '';
        renderReaderComments(activeReaderArticleId);
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && readerModal && readerModal.classList.contains('open')) {
        closeStudentModal();
      }
    });
  }

  window.openStoryReaderModal = function(id) {
    if (!readerModal || !window.DataStore) return;
    const article = window.DataStore.getArticleById(id);
    if (!article) return;

    activeReaderArticleId = id;
    window.DataStore.incrementArticleViews(id);

    document.getElementById('modal-read-title').textContent = article.title;
    document.getElementById('modal-read-author').textContent = article.author;
    document.getElementById('modal-read-date').textContent = article.date;
    document.getElementById('modal-read-cat').textContent = article.category;
    document.getElementById('modal-read-time').textContent = article.readTime || '4 min read';

    const body = document.getElementById('modal-read-body');
    body.innerHTML = article.content.split('\n\n').map(p => `<p>${escapeHTML(p)}</p>`).join('');

    renderReaderComments(id);

    readerModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeStudentModal = function() {
    if (!readerModal) return;
    readerModal.classList.remove('open');
    document.body.style.overflow = '';
    activeReaderArticleId = null;
  };

  function renderReaderComments(articleId) {
    if (!commentsList || !window.DataStore) return;
    const comments = window.DataStore.getComments(articleId);

    if (comments.length === 0) {
      commentsList.innerHTML = `<div class="text-zinc-400 text-xs py-3 text-center font-mono">No comments yet. Share your thoughts above.</div>`;
      return;
    }

    commentsList.innerHTML = comments.map(cmt => `
      <div class="comment-item">
        <div class="comment-item-header">
          <span class="comment-item-author">${escapeHTML(cmt.author)}</span>
          <span class="comment-item-date">${cmt.date}</span>
        </div>
        <p class="comment-item-text">${escapeHTML(cmt.text)}</p>
      </div>
    `).join('');
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


