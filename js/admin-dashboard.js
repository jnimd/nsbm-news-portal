// admin dashboard functions
(function(window) {
  'use strict';

  let currentArticlesSearch = '';
  let currentArticlesCategory = 'all';
  let activeTab = 'overview';
  let editingArticleId = null;
  let editingAnnouncementId = null;
  let activeReviewSubId = null;
  let searchDebounceTimer = null;

  // DOM Elements
  const tabButtons = document.querySelectorAll('.sidebar-tab-btn');
  const viewPanes = document.querySelectorAll('.dashboard-view-pane');
  const adminProfileName = document.getElementById('admin-profile-name');
  const adminProfileTitle = document.getElementById('admin-profile-title');
  const logoutBtn = document.getElementById('admin-logout-btn');
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const sidebar = document.querySelector('.dashboard-sidebar');

  // Stats elements
  const statTotalArticles = document.getElementById('admin-stat-articles');
  const statTotalViews = document.getElementById('admin-stat-views');
  const statPending = document.getElementById('admin-stat-pending');
  const statComments = document.getElementById('admin-stat-comments');

  // Views & Containers
  const articlesTableBody = document.getElementById('admin-articles-tbody');
  const submissionsTableBody = document.getElementById('admin-submissions-tbody');
  const announcementsTableBody = document.getElementById('admin-announcements-tbody');
  const categoriesTableBody = document.getElementById('admin-categories-tbody');
  const commentsTableBody = document.getElementById('admin-comments-tbody');
  const chartContainer = document.getElementById('admin-category-chart');
  const topStoriesContainer = document.getElementById('admin-top-stories-list');

  // Modals & Forms
  const articleModal = document.getElementById('admin-article-modal');
  const articleModalTitle = document.getElementById('modal-editor-title');
  const articleForm = document.getElementById('admin-article-form');
  const reviewModal = document.getElementById('admin-review-modal');
  const categoryModal = document.getElementById('admin-category-modal');
  const categoryForm = document.getElementById('admin-category-form');
  const announcementModal = document.getElementById('admin-announcement-modal');
  const announcementForm = document.getElementById('admin-announcement-form');

  function init() {
    renderStaticIcons();
    setupAdminSession();
    setupNavigation();
    setupModalsAndForms();
    renderAll();
    setupMobileMenu();
  }
// STATIC SVG ICONS
function renderStaticIcons() {
    if (!window.AppIcons) return;

    // Sidebar tab icons
    const iconOverview = document.getElementById('admin-tab-icon-overview');
    if (iconOverview) iconOverview.innerHTML = window.AppIcons.get('chart', 'svg-icon-sm');

    const iconArticles = document.getElementById('admin-tab-icon-articles');
    if (iconArticles) iconArticles.innerHTML = window.AppIcons.get('news', 'svg-icon-sm');

    const iconApprovals = document.getElementById('admin-tab-icon-approvals');
    if (iconApprovals) iconApprovals.innerHTML = window.AppIcons.get('clock', 'svg-icon-sm');

    const iconAnnouncements = document.getElementById('admin-tab-icon-announcements');
    if (iconAnnouncements) iconAnnouncements.innerHTML = window.AppIcons.get('announcement', 'svg-icon-sm');

    const iconCategories = document.getElementById('admin-tab-icon-categories');
    if (iconCategories) iconCategories.innerHTML = window.AppIcons.get('tag', 'svg-icon-sm');

    const iconComments = document.getElementById('admin-tab-icon-comments');
    if (iconComments) iconComments.innerHTML = window.AppIcons.get('comment', 'svg-icon-sm');

    const iconPortal = document.getElementById('admin-tab-icon-portal');
    if (iconPortal) iconPortal.innerHTML = window.AppIcons.get('externalLink', 'svg-icon-sm');

    const iconLogout = document.getElementById('admin-tab-icon-logout');
    if (iconLogout) iconLogout.innerHTML = window.AppIcons.get('logout', 'svg-icon-sm');

    const searchIconSlot = document.getElementById('admin-search-icon-slot');
    if (searchIconSlot) searchIconSlot.innerHTML = window.AppIcons.get('search');

    // Stat bubble icons
    const statArt = document.getElementById('stat-icon-admin-articles');
    if (statArt) statArt.innerHTML = window.AppIcons.get('news');

    const statView = document.getElementById('stat-icon-admin-views');
    if (statView) statView.innerHTML = window.AppIcons.get('eye');

    const statPend = document.getElementById('stat-icon-admin-pending');
    if (statPend) statPend.innerHTML = window.AppIcons.get('clock');

    const statComm = document.getElementById('stat-icon-admin-comments');
    if (statComm) statComm.innerHTML = window.AppIcons.get('comment');
  }
// ADMIN SESSION SETUP (AUTHENTICATED GUARDS)
function setupAdminSession() {
    if (!window.DataStore) return;
    let user = window.DataStore.getCurrentUser();
    if (!user || user.role !== 'admin') {
      window.location.replace('login.html?error=unauthorized');
      return;
    }

    if (adminProfileName) adminProfileName.textContent = user.name || 'NSBM Editorial Administrator';
    if (adminProfileTitle) adminProfileTitle.textContent = user.title || 'Chief Newsdesk Administrator';

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        window.DataStore.logout();
        window.location.href = 'index.html';
      });
    }
  }
// NAVIGATION & TABS
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
        renderAll();

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
// RENDER EVERYTHING
function renderAll() {
    renderStatsAndAnalytics();
    renderArticlesCRUDTable();
    renderSubmissionsQueue();
    renderAnnouncementsTable();
    renderCategoriesTable();
    renderCommentsTable();
  }
// 1. STATS & READERSHIP REPORTS
function renderStatsAndAnalytics() {
    if (!window.DataStore) return;
    const analytics = window.DataStore.getAnalytics();

    if (statTotalArticles) statTotalArticles.textContent = analytics.totalArticles;
    if (statTotalViews) statTotalViews.textContent = analytics.totalViews.toLocaleString();
    if (statPending) statPending.textContent = analytics.pendingSubmissions;
    if (statComments) statComments.textContent = analytics.totalComments;

    // Badges in sidebar
    const pendingBadge = document.getElementById('badge-admin-pending');
    if (pendingBadge) pendingBadge.textContent = analytics.pendingSubmissions;

    const articlesBadge = document.getElementById('badge-admin-articles');
    if (articlesBadge) articlesBadge.textContent = analytics.totalArticles;

    // Category breakdown bar chart
    if (chartContainer) {
      const categories = window.DataStore.getCategories();
      const maxCount = Math.max(1, ...Object.values(analytics.categoryCounts));

      chartContainer.innerHTML = categories.map(cat => {
        const count = analytics.categoryCounts[cat.name] || 0;
        const pct = Math.round((count / maxCount) * 100);
        const iconSVG = window.AppIcons ? window.AppIcons.get(cat.icon || 'general', 'svg-icon-sm') : '';

        return `
          <div class="chart-bar-item">
            <div class="chart-bar-meta">
              <span class="font-semibold flex items-center gap-2">
                <span style="color: ${cat.color};">${iconSVG}</span> ${cat.name} Beat
              </span>
              <span class="text-zinc-400 font-mono">${count} Dispatches</span>
            </div>
            <div class="chart-bar-track">
              <div class="chart-bar-fill" style="width: ${pct}%; background-color: ${cat.color};"></div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Top Read Articles
    if (topStoriesContainer) {
      const eyeSVG = window.AppIcons ? window.AppIcons.get('eye', 'svg-icon-sm') : '';
      topStoriesContainer.innerHTML = analytics.topArticles.map((art, idx) => `
        <div class="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
          <div class="flex items-center gap-3">
            <span class="w-6 h-6 rounded-md bg-white/10 text-white font-mono text-xs flex items-center justify-center font-bold">
              #${idx + 1}
            </span>
            <div>
              <h4 class="text-xs font-semibold truncate max-w-xs md:max-w-md">${escapeHTML(art.title)}</h4>
              <span class="text-[10px] text-zinc-400 font-mono">${art.category} &bull; By ${escapeHTML(art.author)}</span>
            </div>
          </div>
          <span class="font-mono text-brand-accent text-xs font-bold shrink-0 flex items-center gap-1">
            ${eyeSVG} ${art.views || 0}
          </span>
        </div>
      `).join('');
    }
  }
// 2. ARTICLES FULL CRUD OPERATIONS
function renderArticlesCRUDTable() {
    if (!articlesTableBody || !window.DataStore) return;

    const articles = window.DataStore.getArticles({
      search: currentArticlesSearch,
      category: currentArticlesCategory
    });

    if (articles.length === 0) {
      articlesTableBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-10 text-zinc-500 font-display">
            No articles match the current filter.
          </td>
        </tr>
      `;
      return;
    }

    const eyeSVG = window.AppIcons ? window.AppIcons.get('eye', 'svg-icon-sm') : '';

    articlesTableBody.innerHTML = articles.map(art => `
      <tr>
        <td class="font-mono text-xs text-zinc-400">#${art.id}</td>
        <td>
          <div class="font-bold text-xs hover:text-brand-accent transition-colors max-w-sm truncate">
            ${escapeHTML(art.title)}
          </div>
          <span class="text-[10px] text-zinc-400 font-mono">${art.readTime || '4 min'} &bull; ${art.date}</span>
        </td>
        <td>
          <span class="badge-category badge-academic">${art.category}</span>
        </td>
        <td class="text-xs">${escapeHTML(art.author)}</td>
        <td class="font-mono text-xs text-zinc-400">
          <span class="flex items-center gap-1">${eyeSVG} ${art.views || 0}</span>
        </td>
        <td>
          <div class="table-action-btns">
            <button class="btn-table-action" onclick="openEditArticleModal(${art.id})" title="Edit Article">
              Edit
            </button>
            <button class="btn-table-action btn-action-reject" onclick="deleteArticle(${art.id})" title="Delete Article">
              Delete
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // Search & category filter setup
  const searchInput = document.getElementById('admin-articles-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(() => {
        currentArticlesSearch = e.target.value.trim();
        renderArticlesCRUDTable();
      }, 150);
    });
  }

  const categorySelect = document.getElementById('admin-articles-cat-filter');
  if (categorySelect && window.DataStore) {
    const categories = window.DataStore.getCategories();
    categorySelect.innerHTML = `
      <option value="all">All Categories</option>
      ${categories.map(c => `<option value="${c.name.toLowerCase()}">${c.name}</option>`).join('')}
    `;

    categorySelect.addEventListener('change', (e) => {
      currentArticlesCategory = e.target.value;
      renderArticlesCRUDTable();
    });
  }

  // Modal actions
  window.openCreateArticleModal = function() {
    editingArticleId = null;
    if (articleModalTitle) articleModalTitle.textContent = 'Create New Campus Dispatch';
    if (articleForm) articleForm.reset();
    populateCategoryDropdown('modal-art-category');
    if (articleModal) articleModal.classList.add('open');
  };

  window.openEditArticleModal = function(id) {
    const article = window.DataStore.getArticleById(id);
    if (!article) return;

    editingArticleId = id;
    if (articleModalTitle) articleModalTitle.textContent = `Edit Dispatch #${id}`;
    populateCategoryDropdown('modal-art-category');

    document.getElementById('modal-art-title').value = article.title;
    document.getElementById('modal-art-category').value = article.category;
    document.getElementById('modal-art-author').value = article.author;
    document.getElementById('modal-art-readtime').value = article.readTime || '4 min read';
    document.getElementById('modal-art-image').value = article.image || '1im/ezgif-frame-001.jpg';
    document.getElementById('modal-art-excerpt').value = article.excerpt || '';
    document.getElementById('modal-art-content').value = article.content || '';
    document.getElementById('modal-art-featured').checked = Boolean(article.featured);

    if (articleModal) articleModal.classList.add('open');
  };

  window.closeArticleModal = function() {
    if (articleModal) articleModal.classList.remove('open');
    editingArticleId = null;
  };

  window.deleteArticle = function(id) {
    if (confirm(`Are you sure you want to delete article #${id}? This action cannot be undone.`)) {
      window.DataStore.deleteArticle(id);
      renderAll();
    }
  };

  function populateCategoryDropdown(elementId) {
    const select = document.getElementById(elementId);
    if (!select || !window.DataStore) return;
    const categories = window.DataStore.getCategories();
    select.innerHTML = categories.map(c => `
      <option value="${c.name}">${c.name}</option>
    `).join('');
  }
// 3. STUDENT SUBMISSION APPROVAL QUEUE
function renderSubmissionsQueue() {
    if (!submissionsTableBody || !window.DataStore) return;
    const submissions = window.DataStore.getSubmissions();

    if (submissions.length === 0) {
      submissionsTableBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-10 text-zinc-500 font-display">
            No submissions in the editorial queue.
          </td>
        </tr>
      `;
      return;
    }

    submissionsTableBody.innerHTML = submissions.map(sub => {
      let statusBadge = `<span class="status-badge status-pending">Pending</span>`;
      if (sub.status === 'approved') {
        statusBadge = `<span class="status-badge status-approved">Approved</span>`;
      } else if (sub.status === 'rejected') {
        statusBadge = `<span class="status-badge status-rejected">Revisions</span>`;
      }

      return `
        <tr>
          <td class="font-mono text-xs text-zinc-400">${sub.id}</td>
          <td>
            <div class="font-bold text-xs max-w-sm truncate">${escapeHTML(sub.title)}</div>
            <span class="text-[10px] text-zinc-400 font-mono">${sub.submittedDate}</span>
          </td>
          <td><span class="badge-category badge-academic">${sub.category}</span></td>
          <td class="text-xs">
            <div>${escapeHTML(sub.author)}</div>
            <div class="text-[10px] text-zinc-400 font-mono">${sub.studentId}</div>
          </td>
          <td>${statusBadge}</td>
          <td>
            <div class="table-action-btns">
              <button class="btn-table-action" onclick="openReviewModal('${sub.id}')">
                Review & Decide &rarr;
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  window.openReviewModal = function(subId) {
    const submissions = window.DataStore.getSubmissions();
    const sub = submissions.find(s => s.id === subId);
    if (!sub) return;

    activeReviewSubId = subId;
    document.getElementById('review-sub-title').textContent = sub.title;
    document.getElementById('review-sub-author').textContent = `${sub.author} (${sub.studentId})`;
    document.getElementById('review-sub-category').textContent = sub.category;
    document.getElementById('review-sub-date').textContent = sub.submittedDate;
    document.getElementById('review-sub-content').innerHTML = sub.content.split('\n\n').map(p => `<p>${escapeHTML(p)}</p>`).join('');
    document.getElementById('review-feedback-input').value = sub.feedback || '';

    if (reviewModal) reviewModal.classList.add('open');
  };

  window.closeReviewModal = function() {
    if (reviewModal) reviewModal.classList.remove('open');
    activeReviewSubId = null;
  };

  window.decideSubmission = function(decision) {
    if (!activeReviewSubId) return;
    const feedback = document.getElementById('review-feedback-input').value.trim();

    window.DataStore.updateSubmissionStatus(activeReviewSubId, decision, feedback);
    closeReviewModal();
    renderAll();
  };
// 4. ANNOUNCEMENTS & TICKER MANAGER (CRUD)
function renderAnnouncementsTable() {
    if (!announcementsTableBody || !window.DataStore) return;
    const announcements = window.DataStore.getAnnouncements();

    if (announcements.length === 0) {
      announcementsTableBody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center py-10 text-zinc-500 font-display">
            No active campus announcements published.
          </td>
        </tr>
      `;
      return;
    }

    announcementsTableBody.innerHTML = announcements.map(ann => {
      let badgeStyle = 'badge-academic';
      if (ann.badge === 'URGENT') badgeStyle = 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
      if (ann.badge === 'SPORTS') badgeStyle = 'badge-sports';
      if (ann.badge === 'GENERAL') badgeStyle = 'badge-general';

      return `
        <tr>
          <td class="font-mono text-xs text-zinc-400">${ann.id}</td>
          <td>
            <div class="font-bold text-xs max-w-sm truncate">${escapeHTML(ann.title)}</div>
            <div class="text-[11px] text-zinc-400 truncate max-w-sm">${escapeHTML(ann.summary)}</div>
          </td>
          <td><span class="badge-category ${badgeStyle}">${ann.category}</span></td>
          <td class="font-mono text-xs font-bold">${ann.badge}</td>
          <td class="text-xs text-zinc-400 font-mono">${ann.date}</td>
          <td>
            <button class="btn-table-action ${ann.pinned ? 'btn-action-approve' : ''}" onclick="togglePinAnnouncement('${ann.id}')">
              ${ann.pinned ? 'ðŸ“Œ Pinned' : 'Unpinned'}
            </button>
          </td>
          <td>
            <button class="btn-table-action btn-action-reject" onclick="deleteAnnouncement('${ann.id}')">
              Delete
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  window.openCreateAnnouncementModal = function() {
    editingAnnouncementId = null;
    if (announcementForm) announcementForm.reset();
    if (announcementModal) announcementModal.classList.add('open');
  };

  window.closeAnnouncementModal = function() {
    if (announcementModal) announcementModal.classList.remove('open');
  };

  window.togglePinAnnouncement = function(id) {
    window.DataStore.toggleAnnouncementPin(id);
    renderAnnouncementsTable();
  };

  window.deleteAnnouncement = function(id) {
    if (confirm('Delete this announcement directive?')) {
      window.DataStore.deleteAnnouncement(id);
      renderAll();
    }
  };
// 5. CATEGORY MANAGEMENT
function renderCategoriesTable() {
    if (!categoriesTableBody || !window.DataStore) return;
    const categories = window.DataStore.getCategories();
    const articles = window.DataStore.getArticles();

    categoriesTableBody.innerHTML = categories.map(cat => {
      const count = articles.filter(a => 
        (a.category && a.category.toLowerCase() === cat.name.toLowerCase()) || 
        (a.categorySlug && a.categorySlug.toLowerCase() === cat.id.toLowerCase())
      ).length;

      const iconSVG = window.AppIcons ? window.AppIcons.get(cat.icon || 'general', 'svg-icon-sm') : '';

      return `
        <tr>
          <td>
            <span style="color: ${cat.color};">${iconSVG}</span>
          </td>
          <td class="font-bold text-xs">${escapeHTML(cat.name)}</td>
          <td class="font-mono text-xs text-zinc-400">${cat.id}</td>
          <td class="text-xs text-zinc-400">${escapeHTML(cat.description || '-')}</td>
          <td class="font-mono text-xs font-bold text-brand-accent">${count}</td>
          <td>
            <button class="btn-table-action btn-action-reject" onclick="deleteCategory('${cat.id}')">
              Delete
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  window.openAddCategoryModal = function() {
    if (categoryForm) categoryForm.reset();
    if (categoryModal) categoryModal.classList.add('open');
  };

  window.closeCategoryModal = function() {
    if (categoryModal) categoryModal.classList.remove('open');
  };

  window.deleteCategory = function(catId) {
    if (confirm(`Delete category '${catId}'? Articles assigned to this will remain intact.`)) {
      window.DataStore.deleteCategory(catId);
      renderAll();
    }
  };
// 6. COMMENT MODERATION
function renderCommentsTable() {
    if (!commentsTableBody || !window.DataStore) return;
    const comments = window.DataStore.getComments();
    const articles = window.DataStore.getArticles();

    if (comments.length === 0) {
      commentsTableBody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center py-10 text-zinc-500 font-display">
            No student comments on record.
          </td>
        </tr>
      `;
      return;
    }

    commentsTableBody.innerHTML = comments.map(c => {
      const targetArt = articles.find(a => a.id === c.articleId);
      const targetTitle = targetArt ? targetArt.title : `Dispatch #${c.articleId}`;

      return `
        <tr>
          <td>
            <div class="font-bold text-xs">${escapeHTML(c.author)}</div>
            <span class="text-[10px] text-zinc-400 font-mono">${escapeHTML(c.role || 'Student')}</span>
          </td>
          <td class="text-xs max-w-md">${escapeHTML(c.text)}</td>
          <td class="text-xs text-brand-accent max-w-xs truncate">${escapeHTML(targetTitle)}</td>
          <td class="text-xs text-zinc-400 font-mono">${c.date}</td>
          <td>
            <button class="btn-table-action btn-action-reject" onclick="deleteComment('${c.id}')">
              Remove
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  window.deleteComment = function(cmtId) {
    if (confirm('Are you sure you want to remove this reader comment?')) {
      window.DataStore.deleteComment(cmtId);
      renderAll();
    }
  };
// FORM SUBMISSION LISTENERS
function setupModalsAndForms() {
    // Article Form Submit (Create / Edit)
    if (articleForm) {
      articleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('modal-art-title').value.trim();
        const category = document.getElementById('modal-art-category').value;
        const author = document.getElementById('modal-art-author').value.trim();
        const readTime = document.getElementById('modal-art-readtime').value.trim();
        const image = document.getElementById('modal-art-image').value.trim();
        const excerpt = document.getElementById('modal-art-excerpt').value.trim();
        const content = document.getElementById('modal-art-content').value.trim();
        const featured = document.getElementById('modal-art-featured').checked;

        if (editingArticleId) {
          window.DataStore.updateArticle(editingArticleId, {
            title, category, author, readTime, image, excerpt, content, featured
          });
        } else {
          window.DataStore.createArticle({
            title, category, author, readTime, image, excerpt, content, featured
          });
        }

        closeArticleModal();
        renderAll();
      });
    }

    // Category Form Submit
    if (categoryForm) {
      categoryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('modal-cat-name').value.trim();
        const icon = document.getElementById('modal-cat-icon').value || 'general';
        const color = document.getElementById('modal-cat-color').value || '#6366f1';
        const description = document.getElementById('modal-cat-desc').value.trim();

        if (name) {
          window.DataStore.addCategory({ name, icon, color, description });
          closeCategoryModal();
          renderAll();
        }
      });
    }

    // Announcement Form Submit
    if (announcementForm) {
      announcementForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('modal-ann-title').value.trim();
        const category = document.getElementById('modal-ann-category').value;
        const badge = document.getElementById('modal-ann-badge').value;
        const summary = document.getElementById('modal-ann-summary').value.trim();
        const pinned = document.getElementById('modal-ann-pinned').checked;

        if (title && summary) {
          window.DataStore.createAnnouncement({ title, category, badge, summary, pinned });
          closeAnnouncementModal();
          renderAll();
        }
      });
    }

    // ESC to close any modal
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeArticleModal();
        closeReviewModal();
        closeCategoryModal();
        closeAnnouncementModal();
      }
    });
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


