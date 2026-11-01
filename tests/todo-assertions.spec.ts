import { test, expect } from '@playwright/test';

// Inspector は Cursor の中には出ない。別の Chrome ウィンドウで、タイトルは Playwright Inspector。
// `npx playwright test tests/todo-assertions.spec.ts --debug` の実行中だけ開く。
// Cursor の裏に出るので、Alt+Tab で選ぶ。テスト対象のページは Google Chrome for Testing の方。
// テストが終わると、Inspector とページの両方は閉じる。

test('追加したTodoの文言とURLを確認する', async ({ page }) => {
  // ページの読み込みが終わるまで待ってから次へ進む。
  await page.goto('https://demo.playwright.dev/todomvc');

  // placeholder 属性で入力欄を探す。この行ではまだ探さない。
  const newTodo = page.getByPlaceholder('What needs to be done?');
  // 欄が見えて入力できるまで待ってから、中身をこの文字列に置き換える。
  await newTodo.fill('牛乳を買う');
  // Enter で一覧へ追加される。追加後、このデモは入力欄を空にする。
  await newTodo.press('Enter');

  // アドレスに todomvc が含まれるまで、既定で5秒以内なら繰り返し確認する。
  await expect(page).toHaveURL(/todomvc/);
  // data-testid="todo-title" の要素が画面に見えていることを確認する。
  await expect(page.getByTestId('todo-title')).toBeVisible();
  // その要素の文言が「牛乳を買う」と一致するまで繰り返し確認する。
  await expect(page.getByTestId('todo-title')).toHaveText('牛乳を買う');
  // 期待を「卵を買う」にすると、実際の「牛乳を買う」と一致せず、5秒後に失敗する。
  //   await expect(page.getByTestId('todo-title')).toHaveText('卵を買う');
});