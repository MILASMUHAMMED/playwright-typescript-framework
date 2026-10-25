import { test, expect } from "../../fixtures/test";

test.beforeEach(async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.login("standard_user", "secret_sauce");
});

test("adding two items shows 2 on the cart badge", async ({
  inventoryPage,
}) => {
  await expect(inventoryPage.pageTitle).toHaveText("Products");

  await inventoryPage.addBackpackToCart();
  await inventoryPage.addBikeLightToCart();

  await expect(inventoryPage.shoppingCartBadge).toHaveText("2");
});

test("sorting by price low to high orders products correctly", async ({
  inventoryPage,
}) => {
  await expect(inventoryPage.pageTitle).toHaveText("Products");
  await expect(inventoryPage.inventoryItemPrices).toHaveCount(6);

  await inventoryPage.sortPriceLowToHigh();

  await expect.poll(async () => {
    const texts = await inventoryPage.inventoryItemPrices.allTextContents();
    const prices = texts.map((text) =>
      Number(text.replace("$", "").trim())
    );

    return (
      prices.length === 6 &&
      prices.every(Number.isFinite) &&
      prices.every(
        (price, index) => index === 0 || prices[index - 1] <= price
      )
    );
  }).toBe(true);
});
