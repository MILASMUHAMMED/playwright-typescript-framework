import { test, expect } from "@fixtures/test";
import { env } from "@config/env";

test("@smoke @ui valid login lands on the inventory page", async ({
  page,
  loginPage,
  inventoryPage,
}) => {
  await loginPage.goto();
  await loginPage.login(env.standardUser, env.standardPassword);

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(inventoryPage.pageTitle).toHaveText("Products");
});

test("@regression @ui locked out user sees an error message", async ({
  loginPage,
}) => {
  await loginPage.goto();
  await loginPage.login(env.lockedOutUser, env.lockedOutPassword);

  await expect(loginPage.errorMessage).toHaveText(
    "Epic sadface: Sorry, this user has been locked out."
  );
});
