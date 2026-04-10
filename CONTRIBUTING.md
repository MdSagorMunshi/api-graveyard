# Contributing

Every contribution matters because every dead API deserves a clean record. Developers arrive here looking for dates, causes, and alternatives; if we do the work carefully, they leave with answers instead of folklore.

## Two contribution paths

If you do not want to write JSON by hand, use the [issue submission form](https://github.com/MdSagorMunshi/api-graveyard/issues/new?template=new-death.yml). That path is slower, but it is friendlier to people who only need to report the facts.

If you are comfortable editing structured data, open a direct pull request against [`data/entries.json`](data/entries.json). Maintainers can usually merge those faster because the proposed shape is already visible and testable.

## Writing a good eulogy

This is the soul of the project.

Rules:

- Write in second person: use `you` or `your`.
- Write in past tense.
- Keep it honest. Do not lapse into marketing copy.
- Keep it to one to three sentences.
- Stay under 280 characters.
- Write it yourself. Do not use AI to generate eulogies.

Good examples:

- `You had handled our password resets with no drama and very little ceremony. When the free tier vanished, every side project suddenly needed a finance department.`
- `You had made launch day feel larger than the codebase deserved. After the acquisition, your old personality survived only in screenshots and migration guides.`
- `You had translated our shortcuts, half-finished UIs, and questionable product names for free. Billing arrived, and innocence left with it.`

Bad examples:

- `This API was very useful for developers and offered many features before it was discontinued.`  
  Too generic. It could describe anything.
- `An industry-leading platform that empowered teams with robust, scalable tooling until changes in strategy were announced.`  
  Corporate throat-clearing is not a eulogy.

## Finding and verifying source URLs

Use primary evidence first. Official company blog posts, pricing pages, product announcements, migration notices, changelogs, and archived documentation all outrank commentary.

If the original page disappeared, use Archive.org. Start with the missing URL in the Wayback Machine, choose a capture close to the announcement date, and link directly to that capture rather than the generic calendar page when possible.

Each entry now carries an `evidence` object. In practice that means you should be ready to supply:

- A source URL that directly proves the death, pricing change, deprecation, or acquisition.
- A short evidence summary in plain language explaining what the source proves.
- An announcement date if the source makes it clear.
- An archive URL when the source has already gone missing or looks unstable.

## Researching alternatives

Alternatives should be genuinely useful substitutes, not random products in the same broad industry. Prefer tools with clear documentation and current public pricing.

Only mark `free: true` if a free tier exists at the time you submit the PR. Trials, sales demos, and “contact us” plans are not free tiers.

Every alternative now carries a `verified_free_date`. That date should reflect when you personally checked the provider's pricing page or product docs. If you did not verify it, do not mark it as free.

If there is an obvious replacement or migration target, add a `successor` object as well. This is not required, but it makes entry pages much more useful than a bare list of competitors.

## Data validation rules

The validator checks all of the following before a PR can pass:

- Every required field exists and is not `null` or an empty string.
- `id` is unique and matches `^[a-z0-9-]+$`.
- `category` is one of the allowed schema values.
- `cause_of_death` is one of the allowed schema values.
- `date_died` matches `YYYY` or `YYYY-MM-DD`.
- `date_born`, if present, matches `YYYY` or `YYYY-MM-DD`.
- `eulogy` is 280 characters or fewer.
- `description`, if present, is 160 characters or fewer.
- `rip_message`, if present, is 140 characters or fewer.
- `source_url` is a valid `http` or `https` URL.
- `archived_docs_url`, if present, is a valid `http` or `https` URL.
- `last_verified_date` is required and matches `YYYY` or `YYYY-MM-DD`.
- `record_status` is required and must be `verified`, `needs_review`, or `disputed`.
- `status_note`, if present, is 200 characters or fewer.
- `evidence` is required and includes `source_type`, `summary`, and optional `announcement_date` / `archive_url`.
- `evidence.source_type` must be `official`, `official_archive`, `news`, or `community`.
- `evidence.summary` is required and 220 characters or fewer.
- `successor`, if present, must include `name` and a valid `url`; `notes` are optional and capped at 160 characters.
- `alternatives` is an array, even when empty.
- Every alternative has `name`, `url`, `free`, and `verified_free_date` with the correct types.
- `tags`, if present, are lowercase strings.
- `added_date`, if present, matches `YYYY` or `YYYY-MM-DD`.
- Duplicate entries are rejected when `company` and `name` normalize to the same record.

## Review process

Maintainers aim to review pull requests within 7 days.

Reviews check:

- Accuracy of the date and cause of death, with a real source.
- Quality of the eulogy: original, human, and in the right voice.
- Accuracy of the alternatives and whether any claimed free tier is actually free.
- Whether the evidence summary, successor, and record status are justified by the source.
- Correctness of the JSON and whether the validator passes.

## Code of conduct

Read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Accuracy comes first, but respect is not optional.

## In memoriam

Current largest contributors by accepted entries:

1. `MdSagorMunshi` — 219 entries
2. No recorded burials yet
3. No recorded burials yet
4. No recorded burials yet
5. No recorded burials yet
6. No recorded burials yet
7. No recorded burials yet
8. No recorded burials yet
9. No recorded burials yet
10. No recorded burials yet
