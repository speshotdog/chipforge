// 匯出：WAV（離線渲染×2循環）/ MIDI / JSON / 分享連結（deflate+base64url）
import { ChipSynth } from './synth.js';
import { scheduleStep } from './scheduler.js';
import { rowToMidi, ROWS } from './theory.js';

function download(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}

const stamp = () => new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '').slice(0, 12);

// ---- WAV ----
export async function exportWav(song, mixer) {
  const sd = 60 / song.bpm / 4;
  const loopDur = song.steps * sd;
  const total = loopDur * 2 + 1.6;
  const rate = 44100;
  const off = new OfflineAudioContext(2, Math.ceil(rate * total), rate);
  const synth = new ChipSynth(off, () => ({ ...mixer, retro: false }));
  synth.setBpm(song.bpm);
  for (let loop = 0; loop < 2; loop++)
    for (let s = 0; s < song.steps; s++)
      scheduleStep(synth, song, mixer, s, 0.05 + loop * loopDur + s * sd, sd);
  let buf = await off.startRendering();
  if (mixer.retro) crushBuffer(buf, 5, 4);
  download(new Blob([encodeWav(buf)], { type: 'audio/wav' }), `chipforge_${stamp()}.wav`);
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

// ---- MIDI ----
function vlq(n) {
  n = Math.max(0, Math.round(n));
  const bytes = [n & 0x7f];
  while ((n >>>= 7)) bytes.unshift((n & 0x7f) | 0x80);
  return bytes;
}

export function exportMidi(song, mixer) {
  const TPQ = 480; // ticks per quarter；1 步 = 120
  const TPS = TPQ / 4;
  const CHS = {
    lead: { ch: 0, prog: 80 }, harm: { ch: 1, prog: 81 },
    bass: { ch: 2, prog: 38 }, noise: { ch: 3, prog: 99 },
  };
  if ((mixer.duty || {}).lead === 'piano') CHS.lead.prog = 0;  // 平台鋼琴
  if ((mixer.duty || {}).harm === 'piano') CHS.harm.prog = 0;
  const tracks = [];

  // 速度軌
  const tempo = Math.round(60000000 / song.bpm);
  tracks.push([
    0, 0xff, 0x51, 0x03, (tempo >> 16) & 0xff, (tempo >> 8) & 0xff, tempo & 0xff,
    0, 0xff, 0x2f, 0x00,
  ]);

  for (const [inst, cfg] of Object.entries(CHS)) {
    const evs = [];
    for (const [k, v] of Object.entries(song.notes)) {
      if (v !== inst) continue;
      const [r, c] = k.split(',').map(Number);
      let midi = rowToMidi(r);
      if (inst === 'bass') midi -= 12;
      const span = song.spans[k] || 1;
      const vel = [70, 95, 118][(song.vels[k] || 1) - 1] || 95;
      evs.push({ t: c * TPS, on: true, midi, vel });
      evs.push({ t: (c + span) * TPS - 2, on: false, midi, vel: 0 });
    }
    evs.sort((a, b) => a.t - b.t || (a.on ? 1 : -1));
    const data = [0, 0xc0 | cfg.ch, cfg.prog];
    let last = 0;
    for (const e of evs) {
      data.push(...vlq(e.t - last), (e.on ? 0x90 : 0x80) | cfg.ch, e.midi, e.vel);
      last = e.t;
    }
    data.push(0, 0xff, 0x2f, 0x00);
    tracks.push(data);
  }

  // 鼓軌（ch10）：先攤平成 on/off 事件再排序，避免同拍多鼓造成負 delta
  const DRUM_KEY = [36, 38, 42];
  const devs = [];
  for (const [k, v] of Object.entries(song.drums)) {
    if (!v) continue;
    const [l, c] = k.split(',').map(Number);
    devs.push({ t: c * TPS, on: true, midi: DRUM_KEY[l], vel: v === 2 ? 118 : 92 });
    devs.push({ t: c * TPS + Math.floor(TPS / 2), on: false, midi: DRUM_KEY[l], vel: 0 });
  }
  devs.sort((a, b) => a.t - b.t || (a.on ? 1 : -1));
  const dd = [];
  let last = 0;
  for (const e of devs) {
    dd.push(...vlq(e.t - last), (e.on ? 0x99 : 0x89), e.midi, e.vel);
    last = e.t;
  }
  dd.push(0, 0xff, 0x2f, 0x00);
  tracks.push(dd);

  const bytes = [];
  const w16 = n => [n >> 8 & 0xff, n & 0xff];
  const w32 = n => [n >> 24 & 0xff, n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff];
  bytes.push(0x4d, 0x54, 0x68, 0x64, ...w32(6), ...w16(1), ...w16(tracks.length), ...w16(TPQ));
  for (const t of tracks) bytes.push(0x4d, 0x54, 0x72, 0x6b, ...w32(t.length), ...t);
  download(new Blob([new Uint8Array(bytes)], { type: 'audio/midi' }), `chipforge_${stamp()}.mid`);
}

// ---- JSON ----
export function exportJson(song) {
  download(new Blob([JSON.stringify(song)], { type: 'application/json' }), `chipforge_${stamp()}.json`);
}

export function importJson(file, cb) {
  const rd = new FileReader();
  rd.onload = () => {
    try {
      const s = JSON.parse(rd.result);
      if (!s.notes || !s.steps) throw new Error('bad');
      cb(s);
    } catch (e) { alert('讀取失敗：不是有效的 ChipForge 檔案'); }
  };
  rd.readAsText(file);
}

// ---- 分享連結（BeepBox 精神：曲子活在網址裡）----
const b64u = a => btoa(String.fromCharCode(...a)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64u = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));

export async function songToUrl(song) {
  const json = new TextEncoder().encode(JSON.stringify(song));
  let payload, tag;
  if (typeof CompressionStream !== 'undefined') {
    const cs = new CompressionStream('deflate-raw');
    const stream = new Blob([json]).stream().pipeThrough(cs);
    payload = new Uint8Array(await new Response(stream).arrayBuffer());
    tag = 'z';
  } else { payload = json; tag = 'j'; }
  return location.origin + location.pathname + '#' + tag + '=' + b64u(payload);
}

export async function songFromHash(hash) {
  const m = /^#([zj])=(.+)$/.exec(hash || '');
  if (!m) return null;
  try {
    const bytes = unb64u(m[2]);
    let json;
    if (m[1] === 'z') {
      const ds = new DecompressionStream('deflate-raw');
      const stream = new Blob([bytes]).stream().pipeThrough(ds);
      json = await new Response(stream).text();
    } else json = new TextDecoder().decode(bytes);
    const s = JSON.parse(json);
    return (s.notes && s.steps) ? s : null;
  } catch (e) { return null; }
}
