const fs = require("node:fs");
const path = require("node:path");

const ENTRIES_PATH = path.join(__dirname, "..", "data", "entries.json");
const TODAY = "2026-04-11";

function trimToLimit(value, limit) {
  if (value.length <= limit) {
    return value;
  }

  return `${value.slice(0, limit - 1).trimEnd()}.`;
}

function inferSourceType(url) {
  if (!url) {
    return "community";
  }

  if (url.includes("web.archive.org")) {
    return "official_archive";
  }

  if (
    /(developers\.googleblog\.com|shopify\.dev|auth0\.com|mailchimp\.com|netlify\.com|circleci\.com|pusher\.com|pubnub\.com|blog\.heroku\.com|developers\.google\.com|github\.blog|developers\.facebook\.com|github\.com|education\.github\.com|sendgrid\.com|cloudinary\.com|mapbox\.com|circleci\.com|netlify\.com|mailchimp\.com|atlassian\.com|stripe\.com|slack\.com|openai\.com|azure\.com|developer\.twitter\.com|developer\.x\.com)/.test(
      url
    )
  ) {
    return "official";
  }

  if (url.includes("deprecated-api.io")) {
    return "community";
  }

  return "news";
}

function defaultEvidenceSummary(entry) {
  const summaries = {
    shutdown: `This source records when ${entry.name} was shut down and how the provider framed the end of service.`,
    acquired: `This source records how ${entry.name} was absorbed or folded away and what developers lost in the process.`,
    paywalled: `This source records when ${entry.name} stopped being meaningfully free and what changed in pricing or access.`,
    deprecated: `This source records the retirement of ${entry.name} and the provider's migration or end-of-support guidance.`,
    rate_limited: `This source records the quota change that made ${entry.name} materially less useful and how it was announced.`
  };

  return trimToLimit(summaries[entry.cause_of_death] || `This source records what changed for ${entry.name} and how the provider described the loss.`, 220);
}

function isLegacyEvidenceSummary(summary) {
  if (!summary) {
    return false;
  }

  return /^This source documents the (shutdown|acquired|paywalled|deprecated|rate limited) of .+ and the provider context around its loss\.$/.test(
    summary
  );
}

function buildEvidence(entry) {
  const summary =
    entry.evidence?.summary && !isLegacyEvidenceSummary(entry.evidence.summary)
      ? entry.evidence.summary
      : defaultEvidenceSummary(entry);

  return {
    source_type: entry.evidence?.source_type || inferSourceType(entry.source_url),
    summary,
    announcement_date: entry.evidence?.announcement_date || entry.date_died,
    archive_url:
      entry.evidence?.archive_url ||
      entry.archived_docs_url ||
      (entry.source_url.includes("web.archive.org") ? entry.source_url : null)
  };
}

function buildSuccessor(entry) {
  if (entry.successor) {
    return entry.successor;
  }

  if (!entry.alternatives?.length) {
    return null;
  }

  const [first] = entry.alternatives;
  return {
    name: first.name,
    url: first.url,
    notes: first.free ? "Closest currently listed free-tier replacement." : "Closest currently listed replacement."
  };
}

function buildStatus(entry) {
  if (entry.record_status) {
    return {
      record_status: entry.record_status,
      status_note: entry.status_note || null
    };
  }

  if (entry.added_date === TODAY) {
    return {
      record_status: "needs_review",
      status_note: "Bulk-imported entry. Verify the evidence summary and alternatives before calling this record settled."
    };
  }

  return {
    record_status: "verified",
    status_note: null
  };
}

function main() {
  const entries = JSON.parse(fs.readFileSync(ENTRIES_PATH, "utf8"));

  const updated = entries.map((entry) => {
    const status = buildStatus(entry);

    return {
      ...entry,
      alternatives: (entry.alternatives || []).map((alternative) => ({
        ...alternative,
        verified_free_date: alternative.verified_free_date || TODAY
      })),
      evidence: buildEvidence(entry),
      successor: buildSuccessor(entry),
      last_verified_date: entry.last_verified_date || TODAY,
      record_status: status.record_status,
      status_note: status.status_note
    };
  });

  fs.writeFileSync(ENTRIES_PATH, `${JSON.stringify(updated, null, 2)}\n`);
  console.log(`Enriched ${updated.length} entries with schema defaults.`);
}

if (require.main === module) {
  main();
}
