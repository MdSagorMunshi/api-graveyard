const CURRENT_YEAR = new Date().getFullYear();

const causeOptions = [
  { value: "shutdown", label: "Shutdown", symbol: "†", className: "cause-shutdown" },
  { value: "acquired", label: "Acquired", symbol: "⊙", className: "cause-acquired" },
  { value: "paywalled", label: "Paywalled", symbol: "◈", className: "cause-paywalled" },
  { value: "deprecated", label: "Deprecated", symbol: "⌀", className: "cause-deprecated" },
  { value: "rate_limited", label: "Rate limited", symbol: "⊗", className: "cause-rate-limited" }
];

const categoryOptions = [
  { value: "hosting", label: "Hosting" },
  { value: "database", label: "Database" },
  { value: "auth", label: "Auth" },
  { value: "email", label: "Email" },
  { value: "storage", label: "Storage" },
  { value: "social", label: "Social" },
  { value: "maps", label: "Maps" },
  { value: "payment", label: "Payment" },
  { value: "messaging", label: "Messaging" },
  { value: "analytics", label: "Analytics" },
  { value: "translation", label: "Translation" },
  { value: "search", label: "Search" },
  { value: "media", label: "Media" },
  { value: "monitoring", label: "Monitoring" },
  { value: "other", label: "Other" }
];

const recordStatusOptions = [
  { value: "verified", label: "Verified", className: "status-verified" },
  { value: "needs_review", label: "Needs review", className: "status-needs-review" },
  { value: "disputed", label: "Disputed", className: "status-disputed" }
];

function formatDisplayDate(value) {
  if (!value) {
    return "Unknown";
  }

  if (/^\d{4}$/.test(value)) {
    return value;
  }

  const [year, month, day] = value.split("-");
  return `${year}-${month}-${day}`;
}

function yearFromDate(value) {
  return String(value || "").slice(0, 4);
}

function sortValue(value, latestInYear = true) {
  if (!value) {
    return 0;
  }

  if (/^\d{4}$/.test(value)) {
    return Number(`${value}${latestInYear ? "1231" : "0101"}`);
  }

  return Number(String(value).replaceAll("-", ""));
}

function causeMeta(value) {
  return causeOptions.find((cause) => cause.value === value) || causeOptions[0];
}

function recordStatusMeta(value) {
  return recordStatusOptions.find((status) => status.value === value) || recordStatusOptions[0];
}

function groupByDeathYear(entries) {
  const years = new Map();

  [...entries]
    .sort((left, right) => sortValue(right.date_died) - sortValue(left.date_died))
    .forEach((entry) => {
      const year = yearFromDate(entry.date_died);
      const group = years.get(year) || [];
      group.push(entry);
      years.set(year, group);
    });

  return [...years.entries()]
    .sort((left, right) => Number(right[0]) - Number(left[0]))
    .map(([year, items]) => ({
      year,
      decade: `${String(year).slice(0, 3)}0s`,
      entries: items
    }));
}

function escapeAttributeJson(value) {
  return JSON.stringify(value)
    .replace(/&/g, "&amp;")
    .replace(/'/g, "&#39;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildSparkline(entries, category) {
  const startYear = 2010;
  const endYear = CURRENT_YEAR;
  const counts = [];

  for (let year = startYear; year <= endYear; year += 1) {
    counts.push(
      entries.filter(
        (entry) => entry.category === category && Number(yearFromDate(entry.date_died)) === year
      ).length
    );
  }

  const maxCount = Math.max(...counts, 1);
  const width = 120;
  const height = 32;
  const step = width / Math.max(counts.length - 1, 1);

  const points = counts
    .map((count, index) => {
      const x = (index * step).toFixed(2);
      const y = (height - 4 - (count / maxCount) * (height - 8)).toFixed(2);
      return `${x},${y}`;
    })
    .join(" ");

  return `
    <svg viewBox="0 0 ${width} ${height}" class="sparkline" aria-hidden="true" focusable="false">
      <polyline points="${points}" fill="none" stroke="currentColor" stroke-width="2" />
    </svg>
  `.trim();
}

function relatedEntries(entries, currentEntry) {
  return [...entries]
    .filter((entry) => entry.id !== currentEntry.id)
    .sort((left, right) => {
      const leftScore =
        (left.category === currentEntry.category ? 2 : 0) +
        (left.company && left.company === currentEntry.company ? 3 : 0);
      const rightScore =
        (right.category === currentEntry.category ? 2 : 0) +
        (right.company && right.company === currentEntry.company ? 3 : 0);

      if (rightScore !== leftScore) {
        return rightScore - leftScore;
      }

      return sortValue(right.date_died) - sortValue(left.date_died);
    })
    .slice(0, 3);
}

function absoluteUrl(urlPath, baseUrl) {
  const trimmedBase = String(baseUrl || "").replace(/\/$/, "");
  const normalizedPath = String(urlPath || "").startsWith("/")
    ? urlPath
    : `/${String(urlPath || "")}`;
  return `${trimmedBase}${normalizedPath}`;
}

module.exports = function configure(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "site/assets": "assets" });
  eleventyConfig.addWatchTarget("data/entries.json");
  eleventyConfig.addWatchTarget("data/stats.json");

  eleventyConfig.addGlobalData("siteMeta", {
    title: "api-graveyard",
    tagline: "In loving memory of APIs we once called",
    subtitle:
      "A community-maintained obituary desk for APIs, SDKs, and free tiers that were buried by shutdowns, acquisitions, price sheets, or plain neglect.",
    baseUrl: "https://mdsagormunshi.github.io/api-graveyard",
    repoUrl: "https://github.com/MdSagorMunshi/api-graveyard",
    issueUrl: "https://github.com/MdSagorMunshi/api-graveyard/issues/new?template=new-death.yml",
    contributingUrl: "https://github.com/MdSagorMunshi/api-graveyard/blob/main/CONTRIBUTING.md",
    causeOptions,
    categoryOptions,
    recordStatusOptions
  });

  eleventyConfig.addFilter("json", (value) => JSON.stringify(value));
  eleventyConfig.addFilter("htmlAttrJson", escapeAttributeJson);
  eleventyConfig.addFilter("causeMeta", causeMeta);
  eleventyConfig.addFilter("recordStatusMeta", recordStatusMeta);
  eleventyConfig.addFilter("formatDisplayDate", formatDisplayDate);
  eleventyConfig.addFilter("dateYear", yearFromDate);
  eleventyConfig.addFilter("absoluteUrl", absoluteUrl);
  eleventyConfig.addFilter("sortByDateDied", (entries) =>
    [...entries].sort((left, right) => sortValue(right.date_died) - sortValue(left.date_died))
  );
  eleventyConfig.addFilter("sortByDateDiedAsc", (entries) =>
    [...entries].sort((left, right) => sortValue(left.date_died, false) - sortValue(right.date_died, false))
  );
  eleventyConfig.addFilter("sortAlphabetical", (entries) =>
    [...entries].sort((left, right) => left.name.localeCompare(right.name))
  );
  eleventyConfig.addFilter("sortByAdded", (entries) =>
    [...entries].sort((left, right) => String(right.added_date || "").localeCompare(String(left.added_date || "")))
  );
  eleventyConfig.addFilter("groupByDeathYear", groupByDeathYear);
  eleventyConfig.addFilter("relatedEntries", relatedEntries);
  eleventyConfig.addFilter("sparkline", buildSparkline);
  eleventyConfig.addFilter("mostMourned", (entries, limit = 5) =>
    [...entries]
      .sort((left, right) => right.alternatives.length - left.alternatives.length || left.name.localeCompare(right.name))
      .slice(0, limit)
  );

  return {
    dir: {
      input: "site",
      data: "../data",
      output: "_site"
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};
