import { test as setup, expect } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

import { LoginPage } from "../../pages/LoginPage";
import { env } from "../../config/env";

const authDir = path.resolve(process.cwd(), ".auth");
const authFile = path.join(authDir, "user.json");

setup("authenticate", async ({ page }) => {
  await fs.mkdir(authDir, { recursive: true });

  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(env.standardUser, env.standardPassword);

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.getByTestId("title")).toHaveText("Products");

  await page.context().storageState({ path: authFile });
});