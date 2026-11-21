# DiaryLoop 的學習科學依據

這份文件說明 DiaryLoop 每個設計背後的研究依據、在產品裡怎麼用，以及研究的限制。部分內容改寫自 ListenLoop 的 `docs/writingloop/learning-science.md`。

撰寫原則：

- 只引用可以查證的文獻。不確定的細節（頁碼、DOI）寧可省略，不猜。
- 大部分研究是在實驗室或特定課堂做的，受試者、材料、測驗方式都和「每天寫英文日記」不同。這些研究能支持「這樣設計是合理的」，**不能保證「用了就一定進步多少」**。
- 書籍或普及作品（例如 Fogg 的 _Tiny Habits_）會標明「實務框架，不是同儕審查研究」。
- 對使用者的文案要遵守文末的「產品文案的規則」。

## 功能與原理對照表

| 功能                                              | 主要原理                              | 次要原理                     |
| ------------------------------------------------- | ------------------------------------- | ---------------------------- |
| 暖身：看中文、寫出之前錯過的英文                  | 提取練習                              | 間隔重複、生成效應           |
| 錯誤與新說法在 1、3、7、14 天後回到暖身           | 間隔重複                              | 提取練習                     |
| 先用自己的英文寫，不會的先寫括號中文              | 生成效應、輸出假說（注意到落差）      | 認知負荷                     |
| AI 只標出最重要的 3 個地方＋1～2 個優點，其他收合 | 認知負荷、聚焦式回饋                  | 回饋研究                     |
| AI 筆友先回應內容，再談英文                       | 對話日記（dialogue journal）          | 回饋研究（針對任務、不評人） |
| 聽修正後的日記、跟讀                              | 輸入與注意                            | 提取練習                     |
| 3 句回譯：看中文 → 寫出英文                       | 提取練習、生成效應                    | 間隔（隔天再出現）           |
| 聊聊今天：不打斷對話的糾正，點開才看              | 互動中的糾正回饋（重述）              | 認知負荷                     |
| 長度三選一、「3 句就好」也算完成                  | 小習慣、認知負荷                      | 習慣養成                     |
| 提醒時間＋if-then 計畫（例如「刷牙後就寫日記」）  | 執行意圖（implementation intentions） | 習慣疊加、情境線索           |
| 連續天數；漏一天不中斷、每週一次補救              | 習慣養成（漏一次影響不大）            | —                            |
| 睡前寫、睡前聽一次自己的日記                      | 睡眠與記憶鞏固                        | 分散練習                     |
| 寫自己的生活與感受                                | 表達性書寫                            | 動機與自主                   |
| 每週 3 個新字、在日記中自然用到                   | 生成效應、刻意練習                    | 提取練習                     |
| 一個月前 vs 現在、學習分析                        | 刻意練習（看得見的回饋）              | 動機                         |

## 1. 生成效應（generation effect）

### 原理說明

- 自己產生（generate）的內容，通常比單純讀到的內容記得更好。Slamecka 與 Graf（1978）讓受試者依規則自己產生字詞，之後的記憶表現比直接閱讀同一組字詞好。
- Bertsch 等人（2007）的後設分析整合大量研究，整體效果約為中等（d 約 0.4），但會受材料、測驗類型、延宕時間影響。

### 在 DiaryLoop 怎麼用

- 日記一律先用自己的英文寫，AI 回饋在送出之後才出現。
- 回譯與暖身要學習者自己寫出英文，而不是選擇題或再讀一次。
- 每週新字要用在自己的句子裡，而不是背定義。

### 限制與注意

- 研究多數是字詞記憶的實驗，不是直接研究「寫作能力」。用在寫日記是合理的延伸，不是已證實的結論。
- 生成太難、完全寫不出來時，效果可能消失。所以允許括號中文、提供寫作提示、「3 句就好」。

### 參考文獻

- Slamecka, N. J., & Graf, P. (1978). The generation effect: Delineation of a phenomenon. _Journal of Experimental Psychology: Human Learning and Memory, 4_(6), 592–604. https://doi.org/10.1037/0278-7393.4.6.592
- Bertsch, S., Pesta, B. J., Wiscott, R., & McDaniel, M. A. (2007). The generation effect: A meta-analytic review. _Memory & Cognition, 35_(2), 201–210. https://doi.org/10.3758/BF03193441

## 2. 輸出與「注意到落差」：括號中文

### 原理說明

- Swain 的輸出假說（output hypothesis）指出，學習者在嘗試說或寫的時候，會注意到「想表達的」和「能表達的」之間的落差（noticing the gap），這可能促使他們注意之後遇到的相關語言形式。
- Schmidt（1990）的注意假說（noticing hypothesis）主張，學習者有意識地注意到語言形式，是把輸入轉成吸收（intake）的重要條件。

### 在 DiaryLoop 怎麼用

- 不會的英文先在括號裡寫中文，例如「I went to the (夜市) with my friends」。寫的當下，學習者已經注意到自己缺這個說法；AI 回饋時立刻給出英文說法，並加入單字本，之後在暖身中提取。

### 限制與注意

- 注意假說的「有意識注意是必要條件」這個強版本有爭議；這裡只採用較溫和的說法：注意到落差，再立即得到正確形式，對學習有幫助。
- 允許括號中文也可能讓學習者太依賴中文。介面提示「先試著用英文說說看，真的想不到再用括號」，學習分析會顯示括號數量的變化。

### 參考文獻

- Swain, M. (1995). Three functions of output in second language learning. In G. Cook & B. Seidlhofer (Eds.), _Principle and practice in applied linguistics_ (pp. 125–144). Oxford University Press.
- Schmidt, R. W. (1990). The role of consciousness in second language learning. _Applied Linguistics, 11_(2), 129–158. https://doi.org/10.1093/applin/11.2.129

## 3. 提取練習（retrieval practice）

### 原理說明

- 從記憶中把資訊「提取」出來（例如自我測驗），通常比再讀一次更能幫助長期記憶，稱為測驗效應（testing effect）。
- Roediger 與 Karpicke（2006）發現：做回憶測驗的組別，在 2 天與 1 週後的測驗明顯較好，雖然幾分鐘後的測驗不一定較好。
- Rowland（2014）的後設分析確認測驗效應整體穩定（約 g = 0.5），有回饋時效果較大。Butler 與 Roediger（2008）也發現，測驗後給回饋能進一步加強效果。

### 在 DiaryLoop 怎麼用

- **暖身**：之前的 3 個錯誤，看中文寫出正確的英文。
- **回譯**：聽完修正版後，3 句「看中文 → 寫出英文」。
- 每一題作答後立刻顯示正確答案與差異（規則比對，不呼叫 AI）。

### 限制與注意

- 多數研究測的是「記住內容」，不是「寫作品質」。提取練習能幫助記住說法與自己的常見錯誤，寫作還牽涉構思與語感。
- 規則比對只能判斷和參考答案是否接近，其他正確的寫法可能被判為不同。介面要說「和參考答案不同」，而不是「錯誤」，並讓使用者可以標記「我的也對」。
- 練習當下覺得「再讀一次比較有效」是常見的錯覺，文案可以說明。

### 參考文獻

- Roediger, H. L., III, & Karpicke, J. D. (2006). Test-enhanced learning: Taking memory tests improves long-term retention. _Psychological Science, 17_(3), 249–255. https://doi.org/10.1111/j.1467-9280.2006.01693.x
- Rowland, C. A. (2014). The effect of testing versus restudy on retention: A meta-analytic review of the testing effect. _Psychological Bulletin, 140_(6), 1432–1463. https://doi.org/10.1037/a0037559
- Butler, A. C., & Roediger, H. L., III. (2008). Feedback enhances the positive effects and reduces the negative effects of multiple-choice testing. _Memory & Cognition, 36_(3), 604–616. https://doi.org/10.3758/MC.36.3.604

## 4. 間隔重複（spacing）

### 原理說明

- 同樣的練習量分散在不同時間做，通常比集中一次做記得更久。Cepeda 等人（2006）的後設分析整合數百個語文記憶實驗確認這一點，並指出最適合的間隔和「要記多久」有關。
- Cepeda 等人（2008）發現：想記得越久，最適合的間隔越長；間隔稍長通常比稍短的損失小。
- Karpicke 與 Roediger（2007）發現，逐漸拉長的間隔對短期記憶較有利，固定間隔對長期記憶的效果相當或更好；關鍵似乎是第一次複習不要太快。

### 在 DiaryLoop 怎麼用

- 「我的單字與錯誤本」裡的每一筆，在 1、3、7、14 天後出現在暖身；答對進到下一階段，答錯回到第一階段。
- 每天暖身最多 3 題，到期的題目太多時依到期日排隊，不會一次堆積。

### 限制與注意

- **1、3、7、14 天是實務上方便、合理的漸進排程，不是研究證實的最佳間隔。**
- 間隔研究多數是字詞與事實記憶；用在文法錯誤與搭配詞是合理的延伸。

### 參考文獻

- Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D. (2006). Distributed practice in verbal recall tasks: A review and quantitative synthesis. _Psychological Bulletin, 132_(3), 354–380. https://doi.org/10.1037/0033-2909.132.3.354
- Cepeda, N. J., Vul, E., Rohrer, D., Wixted, J. T., & Pashler, H. (2008). Spacing effects in learning: A temporal ridgeline of optimal retention. _Psychological Science, 19_(11), 1095–1102. https://doi.org/10.1111/j.1467-9280.2008.02209.x
- Karpicke, J. D., & Roediger, H. L., III. (2007). Expanding retrieval practice promotes short-term retention, but equally spaced retrieval enhances long-term retention. _Journal of Experimental Psychology: Learning, Memory, and Cognition, 33_(4), 704–719. https://doi.org/10.1037/0278-7393.33.4.704

## 5. 睡眠與記憶鞏固：睡前回顧

### 原理說明

- 學習之後的睡眠有助於鞏固記憶。Diekelmann 與 Born（2010）、Rasch 與 Born（2013）的回顧指出，睡眠對陳述性記憶（事實、字詞）與程序性記憶都有幫助。
- Gais、Lucas 與 Born（2006）讓受試者學英語—德語字詞，晚上學、隨後睡覺的組別，比早上學、經過一個白天清醒的組別記得更好。
- Mazza 等人（2016）發現，學習與再學習之間隔著一晚睡眠的組別，再學習更快、一週與半年後保留更多。
- Dunlosky 等人（2013）評估常見學習技巧時，把「分散練習」與「練習測驗」列為效用最高的兩種。

### 在 DiaryLoop 怎麼用

- 提醒預設在晚上（使用者可以改）；很多人會在睡前寫日記。
- 寫完後「聽自己的日記」與回譯，是睡前對當天新說法的一次回顧；隔天的暖身再提取一次。

### 限制與注意

- **只能說「睡前回顧可能有助於記憶鞏固」，不能說「睡一覺英文就會變好」。** 睡眠研究多在實驗室進行，測的是特定記憶作業；部分效果的穩健性仍有討論（Cordi & Rasch, 2021）。
- 不描述特定腦區或腦波的作用，也不建議為了寫日記而晚睡。睡眠本身比練習更重要：提醒文案不會在深夜催促使用者。

### 參考文獻

- Diekelmann, S., & Born, J. (2010). The memory function of sleep. _Nature Reviews Neuroscience, 11_(2), 114–126. https://doi.org/10.1038/nrn2762
- Rasch, B., & Born, J. (2013). About sleep's role in memory. _Physiological Reviews, 93_(2), 681–766. https://doi.org/10.1152/physrev.00032.2012
- Gais, S., Lucas, B., & Born, J. (2006). Sleep after learning aids memory recall. _Learning & Memory, 13_(3), 259–262. https://doi.org/10.1101/lm.132106
- Mazza, S., Gerbier, E., Gustin, M.-P., Kasikci, Z., Koenig, O., Toppino, T. C., & Magnin, M. (2016). Relearn faster and retain longer: Along with practice, sleep makes perfect. _Psychological Science, 27_(10), 1321–1330. https://doi.org/10.1177/0956797616659930
- Cordi, M. J., & Rasch, B. (2021). How robust are sleep-mediated memory benefits? _Current Opinion in Neurobiology, 67_, 1–7. https://doi.org/10.1016/j.conb.2020.06.002
- Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). Improving students' learning with effective learning techniques. _Psychological Science in the Public Interest, 14_(1), 4–58. https://doi.org/10.1177/1529100612453266

## 6. 刻意練習（deliberate practice）

### 原理說明

- Ericsson、Krampe 與 Tesch-Römer（1993）提出刻意練習：針對弱點、有明確目標、需要專注、能得到回饋的練習。
- Macnamara、Hambrick 與 Oswald（2014）的後設分析提出重要修正：刻意練習和表現有關，但只解釋一部分的個別差異，在教育領域特別低。

### 在 DiaryLoop 怎麼用

- 暖身與回譯只練**自己**寫錯或不會的說法，不是通用題庫。
- 每週 3 個新字是明確、小的目標；在日記中用到就自動打勾，立即得到回饋。
- 學習分析顯示「最常犯的錯誤類型」，讓使用者知道下一步練什麼。

### 限制與注意

- 原始研究的對象是專家的長期訓練；這裡借用的是「針對弱點、有目標、有回饋」的原則。
- 不使用「一萬小時」這類簡化的說法。寫日記本身是表達，不是每一篇都要當成練習題——這也是「只寫不批改」存在的原因。

### 參考文獻

- Ericsson, K. A., Krampe, R. T., & Tesch-Römer, C. (1993). The role of deliberate practice in the acquisition of expert performance. _Psychological Review, 100_(3), 363–406. https://doi.org/10.1037/0033-295X.100.3.363
- Macnamara, B. N., Hambrick, D. Z., & Oswald, F. L. (2014). Deliberate practice and performance in music, games, sports, education, and professions: A meta-analysis. _Psychological Science, 25_(8), 1608–1618. https://doi.org/10.1177/0956797614535810

## 7. 認知負荷與回饋：為什麼只標 3 個地方

### 原理說明

- **認知負荷**：工作記憶容量有限，同時要處理的資訊太多會影響學習（Sweller, 1988；Sweller, van Merriënboer, & Paas, 2019）。
- **回饋**：有效的回饋回答「目標是什麼、現在如何、下一步怎麼做」，針對任務的回饋比針對個人的有效（Hattie & Timperley, 2007）；回饋要具體、聚焦，避免一次給太多（Shute, 2008）。Kluger 與 DeNisi（1996）提醒，有相當比例的研究中回饋反而讓表現變差，特別是把注意力轉到自我評價的回饋。
- **第二語言寫作的書面糾正**：Truscott（1996）主張文法糾正沒有幫助，引發長期爭論；Bitchener 與 Ferris（2012）整理之後的研究，結論是在許多條件下有幫助，但效果依錯誤類型與方式而異。Ellis 等人（2008）比較聚焦式與非聚焦式回饋，兩者都比沒有回饋好，彼此差異不明顯。
- **對話日記（dialogue journals）**：老師在學生的日記後面寫回應，回應內容而不是批改錯誤；這是英語教學中行之有年的做法（Peyton & Reed, 1990）。

### 在 DiaryLoop 怎麼用

- AI 筆友**先回應日記的內容**（2～4 句），像朋友回信，不說教。
- 英文回饋只在原文上標出**最重要的 3 個地方**，加上 1～2 個具體的優點；其他小地方收在「更多建議」，想看再展開。
- 回饋只針對文字，不評論使用者本人。
- 「只寫不批改」：今天只想寫，就不給任何英文回饋。

### 限制與注意

- **「3 個」是設計選擇，研究沒有證明 3 是最佳數字。** 研究支持的是「避免一次給太多」。
- 聚焦式回饋較好的證據並不一致；選擇聚焦是為了降低負荷、避免滿篇紅字造成挫折，其他建議仍可展開，不隱藏。
- AI 判斷「最重要」可能出錯。優先順序的規則寫在提示詞並納入 eval；文案提醒「AI 建議僅供參考」。

### 參考文獻

- Sweller, J. (1988). Cognitive load during problem solving: Effects on learning. _Cognitive Science, 12_(2), 257–285. https://doi.org/10.1207/s15516709cog1202_4
- Sweller, J., van Merriënboer, J. J. G., & Paas, F. (2019). Cognitive architecture and instructional design: 20 years later. _Educational Psychology Review, 31_(2), 261–292. https://doi.org/10.1007/s10648-019-09465-5
- Hattie, J., & Timperley, H. (2007). The power of feedback. _Review of Educational Research, 77_(1), 81–112. https://doi.org/10.3102/003465430298487
- Shute, V. J. (2008). Focus on formative feedback. _Review of Educational Research, 78_(1), 153–189. https://doi.org/10.3102/0034654307313795
- Kluger, A. N., & DeNisi, A. (1996). The effects of feedback interventions on performance: A historical review, a meta-analysis, and a preliminary feedback intervention theory. _Psychological Bulletin, 119_(2), 254–284. https://doi.org/10.1037/0033-2909.119.2.254
- Truscott, J. (1996). The case against grammar correction in L2 writing classes. _Language Learning, 46_(2), 327–369. https://doi.org/10.1111/j.1467-1770.1996.tb01238.x
- Bitchener, J., & Ferris, D. R. (2012). _Written corrective feedback in second language acquisition and writing_. Routledge.
- Ellis, R., Sheen, Y., Murakami, M., & Takashima, H. (2008). The effects of focused and unfocused written corrective feedback in an English as a foreign language context. _System, 36_(3), 353–371. https://doi.org/10.1016/j.system.2008.02.001
- Peyton, J. K., & Reed, L. (1990). _Dialogue journal writing with nonnative English speakers: A handbook for teachers_. TESOL.

## 8. 聊天中的糾正：不打斷對話

### 原理說明

- 第二語言習得研究中，對話裡的糾正回饋（例如重述 recast：對方用正確的說法自然地接話）整體有正面效果。Li（2010）的後設分析發現糾正回饋有中等效果，且效果在延宕測驗仍維持。
- 但重述常常不被學習者注意到；明確的糾正比較容易被注意，卻可能打斷對話、降低說話意願。

### 在 DiaryLoop 怎麼用

- AI 朋友照常回話，不在對話中說教。有錯的訊息出現細微標示，**點開才看**修正（使用者決定何時注意）。
- 聊天結束時集中總結 3 個錯誤與 3 個自然說法，加入單字本，之後間隔提取。

### 限制與注意

- 研究多在面對面或課堂互動中進行，文字聊天與 AI 對象的證據較少。
- 「點開才看」可能讓部分使用者完全不看修正；結束時的總結就是為了補上這一點。

### 參考文獻

- Li, S. (2010). The effectiveness of corrective feedback in SLA: A meta-analysis. _Language Learning, 60_(2), 309–365. https://doi.org/10.1111/j.1467-9922.2010.00561.x
- Lyster, R., & Ranta, L. (1997). Corrective feedback and learner uptake: Negotiation of form in communicative classrooms. _Studies in Second Language Acquisition, 19_(1), 37–66. https://doi.org/10.1017/S0272263197001034

## 9. 習慣養成：小習慣、if-then 計畫、習慣疊加

### 原理說明

- **習慣需要時間，漏一次影響不大**：Lally 等人（2010）追蹤受試者每天在同一情境做一個新行為，達到自動化的時間中位數約 66 天，個別差異很大（18～254 天）；**偶爾漏掉一次對習慣形成沒有明顯影響**。
- **習慣是情境線索與行為的連結**：Wood 與 Neal（2007）、Wood 與 Rünger（2016）的回顧指出，習慣是在穩定情境中重複行為後，由情境線索自動啟動的反應。
- **執行意圖（implementation intentions，if-then 計畫）**：Gollwitzer（1999）提出「如果遇到情境 X，我就做 Y」的計畫。Gollwitzer 與 Sheeran（2006）的後設分析發現，它對達成目標有中到大的效果（d 約 0.65）。
- **小習慣與習慣疊加**：Fogg（2019）的 _Tiny Habits_ 建議把新行為縮到很小，並接在既有的日常行為之後（例如「刷完牙之後」）。**這是實務框架，不是同儕審查研究**，但和上面「情境線索」「if-then」的研究方向一致。

### 在 DiaryLoop 怎麼用

- 「3 句就好」也算完成：累的時候 5 分鐘就能維持習慣。
- 設定提醒時，可以寫 if-then 計畫，例如「睡前刷完牙之後，我就寫三句日記」；選項提供常見的既有習慣（刷牙後、洗澡後、上床後），也可以自訂。
- 連續天數：漏一天不中斷（自動使用每週一次的補救），呼應 Lally 等人「漏一次影響不大」的發現，也避免「斷了就放棄」。

### 限制與注意

- 66 天是中位數，不是保證；文案不寫「21 天養成習慣」這類沒有根據的數字。
- 連續天數可能變成壓力或外在獎勵。設計上不懲罰中斷、不做排行榜、不公開分享連續天數。

### 參考文獻

- Lally, P., van Jaarsveld, C. H. M., Potts, H. W. W., & Wardle, J. (2010). How are habits formed: Modelling habit formation in the real world. _European Journal of Social Psychology, 40_(6), 998–1009. https://doi.org/10.1002/ejsp.674
- Wood, W., & Neal, D. T. (2007). A new look at habits and the habit–goal interface. _Psychological Review, 114_(4), 843–863. https://doi.org/10.1037/0033-295X.114.4.843
- Wood, W., & Rünger, D. (2016). Psychology of habit. _Annual Review of Psychology, 67_, 289–314. https://doi.org/10.1146/annurev-psych-122414-033417
- Gollwitzer, P. M. (1999). Implementation intentions: Strong effects of simple plans. _American Psychologist, 54_(7), 493–503. https://doi.org/10.1037/0003-066X.54.7.493
- Gollwitzer, P. M., & Sheeran, P. (2006). Implementation intentions and goal achievement: A meta-analysis of effects and processes. _Advances in Experimental Social Psychology, 38_, 69–119. https://doi.org/10.1016/S0065-2601(06)38002-1
- Fogg, B. J. (2019). _Tiny habits: The small changes that change everything_. Houghton Mifflin Harcourt.（實務書籍，非同儕審查研究）

## 10. 表達性書寫（expressive writing）

### 原理說明

- Pennebaker 與 Beall（1986）請受試者連續幾天寫下對自己重要的情緒經驗，之後幾個月的就醫次數較少。Pennebaker（1997）整理後續研究，認為寫下情緒經驗對部分人的身心健康有幫助。
- Frattaroli（2006）的後設分析（146 個研究）發現整體效果**正面但很小**（r 約 0.08），而且依條件差異很大。

### 在 DiaryLoop 怎麼用

- 寫作提示包含「今天的心情」「一件小事」「一個想法」等貼近自己生活的題目，而不是考試作文題。
- 寫自己的事是寫日記的動機來源：AI 筆友先回應內容，讓使用者覺得「有人在聽」。

### 限制與注意

- **效果很小，而且 DiaryLoop 不是心理治療。** 不宣稱寫日記能改善心理健康、減壓或療癒。
- 原始研究多是用母語寫創傷經驗；用第二語言寫日常生活，是不同的情境。
- 使用者可能寫下低落或自我傷害的內容。這時 AI 先溫和回應、不診斷、不給任何方法資訊，提供求助資源（台灣 1925 安心專線、美國 988），而且不做英文批改（M4 的安全規則與 eval）。

### 參考文獻

- Pennebaker, J. W., & Beall, S. K. (1986). Confronting a traumatic event: Toward an understanding of inhibition and disease. _Journal of Abnormal Psychology, 95_(3), 274–281. https://doi.org/10.1037/0021-843X.95.3.274
- Pennebaker, J. W. (1997). Writing about emotional experiences as a therapeutic process. _Psychological Science, 8_(3), 162–166. https://doi.org/10.1111/j.1467-9280.1997.tb00403.x
- Frattaroli, J. (2006). Experimental disclosure and its moderators: A meta-analysis. _Psychological Bulletin, 132_(6), 823–865. https://doi.org/10.1037/0033-2909.132.6.823

## 不使用的神經迷思

以下說法流傳很廣，但缺乏證據或已被研究否定。產品、介面文字、行銷文案都**不可以使用**，也不要用類似的說法暗示。

| 迷思                                             | 為什麼不用                                                                                             |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| 左腦型／右腦型學習者                             | Nielsen 等人（2013）的腦造影研究沒有發現個人整體偏向某一側的證據。                                     |
| 學習風格（視覺型、聽覺型……），依風格教學效果較好 | Pashler 等人（2008）發現，幾乎沒有符合嚴格設計的證據支持「依學習風格配對教學」。                       |
| 「人只用了大腦的 10%」                           | 沒有科學根據。                                                                                         |
| 莫札特效應                                       | 後設分析不支持有特定的「莫札特效應」（Chabris, 1999；Pietschnig 等人, 2010）。                         |
| 「21 天養成習慣」                                | 沒有研究支持這個數字；Lally 等人（2010）的中位數約 66 天，個別差異很大。                               |
| 「睡覺時聽英文就能學會」（睡眠學習新內容）       | 目前沒有證據顯示睡眠中能學會新的外語詞彙並在醒後使用；DiaryLoop 只建議**睡前**回顧，不建議睡眠中播放。 |

也避免：「開發右腦」「激活大腦潛能」「黃金學習期一過就學不會」「釋放多巴胺讓你愛上寫作」，以及沒有出處的腦區或神經傳導物質說明。Dekker 等人（2012）發現這類迷思在教師之間也很常見。

### 參考文獻

- Pashler, H., McDaniel, M., Rohrer, D., & Bjork, R. (2008). Learning styles: Concepts and evidence. _Psychological Science in the Public Interest, 9_(3), 105–119. https://doi.org/10.1111/j.1539-6053.2009.01038.x
- Nielsen, J. A., Zielinski, B. A., Ferguson, M. A., Lainhart, J. E., & Anderson, J. S. (2013). An evaluation of the left-brain vs. right-brain hypothesis with resting state functional connectivity magnetic resonance imaging. _PLoS ONE, 8_(8), e71275. https://doi.org/10.1371/journal.pone.0071275
- Chabris, C. F. (1999). Prelude or requiem for the "Mozart effect"? _Nature, 400_(6747), 826–827. https://doi.org/10.1038/23608
- Pietschnig, J., Voracek, M., & Formann, A. K. (2010). Mozart effect–Shmozart effect: A meta-analysis. _Intelligence, 38_(3), 314–323. https://doi.org/10.1016/j.intell.2010.03.001
- Dekker, S., Lee, N. C., Howard-Jones, P., & Jolles, J. (2012). Neuromyths in education: Prevalence and correlates of misconceptions among teachers. _Frontiers in Psychology, 3_, 429. https://doi.org/10.3389/fpsyg.2012.00429

## 產品文案的規則

1. **用溫和、準確的動詞。** 可以說「研究顯示……可能有幫助」「這種練習方式有研究支持」；不可以說「保證進步」「科學證明」「最有效的方法」。
2. **不承諾進步幅度**，不寫「30 天英文進步 30%」。研究的效果量是一群人的平均，不能換成個人保證。
3. **使用者自己的數據可以顯示，但要說清楚是什麼**（例如「平均句長從 9 個字變成 12 個字」），不把它說成整體英文能力的提升。
4. **引用研究時附出處**（作者與年份），只引用這份文件列出的研究；要新增時先補進這份文件。
5. **說明「當下比較難」是正常的**，但不說「越難越有效」。
6. **不使用神經迷思**，也不用「大腦」「神經」包裝沒有根據的說法。
7. **AI 不是權威**：文案提醒「AI 建議僅供參考」。
8. **不貶低、不施壓**：中斷連續天數不責備；深夜不催促寫日記。
9. **不宣稱心理健康效果**：DiaryLoop 不是心理治療或諮商。
10. 介面文字一律放在翻譯檔，英文版同樣遵守以上規則。
