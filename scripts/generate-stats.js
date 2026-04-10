const fs = require("node:fs");
const path = require("node:path");

const ENTRIES_PATH = path.join(__dirname, "..", "data", "entries.json");
const STATS_PATH = path.join(__dirname, "..", "data", "stats.json");
const README_PATH = path.join(__dirname, "..", "README.md");

function yearFromDate(value) {
  return String(value || "").slice(0, 4);
}

function countBy(items, keyFn) {
  return items.reduce((accumulator, item) => {
    const key = keyFn(item);
    if (!key) {
      return accumulator;
    }

    accumulator[key] = (accumulator[key] || 0) + 1;
    return accumulator;
  }, {});
}

function sortObjectByKey(object) {
  return Object.fromEntries(
    Object.entries(object).sort(([left], [right]) => left.localeCompare(right, undefined, { numeric: true }))
  );
}

function topEntriesFromObject(object, limit) {
  return Object.entries(object)
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, limit)
    .map(([company, count]) => ({ company, count }));
}

function patchReadme(stats, entries) {
  let readme = fs.readFileSync(README_PATH, "utf8");

  readme = readme.replace(/⬛ \d+ APIs buried and counting\./, `⬛ ${stats.total} APIs buried and counting.`);

  const topFiveRows = stats.top_killers
    .slice(0, 5)
    .map(({ company, count }, index) => {
      const names = entries
        .filter((entry) => entry.company === company)
        .map((entry) => entry.name)
        .sort((left, right) => left.localeCompare(right))
        .join(", ");
      return `| ${index + 1} | ${company} | ${count} | ${names} |`;
    })
    .join("\n");

  const replacement = [
    "<!-- HALL_OF_SHAME_START -->",
    "| Rank | Company | Kills | Victims |",
    "| --- | --- | ---: | --- |",
    topFiveRows,
    "<!-- HALL_OF_SHAME_END -->"
  ].join("\n");

  readme = readme.replace(
    /<!-- HALL_OF_SHAME_START -->[\s\S]*<!-- HALL_OF_SHAME_END -->/,
    replacement
  );

  fs.writeFileSync(README_PATH, readme);
}

function main() {
  const entries = JSON.parse(fs.readFileSync(ENTRIES_PATH, "utf8"));
  const currentYear = new Date().getUTCFullYear();
  const byCause = countBy(entries, (entry) => entry.cause_of_death);
  const byCategory = countBy(entries, (entry) => entry.category);
  const byCompany = sortObjectByKey(countBy(entries.filter((entry) => entry.company), (entry) => entry.company));
  const byYear = {};

  for (let year = 2008; year <= currentYear; year += 1) {
    byYear[String(year)] = 0;
  }

  entries.forEach((entry) => {
    const year = yearFromDate(entry.date_died);
    if (!(year in byYear)) {
      byYear[year] = 0;
    }
    byYear[year] += 1;
  });

  const topKillers = topEntriesFromObject(byCompany, 10);
  const mostDeadlyYear = Object.entries(byYear).sort(
    (left, right) => right[1] - left[1] || right[0].localeCompare(left[0], undefined, { numeric: true })
  )[0][0];

  const mostRecentlyAdded = [...entries].sort((left, right) =>
    String(right.added_date || "").localeCompare(String(left.added_date || ""))
  )[0];

  const stats = {
    total: entries.length,
    by_cause: sortObjectByKey(byCause),
    by_category: sortObjectByKey(byCategory),
    by_year: sortObjectByKey(byYear),
    by_company: byCompany,
    top_killers: topKillers,
    most_recent_death: mostRecentlyAdded ? mostRecentlyAdded.date_died : null,
    most_deadly_year: mostDeadlyYear,
    generated_at: new Date().toISOString()
  };

  fs.writeFileSync(STATS_PATH, `${JSON.stringify(stats, null, 2)}\n`);
  patchReadme(stats, entries);

  console.log(`Generated stats for ${stats.total} entries.`);
}

if (require.main === module) {
  main();
}
