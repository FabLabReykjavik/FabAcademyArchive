// docs/js/gh-video.js
document.addEventListener('DOMContentLoaded', () => {
  // 1️⃣ handle <a> links to videos (click-to-play)
  const videoLinks = document.querySelectorAll(
    'a[href$=".mp4"], a[href$=".mpg"], a[href$=".mpeg"], a[href$=".webm"], a[href$=".ogg"]'
  );

  videoLinks.forEach(link => {
    const url = link.href;
    if (!url.includes('raw.githubusercontent.com')) return;

    link.addEventListener('click', async e => {
      e.preventDefault();

      const loading = document.createElement('div');
      loading.textContent = 'Loading video...';
      link.insertAdjacentElement('afterend', loading);

      const video = document.createElement('video');
      video.controls = true;
      video.width = link.dataset.width || 640;
      video.height = link.dataset.height || 360;

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);

        loading.remove();
        link.insertAdjacentElement('afterend', video);
        link.style.display = 'none';
        video.src = blobUrl;
        video.play();
      } catch (err) {
        console.error('Failed to load video:', err);
        loading.textContent = 'Failed to load video 😕';
      }
    });
  });

  // 2️⃣ handle existing <video> tags that point to GitHub raw
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
      // Optionally autoplay repaired videos
      // video.play();
    } catch (err) {
      console.error('Failed to fix video:', err);
      loading.textContent = 'Failed to load video 😕';
    }
  });
});
