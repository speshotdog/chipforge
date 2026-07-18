// 無頭自動作曲入口（給 ChipTube 量產管線用，網頁 UI 不會載入這支）
// 用法：Playwright 開 auto.html 後呼叫 window.chipforgeAuto(opts)
// opts: { theme:'snow'|'random', bars:32, count:14, director:'auto', loops:2,
//         gen:{...滑桿覆寫}, mixer:{...混音台覆寫，如 duty:{lead:'piano'}}, night:true }
// 回傳: { wavB64, nightWavB64?, meta:{ theme, label, icon, seed, score, bpm, steps,
//         shareHash, nightBpm?, nightSeed?, nightLoopDur?, nightShareHash? } }
import { forge } from './js/director.js';
import { nightVariant, NIGHT_MIXER_PATCH } from './js/composer.js';
import { defaultGen, defaultMixer } from './js/state.js';
import { THEMES, THEME_ORDER } from './js/themes.js';
import { MOTIF_LIBRARY } from './js/motifs.js';
import { ChipSynth } from './js/synth.js';
import { scheduleStep } from './js/scheduler.js';
import { songToUrl, songFromHash } from './js/exporter.js';

// 與 exporter.js encodeWav 相同邏輯（該函式未匯出，為不動原始碼在此複製）
function encodeWav(buf) {
  const ch = buf.numberOfChannels, len = buf.length, rate = buf.sampleRate;
  const bytes = 44 + len * ch * 2;
  const ab = new ArrayBuffer(bytes), dv = new DataView(ab);
  const ws = (o, s) => { for (let i = 0; i < s.length; i++) dv.setUint8(o + i, s.charCodeAt(i)); };
  ws(0, 'RIFF'); dv.setUint32(4, bytes - 8, true); ws(8, 'WAVE');
  ws(12, 'fmt '); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true);
  dv.setUint16(22, ch, true); dv.setUint32(24, rate, true);
  dv.setUint32(28, rate * ch * 2, true); dv.setUint16(32, ch * 2, true); dv.setUint16(34, 16, true);
  ws(36, 'data'); dv.setUint32(40, len * ch * 2, true);
  const chans = [];
  for (let c = 0; c < ch; c++) chans.push(buf.getChannelData(c));
  let o = 44;
  for (let i = 0; i < len; i++)
    for (let c = 0; c < ch; c++) {
      const v = Math.max(-1, Math.min(1, chans[c][i]));
      dv.setInt16(o, v < 0 ? v * 0x8000 : v * 0x7fff, true);
      o += 2;
    }
  return ab;
}

function crushBuffer(buf, bits, red) {
  const levels = Math.pow(2, bits);
  for (let ch = 0; ch < buf.numberOfChannels; ch++) {
    const d = buf.getChannelData(ch);
    let hold = 0;
    for (let i = 0; i < d.length; i++) {
      if (i % red === 0) hold = Math.round(d[i] * levels) / levels;
      d[i] = d[i] * 0.4 + hold * 0.6;
    }
  }
}

function abToB64(ab) {
  const u8 = new Uint8Array(ab);
  const CHUNK = 0x8000;
  let s = '';
  for (let i = 0; i < u8.length; i += CHUNK)
    s += String.fromCharCode.apply(null, u8.subarray(i, i + CHUNK));
  return btoa(s);
}

// 混音台深合併（vol/mute/solo/duty 為巢狀物件）
function mergeMixer(base, ov) {
  if (!ov) return base;
  const out = { ...base, ...ov };
  for (const k of ['vol', 'mute', 'solo', 'duty'])
    if (ov[k]) out[k] = { ...base[k], ...ov[k] };
  return out;
}

async function renderWav(song, mixer, loops) {
  const sd = 60 / song.bpm / 4;
  const loopDur = song.steps * sd;
  const total = loopDur * loops + 1.6;
  const rate = 44100;
  const off = new OfflineAudioContext(2, Math.ceil(rate * total), rate);
  const synth = new ChipSynth(off, () => ({ ...mixer, retro: false }));
  synth.setBpm(song.bpm);
  for (let loop = 0; loop < loops; loop++)
    for (let s = 0; s < song.steps; s++)
      scheduleStep(synth, song, mixer, s, 0.05 + loop * loopDur + s * sd, sd);
  const buf = await off.startRendering();
  if (mixer.retro) crushBuffer(buf, 5, 4);
  return abToB64(encodeWav(buf));
}

const hashOf = url => url.slice(url.indexOf('#'));

window.chipforgeAuto = async function (opts = {}) {
  const mixer = mergeMixer(defaultMixer(), opts.mixer);
  const loops = opts.loops ?? 2;
  const gen = { ...defaultGen(), ...(opts.gen || {}) };
  if (opts.director) gen.director = opts.director;
  // 動機庫：opts.motifId 從庫挑、opts.motif 直接給（rhythm/contour 16 步格式）
  if (opts.motifId) {
    const m = MOTIF_LIBRARY.find(x => x.id === opts.motifId);
    if (m) gen.motif = { rhythm: m.rhythm, contour: m.contour };
  } else if (opts.motif && opts.motif.rhythm) {
    gen.motif = { rhythm: opts.motif.rhythm, contour: opts.motif.contour || [] };
  }

  let song, best = null, picked = [];
  if (opts.songHash) {
    // 從分享連結 hash 還原既有曲子（重渲/補夜版用，不重新作曲）
    song = await songFromHash(opts.songHash);
    if (!song) throw new Error('songHash 解析失敗');
  } else {
    let theme = opts.theme || 'random';
    if (theme === 'random' || !THEMES[theme])
      theme = THEME_ORDER[Math.floor(Math.random() * THEME_ORDER.length)];
    const bars = opts.bars || 32;
    const steps = bars * 16;
    const count = opts.count || 14;
    picked = await forge({ theme, steps, gen, count });
    best = picked[0]; // forge 已排序＋多樣性挑選，[0] = 最高分
    song = best.song;
  }
  const T = THEMES[song.theme] || { label: song.theme, icon: '' };
  const bars = song.steps / 16;

  // 曲子自帶主奏音色 → 套進混音台（呼叫端有明確指定 duty 就尊重呼叫端）
  const dayMixer = (song.tone && !(opts.mixer && opts.mixer.duty))
    ? mergeMixer(mixer, { duty: song.tone }) : mixer;

  const result = {
    // skipRender：曲庫量產模式——只作曲取 shareHash，不渲染 WAV（快 ~50 倍）
    wavB64: opts.skipRender ? null : await renderWav(song, dayMixer, loops),
    meta: {
      theme: song.theme, label: T.label, icon: T.icon,
      seed: song.seed, score: best ? Math.round(best.score * 1000) / 1000 : null,
      bpm: song.bpm, steps: song.steps, bars, loops, drumless: !!song.drumless,
      tone: (song.tone || {}).lead || null,
      archetype: song.archetype || 'groove',
      motifId: opts.motifId || (gen.motif ? 'custom' : null),
      loopDur: song.steps * (60 / song.bpm / 4), sampleRate: 44100,
      shareHash: hashOf(await songToUrl(song)),
      gen,
      candidates: picked.map(p => ({ seed: p.seed, score: Math.round(p.score * 1000) / 1000 })),
    },
  };

  if (opts.night && !opts.skipRender) {
    const night = nightVariant(song);
    // 自適應夜版速度：nightVariant 寫死 x0.78 對中慢速曲太慢（實測 BPM 106→83 拖行、
    // 171→133 剛好）。快歌維持 0.78，BPM<=115 只降 0.88，中間線性過渡。可用 opts.nightRatio 強制。
    const r = opts.nightRatio ??
      (song.bpm >= 160 ? 0.78 : song.bpm <= 115 ? 0.88 : 0.88 - (song.bpm - 115) * (0.10 / 45));
    night.bpm = Math.max(60, Math.round(song.bpm * r));
    const nightMixer = mergeMixer(dayMixer, NIGHT_MIXER_PATCH); // 夜版 patch 最後蓋（lead 統一鋼琴）
    result.nightWavB64 = await renderWav(night, nightMixer, loops);
    result.meta.nightBpm = night.bpm;
    result.meta.nightSeed = night.seed;
    result.meta.nightLoopDur = night.steps * (60 / night.bpm / 4);
    result.meta.nightShareHash = hashOf(await songToUrl(night));
  }
  return result;
};
