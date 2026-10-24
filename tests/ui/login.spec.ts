import { test, expect } from "@playwright/test";

test("valid login lands on the inventory page", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  await page.getByTestId("username").fill("standard_user");
  await page.getByTestId("password").fill("secret_sauce");
  await page.getByTestId("login-button").click();

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.getByTestId("title"))
    .toHaveText("Products");
});

test("locked out user sees an error message", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  await page.getByTestId("username").fill("locked_out_user");
  await page.getByTestId("password").fill("secret_sauce");
  await page.getByTestId("login-button").click();

  await expect(page.getByTestId("error"))
    .toHaveText("Epic sadface: Sorry, this user has been locked out.");
});