import { type Locator, type Page } from "@playwright/test";

export class InventoryPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly shoppingCartBadge: Locator;
  readonly cartLink: Locator;
  readonly productSortDropdown: Locator;
  readonly inventoryItemPrices: Locator;

  readonly backpackAddButton: Locator;
  readonly bikeLightAddButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByTestId("title");
    this.shoppingCartBadge = page.getByTestId("shopping-cart-badge");
    this.cartLink = page.getByTestId("shopping-cart-link");
    this.productSortDropdown = page.getByTestId("product-sort-container");
    this.inventoryItemPrices = page.getByTestId("inventory-item-price");

    this.backpackAddButton = page.getByTestId(
      "add-to-cart-sauce-labs-backpack"
    );
    this.bikeLightAddButton = page.getByTestId(
      "add-to-cart-sauce-labs-bike-light"
    );
  }

  async addBackpackToCart(): Promise<void> {
    await this.backpackAddButton.click();
  }

  async addBikeLightToCart(): Promise<void> {
    await this.bikeLightAddButton.click();
  }

  async sortPriceLowToHigh(): Promise<void> {
    await this.productSortDropdown.selectOption("lohi");
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}