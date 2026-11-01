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
| `tests/open-page.spec.ts` | Playwright のサイトを開き、タイトルを確認する |
| `tests/click-link.spec.ts` | リンクを役割と名前で見つけてクリックする |
| `tests/add-todo.spec.ts` | TodoMVC に文字を入力して追加する |
| `tests/todo-assertions.spec.ts` | 表示、文言、URL を確認する |
| `tests/open-youtube.spec.ts` | YouTube の検索欄が見えることを確認する |
| `tests/play-youtube.spec.ts` | 指定した動画を再生する |
| `playwright.config.ts` | テストの設定。Chromium と Firefox |
| `tsconfig.json` | エディタと `tsc` 用の型検査設定 |
| `package.json` | 依存パッケージと `test` / `typecheck` スクリプト |

テストファイルの `.ts` は、Playwright が実行時に変換します。`tsc` で先にコンパイルする手順はありません。

## いま動くテスト

テストは6件です。`playwright.config.ts` の `projects` により、Chromium と Firefox で1回ずつ走るので、合計12件になります。到達点は `tests/play-youtube.spec.ts` で、指定した YouTube 動画を再生し、`video` 要素の `paused` が `false` になることを確認します。

## 学習の記録

### Phase 1（第1回）プロジェクトを作る

空のフォルダを npm プロジェクトにし、Playwright とブラウザを入れた。

```powershell
npm init -y
npm install -D @playwright/test
npx playwright install
```

- `npm init -y` は `package.json` を作る。`-y` は名前やバージョンを初期値で埋める。
- `npm install -D @playwright/test` はテストランナーを `devDependencies` に入れる。このとき本体の `playwright` と `playwright-core` も一緒に入る。
- `npx playwright install` は Chromium、Firefox、WebKit を `%USERPROFILE%\AppData\Local\ms-playwright` へダウンロードする。npm パッケージとは別物。

結果は終了コード 0。この環境では Chromium（リビジョン 1248）が既にあったので、その実行で新規に落ちてきたのは Firefox 157.0 と WebKit 27.2 だけだった。

この時点の `scripts.test` は `npm init` の仮文言のままで、Playwright はまだ起動しない。

### Phase 2（第2回）TypeScript で最初のテスト

テストを TypeScript で書き、ウィンドウを出して1件成功させた。

```powershell
npm install -D typescript
```

追加・更新したファイルは次のとおり。

- `tsconfig.json`。型検査用。`module` と `moduleResolution` は `nodenext`、`noEmit` は `true`。
- `playwright.config.ts`。`testDir` は `./tests`。ブラウザの指定はなく、既定の Chromium だけが対象。
- `tests/open-page.spec.ts`。`https://playwright.dev/` を開き、タイトルに Playwright が含まれることを確認する。
- `package.json` の `scripts`。`test` は `playwright test`、`typecheck` は `tsc --noEmit`。

途中で出たエラーは2件とも、テストの失敗ではなかった。

- `npm run typecheck` が `Missing script: "typecheck"` になった。`scripts` を書き換える前に実行していた。
- `npx playwright test --headed` が `tsconfig.json` の `invalid end of input at 1:1` で止まった。ファイルは作ってあったが、中身が空のまま保存されていた。Playwright はエディタ上の未保存の文字ではなく、保存済みのファイルを読む。

保存し直したあとの実行結果は次のとおり。

```text
Running 1 test using 1 worker
  ✓  1 tests\open-page.spec.ts:3:5 › Playwrightのサイトを開く (409ms)
  1 passed (910ms)
```

`409ms` はテスト本体、`910ms` はブラウザの起動と終了を含めた全体の時間。`--headed` でも、テストが終わるとウィンドウは閉じる。

### Phase 3（第3回）ロケータで要素を見つけてクリックする

`tests/click-link.spec.ts` を追加した。`https://playwright.dev/` の `Get started` を、役割 `link` と読み上げ名で見つけてクリックし、アドレスに `docs/intro` が含まれることを確認する。

`name` を外して `getByRole('link')` だけにすると、クリックの前に失敗した。

```text
Error: locator.click: Error: strict mode violation: getByRole('link') resolved to 47 elements:
```

`click` は対象が1件のときだけ押す。47件の一覧には、Playwright が提案する絞り込みも出ていた。`name: 'Get started'` に戻したあとは、既存のテストと合わせて2件成功した。

### Phase 4（第4回）入力と自動待機

`tests/add-todo.spec.ts` を追加した。練習ページは TodoMVC（`https://demo.playwright.dev/todomvc`）で、`getByPlaceholder('What needs to be done?')` に `牛乳を買う` を入れ、Enter で一覧へ追加する。追加された文字が見えることは `toBeVisible()` で確認する。

待つ処理は `fill` と `expect` が行う。固定の待ち時間は書いていない。

```text
Running 3 tests using 3 workers
  ✓  1 tests\add-todo.spec.ts:3:5 › Todoを追加する (1.3s)
  ✓  2 tests\click-link.spec.ts:3:5 › Get started を開く (726ms)
  ✓  3 tests\open-page.spec.ts:3:5 › Playwrightのサイトを開く (654ms)
  3 passed (1.9s)
```

### Phase 5（第5回）確認の種類と、失敗したときの出力

`tests/todo-assertions.spec.ts` を追加した。アドレスに `todomvc` が含まれること、`data-testid="todo-title"` が見えていること、その文言が `牛乳を買う` であることを確認する。

期待を `卵を買う` に変えると、要素は見つかったまま文言が違ったので、5秒後に失敗した。

```text
Error: expect(locator).toHaveText(expected) failed
Locator:  getByTestId('todo-title')
Expected: "卵を買う"
Received: "牛乳を買う"
Timeout:  5000ms
```

`14 × locator resolved to <label ...>牛乳を買う</label>` は、5秒のあいだに14回その要素を見つけ、毎回文言が同じだったという意味である。失敗の記録は `test-results` の `error-context.md` に残る。このフォルダは `.gitignore` にある。期待は `牛乳を買う` に戻した。

### Phase 6（第6回）止めて観察する

`npx playwright test tests/todo-assertions.spec.ts --debug` で Inspector を開いた。Inspector は Cursor の中ではなく、タイトルが `Playwright Inspector` の別ウィンドウである。テスト対象のページは `Google Chrome for Testing` の方で、`Alt+Tab` で選ぶ。ステップで1操作ずつ進めると、`about:blank` から TodoMVC、入力、Enter の順に画面が変わる。この観察には 10.6 分かかった。

トレースは次で残した。`--debug` は付けない。

```powershell
npx playwright test tests/todo-assertions.spec.ts --trace on
npx playwright show-trace "test-results\todo-assertions-追加したTodoの文言とURLを確認する\trace.zip"
```

この実行は 3.4 秒で成功した。ビューアの左が操作の一覧、中央がその時点の画面である。

スクリーンショットをコマンドの `--screenshot` で残そうとすると、`unknown option '--screenshot'` になった。この版では、スクリーンショットは `playwright.config.ts` の `use.screenshot` に書く。`'on'` で成功時の画像 `test-finished-1.png` ができることを確認し、その後 `'only-on-failure'` に変えた。失敗したテストの終了時だけ画像が残る。

### Phase 7（第7回）設定を増やす

`playwright.config.ts` に、テスト全体の上限 `timeout: 30000`、確認1件の上限 `expect.timeout: 5000`、起点 `baseURL: 'https://demo.playwright.dev'` を書いた。`projects` に Chromium と Firefox を追加した。WebKit は対象にしていない。

Todo の2ファイルの `goto` は `/todomvc` にした。`/` から始まるので `baseURL` が前に付く。`https://playwright.dev/` と `https://www.youtube.com/` は、フルのアドレスのままである。

```text
Running 8 tests using 8 workers
  8 passed (4.5s)
```

各行に `[chromium]` または `[firefox]` が付く。同じテストが、ブラウザの数だけ走る。

### Phase 8（第8回）YouTube を開く

`tests/open-youtube.spec.ts` を追加した。`https://www.youtube.com/` を開き、検索欄が見えることを確認する。この PC では同意の画面は出なかった。

検索欄の役割は `combobox` である。Chromium では読み上げ名が `検索`、Firefox では `Search` だった。`name: /検索|Search/` で両方に合わせた。

```text
Running 2 tests using 2 workers
  ✓  1 [chromium] › tests\open-youtube.spec.ts:3:5 › YouTubeの検索欄が見える (1.6s)
  ✓  2 [firefox] › tests\open-youtube.spec.ts:3:5 › YouTubeの検索欄が見える (3.3s)
  2 passed (4.3s)
```

### Phase 9（第9回）動画を再生する

`tests/play-youtube.spec.ts` を追加した。検索結果は日によって変わるので、`https://www.youtube.com/watch?v=jNQXAC9IVRw` を直接開く。この動画のタイトルは "Me at the zoo" である。

ページを開いただけでは、Chromium も Firefox も再生しなかった。映像のデータは読み込まれているが、`paused` は `true` のままである。音声つきの再生は、再生ボタンを押してから始まる。大きなボタンの名前は `再生` または `Play` で、操作バーの `再生（k）` や `Play (k)` とは別である。`/^(再生|Play)$/` で大きなボタンだけを押す。

再生中であることは、`video.html5-main-video` の `paused` が `false` であることで確認する。

```text
Running 2 tests using 2 workers
  ✓  1 [chromium] › tests\play-youtube.spec.ts:3:5 › YouTubeの動画を再生する (2.3s)
  ✓  2 [firefox] › tests\play-youtube.spec.ts:3:5 › YouTubeの動画を再生する (3.7s)
  2 passed (4.8s)
```

ここが、このリポジトリの題材の到達点である。

## 今後の Phase

Phase 1 から Phase 9 までは「学習の記録」へ移した。次の回を始めるときは、この節に予定を書き、終わったら記録へ移す。
