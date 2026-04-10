function initNavigation() {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");

  if (!header || !toggle) {
    return;
  }

  toggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 720) {
      header.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

function animateCounters() {
  const counters = document.querySelectorAll("[data-counter]");

  counters.forEach((counter) => {
    const target = Number(counter.getAttribute("data-count")) || 0;
    const duration = 900;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = String(Math.round(target * eased));

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        counter.textContent = String(target);
      }
    }

    requestAnimationFrame(tick);
  });
}

function initCopyButtons() {
  document.querySelectorAll("[data-copy-url]").forEach((button) => {
    button.addEventListener("click", async () => {
      const url = button.getAttribute("data-copy-url");
      if (!url) {
        return;
      }

      try {
        await navigator.clipboard.writeText(url);
        const original = button.textContent;
        button.textContent = "Copied";
        window.setTimeout(() => {
          button.textContent = original;
        }, 1200);
      } catch {
        button.textContent = "Copy failed";
      }
    });
  });
}

function initShareLinks() {
  document.querySelectorAll("[data-share-intent]").forEach((link) => {
    const text = link.getAttribute("data-share-text") || "";
    const url = link.getAttribute("data-share-url") || window.location.href;
    const query = new URLSearchParams({
      text,
      url
    });
    link.setAttribute("href", `https://twitter.com/intent/tweet?${query.toString()}`);
  });
}

function setFooterYear() {
  const node = document.getElementById("footer-year");
  if (node) {
    node.textContent = String(new Date().getFullYear());
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  animateCounters();
  initCopyButtons();
  initShareLinks();
  setFooterYear();
});
