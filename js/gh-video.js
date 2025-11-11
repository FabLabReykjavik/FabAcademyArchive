// gh-video.js
// Intercept links to GitHub raw video and image files,
// show them in a closable overlay using fetch+blob for videos
// so they play nicely instead of downloading.

(function () {
  const VIDEO_LINK_SELECTOR = [
    'a[href$=".mp4"]',
    'a[href$=".mpg"]',
    'a[href$=".mpeg"]',
    'a[href$=".webm"]',
    'a[href$=".ogg"]',
    'a[href$=".mov"]',
  ].join(", ");

  const IMAGE_LINK_SELECTOR = [
    'a[href$=".png"]',
    'a[href$=".jpg"]',
    'a[href$=".jpeg"]',
    'a[href$=".gif"]',
    'a[href$=".webp"]',
    'a[href$=".svg"]',
  ].join(", ");

  // ------------------------------------------------------------
  // Shared overlay bits
  // ------------------------------------------------------------

  function makeOverlayContainer() {
    // Remove any existing overlay first
    const existing = document.getElementById("gh-media-overlay");
    if (existing) existing.remove();

    // Overlay background
    const overlay = document.createElement("div");
    overlay.id = "gh-media-overlay";
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "rgba(0,0,0,0.8)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "9999";

    // Container
    const container = document.createElement("div");
    container.style.position = "relative";
    container.style.maxWidth = "90%";
    container.style.maxHeight = "90%";
    container.style.boxShadow = "0 0 20px rgba(0,0,0,0.8)";
    container.style.borderRadius = "8px";
    container.style.overflow = "hidden";
    container.style.background = "#000";

    // Close button
    const closeBtn = document.createElement("button");
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.textContent = "\u00D7"; // ×
    Object.assign(closeBtn.style, {
      position: "absolute",
      top: "8px",
      right: "8px",
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      border: "none",
      cursor: "pointer",
      fontSize: "22px",
      lineHeight: "32px",
      textAlign: "center",
      background: "rgba(255,255,255,0.9)",
      color: "#000",
      boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
      transition: "background 0.2s, transform 0.2s",
      zIndex: "10000",
    });
    closeBtn.addEventListener("mouseover", () => {
      closeBtn.style.background = "#fff";
      closeBtn.style.transform = "scale(1.1)";
    });
    closeBtn.addEventListener("mouseout", () => {
      closeBtn.style.background = "rgba(255,255,255,0.9)";
      closeBtn.style.transform = "scale(1.0)";
    });

    overlay.appendChild(container);
    container.appendChild(closeBtn);
    document.body.appendChild(overlay);

    return { overlay, container, closeBtn };
  }

  // ------------------------------------------------------------
  // Video overlay
  // ------------------------------------------------------------

  function createOverlayWithVideoBlob(blobUrl) {
    const { overlay, container, closeBtn } = makeOverlayContainer();

    const video = document.createElement("video");
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    video.style.display = "block";
    video.style.maxWidth = "100%";
    video.style.maxHeight = "100%";
    video.src = blobUrl;

    container.insertBefore(video, closeBtn);

    function closeOverlay() {
      try {
        video.pause();
      } catch (e) {}
      overlay.remove();
      document.removeEventListener("keydown", onKeyDown);
      URL.revokeObjectURL(blobUrl);
    }

    function onKeyDown(e) {
      if (e.key === "Escape" || e.key === "Esc") {
        closeOverlay();
      }
    }

    closeBtn.addEventListener("click", closeOverlay);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) {
        closeOverlay();
      }
    });
    document.addEventListener("keydown", onKeyDown);
  }

  // ------------------------------------------------------------
  // Image overlay
  // ------------------------------------------------------------

  function createOverlayWithImage(imageUrl) {
    const { overlay, container, closeBtn } = makeOverlayContainer();

    const img = document.createElement("img");
    img.src = imageUrl;
    img.style.display = "block";
    img.style.maxWidth = "100%";
    img.style.maxHeight = "100%";
    img.style.objectFit = "contain";
    img.alt = "";

    container.insertBefore(img, closeBtn);

    function closeOverlay() {
      overlay.remove();
      document.removeEventListener("keydown", onKeyDown);
    }

    function onKeyDown(e) {
      if (e.key === "Escape" || e.key === "Esc") {
        closeOverlay();
      }
    }

    closeBtn.addEventListener("click", closeOverlay);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) {
        closeOverlay();
      }
    });
    document.addEventListener("keydown", onKeyDown);
  }

  // ------------------------------------------------------------
  // Fetch helper for videos
  // ------------------------------------------------------------

  async function fetchBlobUrl(url, loadingNode) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      if (loadingNode && loadingNode.parentNode) {
        loadingNode.remove();
      }
      return blobUrl;
    } catch (err) {
      console.error("Failed to load video:", err);
      if (loadingNode) {
        loadingNode.textContent = "Failed to load video 😕";
      }
      throw err;
    }
  }

  // ------------------------------------------------------------
  // Setup video links (<a href="...mp4"> etc.)
  // ------------------------------------------------------------

  function setupVideoLinks() {
    const links = document.querySelectorAll(VIDEO_LINK_SELECTOR);

    links.forEach((link) => {
      const url = link.href;
      // Only handle GitHub raw links
      if (!url.includes("raw.githubusercontent.com")) return;

      link.addEventListener("click", async (e) => {
        // Only intercept plain left-click
        if (
          e.defaultPrevented ||
          e.button !== 0 || // not left click
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey // allow open in new tab/window
        ) {
          return;
        }

        e.preventDefault();

        const loading = document.createElement("span");
        loading.textContent = " Loading video...";
        loading.style.marginLeft = "0.5em";
        loading.style.display = "inline-block";
        link.insertAdjacentElement("afterend", loading);

        try {
          const blobUrl = await fetchBlobUrl(url, loading);
          createOverlayWithVideoBlob(blobUrl);
        } catch (err) {
          // fetchBlobUrl already logged + updated loading text
        }
      });
    });
  }

  // ------------------------------------------------------------
  // Setup image links (<a href="...png"> etc.)
  // ------------------------------------------------------------

  function setupImageLinks() {
    const links = document.querySelectorAll(IMAGE_LINK_SELECTOR);

    links.forEach((link) => {
      const url = link.href;
      // Only handle GitHub raw links
      if (!url.includes("raw.githubusercontent.com")) return;

      link.addEventListener("click", (e) => {
        // Only intercept plain left-click
        if (
          e.defaultPrevented ||
          e.button !== 0 || // not left click
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey // allow open in new tab/window
        ) {
          return;
        }

        e.preventDefault();
        createOverlayWithImage(url);
      });
    });
  }

  // ------------------------------------------------------------
  // Fix existing <video src="https://raw.githubusercontent.com/...">
  // ------------------------------------------------------------

  function fixExistingVideoTags() {
    const videoTags = document.querySelectorAll("video[src]");
    videoTags.forEach(async (video) => {
      const url = video.src;
      if (!url.includes("raw.githubusercontent.com")) return;

      const loading = document.createElement("div");
      loading.textContent = "Loading video...";
      video.insertAdjacentElement("beforebegin", loading);

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("HTTP " + res.status);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);

        loading.remove();
        video.src = blobUrl;
        // Optionally autoplay:
        // video.play();
      } catch (err) {
        console.error("Failed to fix video:", err);
        loading.textContent = "Failed to load video 😕";
      }
    });
  }

  // ------------------------------------------------------------
  // Init (works with and without Material's instant navigation)
  // ------------------------------------------------------------

  function init() {
    setupVideoLinks();
    setupImageLinks();
    fixExistingVideoTags();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  if (window.document$) {
    // Material's instant navigation support
    window.document$.subscribe(() => {
      init();
    });
  }
})();
