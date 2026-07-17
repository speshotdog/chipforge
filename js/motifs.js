// 黃金動機庫：頻道的旋律身分（Undertale 式 Leitmotif 策略）
// 每句動機 = 16 步網格（一小節 16 分音符）上的節奏 + 相對音高輪廓
//   rhythm:  起音步位（0~15，遞增，必含 0）
//   contour: 與第一個音的半音差（第一個 = 0），引擎會貼合當下和弦/音階
// 篩選流程：候選批次（tools/motif_audition.py 渲染 demo）→ 人耳試聽 → 錄入
// 標準：「隔天還記得」才算 keeper；provisional = 風格對但還差口氣，待改良
//
// === 2026-07-17 第一批（Claude 作曲 13 句）用戶裁決 ===
// 淘汰：dawn-rise / far-memory / small-quest / star-cradle / after-rain /
//       skyward-question / deep-toll
// 及格線（暫收）：hero-return / leap-of-faith / chatter-run
// 風格對但差點意思（待改良變體）：okami-flow / lullaby-fall / neon-bounce
export const MOTIF_LIBRARY = [
  { id: 'hero-return', name: '勇者歸來', mood: 'heroic',
    rhythm: [0, 2, 3, 4, 8, 12], contour: [0, 0, 0, 5, 4, 7] },     // 三連同音號角→跳進→峰頂
  { id: 'leap-of-faith', name: '信仰之躍', mood: 'epic',
    rhythm: [0, 4, 6, 12], contour: [0, 12, 10, 7] },               // 開頭八度大跳再級進落下
  { id: 'chatter-run', name: '衝刺跑句', mood: 'energetic',
    rhythm: [0, 1, 2, 3, 4, 8, 12], contour: [0, 2, 4, 5, 7, 9, 7] }, // 16 分衝刺→登頂→回音
  { id: 'okami-flow', name: '山泉', mood: 'wafu', provisional: true,
    rhythm: [0, 2, 6, 8, 12, 14], contour: [0, 3, 5, 3, 0, -2] },   // 五聲流水（待改良）
  { id: 'lullaby-fall', name: '搖籃曲', mood: 'gentle', provisional: true,
    rhythm: [0, 6, 8, 12, 14], contour: [0, 4, 2, 0, -1] },         // 附點搖籃（待改良）
  { id: 'neon-bounce', name: '霓虹彈跳', mood: 'city', provisional: true,
    rhythm: [0, 3, 6, 8, 11, 14], contour: [0, 0, -2, 0, 3, 0] },   // 3-3-2 切分（待改良）
];
