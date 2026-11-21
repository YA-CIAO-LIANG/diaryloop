# DiaryLoop — 英文日記練習網站

GitHub：https://github.com/YA-CIAO-LIANG/diaryloop
計畫：`docs/plan.md`；進度：`docs/roadmap.md`；決策：`docs/decisions.md`；設計：`docs/design-system.md`；學習原理：`docs/learning-science.md`。

產品一句話：每天寫英文日記並持續進步，感覺像寫日記，不像做功課。每天預設 20～30 分鐘、最長不超過 1 小時；累的時候 5 分鐘也能完成「3 句就好」。AI 先回應內容，再談英文。

## 給 Claude 的工作規則（沿用 ListenLoop）

- 跟 Joe 溝通一律用繁體中文（台灣用語）；程式碼、註解、commit 用英文；commit 用 Conventional Commits。
- 這是獨立專案。可以**讀** `~/Projects/listenloop` 參考或複製程式，但**不可以修改它**，兩個專案也不可以互相依賴（不 import、不共用套件或資料庫）。
- **自主進行**：依 `docs/roadmap.md` 的順序一項一項做，不需要等 Joe 說「開始」或「合併」。
  1. 在分支上開發（`feat/…`、`fix/…`、`chore/…`、`docs/…`、`test/…`）。main 受保護，必須透過 PR 且 CI 的 `check` 通過。
  2. 每項開 PR；PR 說明用繁體中文寫清楚：做了什麼、為什麼這是業界做法、怎麼測試。
  3. 本機五項檢查（lint、format:check、typecheck、test、build）＋ E2E（`npm run build:e2e && npm run test:e2e`）都通過才推送。
  4. CI 全部通過後 `gh pr merge --squash --delete-branch --match-head-commit`。不可以在 CI 失敗或還在執行時合併。
  5. 同步 main、刪除本機分支、更新 `docs/roadmap.md` 的進度，接著做下一項。
- 規格沒有定義的細節：自行選擇合理的業界預設，記在 `docs/decisions.md`（日期、決定、理由、要改時看哪裡），不要停下來問。
- 只有需要 Joe 本人操作時才停下來（建立帳號或專案、提供金鑰、需要信用卡的服務）。需要 Joe 做的事一次整理成清單、附詳細步驟，同步更新 `docs/roadmap.md` 的「需要 Joe 操作的事」。停下來時在 `docs/roadmap.md` 最上方寫報告。
- 每個里程碑完成時，更新 `docs/roadmap.md`（狀態、PR 連結、正式站測試重點：手機與電腦分開）。
- 不購買任何東西，不新增需要信用卡的服務。新套件只在必要時加入，挑官方或維護良好的，理由記在 decisions。
- UI 只用 `docs/design-system.md` 的 tokens 與元件；介面文字一律從 `messages/` 讀取，元件內不可寫死中文或英文介面文字。

## 金鑰與隱私（日記非常私密，比一般產品更嚴格）

- 任何金鑰都不能出現在對話、log、檔案或 git。需要 Joe 提供時，請 Joe 執行 `! bash scripts/set-secret.sh <NAME>`（終端機隱藏輸入，直接寫進 Vercel 與 GitHub）。
- `.env*` 在 `.gitignore`；gitleaks 在 CI 掃描每個 commit；GitHub Push protection 開啟。
- repo 是公開的：測試資料、fixture、截圖、文件裡**只能有假日記**（虛構人物與地點），不能有任何真實內容。
- 日記內容只有本人能讀寫（RLS）；本文、AI 回饋、聊天、給未來的信在伺服器端加密後才存（`lib/crypto/`）。管理員後台只看統計，看不到任何日記文字。
- log、`api_calls`、錯誤回報只記數字（token、字元、費用），絕不記使用者文字。
- 不載入任何第三方追蹤、分析、廣告或嵌入內容。

## AI 供應者與測試（省額度，必須嚴格遵守）

- 開發、單元測試、E2E、CI 一律用假的供應者（`AI_PROVIDERS=fake`）或已錄製的 fixture，絕不呼叫真的 API。`tests/setup-network.ts` 會擋掉 Azure 網址。
- 預先核准的真實 API 額度：**合計 US$0.50**，只用在 eval 錄製（與官方題目，題目由 Claude 直接撰寫、不呼叫 API）。錄製腳本預設只印預估，加 `--yes` 才呼叫。超過額度先停下來問 Joe。
- 語言模型：Azure OpenAI gpt-5-mini；聲音：Azure Speech（F0 免費額度與 ListenLoop 共用每月 50 萬字元，本專案全站每月上限 **150,000 字元**）。
- 每次呼叫記錄在 `api_calls`（token、字元、估算費用，不含內容）。價格集中在 `lib/ai/pricing.ts`，額度集中在 `lib/plans.ts` 與 `lib/usage.ts`。
- 改提示詞（`lib/ai/prompts/`）或回饋後處理的 PR，必須通過 `npm run eval:check`（M4 起）。

## 技術

Next.js App Router、TypeScript strict、Tailwind 4、Supabase（Auth、Postgres、RLS、Storage）、Vercel（只有 main 部署，`vercel.json`）、next-intl（繁中預設＋英文，cookie，無網址前綴）、Vitest、Playwright、GitHub Actions（job 名稱 `check`，分支保護依此名稱，不可更改）。

## 專案結構

`app/`（頁面）、`components/`（UI）、`lib/`（純邏輯，必須有單元測試）、`auth/`（伺服器端 Supabase 與 server actions 的共用程式）、`i18n/`、`messages/`、`supabase/migrations/`、`data/`（寫作提示庫、每週新字）、`docs/`、`e2e/`（Playwright，假 Supabase 在 `e2e/mock-supabase/`）、`tests/`（Vitest）。
