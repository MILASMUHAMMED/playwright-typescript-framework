import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { InventoryPage } from "../../pages/InventoryPage";

test("valid login lands on the inventory page", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.goto();
  await loginPage.login("standard_user", "secret_sauce");

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(inventoryPage.pageTitle).toHaveText("Products");
});

test("locked out user sees an error message", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login("locked_out_user", "secret_sauce");

  await expect(loginPage.errorMessage).toHaveText(
    "Epic sadface: Sorry, this user has been locked out."
  );
});