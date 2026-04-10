const CAUSE_META = {
  shutdown: { label: "Shutdown", symbol: "†", className: "cause-shutdown" },
  acquired: { label: "Acquired", symbol: "⊙", className: "cause-acquired" },
  paywalled: { label: "Paywalled", symbol: "◈", className: "cause-paywalled" },
  deprecated: { label: "Deprecated", symbol: "⌀", className: "cause-deprecated" },
  rate_limited: { label: "Rate limited", symbol: "⊗", className: "cause-rate-limited" }
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function formatDate(value) {
  return value || "Unknown";
}

function deathSortValue(value, latestInYear = true) {
  if (!value) {
    return 0;
  }

  if (/^\d{4}$/.test(value)) {
    return Number(`${value}${latestInYear ? "1231" : "0101"}`);
  }

  return Number(value.replaceAll("-", ""));
}

function highlightText(value, query) {
  const safe = escapeHtml(value || "");
  if (!query) {
    return safe;
  }

  const pattern = new RegExp(`(${escapeRegExp(query)})`, "ig");
  return safe.replace(pattern, "<mark>$1</mark>");
}

function matchesQuery(entry, query) {
  if (!query) {
    return true;
  }

  const haystack = [
    entry.name,
    entry.company,
    entry.description,
    entry.eulogy,
    ...(entry.tags || [])
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

function renderAlternatives(entry) {
  if (!entry.alternatives.length) {
    return "";
  }

  return `
    <div class="alternatives-row">
      ${entry.alternatives
        .map(
          (alternative) => `
            <a
              class="alt-pill"
              href="${escapeHtml(alternative.url)}"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit ${escapeHtml(alternative.name)} (opens in new tab)"
            >
              ${escapeHtml(alternative.name)}
              ${alternative.free ? "<small>free</small>" : ""}
            </a>
          `
        )
        .join("")}
    </div>
  `;
}

function renderTags(entry, query) {
  if (!entry.tags || entry.tags.length === 0) {
    return "";
  }

  return `
    <div class="card-meta">
      <span class="category-pill">${escapeHtml(entry.category)}</span>
      ${entry.tags
        .map((tag) => `<span class="tag-pill">${highlightText(tag, query)}</span>`)
        .join("")}
    </div>
  `;
}

function renderCard(entry, query) {
  const cause = CAUSE_META[entry.cause_of_death];
  const company = entry.company || "Independent service";

  return `
    <article class="grave-card ${cause.className}" aria-label="${escapeHtml(entry.name)}" data-entry-id="${escapeHtml(entry.id)}">
      <div class="grave-card-head">
        <div>
          <h3>${highlightText(entry.name, query)}</h3>
          <p class="grave-company">${highlightText(company, query)}</p>
        </div>
        <span class="cause-badge ${cause.className}">
          <span aria-hidden="true">${cause.symbol}</span>
          <span>${cause.label}</span>
        </span>
      </div>
      <div class="dates-row">
        <span>Born: <time datetime="${escapeHtml(entry.date_born || entry.date_died)}">${escapeHtml(entry.date_born || "Unknown")}</time></span>
        <span>Died: <time datetime="${escapeHtml(entry.date_died)}">${escapeHtml(formatDate(entry.date_died))}</time></span>
      </div>
      ${renderTags(entry, query)}
      <p class="grave-eulogy">${highlightText(entry.eulogy, query)}</p>
      ${entry.description ? `<p class="grave-company">${highlightText(entry.description, query)}</p>` : ""}
      ${renderAlternatives(entry)}
      <a class="read-more" href="entry/${escapeHtml(entry.id)}/">→ Read more</a>
    </article>
  `;
}

function debounce(callback, wait) {
  let timeoutId;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => callback(...args), wait);
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const dataNode = document.getElementById("entries-data");
  const grid = document.getElementById("grave-grid");
  const emptyState = document.getElementById("empty-state");
  const searchInput = document.getElementById("grave-search");
  const sortSelect = document.getElementById("sort-order");
  const summary = document.getElementById("results-summary");

  if (!dataNode || !grid || !searchInput || !sortSelect || !summary) {
    return;
  }

  const entries = JSON.parse(dataNode.textContent);
  const state = {
    cause: "all",
    category: "all",
    query: "",
    sort: "newest"
  };

  function applySort(items) {
    const clone = [...items];

    switch (state.sort) {
      case "oldest":
        return clone.sort((left, right) => deathSortValue(left.date_died, false) - deathSortValue(right.date_died, false));
      case "alphabetical":
        return clone.sort((left, right) => left.name.localeCompare(right.name));
      case "recently-added":
        return clone.sort((left, right) => String(right.added_date || "").localeCompare(String(left.added_date || "")));
      case "newest":
      default:
        return clone.sort((left, right) => deathSortValue(right.date_died) - deathSortValue(left.date_died));
    }
  }

  function render() {
    const filtered = applySort(
      entries.filter((entry) => {
        const causeMatch = state.cause === "all" || entry.cause_of_death === state.cause;
        const categoryMatch = state.category === "all" || entry.category === state.category;
        return causeMatch && categoryMatch && matchesQuery(entry, state.query);
      })
    );

    grid.innerHTML = filtered.map((entry) => renderCard(entry, state.query.trim())).join("");
    summary.textContent = `Showing ${filtered.length} of ${entries.length} entries.`;
    emptyState.hidden = filtered.length !== 0;
  }

  const handleSearch = debounce((event) => {
    state.query = event.target.value.trim();
    render();
  }, 200);

  searchInput.addEventListener("input", handleSearch);
  sortSelect.addEventListener("change", (event) => {
    state.sort = event.target.value;
    render();
  });

  document.querySelectorAll("[data-filter-cause]").forEach((button) => {
    button.addEventListener("click", () => {
      state.cause = button.getAttribute("data-filter-cause");
      document.querySelectorAll("[data-filter-cause]").forEach((chip) => {
        const active = chip === button;
        chip.classList.toggle("is-active", active);
        chip.setAttribute("aria-pressed", String(active));
      });
      render();
    });
  });

  document.querySelectorAll("[data-filter-category]").forEach((button) => {
    button.addEventListener("click", () => {
      state.category = button.getAttribute("data-filter-category");
      document.querySelectorAll("[data-filter-category]").forEach((chip) => {
        const active = chip === button;
        chip.classList.toggle("is-active", active);
        chip.setAttribute("aria-pressed", String(active));
      });
      render();
    });
  });

  render();
});
