import { test, expect } from '@playwright/test';

test('Todoを追加する', async ({ page }) => {
  // / から始まるので、baseURL の https://demo.playwright.dev が前に付く。
  // 読み込みが終わるまで待ってから次へ進む。
  await page.goto('/todomvc');
  // placeholder 属性で入力欄を探す。この行ではまだ探さない。
  const newTodo = page.getByPlaceholder('What needs to be done?');
  // 欄が見えて入力できるまで待ってから、中身をこの文字列に置き換える。
  await newTodo.fill('牛乳を買う');
  // Enter で一覧へ追加される。追加後、このデモは入力欄を空にする。
  await newTodo.press('Enter');

  // 追加された行が見えるまで、設定の expect.timeout である5秒以内なら繰り返し確認する。
  await expect(page.getByText('牛乳を買う')).toBeVisible();
});