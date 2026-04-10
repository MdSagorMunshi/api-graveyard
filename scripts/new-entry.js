const fs = require("node:fs");
const path = require("node:path");

const {
  ALLOWED_CATEGORIES,
  ALLOWED_CAUSES,
  ALLOWED_SOURCE_TYPES,
  isValidDate,
  isValidUrl,
  readEntries,
  validateEntries
} = require("./validate");

const ENTRIES_PATH = path.join(__dirname, "..", "data", "entries.json");

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function compareDeathsDesc(left, right) {
  const normalize = (value) => (/^\d{4}$/.test(value) ? `${value}-12-31` : value);
  return normalize(right.date_died).localeCompare(normalize(left.date_died));
}

function ensureUniqueId(baseId, entries) {
  const ids = new Set(entries.map((entry) => entry.id));
  if (!ids.has(baseId)) {
    return baseId;
  }

  let suffix = 2;
  while (ids.has(`${baseId}-${suffix}`)) {
    suffix += 1;
  }

  return `${baseId}-${suffix}`;
}

function parseAlternatives(input) {
  if (!input.trim()) {
    return [];
  }

  return input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, url, freeFlag] = line.split("|").map((part) => part.trim());
      return {
        name,
        url,
        free: /^free$/i.test(freeFlag),
        verified_free_date: new Date().toISOString().slice(0, 10)
      };
    });
}

async function main() {
  const prompts = await import("@inquirer/prompts");
  const { input, select, confirm } = prompts;
  const entries = readEntries(ENTRIES_PATH);

  console.log("api-graveyard new entry wizard");
  console.log("Write something true, brief, and worth remembering.");
  console.log("");

  const name = await input({
    message: "API or service name",
    validate(value) {
      return value.trim() ? true : "Name is required.";
    }
  });

  const suggestedId = ensureUniqueId(slugify(name), entries);
  const category = await select({
    message: "Category",
    choices: ALLOWED_CATEGORIES.map((value) => ({ value, name: value }))
  });

  const causeOfDeath = await select({
    message: "Cause of death",
    choices: ALLOWED_CAUSES.map((value) => ({ value, name: value }))
  });

  const company = await input({
    message: "Company name (optional)",
    default: "",
    validate() {
      return true;
    }
  });

  const dateDied = await input({
    message: "Date it died (YYYY or YYYY-MM-DD)",
    validate(value) {
      return isValidDate(value) ? true : "Use YYYY or YYYY-MM-DD.";
    }
  });

  const dateBorn = await input({
    message: "Date it was born (optional, YYYY or YYYY-MM-DD)",
    default: "",
    validate(value) {
      return !value.trim() || isValidDate(value) ? true : "Use YYYY or YYYY-MM-DD, or leave blank.";
    }
  });

  const description = await input({
    message: "One-sentence factual description in past tense (optional, max 160 chars)",
    default: "",
    validate(value) {
      return value.length <= 160 ? true : "Keep the description at 160 characters or fewer.";
    }
  });

  const eulogy = await input({
    message: "Eulogy (1-3 sentences, second person, past tense, max 280 chars)",
    validate(value) {
      if (!value.trim()) {
        return "A eulogy is required.";
      }
      if (value.length > 280) {
        return "Keep the eulogy at 280 characters or fewer.";
      }
      if (!/\b(you|your)\b/i.test(value)) {
        return "Use second person. Start with you or your.";
      }
      return true;
    }
  });

  const sourceUrl = await input({
    message: "Source URL",
    validate(value) {
      return isValidUrl(value) ? true : "Enter a valid http or https URL.";
    }
  });

  const sourceType = await select({
    message: "Evidence source type",
    choices: ALLOWED_SOURCE_TYPES.map((value) => ({ value, name: value }))
  });

  const evidenceSummary = await input({
    message: "Evidence summary (what exactly does the source prove?)",
    validate(value) {
      if (!value.trim()) {
        return "Evidence summary is required.";
      }
      return value.length <= 220 ? true : "Keep the evidence summary at 220 characters or fewer.";
    }
  });

  const announcementDate = await input({
    message: "Announcement date (optional, YYYY or YYYY-MM-DD)",
    default: "",
    validate(value) {
      return !value.trim() || isValidDate(value) ? true : "Use YYYY or YYYY-MM-DD, or leave blank.";
    }
  });

  const archivedDocsUrl = await input({
    message: "Archived docs URL (optional)",
    default: "",
    validate(value) {
      return !value.trim() || isValidUrl(value) ? true : "Enter a valid URL, or leave blank.";
    }
  });

  const successorName = await input({
    message: "Recommended successor name (optional)",
    default: "",
    validate() {
      return true;
    }
  });

  const successorUrl = await input({
    message: "Recommended successor URL (optional)",
    default: "",
    validate(value) {
      return !value.trim() || isValidUrl(value) ? true : "Enter a valid URL, or leave blank.";
    }
  });

  const successorNotes = await input({
    message: "Successor notes (optional, max 160 chars)",
    default: "",
    validate(value) {
      return value.length <= 160 ? true : "Keep successor notes at 160 characters or fewer.";
    }
  });

  const alternativesRaw = await input({
    message: "Alternatives, one per line: Name | URL | free|paid",
    default: "",
    validate(value) {
      if (!value.trim()) {
        return true;
      }

      try {
        const parsed = parseAlternatives(value);
        const invalid = parsed.find(
          (alternative) =>
            !alternative.name ||
            !alternative.url ||
            !/^(true|false)$/.test(String(alternative.free)) ||
            !isValidUrl(alternative.url)
        );
        return invalid ? "Each line must look like Name | https://example.com | free" : true;
      } catch {
        return "Could not parse alternatives. Use Name | URL | free|paid.";
      }
    }
  });

  const tagsRaw = await input({
    message: "Tags, comma-separated (optional)",
    default: "",
    validate() {
      return true;
    }
  });

  const ripMessage = await input({
    message: "Personal memory (optional, max 140 chars)",
    default: "",
    validate(value) {
      return value.length <= 140 ? true : "Keep the personal memory at 140 characters or fewer.";
    }
  });

  const addedBy = await input({
    message: "GitHub username",
    default: process.env.GITHUB_USER || process.env.USER || "",
    validate(value) {
      return value.trim() ? true : "added_by is required for the new entry workflow.";
    }
  });

  const entry = {
    id: suggestedId,
    name: name.trim(),
    category,
    cause_of_death: causeOfDeath,
    date_died: dateDied.trim(),
    eulogy: eulogy.trim(),
    source_url: sourceUrl.trim(),
    alternatives: parseAlternatives(alternativesRaw),
    date_born: dateBorn.trim() || null,
    company: company.trim() || null,
    description: description.trim() || null,
    evidence: {
      source_type: sourceType,
      summary: evidenceSummary.trim(),
      announcement_date: announcementDate.trim() || null,
      archive_url: archivedDocsUrl.trim() || null
    },
    successor:
      successorName.trim() && successorUrl.trim()
        ? {
            name: successorName.trim(),
            url: successorUrl.trim(),
            notes: successorNotes.trim() || null
          }
        : null,
    last_verified_date: new Date().toISOString().slice(0, 10),
    record_status: "verified",
    status_note: null,
    tags: tagsRaw
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean),
    archived_docs_url: archivedDocsUrl.trim() || null,
    rip_message: ripMessage.trim() || null,
    added_by: addedBy.trim(),
    added_date: new Date().toISOString().slice(0, 10)
  };

  console.log("");
  console.log("Preview:");
  console.log(JSON.stringify(entry, null, 2));
  console.log("");

  const shouldWrite = await confirm({
    message: `Write ${entry.id} to data/entries.json?`,
    default: true
  });

  if (!shouldWrite) {
    console.log("Aborted. Nothing was written.");
    process.exit(0);
  }

  const updatedEntries = [...entries, entry].sort(compareDeathsDesc);
  fs.writeFileSync(ENTRIES_PATH, `${JSON.stringify(updatedEntries, null, 2)}\n`);

  const errors = validateEntries(updatedEntries);
  if (errors.length > 0) {
    console.error("The entry was written, but validation failed:");
    errors.forEach((error) => {
      console.error(`- [${error.entryId}] ${error.field}: ${error.message}`);
    });
    process.exit(1);
  }

  console.log(`Success. ${entry.name} was buried with id: ${entry.id}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
