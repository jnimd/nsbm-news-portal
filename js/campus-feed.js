// campus social feed
(function(window) {
  'use strict';

  let currentCategory = 'all';
  let searchQuery = '';

  document.addEventListener('DOMContentLoaded', initFeed);

  function initFeed() {
    renderUserProfile();
    bindEvents();
    renderFeed();
    renderAnnouncementsWidget();
  }

  function renderUserProfile() {
    const user = window.DataStore ? window.DataStore.getCurrentUser() : null;
    const nameEl = document.getElementById('feedUserName');
    const roleEl = document.getElementById('feedUserRole');
    const facultyEl = document.getElementById('feedUserFaculty');
    const avatarEl = document.getElementById('feedUserAvatar');
    const navAvatarEl = document.getElementById('feedNavAvatar');
    const navNameEl = document.getElementById('feedNavName');

    const displayName = user ? user.name : 'Kasun Perera';
    const displayRole = user ? (user.role === 'admin' ? 'Chief Editor & Press Director' : (user.title || 'Student Contributor')) : 'Computing Undergrad';
    const displayFaculty = user ? (user.faculty || 'Faculty of Computing') : 'Faculty of Computing';
    const initial = displayName.charAt(0).toUpperCase();

    if (nameEl) nameEl.textContent = displayName;
    if (roleEl) roleEl.textContent = displayRole;
    if (facultyEl) facultyEl.textContent = displayFaculty;
    if (avatarEl) avatarEl.textContent = initial;
    if (navAvatarEl) navAvatarEl.textContent = initial;
    if (navNameEl) navNameEl.textContent = displayName.split(' ')[0];
  }

  function bindEvents() {
    // Filter Pills
    const pills = document.querySelectorAll('.feed-filter-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentCategory = pill.dataset.category || 'all';
        renderFeed();
      });
    });

    // Search Input
    const searchInput = document.getElementById('feedSearchInput');
    if (searchInput) {
      let timeout;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          searchQuery = e.target.value.trim().toLowerCase();
          renderFeed();
        }, 200);
      });
    }

    // Modal Trigger
    const openComposerBtn = document.getElementById('openComposerBtn');
    const modalBackdrop = document.getElementById('feedComposerModal');
    const closeComposerBtn = document.getElementById('closeComposerBtn');
    const cancelComposerBtn = document.getElementById('cancelComposerBtn');
    const submitPostBtn = document.getElementById('submitPostBtn');

    const mobileComposeTrigger = document.getElementById('mobileComposeTrigger');
    if (mobileComposeTrigger && modalBackdrop) {
      mobileComposeTrigger.addEventListener('click', () => modalBackdrop.classList.add('open'));
    }

    const mobileThemeToggleBtn = document.getElementById('mobileThemeToggleBtn');
    if (mobileThemeToggleBtn && window.ThemeEngine) {
      mobileThemeToggleBtn.addEventListener('click', () => window.ThemeEngine.toggle());
    }

    if (openComposerBtn && modalBackdrop) {
      openComposerBtn.addEventListener('click', () => modalBackdrop.classList.add('open'));
    }
    if (closeComposerBtn && modalBackdrop) {
      closeComposerBtn.addEventListener('click', () => modalBackdrop.classList.remove('open'));
    }
    if (cancelComposerBtn && modalBackdrop) {
      cancelComposerBtn.addEventListener('click', () => modalBackdrop.classList.remove('open'));
    }

    // Submit Custom Post
    if (submitPostBtn && modalBackdrop) {
      submitPostBtn.addEventListener('click', () => {
        const textInput = document.getElementById('postContentInput');
        const catSelect = document.getElementById('postCategorySelect');
        const imgSelect = document.getElementById('postImageSelect');

        const content = textInput ? textInput.value.trim() : '';
        if (!content) {
          alert('Please enter some text for your campus post.');
          return;
        }

        const category = catSelect ? catSelect.value : 'General';
        const image = imgSelect ? imgSelect.value : null;

        if (window.DataStore && window.DataStore.createSocialPost) {
          window.DataStore.createSocialPost({
            content: content,
            category: category,
            image: image,
            tags: ['#NSBM', '#' + category.replace(/\s+/g, ''), '#CampusBuzz']
          });
        }

        modalBackdrop.classList.remove('open');
        if (textInput) textInput.value = '';
        showToast('Campus post published to feed!');
        renderFeed();
      });
    }

    // Hashtag clicks from trending widget
    document.querySelectorAll('.trending-topic-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const tag = item.dataset.tag;
        if (tag && searchInput) {
          searchInput.value = tag;
          searchQuery = tag.toLowerCase();
          renderFeed();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  }

  function renderFeed() {
    const container = document.getElementById('feedPostsContainer');
    if (!container) return;

    if (!window.DataStore) {
      container.innerHTML = '<div class="feed-card" style="text-align:center; padding:2rem;">Data store not loaded.</div>';
      return;
    }

    let posts = window.DataStore.getSocialPosts(currentCategory);

    // Apply search filter if present
    if (searchQuery) {
      posts = posts.filter(p => {
        const titleMatch = (p.title || '').toLowerCase().includes(searchQuery);
        const textMatch = (p.content || '').toLowerCase().includes(searchQuery);
        const authorMatch = (p.author || '').toLowerCase().includes(searchQuery);
        const catMatch = (p.category || '').toLowerCase().includes(searchQuery);
        const tagMatch = (p.tags || []).some(t => t.toLowerCase().includes(searchQuery));
        return titleMatch || textMatch || authorMatch || catMatch || tagMatch;
      });
    }

    if (posts.length === 0) {
      container.innerHTML = `
        <div class="feed-card" style="text-align:center; padding: 3rem 1.5rem;">
          <div style="font-size: 1.15rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-primary);">No campus dispatches found</div>
          <div style="font-size: 0.88rem; color: var(--text-muted);">Try selecting another category or clearing your search keywords.</div>
        </div>
      `;
      return;
    }

    container.innerHTML = posts.map(post => createPostCardHtml(post)).join('');
    bindPostInteractions(container);
  }

  function createPostCardHtml(post) {
    const userInitial = (post.author || 'N').charAt(0).toUpperCase();
    const verifiedIcon = window.AppIcons ? window.AppIcons.get('check', 'post-author-verified') : 'âœ“';
    const likeIcon = post.isLiked 
      ? (window.AppIcons ? window.AppIcons.get('thumbsUpFilled') : '👍')
      : (window.AppIcons ? window.AppIcons.get('thumbsUp') : '👍');
    const commentIcon = window.AppIcons ? window.AppIcons.get('comment') : 'Comment';
    const shareIcon = window.AppIcons ? window.AppIcons.get('share') : 'Share';
    const bookmarkIcon = (window.DataStore && post.articleId && window.DataStore.isBookmarked(post.articleId))
      ? (window.AppIcons ? window.AppIcons.get('bookmarkFilled') : 'Saved')
      : (window.AppIcons ? window.AppIcons.get('bookmark') : 'Save');

    const isBookmarked = window.DataStore && post.articleId && window.DataStore.isBookmarked(post.articleId);

    const tagsHtml = (post.tags || []).map(t => `<span class="post-hashtag">${t}</span>`).join(' ');

    const mediaHtml = post.image ? `
      <div class="post-media">
        <img src="${post.image}" alt="${escapeHtml(post.title || post.author)}" loading="lazy">
        ${post.imageCaption ? `<div class="post-media-caption">${escapeHtml(post.imageCaption)}</div>` : ''}
      </div>
    ` : '';

    const headlineHtml = post.title ? `<h3 class="post-headline">${escapeHtml(post.title)}</h3>` : '';

    const commentsListHtml = (post.comments || []).map(c => `
      <div class="comment-bubble">
        <div class="comment-avatar">${(c.author || 'S').charAt(0).toUpperCase()}</div>
        <div class="comment-content">
          <div class="comment-author-name">
            ${escapeHtml(c.author || 'Student Reader')}
            <span class="comment-author-role">${escapeHtml(c.role || '')}</span>
          </div>
          <div class="comment-text">${escapeHtml(c.text || '')}</div>
        </div>
      </div>
    `).join('');

    const sendIcon = window.AppIcons ? window.AppIcons.get('send') : '>';

    return `
      <article class="social-post-card" id="${post.id}" data-article-id="${post.articleId || ''}">
        <header class="post-header">
          <div class="post-author-block">
            <div class="post-author-avatar">${userInitial}</div>
            <div class="post-author-meta">
              <div class="post-author-name">
                ${escapeHtml(post.author)}
                ${verifiedIcon}
              </div>
              <div class="post-meta-sub">
                <span>${escapeHtml(post.role)}</span>
                <span>&bull;</span>
                <span>${escapeHtml(post.date)}</span>
                <span>&bull;</span>
                <span class="post-category-tag">${escapeHtml(post.category)}</span>
              </div>
            </div>
          </div>
        </header>

        <div class="post-body">
          ${headlineHtml}
          <div class="post-text">${escapeHtml(post.content || post.excerpt)}</div>
          <div class="post-tags">${tagsHtml}</div>
        </div>

        ${mediaHtml}

        <div class="post-stats-bar">
          <div class="post-stats-left">
            <div class="reaction-icons-stack">
              <span class="rxn-badge rxn-blue" title="Like">👍</span>
              <span class="rxn-badge rxn-red" title="Love">❤️</span>
              <span class="rxn-badge rxn-yellow" title="Insightful">💡</span>
            </div>
            <span class="like-counter" id="like-count-${post.id}">${post.likesCount}</span>
          </div>
          <div class="post-stats-right">
            <span><span class="comment-counter">${(post.comments || []).length}</span> Comments</span>
            <span>&bull;</span>
            <span>${post.sharesCount} Shares</span>
          </div>
        </div>

        <div class="post-actions-bar">
          <button class="post-action-btn like-btn ${post.isLiked ? 'active-like' : ''}" data-post-id="${post.id}" data-article-id="${post.articleId || ''}">
            <span class="icon-wrap">${likeIcon}</span>
            <span>${post.isLiked ? 'Liked' : 'Like'}</span>
          </button>
          
          <button class="post-action-btn comment-btn" data-post-id="${post.id}">
            <span class="icon-wrap">${commentIcon}</span>
            <span>Comment</span>
          </button>
          
          <button class="post-action-btn share-btn" data-post-id="${post.id}" data-title="${escapeHtml(post.title || 'NSBM News')}">
            <span class="icon-wrap">${shareIcon}</span>
            <span>Share</span>
          </button>
          
          <button class="post-action-btn bookmark-btn ${isBookmarked ? 'active-bookmark' : ''}" data-article-id="${post.articleId || ''}">
            <span class="icon-wrap">${bookmarkIcon}</span>
            <span>${isBookmarked ? 'Saved' : 'Save'}</span>
          </button>
        </div>

        <div class="post-comments-container" id="comments-${post.id}">
          <div class="comment-list" id="comment-list-${post.id}">
            ${commentsListHtml}
          </div>
          <div class="comment-composer-box">
            <div class="comment-avatar" style="background:#10b981;">K</div>
            <input type="text" class="comment-input-field" placeholder="Write a comment on this dispatch..." id="comment-input-${post.id}">
            <button class="comment-submit-btn" data-post-id="${post.id}" data-article-id="${post.articleId || ''}" title="Post Comment">
              ${sendIcon}
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function bindPostInteractions(container) {
    // Like button
    container.querySelectorAll('.like-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const articleId = btn.dataset.articleId;
        const postId = btn.dataset.postId;
        const countSpan = document.getElementById(`like-count-${postId}`);
        const iconWrap = btn.querySelector('.icon-wrap');
        const label = btn.querySelector('span:last-child');

        if (articleId && window.DataStore) {
          const res = window.DataStore.toggleLike(articleId);
          if (countSpan) countSpan.textContent = res.count;
          if (res.liked) {
            btn.classList.add('active-like');
            if (iconWrap && window.AppIcons) iconWrap.innerHTML = window.AppIcons.get('heartFilled');
            if (label) label.textContent = 'Liked';
          } else {
            btn.classList.remove('active-like');
            if (iconWrap && window.AppIcons) iconWrap.innerHTML = window.AppIcons.get('heart');
            if (label) label.textContent = 'Like';
          }
        } else {
          // Fallback for custom user posts
          btn.classList.toggle('active-like');
          const isLiked = btn.classList.contains('active-like');
          let count = parseInt(countSpan.textContent, 10) || 0;
          count = isLiked ? count + 1 : Math.max(0, count - 1);
          if (countSpan) countSpan.textContent = count;
          if (iconWrap && window.AppIcons) iconWrap.innerHTML = window.AppIcons.get(isLiked ? 'heartFilled' : 'heart');
          if (label) label.textContent = isLiked ? 'Liked' : 'Like';
        }
      });
    });

    // Toggle comments
    container.querySelectorAll('.comment-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const postId = btn.dataset.postId;
        const commentSection = document.getElementById(`comments-${postId}`);
        if (commentSection) {
          commentSection.classList.toggle('open');
          if (commentSection.classList.contains('open')) {
            const input = document.getElementById(`comment-input-${postId}`);
            if (input) input.focus();
          }
        }
      });
    });

    // Share button
    container.querySelectorAll('.share-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const title = btn.dataset.title;
        const url = window.location.href.split('#')[0] + '#' + btn.dataset.postId;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(url).then(() => {
            showToast('Post link copied to clipboard!');
          }).catch(() => {
            showToast('Ready to share with campus community!');
          });
        } else {
          showToast('Ready to share with campus community!');
        }
      });
    });

    // Bookmark button
    container.querySelectorAll('.bookmark-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const articleId = btn.dataset.articleId;
        if (!articleId) {
          showToast('Saved to your temporary bookmarks');
          btn.classList.toggle('active-bookmark');
          return;
        }

        if (window.DataStore) {
          const bookmarked = window.DataStore.toggleBookmark(articleId);
          const iconWrap = btn.querySelector('.icon-wrap');
          const label = btn.querySelector('span:last-child');

          if (bookmarked) {
            btn.classList.add('active-bookmark');
            if (iconWrap && window.AppIcons) iconWrap.innerHTML = window.AppIcons.get('bookmarkFilled');
            if (label) label.textContent = 'Saved';
            showToast('Article saved to your Student Dashboard reading list!');
          } else {
            btn.classList.remove('active-bookmark');
            if (iconWrap && window.AppIcons) iconWrap.innerHTML = window.AppIcons.get('bookmark');
            if (label) label.textContent = 'Save';
            showToast('Article removed from bookmarks.');
          }
        }
      });
    });

    // Submit comment
    container.querySelectorAll('.comment-submit-btn').forEach(btn => {
      const submitComment = () => {
        const postId = btn.dataset.postId;
        const articleId = btn.dataset.articleId;
        const input = document.getElementById(`comment-input-${postId}`);
        const text = input ? input.value.trim() : '';

        if (!text) return;

        const user = window.DataStore ? window.DataStore.getCurrentUser() : null;
        const author = user ? user.name : 'Kasun Perera';
        const role = user ? (user.role === 'admin' ? 'Chief Editor' : 'Computing Undergrad') : 'Computing Undergrad';

        if (articleId && window.DataStore) {
          window.DataStore.addComment(articleId, text, author, role);
        }

        // Append to UI immediately
        const list = document.getElementById(`comment-list-${postId}`);
        if (list) {
          const newBubble = document.createElement('div');
          newBubble.className = 'comment-bubble';
          newBubble.innerHTML = `
            <div class="comment-avatar" style="background:#10b981;">${author.charAt(0).toUpperCase()}</div>
            <div class="comment-content">
              <div class="comment-author-name">
                ${escapeHtml(author)}
                <span class="comment-author-role">${escapeHtml(role)} &bull; Just now</span>
              </div>
              <div class="comment-text">${escapeHtml(text)}</div>
            </div>
          `;
          list.appendChild(newBubble);
        }

        // Increment counter
        const card = document.getElementById(postId);
        if (card) {
          const counter = card.querySelector('.comment-counter');
          if (counter) {
            counter.textContent = (parseInt(counter.textContent, 10) || 0) + 1;
          }
        }

        if (input) input.value = '';
        showToast('Comment posted!');
      };

      btn.addEventListener('click', submitComment);

      const postId = btn.dataset.postId;
      const input = document.getElementById(`comment-input-${postId}`);
      if (input) {
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            submitComment();
          }
        });
      }
    });
  }

  function renderAnnouncementsWidget() {
    const list = document.getElementById('feedAnnouncementsList');
    if (!list || !window.DataStore) return;

    const announcements = window.DataStore.getAnnouncements().slice(0, 3);
    list.innerHTML = announcements.map(a => `
      <div style="padding: 0.65rem 0; border-bottom: 1px solid var(--border-subtle);">
        <div style="display:flex; align-items:center; gap:0.4rem; margin-bottom: 0.2rem;">
          <span style="font-size:0.65rem; background:rgba(239, 68, 68, 0.15); color:#ef4444; border:1px solid rgba(239, 68, 68, 0.3); padding:1px 6px; border-radius:999px; font-weight:700;">${a.badge || 'URGENT'}</span>
          <span style="font-size:0.75rem; color:var(--text-muted);">${a.date}</span>
        </div>
        <div style="font-size:0.86rem; font-weight:700; color:var(--text-primary); margin-bottom:2px;">${escapeHtml(a.title)}</div>
        <div style="font-size:0.78rem; color:var(--text-secondary); line-height:1.4;">${escapeHtml(a.summary)}</div>
      </div>
    `).join('');
  }

  function showToast(message) {
    let toast = document.querySelector('.feed-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'feed-toast';
      document.body.appendChild(toast);
    }
    const checkIcon = window.AppIcons ? window.AppIcons.get('check') : 'âœ“';
    toast.innerHTML = `${checkIcon} <span>${escapeHtml(message)}</span>`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

})(window);


