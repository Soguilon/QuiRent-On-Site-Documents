/* ===========================================================
   QuiRent — On-Site Documentation
   Vanilla JS: nav, media fallback, lightbox, notes, reveal
   =========================================================== */

(function () {
  'use strict';

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');

  function closeMenu() {
    navMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navMenu.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        closeMenu();
        navToggle.focus();
      }
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  var sections = Array.prototype.slice.call(
    document.querySelectorAll('main section[id]')
  );
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));

  function setActiveLink() {
    var scrollPos = window.scrollY + 120;
    var current = null;
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollPos) current = sec.id;
    });
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === current);
    });
  }
  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* ---------- Missing media detection ---------- */
  function showPlaceholder(mediaEl) {
    var frame = mediaEl.closest('.media-frame');
    if (!frame) return;
    var placeholder = frame.querySelector('.media-placeholder');
    mediaEl.hidden = true;
    mediaEl.style.display = 'none';
    if (placeholder) placeholder.hidden = false;
    var playBtn = frame.querySelector('.play-btn');
    if (playBtn) playBtn.hidden = true;
  }

  function handleImageError(imgEl) {
    showPlaceholder(imgEl);
  }
  // Exposed for inline onerror handlers
  window.QuiRent = window.QuiRent || {};
  window.QuiRent.handleImageError = handleImageError;

  /* ---------- Video loading: only show pending state on a real media error ---------- */
  document.querySelectorAll('.video-frame video').forEach(function (video) {
    var frame = video.closest('.media-frame');
    var placeholder = frame ? frame.querySelector('.media-placeholder') : null;
    var playBtn = frame ? frame.querySelector('.play-btn') : null;

    function showVideo() {
      video.hidden = false;
      video.style.removeProperty('display');
      if (placeholder) placeholder.hidden = true;
    }

    video.addEventListener('loadedmetadata', showVideo);
    video.addEventListener('loadeddata', showVideo);
    video.addEventListener('canplay', showVideo);
    video.addEventListener('error', function () {
      showPlaceholder(video);
    });

    // Autoplay may be blocked by the browser; offer a play button without
    // treating that policy restriction as a missing video file.
    var playPromise;
    try { playPromise = video.play(); } catch (err) { playPromise = null; }
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        if (playBtn) {
          playBtn.hidden = false;
          if (!playBtn.dataset.bound) {
            playBtn.dataset.bound = 'true';
            playBtn.addEventListener('click', function () {
              video.play().then(function () {
                playBtn.hidden = true;
              }).catch(function () {
                // Keep the play control available if playback remains blocked.
              });
            });
          }
        }
      });
    }
  });

  /* ---------- Accessible full-size media viewer ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImage = document.getElementById('lightboxImage');
  var lightboxVideo = document.getElementById('lightboxVideo');
  var lightboxClose = document.getElementById('lightboxClose');
  var lastFocused = null;
  var activeSourceVideo = null;

  function isMediaAvailable(mediaEl) {
    if (!mediaEl || mediaEl.hidden || mediaEl.style.display === 'none') return false;
    if (mediaEl.tagName === 'IMG') return mediaEl.complete && mediaEl.naturalWidth > 0;
    return mediaEl.readyState > 0 && !mediaEl.error;
  }

  function openMedia(mediaEl) {
    if (!lightbox || !isMediaAvailable(mediaEl)) return;
    lastFocused = document.activeElement;
    lightboxImage.hidden = true;
    lightboxVideo.hidden = true;
    lightboxImage.removeAttribute('src');
    lightboxVideo.pause();
    lightboxVideo.removeAttribute('src');
    lightboxVideo.load();
    activeSourceVideo = null;

    if (mediaEl.tagName === 'IMG') {
      lightboxImage.src = mediaEl.currentSrc || mediaEl.src;
      lightboxImage.alt = mediaEl.alt || 'Enlarged image';
      lightboxImage.hidden = false;
    } else if (mediaEl.tagName === 'VIDEO') {
      var source = mediaEl.currentSrc || (mediaEl.querySelector('source') && mediaEl.querySelector('source').src);
      if (!source) return;
      lightboxVideo.src = source;
      lightboxVideo.poster = mediaEl.poster || '';
      lightboxVideo.hidden = false;
      activeSourceVideo = mediaEl;
      lightboxVideo.currentTime = 0;
      var playAttempt = lightboxVideo.play();
      if (playAttempt && playAttempt.catch) playAttempt.catch(function () {});
    }
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lightboxVideo.pause();
    lightboxVideo.removeAttribute('src');
    lightboxVideo.load();
    lightboxImage.removeAttribute('src');
    lightboxImage.hidden = true;
    lightboxVideo.hidden = true;
    if (activeSourceVideo && !activeSourceVideo.paused) {
      var resume = activeSourceVideo.play();
      if (resume && resume.catch) resume.catch(function () {});
    }
    activeSourceVideo = null;
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  document.querySelectorAll('.media-frame').forEach(function (frame) {
    var media = frame.querySelector('img.media-element, video.media-element');
    if (!media) return;
    var enlarge = document.createElement('button');
    enlarge.type = 'button';
    enlarge.className = 'media-enlarge-btn';
    enlarge.setAttribute('aria-label', 'Enlarge ' + (media.tagName === 'VIDEO' ? 'video' : 'image') + ' to view full size');
    enlarge.innerHTML = '<i class="fa-solid fa-up-right-and-down-left-from-center" aria-hidden="true"></i><span>Enlarge</span>';
    enlarge.addEventListener('click', function () { openMedia(media); });
    frame.appendChild(enlarge);
    if (media.tagName === 'IMG') {
      media.classList.add('lightbox-trigger');
      media.setAttribute('tabindex', '0');
      media.addEventListener('click', function () { openMedia(media); });
      media.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openMedia(media); }
      });
    }
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('is-open')) closeLightbox();
  });

  /* ---------- Scroll reveal ---------- */
  var revealTargets = document.querySelectorAll('.arrangement-card, .media-frame, .limitation-card, .notes-form');
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(function (el) { observer.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }
})();
