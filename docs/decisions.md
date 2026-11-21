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
