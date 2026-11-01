import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // テストを探すフォルダ。
  testDir: './tests',
  // 1件のテスト全体の上限。30000 ミリ秒は 30 秒。
  timeout: 30000,
  expect: {
    // toHaveText など、確認1件の上限。Phase 5 で「卵を買う」が失敗した時間。
    timeout: 5000,
  },
  use: {
    // goto('/todomvc') のように / から書くと、このアドレスを前に付ける。
    // https:// から始まるアドレスには付かない。
    baseURL: 'https://demo.playwright.dev',
    // 失敗したテストの終了時だけ、画面の画像を test-results に残す。
    screenshot: 'only-on-failure',
  },
  // 同じテストを、この2つのブラウザでそれぞれ走らせる。WebKit はまだ含めない。
  projects: [
    {
      name: 'chromium',
      // Desktop Chrome の画面サイズとブラウザ名を、このプロジェクトの設定へ展開する。
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});