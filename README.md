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

`tests/open-page.spec.ts` は `https://playwright.dev/` を開き、ページタイトルに Playwright が含まれることを確認します。このテストは Phase 2 で追加しました。

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

## 今後の Phase

Phase 2 の次は、要素の見つけ方から YouTube の再生までをこの順で進める。各回の手順は、始めるときに説明する。終わった回は「学習の記録」へ移す。

### Phase 3（第3回）ロケータで要素を見つけてクリックする

`https://playwright.dev/` 上のリンクを、役割と名前で見つけてクリックする。クリック後の URL を確認する。同じ条件に複数の要素がヒットすると、クリック前に失敗する。その失敗の読み方もここで扱う。

### Phase 4（第4回）入力と自動待機

テキストボックスへ文字を入れ、結果が画面に出ることを確認する。要素が出るまで待つ処理は Playwright が行う。`setTimeout` や固定の待ち時間は書かない。練習ページは、レイアウトが変わりにくい TodoMVC（`https://demo.playwright.dev/todomvc`）を使う。

### Phase 5（第5回）確認の種類と、失敗したときの出力

表示されていること、文言、URL など、確認の種類を増やす。1件だけわざと失敗させ、期待した値と実際の値の差分、`test-results` に残るファイルの見方を覚える。

### Phase 6（第6回）止めて観察する

`--debug` で Inspector を開き、操作の直前で止める。失敗した操作をあとから再生するトレースを取り、トレースビューアで見る。スクリーンショットを残す方法もここで扱う。

### Phase 7（第7回）設定を増やす

`playwright.config.ts` に、共通の起点 URL とタイムアウトを書く。Chromium に加えて Firefox でも同じテストが走るよう、`projects` を1つ足す。WebKit は、この回では対象にしない。

### Phase 8（第8回）YouTube を開く

`https://www.youtube.com/` を開く。同意ダイアログや、ログインを促す表示が出たら、そのボタンをロケータで押して先へ進む。トップの検索欄が見えるところまでを、この回の完了条件にする。

### Phase 9（第9回）動画を再生する

検索するか、動画の URL を直接開いて再生する。`video` 要素が再生中であることを確認する。ブラウザが音声付きの自動再生を止める場合があるので、そのときの画面と、テストで見る状態の違いもここで扱う。ここが、このリポジトリの題材の到達点になる。
