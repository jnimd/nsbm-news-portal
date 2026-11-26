// NSBM Campus Social Feed Controller
(function(window) {
  'use strict';

  let currentCategory = 'all';
  let searchQuery = '';

  // Lightbox State
  let lightboxImages = [];
  let lightboxIndex = 0;
  let lightboxCaptionText = '';

  document.addEventListener('DOMContentLoaded', initFeed);

  function initFeed() {
    renderUserProfile();
    bindGlobalModals();
    bindEvents();
    initDispatchUploader();
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
    const navLink = document.getElementById('feedNavUserLink');
    const statsEl = document.getElementById('feedProfileStats');
    const authActionEl = document.getElementById('feedProfileAuthAction');

    if (user) {
      // Authenticated User State
      const displayName = user.name || 'NSBM User';
      const displayRole = user.role === 'admin' 
        ? 'Chief Newsdesk Administrator' 
        : (user.title || 'Student Contributor');
      const displayFaculty = user.faculty || 'Faculty of Computing';
      const initial = displayName.charAt(0).toUpperCase();

      if (nameEl) nameEl.textContent = displayName;
      if (roleEl) roleEl.textContent = displayRole;
      if (facultyEl) facultyEl.textContent = displayFaculty;
      if (avatarEl) avatarEl.textContent = initial;
      if (navAvatarEl) navAvatarEl.textContent = initial;
      if (navNameEl) navNameEl.textContent = displayName.split(' ')[0];
      if (navLink) {
        navLink.href = user.role === 'admin' ? 'admin-dashboard.html' : 'student-dashboard.html';
        navLink.title = `${displayName} (${displayRole})`;
      }
      if (statsEl) statsEl.style.display = 'grid';
      if (authActionEl) {
        const dest = user.role === 'admin' ? 'admin-dashboard.html' : 'student-dashboard.html';
        const label = user.role === 'admin' ? 'Open Admin Editorial Desk' : 'Open Student Contributor Portal';
        authActionEl.innerHTML = `<a href="${dest}" class="feed-guest-login-btn" style="width:100%; text-align:center;">${label}</a>`;
      }
      // Guard admin-desk nav links: only allow if actually admin
      document.querySelectorAll('a[href="admin-dashboard.html"].feed-nav-link, a[href="admin-dashboard.html"].feed-quick-link-btn').forEach(link => {
        link.setAttribute('title', user.role === 'admin' ? 'Open Admin Editorial Desk' : 'Admin access requires admin account');
      });
    } else {
      // Guest Visitor State — show no hardcoded username
      if (nameEl) nameEl.textContent = 'Guest Visitor';
      if (roleEl) roleEl.textContent = 'Public Campus Reader';
      if (facultyEl) facultyEl.textContent = 'NSBM Green University';
      if (avatarEl) avatarEl.textContent = 'G';
      if (navAvatarEl) navAvatarEl.textContent = 'G';
      if (navNameEl) navNameEl.textContent = 'Guest';
      if (navLink) {
        navLink.href = 'login.html';
        navLink.title = 'Sign In to NSBM Account';
      }
      if (statsEl) statsEl.style.display = 'none';
      if (authActionEl) {
        authActionEl.innerHTML = `<a href="login.html" class="feed-guest-login-btn" style="width:100%; text-align:center;">Sign In to Post &amp; Like</a>`;
      }
      // Guard admin-desk nav links: redirect to login if not logged in
      document.querySelectorAll('a[href="admin-dashboard.html"].feed-nav-link, a[href="admin-dashboard.html"].feed-quick-link-btn').forEach(link => {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          window.location.href = 'login.html';
        }, { once: false });
        link.setAttribute('title', 'Please sign in to access Admin Desk');
      });
    }
  }

  function bindGlobalModals() {
    // 1. Auth Prompt Modal
    const authModal = document.getElementById('authPromptModal');
    const closeAuthBtn = document.getElementById('closeAuthPromptBtn');
    if (closeAuthBtn && authModal) {
      closeAuthBtn.addEventListener('click', () => {
        authModal.style.display = 'none';
      });
    }
    if (authModal) {
      authModal.addEventListener('click', (e) => {
        if (e.target === authModal) authModal.style.display = 'none';
      });
    }

    // 2. Lightbox Modal Controls
    const lbModal = document.getElementById('lightboxModal');
    const lbClose = document.getElementById('lightboxCloseBtn');
    const lbPrev = document.getElementById('lightboxPrevBtn');
    const lbNext = document.getElementById('lightboxNextBtn');
    const lbBackdrop = document.getElementById('lightboxBackdrop');

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbBackdrop) lbBackdrop.addEventListener('click', closeLightbox);
    if (lbPrev) lbPrev.addEventListener('click', () => stepLightbox(-1));
    if (lbNext) lbNext.addEventListener('click', () => stepLightbox(1));

    // 3. Article Reader Modal Controls
    const readerModal = document.getElementById('articleReaderModal');
    const closeReaderBtn = document.getElementById('closeReaderBtn');
    if (closeReaderBtn && readerModal) {
      closeReaderBtn.addEventListener('click', () => {
        readerModal.style.display = 'none';
        document.body.style.overflow = '';
      });
    }
    if (readerModal) {
      readerModal.addEventListener('click', (e) => {
        if (e.target === readerModal) {
          readerModal.style.display = 'none';
          document.body.style.overflow = '';
        }
      });
    }

    // 4. Create Campus Dispatch Modal Controls (Fix Stuck Modal)
    const composerModal = document.getElementById('feedComposerModal');
    document.querySelectorAll('#closeComposerBtn, #cancelComposerBtn, #cancelDispatchBtn, .modal-close').forEach(btn => {
      btn.addEventListener('click', closeComposerModal);
    });
    if (composerModal) {
      composerModal.addEventListener('click', (e) => {
        if (e.target === composerModal || e.target.classList.contains('feed-modal-backdrop') || e.target.classList.contains('modal-overlay')) {
          closeComposerModal();
        }
      });
    }

    // 5. Global Keyboard Navigation (ESC to dismiss all active modals)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeComposerModal();
        closeLightbox();
        if (authModal) authModal.style.display = 'none';
        if (readerModal) {
          readerModal.style.display = 'none';
          document.body.style.overflow = '';
        }
      } else if (lbModal && lbModal.style.display !== 'none') {
        if (e.key === 'ArrowLeft') stepLightbox(-1);
        if (e.key === 'ArrowRight') stepLightbox(1);
      }
    });
  }

  function closeComposerModal() {
    const modal = document.getElementById('feedComposerModal');
    if (modal) {
      modal.classList.remove('open', 'active');
      modal.style.display = 'none';
    }
    resetDispatchUploader();
    document.body.style.overflow = '';
  }

  function openComposerModal() {
    const user = window.DataStore ? window.DataStore.getCurrentUser() : null;
    if (!user) {
      openAuthPrompt();
      return;
    }
    const modal = document.getElementById('feedComposerModal');
    if (modal) {
      modal.classList.add('open', 'active');
      modal.style.display = 'flex';
      setTimeout(() => {
        const inp = document.getElementById('postContentInput');
        if (inp) inp.focus();
      }, 50);
    }
    document.body.style.overflow = 'hidden';
  }

  function openAuthPrompt() {
    const authModal = document.getElementById('authPromptModal');
    if (authModal) {
      authModal.style.display = 'flex';
    } else {
      window.location.href = 'login.html';
    }
  }

  function openLightbox(images, startIndex, caption) {
    if (!images || images.length === 0) return;
    lightboxImages = Array.isArray(images) ? images : [images];
    lightboxIndex = (startIndex >= 0 && startIndex < lightboxImages.length) ? startIndex : 0;
    lightboxCaptionText = caption || '';

    const lbModal = document.getElementById('lightboxModal');
    const lbImg = document.getElementById('lightboxImg');
    const lbCounter = document.getElementById('lightboxCounter');
    const lbCaption = document.getElementById('lightboxCaption');
    const lbPrev = document.getElementById('lightboxPrevBtn');
    const lbNext = document.getElementById('lightboxNextBtn');

    if (lbImg) lbImg.src = lightboxImages[lightboxIndex];
    if (lbCounter) lbCounter.textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;
    if (lbCaption) lbCaption.textContent = lightboxCaptionText;

    if (lbPrev && lbNext) {
      const showArrows = lightboxImages.length > 1;
      lbPrev.style.display = showArrows ? 'flex' : 'none';
      lbNext.style.display = showArrows ? 'flex' : 'none';
    }

    if (lbModal) {
      lbModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    const lbModal = document.getElementById('lightboxModal');
    if (lbModal) {
      lbModal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  function stepLightbox(delta) {
    if (lightboxImages.length <= 1) return;
    lightboxIndex = (lightboxIndex + delta + lightboxImages.length) % lightboxImages.length;
    const lbImg = document.getElementById('lightboxImg');
    const lbCounter = document.getElementById('lightboxCounter');
    if (lbImg) lbImg.src = lightboxImages[lightboxIndex];
    if (lbCounter) lbCounter.textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;
  }

  function openArticleReader(post) {
    const readerModal = document.getElementById('articleReaderModal');
    if (!readerModal) return;

    // Attempt to get full article data if available
    let article = null;
    if (post.articleId && window.DataStore) {
      article = window.DataStore.getArticleById(post.articleId);
    }

    const title = article ? article.title : (post.title || 'Campus Dispatch');
    const category = article ? article.category : (post.category || 'General');
    const author = article ? article.author : (post.author || 'NSBM News Bureau');
    const date = article ? (article.date || article.publishedDate) : post.date;
    const content = article ? article.content : (post.content || post.excerpt);
    const images = (article && article.images && article.images.length > 0)
      ? article.images
      : ((post.images && post.images.length > 0) ? post.images : (post.image ? [post.image] : []));

    const catEl = document.getElementById('readerCategory');
    const titleEl = document.getElementById('readerTitle');
    const metaEl = document.getElementById('readerMeta');
    const mediaEl = document.getElementById('readerMediaContainer');
    const bodyEl = document.getElementById('readerBody');

    if (catEl) catEl.textContent = category;
    if (titleEl) titleEl.textContent = title;
    if (metaEl) metaEl.innerHTML = `By <strong>${escapeHtml(author)}</strong> &bull; Published on ${escapeHtml(date)}`;

    if (bodyEl) {
      const rawText = String(content || '')
        .replace(/\\r\\n/g, '\n')
        .replace(/\\n/g, '\n')
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n');
      const paragraphs = rawText
        .split(/\n{2,}|\n/)
        .map(p => p.trim())
        .filter(p => p.length > 0);
      bodyEl.innerHTML = paragraphs
        .map(p => `<p class="modal-paragraph story-paragraph" style="margin-bottom:1.2rem; line-height:1.8; font-size:0.98rem; color:var(--text-primary); font-weight:400;">${escapeHtml(p)}</p>`)
        .join('');
    }

    // Render prominent Hero Image Banner & Multi-Image Carousel Gallery inside Read Story modal
    if (mediaEl) {
      if (images.length === 0) {
        mediaEl.innerHTML = '';
        mediaEl.style.display = 'none';
      } else if (images.length === 1) {
        mediaEl.style.display = 'block';
        mediaEl.innerHTML = `
          <div class="modal-gallery-hero-wrap" title="Click to view full screen" style="cursor:pointer;">
            <img src="${images[0]}" alt="${escapeHtml(title)}" loading="lazy">
            <div class="modal-gallery-badge">1 Photo &bull; Expand Lightbox</div>
          </div>
        `;
        const hero = mediaEl.querySelector('.modal-gallery-hero-wrap');
        if (hero) hero.addEventListener('click', () => openLightbox(images, 0, title));
      } else {
        // Multi-image Carousel Slider
        let currentIdx = 0;
        mediaEl.style.display = 'block';
        mediaEl.innerHTML = `
          <div class="modal-gallery-hero-wrap" title="Click to view full screen" style="cursor:pointer;">
            <img id="readerHeroImg" src="${images[0]}" alt="${escapeHtml(title)}" loading="lazy">
            <button type="button" class="modal-gallery-btn modal-gallery-prev prev" id="readerPrevBtn" title="Previous photo" aria-label="Previous photo">&lsaquo;</button>
            <button type="button" class="modal-gallery-btn modal-gallery-next next" id="readerNextBtn" title="Next photo" aria-label="Next photo">&rsaquo;</button>
            <div class="modal-gallery-badge" id="readerBadge">
              <span id="readerActiveCount">1</span> / ${images.length} Photos &bull; Click to Expand
            </div>
            <div class="modal-gallery-dots" id="readerDots">
              ${images.map((_, idx) => `<span class="modal-gallery-dot ${idx === 0 ? 'active' : ''}" data-idx="${idx}"></span>`).join('')}
            </div>
          </div>
          <div class="modal-gallery-thumbs" id="readerThumbs">
            ${images.map((img, idx) => `
              <button type="button" class="modal-gallery-thumb ${idx === 0 ? 'active' : ''}" data-idx="${idx}" title="View photo ${idx + 1}">
                <img src="${img}" alt="Thumbnail ${idx + 1}" loading="lazy">
              </button>
            `).join('')}
          </div>
          <div class="modal-gallery-caption">
            Photo dispatch from ${escapeHtml(category)} archive &bull; ${images.length} verified high-resolution media captures
          </div>
        `;

        function updateReaderHero(idx) {
          if (idx < 0) idx = images.length - 1;
          if (idx >= images.length) idx = 0;
          currentIdx = idx;

          const heroImg = document.getElementById('readerHeroImg');
          const counter = document.getElementById('readerActiveCount');
          if (heroImg) heroImg.src = images[currentIdx];
          if (counter) counter.textContent = currentIdx + 1;

          mediaEl.querySelectorAll('.modal-gallery-thumb').forEach((thumb, tIdx) => {
            thumb.classList.toggle('active', tIdx === currentIdx);
          });
          mediaEl.querySelectorAll('.modal-gallery-dot').forEach((dot, dIdx) => {
            dot.classList.toggle('active', dIdx === currentIdx);
          });
        }

        const heroWrap = mediaEl.querySelector('.modal-gallery-hero-wrap');
        if (heroWrap) {
          heroWrap.addEventListener('click', (e) => {
            if (e.target.closest('.modal-gallery-btn') || e.target.closest('.modal-gallery-dots')) return;
            openLightbox(images, currentIdx, title);
          });
        }

        const prevBtn = document.getElementById('readerPrevBtn');
        if (prevBtn) {
          prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            updateReaderHero(currentIdx - 1);
          });
        }

        const nextBtn = document.getElementById('readerNextBtn');
        if (nextBtn) {
          nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            updateReaderHero(currentIdx + 1);
          });
        }

        mediaEl.querySelectorAll('.modal-gallery-thumb').forEach(thumb => {
          thumb.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const idx = parseInt(thumb.getAttribute('data-idx'), 10);
            updateReaderHero(idx);
          });
        });

        mediaEl.querySelectorAll('.modal-gallery-dot').forEach(dot => {
          dot.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const idx = parseInt(dot.getAttribute('data-idx'), 10);
            updateReaderHero(idx);
          });
        });
      }
    }

    readerModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
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

    // Modal Trigger for Post Composer
    const openComposerBtn = document.getElementById('openComposerBtn');
    const modalBackdrop = document.getElementById('feedComposerModal');
    const submitPostBtn = document.getElementById('submitPostBtn');
    const mobileComposeTrigger = document.getElementById('mobileComposeTrigger');

    if (openComposerBtn) openComposerBtn.addEventListener('click', openComposerModal);
    if (mobileComposeTrigger) mobileComposeTrigger.addEventListener('click', openComposerModal);

    const mobileThemeToggleBtn = document.getElementById('mobileThemeToggleBtn');
    if (mobileThemeToggleBtn && window.ThemeEngine) {
      mobileThemeToggleBtn.addEventListener('click', () => window.ThemeEngine.toggle());
    }

    // Submit Custom Post
    if (submitPostBtn && modalBackdrop) {
      submitPostBtn.addEventListener('click', () => {
        const user = window.DataStore ? window.DataStore.getCurrentUser() : null;
        if (!user) {
          closeComposerModal();
          openAuthPrompt();
          return;
        }

        const textInput = document.getElementById('postContentInput');
        const catSelect = document.getElementById('postCategorySelect');
        const imgSelect = document.getElementById('postImageSelect');

        const content = textInput ? textInput.value.trim() : '';
        if (!content) {
          alert('Please enter some text for your campus dispatch.');
          return;
        }

        const category = catSelect ? catSelect.value : 'General';
        const presetImg = imgSelect ? imgSelect.value : null;

        // Use local uploaded PC photos if available, otherwise fallback to preset image
        const imagesToAttach = (uploadedDispatchImages && uploadedDispatchImages.length > 0)
          ? [...uploadedDispatchImages]
          : (presetImg ? [presetImg] : []);
        const primaryImage = imagesToAttach.length > 0 ? imagesToAttach[0] : null;

        if (window.DataStore && window.DataStore.createSocialPost) {
          window.DataStore.createSocialPost({
            content: content,
            category: category,
            image: primaryImage,
            images: imagesToAttach,
            tags: ['#NSBM', '#' + category.replace(/\s+/g, ''), '#CampusBuzz']
          });
        }

        resetDispatchUploader();
        closeComposerModal();
        if (textInput) textInput.value = '';
        showToast('Campus dispatch published to feed!');
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

  // ==========================================================================
  // REAL LOCAL PC IMAGE UPLOADER (FileReader Data URLs & Live Previews)
  // ==========================================================================
  let uploadedDispatchImages = [];

  function initDispatchUploader() {
    const fileInput = document.getElementById('dispatchFileInput');
    const uploadBtn = document.getElementById('dispatchUploadBtn');
    const dropzone = document.getElementById('dispatchDropzone');
    const browseTrigger = document.getElementById('dropzoneBrowseTrigger');
    const previewContainer = document.getElementById('dispatchPreviewContainer');

    if (!fileInput) return;

    if (uploadBtn) {
      uploadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        fileInput.click();
      });
    }

    if (browseTrigger) {
      browseTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        fileInput.click();
      });
    }

    if (dropzone) {
      dropzone.addEventListener('click', (e) => {
        if (e.target === browseTrigger) return;
        fileInput.click();
      });

      ['dragenter', 'dragover'].forEach(name => {
        dropzone.addEventListener(name, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.classList.add('dragover');
        });
      });

      ['dragleave', 'drop'].forEach(name => {
        dropzone.addEventListener(name, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.classList.remove('dragover');
        });
      });

      dropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        if (dt && dt.files && dt.files.length > 0) {
          handleFiles(dt.files);
        }
      });
    }

    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files.length > 0) {
        handleFiles(fileInput.files);
      }
    });

    function handleFiles(files) {
      const fileList = Array.from(files).filter(f => f.type.startsWith('image/'));
      if (fileList.length === 0) return;

      let remaining = fileList.length;
      fileList.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target.result;
          uploadedDispatchImages.push(dataUrl);
          remaining--;
          if (remaining === 0) {
            renderDispatchPreviews();
          }
        };
        reader.readAsDataURL(file);
      });
    }

    function renderDispatchPreviews() {
      if (!previewContainer) return;
      if (uploadedDispatchImages.length === 0) {
        previewContainer.innerHTML = '';
        previewContainer.style.display = 'none';
        return;
      }

      previewContainer.style.display = 'grid';
      previewContainer.innerHTML = uploadedDispatchImages.map((img, idx) => `
        <div class="dispatch-preview-item" data-idx="${idx}">
          <img src="${img}" alt="Uploaded local photo ${idx + 1}">
          <button type="button" class="dispatch-preview-remove" data-idx="${idx}" title="Remove photo" aria-label="Remove photo">&times;</button>
          <span class="dispatch-preview-tag">${idx + 1}</span>
        </div>
      `).join('');

      previewContainer.querySelectorAll('.dispatch-preview-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          const removeIdx = parseInt(btn.getAttribute('data-idx'), 10);
          uploadedDispatchImages.splice(removeIdx, 1);
          renderDispatchPreviews();
        });
      });
    }
  }

  function resetDispatchUploader() {
    uploadedDispatchImages = [];
    const fileInput = document.getElementById('dispatchFileInput');
    const previewContainer = document.getElementById('dispatchPreviewContainer');
    if (fileInput) fileInput.value = '';
    if (previewContainer) {
      previewContainer.innerHTML = '';
      previewContainer.style.display = 'none';
    }
  }

  function renderFeed() {
    const container = document.getElementById('feedPostsContainer');
    if (!container) return;

    if (!window.DataStore) {
      container.innerHTML = '<div class="feed-card" style="text-align:center; padding:2rem;">Data store loading...</div>';
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
    const verifiedIcon = window.AppIcons ? window.AppIcons.get('check', 'post-author-verified') : '✓';
    const likeIcon = post.isLiked 
      ? (window.AppIcons ? window.AppIcons.get('thumbsUpFilled') : '👍')
      : (window.AppIcons ? window.AppIcons.get('thumbsUp') : '👍');
    const commentIcon = window.AppIcons ? window.AppIcons.get('comment') : '💬';
    const shareIcon = window.AppIcons ? window.AppIcons.get('share') : '↗';
    const bookmarkIcon = (window.DataStore && post.articleId && window.DataStore.isBookmarked(post.articleId))
      ? (window.AppIcons ? window.AppIcons.get('bookmarkFilled') : '★')
      : (window.AppIcons ? window.AppIcons.get('bookmark') : '☆');

    const isBookmarked = window.DataStore && post.articleId && window.DataStore.isBookmarked(post.articleId);
    const tagsHtml = (post.tags || []).map(t => `<span class="post-hashtag">${t}</span>`).join(' ');

    // Collect all media images
    const images = (post.images && post.images.length > 0)
      ? post.images
      : (post.image ? [post.image] : []);

    let mediaHtml = '';
    if (images.length > 1) {
      // Multi-image Carousel Slider
      mediaHtml = `
        <div class="post-carousel" id="carousel-${post.id}" data-images="${escapeHtml(JSON.stringify(images))}">
          <div class="post-carousel-track-wrapper">
            <div class="post-carousel-track" id="track-${post.id}">
              ${images.map((img, idx) => `
                <div class="post-carousel-slide" data-idx="${idx}" data-img="${escapeHtml(img)}">
                  <img src="${img}" alt="${escapeHtml(post.title || post.author)}" loading="lazy">
                </div>
              `).join('')}
            </div>
          </div>
          <button type="button" class="post-carousel-btn post-carousel-prev" data-carousel="${post.id}" aria-label="Previous image">&#10094;</button>
          <button type="button" class="post-carousel-btn post-carousel-next" data-carousel="${post.id}" aria-label="Next image">&#10095;</button>
          <div class="post-carousel-badge"><span class="carousel-counter-active" id="badge-${post.id}">1</span> / ${images.length} Photos</div>
          <div class="post-carousel-dots" id="dots-${post.id}">
            ${images.map((_, idx) => `<button type="button" class="post-carousel-dot ${idx === 0 ? 'active' : ''}" data-carousel="${post.id}" data-idx="${idx}" aria-label="Slide ${idx + 1}"></button>`).join('')}
          </div>
        </div>
        ${post.imageCaption ? `<div class="post-media-caption" style="padding:6px 12px; font-size:0.8rem; color:var(--text-muted);">${escapeHtml(post.imageCaption)}</div>` : ''}
      `;
    } else if (images.length === 1) {
      // Single High-Res Clickable Image
      mediaHtml = `
        <div class="post-media single-post-image" style="cursor:pointer;" data-single-img="${escapeHtml(images[0])}" data-caption="${escapeHtml(post.imageCaption || post.title || '')}">
          <img src="${images[0]}" alt="${escapeHtml(post.title || post.author)}" loading="lazy">
          ${post.imageCaption ? `<div class="post-media-caption">${escapeHtml(post.imageCaption)}</div>` : ''}
        </div>
      `;
    }

    const headlineHtml = post.title ? `
      <h3 class="post-headline clickable-headline" data-post-id="${post.id}" style="cursor:pointer;" title="Click to read full story">
        ${escapeHtml(post.title)}
      </h3>
    ` : '';

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
          ${post.articleId ? `
            <div style="margin-top:0.75rem;">
              <button type="button" class="read-full-story-btn" data-post-id="${post.id}" style="background:transparent; border:none; color:var(--accent-primary, #2563eb); font-weight:700; font-size:0.86rem; cursor:pointer; padding:0; display:inline-flex; align-items:center; gap:4px;">
                Read Full Story &amp; Gallery &rarr;
              </button>
            </div>
          ` : ''}
        </div>

        ${mediaHtml}

        <div class="post-stats-bar">
          <div class="post-stats-left">
            <div class="reaction-icons-stack">
              <span class="rxn-badge rxn-blue" title="Like">👍</span>
              <span class="rxn-badge rxn-red" title="Love">❤️</span>
              <span class="rxn-badge rxn-yellow" title="Insightful">💡</span>
            </div>
            <span class="like-counter" id="like-count-${post.id}">${post.likesCount || 0}</span>
          </div>
          <div class="post-stats-right">
            <span><span class="comment-counter">${(post.comments || []).length}</span> Comments</span>
            <span>&bull;</span>
            <span>${post.sharesCount || 0} Shares</span>
          </div>
        </div>

        <div class="post-actions-bar">
          <button class="post-action-btn like-btn ${post.isLiked ? 'active-like' : ''}" data-post-id="${post.id}" data-article-id="${post.articleId || ''}" type="button">
            <span class="icon-wrap">${likeIcon}</span>
            <span>${post.isLiked ? 'Liked' : 'Like'}</span>
          </button>
          
          <button class="post-action-btn comment-btn" data-post-id="${post.id}" type="button">
            <span class="icon-wrap">${commentIcon}</span>
            <span>Comment</span>
          </button>
          
          <button class="post-action-btn share-btn" data-post-id="${post.id}" data-title="${escapeHtml(post.title || 'NSBM News')}" type="button">
            <span class="icon-wrap">${shareIcon}</span>
            <span>Share</span>
          </button>
          
          <button class="post-action-btn bookmark-btn ${isBookmarked ? 'active-bookmark' : ''}" data-article-id="${post.articleId || ''}" type="button">
            <span class="icon-wrap">${bookmarkIcon}</span>
            <span>${isBookmarked ? 'Saved' : 'Save'}</span>
          </button>
        </div>

        <div class="post-comments-container" id="comments-${post.id}">
          <div class="comment-list" id="comment-list-${post.id}">
            ${commentsListHtml}
          </div>
          <div class="comment-composer-box">
            <div class="comment-avatar" style="background:var(--accent-primary, #2563eb);">${window.DataStore && window.DataStore.getCurrentUser() ? window.DataStore.getCurrentUser().name.charAt(0).toUpperCase() : 'G'}</div>
            <input type="text" class="comment-input-field" placeholder="Write a comment on this dispatch..." id="comment-input-${post.id}">
            <button class="comment-submit-btn" data-post-id="${post.id}" data-article-id="${post.articleId || ''}" title="Post Comment" type="button">
              ${sendIcon}
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function bindPostInteractions(container) {
    // 1. Like button with Authenticated Guard
    container.querySelectorAll('.like-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const currentUser = window.DataStore ? window.DataStore.getCurrentUser() : null;
        if (!currentUser) {
          openAuthPrompt();
          return;
        }

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
            if (iconWrap && window.AppIcons) iconWrap.innerHTML = window.AppIcons.get('thumbsUpFilled');
            if (label) label.textContent = 'Liked';
          } else {
            btn.classList.remove('active-like');
            if (iconWrap && window.AppIcons) iconWrap.innerHTML = window.AppIcons.get('thumbsUp');
            if (label) label.textContent = 'Like';
          }
        } else {
          // Fallback for custom user posts
          btn.classList.toggle('active-like');
          const isLiked = btn.classList.contains('active-like');
          let count = parseInt(countSpan.textContent, 10) || 0;
          count = isLiked ? count + 1 : Math.max(0, count - 1);
          if (countSpan) countSpan.textContent = count;
          if (iconWrap && window.AppIcons) iconWrap.innerHTML = window.AppIcons.get(isLiked ? 'thumbsUpFilled' : 'thumbsUp');
          if (label) label.textContent = isLiked ? 'Liked' : 'Like';
        }
      });
    });

    // 2. Toggle Comments
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

    // 3. Share Button
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

    // 4. Bookmark Button with Authenticated Guard
    container.querySelectorAll('.bookmark-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const currentUser = window.DataStore ? window.DataStore.getCurrentUser() : null;
        if (!currentUser) {
          openAuthPrompt();
          return;
        }

        const articleId = btn.dataset.articleId;
        if (!articleId) {
          showToast('Saved to your reading list');
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

    // 5. Submit Comment with Authenticated Guard
    container.querySelectorAll('.comment-submit-btn').forEach(btn => {
      const submitComment = () => {
        const currentUser = window.DataStore ? window.DataStore.getCurrentUser() : null;
        if (!currentUser) {
          openAuthPrompt();
          return;
        }

        const postId = btn.dataset.postId;
        const articleId = btn.dataset.articleId;
        const input = document.getElementById(`comment-input-${postId}`);
        const text = input ? input.value.trim() : '';

        if (!text) return;

        const author = currentUser.name || 'NSBM Scholar';
        const role = currentUser.role === 'admin' 
          ? 'Chief Editor' 
          : (currentUser.title || 'Student Contributor');

        if (articleId && window.DataStore) {
          window.DataStore.addComment(articleId, text, author, role);
        }

        // Append to UI immediately
        const list = document.getElementById(`comment-list-${postId}`);
        if (list) {
          const newBubble = document.createElement('div');
          newBubble.className = 'comment-bubble';
          newBubble.innerHTML = `
            <div class="comment-avatar" style="background:var(--accent-primary, #2563eb);">${author.charAt(0).toUpperCase()}</div>
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
        showToast('Comment posted successfully!');
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

    // 6. Multi-Image Carousel Controller
    container.querySelectorAll('.post-carousel').forEach(carousel => {
      const postId = carousel.id.replace('carousel-', '');
      const track = document.getElementById(`track-${postId}`);
      const prevBtn = carousel.querySelector('.post-carousel-prev');
      const nextBtn = carousel.querySelector('.post-carousel-next');
      const badge = document.getElementById(`badge-${postId}`);
      const dotsContainer = document.getElementById(`dots-${postId}`);
      const slides = carousel.querySelectorAll('.post-carousel-slide');
      const totalSlides = slides.length;

      let currentSlide = 0;

      const updateSlidePosition = () => {
        if (track) {
          track.style.transform = `translateX(-${currentSlide * 100}%)`;
        }
        if (badge) {
          badge.textContent = `${currentSlide + 1}`;
        }
        if (dotsContainer) {
          const dots = dotsContainer.querySelectorAll('.post-carousel-dot');
          dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentSlide);
          });
        }
      };

      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
          updateSlidePosition();
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          currentSlide = (currentSlide + 1) % totalSlides;
          updateSlidePosition();
        });
      }

      if (dotsContainer) {
        dotsContainer.querySelectorAll('.post-carousel-dot').forEach(dot => {
          dot.addEventListener('click', (e) => {
            e.stopPropagation();
            currentSlide = parseInt(dot.dataset.idx, 10) || 0;
            updateSlidePosition();
          });
        });
      }

      // Clicking any slide opens Fullscreen Lightbox!
      slides.forEach(slide => {
        slide.addEventListener('click', () => {
          const rawImages = carousel.dataset.images;
          let images = [];
          try {
            images = JSON.parse(rawImages);
          } catch(err) {
            images = [slide.dataset.img];
          }
          const idx = parseInt(slide.dataset.idx, 10) || 0;
          const card = document.getElementById(postId);
          const title = card ? (card.querySelector('.post-headline')?.textContent || '') : '';
          openLightbox(images, idx, title);
        });
      });
    });

    // 7. Single Image Click -> Lightbox
    container.querySelectorAll('.single-post-image').forEach(imgWrap => {
      imgWrap.addEventListener('click', () => {
        const src = imgWrap.dataset.singleImg;
        const caption = imgWrap.dataset.caption;
        if (src) {
          openLightbox([src], 0, caption);
        }
      });
    });

    // 8. Click Headline or "Read Full Story" -> Reader Modal
    container.querySelectorAll('.clickable-headline, .read-full-story-btn').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const postId = trigger.dataset.postId;
        if (!postId || !window.DataStore) return;
        const posts = window.DataStore.getSocialPosts();
        const post = posts.find(p => p.id === postId);
        if (post) {
          openArticleReader(post);
        }
      });
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
    const checkIcon = window.AppIcons ? window.AppIcons.get('check') : '✓';
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
