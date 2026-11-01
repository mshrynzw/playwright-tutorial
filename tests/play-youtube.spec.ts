import { test, expect } from '@playwright/test';

test('YouTubeの動画を再生する', async ({ page }) => {
  // 検索結果は日によって変わるので、動画のアドレスを直接開く。
  await page.goto('https://www.youtube.com/watch?v=jNQXAC9IVRw');
  // 大きな再生ボタンは「再生」または「Play」。操作バーの「再生（k）」には当てない。
  await page.getByRole('button', { name: /^(再生|Play)$/ }).click();
  // video 要素の paused が false なら再生中。設定の5秒以内なら繰り返し確認する。
  await expect(page.locator('video.html5-main-video')).toHaveJSProperty('paused', false);
});