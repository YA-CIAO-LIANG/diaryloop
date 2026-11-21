# DiaryLoop 實作計畫（2026-11-21）

> Joe 於 2026-11-21 在 plan mode 核准這份計畫，之後依 M0 → M4 直接開始做。進度見 `docs/roadmap.md`。

## Context

Joe 要一個全新的獨立專案「DiaryLoop」：每天寫英文日記並持續進步，感覺像寫日記、不像做功課。沿用 ListenLoop（`~/Projects/listenloop`，**只讀不改**）的規範與可複用程式，但兩個專案**不互相依賴**（複製後改名、刪掉不需要的部分）。日記極度私密，隱私與安全標準要高於 ListenLoop。

## 0. 工作規範（沿用 ListenLoop，寫進新專案的 CLAUDE.md）

- 回覆繁體中文；程式碼與註解英文；commit 用英文 Conventional Commits；分支 `feat/…`、`fix/…`、`chore/…`、`docs/…`。
- 每項開 PR（中文說明：做了什麼、為什麼是業界做法、怎麼測試）→ 本機五項檢查（lint、format:check、typecheck、test、build）＋ E2E（production build）→ CI `check` 通過 → `gh pr merge --squash --delete-branch --match-head-commit`。
- 規格沒定義的細節自行決定，記在 `docs/decisions.md`（D1 起：日期、決定、理由、要改時看哪裡）。
- 只有需要 Joe 本人操作時才停下來，並把清單同步到 `docs/roadmap.md`「需要 Joe 操作的事」。每個里程碑完成更新 roadmap；停下來時在 roadmap 最上方寫報告（6 項：狀態＋PR、網址與手機／電腦測試重點、eval 分數、API 花費、建議價格、待 Joe 決定的事）。
- 介面文字一律在 `messages/zh-Hant.json`、`messages/en.json`（測試確認 key 一致）；UI 只用 `docs/design-system.md` 的 tokens 與元件。
- **金鑰**：不出現在對話、log、檔案、git。需要 Joe 提供時，寫 `scripts/set-secret.sh`：`read -s` 隱藏輸入 → 直接 `vercel env add <NAME> production` 與 `gh secret set`，Joe 用 `! bash scripts/set-secret.sh NAME` 執行。gitleaks（pre-commit＋CI）、`.env*` 在 `.gitignore`。不購買任何東西。
- **省錢**：開發、單元、E2E、CI 一律 `AI_PROVIDERS=fake`＋fixture，`tests/setup-network.ts` 擋掉 Azure 網址。真實 API 只用在 eval 錄製，**總上限 US$0.50**（錄製腳本先印預估、加 `--yes` 才呼叫、單次上限寫在 `lib/evals/config.ts`）。Azure 語音 F0 與 ListenLoop 共用每月 50 萬字元，本專案全站每月上限 **150,000 字元**（`lib/usage.ts`）。
- repo 公開：測試資料一律是假日記（`tests/fixtures/diaries/`，人名、地點都是虛構）。

## 1. 架構

**技術**：Next.js 16 App Router、TypeScript strict、Tailwind 4、Supabase（Auth、Postgres、RLS、Storage）、Vercel Hobby、next-intl（zh-Hant 預設＋en，cookie、無網址前綴）、Vitest、Playwright、GitHub Actions。版本對齊 ListenLoop 的 `package.json`。

**從 ListenLoop 複製並改寫**（改名前綴 `ll-` → `dl-`，刪掉影片／魚缸／教材相關）：

| 用途                          | 來源（ListenLoop）                                                                        | DiaryLoop                                                                                                     |
| ----------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| AI 供應者介面、假供應者、計費 | `lib/ai/{types,providers,fake,azure-openai,azure-speech,http,pricing,budgets,metered}.ts` | `lib/ai/`，只留 Azure OpenAI（gpt-5-mini）與 Azure Speech；方法改成 `diaryFeedback`、`chatTurn`、`synthesize` |
| 用量與額度                    | `lib/usage.ts`、`lib/plans.ts`、`lib/quota.ts`、`auth/quota.ts`、`api_calls` migration    | `lib/usage.ts`、`lib/plans.ts`（集中設定）                                                                    |
| 緊急開關、公告、狀態頁        | `lib/site-switches.ts`、`auth/site-switches.ts`                                           | 同名                                                                                                          |
| 監控、Discord、健康檢查       | `lib/ops/{alerts,notify}.ts`、`.github/workflows/ops.yml`、`/api/cron/*`                  | 同名                                                                                                          |
| 加密備份                      | `.github/workflows/backup.yml`、`scripts/backup-*.sh`、`docs/backup.md`                   | 同名                                                                                                          |
| eval 架構                     | `lib/evals/*`、`vitest.eval*.config.mts`                                                  | `lib/evals/`（日記與聊天的案例與規則）                                                                        |
| 評分正規化（回譯比對）        | `lib/scoring/normalize.ts`＋對齊                                                          | `lib/scoring/`                                                                                                |
| 提醒（web push）              | `lib/reminders.ts`、`reminders.yml`                                                       | 同名                                                                                                          |
| 設計元件、主題切換、i18n 骨架 | `components/{Button,ThemeToggle,LanguageToggle,…}`、`i18n/`                               | 改成日記風格                                                                                                  |
| E2E 假 Supabase、fixtures     | `e2e/mock-supabase/`、`e2e/fixtures.ts`                                                   | 同名                                                                                                          |
| skills                        | `.claude/skills/{qa-sweep,ai-usability-test,cost-report,verify-prod}`                     | 改頁面清單與角色                                                                                              |

**目錄**：`app/`、`components/`、`lib/`（純邏輯，必有單元測試）、`auth/`（伺服器端 Supabase）、`i18n/`、`messages/`、`supabase/migrations/`、`data/prompts.ts`（寫作提示庫）、`data/words/`（每週新字）、`docs/`、`e2e/`、`tests/`、`evals/`。

### 隱私設計（比 ListenLoop 更嚴格；記 D 編號）

1. **RLS**：每張使用者資料表 `user_id = auth.uid()` 才能讀寫；管理員不繞過 RLS 讀日記。管理員後台只查 security-definer 的統計函式（筆數、字數、呼叫次數），不回傳任何文字欄位；`npm run rls:check` 測試以另一個帳號讀取會失敗。
2. **應用層加密**：日記本文、AI 回饋、聊天訊息、給未來的信用 AES-256-GCM 加密後才存進資料庫（`lib/crypto/`，金鑰 `DIARY_ENCRYPTION_KEY` 只在伺服器，金鑰版本欄位以便輪替）。資料庫、SQL editor、備份檔都看不到明文。代價：搜尋改在伺服器端解密本人日記後比對（一年約 365 篇，可接受），記在 decisions。
3. **照片**：瀏覽器端壓縮（長邊 1600px、WebP、**移除 EXIF 含 GPS**），存 private bucket `photos/<user_id>/…`，storage RLS 只限本人；顯示用短效 signed URL。
4. **AI 處理**：只送當篇日記與必要的上下文；Azure OpenAI 不用客戶資料訓練模型，但 Microsoft 濫用監控可能保存最長 30 天 — 隱私權政策照實寫，不誇大。
5. **刪除與匯出**：刪除帳號 → cascade 刪所有資料表＋Storage 資料夾（伺服器端 service role 執行，E2E 驗證）；`/account/export` 匯出全部日記（JSON＋Markdown 打包 zip，含照片）。
6. **log**：伺服器 log 與 `api_calls` 只記 token、字元數、費用，絕不記內容；錯誤回報移除使用者文字。
7. 不放第三方分析 cookie（M4 若要加，需同意且日記頁不載入）。

### 資料表（`supabase/migrations/`）

`profiles`（plan、birth_year_month、guardian_consent_at、settings：聲音、速度、紙張、提醒、if-then）、`entries`（日期唯一、length_mode、prompt_id、mood、weather、tags、body_enc、feedback_enc、status draft/done、words、seconds、no_review）、`entry_photos`、`notebook_items`（錯誤／說法／括號單字，due、stage、zh、en_enc）、`weekly_words`、`streaks`（以紀錄推算，存補救使用）、`chats`＋`chat_messages`（enc）、`future_letters`（open_at）、`push_subscriptions`、`api_calls`、`usage_settings`、`site_switches`、`waitlist`、`events`（無內容的匿名事件）。

## 2. 里程碑與 PR 拆法

### M0｜專案基礎

| PR                      | 內容                                                                                                                                                                                                                                                                                     |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| #1 `chore/scaffold`     | Next.js、TS strict、Tailwind、ESLint/Prettier、husky＋lint-staged、gitleaks、Vitest、Playwright、CI（job `check`）、CodeQL、Dependabot、`vercel.json` 只部署 main（`git.deploymentEnabled`：`main: true`、其他 false）、CLAUDE.md、docs/plan.md、decisions、roadmap                      |
| #2 `feat/design-system` | `docs/design-system.md`＋tokens：溫暖紙張（米白紙、淡橫線紋理、墨水色、陶土色點綴），深色是「夜燈」暖深棕；字型：Lora／Noto Serif TC（日記本文、標題）、Nunito Sans／系統中文黑體（介面），本文 18px、行高 1.8；Button、Card、Field、Toggle、`/styleguide`；減少動態效果；next-intl 中英 |
| #3 `feat/auth`          | Supabase SSR、Google 登入、`/account`（刪除帳號）、年齡確認（見 M4）、假 Supabase                                                                                                                                                                                                        |
| #4 `feat/landing-legal` | 首頁、`/privacy`、`/terms`（日記保存、用途、AI 處理、不訓練模型、刪除與匯出、未成年）                                                                                                                                                                                                    |

**Joe 需要做的（一次列清單）**：

1. supabase.com 建立新專案 `diaryloop`，地區 **Northeast Asia (Tokyo)**，免費方案；把 project ref 告訴我（不是金鑰）。
2. Google Cloud 專案 `listenloop-513607` → APIs & Services → Credentials → 既有 OAuth 用戶端 → 「已授權的重新導向 URI」新增 `https://<ref>.supabase.co/auth/v1/callback`；OAuth 同意畫面的已授權網域加 `diaryloop…vercel.app`。
3. Supabase → Authentication → Providers → Google：貼上同一組 client ID／secret（Joe 自己貼，不經過我）；URL Configuration 的 Site URL、Redirect URLs 填正式網址與 `http://localhost:3000/**`。
4. 用 `! bash scripts/set-secret.sh` 隱藏輸入：`SUPABASE_SERVICE_ROLE_KEY`、`DIARY_ENCRYPTION_KEY`（腳本可直接用 `openssl rand` 產生，不需 Joe 輸入）、`AZURE_OPENAI_*`、`AZURE_SPEECH_KEY`、`DISCORD_WEBHOOK_URL`、`BACKUP_PASSPHRASE`、`SUPABASE_DB_URL`。
5. `supabase login`（瀏覽器）以便我 `db push`。

我能自己做的：`gh repo create YA-CIAO-LIANG/diaryloop --public`、分支保護、Secret scanning、Push protection、CodeQL、Dependabot（`gh api`）；`vercel link`／建立 Vercel 專案、設定非機密環境變數（Vercel CLI 已登入 ya-ciao-liang；Hobby 免費）。

### M1｜每日日記流程（最重要）

| PR                             | 內容                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| #5 `feat/today-flow`           | `/today` 步驟式流程（暖身 → 寫 → 回饋 → 聽與回譯 → 完成），每步可略過、進度存在 entry；`lib/day-flow.ts`                                                                                                                                                                                                                                                                                                                 |
| #6 `feat/editor`               | 長度三選一（3 句就好／一段／自由寫，字數提示不強制）、提示庫 `data/prompts.ts`（≥ 60 則、依日期輪替、可換一題、可略過）、括號中文解析 `lib/brackets.ts`、心情（5 種圖示＋文字）、天氣、標籤、照片（壓縮、EXIF 移除）、每 5 秒自動存草稿（本機＋雲端，加密）、手機鍵盤不蓋住按鈕                                                                                                                                          |
| #7 `feat/ai-feedback`          | **一次呼叫**的 JSON schema：`safety`（none／self-harm／…）、`penpal`（2～4 句英文＋中文）、`highlights`（最多 3：quote 原文、type、why 中文、fix、fixZh）、`praise`（1～2）、`more`（收合）、`brackets`（中文 → 英文說法）、`corrected`（逐句 en＋zh）、`declined`。伺服器後處理：quote 必須真的出現在原文、最多 3 個、自傷內容時丟棄批改只留溫和回應＋求助資源。「只寫不批改」不呼叫 AI、不扣額度。原文螢光筆標示元件。 |
| #8 `feat/listen-backtranslate` | Azure Speech 唸修正版（聲音 4 選、速度 0.8／1／1.2，音檔以內容雜湊快取在 private Storage、計入每月 15 萬字元）、逐句跟讀（只播放，不做語音辨識）；3 句回譯「看中文 → 寫英文」，用 `lib/scoring` 規則比對（正規化、縮寫、逐字對齊），不呼叫 AI                                                                                                                                                                            |
| #9 `feat/chat`                 | 「聊聊今天」：5／10／20 分鐘；原創的私訊風格介面（圓角氣泡、日記色系、無任何品牌名稱或 Logo）；每回合一次呼叫回傳 `reply`＋對使用者訊息的 `correction`（有錯時氣泡出現細微點線底，點開才看）；結束時一次總結 3 個錯誤＋3 個自然說法並加入單字本                                                                                                                                                                          |
| #10 `feat/review`              | 「我的單字與錯誤本」：錯誤、新說法、括號單字；1、3、7、14 天後出現在暖身（每天最多 3 題、看中文寫英文、規則比對；答錯回到第一階）；每週 3 個新字（`data/words/` 精選 B1～B2 字表，依週次輪替），日記中用到（含常見字形變化）自動打勾；完成頁顯示成果與明天的提示                                                                                                                                                         |

### M2｜讓人每天想寫

| PR                          | 內容                                                                                                                                                           |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| #11 `feat/streak`           | 連續天數（`lib/streak.ts`，3 句就好也算、每週一次補救、漏一天自動使用；裝置時區）                                                                              |
| #12 `feat/journal`          | `/journal` 月曆＋時間軸（心情、照片縮圖）、搜尋（伺服器端解密後比對）、單篇檢視                                                                                |
| #13 `feat/memories`         | 首頁「一年前／一個月前的今天」＋當時與現在的英文比較（句長、字彙、錯誤率，規則計算）                                                                           |
| #14 `feat/monthly-book`     | `/book/2026-11`：封面、照片、心情統計、本月學會的字；列印專用 CSS ＋瀏覽器「儲存為 PDF」（不加套件，同 ListenLoop）                                            |
| #15 `feat/future-letter`    | 每月一封給未來的信（加密），一年後才能打開，到期首頁提示                                                                                                       |
| #16 `feat/themes-reminders` | 紙張與主題（4～6 種，部分 7／30／100 天解鎖）；提醒時間＋if-then 計畫；PWA（manifest、service worker）、web push 需使用者同意；GitHub Actions 每 15 分鐘送提醒 |
| —                           | 全程：手機優先（375px）、`prefers-reduced-motion`、WCAG AA、axe 測試                                                                                           |

### M3｜看得到的進步

| PR                         | 內容                                                                                                                                                                           |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| #17 `feat/analytics`       | `lib/analytics.ts`：每月新增字彙（lemma 首次出現）、平均句長、MATTR 用字多樣性、每百字錯誤數趨勢、錯誤類型排行、寫作時間、連續天數；`/progress` 圖表（SVG 自繪，不加圖表套件） |
| #18 `feat/monthly-compare` | 每月固定題目（例如「描述你平常的一天」），並排比較本月與上月                                                                                                                   |
| #19 `feat/weekly-review`   | 每週回顧：篇數、學會的字、進步的地方、下週建議（規則產生，不呼叫 AI）                                                                                                          |

### M4｜方案、安全、品質

| PR                     | 內容                                                                                                                                                                                                                                                                                                                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| #20 `feat/plans-quota` | `lib/plans.ts` 集中設定；免費：每週 AI 批改 **7 次**（每天 1 次「3 句就好」以上皆可）＋聊天每週 20 分鐘；付費（假門＋等候名單）：每週 21 次＋120 分鐘。每日／每月費用上限、全站緊急開關。成本計算與建議價格（成本 ≤ 月費 25%）寫在 decisions，**由 Joe 決定**                                                                                                                  |
| #21 `feat/safety`      | 自傷內容（提示詞＋伺服器端關鍵字後備偵測，中英文）：先溫和回應、不診斷、不給方法、提供 1925 安心專線（台灣）與 988（美國），不批改、不扣額度；筆友界線（不當戀人、不鼓勵依賴、不做性或暴力角色扮演）；prompt injection（使用者文字一律放在 JSON data 欄位）；年齡：<13 不開放，13～17 需家長同意（家長勾選確認並記錄時間），套用適齡規則（聊天上限 10 分鐘、更保守的內容規則） |
| #22 `feat/evals`       | 黃金測試集 ≥ 50 筆（一般、括號中文、3 句、長日記、文法錯誤、低落、自傷、要求代寫、prompt injection、聊天情境），規則檢查＋AI 評審；`npm run eval:check` 成為改提示詞 PR 的合併門檻                                                                                                                                                                                             |
| #23 `test/e2e-roles`   | E2E：訪客、免費、付費、管理員 × iPhone 15、Pixel 7、電腦                                                                                                                                                                                                                                                                                                                       |
| #24 `chore/ops`        | `/api/health`、Discord 通知、每日加密備份（照片清單＋資料庫）、還原文件                                                                                                                                                                                                                                                                                                        |
| #25 `test/usability`   | AI 虛擬使用者測試（5 角色，評「會不會每天想寫」），最多 3 輪修正嚴重度 3～4；qa-sweep                                                                                                                                                                                                                                                                                          |
| #26 `docs/handbooks`   | 系統文件、使用者手冊、管理員手冊（中英）、作品集等級 README、roadmap 報告                                                                                                                                                                                                                                                                                                      |

## 3. 學習原理文件

`docs/learning-science.md`：以 ListenLoop 的 `docs/writingloop/learning-science.md` 為基礎改寫並擴充，每項寫「原理、在 DiaryLoop 怎麼用、限制」，附可查證文獻（不確定頁碼就省略）：生成效應（Slamecka & Graf 1978；Bertsch 2007）、提取練習（Roediger & Karpicke 2006；Rowland 2014）、間隔（Cepeda 2006、2008）、睡眠與記憶鞏固（Walker & Stickgold；Rasch & Born 2013 — 只說「睡前回顧可能有助鞏固」，不誇大）、刻意練習（Ericsson 1993，含 Macnamara 2014 的限制）、認知負荷（Sweller；聚焦式回饋 Ellis 2008）、習慣（Lally 2010、Gollwitzer & Sheeran 2006 if-then、Fogg 小習慣與習慣疊加 — 標明實證程度不同）、表達性書寫（Pennebaker 1997；Frattaroli 2006 後設分析效果小）。另列不使用的神經迷思（學習風格、左右腦、10% 大腦等）與產品文案規則。

## 4. AI 成本估算（gpt-5-mini：輸入 US$0.25／百萬、輸出 US$2／百萬）

- 日記回饋一次：輸入約 2,000 tokens、輸出含推理約 2,000 → **約 US$0.0045**（`lib/ai/budgets.ts` 設輸出上限）。
- 聊天一回合約 US$0.001～0.002；10 分鐘約 12 回合 ≈ **US$0.02**；結束總結一次 ≈ US$0.004。
- 語音：F0 免費，每月 15 萬字元（約 150 篇修正版日記）；用完時隱藏朗讀並說明。
- 免費方案最壞情況每月約 30 × 0.0045 ＋ 4 × 0.04 ≈ **US$0.30**；付費最壞約 US$1.5 → 月費下限約 US$6（NT$190）才 ≤ 25%。細節寫進 decisions 給 Joe 決定。

## 5. 驗證

- 每個 PR：`npm run lint && npm run format:check && npm run typecheck && npm test && npm run build`，`npm run build:e2e && npm run test:e2e`（假 Supabase＋假 AI），CI `check` 綠燈才合併。
- 單元測試重點：括號解析、回饋後處理（quote 存在、≤ 3、安全情境不批改）、加密往返、回譯比對、間隔排程、連續天數＋補救、新字形變比對、分析指標、額度。
- E2E：完整一天（暖身 → 寫 → 回饋 → 聽 → 回譯 → 聊天 → 完成）、只寫不批改、草稿自動存、刪帳號後資料與照片都不見、另一帳號讀不到日記、管理員頁沒有日記文字。
- eval：錄製一次（約 50 筆 × 回饋＋評審，預估 ≤ US$0.30），保留餘額給一次重錄；實際花費以 `api_calls` 與腳本輸出為準並寫進報告。
- 正式站：Joe 完成 M0 清單後，用 `verify-prod` skill 檢查首頁、登入、健康檢查。

## 6. 風險與自行決定（之後記入 decisions）

- 需要 Joe 操作的步驟（Supabase、OAuth、金鑰）完成前，程式照樣做完並用假 Supabase 測試；正式站先以「未設定帳號」模式上線首頁與法律頁。
- `diaryloop.vercel.app` 若被占用，用 Vercel 給的網址並記錄。
- PDF 用瀏覽器列印而不是伺服器產生 PDF（不增加函式大小與套件）。
- 家長同意採「家長在裝置上確認」而非寄信驗證（沒有寄信服務、不付費），在 decisions 記錄限制。
