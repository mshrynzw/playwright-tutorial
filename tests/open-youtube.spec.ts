import { test, expect } from '@playwright/test';

test('YouTubeの検索欄が見える', async ({ page }) => {
  // フルのアドレスなので、baseURL の demo.playwright.dev は付かない。
  await page.goto('https://www.youtube.com/');
  // Chromium では「検索」、Firefox では「Search」。どちらの名前でも1件に絞る。
  await expect(page.getByRole('combobox', { name: /検索|Search/ })).toBeVisible();
});