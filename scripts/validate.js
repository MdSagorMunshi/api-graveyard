const fs = require("node:fs");
const path = require("node:path");

const ALLOWED_CATEGORIES = [
  "hosting",
  "database",
  "auth",
  "email",
  "storage",
  "social",
  "maps",
  "payment",
  "messaging",
  "analytics",
  "translation",
  "search",
  "media",
  "monitoring",
  "other"
];

const ALLOWED_CAUSES = ["shutdown", "acquired", "paywalled", "deprecated", "rate_limited"];
const ID_PATTERN = /^[a-z0-9-]+$/;
const DATE_PATTERN = /^\d{4}(-\d{2}-\d{2})?$/;
const URL_PROTOCOLS = new Set(["http:", "https:"]);

function readEntries(filePath = path.join(__dirname, "..", "data", "entries.json")) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidUrl(value) {
  try {
    const parsed = new URL(value);
    return URL_PROTOCOLS.has(parsed.protocol);
  } catch {
    return false;
  }
}

function isValidDate(value) {
  if (!isNonEmptyString(value) || !DATE_PATTERN.test(value)) {
    return false;
  }

  if (/^\d{4}$/.test(value)) {
    return true;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function toEntryLabel(entry, index) {
  return entry && isNonEmptyString(entry.id) ? entry.id : `index:${index}`;
}

function pushError(errors, entryLabel, field, message) {
  errors.push({ entryId: entryLabel, field, message });
}

function validateEntries(entries) {
  const errors = [];

  if (!Array.isArray(entries)) {
    return [{ entryId: "entries.json", field: "root", message: "must be an array of entry objects" }];
  }

  const idCounts = new Map();

  for (const entry of entries) {
    if (entry && typeof entry === "object" && isNonEmptyString(entry.id)) {
      idCounts.set(entry.id, (idCounts.get(entry.id) || 0) + 1);
    }
  }

  entries.forEach((entry, index) => {
    const label = toEntryLabel(entry, index);

    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      pushError(errors, label, "entry", "must be an object");
      return;
    }

    const requiredStringFields = ["id", "name", "category", "cause_of_death", "date_died", "eulogy", "source_url"];
    requiredStringFields.forEach((field) => {
      if (!isNonEmptyString(entry[field])) {
        pushError(errors, label, field, "is required and must be a non-empty string");
      }
    });

    if (!Array.isArray(entry.alternatives)) {
      pushError(errors, label, "alternatives", "is required and must be an array");
    }

    if (isNonEmptyString(entry.id)) {
      if (!ID_PATTERN.test(entry.id)) {
        pushError(errors, label, "id", "must match ^[a-z0-9-]+$");
      }

      if (idCounts.get(entry.id) > 1) {
        pushError(errors, label, "id", "must be unique");
      }
    }

    if (entry.category && !ALLOWED_CATEGORIES.includes(entry.category)) {
      pushError(errors, label, "category", `must be one of: ${ALLOWED_CATEGORIES.join(", ")}`);
    }

    if (entry.cause_of_death && !ALLOWED_CAUSES.includes(entry.cause_of_death)) {
      pushError(errors, label, "cause_of_death", `must be one of: ${ALLOWED_CAUSES.join(", ")}`);
    }

    if (entry.date_died && !isValidDate(entry.date_died)) {
      pushError(errors, label, "date_died", "must match YYYY or YYYY-MM-DD");
    }

    if (entry.date_born !== null && entry.date_born !== undefined && !isValidDate(entry.date_born)) {
      pushError(errors, label, "date_born", "must be null or match YYYY or YYYY-MM-DD");
    }

    if (entry.eulogy && entry.eulogy.length > 280) {
      pushError(errors, label, "eulogy", "must be 280 characters or fewer");
    }

    if (entry.description !== null && entry.description !== undefined) {
      if (!isNonEmptyString(entry.description)) {
        pushError(errors, label, "description", "must be null or a non-empty string");
      } else if (entry.description.length > 160) {
        pushError(errors, label, "description", "must be 160 characters or fewer");
      }
    }

    if (entry.rip_message !== null && entry.rip_message !== undefined) {
      if (!isNonEmptyString(entry.rip_message)) {
        pushError(errors, label, "rip_message", "must be null or a non-empty string");
      } else if (entry.rip_message.length > 140) {
        pushError(errors, label, "rip_message", "must be 140 characters or fewer");
      }
    }

    if (entry.source_url && !isValidUrl(entry.source_url)) {
      pushError(errors, label, "source_url", "must be a valid http or https URL");
    }

    if (
      entry.archived_docs_url !== null &&
      entry.archived_docs_url !== undefined &&
      !isValidUrl(entry.archived_docs_url)
    ) {
      pushError(errors, label, "archived_docs_url", "must be null or a valid http or https URL");
    }

    if (entry.company !== null && entry.company !== undefined && !isNonEmptyString(entry.company)) {
      pushError(errors, label, "company", "must be null or a non-empty string");
    }

    if (entry.added_by !== null && entry.added_by !== undefined && !isNonEmptyString(entry.added_by)) {
      pushError(errors, label, "added_by", "must be null or a non-empty string");
    }

    if (entry.added_date !== null && entry.added_date !== undefined && !isValidDate(entry.added_date)) {
      pushError(errors, label, "added_date", "must be null or match YYYY or YYYY-MM-DD");
    }

    if (entry.tags !== null && entry.tags !== undefined) {
      if (!Array.isArray(entry.tags)) {
        pushError(errors, label, "tags", "must be null or an array of lowercase strings");
      } else {
        entry.tags.forEach((tag, tagIndex) => {
          if (!isNonEmptyString(tag)) {
            pushError(errors, label, `tags[${tagIndex}]`, "must be a non-empty string");
          } else if (tag !== tag.toLowerCase()) {
            pushError(errors, label, `tags[${tagIndex}]`, "must be lowercase");
          }
        });
      }
    }

    if (Array.isArray(entry.alternatives)) {
      entry.alternatives.forEach((alternative, altIndex) => {
        if (!alternative || typeof alternative !== "object" || Array.isArray(alternative)) {
          pushError(errors, label, `alternatives[${altIndex}]`, "must be an object");
          return;
        }

        if (!isNonEmptyString(alternative.name)) {
          pushError(errors, label, `alternatives[${altIndex}].name`, "is required and must be a non-empty string");
        }

        if (!isNonEmptyString(alternative.url) || !isValidUrl(alternative.url)) {
          pushError(errors, label, `alternatives[${altIndex}].url`, "is required and must be a valid http or https URL");
        }

        if (typeof alternative.free !== "boolean") {
          pushError(errors, label, `alternatives[${altIndex}].free`, "is required and must be a boolean");
        }
      });
    }
  });

  return errors;
}

function reportValidation(errors, entries) {
  if (errors.length === 0) {
    console.log(`entries.json is valid. Checked ${entries.length} entries.`);
    return;
  }

  console.error(`Validation failed with ${errors.length} error(s):`);
  console.error("");

  errors.forEach((error) => {
    console.error(`- [${error.entryId}] ${error.field}: ${error.message}`);
  });
}

function main() {
  const filePath = path.join(__dirname, "..", "data", "entries.json");
  const entries = readEntries(filePath);
  const errors = validateEntries(entries);
  reportValidation(errors, entries);
  process.exit(errors.length === 0 ? 0 : 1);
}

if (require.main === module) {
  main();
}

module.exports = {
  ALLOWED_CATEGORIES,
  ALLOWED_CAUSES,
  ID_PATTERN,
  DATE_PATTERN,
  isValidDate,
  isValidUrl,
  readEntries,
  validateEntries
};
