import { test, expect } from '@playwright/test';

test('Get started を開く', async ({ page }) => {
  // ページの読み込みが終わるまで待ってから次へ進む。
  await page.goto('https://playwright.dev/');
  // 役割が link で、読み上げ名に Get started を含む要素を1件だけ押す。
  // 見える位置に落ち着くまで待ってからクリックする。
  await page.getByRole('link', { name: 'Get started' }).click();
  // name を外すとリンク全部に当たり、47件なので押す前に失敗する。
  //   await page.getByRole('link').click();
  // アドレスに docs/intro が含まれるまで繰り返し確認する。両端の / は正規表現の区切り。
  await expect(page).toHaveURL(/docs\/intro/);
});