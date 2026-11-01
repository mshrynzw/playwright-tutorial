import { test, expect } from '@playwright/test';

test('Playwrightのサイトを開く', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});