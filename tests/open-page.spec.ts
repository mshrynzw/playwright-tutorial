import { test, expect } from '@playwright/test';

test('Playwrightのサイトを開く', async ({ page }) => {
  // ページの読み込みが終わるまで待ってから次へ進む。
  await page.goto('https://playwright.dev/');
  // タイトルに Playwright が含まれるまで、既定で5秒以内なら繰り返し確認する。
  await expect(page).toHaveTitle(/Playwright/);
});