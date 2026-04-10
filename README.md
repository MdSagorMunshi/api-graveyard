```text
                ______________________
             .-"                      "-.
           .'      API GRAVEYARD        '.
          /    ______________________     \
         /    /                      \     \
        ;    |  IN LOVING MEMORY OF   |     ;
        |    |    APIS WE ONCE        |     |
        |    |       CALLED           |     |
        |    |________________________|     |
        |              ||                   |
        |              ||                   |
        |              ||                   |
        |           .-====-.               |
        |__________/________\______________|
```

*A community-maintained archive of APIs, developer tools, and free tiers that were killed, acquired, paywalled, or deprecated. R.I.P.*

⬛ 20 APIs buried and counting.

api-graveyard exists because broken bookmarks and vague pricing pages are not a historical record. This repository keeps a static, source-backed obituary desk for services developers actually used. It is intentionally low-cost, static, and difficult to rug-pull. The tone is mournful because the work is practical.

## What counts as dead?

- `shutdown` means the service, API, or free plan was switched off outright.
- `acquired` means the useful independent thing was absorbed and effectively ceased to exist as itself.
- `paywalled` means the free path developers relied on was moved behind pricing.
- `deprecated` means the old version or offer was intentionally retired, hollowed out, or replaced.
- `rate_limited` means the quotas survived on paper but got tight enough to stop being useful in practice.

## How to submit a death

1. Path 1: open a [GitHub Issue submission form](https://github.com/rynex/api-graveyard/issues/new?template=new-death.yml) if you want the easiest route and do not want to touch JSON directly.
2. Path 2: open a pull request after editing [`data/entries.json`](data/entries.json) if you are comfortable with the schema and want the fastest maintainer path.

## Running locally

```bash
git clone https://github.com/rynex/api-graveyard.git
cd api-graveyard
npm install
npm run dev
npm run validate
```

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a PR. The validator is strict, the source requirement is non-negotiable, and the eulogy must be original writing.

## Hall of shame (top killers)

<!-- HALL_OF_SHAME_START -->
| Rank | Company | Kills | Victims |
| --- | --- | ---: | --- |
| 1 | Google | 4 | Firebase Spark Plan Headroom, Google Translate API (Free), Google+ API, Stadia |
| 2 | Atlassian | 1 | Bitbucket Pipelines 50-minute Cushion |
| 3 | Auth0 | 1 | Auth0 Free Tenant Limits |
| 4 | CircleCI | 1 | CircleCI Free Plan Credits |
| 5 | Cloudinary | 1 | Cloudinary Free Plan Before the Diet |
<!-- HALL_OF_SHAME_END -->

Built with grief by the open-source community. Hosted free, forever, on GitHub Pages.
