# Playwright TypeScript Framework

This project contains a Playwright test framework for UI and API tests.

It uses [SauceDemo](https://www.saucedemo.com) for browser tests and [Restful Booker](https://restful-booker.herokuapp.com/apidoc/index.html) for API checks. The setup is simple and made to be easy to run locally.

## Project structure

- `api/` – booking API client
- `config/` – environment config
- `fixtures/` – shared test fixtures
- `pages/` – page object models
- `tests/ui/` – login and cart UI tests
- `tests/api/` – booking API tests

## Setup

Make sure you have Node 20 or newer.

```bash
npm ci
npx playwright install --with-deps
cp .env.example .env
```

## Run tests

```bash
npm test
npm run test:smoke
npm run test:api
npm run test:ui
npx playwright test --project=chromium
npx playwright test --ui
npm run typecheck
```

To view the HTML report:

```bash
npx playwright show-report
```

## Notes

- Page objects are passed through fixtures rather than created inside each test.
- Login is handled once in `auth.setup.ts` and reused across browser tests.
- Tests use `getByTestId` locators and avoid unnecessary waits.
- API tests validate response objects instead of checking for plain text strings.
- The project expects credentials from `.env` locally and GitHub secrets in CI.

## CI

The workflow runs type checks and Playwright tests on Chromium, Firefox, and WebKit. It also uploads the HTML report as an artifact.

It expects these secrets in GitHub Actions:

- `STANDARD_PASSWORD`
- `LOCKED_OUT_PASSWORD`
- `API_PASSWORD`