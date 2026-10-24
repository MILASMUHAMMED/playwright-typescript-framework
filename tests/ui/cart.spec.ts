import { test, expect } from "@playwright/test";

test("adding two items shows 2 on the cart badge", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  await page.getByTestId("username").fill("standard_user");
  await page.getByTestId("password").fill("secret_sauce");
  await page.getByTestId("login-button").click();

  await expect(page).toHaveURL(/inventory\.html/);

  await page.getByTestId("add-to-cart-sauce-labs-backpack").click();
  await page.getByTestId("add-to-cart-sauce-labs-bike-light").click();

  await expect(page.getByTestId("shopping-cart-badge")).toHaveText("2");
});

test("sorting by price low to high orders products correctly", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  await page.getByTestId("username").fill("standard_user");
  await page.getByTestId("password").fill("secret_sauce");
  await page.getByTestId("login-button").click();

  await expect(page).toHaveURL(/inventory\.html/);

  const prices = page.getByTestId("inventory-item-price");

  await expect(prices).toHaveCount(6);

  await page.getByTestId("product-sort-container").selectOption("lohi");

  // Retry until all six prices appear in ascending numeric order.
  await expect.poll(async () => {
    const texts = await prices.allTextContents();
    const values = texts.map(text =>
      Number(text.replace("$", "").trim())
    );

    return (
      values.length === 6 &&
      values.every(Number.isFinite) &&
      values.every((price, index) =>
        index === 0 || values[index - 1] <= price
      )
    );
  }).toBe(true);
});