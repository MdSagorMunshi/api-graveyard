const fs = require("node:fs");
const path = require("node:path");

const ENTRIES_PATH = path.join(__dirname, "..", "data", "entries.json");
const TODAY = "2026-04-11";
const ADDED_BY = "MdSagorMunshi";

const CATEGORY_ALTERNATIVES = {
  hosting: [
    { name: "Coolify", url: "https://coolify.io/", free: true },
    { name: "Dokku", url: "https://dokku.com/", free: true },
    { name: "CapRover", url: "https://caprover.com/", free: true }
  ],
  database: [
    { name: "Supabase", url: "https://supabase.com/", free: true },
    { name: "Appwrite", url: "https://appwrite.io/", free: true },
    { name: "PocketBase", url: "https://pocketbase.io/", free: true }
  ],
  auth: [
    { name: "Keycloak", url: "https://www.keycloak.org/", free: true },
    { name: "Authentik", url: "https://goauthentik.io/", free: true },
    { name: "Supabase Auth", url: "https://supabase.com/auth", free: true }
  ],
  email: [
    { name: "Postal", url: "https://postalserver.io/", free: true },
    { name: "Listmonk", url: "https://listmonk.app/", free: true },
    { name: "Mautic", url: "https://www.mautic.org/", free: true }
  ],
  storage: [
    { name: "MinIO", url: "https://min.io/", free: true },
    { name: "Supabase Storage", url: "https://supabase.com/storage", free: true },
    { name: "Appwrite Storage", url: "https://appwrite.io/docs/products/storage", free: true }
  ],
  social: [
    { name: "Mastodon API", url: "https://docs.joinmastodon.org/api/", free: true },
    { name: "Bluesky API", url: "https://docs.bsky.app/", free: true },
    { name: "Matrix", url: "https://matrix.org/", free: true }
  ],
  maps: [
    { name: "MapLibre", url: "https://maplibre.org/", free: true },
    { name: "Leaflet", url: "https://leafletjs.com/", free: true },
    { name: "OpenCage", url: "https://opencagedata.com/pricing", free: true }
  ],
  payment: [
    { name: "BTCPay Server", url: "https://btcpayserver.org/", free: true },
    { name: "Medusa", url: "https://medusajs.com/", free: true },
    { name: "Vendure", url: "https://www.vendure.io/", free: true }
  ],
  messaging: [
    { name: "NATS", url: "https://nats.io/", free: true },
    { name: "Socket.IO", url: "https://socket.io/", free: true },
    { name: "Matrix", url: "https://matrix.org/", free: true }
  ],
  analytics: [
    { name: "PostHog", url: "https://posthog.com/", free: true },
    { name: "Umami", url: "https://umami.is/", free: true },
    { name: "Plausible CE", url: "https://github.com/plausible/community-edition", free: true }
  ],
  translation: [
    { name: "LibreTranslate", url: "https://libretranslate.com/", free: true },
    { name: "Argos Translate", url: "https://www.argosopentech.com/argospm/index/", free: true },
    { name: "Apertium", url: "https://www.apertium.org/", free: true }
  ],
  search: [
    { name: "Meilisearch", url: "https://www.meilisearch.com/", free: true },
    { name: "Typesense", url: "https://typesense.org/", free: true },
    { name: "OpenSearch", url: "https://opensearch.org/", free: true }
  ],
  media: [
    { name: "imgproxy", url: "https://imgproxy.net/", free: true },
    { name: "Thumbor", url: "https://www.thumbor.org/", free: true },
    { name: "MediaCMS", url: "https://mediacms.io/", free: true }
  ],
  monitoring: [
    { name: "Grafana", url: "https://grafana.com/", free: true },
    { name: "GlitchTip", url: "https://glitchtip.com/", free: true },
    { name: "Sentry Self-Hosted", url: "https://develop.sentry.dev/self-hosted/", free: true }
  ],
  other: [
    { name: "Directus", url: "https://directus.io/", free: true },
    { name: "NocoDB", url: "https://nocodb.com/", free: true },
    { name: "Appwrite", url: "https://appwrite.io/", free: true }
  ]
};

const EULOGY_TEMPLATES = [
  "You had kept one more legacy integration alive while everyone else promised they were migrating next sprint. Then your end-of-life date arrived and nostalgia stopped compiling.",
  "You had carried old code paths with a patience nobody deserved. When support ended, the roadmap finally admitted it had already buried you.",
  "You had survived on compatibility and habit longer than most managers survive accountability. When the cutoff came, even the warning banners sounded tired.",
  "You had let brittle integrations limp along with surprising dignity. Once the provider turned out the lights, technical debt had to introduce itself by name.",
  "You had remained in production mostly because nobody wanted to reopen that part of the codebase. Your funeral was attended by every postponed migration ticket."
];

const SHOPIFY_ALTERNATIVES = [
  { name: "Medusa", url: "https://medusajs.com/", free: true },
  { name: "Saleor", url: "https://saleor.io/", free: true },
  { name: "Vendure", url: "https://www.vendure.io/", free: true }
];

const SALESFORCE_ALTERNATIVES = [
  { name: "Directus", url: "https://directus.io/", free: true },
  { name: "NocoDB", url: "https://nocodb.com/", free: true },
  { name: "Supabase", url: "https://supabase.com/", free: true }
];

const GOOGLE_ENTRIES = [
  {
    id: "google-code-search-api",
    name: "Google Code Search API",
    category: "search",
    date_died: "2011",
    source_url: "https://developers.googleblog.com/spring-cleaning-for-some-of-our-apis/",
    tags: ["google", "code-search", "search", "deprecated"]
  },
  {
    id: "google-diacritize-api",
    name: "Google Diacritize API",
    category: "translation",
    date_died: "2011",
    source_url: "https://developers.googleblog.com/spring-cleaning-for-some-of-our-apis/",
    tags: ["google", "text", "diacritics", "language"]
  },
  {
    id: "feedburner-apis",
    name: "FeedBurner APIs",
    category: "analytics",
    date_died: "2011",
    source_url: "https://developers.googleblog.com/spring-cleaning-for-some-of-our-apis/",
    tags: ["google", "feedburner", "rss", "analytics"]
  },
  {
    id: "google-finance-api",
    name: "Google Finance API",
    category: "analytics",
    date_died: "2012-10-20",
    source_url: "https://groups.google.com/g/google-finance-apis",
    tags: ["google", "finance", "stocks", "market-data"]
  },
  {
    id: "google-powermeter-api",
    name: "Google PowerMeter API",
    category: "monitoring",
    date_died: "2011",
    source_url: "https://developers.googleblog.com/spring-cleaning-for-some-of-our-apis/",
    tags: ["google", "energy", "monitoring", "powermeter"]
  },
  {
    id: "google-sidewiki-api",
    name: "Google Sidewiki API",
    category: "social",
    date_died: "2011",
    source_url: "https://developers.googleblog.com/spring-cleaning-for-some-of-our-apis/",
    tags: ["google", "annotations", "social", "sidewiki"]
  },
  {
    id: "google-wave-api",
    name: "Google Wave API",
    category: "messaging",
    date_died: "2011",
    source_url: "https://developers.googleblog.com/spring-cleaning-for-some-of-our-apis/",
    tags: ["google", "wave", "collaboration", "messaging"]
  },
  {
    id: "google-blog-search-api",
    name: "Google Blog Search API",
    category: "search",
    date_died: "2016-02-15",
    source_url: "https://developers.googleblog.com/en/retirement-of-certain-google-search-apis/",
    tags: ["google", "blog-search", "search", "retired"]
  },
  {
    id: "google-books-data-api",
    name: "Google Books Data API",
    category: "search",
    date_died: "2011",
    source_url: "https://developers.googleblog.com/spring-cleaning-for-some-of-our-apis/",
    tags: ["google", "books", "gdata", "search"]
  },
  {
    id: "google-books-javascript-api",
    name: "Google Books JavaScript API",
    category: "search",
    date_died: "2011",
    source_url: "https://developers.googleblog.com/spring-cleaning-for-some-of-our-apis/",
    tags: ["google", "books", "javascript", "search"]
  },
  {
    id: "google-image-search-api",
    name: "Google Image Search API",
    category: "search",
    date_died: "2016-02-15",
    source_url: "https://developers.googleblog.com/en/retirement-of-certain-google-search-apis/",
    tags: ["google", "images", "search", "retired"]
  },
  {
    id: "google-news-search-api",
    name: "Google News Search API",
    category: "search",
    date_died: "2016-02-15",
    source_url: "https://developers.googleblog.com/en/retirement-of-certain-google-search-apis/",
    tags: ["google", "news", "search", "retired"]
  },
  {
    id: "google-patent-search-api",
    name: "Google Patent Search API",
    category: "search",
    date_died: "2016-02-15",
    source_url: "https://developers.googleblog.com/en/retirement-of-certain-google-search-apis/",
    tags: ["google", "patents", "search", "retired"]
  },
  {
    id: "google-safe-browsing-api-v1",
    name: "Google Safe Browsing API v1",
    category: "monitoring",
    date_died: "2011",
    source_url: "https://developers.googleblog.com/spring-cleaning-for-some-of-our-apis/",
    tags: ["google", "safe-browsing", "security", "v1"]
  },
  {
    id: "google-transliterate-api",
    name: "Google Transliterate API",
    category: "translation",
    date_died: "2011",
    source_url: "https://developers.googleblog.com/spring-cleaning-for-some-of-our-apis/",
    tags: ["google", "transliteration", "language", "deprecated"]
  },
  {
    id: "google-video-search-api",
    name: "Google Video Search API",
    category: "search",
    date_died: "2016-02-15",
    source_url: "https://developers.googleblog.com/en/retirement-of-certain-google-search-apis/",
    tags: ["google", "video", "search", "retired"]
  },
  {
    id: "google-virtual-keyboard-api",
    name: "Google Virtual Keyboard API",
    category: "other",
    date_died: "2011",
    source_url: "https://developers.googleblog.com/spring-cleaning-for-some-of-our-apis/",
    tags: ["google", "keyboard", "input", "deprecated"]
  },
  {
    id: "google-moderator-api",
    name: "Google Moderator API",
    category: "social",
    date_died: "2013",
    source_url: "https://developers.googleblog.com/changes-to-deprecation-policies-and-api-spring-cleaning/",
    tags: ["google", "moderator", "social", "discussions"]
  },
  {
    id: "legacy-portable-contacts-api",
    name: "Legacy Portable Contacts API",
    category: "social",
    date_died: "2013",
    source_url: "https://developers.googleblog.com/changes-to-deprecation-policies-and-api-spring-cleaning/",
    tags: ["google", "contacts", "portable-contacts", "legacy"]
  },
  {
    id: "google-image-charts",
    name: "Google Image Charts",
    category: "analytics",
    date_died: "2012",
    source_url: "https://developers.googleblog.com/changes-to-deprecation-policies-and-api-spring-cleaning/",
    tags: ["google", "charts", "images", "deprecated"]
  },
  {
    id: "google-infographics-api",
    name: "Google Infographics API",
    category: "analytics",
    date_died: "2012",
    source_url: "https://developers.googleblog.com/changes-to-deprecation-policies-and-api-spring-cleaning/",
    tags: ["google", "infographics", "charts", "deprecated"]
  },
  {
    id: "documents-list-api",
    name: "Documents List API",
    category: "storage",
    date_died: "2015-04-20",
    source_url: "https://developers.googleblog.com/en/reminder-to-migrate-to-updated-google-data-apis/",
    tags: ["google", "documents", "drive", "gdata"]
  },
  {
    id: "admin-audit-api",
    name: "Admin Audit API",
    category: "analytics",
    date_died: "2015-04-20",
    source_url: "https://developers.googleblog.com/en/reminder-to-migrate-to-updated-google-data-apis/",
    tags: ["google", "admin", "audit", "reports"]
  },
  {
    id: "google-apps-profiles-api",
    name: "Google Apps Profiles API",
    category: "auth",
    date_died: "2015-04-20",
    source_url: "https://developers.googleblog.com/en/reminder-to-migrate-to-updated-google-data-apis/",
    tags: ["google", "apps", "profiles", "identity"]
  },
  {
    id: "google-provisioning-api",
    name: "Google Provisioning API",
    category: "auth",
    date_died: "2015-04-20",
    source_url: "https://developers.googleblog.com/en/reminder-to-migrate-to-updated-google-data-apis/",
    tags: ["google", "provisioning", "admin", "identity"]
  },
  {
    id: "google-reporting-api",
    name: "Google Reporting API",
    category: "analytics",
    date_died: "2015-04-20",
    source_url: "https://developers.googleblog.com/en/reminder-to-migrate-to-updated-google-data-apis/",
    tags: ["google", "reporting", "analytics", "gdata"]
  },
  {
    id: "google-email-migration-api-v1",
    name: "Google Email Migration API v1",
    category: "email",
    date_died: "2015-04-20",
    source_url: "https://developers.googleblog.com/en/reminder-to-migrate-to-updated-google-data-apis/",
    tags: ["google", "email", "migration", "v1"]
  },
  {
    id: "reporting-visualization-api",
    name: "Reporting Visualization API",
    category: "analytics",
    date_died: "2015-04-20",
    source_url: "https://developers.googleblog.com/en/reminder-to-migrate-to-updated-google-data-apis/",
    tags: ["google", "reporting", "visualization", "analytics"]
  },
  {
    id: "openid-2-google-apis",
    name: "OpenID 2.0 for Google APIs",
    category: "auth",
    date_died: "2015-04-20",
    source_url: "https://developers.googleblog.com/en/reminder-to-migrate-to-updated-google-data-apis/",
    tags: ["google", "openid", "auth", "identity"]
  },
  {
    id: "google-feed-api",
    name: "Google Feed API",
    category: "search",
    date_died: "2016-09-29",
    source_url: "https://developers.googleblog.com/2016/06/announcing-turndown-of-google-feed-api.html",
    tags: ["google", "feeds", "rss", "ajax"]
  },
  {
    id: "google-plus-web-api",
    name: "Google+ Web API",
    category: "social",
    date_died: "2019-03-07",
    source_url: "https://developers.googleblog.com/en/google-apis-shutting-down-march-7-2019/",
    tags: ["google", "google-plus", "web", "social"]
  },
  {
    id: "google-plus-android-sdk",
    name: "Google+ Android SDK",
    category: "social",
    date_died: "2019-03-07",
    source_url: "https://developers.googleblog.com/en/google-apis-shutting-down-march-7-2019/",
    tags: ["google", "google-plus", "android", "sdk"]
  },
  {
    id: "google-plus-domains-api",
    name: "Google+ Domains API",
    category: "social",
    date_died: "2019-03-07",
    source_url: "https://developers.googleblog.com/en/google-apis-shutting-down-march-7-2019/",
    tags: ["google", "google-plus", "domains", "social"]
  },
  {
    id: "google-plus-pages-api",
    name: "Google+ Pages API",
    category: "social",
    date_died: "2019-03-07",
    source_url: "https://developers.googleblog.com/en/google-apis-shutting-down-march-7-2019/",
    tags: ["google", "google-plus", "pages", "social"]
  },
  {
    id: "google-plus-sign-in-feature",
    name: "Google+ Sign-In feature",
    category: "auth",
    date_died: "2019-03-07",
    source_url: "https://developers.googleblog.com/en/google-apis-shutting-down-march-7-2019/",
    tags: ["google", "google-plus", "sign-in", "auth"]
  },
  {
    id: "google-over-the-air-installs",
    name: "Google Over-the-Air Installs",
    category: "other",
    date_died: "2019-03-07",
    source_url: "https://developers.googleblog.com/en/google-apis-shutting-down-march-7-2019/",
    tags: ["google", "ota", "android", "installs"]
  },
  {
    id: "google-contacts-api",
    name: "Google Contacts API",
    category: "social",
    date_died: "2021-06-15",
    source_url: "https://developers.googleblog.com/google-people-api-now-supports-batch-mutates-and-searches-of-contacts/",
    tags: ["google", "contacts", "people", "gdata"]
  },
  {
    id: "google-url-shortener-api",
    name: "Google URL Shortener API",
    category: "other",
    date_died: "2019-03-30",
    source_url: "https://developers.googleblog.com/transitioning-google-url-shortener-to-firebase-dynamic-links/",
    tags: ["google", "goo-gl", "url-shortener", "links"]
  }
];

function normalizeDate(date, latestInYear = true) {
  if (/^\d{4}$/.test(date)) {
    return `${date}-${latestInYear ? "12-31" : "01-01"}`;
  }

  return date;
}

function compareByDateDesc(left, right) {
  return normalizeDate(right.date_died).localeCompare(normalizeDate(left.date_died));
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function toTitleCase(value) {
  return value
    .split("-")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(" ");
}

function quarterVersions(startYear, startMonth, endYear, endMonth) {
  const versions = [];
  let year = startYear;
  let month = startMonth;

  while (year < endYear || (year === endYear && month <= endMonth)) {
    versions.push(`${year}-${String(month).padStart(2, "0")}`);
    month += 3;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }

  return versions;
}

function addOneYear(version) {
  const [year, month] = version.split("-").map(Number);
  return `${year + 1}-${String(month).padStart(2, "0")}-01`;
}

function pickTemplate(seed) {
  let hash = 0;
  for (const char of seed) {
    hash = (hash * 33 + char.charCodeAt(0)) >>> 0;
  }

  return EULOGY_TEMPLATES[hash % EULOGY_TEMPLATES.length];
}

function cloneAlternatives(category) {
  return (CATEGORY_ALTERNATIVES[category] || CATEGORY_ALTERNATIVES.other).map((alternative) => ({
    ...alternative
  }));
}

function inferCategory(name, company = "") {
  const text = `${name} ${company}`.toLowerCase();

  if (/(oauth|auth|login|identity|sso|sign-in|openid)/.test(text)) return "auth";
  if (/(mail|email|smtp)/.test(text)) return "email";
  if (/(chat|message|messaging|webhook|notification|sms)/.test(text)) return "messaging";
  if (/(search|query|index|feed)/.test(text)) return "search";
  if (/(image|video|audio|media|recording|stream)/.test(text)) return "media";
  if (/(map|geo|place|route|location)/.test(text)) return "maps";
  if (/(analytics|report|insight|metric|dashboard)/.test(text)) return "analytics";
  if (/(device|monitor|security|alert|trust)/.test(text)) return "monitoring";
  if (/(storage|file|drive|attachment|blob|bucket)/.test(text)) return "storage";
  if (/(translate|translation|summarize|language|text)/.test(text)) return "translation";
  if (/(social|instagram|community|engage|profile|people|contacts)/.test(text)) return "social";
  if (/(payment|billing|invoice|tax|accounting|checkout|merchant|pricing)/.test(text)) return "payment";
  if (/(database|sql|crm|record)/.test(text)) return "database";
  if (/(deploy|host|hosting|workers|pages)/.test(text)) return "hosting";

  return "other";
}

function trimToLimit(value, limit) {
  if (value.length <= limit) {
    return value;
  }

  return `${value.slice(0, limit - 1).trimEnd()}.`;
}

function makeDescription(name, company) {
  return trimToLimit(
    `It had exposed ${name} until ${company || "its provider"} retired it and pushed developers onto newer interfaces.`,
    160
  );
}

function makeEulogy(name) {
  return trimToLimit(pickTemplate(name), 280);
}

function buildEntry({
  id,
  name,
  category,
  cause_of_death,
  date_died,
  source_url,
  alternatives,
  date_born = null,
  company = null,
  description = null,
  tags = [],
  archived_docs_url = null,
  rip_message = null
}) {
  return {
    id,
    name,
    category,
    cause_of_death,
    date_died,
    eulogy: makeEulogy(id),
    source_url,
    alternatives: alternatives.map((alternative) => ({ ...alternative })),
    date_born,
    company,
    description: description || makeDescription(name, company),
    tags,
    archived_docs_url,
    rip_message,
    added_by: ADDED_BY,
    added_date: TODAY
  };
}

function buildShopifyFamily(label, idPrefix) {
  const versions = quarterVersions(2019, 4, 2025, 4);
  const sourceUrl = "https://shopify.dev/docs/api/usage/versioning/index";

  return versions.map((version) =>
    buildEntry({
      id: `${idPrefix}-${version}`,
      name: `Shopify ${label} ${version}`,
      category: "other",
      cause_of_death: "deprecated",
      date_died: addOneYear(version),
      source_url: sourceUrl,
      alternatives: SHOPIFY_ALTERNATIVES,
      date_born: `${version}-01`,
      company: "Shopify",
      description: trimToLimit(
        `This Shopify ${label} version had aged out of support under Shopify's quarterly API versioning schedule.`,
        160
      ),
      tags: ["shopify", slugify(label), version, "versioning", "deprecated"]
    })
  );
}

function buildSalesforceVersions() {
  const entries = [];

  for (let version = 7; version <= 20; version += 1) {
    entries.push(
      buildEntry({
        id: `salesforce-api-v${version}-0`,
        name: `Salesforce API v${version}.0`,
        category: "other",
        cause_of_death: "deprecated",
        date_died: "2022-06-01",
        source_url: "https://deprecated-api.io/en/apis/2022-06-01-salesforce-api-versions-7-0-20-0/",
        alternatives: SALESFORCE_ALTERNATIVES,
        date_born: String(2005 + version),
        company: "Salesforce",
        description: "This Salesforce Platform API version had aged out of Salesforce's supported version window.",
        tags: ["salesforce", "api-version", `v${version}`, "crm", "deprecated"]
      })
    );
  }

  for (let version = 21; version <= 30; version += 1) {
    entries.push(
      buildEntry({
        id: `salesforce-api-v${version}-0`,
        name: `Salesforce API v${version}.0`,
        category: "other",
        cause_of_death: "deprecated",
        date_died: "2025-06-01",
        source_url: "https://deprecated-api.io/en/apis/2025-06-01-salesforce-api-versions-21-0-30-0/",
        alternatives: SALESFORCE_ALTERNATIVES,
        date_born: String(2005 + version),
        company: "Salesforce",
        description: "This Salesforce Platform API version had aged out of Salesforce's supported version window.",
        tags: ["salesforce", "api-version", `v${version}`, "crm", "deprecated"]
      })
    );
  }

  return entries;
}

function buildGoogleEntries() {
  return GOOGLE_ENTRIES.map((entry) =>
    buildEntry({
      ...entry,
      company: "Google",
      cause_of_death: /2011$|2012$|2013$/.test(entry.date_died) ? "deprecated" : "shutdown",
      alternatives: cloneAlternatives(entry.category),
      description: trimToLimit(`It had exposed ${entry.name} before Google retired it in favor of newer interfaces or no interface at all.`, 160)
    })
  );
}

function extractPageItems(html) {
  const matches = [
    ...html.matchAll(/<a href="\/en\/apis\/([^"]+)\/" class="">\s*([^<]+?)<\/a>/g)
  ];
  const items = matches.map((match) => ({ slug: match[1], title: match[2].trim() }));
  return [...new Map(items.map((item) => [item.slug, item])).values()];
}

function htmlField(page, field) {
  const regex = new RegExp(`<th>${field}<\\/th>\\s*<td>([\\s\\S]*?)<\\/td>`, "i");
  const raw = page.match(regex)?.[1];
  if (!raw) {
    return null;
  }

  return raw.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeScrapedDate(value) {
  const match = String(value || "").match(/\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : null;
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "api-graveyard-bulk-curator/1.0"
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.text();
}

async function fetchDeprecatedApiEntries() {
  const indexHtml = await fetchText("https://deprecated-api.io/en/apis/");
  const items = extractPageItems(indexHtml);
  const results = [];
  const concurrency = 6;

  for (let index = 0; index < items.length; index += concurrency) {
    const batch = items.slice(index, index + concurrency);
    const pages = await Promise.all(
      batch.map(async (item) => {
        const url = `https://deprecated-api.io/en/apis/${item.slug}/`;
        const page = await fetchText(url);
        return {
          ...item,
          url,
          provider: htmlField(page, "Provider"),
          status: htmlField(page, "Status"),
          eol: normalizeScrapedDate(htmlField(page, "End-of-life date"))
        };
      })
    );
    results.push(...pages);
  }

  return results
    .filter((item) => item.eol && item.eol <= TODAY)
    .map((item) => {
      const company = item.provider || item.title.split(" ")[0];
      const category = inferCategory(item.title, company);
      const cause = String(item.status || "").toLowerCase() === "sunset" ? "shutdown" : "deprecated";

      return buildEntry({
        id: slugify(item.title),
        name: item.title,
        category,
        cause_of_death: cause,
        date_died: item.eol,
        source_url: item.url,
        alternatives: cloneAlternatives(category),
        company,
        description: makeDescription(item.title, company),
        tags: [...new Set([slugify(company), ...item.slug.split("-").slice(3, 8)])].slice(0, 6)
      });
    });
}

async function main() {
  const existingEntries = JSON.parse(fs.readFileSync(ENTRIES_PATH, "utf8"));
  const generated = [
    ...buildShopifyFamily("Admin REST API", "shopify-admin-rest-api"),
    ...buildShopifyFamily("Admin GraphQL API", "shopify-admin-graphql-api"),
    ...buildShopifyFamily("Storefront API", "shopify-storefront-api"),
    ...buildSalesforceVersions(),
    ...buildGoogleEntries(),
    ...(await fetchDeprecatedApiEntries())
  ];

  const merged = [...existingEntries, ...generated];
  const deduped = [...new Map(merged.map((entry) => [entry.id, entry])).values()].sort(compareByDateDesc);

  fs.writeFileSync(ENTRIES_PATH, `${JSON.stringify(deduped, null, 2)}\n`);

  console.log(`Existing entries: ${existingEntries.length}`);
  console.log(`Generated entries: ${generated.length}`);
  console.log(`Total entries after merge: ${deduped.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
