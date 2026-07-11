# ChipForge ⚒ 8BIT 晶片音樂工坊

瀏覽器裡的 8-bit / chiptune 音樂鍛造工坊。零依賴、零打包工具——純 ES Modules + Web Audio API。

## 啟動

```bash
python -m http.server 8213 --directory D:/claude研究/chipforge
# 開啟 http://localhost:8213
```

（必須經 http 伺服器開啟，`file://` 無法載入 ES modules 與 AudioWorklet）

## 功能

- **自動鍛造**：17 個場景主題（戰鬥、魔王、雪原、和風、EDM…），點主題即作曲
- **總監系統**：一次生成 1~14 首候選 → 12 項樂理啟發式評分 → 挑 3 首差異最大的給你選
- **7 個屬性滑桿**：音符密度／節奏密度／速度／戲劇性／明暗／記憶點／滑順度
- **Piano-roll 編輯**：4 音軌（方波主旋律、方波和聲、三角波貝斯、噪音）+ 3 鼓道、長音、滑音、重音、和弦引導光
- **混音台**：音量/靜音/獨奏、duty cycle、PWM、顫音、回音、真 bitcrush（AudioWorklet）、搖擺、人性化
- **匯出**：WAV（雙循環離線渲染）、MIDI、JSON 存讀、**分享連結**（整首曲子壓縮進網址）
- 種子化亂數：同一 SEED 永遠鍛出同一首曲，「變奏」= 同種子加鹽

## 架構

```
index.html / css/style.css     像素風 UI（CRT 掃描線、Fusion Pixel 繁中字體、Press Start 2P）
js/theory.js                   音名、和弦、音階、種子化 RNG
js/themes.js                   主題資料包（純資料，加主題零程式碼）+ 曲式規劃
js/composer.js                 生成管線：段落 → 和弦 → 旋律/和聲/貝斯/鼓 → 修復通道
js/director.js                 評分（動機/hook/樂句/終止式/能量/對比 − 亂/悶/刺耳）+ 多樣性挑選
js/synth.js                    NES 風合成器（PeriodicWave duty 方波、合成鼓、echo bus）
js/scheduler.js                lookahead 排程器（即時與離線渲染共用）
js/state.js                    歌曲模型、undo/redo、localStorage 自動存檔
js/exporter.js                 WAV/MIDI/JSON/URL 分享
js/ui.js                       canvas piano-roll + 爐芯獸吉祥物（程序像素繪製）
worklet/bitcrusher.js          真 8-bit 降解（sample-hold + 量化）
fonts/                         Fusion Pixel 12px（繁中，OFL）+ Press Start 2P
```

## 致敬與參考

- 生成→修復→評分 pipeline 的靈感來自 [EASY 8BIT EDITOR](https://amix-design.com/tl/tool-s-8bit/)（AMIX），全部重新實作並強化
- 「曲子活在網址裡」的分享概念來自 [BeepBox](https://beepbox.org/)
- 字體：[Fusion Pixel Font](https://github.com/TakWolf/fusion-pixel-font)（OFL）、Press Start 2P（OFL）
