// gh-video.js
// Intercept links to GitHub raw video files and show them in a closable overlay,
// using fetch+blob so they play nicely instead of downloading.

(function () {
  const VIDEO_LINK_SELECTOR = [
    'a[href$=".mp4"]',
    'a[href$=".mpg"]',
    'a[href$=".mpeg"]',
    'a[href$=".webm"]',
    'a[href$=".ogg"]',
    'a[href$=".mov"]',
  ].join(', ');

  function createOverlayWithVideoBlob(blobUrl) {
    // Remove any existing overlay first
    const existing = document.getElementById('gh-video-overlay');
    if (existing) existing.remove();

    // Overlay background
    const overlay = document.createElement('div');
    overlay.id = 'gh-video-overlay';
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.background = 'rgba(0,0,0,0.8)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '9999';

    // Container
    const container = document.createElement('div');
    container.style.position = 'relative';
    container.style.maxWidth = '90%';
    container.style.maxHeight = '90%';
    container.style.boxShadow = '0 0 20px rgba(0,0,0,0.8)';
    container.style.borderRadius = '8px';
    container.style.overflow = 'hidden';
    container.style.background = '#000';

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '\u00D7'; // \u00D7 = Unicode for x
    closeBtn.setAttribute('aria-label', 'Close video');

    // better placement & visuals
    Object.assign(closeBtn.style, {
        position: 'absolute',
        top: '8px',
        right: '8px',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        fontSize: '22px',
        lineHeight: '32px',
        textAlign: 'center',
        background: 'rgba(255,255,255,0.9)',
        color: '#000',
        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
        transition: 'background 0.2s, transform 0.2s',
        zIndex: '10000',
    });
    closeBtn.addEventListener('mouseover', () => {
        closeBtn.style.background = '#fff';
        closeBtn.style.transform = 'scale(1.1)';
    });
    closeBtn.addEventListener('mouseout', () => {
        closeBtn.style.background = 'rgba(255,255,255,0.9)';
        closeBtn.style.transform = 'scale(1.0)';
    });


    // Video element
    const video = document.createElement('video');
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    video.style.display = 'block';
    video.style.maxWidth = '100%';
    video.style.maxHeight = '100%';
    video.src = blobUrl;

    container.appendChild(video);
    container.appendChild(closeBtn);
    overlay.appendChild(container);
    document.body.appendChild(overlay);

    function closeOverlay() {
      try {
        video.pause();
      } catch (e) {}
      overlay.remove();
      document.removeEventListener('keydown', onKeyDown);
      URL.revokeObjectURL(blobUrl);
    }

    function onKeyDown(e) {
      if (e.key === 'Escape' || e.key === 'Esc') {
        closeOverlay();
      }
    }

    closeBtn.addEventListener('click', closeOverlay);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        closeOverlay();
      }
    });

    document.addEventListener('keydown', onKeyDown);
  }

  async function fetchBlobUrl(url, loadingNode) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      if (loadingNode && loadingNode.parentNode) {
        loadingNode.remove();
      }
      return blobUrl;
    } catch (err) {
      console.error('Failed to load video:', err);
      if (loadingNode) {
        loadingNode.textContent = 'Failed to load video 😕';
      }
      throw err;
    }
  }

  function setupVideoLinks() {
    const links = document.querySelectorAll(VIDEO_LINK_SELECTOR);

    links.forEach(link => {
      const url = link.href;
      // Only handle GitHub raw links
      if (!url.includes('raw.githubusercontent.com')) return;

      link.addEventListener('click', async e => {
        // Only intercept plain left-click
        if (
          e.defaultPrevented ||
          e.button !== 0 ||     // not left click
          e.metaKey || e.ctrlKey || e.shiftKey || e.altKey // allow open in new tab/window
        ) {
          return;
        }

        e.preventDefault();

        const loading = document.createElement('div');
        loading.textContent = 'Loading video...';
        loading.style.marginLeft = '0.5em';
        loading.style.display = 'inline-block';
        link.insertAdjacentElement('afterend', loading);

        try {
          const blobUrl = await fetchBlobUrl(url, loading);
          createOverlayWithVideoBlob(blobUrl);
        } catch (err) {
          // fetchBlobUrl already logged + updated loading text
        }
      });
    });
  }

  function fixExistingVideoTags() {
    const videoTags = document.querySelectorAll('video[src]');
    videoTags.forEach(async video => {
      const url = video.src;
      if (!url.includes('raw.githubusercontent.com')) return;

      const loading = document.createElement('div');
      loading.textContent = 'Loading video...';
      video.insertAdjacentElement('beforebegin', loading);

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);

        loading.remove();
        video.src = blobUrl;
        // Optionally autoplay:
        // video.play();
      } catch (err) {
        console.error('Failed to fix video:', err);
        loading.textContent = 'Failed to load video 😕';
      }
    });
  }

  function init() {
    setupVideoLinks();
    fixExistingVideoTags();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
