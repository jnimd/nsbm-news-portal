// scrollytelling canvas animation
(function(window) {
  'use strict';

  // Sequence definitions
  const SEQUENCE_DEFS = [
    { 
      folder: '1im/', 
      label: 'Campus Life & Undergrad Research', 
      tag: 'Academic Pulse',
      frameCount: 160 
    },
    { 
      folder: '2im/', 
      label: 'Eco Architecture & Green Living', 
      tag: 'Green University',
      frameCount: 160 
    },
    { 
      folder: '3im/', 
      label: 'Student Press & Campus Broadcast', 
      tag: 'Press Syndicate',
      frameCount: 160 
    }
  ];

  // Overlay scroll activation ranges (0.0 to 1.0)
  const OVERLAY_RANGES = [
    { id: 'overlay-1', start: 0.00, end: 0.16 },
    { id: 'overlay-2', start: 0.18, end: 0.31 },
    { id: 'overlay-3', start: 0.37, end: 0.63 },
    { id: 'overlay-4', start: 0.69, end: 0.96 }
  ];

  // State
  let sequenceData = [];
  let totalImageCount = 0;
  let loadedImageCount = 0;
  let isLoaded = false;

  // Rendering state
  let currentProgress = 0;
  let targetProgress = 0;
  const LERP_FACTOR = 0.12;

  // Auto Glide State
  let isAutoPlaying = false;
  const AUTO_PLAY_SPEED = 0.00045;

  // DOM Elements
  const canvas = document.getElementById('scrolly-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: false });

  const preloader = document.getElementById('preloader');
  const loaderBar = document.getElementById('loader-bar');
  const loaderPercent = document.getElementById('loader-percent');
  const loaderCount = document.getElementById('loader-count');
  const loaderStatus = document.getElementById('loader-status');
  const quickLaunchBtn = document.getElementById('quick-launch-btn');
  const globalProgressBar = document.getElementById('global-progress-bar');
  const seqTrack = document.getElementById('seq-track');
  const hudPercent = document.getElementById('hud-percent');
  const hudSeqLabel = document.getElementById('hud-sequence-label');
  const hudFrameNum = document.getElementById('hud-frame-num');
  const hudSubProgress = document.getElementById('hud-sub-progress');
  const autoPlayBtn = document.getElementById('autoplay-btn');
  const autoPlayIcon = document.getElementById('autoplay-icon');
  const autoPlayText = document.getElementById('autoplay-text');

  // Viewport Sizing
  function resizeCanvas() {
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    ctx.scale(dpr, dpr);
    renderCurrentFrame();
  }

  window.addEventListener('resize', resizeCanvas);

  // Pattern detection
  async function detectPattern() {
    const testPatterns = [
      (folder, idx) => `${folder}ezgif-frame-${String(idx).padStart(3, '0')}.jpg`,
      (folder, idx) => `${folder}${idx}.jpg`,
      (folder, idx) => `${folder}frame_${idx}.jpg`
    ];

    for (let pat of testPatterns) {
      const url = pat('1im/', 1);
      const ok = await new Promise(res => {
        const testImg = new Image();
        testImg.onload = () => res(true);
        testImg.onerror = () => res(false);
        testImg.src = url;
      });
      if (ok) return { pattern: pat, framesPerSeq: 160 };
    }
    return { pattern: testPatterns[0], framesPerSeq: 160 };
  }

  // Draw image cover with aspect-ratio preservation
  function drawImageCover(img) {
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasW = window.innerWidth;
    const canvasH = window.innerHeight;
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;

    const scale = Math.max(canvasW / imgW, canvasH / imgH);
    const drawW = imgW * scale;
    const drawH = imgH * scale;
    const offsetX = (canvasW - drawW) / 2;
    const offsetY = (canvasH - drawH) / 2;

    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  }

  // Render current frame
  function renderCurrentFrame() {
    if (!ctx || sequenceData.length === 0) return;

    const clamped = Math.min(Math.max(currentProgress, 0), 0.9999);
    const seqFraction = 1 / SEQUENCE_DEFS.length;
    const seqIndex = Math.min(Math.floor(clamped / seqFraction), SEQUENCE_DEFS.length - 1);
    const subProgress = (clamped - (seqIndex * seqFraction)) / seqFraction;

    const currentSeq = sequenceData[seqIndex];
    if (!currentSeq || currentSeq.length === 0) return;

    const maxFrame = currentSeq.length - 1;
    const frameIndex = Math.min(Math.max(Math.floor(subProgress * maxFrame), 0), maxFrame);

    let crossFade = null;
    const CROSS_FADE_RANGE = 0.05;
    if (seqIndex < SEQUENCE_DEFS.length - 1 && subProgress > (1 - CROSS_FADE_RANGE)) {
      const nextSeq = sequenceData[seqIndex + 1];
      if (nextSeq && nextSeq[0]) {
        const fadeAlpha = (subProgress - (1 - CROSS_FADE_RANGE)) / CROSS_FADE_RANGE;
        crossFade = {
          fromImg: currentSeq[frameIndex],
          toImg: nextSeq[0],
          alpha: fadeAlpha
        };
      }
    }

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (crossFade && crossFade.fromImg && crossFade.toImg && crossFade.fromImg.complete && crossFade.toImg.complete) {
      ctx.globalAlpha = 1.0;
      drawImageCover(crossFade.fromImg);
      ctx.globalAlpha = crossFade.alpha;
      drawImageCover(crossFade.toImg);
      ctx.globalAlpha = 1.0;
    } else {
      const img = currentSeq[frameIndex];
      if (img && img.complete) {
        ctx.globalAlpha = 1.0;
        drawImageCover(img);
      }
    }

    // Update HUD with professional editorial tags instead of frame counters
    if (hudSeqLabel) hudSeqLabel.textContent = SEQUENCE_DEFS[seqIndex].label;
    if (hudFrameNum) {
      hudFrameNum.textContent = `Beat 0${seqIndex + 1} of 03`;
    }
    if (hudSubProgress) {
      hudSubProgress.style.width = `${Math.round(subProgress * 100)}%`;
    }
  }

  // Update overlays & story navigation dots
  function updateOverlaysAndHUD() {
    const rawP = targetProgress;

    if (globalProgressBar) {
      globalProgressBar.style.width = `${rawP * 100}%`;
    }
    if (hudPercent) {
      hudPercent.textContent = `${String(Math.round(rawP * 100)).padStart(2, '0')}%`;
    }

    OVERLAY_RANGES.forEach(item => {
      const el = document.getElementById(item.id);
      if (!el) return;
      if (rawP >= item.start && rawP <= item.end) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    document.querySelectorAll('.chap-dot').forEach(btn => {
      const seq = parseInt(btn.getAttribute('data-seq'), 10);
      const dot = btn.querySelector('.dot-indicator');
      if (!dot) return;

      let isActive = false;
      if (seq === 1 && rawP < 0.333) isActive = true;
      if (seq === 2 && rawP >= 0.333 && rawP < 0.666) isActive = true;
      if (seq === 3 && rawP >= 0.666) isActive = true;

      if (isActive) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  // RAF Animation Loop
  function loop() {
    if (isLoaded) {
      if (isAutoPlaying) {
        const nextP = targetProgress + AUTO_PLAY_SPEED;
        if (nextP >= 0.995) {
          isAutoPlaying = false;
          updateAutoPlayButton();
        } else {
          targetProgress = nextP;
          if (seqTrack) {
            const totalScrollable = seqTrack.offsetHeight - window.innerHeight;
            const trackTop = window.scrollY + seqTrack.getBoundingClientRect().top;
            window.scrollTo({ top: trackTop + (totalScrollable * targetProgress), behavior: 'auto' });
          }
        }
      }

      const diff = targetProgress - currentProgress;
      if (Math.abs(diff) > 0.00005) {
        currentProgress += diff * LERP_FACTOR;
        renderCurrentFrame();
      }
      updateOverlaysAndHUD();
    }
    requestAnimationFrame(loop);
  }

  // Scroll listener
  function onScroll() {
    if (!seqTrack) return;
    const rect = seqTrack.getBoundingClientRect();
    const totalScrollable = seqTrack.offsetHeight - window.innerHeight;

    if (totalScrollable <= 0) return;

    const scrolled = -rect.top;
    const progress = Math.min(Math.max(scrolled / totalScrollable, 0), 1);
    targetProgress = progress;
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  window.addEventListener('wheel', () => {
    if (isAutoPlaying) {
      isAutoPlaying = false;
      updateAutoPlayButton();
    }
  }, { passive: true });

  window.addEventListener('touchstart', () => {
    if (isAutoPlaying) {
      isAutoPlaying = false;
      updateAutoPlayButton();
    }
  }, { passive: true });

  window.scrollToPercent = function(pct) {
    if (!seqTrack) return;
    if (isAutoPlaying) {
      isAutoPlaying = false;
      updateAutoPlayButton();
    }
    const trackTop = window.scrollY + seqTrack.getBoundingClientRect().top;
    const totalScrollable = seqTrack.offsetHeight - window.innerHeight;
    const targetY = trackTop + (totalScrollable * pct);
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  function updateAutoPlayButton() {
    if (!autoPlayBtn) return;
    if (isAutoPlaying) {
      if (autoPlayIcon) autoPlayIcon.textContent = 'âšâš';
      if (autoPlayText) autoPlayText.textContent = 'Pause Tour';
      autoPlayBtn.classList.add('active');
    } else {
      if (autoPlayIcon) autoPlayIcon.textContent = 'â–¶';
      if (autoPlayText) autoPlayText.textContent = 'Story Tour';
      autoPlayBtn.classList.remove('active');
    }
  }

  window.toggleAutoPlay = function() {
    isAutoPlaying = !isAutoPlaying;
    if (isAutoPlaying && targetProgress >= 0.98) {
      window.scrollToPercent(0);
    }
    updateAutoPlayButton();
  };

  // Keyboard controls - SAFEGUARDED for input/textarea typing
  window.addEventListener('keydown', (e) => {
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable) {
      return;
    }
    if (document.querySelector('.modal-backdrop.open')) {
      return;
    }
    if (e.code === 'Space') {
      e.preventDefault();
      window.toggleAutoPlay();
    } else if (e.code === 'ArrowDown') {
      targetProgress = Math.min(targetProgress + 0.015, 1);
    } else if (e.code === 'ArrowUp') {
      targetProgress = Math.max(targetProgress - 0.015, 0);
    }
  });

  // Preloader Engine
  async function preloadAllAssets() {
    const { pattern, framesPerSeq } = await detectPattern();
    SEQUENCE_DEFS.forEach(d => d.frameCount = framesPerSeq);
    totalImageCount = SEQUENCE_DEFS.length * framesPerSeq;

    if (loaderCount) loaderCount.textContent = `Loading Campus Chronicle...`;

    for (let sIdx = 0; sIdx < SEQUENCE_DEFS.length; sIdx++) {
      const def = SEQUENCE_DEFS[sIdx];
      sequenceData[sIdx] = [];

      if (loaderStatus) {
        loaderStatus.textContent = `Preparing Chapter 0${sIdx + 1} (${def.tag})...`;
      }

      const chunkSize = 25;
      for (let start = 1; start <= framesPerSeq; start += chunkSize) {
        const end = Math.min(start + chunkSize - 1, framesPerSeq);
        const chunkPromises = [];

        for (let f = start; f <= end; f++) {
          const img = new Image();
          const src = pattern(def.folder, f);

          const p = new Promise(resolve => {
            img.onload = () => {
              loadedImageCount++;
              onImageLoaded();
              resolve(img);
            };
            img.onerror = () => {
              loadedImageCount++;
              onImageLoaded();
              resolve(img);
            };
          });

          img.src = src;
          sequenceData[sIdx][f - 1] = img;
          chunkPromises.push(p);
        }

        await Promise.all(chunkPromises);

        if (sIdx === 0 && start === 1) {
          renderCurrentFrame();
        }

        // Enable quick launch as soon as initial beat is ready
        if (sIdx === 0 && end >= 30 && quickLaunchBtn) {
          quickLaunchBtn.style.display = 'inline-flex';
        }
      }
    }

    setTimeout(finishPreloader, 200);
  }

  function onImageLoaded() {
    const pct = Math.round((loadedImageCount / totalImageCount) * 100);
    if (loaderBar) loaderBar.style.width = `${pct}%`;
    if (loaderPercent) loaderPercent.textContent = `${pct}%`;

    if (pct >= 90 && loaderStatus) {
      loaderStatus.textContent = "Campus Chronicle Ready";
    }
  }

  function finishPreloader() {
    if (isLoaded) return;
    isLoaded = true;
    resizeCanvas();
    onScroll();
    currentProgress = targetProgress;
    renderCurrentFrame();

    if (preloader) {
      preloader.style.opacity = '0';
      preloader.style.pointerEvents = 'none';
      preloader.style.transform = 'scale(1.02)';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }
  }

  window.quickLaunch = function() {
    finishPreloader();
  };

  const qBtn = document.getElementById('quick-launch-btn');
  if (qBtn) {
    qBtn.addEventListener('click', finishPreloader);
  }

  // Bootstrap
  resizeCanvas();
  preloadAllAssets();
  requestAnimationFrame(loop);

})(window);

