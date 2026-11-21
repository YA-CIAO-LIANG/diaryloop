# 開發路線圖

> 計畫：`docs/plan.md`。每完成一個 PR 更新這裡。

## 報告（2026-11-21）：M0 程式完成，等 Joe 建立 Supabase 與設定登入

> **一句話**：專案、CI、設計系統、登入與年齡確認、刪除帳號、首頁與法律頁都已完成並合併，正式站已上線（目前沒有帳號功能）。下一步需要 Joe 建立 Supabase 專案、設定 Google 登入與金鑰，之後我接著做 M1。

### 1. 各里程碑狀況

| 里程碑 | 項目                                   | 狀態                          | PR                                                                                                                                          |
| ------ | -------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| M0     | 專案骨架、CI、CodeQL、Dependabot、文件 | 完成                          | [#1](https://github.com/YA-CIAO-LIANG/diaryloop/pull/1)                                                                                     |
| M0     | 學習原理文件（10 個原理、附文獻）      | 完成                          | [#3](https://github.com/YA-CIAO-LIANG/diaryloop/pull/3)                                                                                     |
| M0     | 設計系統（紙張／夜燈）、中英文介面     | 完成                          | [#9](https://github.com/YA-CIAO-LIANG/diaryloop/pull/9)                                                                                     |
| M0     | Google 登入、年齡確認、刪除帳號        | 完成（程式）；等 Supabase     | [#10](https://github.com/YA-CIAO-LIANG/diaryloop/pull/10)                                                                                   |
| M0     | 首頁、隱私權政策、服務條款             | 完成                          | [#11](https://github.com/YA-CIAO-LIANG/diaryloop/pull/11)                                                                                   |
| M0     | Dependabot 次版本更新                  | 合併                          | [#2](https://github.com/YA-CIAO-LIANG/diaryloop/pull/2)、[#4](https://github.com/YA-CIAO-LIANG/diaryloop/pull/4)；主版本 #5～#8 關閉（D15） |
| M1     | #5～#10 每日日記流程                   | 未開始（Supabase 設定後開始） |                                                                                                                                             |
| M2     | #11～#16 讓人每天想寫                  | 未開始                        |                                                                                                                                             |
| M3     | #17～#19 看得到的進步                  | 未開始                        |                                                                                                                                             |
| M4     | #20～#26 方案、安全、品質              | 未開始                        |                                                                                                                                             |

repo 設定（已完成）：公開、main 分支保護（必須 PR＋`check` 通過，管理員也一樣，禁止 force push）、Secret scanning、Push protection、Dependabot alerts 與安全更新、CodeQL、只允許 squash 合併。

### 2. 正式站與測試重點

正式站：<https://diaryloop-two.vercel.app>（`diaryloop.vercel.app` 已被別人使用，D9）

**手機**：

1. 打開首頁，看到「今天過得怎麼樣？」、4 個步驟卡片、綠色的隱私區塊；左右不能滑動。
2. 頁首的「外觀」選「深色」：變成暖棕色的夜燈配色；重新整理後仍是深色。
3. 頁首切換 EN，整頁變英文。
4. 頁尾打開「隱私權政策」與「服務條款」，內容完整、字夠大好讀。

**電腦**：

1. <https://diaryloop-two.vercel.app/styleguide>：淺色與深色並排的所有顏色與元件。
2. 「登入」頁目前顯示「登入功能還沒開放」（Supabase 設定後才會出現 Google 按鈕）。

### 3. eval 分數

尚未開始（M4）。

### 4. 實際 API 花費

**US$0**（還沒有呼叫任何付費 API）。

### 5. 建議的方案價格

M4 依實際成本計算。初步估算（`docs/plan.md` 第 4 節）：免費方案最壞每月約 US$0.30／人；付費方案月費約 NT$190 以上才能讓成本 ≤ 25%。

### 6. 需要 Joe 決定或親手做的事

見下方「需要 Joe 操作的事」。另外兩件需要你決定：

- **聯絡信箱**（D16）：隱私權政策要放一個公開的聯絡信箱。建議另開一個專用信箱，告訴我後我設定 `NEXT_PUBLIC_CONTACT_EMAIL`（這不是金鑰，可以直接說）。
- **Google 登入畫面會顯示「ListenLoop」**：同一個 Google Cloud 專案只有一個 OAuth 同意畫面，名稱與 Logo 是專案層級的，所以使用者登入 DiaryLoop 時會看到「繼續使用 ListenLoop」。要改的話只能另開一個 Google Cloud 專案（免費）。目前照你的指定沿用，之後要換再告訴我。

## 需要 Joe 操作的事

做完任一步都可以直接告訴我，我會接著做後面的部分。**金鑰一律不要貼在對話裡。**

### A. 讓 Vercel 讀得到新 repo（約 1 分鐘）

目前正式站是我用 CLI 從 main 部署的；接上 GitHub 後，合併到 main 就會自動部署（其他分支不部署）。

1. 打開 <https://github.com/settings/installations>，找到 **Vercel** → **Configure**。
2. **Repository access** 選 **Only select repositories** 時，加入 `YA-CIAO-LIANG/diaryloop` → **Save**。（若是 All repositories 就不用改。）

### B. 建立 Supabase 專案（約 3 分鐘）

1. 打開 <https://supabase.com/dashboard> → **New project**。
2. Organization 選你原本的（免費方案）；Name：`diaryloop`。
3. **Database Password**：按 **Generate a password**，存到你的密碼管理工具（**不要告訴我**）。
4. **Region**：**Northeast Asia (Tokyo)**。
5. Plan：**Free**（不要選需要信用卡的方案）→ **Create new project**。
6. 建立完成後，網址列會是 `https://supabase.com/dashboard/project/<ref>`，把 **`<ref>`**（一串英文小寫字母）告訴我。這不是金鑰。

### C. 讓我可以套用資料表（約 1 分鐘）

在這個對話的輸入框輸入（會開瀏覽器登入 Supabase）：

```
! npx supabase@3.0.0 login
```

### D. Google 登入（約 5 分鐘）

1. 打開 <https://console.cloud.google.com/apis/credentials?project=listenloop-513607>。
2. 點 **OAuth 2.0 用戶端 ID** 裡 ListenLoop 用的那個網頁用戶端。
3. **已授權的 JavaScript 來源** → 新增 `https://diaryloop-two.vercel.app`。
4. **已授權的重新導向 URI** → 新增 `https://<ref>.supabase.co/auth/v1/callback`（`<ref>` 換成 B 的值）→ **儲存**。
5. 同一頁右側可以看到 **用戶端 ID** 與 **用戶端密鑰**，下一步要用（直接複製貼到 Supabase，**不要貼給我**）。
6. 如果 OAuth 同意畫面還是「測試」狀態，只有測試使用者能登入；你自己的帳號已在名單內就可以。

### E. Supabase 的 Google 設定（約 3 分鐘）

1. Supabase 專案 → **Authentication** → **Sign In / Providers** → **Google** → 打開 **Enable**。
2. 貼上 D 的 **Client ID** 與 **Client Secret** → **Save**。
3. **Authentication** → **URL Configuration**：
   - **Site URL**：`https://diaryloop-two.vercel.app`
   - **Redirect URLs** 新增：`https://diaryloop-two.vercel.app/auth/callback` 與 `http://localhost:3000/auth/callback`。

### F. 金鑰（約 3 分鐘，終端機隱藏輸入）

C 完成後，Supabase 的網址、公開金鑰與秘密金鑰我可以用 CLI 直接寫進 Vercel，不會顯示在畫面上，你不用複製。

需要你輸入的只有以下這些（在對話輸入框執行，輸入時畫面不會顯示）：

```
! bash scripts/set-secret.sh ADMIN_EMAILS
```

（輸入你要當管理員的 Google 信箱，多個用逗號分開。）

Azure 的金鑰在 M1 接上 AI 時才需要，到時候會再列一次。
