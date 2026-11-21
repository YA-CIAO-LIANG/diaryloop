# DiaryLoop Design System

風格關鍵字：**溫暖、私密、像一本自己的日記**。紙張的米白、墨水的深棕、陶土色的點綴；深色模式像夜裡開著一盞暖燈。
和 ListenLoop（沉靜、黑白橘、幾乎方正）刻意不同：圓角較大、字距與行距較寬鬆、日記本文用書本襯線字。

## 色彩 tokens

所有顏色都是 CSS 變數（`app/globals.css`），元件只能用 Tailwind 對應的工具類別（`bg-surface`、`text-ink-muted`…），不可寫死色碼。`tests/design-tokens.test.ts` 會檢查每組文字對比符合 WCAG AA，且兩個深色區塊完全相同。

| Token             | 淺色：紙張 | 深色：夜燈 | 用途                                             |
| ----------------- | ---------- | ---------- | ------------------------------------------------ |
| `--dl-ground`     | #FAF6EE    | #1C1814    | 頁面背景                                         |
| `--dl-surface`    | #FFFCF6    | #25201B    | 卡片、日記紙面、輸入框                           |
| `--dl-band`       | #F3ECDF    | #211C17    | 淡色帶、選取中的標籤、hover                      |
| `--dl-ink`        | #2E2620    | #F2E9DD    | 標題與主要文字                                   |
| `--dl-ink-muted`  | #6A5D52    | #B9AB9A    | 次要資訊（AA）                                   |
| `--dl-accent`     | #C0603A    | #E2875C    | 陶土色：邊框、圖示、小點綴（**不可當文字顏色**） |
| `--dl-accent-ink` | #94431F    | #F0A47E    | 陶土色文字（AA）                                 |
| `--dl-primary`    | #94431F    | #E2875C    | 主要按鈕底色                                     |
| `--dl-on-primary` | #FFFCF6    | #1C1814    | 主要按鈕文字                                     |
| `--dl-line`       | #E6DCCB    | #3A322A    | 細線、邊框                                       |
| `--dl-rule`       | #ECE3D3    | #2F2822    | 日記紙的橫線（裝飾）                             |
| `--dl-success`    | #3B7048    | #86C595    | 答對、完成                                       |
| `--dl-error`      | #A93C34    | #F08C82    | 錯誤、刪除                                       |
| `--dl-focus`      | #C0603A    | #E2875C    | 鍵盤焦點外框                                     |
| `--dl-mark`       | #FFE7A0    | #5C4714    | 螢光筆底色（AI 標出的 3 個地方）                 |
| `--dl-mark-line`  | #7A5A00    | #F2CF6B    | 螢光筆的底線                                     |
| `--dl-pal`        | #EEF2E8    | #232A22    | AI 筆友回信、聊天對方的氣泡（柔和綠）            |
| `--dl-pal-ink`    | #3F5C46    | #A9C7AE    | 筆友區塊裡的強調文字                             |

規則：

- 一個畫面只放一個 primary 按鈕，代表建議的下一步。
- 狀態不只靠顏色：螢光筆一定有底線（`marked` 工具類別），選取的標籤有 ✓，錯誤訊息有文字。
- AI 筆友的內容一律用 `pal` 底，和使用者自己寫的紙張（`surface`）分得出來。

## 深色模式

- 預設跟隨系統（`prefers-color-scheme`），可手動切換：跟隨系統／淺色／深色（`ThemeToggle`）。
- 選擇存在 localStorage（`dl-theme`），`<head>` 的內嵌腳本在第一次繪製前套用，避免閃白。
- 切換時顏色 280ms 淡入；減少動態效果時直接切換。

## 字體

| 角色  | 英文              | 中文（系統字型）                   | 用途                       |
| ----- | ----------------- | ---------------------------------- | -------------------------- |
| Diary | Lora（含 italic） | 宋體／Noto Serif CJK TC／新細明體  | 日記本文、大標題、筆友回信 |
| UI    | Nunito Sans       | 蘋方／Noto Sans CJK TC／微軟正黑體 | 介面、按鈕、說明           |

- 用 `next/font/google` 在 build 時自帶，不連外部字型服務（D4）。
- 中文用系統字型：中文網路字型動輒數 MB，手機睡前開啟要快。
- 字級（`text-*`）：hero clamp(36px, 7vw, 64px)；h1 32；h2 24；h3 19；**diary 18px／行高 1.8**；body 16／1.7；supporting 15；metadata 13。
- 日記本文寬度上限 `max-w-reading`（38rem，約 65～75 個英文字元）。

## 形狀、間距、陰影

- 圓角：`rounded-base` 10px；標籤用 `rounded-full`。
- 間距：Tailwind 4px 基準，常用 4／8／12／16／24／32／48／64。
- 陰影：只有卡片（`shadow-card`），很淡，像紙張放在桌上。

## 元件

| 元件                       | 位置                              | 說明                                                                            |
| -------------------------- | --------------------------------- | ------------------------------------------------------------------------------- |
| `Button`                   | `components/Button.tsx`           | primary（實心）／secondary／ghost／danger；sm 32、md 40、lg 48px；觸控至少 44px |
| `ButtonLink`               | `components/ButtonLink.tsx`       | 外觀同 Button 的連結                                                            |
| `Card`                     | `components/Card.tsx`             | 一張紙：surface、細線、淡陰影                                                   |
| `Field`                    | `components/Field.tsx`            | 標籤＋說明＋錯誤（`role="alert"`），自動串好 `aria-describedby`                 |
| `TextInput`                | `components/Field.tsx`            | 一般輸入框                                                                      |
| `DiaryTextArea`            | `components/Field.tsx`            | 日記紙：橫線（`paper-ruled`）對齊行高、Lora 18px、`lang="en"`、拼字檢查         |
| `Chip`                     | `components/Chip.tsx`             | 心情、天氣、標籤、長度的切換；`aria-pressed`，選取時 ✓＋陶土色邊框              |
| `SegmentedControl`         | `components/SegmentedControl.tsx` | 原生 radio 的「A / B / C」選擇（主題、語言）                                    |
| `SiteHeader`／`SiteFooter` | `components/`                     | 頁首（品牌、語言、主題，手機換行）、頁尾（隱私權、條款）                        |

`/styleguide` 並排顯示淺色與深色的所有 tokens 與元件。

## 動態

- 按壓：`pressable` 工具類別，按下時 scale(0.98)，120ms；**沒有漣漪**（比 ListenLoop 安靜，睡前使用不刺眼）。
- 過場 160ms；標題、區塊不做進場動畫。
- `prefers-reduced-motion: reduce`：所有縮放、淡入都關閉，只保留顏色變化。
- 不做慶祝彩帶；完成一天時用文字與一個小插圖（M1 決定），不做閃爍效果。

## 無障礙

- 所有互動元素可以用鍵盤操作；焦點外框 2px `--dl-focus`、偏移 2px。
- 文字對比符合 WCAG AA（自動測試）；axe 在 E2E 檢查 WCAG 2.1 AA。
- 觸控裝置上可點的東西至少 44px（`tap` 工具類別、`pointer-coarse:min-h-11`）。
- 320px 寬也不能有橫向捲動（E2E 檢查）。
- `<html lang>` 跟著介面語言；英文日記內容一律 `lang="en"`。
- 頁首前有「跳到主要內容」連結。

## 多語系介面

- 繁體中文（預設）與英文；`LanguageToggle` 在頁首右側。
- 中文介面以中文字體為主；英文內容（`lang="en"`）切回英文字體優先。
- 文案語氣：中文溫和、像朋友；英文簡短、溫暖。不說教、不施壓（見 `docs/learning-science.md` 文案規則）。
