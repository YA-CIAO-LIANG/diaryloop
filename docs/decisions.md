# 決策紀錄

規格沒有定義的細節由 Claude 先選擇合理的預設，記錄在這裡。Joe 想改時，告訴 Claude 編號即可，例如「改 D3」。每一筆的格式：日期、決定、理由、要改時看哪裡。

## D1 獨立專案，從 ListenLoop 複製而不共用（2026-11-21）

- **決定**：DiaryLoop 是獨立的 repo、Supabase 專案、Vercel 專案。ListenLoop 的程式（AI 供應者介面、額度、監控、備份、eval、設計元件）**複製後改寫**，不用 npm 套件或 git submodule 共用。
- **理由**：Joe 指定兩個專案不互相依賴。共用套件要多一個發版流程；兩邊的需求（日記的加密、聊天）也會越走越遠。
- **要改時**：無。

## D2 計畫核准後自主進行（2026-11-21）

- **決定**：計畫在 plan mode 由 Joe 核准後存成 `docs/plan.md`，之後依 M0 → M4 直接做，只在需要 Joe 本人操作時停下。
- **要改時**：`docs/plan.md`、`docs/roadmap.md`。

## D3 只有 main 會部署（2026-11-21）

- **決定**：`vercel.json` 的 `git.deploymentEnabled` 只開 `main`，其他分支不產生預覽部署。
- **理由**：Joe 指定。預覽部署會讓未合併的程式出現在公開網址，也會用掉 Hobby 的函式儲存空間。
- **要改時**：`vercel.json`。

## D4 不載入任何第三方內容（2026-11-21）

- **決定**：CSP 只允許本站與 Supabase：沒有分析工具、廣告、嵌入影片、外部字型（字型用 `next/font` 在 build 時自帶）。`Referrer-Policy: same-origin`；`Permissions-Policy` 關閉相機、麥克風、定位。
- **理由**：日記比一般產品私密。第三方腳本能讀到頁面上的日記文字，CSP 從根本擋掉。和 ListenLoop 不同，這裡連 Microsoft Clarity 也不放。
- **要改時**：`lib/security/csp.ts`。

## D5 E2E 用的埠號和 ListenLoop 不同（2026-11-21）

- **決定**：E2E 的網站在 3300、假 Supabase 在 54339（ListenLoop 是 3200、54329）。
- **理由**：兩個專案可以在同一台電腦同時跑測試。
- **要改時**：`playwright.config.ts`、`package.json` 的 `build:e2e`。

## D6 學習原理文件的範圍（2026-11-21）

- **決定**：`docs/learning-science.md` 收錄 10 個原理（生成效應、輸出與注意、提取、間隔、睡眠鞏固、刻意練習、認知負荷與回饋、聊天中的糾正、習慣養成、表達性書寫），每項寫「原理、怎麼用、限制」，另列不使用的神經迷思與文案規則。
- **理由**：Joe 指定要有研究支持、附文獻、不誇大。兩項特別標明限制：表達性書寫的後設分析效果很小（不宣稱心理健康效果）；Fogg 的小習慣是實務書籍，不是同儕審查研究。
- **要改時**：`docs/learning-science.md`；文案規則在文末。

## D7 Vercel 專案明確設定 Next.js（2026-11-21）

- **決定**：`vercel.json` 加上 `"framework": "nextjs"`。
- **理由**：專案是用 CLI 先建立、後放程式，Vercel 沒有自動偵測到框架，第一次部署找不到輸出資料夾而失敗。寫在設定檔裡比只在後台設定更容易追蹤。
- **要改時**：`vercel.json`。

## D8 設計風格：紙張與夜燈（2026-11-21）

- **決定**：淺色是米白紙張、深棕墨水、陶土色點綴；深色是暖棕的「夜燈」，不是純黑。日記本文用 Lora（書本襯線字）18px、行高 1.8，輸入框畫上對齊行高的淡橫線；介面用 Nunito Sans；中文用系統字型。圓角 10px，按壓只有輕微縮放、沒有漣漪。
- **理由**：Joe 要「溫暖、私密、有個人感，像日記不像作業」。多數人睡前用手機寫，深色模式不能刺眼，所以避免純黑與高飽和色。每一組文字顏色都有自動對比測試。
- **要改時**：`app/globals.css`、`docs/design-system.md`；對比測試 `tests/design-tokens.test.ts`。

## D9 正式站網址（2026-11-21）

- **決定**：正式站是 https://diaryloop-two.vercel.app 。
- **理由**：`diaryloop.vercel.app` 已被其他人使用，Vercel 自動加上 `-two`。之後要換自己的網域時，只需要在 Vercel 加網域並更新 Supabase 與 Google OAuth 的網址。
- **要改時**：Vercel 專案設定 → Domains。

## D10 固定 playwright-core 的版本（2026-11-21）

- **決定**：`package.json` 的 `overrides` 把 `playwright-core` 固定在 `@playwright/test` 的版本。
- **理由**：`@axe-core/playwright` 會裝較新的 `playwright-core`，兩個版本的型別不相容，E2E 無法通過型別檢查。升級 Playwright 時一起改。
- **要改時**：`package.json` 的 `overrides`。

## D11 資料存取集中在 Store；E2E 用記憶體版（2026-11-21）

- **決定**：
  - 頁面與 server action 只透過 `getStore()`（`auth/store.ts`）讀寫帳號資料。正式環境是 Supabase 版（`auth/supabase-store.ts`），每次都用登入者自己的工作階段，受 RLS 保護。
  - E2E 與離線開發用記憶體版（`lib/store/memory.ts`，`DATA_STORE=memory`），另有只在記憶體模式存在的測試登入 `/api/test/sign-in`（帳號 id 必須是 `e2e-…`）。
  - **Vercel 正式環境一律不允許記憶體模式**（`VERCEL_ENV=production` 時忽略 `DATA_STORE`），有單元測試確認。
- **理由**：
  - 日記內容在伺服器端加密（之後的 PR），瀏覽器不直接存取資料庫，所以不需要像 ListenLoop 那樣模擬整個 PostgREST（1,200 行的假伺服器）。
  - 測試用介面替換是業界常見的 repository pattern；Supabase 版另以 `npm run rls:check`（Supabase 專案建立後）對真實資料庫驗證 RLS。
- **要改時**：`lib/store/`、`auth/store.ts`、`lib/runtime.ts`、`e2e/fixtures.ts`。

## D12 年齡規則（2026-11-21）

- **決定**：第一次登入後的「歡迎」步驟問出生年月（只問年月）。
  - 未滿 13 歲：立刻刪除剛建立的帳號並登出，不保留任何資料。
  - 13～17 歲：需要勾選「家長或監護人已閱讀隱私權政策與服務條款並同意」，記錄同意時間；之後套用適齡規則（M4：聊天時間上限、更保守的內容）。
  - 18 歲以上：直接開始。
  - 年齡從出生月份的第一天算起。
- **理由**：Joe 指定 13 歲以下不開放、13～17 歲需家長同意。只問年月是個資最小化。家長同意採「在裝置上確認」，沒有寄信驗證：沒有寄信服務、也不付費；限制是無法確認勾選的人真的是家長，這點寫在服務條款。
- **要改時**：`lib/age.ts`、`app/welcome/`、`auth/guard.ts`。

## D13 刪除帳號與管理員權限（2026-11-21）

- **決定**：
  - 刪除帳號：先刪 Storage 裡 `photos/<id>/`、`audio/<id>/` 的檔案，再刪 Supabase Auth 的使用者；所有資料表都 `on delete cascade`，一次刪乾淨。需要勾選確認。
  - 秘密金鑰（service role）只用在使用者自己做不到的事（刪除帳號、設定方案、統計），**絕不用來讀日記內容**。
  - 管理員由環境變數 `ADMIN_EMAILS` 決定，只在伺服器端判斷。
  - `profiles` 的欄位權限：使用者只能寫出生年月與同意時間，不能改自己的方案。
- **要改時**：`auth/supabase-store.ts`、`app/account/`、`supabase/migrations/20261121000000_profiles.sql`。

## D14 金鑰由 Joe 用隱藏輸入設定（2026-11-21）

- **決定**：`scripts/set-secret.sh NAME` 用 `read -s` 隱藏輸入，直接經由標準輸入寫進 Vercel（Production）與 GitHub Actions secret，不經過檔案、命令列參數或對話。`--generate` 直接產生隨機金鑰（例如日記加密金鑰）。
- **理由**：Joe 指定金鑰不能出現在對話、log、檔案或 git。
- **要改時**：`scripts/set-secret.sh`。
