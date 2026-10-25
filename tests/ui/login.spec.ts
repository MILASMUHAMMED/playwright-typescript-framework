import { test, expect } from "@fixtures/test";
import { env } from "@config/env";

// Login tests must start from a signed-out state.
test.use({ storageState: { cookies: [], origins: [] } });

test("valid login lands on the inventory page", { tag: ["@smoke", "@ui"] }, async ({
  page,
  loginPage,
  inventoryPage,
}) => {
  await loginPage.goto();
  await loginPage.login(env.standardUser, env.standardPassword);

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(inventoryPage.pageTitle).toHaveText("Products");
});

test("locked out user sees an error message", { tag: ["@regression", "@ui"] }, async ({
  loginPage,
}) => {
  await loginPage.goto();
  await loginPage.login(env.lockedOutUser, env.lockedOutPassword);

  await expect(loginPage.errorMessage).toHaveText(
    "Epic sadface: Sorry, this user has been locked out."
  );
});
