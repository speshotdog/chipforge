// 主題資料包：每個主題 = 純資料（BPM 範圍、音階、和弦進行池、節奏池、貝斯型、鼓型）
// rhythms: 半小節(8步)內的起音位置。bassPat: [步位, 音型] r=根音 5=五度 o=高八度 3=三度
export const THEMES = {
  bright: {
    label: '明亮草原', icon: '☀', bpm: [128, 160], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['C', 'F', 'G', 'C'], ['C', 'Am', 'F', 'G'], ['F', 'G', 'C', 'C'], ['C', 'G', 'Am', 'F']],
    rhythms: [[0, 4], [0, 4, 6], [0, 2, 4, 6], [0, 2, 3, 4, 6], [0, 2, 4, 5, 6], [0, 2, 4, 6, 7]],
    bassPat: [[0, 'r'], [4, '5'], [6, 'r']],
    drums: { kick: [0, 8], snare: [4, 12] }, fill: true
  },
  sad: {
    label: '離別之淚', icon: '☂', bpm: [76, 102], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['Am', 'F', 'C', 'G'], ['Am', 'Dm', 'G', 'Am'], ['Am', 'F', 'Em', 'Am'], ['F', 'G', 'Em', 'Am']],
    rhythms: [[0], [0, 4], [0, 6], [0, 4, 6], [0, 3, 6], [0, 2, 4, 6]],
    bassPat: [[0, 'r'], [4, '5']],
    drums: { kick: [0, 10], snare: [8] }, fill: false, minor: true
  },
  battle: {
    label: '遭遇戰鬥', icon: '⚔', bpm: [156, 186], scale: [9, 11, 0, 2, 4, 5, 8],
    progs: [['Am', 'Am', 'F', 'E'], ['Am', 'G', 'F', 'E'], ['Am', 'F', 'G', 'Am'], ['Dm', 'Am', 'E', 'Am']],
    rhythms: [[0, 4], [0, 2, 4, 6], [0, 1, 2, 4, 6], [0, 2, 3, 4, 6, 7], [0, 2, 4, 5, 6, 7]],
    bassPat: [[0, 'r'], [2, 'r'], [4, '5'], [6, 'r'], [7, '5']],
    drums: { kick: [0, 6, 8, 14], snare: [4, 12] }, fill: true, minor: true
  },
  lastboss: {
    label: '最終魔王', icon: '☠', bpm: [162, 192], scale: [9, 11, 0, 2, 4, 5, 8],
    progs: [['Am', 'Bb', 'Am', 'E'], ['Am', 'G', 'Bb', 'E'], ['Dm', 'Bb', 'E', 'Am'], ['Am', 'Bb', 'G', 'E']],
    rhythms: [[0, 2, 4, 6], [0, 1, 2, 4, 6], [0, 2, 3, 4, 6, 7], [0, 1, 2, 4, 5, 6, 7]],
    bassPat: [[0, 'r'], [1, 'r'], [2, 'r'], [3, 'r'], [4, '5'], [5, 'r'], [6, 'r'], [7, '5']],
    drums: { kick: [0, 4, 8, 12], snare: [4, 12] }, fill: true, minor: true, keepClash: true
  },
  temple: {
    label: '古老神殿', icon: '⛩', bpm: [84, 110], scale: [9, 11, 0, 2, 4, 6, 7],
    progs: [['Am', 'G', 'Am', 'Em'], ['Am', 'D', 'Am', 'G'], ['Em', 'D', 'Am', 'Am'], ['Am', 'Bm', 'G', 'Am']],
    rhythms: [[0], [0, 4], [0, 6], [0, 3, 6], [0, 2, 6]],
    bassPat: [[0, 'r'], [6, 'r']],
    drums: { kick: [0, 10], snare: [] }, fill: false, minor: true
  },
  cave: {
    label: '幽暗洞窟', icon: '◆', bpm: [88, 112], scale: [9, 11, 0, 2, 4, 5, 7],
    progs: [['Am', 'Em', 'Am', 'Em'], ['Am', 'G', 'Em', 'Am'], ['Dm', 'Am', 'Em', 'Am']],
    rhythms: [[0], [0, 6], [0, 4], [0, 3, 6], [0, 4, 7]],
    bassPat: [[0, 'r'], [3, 'r'], [6, '5']],
    drums: { kick: [0, 7, 8], snare: [12] }, fill: false, minor: true
  },
  snow: {
    label: '靜謐雪原', icon: '❄', bpm: [92, 120], scale: [0, 2, 4, 6, 7, 9, 11],
    progs: [['C', 'G', 'Am', 'Em'], ['Cmaj7', 'Fmaj7', 'Em7', 'Am7'], ['F', 'C', 'G', 'C'], ['Am', 'F', 'G', 'C']],
    rhythms: [[0, 4], [0, 6], [0, 4, 6], [0, 2, 6], [0, 3, 4]],
    bassPat: [[0, 'r'], [4, '5']],
    drums: { kick: [0, 8], snare: [12] }, fill: false
  },
  desert: {
    label: '灼熱沙漠', icon: '♨', bpm: [108, 138], scale: [9, 10, 1, 2, 4, 5, 8],
    progs: [['Am', 'Bb', 'Am', 'E'], ['Dm', 'Am', 'Bb', 'Am'], ['Am', 'Bb', 'E', 'Am']],
    rhythms: [[0, 3, 6], [0, 2, 3, 6], [0, 3, 4, 6], [0, 1, 3, 6], [0, 2, 4, 6, 7]],
    bassPat: [[0, 'r'], [3, 'r'], [4, '5'], [7, 'r']],
    drums: { kick: [0, 6, 8], snare: [4, 12] }, fill: true, minor: true, keepClash: true
  },
  wafu: {
    label: '和風庭園', icon: '❀', bpm: [96, 126], scale: [0, 2, 4, 7, 9],
    progs: [['Am', 'G', 'Am', 'Em'], ['Am', 'Em', 'G', 'Am'], ['C', 'G', 'Am', 'Am']],
    rhythms: [[0, 4], [0, 3, 6], [0, 4, 6], [0, 2, 4], [0, 4, 5]],
    bassPat: [[0, 'r'], [6, '5']],
    drums: { kick: [0, 8], snare: [12] }, fill: false
  },
  space: {
    label: '無垠宇宙', icon: '✦', bpm: [104, 136], scale: [0, 2, 4, 6, 8, 10],
    progs: [['C', 'D', 'E', 'C'], ['C', 'Bb', 'D', 'C'], ['Am', 'D', 'C', 'E']],
    rhythms: [[0], [0, 4], [0, 6], [0, 4, 6], [0, 2, 4, 6]],
    bassPat: [[0, 'r'], [4, 'o']],
    drums: { kick: [0, 8], snare: [4, 12] }, fill: false, keepClash: true
  },
  chase: {
    label: '全速追逐', icon: '➤', bpm: [168, 196], scale: [9, 11, 0, 2, 4, 6, 7],
    progs: [['Am', 'G', 'Am', 'G'], ['Am', 'C', 'G', 'Am'], ['Dm', 'Am', 'G', 'Am']],
    rhythms: [[0, 2, 4, 6], [0, 1, 2, 4, 6], [0, 2, 4, 5, 6], [0, 2, 3, 4, 6, 7]],
    bassPat: [[0, 'r'], [1, 'o'], [2, 'r'], [4, '5'], [5, 'o'], [6, 'r']],
    drums: { kick: [0, 4, 8, 12], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: true, minor: true
  },
  beach: {
    label: '碧海沙灘', icon: '~', bpm: [112, 138], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['Cmaj7', 'Fmaj7', 'Dm7', 'G7'], ['C', 'Am7', 'Dm7', 'G7'], ['Fmaj7', 'Em7', 'Dm7', 'C']],
    rhythms: [[0, 3, 6], [0, 3, 4, 7], [0, 2, 3, 6], [0, 3, 5, 6]],
    bassPat: [[0, 'r'], [3, '5'], [4, 'r'], [7, '5']],
    drums: { kick: [0, 6, 8, 14], snare: [4, 12] }, fill: false
  },
  pastoral: {
    label: '田園牧歌', icon: '♣', bpm: [100, 128], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['C', 'F', 'C', 'G'], ['C', 'Dm', 'G', 'C'], ['F', 'C', 'Dm', 'G']],
    rhythms: [[0, 4], [0, 2, 4], [0, 4, 6], [0, 2, 4, 6], [0, 3, 4, 6]],
    bassPat: [[0, 'r'], [2, '5'], [4, 'r'], [6, '5']],
    drums: { kick: [0, 8], snare: [4, 12] }, fill: false
  },
  title: {
    label: '標題畫面', icon: '◈', bpm: [96, 124], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['C', 'G', 'Am', 'F'], ['C', 'Em', 'F', 'G'], ['Am', 'F', 'C', 'G']],
    rhythms: [[0, 4], [0, 4, 6], [0, 2, 4], [0, 6], [0, 2, 4, 6]],
    bassPat: [[0, 'r'], [4, '5'], [6, 'o']],
    drums: { kick: [0, 8], snare: [12] }, fill: true
  },
  victory: {
    label: '勝利凱旋', icon: '★', bpm: [132, 160], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['C', 'F', 'G', 'C'], ['C', 'G', 'C', 'C'], ['F', 'G', 'C', 'G']],
    rhythms: [[0, 2, 3], [0, 2, 3, 4], [0, 1, 2, 4], [0, 2, 4, 6], [0, 2, 3, 4, 6]],
    bassPat: [[0, 'r'], [2, 'r'], [4, '5'], [6, 'r']],
    drums: { kick: [0, 4, 8], snare: [4, 12] }, fill: true, jingle: true
  },
  gameover: {
    label: '遊戲結束', icon: '✝', bpm: [66, 88], scale: [9, 11, 0, 2, 4, 5, 8],
    progs: [['Am', 'Dm', 'E', 'Am'], ['Am', 'F', 'E', 'Am'], ['Dm', 'Am', 'E', 'Am']],
    rhythms: [[0], [0, 4], [0, 6], [0, 4, 6]],
    bassPat: [[0, 'r']],
    drums: { kick: [0], snare: [] }, fill: false, minor: true, jingle: true
  },
  edm: {
    label: '電音派對', icon: '♫', bpm: [124, 132], scale: [9, 11, 0, 2, 4, 5, 7],
    progs: [['Am', 'F', 'C', 'G'], ['Am', 'C', 'F', 'G'], ['Am', 'G', 'F', 'F']],
    rhythms: [[0, 2, 4, 6], [0, 3, 4, 7], [0, 2, 4, 6, 7], [0, 1, 4, 5], [0, 3, 6, 7]],
    bassPat: [[0, 'r'], [2, 'o'], [4, 'r'], [6, 'o']],
    drums: { kick: [0, 4, 8, 12], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: true, minor: true
  },
  arcade: {
    label: '街機對戰', icon: '◎', bpm: [150, 178], scale: [0, 2, 4, 5, 7, 9, 10],
    progs: [['C', 'Bb', 'F', 'C'], ['C', 'F', 'Bb', 'G'], ['C', 'G', 'Bb', 'F']],
    rhythms: [[0, 2, 4, 6], [0, 1, 2, 4, 6], [0, 2, 4, 5, 6], [0, 2, 3, 4, 6, 7]],
    bassPat: [[0, 'r'], [2, 'o'], [4, '5'], [6, 'o']],
    drums: { kick: [0, 6, 8, 14], snare: [4, 12], hat: [2, 10] }, fill: true
  },
  forest: {
    label: '神秘森林', icon: '♠', bpm: [90, 118], scale: [9, 11, 0, 2, 4, 6, 7],
    progs: [['Am', 'G', 'D', 'Am'], ['Am', 'Em', 'D', 'Am'], ['Am', 'Bm', 'D', 'Em']],
    rhythms: [[0, 4], [0, 3, 6], [0, 4, 6], [0, 2, 5], [0, 3, 4, 6]],
    bassPat: [[0, 'r'], [4, '5'], [6, 'o']],
    drums: { kick: [0, 8], snare: [12], hat: [4] }, fill: false, minor: true
  },
  pirate: {
    label: '海盜船歌', icon: '☸', bpm: [132, 162], scale: [9, 11, 0, 2, 4, 5, 7],
    progs: [['Am', 'G', 'Am', 'Em'], ['Am', 'F', 'G', 'Am'], ['Am', 'C', 'G', 'Am']],
    rhythms: [[0, 3, 4], [0, 3, 4, 7], [0, 2, 3, 6], [0, 3, 6, 7], [0, 1, 3, 4, 6]],
    bassPat: [[0, 'r'], [3, '5'], [4, 'r'], [6, '5']],
    drums: { kick: [0, 6, 8], snare: [4, 12] }, fill: true, minor: true
  },
  factory: {
    label: '機械工廠', icon: '⚙', bpm: [118, 144], scale: [0, 2, 3, 5, 7, 8, 10],
    progs: [['Am', 'Am', 'Gm', 'Am'], ['Am', 'Bb', 'Gm', 'Am'], ['Dm', 'Am', 'Gm', 'Am']],
    rhythms: [[0, 2, 4, 6], [0, 1, 4, 5], [0, 2, 4, 6, 7], [0, 3, 4, 7]],
    bassPat: [[0, 'r'], [1, 'r'], [4, 'r'], [5, 'r']],
    drums: { kick: [0, 4, 8, 12], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: false, minor: true, keepClash: true
  },
  skycity: {
    label: '天空之城', icon: '☁', bpm: [108, 136], scale: [0, 2, 4, 6, 7, 9, 11],
    progs: [['C', 'D', 'G', 'C'], ['Cmaj7', 'D', 'Em7', 'G'], ['C', 'G', 'D', 'C']],
    rhythms: [[0, 4], [0, 4, 6], [0, 2, 4], [0, 3, 6], [0, 2, 4, 6]],
    bassPat: [[0, 'r'], [4, '5'], [6, 'o']],
    drums: { kick: [0, 8], snare: [4, 12] }, fill: true
  },
  dungeon: {
    label: '地下迷宮', icon: '▦', bpm: [80, 104], scale: [9, 10, 0, 2, 4, 5, 7],
    progs: [['Am', 'Bb', 'Am', 'Am'], ['Am', 'Gm', 'Bb', 'Am'], ['Dm', 'Bb', 'Am', 'Am']],
    rhythms: [[0], [0, 6], [0, 4], [0, 3], [0, 4, 7]],
    bassPat: [[0, 'r'], [6, 'r']],
    drums: { kick: [0, 9], snare: [] }, fill: false, minor: true, keepClash: true
  },
  festival: {
    label: '祭典之夜', icon: '✺', bpm: [140, 168], scale: [0, 2, 4, 7, 9],
    progs: [['C', 'Am', 'C', 'G'], ['C', 'F', 'G', 'C'], ['Am', 'C', 'G', 'C']],
    rhythms: [[0, 2, 3, 4], [0, 2, 4, 6], [0, 1, 2, 4, 6], [0, 2, 3, 4, 6]],
    bassPat: [[0, 'r'], [2, '5'], [4, 'r'], [6, '5']],
    drums: { kick: [0, 4, 8, 12], snare: [4, 10, 12], hat: [2, 6, 14] }, fill: true
  },
  rainynight: {
    label: '雨夜咖啡', icon: '☕', bpm: [72, 96], scale: [0, 2, 4, 5, 7, 9, 11],
    tone: { lead: 'piano' },
    progs: [['Cmaj7', 'Am7', 'Dm7', 'G7'], ['Fmaj7', 'Em7', 'Dm7', 'Cmaj7'], ['Am7', 'Dm7', 'G7', 'Cmaj7']],
    rhythms: [[0, 3], [0, 4, 7], [0, 3, 6], [0, 2, 5], [0, 4]],
    bassPat: [[0, 'r'], [4, '5'], [7, '3']],
    drums: { kick: [0, 10], snare: [8], hat: [4, 12] }, fill: false
  },
  // ===== 大自然（追加）=====
  swamp: {
    label: '迷霧沼澤', icon: '≈', bpm: [82, 106], scale: [9, 11, 0, 2, 4, 5, 7],
    progs: [['Am', 'Em', 'Dm', 'Am'], ['Am', 'Dm', 'Em', 'Am'], ['Dm', 'Am', 'Em', 'Em']],
    rhythms: [[0], [0, 5], [0, 4], [0, 3, 6], [0, 4, 7]],
    bassPat: [[0, 'r'], [5, '5']],
    drums: { kick: [0, 11], snare: [], hat: [6] }, fill: false, minor: true
  },
  mountain: {
    label: '高山霜峰', icon: '△', bpm: [88, 116], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['C', 'G', 'F', 'C'], ['C', 'F', 'Am', 'G'], ['F', 'C', 'G', 'C']],
    rhythms: [[0], [0, 4], [0, 6], [0, 4, 6], [0, 2, 4]],
    bassPat: [[0, 'r'], [4, '5'], [6, 'o']],
    drums: { kick: [0, 8], snare: [12] }, fill: false
  },
  firefly: {
    label: '螢火蟲夜', icon: '✧', bpm: [92, 116], scale: [0, 2, 4, 7, 9],
    progs: [['Am', 'C', 'G', 'Am'], ['C', 'Am', 'Em', 'G'], ['Am', 'Em', 'C', 'G']],
    rhythms: [[0, 4], [0, 3, 6], [0, 5], [0, 2, 6], [0, 4, 6]],
    bassPat: [[0, 'r'], [6, 'o']],
    drums: { kick: [0, 8], snare: [], hat: [4, 12] }, fill: false
  },
  // ===== 都市（追加）=====
  neon: {
    label: '霓虹街頭', icon: '◪', bpm: [112, 136], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['Fmaj7', 'Em7', 'Dm7', 'Cmaj7'], ['Am7', 'Dm7', 'G7', 'Cmaj7'], ['Cmaj7', 'Am7', 'Fmaj7', 'G7']],
    rhythms: [[0, 3, 6], [0, 2, 4, 7], [0, 3, 4, 6], [0, 2, 5, 6]],
    bassPat: [[0, 'r'], [3, 'o'], [4, 'r'], [7, '5']],
    drums: { kick: [0, 6, 8, 14], snare: [4, 12], hat: [2, 10] }, fill: true
  },
  station: {
    label: '車站月台', icon: '▤', bpm: [96, 120], scale: [0, 2, 4, 5, 7, 9, 11],
    tone: { lead: 'piano' },
    progs: [['C', 'Em7', 'F', 'G7'], ['C', 'Am7', 'F', 'G'], ['Fmaj7', 'G', 'Em7', 'Am7']],
    rhythms: [[0, 4], [0, 4, 6], [0, 3, 6], [0, 2, 4, 6]],
    bassPat: [[0, 'r'], [4, '5'], [6, 'r']],
    drums: { kick: [0, 8], snare: [4, 12], hat: [6, 14] }, fill: false
  },
  rooftop: {
    label: '高樓天台', icon: '☾', bpm: [100, 124], scale: [9, 11, 0, 2, 4, 5, 7],
    progs: [['Am7', 'Dm7', 'G', 'Cmaj7'], ['Am7', 'Fmaj7', 'Dm7', 'Em7'], ['Dm7', 'Em7', 'Am7', 'Am7']],
    rhythms: [[0, 3], [0, 4, 7], [0, 3, 6], [0, 5]],
    bassPat: [[0, 'r'], [4, '5'], [7, 'o']],
    drums: { kick: [0, 10], snare: [8], hat: [4, 12] }, fill: false, minor: true
  },
  // ===== 村莊（追加）=====
  fishing: {
    label: '漁村碼頭', icon: '⚓', bpm: [104, 132], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['C', 'F', 'C', 'G'], ['C', 'G', 'F', 'C'], ['F', 'G', 'C', 'Am']],
    rhythms: [[0, 3, 4], [0, 2, 4, 6], [0, 3, 6], [0, 4, 6]],
    bassPat: [[0, 'r'], [3, '5'], [4, 'r'], [7, '5']],
    drums: { kick: [0, 6, 8], snare: [4, 12] }, fill: false
  },
  market: {
    label: '市集喧囂', icon: '♒', bpm: [132, 160], scale: [0, 2, 4, 5, 7, 9, 10],
    progs: [['C', 'Bb', 'C', 'G'], ['C', 'F', 'Bb', 'C'], ['C', 'G', 'Bb', 'F']],
    rhythms: [[0, 2, 4, 6], [0, 3, 4, 7], [0, 1, 4, 6], [0, 2, 3, 6]],
    bassPat: [[0, 'r'], [2, '5'], [4, 'r'], [6, '5']],
    drums: { kick: [0, 4, 8, 12], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: true
  },
  hamlet: {
    label: '山中小屋', icon: '⌂', bpm: [92, 116], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['C', 'F', 'G', 'C'], ['C', 'Dm', 'G', 'C'], ['Am', 'F', 'C', 'G']],
    rhythms: [[0, 3], [0, 3, 6], [0, 4], [0, 2, 4]],
    bassPat: [[0, 'r'], [3, '5'], [6, 'r']],
    drums: { kick: [0, 8], snare: [12] }, fill: false
  },
  // ===== 特殊設施（追加）=====
  library: {
    label: '魔法圖書館', icon: '✎', bpm: [88, 110], scale: [0, 2, 4, 6, 7, 9, 11],
    progs: [['C', 'D', 'Em', 'C'], ['Am', 'D', 'G', 'Em'], ['C', 'Em', 'D', 'G']],
    rhythms: [[0, 4], [0, 3, 6], [0, 2, 6], [0, 5]],
    bassPat: [[0, 'r'], [6, 'o']],
    drums: { kick: [0, 8], snare: [], hat: [4, 12] }, fill: false
  },
  alchemy: {
    label: '鍊金工房', icon: '⚗', bpm: [108, 136], scale: [9, 11, 0, 2, 4, 6, 7],
    progs: [['Am', 'D', 'Am', 'G'], ['Am', 'Bm', 'D', 'Am'], ['Em', 'D', 'Am', 'Bm']],
    rhythms: [[0, 3, 6], [0, 2, 4, 7], [0, 3, 4], [0, 1, 4, 6]],
    bassPat: [[0, 'r'], [3, '5'], [4, 'r'], [6, 'o']],
    drums: { kick: [0, 6, 8], snare: [12], hat: [2, 10] }, fill: false, minor: true
  },
  casino: {
    label: '地下賭場', icon: '♦', bpm: [118, 144], scale: [0, 2, 3, 4, 7, 9, 10],
    progs: [['C7', 'F7', 'C7', 'G7'], ['C7', 'A7', 'Dm7', 'G7'], ['F7', 'C7', 'G7', 'C7']],
    rhythms: [[0, 3, 4], [0, 2, 3, 6], [0, 3, 6, 7], [0, 1, 4, 5]],
    bassPat: [[0, 'r'], [2, '3'], [4, '5'], [6, '3']],
    drums: { kick: [0, 8], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: true, keepClash: true
  },
  prison: {
    label: '監獄深處', icon: '▩', bpm: [76, 96], scale: [9, 10, 0, 2, 4, 5, 7],
    progs: [['Am', 'Am', 'Bb', 'Am'], ['Am', 'Gm', 'Am', 'Am'], ['Dm', 'Am', 'Bb', 'Am']],
    rhythms: [[0], [0, 6], [0, 4], [0, 7]],
    bassPat: [[0, 'r']],
    drums: { kick: [0, 12], snare: [] }, fill: false, minor: true, keepClash: true
  },
  // ===== 室內（追加）=====
  tavern: {
    label: '酒館夜談', icon: '♨', bpm: [116, 144], scale: [0, 2, 4, 5, 7, 9, 10],
    progs: [['C', 'F', 'G', 'C'], ['C', 'Bb', 'F', 'C'], ['G', 'C', 'F', 'G']],
    rhythms: [[0, 3, 4], [0, 2, 3, 6], [0, 3, 4, 6], [0, 2, 4, 6]],
    bassPat: [[0, 'r'], [3, '5'], [4, 'r'], [6, '5']],
    drums: { kick: [0, 6, 8], snare: [4, 12] }, fill: true
  },
  ballroom: {
    label: '城堡舞會', icon: '❦', bpm: [100, 126], scale: [0, 2, 4, 5, 7, 9, 11],
    tone: { lead: 'piano' },
    progs: [['C', 'G', 'Am', 'G'], ['C', 'Em', 'F', 'G'], ['F', 'G', 'C', 'Am']],
    rhythms: [[0, 3, 6], [0, 3], [0, 3, 5], [0, 2, 4, 6]],
    bassPat: [[0, 'r'], [3, '5'], [6, '5']],
    drums: { kick: [0, 8], snare: [4, 12], hat: [2, 10] }, fill: false
  },
  shop: {
    label: '溫馨小店', icon: '✿', bpm: [108, 132], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['C', 'Am', 'F', 'G'], ['C', 'F', 'Dm', 'G'], ['F', 'G', 'Em', 'Am']],
    rhythms: [[0, 3, 6], [0, 2, 4], [0, 4, 6], [0, 3, 4]],
    bassPat: [[0, 'r'], [4, '5'], [6, 'r']],
    drums: { kick: [0, 8], snare: [12], hat: [4] }, fill: false
  },
  musicbox: {
    label: '音樂盒回憶', icon: '♩', bpm: [66, 88], scale: [0, 2, 4, 5, 7, 9, 11],
    tone: { lead: 'piano' },
    progs: [['C', 'Am', 'F', 'G'], ['Am', 'F', 'C', 'G'], ['C', 'Em', 'Am', 'F']],
    rhythms: [[0, 4], [0, 3, 6], [0, 6], [0, 2, 4]],
    bassPat: [[0, 'r'], [6, 'o']],
    drums: { kick: [], snare: [] }, fill: false
  },
  // ===== 科幻世界（追加）=====
  spacestation: {
    label: '軌道太空站', icon: '◍', bpm: [100, 124], scale: [0, 2, 4, 6, 7, 9, 11],
    progs: [['C', 'D', 'Em7', 'C'], ['Cmaj7', 'D', 'G', 'Em7'], ['Am7', 'D', 'Cmaj7', 'G']],
    rhythms: [[0, 4], [0, 2, 6], [0, 4, 6], [0, 3, 6]],
    bassPat: [[0, 'r'], [2, 'o'], [4, 'r'], [6, 'o']],
    drums: { kick: [0, 8], snare: [12], hat: [2, 6, 10, 14] }, fill: false
  },
  cyberchase: {
    label: '賽博追擊', icon: '⚡', bpm: [150, 176], scale: [9, 11, 0, 2, 4, 5, 7],
    progs: [['Am', 'G', 'F', 'G'], ['Am', 'F', 'C', 'G'], ['Am', 'C', 'G', 'Em']],
    rhythms: [[0, 2, 4, 6], [0, 1, 2, 4, 6], [0, 2, 4, 5, 6], [0, 3, 4, 7]],
    bassPat: [[0, 'r'], [1, 'o'], [2, 'r'], [4, 'r'], [5, 'o'], [6, 'r']],
    drums: { kick: [0, 4, 8, 12], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: true, minor: true
  },
  alien: {
    label: '異星荒原', icon: '❉', bpm: [84, 110], scale: [0, 2, 4, 6, 8, 10],
    progs: [['C', 'D', 'Bb', 'C'], ['C', 'E', 'D', 'C'], ['Am', 'Bb', 'C', 'D']],
    rhythms: [[0], [0, 5], [0, 4], [0, 3, 6], [0, 6]],
    bassPat: [[0, 'r'], [5, 'o']],
    drums: { kick: [0, 9], snare: [], hat: [5, 13] }, fill: false, keepClash: true
  },
  mothership: {
    label: '母艦機房', icon: '▣', bpm: [116, 140], scale: [9, 10, 0, 2, 4, 5, 7],
    progs: [['Am', 'Gm', 'Am', 'Bb'], ['Am', 'Bb', 'Gm', 'Am'], ['Dm', 'Am', 'Gm', 'Am']],
    rhythms: [[0, 2, 4, 6], [0, 1, 4, 5], [0, 4, 6], [0, 2, 4, 7]],
    bassPat: [[0, 'r'], [1, 'r'], [4, 'r'], [5, 'r']],
    drums: { kick: [0, 4, 8, 12], snare: [4, 12], hat: [2, 10] }, fill: false, minor: true, keepClash: true
  },
  // ===== RPG（追加）=====
  journey: {
    label: '冒險啟程', icon: '➹', bpm: [120, 148], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['C', 'G', 'Am', 'F'], ['C', 'F', 'G', 'Am'], ['F', 'C', 'G', 'C']],
    rhythms: [[0, 2, 4], [0, 2, 4, 6], [0, 4, 6], [0, 2, 3, 4, 6]],
    bassPat: [[0, 'r'], [2, 'r'], [4, '5'], [6, 'r']],
    drums: { kick: [0, 6, 8], snare: [4, 12], hat: [2, 10] }, fill: true
  },
  // ===== 休閒（追加）=====
  onsen: {
    label: '泡湯溫泉', icon: '♨', bpm: [80, 104], scale: [0, 2, 4, 7, 9],
    progs: [['C', 'Am', 'C', 'G'], ['Am', 'G', 'C', 'Am'], ['C', 'G', 'Am', 'C']],
    rhythms: [[0, 4], [0, 6], [0, 3, 6], [0, 4, 6]],
    bassPat: [[0, 'r'], [6, '5']],
    drums: { kick: [0, 8], snare: [], hat: [12] }, fill: false
  },
  minigame: {
    label: '歡樂小遊戲', icon: '✪', bpm: [140, 168], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['C', 'G', 'C', 'G'], ['C', 'F', 'C', 'G'], ['C', 'Em', 'F', 'G']],
    rhythms: [[0, 2, 4, 6], [0, 3, 4, 7], [0, 1, 4, 6], [0, 2, 3, 6]],
    bassPat: [[0, 'r'], [2, '5'], [4, 'r'], [6, '5']],
    drums: { kick: [0, 4, 8, 12], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: true
  },
  puzzle: {
    label: '謎題時間', icon: '❓', bpm: [100, 128], scale: [9, 11, 0, 2, 4, 6, 7],
    progs: [['Am', 'D', 'Em', 'Am'], ['Am', 'Bm', 'Em', 'D'], ['Em', 'Am', 'D', 'Am']],
    rhythms: [[0, 3, 6], [0, 4], [0, 2, 5], [0, 3, 4, 7]],
    bassPat: [[0, 'r'], [3, '5'], [6, 'o']],
    drums: { kick: [0, 8], snare: [12], hat: [4] }, fill: false, minor: true
  },
  picnic: {
    label: '野餐時光', icon: '☘', bpm: [116, 140], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['C', 'F', 'G', 'C'], ['C', 'Am', 'Dm', 'G'], ['F', 'C', 'G', 'C']],
    rhythms: [[0, 2, 4], [0, 3, 4, 6], [0, 2, 4, 6], [0, 4, 5]],
    bassPat: [[0, 'r'], [2, '5'], [4, 'r'], [6, '5']],
    drums: { kick: [0, 8], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: false
  },
  // ===== 特定人物戰鬥（追加）=====
  rival: {
    label: '宿敵對決', icon: '⚔', bpm: [158, 184], scale: [9, 11, 0, 2, 4, 5, 8],
    progs: [['Am', 'F', 'E', 'Am'], ['Am', 'C', 'F', 'E'], ['Dm', 'Am', 'E', 'Am']],
    rhythms: [[0, 2, 4, 6], [0, 1, 2, 4, 6], [0, 2, 3, 4, 6, 7], [0, 2, 4, 5, 6]],
    bassPat: [[0, 'r'], [2, 'r'], [4, '5'], [5, 'r'], [6, 'r']],
    drums: { kick: [0, 6, 8, 14], snare: [4, 12], hat: [2, 10] }, fill: true, minor: true
  },
  fallenhero: {
    label: '墮落英雄', icon: '⚰', bpm: [140, 168], scale: [9, 11, 0, 2, 4, 5, 8],
    progs: [['Am', 'F', 'G', 'E'], ['Am', 'Dm', 'Bb', 'E'], ['F', 'E', 'Am', 'Am']],
    rhythms: [[0, 4], [0, 2, 4, 6], [0, 4, 6, 7], [0, 2, 3, 4, 6]],
    bassPat: [[0, 'r'], [2, 'r'], [4, '5'], [6, 'r'], [7, '5']],
    drums: { kick: [0, 4, 8, 12], snare: [4, 12] }, fill: true, minor: true
  },
  mechabeast: {
    label: '機械巨獸', icon: '⛓', bpm: [144, 172], scale: [9, 10, 0, 2, 4, 5, 8],
    progs: [['Am', 'Bb', 'Am', 'Gm'], ['Am', 'Gm', 'Bb', 'Am'], ['Am', 'Bb', 'E', 'Am']],
    rhythms: [[0, 1, 4, 5], [0, 2, 4, 6], [0, 1, 2, 4, 6], [0, 2, 4, 6, 7]],
    bassPat: [[0, 'r'], [1, 'r'], [2, 'r'], [4, 'r'], [5, 'r'], [6, 'r']],
    drums: { kick: [0, 4, 8, 12], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: true, minor: true, keepClash: true
  },
  witch: {
    label: '魔女之舞', icon: '☽', bpm: [128, 156], scale: [9, 11, 0, 2, 4, 6, 8],
    progs: [['Am', 'Bm', 'E', 'Am'], ['Am', 'D', 'E', 'Am'], ['Dm', 'E', 'Am', 'Bm']],
    rhythms: [[0, 3, 6], [0, 3, 4, 7], [0, 2, 3, 6], [0, 3, 5, 6]],
    bassPat: [[0, 'r'], [3, '5'], [6, '5']],
    drums: { kick: [0, 6, 8], snare: [4, 12], hat: [2, 10, 14] }, fill: true, minor: true, keepClash: true
  },
  dragon: {
    label: '龍之咆哮', icon: '🜲', bpm: [132, 160], scale: [9, 11, 0, 2, 4, 5, 8],
    progs: [['Am', 'Bb', 'F', 'E'], ['Am', 'G', 'Bb', 'Am'], ['Am', 'E', 'Bb', 'Am']],
    rhythms: [[0, 4], [0, 4, 6], [0, 2, 4, 6], [0, 1, 4, 6]],
    bassPat: [[0, 'r'], [1, 'r'], [4, '5'], [5, '5']],
    drums: { kick: [0, 4, 8, 12], snare: [8] }, fill: true, minor: true, keepClash: true
  },
  // ===== 傳說 RPG（雷特動機系作品風）=====
  fated: {
    label: '命運對決', icon: '☄', bpm: [180, 210], scale: [9, 11, 0, 2, 4, 5, 7],
    progs: [['Am', 'C', 'G', 'D'], ['Am', 'C', 'G', 'Am'], ['Am', 'G', 'C', 'D']],  // i→♭III→♭VII→IV
    rhythms: [[0, 1, 2, 4], [0, 1, 2, 4, 6], [0, 2, 3, 4, 6], [0, 1, 4, 5, 6], [0, 2, 4, 6, 7]],
    bassPat: [[0, 'r'], [1, 'o'], [2, 'r'], [3, 'o'], [4, 'r'], [5, 'o'], [6, 'r'], [7, 'o']],
    drums: { kick: [0, 4, 8, 12], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: true, minor: true
  },
  heartbattle: {
    label: '熱血王道戰', icon: '♥', bpm: [150, 178], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['F', 'G', 'Em', 'Am'], ['F', 'G', 'Am', 'Am'], ['Dm', 'G', 'Em', 'Am'], ['F', 'G', 'C', 'Am']],  // IV→V→iii→vi 王道進行
    rhythms: [[0, 2, 4, 6], [0, 2, 3, 4, 6], [0, 1, 2, 4, 6], [0, 2, 4, 5, 6, 7]],
    bassPat: [[0, 'r'], [2, 'r'], [4, '5'], [6, 'r'], [7, '5']],
    drums: { kick: [0, 6, 8, 14], snare: [4, 12], hat: [2, 10] }, fill: true
  },
  bonedance: {
    label: '骨頭之舞', icon: '☠', bpm: [140, 170], scale: [9, 11, 0, 2, 4, 5, 7],
    progs: [['Am', 'G', 'Am', 'E'], ['Am', 'C', 'G', 'E'], ['Am', 'Em', 'G', 'Am']],
    rhythms: [[0, 2, 3, 4], [0, 1, 2, 4], [0, 2, 4, 5], [0, 2, 3, 6], [0, 1, 4, 6]],
    bassPat: [[0, 'r'], [1, 'o'], [2, 'r'], [3, 'o'], [4, '5'], [5, 'o'], [6, 'r'], [7, 'o']],  // 八度彈跳＝主角
    drums: { kick: [0, 8], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: true, minor: true
  },
  bonds: {
    label: '羈絆之歌', icon: '❤', bpm: [72, 96], scale: [0, 2, 4, 5, 7, 9, 11],
    tone: { lead: 'piano' },
    progs: [['C', 'Em', 'F', 'G'], ['C', 'Am', 'F', 'G'], ['F', 'G', 'Em', 'Am'], ['F', 'C', 'G', 'C']],
    rhythms: [[0, 3, 6], [0, 4], [0, 3], [0, 4, 6], [0, 2, 5]],
    bassPat: [[0, 'r'], [3, '5'], [6, 'o']],
    drums: { kick: [0, 10], snare: [8] }, fill: false
  },
  determination: {
    label: '決意時刻', icon: '✦', bpm: [64, 86], scale: [9, 11, 0, 2, 4, 5, 7],
    tone: { lead: 'piano' },
    progs: [['Am', 'F', 'C', 'G'], ['Am', 'C', 'F', 'G'], ['Am', 'Em', 'F', 'G']],
    rhythms: [[0, 4], [0, 6], [0, 3, 6], [0, 4, 7], [0]],
    bassPat: [[0, 'r'], [6, '5']],
    drums: { kick: [], snare: [] }, fill: false, minor: true
  },
  finalhope: {
    label: '最終希望', icon: '✵', bpm: [148, 176], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['C', 'G', 'Am', 'F'], ['F', 'G', 'C', 'Am'], ['C', 'F', 'G', 'C'], ['Am', 'F', 'C', 'G']],
    rhythms: [[0, 2, 4], [0, 2, 4, 6], [0, 2, 3, 4, 6], [0, 1, 2, 4, 6], [0, 2, 4, 5, 6]],
    bassPat: [[0, 'r'], [2, 'o'], [4, '5'], [6, 'o']],
    drums: { kick: [0, 4, 8, 12], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: true
  },
  hiddenboss: {
    label: '隱藏頭目', icon: '❖', bpm: [168, 196], scale: [9, 10, 1, 2, 4, 5, 8],
    progs: [['Am', 'Bb', 'Eb', 'E'], ['Am', 'Eb', 'Bb', 'E'], ['Dm', 'Bb', 'Eb', 'Am']],
    rhythms: [[0, 1, 2, 4, 6], [0, 2, 3, 4, 6, 7], [0, 1, 2, 4, 5, 6, 7], [0, 2, 4, 5, 6, 7]],
    bassPat: [[0, 'r'], [1, 'r'], [2, 'r'], [3, 'r'], [4, 'r'], [5, 'r'], [6, 'r'], [7, 'r']],
    drums: { kick: [0, 4, 8, 12], snare: [4, 10, 12], hat: [2, 6, 14] }, fill: true, minor: true, keepClash: true
  },
  // ===== 大自然（第二批追加）=====
  waterfall: {
    label: '瀑布飛瀑', icon: '⛲', bpm: [120, 148], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['C', 'G', 'Am', 'F'], ['C', 'F', 'G', 'C'], ['F', 'G', 'C', 'Am']],
    rhythms: [[0, 2, 4, 6], [0, 2, 4, 5, 6, 7], [0, 1, 2, 4, 6], [0, 3, 4, 6, 7]],
    bassPat: [[0, 'r'], [2, '5'], [4, 'r'], [6, '5']],
    drums: { kick: [0, 8], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: false
  },
  flowerfield: {
    label: '花田', icon: '❁', bpm: [108, 134], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['C', 'F', 'C', 'G'], ['C', 'Am', 'F', 'G'], ['F', 'C', 'Dm', 'G']],
    rhythms: [[0, 4], [0, 2, 4], [0, 4, 6], [0, 2, 4, 6]],
    bassPat: [[0, 'r'], [2, '5'], [4, 'r'], [6, '5']],
    drums: { kick: [0, 8], snare: [4, 12], hat: [4, 12] }, fill: false
  },
  thunderstorm: {
    label: '雷雨', icon: '☈', bpm: [124, 152], scale: [9, 11, 0, 2, 4, 5, 8],
    progs: [['Am', 'Bb', 'E', 'Am'], ['Dm', 'Am', 'E', 'Am'], ['Am', 'G', 'F', 'E']],
    rhythms: [[0, 2, 4, 6], [0, 1, 2, 4, 6], [0, 2, 3, 4, 6, 7], [0, 3, 4, 7]],
    bassPat: [[0, 'r'], [2, 'r'], [4, '5'], [6, 'r']],
    drums: { kick: [0, 4, 8, 12], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: true, minor: true, keepClash: true
  },
  deepsea: {
    label: '深海', icon: '≋', bpm: [70, 96], scale: [0, 2, 4, 6, 8, 10],
    progs: [['C', 'D', 'Bb', 'C'], ['Am', 'D', 'C', 'E'], ['C', 'Bb', 'D', 'C']],
    rhythms: [[0], [0, 4], [0, 6], [0, 4, 6]],
    bassPat: [[0, 'r'], [4, 'o']],
    drums: { kick: [0, 8], snare: [], hat: [12] }, fill: false, keepClash: true
  },
  aurora: {
    label: '極光', icon: '❈', bpm: [72, 96], scale: [0, 2, 4, 6, 7, 9, 11],
    tone: { lead: 'piano' },
    progs: [['C', 'D', 'G', 'Em'], ['Cmaj7', 'D', 'Em7', 'G'], ['C', 'G', 'D', 'Em']],
    rhythms: [[0, 4], [0, 6], [0, 3, 6], [0, 4, 6]],
    bassPat: [[0, 'r'], [4, '5'], [6, 'o']],
    drums: { kick: [0, 10], snare: [], hat: [4, 12] }, fill: false
  },
  bamboo: {
    label: '竹林', icon: '❇', bpm: [90, 118], scale: [0, 2, 4, 7, 9],
    progs: [['Am', 'G', 'Am', 'Em'], ['C', 'G', 'Am', 'Am'], ['Am', 'Em', 'G', 'Am']],
    rhythms: [[0, 4], [0, 3, 6], [0, 4, 6], [0, 2, 4]],
    bassPat: [[0, 'r'], [6, '5']],
    drums: { kick: [0, 8], snare: [], hat: [12] }, fill: false
  },
  // ===== 都市（第二批追加）=====
  cafestreet: {
    label: '咖啡街', icon: '♬', bpm: [92, 116], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['Cmaj7', 'Am7', 'Dm7', 'G7'], ['Fmaj7', 'Em7', 'Dm7', 'Cmaj7'], ['Cmaj7', 'A7', 'Dm7', 'G7']],
    rhythms: [[0, 3, 4], [0, 2, 4, 7], [0, 3, 6], [0, 3, 4, 6]],
    bassPat: [[0, 'r'], [3, '5'], [4, 'r'], [7, '3']],
    drums: { kick: [0, 8], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: false
  },
  subway: {
    label: '地鐵', icon: '▬', bpm: [120, 142], scale: [9, 11, 0, 2, 4, 5, 7],
    progs: [['Am', 'G', 'F', 'G'], ['Am', 'Dm', 'G', 'Am'], ['Am', 'F', 'C', 'G']],
    rhythms: [[0, 2, 4, 6], [0, 3, 4, 7], [0, 2, 4, 6, 7], [0, 1, 4, 5]],
    bassPat: [[0, 'r'], [2, 'o'], [4, 'r'], [6, 'o']],
    drums: { kick: [0, 4, 8, 12], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: false, minor: true
  },
  skyline: {
    label: '商業區', icon: '▨', bpm: [118, 140], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['C', 'G', 'Am', 'F'], ['C', 'F', 'G', 'C'], ['Am', 'F', 'C', 'G']],
    rhythms: [[0, 2, 4], [0, 2, 4, 6], [0, 3, 4, 6], [0, 2, 4, 6, 7]],
    bassPat: [[0, 'r'], [2, '5'], [4, 'r'], [6, '5']],
    drums: { kick: [0, 4, 8, 12], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: true
  },
  nightmarket: {
    label: '夜市', icon: '✸', bpm: [132, 160], scale: [0, 2, 4, 5, 7, 9, 10],
    progs: [['C', 'Bb', 'F', 'C'], ['C', 'F', 'Bb', 'C'], ['C', 'G', 'Bb', 'F']],
    rhythms: [[0, 2, 4, 6], [0, 3, 4, 7], [0, 1, 4, 6], [0, 2, 3, 6]],
    bassPat: [[0, 'r'], [2, '5'], [4, 'r'], [6, '5']],
    drums: { kick: [0, 4, 8, 12], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: true
  },
  citypark: {
    label: '城市公園', icon: '⚘', bpm: [112, 136], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['C', 'Am', 'F', 'G'], ['C', 'F', 'Dm', 'G'], ['F', 'G', 'C', 'Am']],
    rhythms: [[0, 2, 4], [0, 3, 4, 6], [0, 2, 4, 6], [0, 4, 6]],
    bassPat: [[0, 'r'], [2, '5'], [4, 'r'], [6, '5']],
    drums: { kick: [0, 8], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: false
  },
  mall: {
    label: '購物中心', icon: '◫', bpm: [116, 138], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['C', 'G', 'Am', 'F'], ['F', 'G', 'Em', 'Am'], ['C', 'Am', 'F', 'G']],
    rhythms: [[0, 3, 6], [0, 2, 4, 6], [0, 3, 4, 7], [0, 2, 4, 6, 7]],
    bassPat: [[0, 'r'], [3, 'o'], [4, 'r'], [6, '5']],
    drums: { kick: [0, 6, 8, 14], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: true
  },
  ferriswheel: {
    label: '摩天輪', icon: '◉', bpm: [74, 98], scale: [0, 2, 4, 5, 7, 9, 11],
    tone: { lead: 'piano' },
    progs: [['C', 'Em', 'F', 'G'], ['C', 'Am', 'Dm', 'G'], ['F', 'G', 'Em', 'Am']],
    rhythms: [[0, 3, 6], [0, 3], [0, 4], [0, 3, 5]],
    bassPat: [[0, 'r'], [3, '5'], [6, '5']],
    drums: { kick: [0, 8], snare: [], hat: [4, 12] }, fill: false
  },
  rainstreet: {
    label: '雨中街道', icon: '☔', bpm: [72, 94], scale: [9, 11, 0, 2, 4, 5, 7],
    tone: { lead: 'piano' },
    progs: [['Am7', 'Dm7', 'G', 'Cmaj7'], ['Am', 'Em', 'F', 'G'], ['Dm7', 'Em7', 'Am7', 'Am7']],
    rhythms: [[0, 3], [0, 4], [0, 3, 6], [0, 4, 7]],
    bassPat: [[0, 'r'], [4, '5'], [7, '3']],
    drums: { kick: [0, 10], snare: [8], hat: [4, 12] }, fill: false, minor: true
  },
  gamecenter: {
    label: '電玩中心', icon: '⎔', bpm: [150, 176], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['C', 'G', 'C', 'G'], ['C', 'F', 'G', 'C'], ['C', 'Em', 'F', 'G']],
    rhythms: [[0, 2, 4, 6], [0, 1, 2, 4, 6], [0, 2, 4, 5, 6], [0, 2, 3, 4, 6, 7]],
    bassPat: [[0, 'r'], [2, 'o'], [4, '5'], [6, 'o']],
    drums: { kick: [0, 4, 8, 12], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: true
  },
  overpass: {
    label: '天橋暮色', icon: '⛅', bpm: [100, 124], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['Cmaj7', 'A7', 'Dm7', 'G7'], ['Fmaj7', 'Em7', 'Dm7', 'G7'], ['Cmaj7', 'Am7', 'Fmaj7', 'G7']],
    rhythms: [[0, 3, 6], [0, 2, 4, 7], [0, 3, 4, 6], [0, 2, 5, 6]],
    bassPat: [[0, 'r'], [3, '5'], [4, 'r'], [7, '3']],
    drums: { kick: [0, 6, 8, 14], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: false
  },
  // ===== 村莊（第二批追加）=====
  bakery: {
    label: '麵包坊', icon: '✼', bpm: [92, 114], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['C', 'F', 'C', 'G'], ['C', 'Am', 'F', 'G'], ['F', 'C', 'Dm', 'G']],
    rhythms: [[0, 4], [0, 3, 6], [0, 2, 4], [0, 4, 6]],
    bassPat: [[0, 'r'], [4, '5'], [6, 'r']],
    drums: { kick: [0, 8], snare: [12], hat: [4] }, fill: false
  },
  florist: {
    label: '花店', icon: '❃', bpm: [96, 118], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['C', 'G', 'Am', 'F'], ['C', 'F', 'Dm', 'G'], ['F', 'G', 'C', 'Am']],
    rhythms: [[0, 4], [0, 3, 6], [0, 4, 6], [0, 2, 5]],
    bassPat: [[0, 'r'], [4, '5'], [6, 'o']],
    drums: { kick: [0, 8], snare: [], hat: [4, 12] }, fill: false
  },
  clocktower: {
    label: '鐘樓', icon: '◷', bpm: [96, 120], scale: [0, 2, 4, 6, 7, 9, 11],
    progs: [['C', 'G', 'D', 'G'], ['C', 'D', 'Em', 'G'], ['C', 'G', 'Em', 'D']],
    rhythms: [[0, 4], [0, 4, 6], [0, 2, 4, 6], [0, 3, 6]],
    bassPat: [[0, 'r'], [4, '5'], [6, 'o']],
    drums: { kick: [0, 8], snare: [4, 12], hat: [2, 10] }, fill: false
  },
  farm: {
    label: '農場', icon: '✤', bpm: [120, 144], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['C', 'F', 'C', 'G'], ['C', 'G', 'F', 'C'], ['F', 'C', 'G', 'C']],
    rhythms: [[0, 2, 4], [0, 2, 4, 6], [0, 3, 4, 6], [0, 4, 5]],
    bassPat: [[0, 'r'], [2, '5'], [4, 'r'], [6, '5']],
    drums: { kick: [0, 8], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: false
  },
  windmill: {
    label: '風車小鎮', icon: '✻', bpm: [104, 128], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['C', 'F', 'G', 'C'], ['C', 'Dm', 'G', 'C'], ['F', 'C', 'G', 'Am']],
    rhythms: [[0, 4], [0, 2, 4], [0, 4, 6], [0, 3, 4, 6]],
    bassPat: [[0, 'r'], [2, '5'], [4, 'r'], [6, '5']],
    drums: { kick: [0, 8], snare: [12], hat: [4, 12] }, fill: false
  },
  festvillage: {
    label: '節慶村', icon: '❋', bpm: [136, 164], scale: [0, 2, 4, 7, 9],
    progs: [['C', 'Am', 'C', 'G'], ['C', 'F', 'G', 'C'], ['Am', 'C', 'G', 'C']],
    rhythms: [[0, 2, 3, 4], [0, 2, 4, 6], [0, 1, 2, 4, 6], [0, 2, 3, 4, 6]],
    bassPat: [[0, 'r'], [2, '5'], [4, 'r'], [6, '5']],
    drums: { kick: [0, 4, 8, 12], snare: [4, 10, 12], hat: [2, 6, 14] }, fill: true
  },
  wellside: {
    label: '井邊', icon: '⊚', bpm: [96, 118], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['C', 'F', 'G', 'C'], ['C', 'Am', 'F', 'G'], ['F', 'C', 'G', 'C']],
    rhythms: [[0, 4], [0, 3, 6], [0, 4, 6], [0, 2, 4]],
    bassPat: [[0, 'r'], [4, '5'], [6, 'r']],
    drums: { kick: [0, 8], snare: [12] }, fill: false
  },
  ranch: {
    label: '牧場', icon: '⛰', bpm: [108, 132], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['C', 'G', 'F', 'C'], ['C', 'F', 'C', 'G'], ['F', 'G', 'C', 'C']],
    rhythms: [[0, 4], [0, 4, 6], [0, 2, 4, 6], [0, 2, 4]],
    bassPat: [[0, 'r'], [4, '5'], [6, 'o']],
    drums: { kick: [0, 8], snare: [4, 12], hat: [2, 10] }, fill: false
  },
  chapel: {
    label: '村莊教堂', icon: '✟', bpm: [66, 88], scale: [0, 2, 4, 5, 7, 9, 11],
    tone: { lead: 'piano' },
    progs: [['C', 'F', 'C', 'G'], ['C', 'Am', 'F', 'G'], ['F', 'C', 'G', 'C']],
    rhythms: [[0], [0, 4], [0, 4, 6], [0, 6]],
    bassPat: [[0, 'r'], [4, '5']],
    drums: { kick: [0, 8], snare: [] }, fill: false
  },
  orchard: {
    label: '果園', icon: '❂', bpm: [112, 136], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['C', 'G', 'Am', 'F'], ['C', 'F', 'G', 'C'], ['F', 'G', 'C', 'Am']],
    rhythms: [[0, 2, 4], [0, 2, 4, 6], [0, 4, 6], [0, 3, 4, 6]],
    bassPat: [[0, 'r'], [2, '5'], [4, 'r'], [6, '5']],
    drums: { kick: [0, 8], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: false
  },
  // ===== 特殊設施（第二批追加）=====
  lab: {
    label: '研究實驗室', icon: '⚛', bpm: [110, 134], scale: [9, 11, 0, 2, 4, 5, 7],
    progs: [['Am', 'Em', 'Am', 'G'], ['Am', 'Dm', 'Em', 'Am'], ['Am', 'G', 'Em', 'Am']],
    rhythms: [[0, 2, 4, 6], [0, 1, 4, 5], [0, 2, 4, 6, 7], [0, 4, 6]],
    bassPat: [[0, 'r'], [2, 'r'], [4, 'r'], [6, 'r']],
    drums: { kick: [0, 4, 8, 12], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: false, minor: true
  },
  arena: {
    label: '競技場', icon: '⬢', bpm: [140, 168], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['F', 'G', 'Em', 'Am'], ['F', 'G', 'C', 'Am'], ['C', 'G', 'Am', 'F']],
    rhythms: [[0, 2, 4, 6], [0, 2, 3, 4, 6], [0, 1, 2, 4, 6], [0, 2, 4, 5, 6]],
    bassPat: [[0, 'r'], [2, 'r'], [4, '5'], [6, 'r']],
    drums: { kick: [0, 6, 8, 14], snare: [4, 12], hat: [2, 10] }, fill: true
  },
  training: {
    label: '訓練場', icon: '◇', bpm: [120, 146], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['C', 'G', 'Am', 'F'], ['C', 'F', 'G', 'C'], ['Am', 'F', 'C', 'G']],
    rhythms: [[0, 2, 4], [0, 2, 4, 6], [0, 3, 4, 6], [0, 2, 4, 6, 7]],
    bassPat: [[0, 'r'], [2, '5'], [4, 'r'], [6, '5']],
    drums: { kick: [0, 8], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: false
  },
  portal: {
    label: '傳送門', icon: '⊛', bpm: [100, 126], scale: [0, 2, 4, 6, 8, 10],
    progs: [['C', 'D', 'E', 'C'], ['C', 'Bb', 'D', 'E'], ['Am', 'D', 'C', 'E']],
    rhythms: [[0, 4], [0, 2, 6], [0, 4, 6], [0, 2, 4, 6]],
    bassPat: [[0, 'r'], [4, 'o']],
    drums: { kick: [0, 8], snare: [12], hat: [2, 6, 10, 14] }, fill: false, keepClash: true
  },
  belltower: {
    label: '鐘塔', icon: '⊕', bpm: [84, 108], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['C', 'G', 'F', 'C'], ['C', 'F', 'G', 'C'], ['Am', 'F', 'C', 'G']],
    rhythms: [[0, 4], [0, 4, 6], [0, 2, 4, 6], [0, 6]],
    bassPat: [[0, 'r'], [4, '5'], [6, 'o']],
    drums: { kick: [0, 8], snare: [12], hat: [4] }, fill: false
  },
  clinic: {
    label: '醫務室', icon: '✚', bpm: [70, 92], scale: [0, 2, 4, 5, 7, 9, 11],
    tone: { lead: 'piano' },
    progs: [['C', 'Am', 'F', 'G'], ['C', 'Em', 'F', 'G'], ['F', 'C', 'G', 'C']],
    rhythms: [[0, 4], [0, 3, 6], [0, 6], [0, 4, 6]],
    bassPat: [[0, 'r'], [4, '5']],
    drums: { kick: [0, 8], snare: [], hat: [4, 12] }, fill: false
  },
  workshop: {
    label: '武器工坊', icon: '⚒', bpm: [116, 140], scale: [9, 11, 0, 2, 4, 5, 7],
    progs: [['Am', 'G', 'Am', 'Em'], ['Am', 'Dm', 'G', 'Am'], ['Am', 'F', 'G', 'Am']],
    rhythms: [[0, 2, 4, 6], [0, 1, 4, 5], [0, 2, 4, 6, 7], [0, 3, 4, 7]],
    bassPat: [[0, 'r'], [2, 'r'], [4, 'r'], [6, 'r']],
    drums: { kick: [0, 4, 8, 12], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: false, minor: true
  },
  observatory: {
    label: '天文台', icon: '✫', bpm: [72, 96], scale: [0, 2, 4, 6, 7, 9, 11],
    tone: { lead: 'piano' },
    progs: [['C', 'D', 'G', 'Em'], ['Cmaj7', 'D', 'Em7', 'G'], ['C', 'G', 'D', 'Em']],
    rhythms: [[0, 4], [0, 6], [0, 3, 6], [0, 4, 6]],
    bassPat: [[0, 'r'], [4, '5'], [6, 'o']],
    drums: { kick: [0, 10], snare: [], hat: [4, 12] }, fill: false
  },
  controlroom: {
    label: '監控室', icon: '⊟', bpm: [112, 138], scale: [9, 11, 0, 2, 4, 5, 7],
    progs: [['Am', 'Em', 'Dm', 'Am'], ['Am', 'G', 'Dm', 'Am'], ['Dm', 'Am', 'Em', 'Am']],
    rhythms: [[0, 2, 4, 6], [0, 1, 2, 4, 6], [0, 2, 4, 6, 7], [0, 3, 4, 7]],
    bassPat: [[0, 'r'], [2, 'r'], [4, '5'], [6, 'r']],
    drums: { kick: [0, 4, 8, 12], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: false, minor: true
  },
  // ===== 室內（第二批追加）=====
  bedroom: {
    label: '臥室', icon: '❍', bpm: [64, 86], scale: [0, 2, 4, 5, 7, 9, 11],
    tone: { lead: 'piano' },
    progs: [['C', 'Am', 'F', 'G'], ['C', 'Em', 'Am', 'F'], ['F', 'C', 'G', 'C']],
    rhythms: [[0, 4], [0, 6], [0, 3, 6], [0]],
    bassPat: [[0, 'r'], [4, '5']],
    drums: { kick: [], snare: [] }, fill: false
  },
  study: {
    label: '書房', icon: '✒', bpm: [68, 90], scale: [0, 2, 4, 5, 7, 9, 11],
    tone: { lead: 'piano' },
    progs: [['Cmaj7', 'Am7', 'Dm7', 'G7'], ['Fmaj7', 'Em7', 'Dm7', 'Cmaj7'], ['C', 'Em', 'F', 'G']],
    rhythms: [[0, 4], [0, 3, 6], [0, 6], [0, 4, 7]],
    bassPat: [[0, 'r'], [4, '5'], [7, '3']],
    drums: { kick: [], snare: [], hat: [8] }, fill: false
  },
  kitchen: {
    label: '廚房', icon: '✾', bpm: [116, 140], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['C', 'F', 'G', 'C'], ['C', 'Am', 'Dm', 'G'], ['F', 'G', 'C', 'Am']],
    rhythms: [[0, 2, 4], [0, 3, 4, 6], [0, 2, 4, 6], [0, 4, 5]],
    bassPat: [[0, 'r'], [2, '5'], [4, 'r'], [6, '5']],
    drums: { kick: [0, 8], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: false
  },
  attic: {
    label: '閣樓', icon: '⊡', bpm: [78, 100], scale: [0, 2, 4, 5, 7, 9, 11],
    tone: { lead: 'piano' },
    progs: [['C', 'Am', 'F', 'G'], ['Am', 'F', 'C', 'G'], ['C', 'Em', 'Am', 'F']],
    rhythms: [[0, 4], [0, 3, 6], [0, 6], [0, 2, 4]],
    bassPat: [[0, 'r'], [4, '5'], [6, 'o']],
    drums: { kick: [0, 10], snare: [8] }, fill: false
  },
  bathhouse: {
    label: '大澡堂', icon: '⌇', bpm: [92, 116], scale: [0, 2, 4, 7, 9],
    progs: [['C', 'Am', 'C', 'G'], ['C', 'G', 'Am', 'C'], ['Am', 'G', 'C', 'Am']],
    rhythms: [[0, 4], [0, 3, 6], [0, 4, 6], [0, 2, 4]],
    bassPat: [[0, 'r'], [6, '5']],
    drums: { kick: [0, 8], snare: [], hat: [4, 12] }, fill: false
  },
  lockerroom: {
    label: '更衣室', icon: '▥', bpm: [112, 136], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['C', 'G', 'Am', 'F'], ['C', 'F', 'Dm', 'G'], ['F', 'G', 'C', 'Am']],
    rhythms: [[0, 3, 6], [0, 2, 4, 6], [0, 4, 6], [0, 3, 4]],
    bassPat: [[0, 'r'], [3, '5'], [4, 'r'], [6, '5']],
    drums: { kick: [0, 8], snare: [4, 12], hat: [4, 12] }, fill: false
  },
  livingroom: {
    label: '客廳', icon: '⊞', bpm: [96, 120], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['C', 'F', 'C', 'G'], ['C', 'Am', 'F', 'G'], ['F', 'C', 'G', 'C']],
    rhythms: [[0, 4], [0, 3, 6], [0, 2, 4], [0, 4, 6]],
    bassPat: [[0, 'r'], [4, '5'], [6, 'r']],
    drums: { kick: [0, 8], snare: [12], hat: [4, 12] }, fill: false
  },
  greenhouse: {
    label: '花房', icon: '❧', bpm: [92, 114], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['C', 'G', 'Am', 'F'], ['Cmaj7', 'Fmaj7', 'Em7', 'Am7'], ['F', 'G', 'C', 'Am']],
    rhythms: [[0, 4], [0, 3, 6], [0, 4, 6], [0, 2, 5]],
    bassPat: [[0, 'r'], [4, '5'], [6, 'o']],
    drums: { kick: [0, 8], snare: [], hat: [4, 12] }, fill: false
  },
  secretroom: {
    label: '密室', icon: '⬚', bpm: [84, 108], scale: [9, 11, 0, 2, 4, 5, 8],
    progs: [['Am', 'Bb', 'Am', 'E'], ['Am', 'Dm', 'E', 'Am'], ['Dm', 'Bb', 'E', 'Am']],
    rhythms: [[0], [0, 6], [0, 4], [0, 3, 6]],
    bassPat: [[0, 'r'], [6, 'r']],
    drums: { kick: [0, 9], snare: [], hat: [6] }, fill: false, minor: true, keepClash: true
  },
  fireplace: {
    label: '壁爐邊', icon: '✶', bpm: [66, 88], scale: [0, 2, 4, 5, 7, 9, 11],
    tone: { lead: 'piano' },
    progs: [['C', 'Am', 'F', 'G'], ['C', 'Em', 'F', 'G'], ['F', 'G', 'C', 'Am']],
    rhythms: [[0, 4], [0, 3, 6], [0, 6], [0, 4, 7]],
    bassPat: [[0, 'r'], [4, '5']],
    drums: { kick: [0, 10], snare: [8] }, fill: false
  },
  // ===== 科幻世界（第二批追加）=====
  virtual: {
    label: '虛擬空間', icon: '⬡', bpm: [124, 148], scale: [0, 2, 4, 6, 8, 10],
    progs: [['C', 'D', 'E', 'C'], ['C', 'Bb', 'D', 'C'], ['Am', 'D', 'C', 'E']],
    rhythms: [[0, 2, 4, 6], [0, 4, 6], [0, 2, 4, 6, 7], [0, 1, 4, 5]],
    bassPat: [[0, 'r'], [2, 'o'], [4, 'r'], [6, 'o']],
    drums: { kick: [0, 4, 8, 12], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: false, keepClash: true
  },
  robotcity: {
    label: '機器人城', icon: '⌸', bpm: [118, 142], scale: [9, 10, 0, 2, 4, 5, 7],
    progs: [['Am', 'Gm', 'Am', 'Bb'], ['Am', 'Bb', 'Gm', 'Am'], ['Dm', 'Am', 'Gm', 'Am']],
    rhythms: [[0, 2, 4, 6], [0, 1, 4, 5], [0, 2, 4, 6, 7], [0, 4, 6]],
    bassPat: [[0, 'r'], [1, 'r'], [4, 'r'], [5, 'r']],
    drums: { kick: [0, 4, 8, 12], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: false, minor: true, keepClash: true
  },
  timewarp: {
    label: '時光隧道', icon: '⟳', bpm: [92, 118], scale: [0, 2, 4, 6, 8, 10],
    progs: [['C', 'D', 'Bb', 'C'], ['Am', 'D', 'C', 'E'], ['C', 'E', 'D', 'C']],
    rhythms: [[0, 4], [0, 2, 6], [0, 4, 6], [0, 3, 6]],
    bassPat: [[0, 'r'], [4, 'o']],
    drums: { kick: [0, 8], snare: [12], hat: [2, 6, 10, 14] }, fill: false, keepClash: true
  },
  datastream: {
    label: '資料流', icon: '⇊', bpm: [140, 168], scale: [9, 11, 0, 2, 4, 5, 7],
    progs: [['Am', 'F', 'C', 'G'], ['Am', 'C', 'G', 'Em'], ['Am', 'G', 'F', 'G']],
    rhythms: [[0, 2, 4, 6], [0, 1, 2, 4, 6], [0, 2, 4, 6, 7], [0, 3, 4, 7]],
    bassPat: [[0, 'r'], [2, 'o'], [4, 'r'], [6, 'o']],
    drums: { kick: [0, 4, 8, 12], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: true, minor: true
  },
  quantum: {
    label: '量子領域', icon: '⊙', bpm: [110, 138], scale: [0, 2, 4, 6, 8, 10],
    progs: [['C', 'D', 'E', 'C'], ['Am', 'Bb', 'C', 'D'], ['C', 'E', 'Bb', 'C']],
    rhythms: [[0, 2, 4, 6], [0, 3, 6], [0, 1, 4, 5], [0, 2, 4, 6, 7]],
    bassPat: [[0, 'r'], [2, 'o'], [4, 'r'], [6, 'o']],
    drums: { kick: [0, 4, 8, 12], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: false, keepClash: true
  },
  colony: {
    label: '廢棄殖民地', icon: '◨', bpm: [74, 98], scale: [9, 11, 0, 2, 4, 5, 7],
    progs: [['Am', 'Em', 'Dm', 'Am'], ['Am', 'G', 'Dm', 'Am'], ['Dm', 'Am', 'Em', 'Am']],
    rhythms: [[0], [0, 6], [0, 4], [0, 4, 7]],
    bassPat: [[0, 'r'], [6, 'r']],
    drums: { kick: [0, 10], snare: [], hat: [8] }, fill: false, minor: true
  },
  starport: {
    label: '星際港', icon: '✩', bpm: [112, 138], scale: [0, 2, 4, 6, 7, 9, 11],
    progs: [['C', 'D', 'G', 'C'], ['Cmaj7', 'D', 'Em7', 'G'], ['C', 'G', 'D', 'C']],
    rhythms: [[0, 2, 4], [0, 4, 6], [0, 2, 4, 6], [0, 3, 6]],
    bassPat: [[0, 'r'], [2, '5'], [4, 'r'], [6, 'o']],
    drums: { kick: [0, 8], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: true
  },
  hologram: {
    label: '全息投影', icon: '⬖', bpm: [76, 98], scale: [0, 2, 4, 6, 7, 9, 11],
    tone: { lead: 'piano' },
    progs: [['C', 'D', 'G', 'Em'], ['Cmaj7', 'D', 'Em7', 'G'], ['C', 'G', 'D', 'Em']],
    rhythms: [[0, 4], [0, 6], [0, 3, 6], [0, 4, 6]],
    bassPat: [[0, 'r'], [4, '5'], [6, 'o']],
    drums: { kick: [0, 10], snare: [], hat: [4, 12] }, fill: false
  },
  aiawaken: {
    label: 'AI覺醒', icon: '⏻', bpm: [120, 150], scale: [9, 11, 0, 2, 4, 5, 7],
    progs: [['Am', 'F', 'C', 'G'], ['Am', 'C', 'G', 'Em'], ['F', 'G', 'Am', 'Am']],
    rhythms: [[0, 4], [0, 2, 4, 6], [0, 2, 3, 4, 6], [0, 1, 2, 4, 6]],
    bassPat: [[0, 'r'], [2, 'o'], [4, '5'], [6, 'o']],
    drums: { kick: [0, 4, 8, 12], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: true, minor: true
  },
  antigrav: {
    label: '反重力', icon: '⇡', bpm: [96, 120], scale: [0, 2, 4, 6, 8, 10],
    progs: [['C', 'D', 'Bb', 'C'], ['C', 'E', 'D', 'C'], ['Am', 'D', 'C', 'E']],
    rhythms: [[0, 4], [0, 6], [0, 4, 6], [0, 2, 4, 6]],
    bassPat: [[0, 'r'], [4, 'o']],
    drums: { kick: [0, 8], snare: [12], hat: [2, 10] }, fill: false, keepClash: true
  },
  // ===== RPG（第二批追加）=====
  worldmap: {
    label: '世界地圖', icon: '✹', bpm: [116, 142], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['C', 'G', 'Am', 'F'], ['F', 'C', 'G', 'Am'], ['C', 'F', 'G', 'C'], ['Am', 'F', 'C', 'G']],
    rhythms: [[0, 2, 4], [0, 2, 4, 6], [0, 4, 6], [0, 2, 3, 4, 6]],
    bassPat: [[0, 'r'], [2, 'r'], [4, '5'], [6, 'r']],
    drums: { kick: [0, 6, 8], snare: [4, 12], hat: [2, 10] }, fill: true
  },
  ruins: {
    label: '古代遺跡', icon: '▧', bpm: [84, 108], scale: [9, 11, 0, 2, 4, 6, 7],
    progs: [['Am', 'G', 'Am', 'Em'], ['Am', 'D', 'Am', 'G'], ['Em', 'D', 'Am', 'Am']],
    rhythms: [[0], [0, 4], [0, 6], [0, 3, 6], [0, 2, 6]],
    bassPat: [[0, 'r'], [6, 'r']],
    drums: { kick: [0, 10], snare: [], hat: [4] }, fill: false, minor: true
  },
  elfwood: {
    label: '精靈森林', icon: '✲', bpm: [96, 120], scale: [9, 11, 0, 2, 4, 6, 7],
    progs: [['Am', 'D', 'Em', 'Am'], ['Am', 'Bm', 'D', 'Am'], ['Em', 'D', 'Am', 'G']],
    rhythms: [[0, 4], [0, 3, 6], [0, 4, 6], [0, 2, 5]],
    bassPat: [[0, 'r'], [4, '5'], [6, 'o']],
    drums: { kick: [0, 8], snare: [12], hat: [4, 12] }, fill: false, minor: true
  },
  royalcity: {
    label: '王城', icon: '♛', bpm: [100, 126], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['C', 'G', 'F', 'C'], ['C', 'F', 'G', 'C'], ['F', 'C', 'G', 'Am']],
    rhythms: [[0, 4], [0, 2, 4, 6], [0, 4, 6], [0, 3, 6]],
    bassPat: [[0, 'r'], [4, '5'], [6, 'o']],
    drums: { kick: [0, 8], snare: [4, 12], hat: [2, 10] }, fill: true
  },
  caravan: {
    label: '商隊之路', icon: '⛺', bpm: [112, 138], scale: [9, 11, 0, 2, 4, 5, 7],
    progs: [['Am', 'G', 'F', 'Am'], ['Am', 'Dm', 'G', 'Am'], ['Am', 'F', 'G', 'Am']],
    rhythms: [[0, 2, 4, 6], [0, 3, 4, 6], [0, 2, 4], [0, 2, 4, 6, 7]],
    bassPat: [[0, 'r'], [2, 'r'], [4, '5'], [6, 'r']],
    drums: { kick: [0, 4, 8, 12], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: false, minor: true
  },
  lostpath: {
    label: '迷失之路', icon: '⇝', bpm: [88, 112], scale: [9, 11, 0, 2, 4, 5, 7],
    progs: [['Am', 'Em', 'Dm', 'Am'], ['Am', 'Dm', 'Em', 'Am'], ['Dm', 'Am', 'Em', 'Em']],
    rhythms: [[0], [0, 5], [0, 4], [0, 3, 6]],
    bassPat: [[0, 'r'], [5, '5']],
    drums: { kick: [0, 10], snare: [8], hat: [6] }, fill: false, minor: true
  },
  // ===== 傳說 RPG（第二批追加）=====
  soul: {
    label: '決心之魂', icon: '♡', bpm: [72, 96], scale: [0, 2, 4, 5, 7, 9, 11],
    tone: { lead: 'piano' },
    progs: [['C', 'G', 'Am', 'F'], ['F', 'G', 'C', 'Am'], ['C', 'Em', 'F', 'G'], ['Am', 'F', 'C', 'G']],
    rhythms: [[0, 4], [0, 3, 6], [0, 6], [0, 4, 6], [0, 2, 5]],
    bassPat: [[0, 'r'], [4, '5'], [6, 'o']],
    drums: { kick: [0, 10], snare: [8] }, fill: false
  },
  forgotten: {
    label: '遺忘旋律', icon: '❣', bpm: [66, 90], scale: [9, 11, 0, 2, 4, 5, 7],
    tone: { lead: 'piano' },
    progs: [['Am', 'F', 'C', 'G'], ['Am', 'Em', 'F', 'G'], ['Dm', 'Am', 'Em', 'Am'], ['Am', 'F', 'G', 'Am']],
    rhythms: [[0, 4], [0, 6], [0, 3, 6], [0, 4, 7]],
    bassPat: [[0, 'r'], [4, '5']],
    drums: { kick: [], snare: [] }, fill: false, minor: true
  },
  starcradle: {
    label: '星之搖籃', icon: '✬', bpm: [68, 90], scale: [0, 2, 4, 6, 7, 9, 11],
    tone: { lead: 'piano' },
    progs: [['C', 'G', 'D', 'Em'], ['Cmaj7', 'D', 'Em7', 'G'], ['C', 'G', 'Am', 'Em']],
    rhythms: [[0, 4], [0, 6], [0, 3, 6], [0, 4, 6]],
    bassPat: [[0, 'r'], [4, '5'], [6, 'o']],
    drums: { kick: [0, 10], snare: [], hat: [4, 12] }, fill: false
  },
  oath: {
    label: '誓言', icon: '⚑', bpm: [100, 128], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['C', 'G', 'Am', 'F'], ['F', 'G', 'C', 'C'], ['Am', 'F', 'G', 'C'], ['C', 'F', 'G', 'Am']],
    rhythms: [[0, 2, 4], [0, 4, 6], [0, 2, 4, 6], [0, 2, 3, 4, 6]],
    bassPat: [[0, 'r'], [2, 'r'], [4, '5'], [6, 'r']],
    drums: { kick: [0, 8], snare: [4, 12], hat: [2, 10] }, fill: true
  },
  ghostwaltz: {
    label: '幽靈華爾滋', icon: '⚉', bpm: [110, 138], scale: [9, 11, 0, 2, 4, 5, 8],
    progs: [['Am', 'E', 'Am', 'Dm'], ['Am', 'Dm', 'E', 'Am'], ['Dm', 'Am', 'Bb', 'E']],
    rhythms: [[0, 3, 6], [0, 3], [0, 3, 5], [0, 2, 5]],
    bassPat: [[0, 'r'], [3, '5'], [6, '5']],
    drums: { kick: [0, 6], snare: [3, 9], hat: [0, 6, 12] }, fill: true, minor: true, keepClash: true
  },
  gentleend: {
    label: '溫柔終幕', icon: '❥', bpm: [64, 86], scale: [0, 2, 4, 5, 7, 9, 11],
    tone: { lead: 'piano' },
    progs: [['C', 'Am', 'F', 'G'], ['C', 'Em', 'F', 'G'], ['F', 'G', 'C', 'Am'], ['F', 'C', 'G', 'C']],
    rhythms: [[0, 4], [0, 6], [0, 3, 6], [0]],
    bassPat: [[0, 'r'], [4, '5']],
    drums: { kick: [], snare: [] }, fill: false
  },
  memoryshard: {
    label: '記憶碎片', icon: '◊', bpm: [72, 94], scale: [0, 2, 4, 5, 7, 9, 11],
    tone: { lead: 'piano' },
    progs: [['C', 'G', 'Am', 'Em'], ['Cmaj7', 'Fmaj7', 'Em7', 'Am7'], ['C', 'Am', 'F', 'G']],
    rhythms: [[0, 4], [0, 3, 6], [0, 6], [0, 4, 6]],
    bassPat: [[0, 'r'], [4, '5'], [6, 'o']],
    drums: { kick: [0, 10], snare: [8] }, fill: false
  },
  elegy: {
    label: '英雄輓歌', icon: '☙', bpm: [66, 90], scale: [9, 11, 0, 2, 4, 5, 8],
    tone: { lead: 'piano' },
    progs: [['Am', 'F', 'C', 'G'], ['Am', 'Dm', 'G', 'Am'], ['Am', 'Em', 'F', 'E'], ['Dm', 'Am', 'E', 'Am']],
    rhythms: [[0, 4], [0, 6], [0, 3, 6], [0]],
    bassPat: [[0, 'r'], [4, '5']],
    drums: { kick: [0, 10], snare: [8] }, fill: false, minor: true
  },
  reunion: {
    label: '重逢', icon: '⟡', bpm: [80, 108], scale: [0, 2, 4, 5, 7, 9, 11],
    tone: { lead: 'piano' },
    progs: [['C', 'G', 'Am', 'F'], ['F', 'G', 'C', 'Am'], ['C', 'F', 'G', 'C'], ['Am', 'F', 'C', 'G']],
    rhythms: [[0, 4], [0, 3, 6], [0, 2, 4], [0, 2, 4, 6]],
    bassPat: [[0, 'r'], [4, '5'], [6, 'o']],
    drums: { kick: [0, 8], snare: [12], hat: [4, 12] }, fill: true
  },
  // ===== 休閒（第二批追加）=====
  lazynoon: {
    label: '慵懶午後', icon: '⛱', bpm: [66, 88], scale: [0, 2, 4, 5, 7, 9, 11],
    tone: { lead: 'piano' },
    progs: [['Cmaj7', 'Am7', 'Dm7', 'G7'], ['Fmaj7', 'Em7', 'Dm7', 'Cmaj7'], ['Cmaj7', 'A7', 'Dm7', 'G7']],
    rhythms: [[0, 4], [0, 3, 6], [0, 6], [0, 3]],
    bassPat: [[0, 'r'], [4, '5'], [7, '3']],
    drums: { kick: [0, 10], snare: [8], hat: [4, 12] }, fill: false
  },
  catday: {
    label: '貓咪日常', icon: '◕', bpm: [84, 106], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['C', 'Am', 'F', 'G'], ['C', 'F', 'Dm', 'G'], ['F', 'G', 'C', 'Am']],
    rhythms: [[0, 4], [0, 3, 6], [0, 2, 4], [0, 4, 6]],
    bassPat: [[0, 'r'], [4, '5'], [6, 'r']],
    drums: { kick: [0, 8], snare: [12], hat: [4, 12] }, fill: false
  },
  fishingtime: {
    label: '釣魚時光', icon: '⟢', bpm: [68, 90], scale: [0, 2, 4, 5, 7, 9, 11],
    tone: { lead: 'piano' },
    progs: [['C', 'F', 'C', 'G'], ['C', 'Am', 'F', 'G'], ['F', 'C', 'G', 'C']],
    rhythms: [[0, 4], [0, 6], [0, 3, 6], [0]],
    bassPat: [[0, 'r'], [4, '5']],
    drums: { kick: [0, 10], snare: [8], hat: [12] }, fill: false
  },
  dessert: {
    label: '甜點時間', icon: '✽', bpm: [80, 102], scale: [0, 2, 4, 5, 7, 9, 11],
    tone: { lead: 'piano' },
    progs: [['C', 'G', 'Am', 'F'], ['C', 'Em', 'F', 'G'], ['F', 'G', 'C', 'Am']],
    rhythms: [[0, 4], [0, 3, 6], [0, 6], [0, 4, 6]],
    bassPat: [[0, 'r'], [4, '5'], [6, 'o']],
    drums: { kick: [0, 8], snare: [], hat: [4, 12] }, fill: false
  },
  stroll: {
    label: '悠閒散步', icon: '↝', bpm: [96, 118], scale: [0, 2, 4, 5, 7, 9, 11],
    progs: [['C', 'F', 'G', 'C'], ['C', 'Am', 'Dm', 'G'], ['F', 'C', 'G', 'Am']],
    rhythms: [[0, 4], [0, 2, 4], [0, 4, 6], [0, 3, 4, 6]],
    bassPat: [[0, 'r'], [2, '5'], [4, 'r'], [6, '5']],
    drums: { kick: [0, 8], snare: [4, 12], hat: [4, 12] }, fill: false
  },
  daydream: {
    label: '發呆時光', icon: '◌', bpm: [64, 86], scale: [0, 2, 4, 6, 7, 9, 11],
    tone: { lead: 'piano' },
    progs: [['C', 'D', 'G', 'Em'], ['Cmaj7', 'D', 'Em7', 'G'], ['C', 'G', 'D', 'Em']],
    rhythms: [[0, 4], [0, 6], [0, 3, 6], [0]],
    bassPat: [[0, 'r'], [4, '5'], [6, 'o']],
    drums: { kick: [0, 10], snare: [], hat: [8] }, fill: false
  },
  slowcafe: {
    label: '慢活咖啡', icon: '⚬', bpm: [66, 88], scale: [0, 2, 4, 5, 7, 9, 11],
    tone: { lead: 'piano' },
    progs: [['Cmaj7', 'Am7', 'Dm7', 'G7'], ['Fmaj7', 'Em7', 'Dm7', 'Cmaj7'], ['Am7', 'Dm7', 'G7', 'Cmaj7']],
    rhythms: [[0, 3], [0, 4, 7], [0, 3, 6], [0, 4]],
    bassPat: [[0, 'r'], [4, '5'], [7, '3']],
    drums: { kick: [0, 10], snare: [8], hat: [4, 12] }, fill: false
  },
  bedtime: {
    label: '睡前時光', icon: '⚝', bpm: [58, 78], scale: [0, 2, 4, 5, 7, 9, 11],
    tone: { lead: 'piano' },
    progs: [['C', 'Am', 'F', 'G'], ['C', 'Em', 'Am', 'F'], ['F', 'C', 'G', 'C']],
    rhythms: [[0, 4], [0, 6], [0], [0, 3, 6]],
    bassPat: [[0, 'r'], [4, '5']],
    drums: { kick: [], snare: [] }, fill: false
  },
  gardening: {
    label: '種花日和', icon: '❊', bpm: [84, 106], scale: [0, 2, 4, 5, 7, 9, 11],
    tone: { lead: 'piano' },
    progs: [['C', 'G', 'Am', 'F'], ['C', 'F', 'Dm', 'G'], ['F', 'G', 'C', 'Am']],
    rhythms: [[0, 4], [0, 3, 6], [0, 6], [0, 4, 6]],
    bassPat: [[0, 'r'], [4, '5'], [6, 'o']],
    drums: { kick: [0, 8], snare: [], hat: [4, 12] }, fill: false
  },
  // ===== 頭目戰（第二批追加）=====
  abyss: {
    label: '深淵領主', icon: '⬣', bpm: [120, 150], scale: [9, 10, 1, 2, 4, 5, 8],
    progs: [['Am', 'Bb', 'Am', 'E'], ['Dm', 'Bb', 'E', 'Am'], ['Am', 'Bb', 'E', 'Am']],
    rhythms: [[0, 2, 4, 6], [0, 1, 2, 4, 6], [0, 2, 3, 4, 6, 7], [0, 1, 4, 5]],
    bassPat: [[0, 'r'], [1, 'r'], [2, 'r'], [4, 'r'], [6, 'r']],
    drums: { kick: [0, 4, 8, 12], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: true, minor: true, keepClash: true
  },
  fallenAngel: {
    label: '墮天使', icon: '✞', bpm: [138, 166], scale: [9, 11, 0, 2, 4, 5, 8],
    progs: [['Am', 'F', 'G', 'E'], ['Am', 'Dm', 'Bb', 'E'], ['F', 'E', 'Am', 'Am'], ['Am', 'F', 'E', 'Am']],
    rhythms: [[0, 4], [0, 2, 4, 6], [0, 4, 6, 7], [0, 2, 3, 4, 6]],
    bassPat: [[0, 'r'], [2, 'r'], [4, '5'], [6, 'r'], [7, '5']],
    drums: { kick: [0, 4, 8, 12], snare: [4, 12], hat: [2, 10] }, fill: true, minor: true
  },
  chaos: {
    label: '混沌核心', icon: '☢', bpm: [150, 182], scale: [9, 10, 1, 2, 4, 5, 8],
    progs: [['Am', 'Bb', 'Eb', 'E'], ['Am', 'Eb', 'Bb', 'E'], ['Dm', 'Bb', 'Eb', 'Am']],
    rhythms: [[0, 1, 2, 4, 6], [0, 2, 3, 4, 6, 7], [0, 1, 2, 4, 5, 6, 7], [0, 2, 4, 5, 6, 7]],
    bassPat: [[0, 'r'], [1, 'r'], [2, 'r'], [3, 'r'], [4, 'r'], [5, 'r'], [6, 'r'], [7, 'r']],
    drums: { kick: [0, 4, 8, 12], snare: [4, 10, 12], hat: [2, 6, 14] }, fill: true, minor: true, keepClash: true
  },
  lich: {
    label: '亡靈君王', icon: '⛤', bpm: [112, 140], scale: [9, 11, 0, 2, 4, 5, 8],
    progs: [['Am', 'Dm', 'E', 'Am'], ['Am', 'Bb', 'E', 'Am'], ['Dm', 'Am', 'E', 'Am']],
    rhythms: [[0, 2, 4, 6], [0, 1, 4, 5], [0, 2, 4, 6, 7], [0, 3, 4, 7]],
    bassPat: [[0, 'r'], [2, 'r'], [4, '5'], [6, 'r']],
    drums: { kick: [0, 4, 8, 12], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: true, minor: true, keepClash: true
  },
  colossus: {
    label: '巨神兵', icon: '◼', bpm: [120, 148], scale: [9, 10, 0, 2, 4, 5, 8],
    progs: [['Am', 'Bb', 'Am', 'Gm'], ['Am', 'Gm', 'Bb', 'Am'], ['Am', 'Bb', 'E', 'Am']],
    rhythms: [[0, 4], [0, 2, 4, 6], [0, 1, 4, 6], [0, 2, 4, 6, 7]],
    bassPat: [[0, 'r'], [1, 'r'], [2, 'r'], [4, 'r'], [5, 'r'], [6, 'r']],
    drums: { kick: [0, 4, 8, 12], snare: [8] }, fill: true, minor: true, keepClash: true
  },
  twins: {
    label: '雙生子', icon: '⧓', bpm: [156, 186], scale: [9, 11, 0, 2, 4, 5, 8],
    progs: [['Am', 'F', 'E', 'Am'], ['Am', 'C', 'F', 'E'], ['Dm', 'Am', 'E', 'Am']],
    rhythms: [[0, 2, 4, 6], [0, 1, 2, 4, 6], [0, 2, 3, 4, 6, 7], [0, 2, 4, 5, 6, 7]],
    bassPat: [[0, 'r'], [1, 'o'], [2, 'r'], [3, 'o'], [4, '5'], [5, 'o'], [6, 'r'], [7, 'o']],
    drums: { kick: [0, 4, 8, 12], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: true, minor: true
  },
  timelord: {
    label: '時間支配者', icon: '⧖', bpm: [150, 180], scale: [0, 2, 4, 6, 8, 10],
    progs: [['C', 'D', 'E', 'C'], ['Am', 'Bb', 'C', 'D'], ['C', 'E', 'Bb', 'C']],
    rhythms: [[0, 2, 4, 6], [0, 1, 2, 4, 6], [0, 2, 3, 4, 6, 7], [0, 2, 4, 5, 6]],
    bassPat: [[0, 'r'], [2, 'o'], [4, 'r'], [6, 'o']],
    drums: { kick: [0, 4, 8, 12], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: true, keepClash: true
  },
  truefinal: {
    label: '真·最終戰', icon: '✯', bpm: [168, 200], scale: [9, 11, 0, 2, 4, 5, 8],
    progs: [['Am', 'F', 'G', 'E'], ['Am', 'Bb', 'F', 'E'], ['Dm', 'Bb', 'E', 'Am'], ['Am', 'G', 'F', 'E']],
    rhythms: [[0, 2, 4, 6], [0, 1, 2, 4, 6], [0, 2, 3, 4, 6, 7], [0, 1, 2, 4, 5, 6, 7]],
    bassPat: [[0, 'r'], [1, 'o'], [2, 'r'], [3, 'o'], [4, '5'], [5, 'o'], [6, 'r'], [7, 'o']],
    drums: { kick: [0, 4, 8, 12], snare: [4, 12], hat: [2, 6, 10, 14] }, fill: true, minor: true, keepClash: true
  },
};

export const THEME_ORDER = Object.keys(THEMES);

// 曲風分類選單
export const CATEGORIES = [
  { id: 'nature',   label: '大自然',   themes: ['bright', 'forest', 'snow', 'desert', 'beach', 'cave', 'swamp', 'mountain', 'firefly', 'waterfall', 'flowerfield', 'thunderstorm', 'deepsea', 'aurora', 'bamboo'] },
  { id: 'city',     label: '都市',     themes: ['edm', 'factory', 'neon', 'station', 'rooftop', 'cafestreet', 'subway', 'skyline', 'nightmarket', 'citypark', 'mall', 'ferriswheel', 'rainstreet', 'gamecenter', 'overpass'] },
  { id: 'village',  label: '村莊',     themes: ['pastoral', 'wafu', 'fishing', 'market', 'hamlet', 'bakery', 'florist', 'clocktower', 'farm', 'windmill', 'festvillage', 'wellside', 'ranch', 'chapel', 'orchard'] },
  { id: 'facility', label: '特殊設施', themes: ['temple', 'dungeon', 'library', 'alchemy', 'casino', 'prison', 'lab', 'arena', 'training', 'portal', 'belltower', 'clinic', 'workshop', 'observatory', 'controlroom'] },
  { id: 'indoor',   label: '室內',     themes: ['rainynight', 'tavern', 'ballroom', 'shop', 'musicbox', 'bedroom', 'study', 'kitchen', 'attic', 'bathhouse', 'lockerroom', 'livingroom', 'greenhouse', 'secretroom', 'fireplace'] },
  { id: 'scifi',    label: '科幻世界', themes: ['space', 'spacestation', 'cyberchase', 'alien', 'mothership', 'virtual', 'robotcity', 'timewarp', 'datastream', 'quantum', 'colony', 'starport', 'hologram', 'aiawaken', 'antigrav'] },
  { id: 'rpg',      label: 'RPG',      themes: ['journey', 'battle', 'chase', 'sad', 'title', 'victory', 'gameover', 'skycity', 'pirate', 'worldmap', 'ruins', 'elfwood', 'royalcity', 'caravan', 'lostpath'] },
  { id: 'legend',   label: '傳說RPG',  themes: ['fated', 'heartbattle', 'bonedance', 'bonds', 'determination', 'finalhope', 'soul', 'forgotten', 'starcradle', 'oath', 'ghostwaltz', 'gentleend', 'memoryshard', 'elegy', 'reunion'] },
  { id: 'casual',   label: '休閒',     themes: ['arcade', 'festival', 'onsen', 'minigame', 'puzzle', 'picnic', 'lazynoon', 'catday', 'fishingtime', 'dessert', 'stroll', 'daydream', 'slowcafe', 'bedtime', 'gardening'] },
  { id: 'boss',     label: '頭目戰',   themes: ['lastboss', 'rival', 'fallenhero', 'mechabeast', 'witch', 'dragon', 'hiddenboss', 'abyss', 'fallenAngel', 'chaos', 'lich', 'colossus', 'twins', 'timelord', 'truefinal'] },
];

// 段落種類中文標籤與顏色
export const SEC_INFO = {
  A:  { label: '主歌',  color: '#4f7dff' },
  A2: { label: '主歌′', color: '#3f64cc' },
  B:  { label: '橋段',  color: '#c77dff' },
  S:  { label: '副歌',  color: '#ff5f3c' },
  C:  { label: '間奏',  color: '#4ade8c' },
};

// 曲式規劃：依小節數排出段落（kind, bars）
export function planSections(bars, form = 'auto', rng) {
  const P = {
    2: [['S', 2]],
    4: [['A', 2], ['S', 2]],
    8: [['A', 2], ['A2', 2], ['B', 2], ['S', 2]],
    16: [['A', 4], ['A2', 4], ['B', 4], ['S', 4]],
    32: [['A', 4], ['A2', 4], ['B', 4], ['S', 4], ['C', 4], ['A', 4], ['S', 4], ['S', 4]],
  };
  let plan = P[bars] || P[8];
  if (form === 'hookfirst' && bars >= 8) {
    plan = bars >= 32
      ? [['S', 4], ['A', 4], ['A2', 4], ['B', 4], ['S', 4], ['C', 4], ['B', 4], ['S', 4]]
      : bars >= 16 ? [['S', 4], ['A', 4], ['B', 4], ['S', 4]] : [['S', 2], ['A', 2], ['B', 2], ['S', 2]];
  } else if (form === 'loop' && bars >= 8) {
    plan = bars >= 32
      ? [['A', 4], ['A2', 4], ['B', 4], ['B', 4], ['A', 4], ['A2', 4], ['B', 4], ['B', 4]]
      : bars >= 16 ? [['A', 4], ['A2', 4], ['B', 4], ['A2', 4]] : [['A', 2], ['A2', 2], ['B', 2], ['A2', 2]];
  } else if (form === 'boss' && bars >= 8) {
    plan = bars >= 32
      ? [['C', 4], ['A', 4], ['A2', 4], ['S', 4], ['B', 4], ['A', 4], ['S', 4], ['S', 4]]
      : bars >= 16 ? [['C', 2], ['A', 6], ['S', 4], ['S', 4]] : [['C', 2], ['A', 2], ['S', 2], ['S', 2]];
  }
  let start = 0;
  return plan.map(([kind, b]) => { const s = { kind, startBar: start, bars: b }; start += b; return s; });
}
