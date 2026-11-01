import { test, expect } from '@playwright/test';

test('Get started を開く', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await page.getByRole('link', { name: 'Get started' }).click();
  // Get started が見つからない場合はエラーになる
  //   await page.getByRole('link').click();
  await expect(page).toHaveURL(/docs\/intro/);
});