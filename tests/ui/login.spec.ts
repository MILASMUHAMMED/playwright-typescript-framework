import { test, expect } from "../../fixtures/test";

test("valid login lands on the inventory page", async ({
  page,
  loginPage,
  inventoryPage,
}) => {
  await loginPage.goto();
  await loginPage.login("standard_user", "secret_sauce");

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(inventoryPage.pageTitle).toHaveText("Products");
});

test("locked out user sees an error message", async ({
  loginPage,
}) => {
  await loginPage.goto();
  await loginPage.login("locked_out_user", "secret_sauce");

  await expect(loginPage.errorMessage).toHaveText(
    "Epic sadface: Sorry, this user has been locked out."
  );
});
