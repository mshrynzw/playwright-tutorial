# playwright-youtube-auto-play

Windows で Playwright を TypeScript から学ぶためのプロジェクトです。最終的な題材は YouTube の再生です。コードは自分で書き、手順の意味と結果の確認を対話しながら進めます。

## 必要なもの

- Windows
- Node.js と npm

## セットアップ

```powershell
npm install
npx playwright install
```

`npm install` は `@playwright/test` と `typescript` を入れます。`npx playwright install` は操作対象の Chromium、Firefox、WebKit を `%USERPROFILE%\AppData\Local\ms-playwright` に入れます。ブラウザはプロジェクトの外に置かれるので、このフォルダを消しても残ります。

## コマンド

```powershell
npm run typecheck
npx playwright test --headed
npx playwright test --headed --debug
```

- `npm run typecheck` は `tsc --noEmit` です。型だけを検査し、JavaScript は書き出しません。出力がなくプロンプトに戻れば成功です。
- `npx playwright test --headed` はウィンドウを表示してテストを実行します。テストが終わるとウィンドウは閉じます。
- `--debug` を付けると Inspector が開き、操作の前で停止します。

`npm test` も同じテストを実行します。ウィンドウは出ません。

## ファイル

| ファイル | 役割 |
| --- | --- |
| `tests/open-page.spec.ts` | 最初のテスト。Playwright のサイトを開く |
| `playwright.config.ts` | テストの設定。探す場所は `tests` |
| `tsconfig.json` | エディタと `tsc` 用の型検査設定 |
| `package.json` | 依存パッケージと `test` / `typecheck` スクリプト |

テストファイルの `.ts` は、Playwright が実行時に変換します。`tsc` で先にコンパイルする手順はありません。

## いま動くテスト

`tests/open-page.spec.ts` は `https://playwright.dev/` を開き、ページタイトルに Playwright が含まれることを確認します。
