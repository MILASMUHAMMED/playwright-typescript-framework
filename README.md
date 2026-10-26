# playwright-typescript-framework

[![Playwright Tests](https://github.com/MILASMUHAMMED/playwright-typescript-framework/actions/workflows/playwright.yml/badge.svg)](https://github.com/MILASMUHAMMED/playwright-typescript-framework/actions/workflows/playwright.yml)

A test automation framework I built from scratch with Playwright and TypeScript.

It has UI tests against [SauceDemo](https://www.saucedemo.com) and API tests against [Restful Booker](https://restful-booker.herokuapp.com/apidoc/index.html). Both are public demo apps, so anyone can clone this and run it.

## What's in here

```
api/            BookingClient - small wrapper around the Restful Booker endpoints
config/         env.ts - reads environment variables and fails early if one is missing
fixtures/       custom test fixtures (page objects + API client)
pages/          page objects for login, inventory and cart
tests/ui/       login and cart tests, plus auth.setup.ts
tests/api/      booking tests
```

## Running it

You need Node 20 or later.

```bash
npm ci
npx playwright install --with-deps
cp .env.example .env
```

Then:

```bash
npm test                  # everything
npm run test:smoke        # only @smoke tests
npm run test:api          # API tests only
npx playwright test --project=chromium
npx playwright test --ui  # UI mode, handy when writing tests
npm run typecheck
```

The HTML report opens with `npx playwright show-report`.

## How it's put together

Page objects are injected through fixtures (`test.extend`), so a test just asks for what it needs:

```ts
test("valid login lands on the inventory page", async ({ loginPage, inventoryPage }) => {
  ...
});
```

I prefer this to creating page objects in `beforeEach`, because each test only gets the objects it asks for, and TypeScript knows their types.

Login happens once. `auth.setup.ts` runs as its own project, logs in and saves the session to `.auth/user.json`. The browser projects depend on it and start already logged in. The login tests are the exception: they clear the stored state so they actually exercise the login page.

A few other choices:

- Locators use `getByTestId` (SauceDemo has `data-test` attributes), no XPath.
- No hard waits. Assertions like `toHaveText` and `expect.poll` wait on their own.
- `baseURL` is set once in the config and pages navigate with relative paths, so pointing the suite at another environment is a one-line change.
- Credentials come from `.env` locally and GitHub Secrets in CI. `.env` is git-ignored.
- The API tests use `toMatchObject` on the JSON response instead of checking for substrings, and each stage of the booking flow is a `test.step` so it reads clearly in the report.
- Tests are tagged `@smoke`, `@regression`, `@ui` and `@api`.

Note: Playwright runs TypeScript but doesn't type-check it, so a type error won't fail the run. That's why CI runs `tsc --noEmit` before the tests.

## CI

GitHub Actions runs on every push and PR to `main`: install, type check, run the tests on Chromium, Firefox and WebKit, then upload the HTML report as an artifact. Failed tests are retried twice in CI and a trace is kept on the first retry.

It needs three repo secrets: `STANDARD_PASSWORD`, `LOCKED_OUT_PASSWORD` and `API_PASSWORD`. The values are the public demo credentials listed in `.env.example`.

## Test coverage

UI
- valid login
- locked out user gets an error
- adding two items updates the cart badge
- sorting by price low to high

API
- create, read, update and delete a booking, then confirm it's gone (GET returns 404)
- updating with an invalid token returns 403

Restful Booker is a shared public server and is sometimes slow, so an API test can occasionally fail on timeout. Re-running usually sorts it.