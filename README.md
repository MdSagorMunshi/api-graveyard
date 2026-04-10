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

⬛ 219 APIs buried and counting.

api-graveyard exists because broken bookmarks and vague pricing pages are not a historical record. This repository keeps a static, source-backed obituary desk for services developers actually used. It is intentionally low-cost, static, and difficult to rug-pull. The tone is mournful because the work is practical.

## What counts as dead?

- `shutdown` means the service, API, or free plan was switched off outright.
- `acquired` means the useful independent thing was absorbed and effectively ceased to exist as itself.
- `paywalled` means the free path developers relied on was moved behind pricing.
- `deprecated` means the old version or offer was intentionally retired, hollowed out, or replaced.
- `rate_limited` means the quotas survived on paper but got tight enough to stop being useful in practice.

## How to submit a death

1. Path 1: open a [GitHub Issue submission form](https://github.com/MdSagorMunshi/api-graveyard/issues/new?template=new-death.yml) if you want the easiest route and do not want to touch JSON directly.
2. Path 2: open a pull request after editing [`data/entries.json`](data/entries.json) if you are comfortable with the schema and want the fastest maintainer path.

## Running locally

```bash
git clone https://github.com/MdSagorMunshi/api-graveyard.git
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
| 1 | Shopify | 76 | Shopify Admin GraphQL API 2019-04, Shopify Admin GraphQL API 2019-07, Shopify Admin GraphQL API 2019-10, Shopify Admin GraphQL API 2020-01, Shopify Admin GraphQL API 2020-04, Shopify Admin GraphQL API 2020-07, Shopify Admin GraphQL API 2020-10, Shopify Admin GraphQL API 2021-01, Shopify Admin GraphQL API 2021-04, Shopify Admin GraphQL API 2021-07, Shopify Admin GraphQL API 2021-10, Shopify Admin GraphQL API 2022-01, Shopify Admin GraphQL API 2022-04, Shopify Admin GraphQL API 2022-07, Shopify Admin GraphQL API 2022-10, Shopify Admin GraphQL API 2023-01, Shopify Admin GraphQL API 2023-04, Shopify Admin GraphQL API 2023-07, Shopify Admin GraphQL API 2023-10, Shopify Admin GraphQL API 2024-01, Shopify Admin GraphQL API 2024-04, Shopify Admin GraphQL API 2024-07, Shopify Admin GraphQL API 2024-10, Shopify Admin GraphQL API 2025-01, Shopify Admin GraphQL API 2025-04, Shopify Admin REST API 2019-04, Shopify Admin REST API 2019-07, Shopify Admin REST API 2019-10, Shopify Admin REST API 2020-01, Shopify Admin REST API 2020-04, Shopify Admin REST API 2020-07, Shopify Admin REST API 2020-10, Shopify Admin REST API 2021-01, Shopify Admin REST API 2021-04, Shopify Admin REST API 2021-07, Shopify Admin REST API 2021-10, Shopify Admin REST API 2022-01, Shopify Admin REST API 2022-04, Shopify Admin REST API 2022-07, Shopify Admin REST API 2022-10, Shopify Admin REST API 2023-01, Shopify Admin REST API 2023-04, Shopify Admin REST API 2023-07, Shopify Admin REST API 2023-10, Shopify Admin REST API 2024-01, Shopify Admin REST API 2024-04, Shopify Admin REST API 2024-07, Shopify Admin REST API 2024-10, Shopify Admin REST API 2025-01, Shopify Admin REST API 2025-04, Shopify REST Admin API, Shopify Storefront API 2019-04, Shopify Storefront API 2019-07, Shopify Storefront API 2019-10, Shopify Storefront API 2020-01, Shopify Storefront API 2020-04, Shopify Storefront API 2020-07, Shopify Storefront API 2020-10, Shopify Storefront API 2021-01, Shopify Storefront API 2021-04, Shopify Storefront API 2021-07, Shopify Storefront API 2021-10, Shopify Storefront API 2022-01, Shopify Storefront API 2022-04, Shopify Storefront API 2022-07, Shopify Storefront API 2022-10, Shopify Storefront API 2023-01, Shopify Storefront API 2023-04, Shopify Storefront API 2023-07, Shopify Storefront API 2023-10, Shopify Storefront API 2024-01, Shopify Storefront API 2024-04, Shopify Storefront API 2024-07, Shopify Storefront API 2024-10, Shopify Storefront API 2025-01, Shopify Storefront API 2025-04 |
| 2 | Google | 47 | Admin Audit API, Documents List API, FeedBurner APIs, Firebase Spark Plan Headroom, Google Ads API v19, Google Apps Profiles API, Google Blog Search API, Google Books Data API, Google Books JavaScript API, Google Code Search API, Google Contacts API, Google Diacritize API, Google Display &amp; Video 360 API v2, Google Display &amp; Video 360 API v3, Google Email Migration API v1, Google Feed API, Google Finance API, Google Image Charts, Google Image Search API, Google Infographics API, Google Moderator API, Google My Business Business Calls API, Google My Business InsuranceNetworks and HealthProviderAttributes, Google News Search API, Google Over-the-Air Installs, Google Patent Search API, Google PowerMeter API, Google Provisioning API, Google Reporting API, Google Safe Browsing API v1, Google Sidewiki API, Google Translate API (Free), Google Transliterate API, Google URL Shortener API, Google Video Search API, Google Virtual Keyboard API, Google Wave API, Google+ Android SDK, Google+ API, Google+ Domains API, Google+ Pages API, Google+ Sign-In feature, Google+ Web API, Legacy Portable Contacts API, OpenID 2.0 for Google APIs, Reporting Visualization API, Stadia |
| 3 | Salesforce | 25 | Salesforce API v10.0, Salesforce API v11.0, Salesforce API v12.0, Salesforce API v13.0, Salesforce API v14.0, Salesforce API v15.0, Salesforce API v16.0, Salesforce API v17.0, Salesforce API v18.0, Salesforce API v19.0, Salesforce API v20.0, Salesforce API v21.0, Salesforce API v22.0, Salesforce API v23.0, Salesforce API v24.0, Salesforce API v25.0, Salesforce API v26.0, Salesforce API v27.0, Salesforce API v28.0, Salesforce API v29.0, Salesforce API v30.0, Salesforce API v7.0, Salesforce API v8.0, Salesforce API v9.0, Salesforce API Versions 21.0-30.0 |
| 4 | Meta | 7 | Meta Graph API Server-Sent Events, Meta Instagram API Legacy Scope Values, Meta Instagram Basic Display API, Meta Instagram Insights Metrics (clips_replays_count, impressions, plays), Meta Instagram v1.0 API Endpoints, Meta Messaging Events API, WhatsApp Business API On-Behalf-Of (OBO) Model |
| 5 | GitHub | 5 | GitHub Actions Cache v1-v2, GitHub Copilot Usage API (Beta), GitHub Projects (Classic), GitHub Security Manager REST API, GitHub Student Pack Offer Culls |
<!-- HALL_OF_SHAME_END -->

Built with grief by the open-source community. Hosted free, forever, on GitHub Pages.
