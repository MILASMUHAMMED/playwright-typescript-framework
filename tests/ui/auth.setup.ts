import { test as setup, expect } from "@fixtures/test";
import { env } from "@config/env";
import fs from "node:fs/promises";
import path from "node:path";

const authDir = path.resolve(process.cwd(), ".auth");
const authFile = path.join(authDir, "user.json");

setup("authenticate", async ({ page, loginPage, inventoryPage }) => {
  await fs.mkdir(authDir, { recursive: true });

  await loginPage.goto();
  await loginPage.login(env.standardUser, env.standardPassword);

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(inventoryPage.pageTitle).toHaveText("Products");

  await page.context().storageState({ path: authFile });
});
