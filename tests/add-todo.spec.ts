import { test, expect } from '@playwright/test';

test('Todoを追加する', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');

  // placeholder 属性で入力欄を探す。この行ではまだ探さない。
  const newTodo = page.getByPlaceholder('What needs to be done?');
  // 欄が見えて入力できるまで待ってから、中身をこの文字列に置き換える。
  await newTodo.fill('牛乳を買う');
  // Enter で一覧へ追加される。追加後、このデモは入力欄を空にする。
  await newTodo.press('Enter');

  // 追加された行が見えるまで、既定で5秒以内なら繰り返し確認する。
  await expect(page.getByText('牛乳を買う')).toBeVisible();
});