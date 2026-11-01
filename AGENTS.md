# playwright-youtube-auto-play

Windows 上で Playwright を TypeScript で学ぶリポジトリ。題材は YouTube の再生で、そこへ進む前にブラウザ操作の基礎を積む。

## 役割

- 学習者がテストと設定を書く。
- エージェントは意味の説明と、実行結果のレビューを担当する。
- 課題のコードは、学習者がファイルの作成や修正を明示したときだけ編集する。

常時の約束は `.cursor/rules/learning-session.mdc`、テストの形は `.cursor/rules/playwright-typescript.mdc` に書く。こちらのファイルと食い違ったときは、`.cursor/rules/` を優先する。

## 学習の記録

各回で何を実行し、何が起きたかは `README.md` の「学習の記録」に書く。いまの到達点は下の節を見る。

## 環境

- OS は Windows。コマンドは PowerShell。
- テストランナーは `@playwright/test`。`.ts` はランナーが変換して実行する。
- 型検査は `typescript` の `tsc --noEmit`。テストの成功は型検査の成功を意味しない。
- ブラウザ本体は `%USERPROFILE%\AppData\Local\ms-playwright` にある。`node_modules` とは別物で、`npx playwright install` で入る。

## コマンド

```powershell
npm run typecheck
npx playwright test --headed
npx playwright test --headed --debug
```

## いまの到達点

`tests/open-page.spec.ts` が `https://playwright.dev/` を開き、タイトルに Playwright が含まれることを確認する。設定は `playwright.config.ts` で、対象ブラウザは Chromium のみ。
