// 作曲引擎：段落規劃 → 和弦 → 旋律/和聲/貝斯/鼓 → 修復通道
// 精神繼承 EASY 8BIT EDITOR 的 生成→修復 思路，全部重新實作
import { CHORDS, SUB_DARK, SUB_BRIGHT, Rng, pc, midiToRow, rowToMidi, isChordTone, nearestChordTone, scaleWalk, chordAwareScale, SEG } from './theory.js';
import { THEMES, planSections } from './themes.js';
import { emptySong } from './state.js';

const LEAD_LO = 64, LEAD_HI = 83;
const HARM_LO = 60, HARM_HI = 76;
const BASS_LO = 60, BASS_HI = 77;

export function composeSong({ theme, steps, gen, seed }) {
  const T = THEMES[theme] || THEMES.bright;
  const rng = new Rng(seed);
  const bars = steps / 16;
  const d = gen.density / 100, rD = gen.rhythm / 100, sp = gen.speed / 100;
  const dr = gen.drama / 100, hk = gen.hook / 100, sm = gen.smooth / 100;
  const moodAmt = (gen.mood - 50) / 50;

  const song = emptySong(bars, Math.round(T.bpm[0] + (T.bpm[1] - T.bpm[0]) * sp));
  song.steps = steps;
  song.theme = theme;
  song.seed = seed;
  song.chords = [];

  const sections = planSections(bars, gen.form, rng);
  song.secTags = sections;

  // ---- 和弦 ----
  const progCache = {};
  const progFor = (kind) => {
    if (dr < 0.34) { progCache.all ||= rng.pick(T.progs); return progCache.all; }
    if (dr < 0.67) { const g = kind === 'A2' ? 'A' : kind; progCache[g] ||= rng.pick(T.progs); return progCache[g]; }
    return rng.pick(T.progs);
  };
  const moodChord = (ch, isLast) => {
    const amt = Math.abs(moodAmt);
    if (isLast || amt < 0.2) return ch;
    const map = moodAmt < 0 ? SUB_DARK : SUB_BRIGHT;
    return (map[ch] && rng.chance((amt - 0.2) / 0.8 * 0.85)) ? map[ch] : ch;
  };
  const totalSegs = steps / SEG;
  sections.forEach(sec => {
    const prog = progFor(sec.kind);
    const segs = sec.bars * 2;
    for (let i = 0; i < segs; i++) {
      const isLast = song.chords.length === totalSegs - 1;
      song.chords.push(moodChord(prog[i % prog.length], isLast));
    }
  });

  // ---- 旋律 ----
  const pcsAt = seg => CHORDS[song.chords[seg]] || [0, 4, 7];
  const centerOf = { A: 71, A2: 71, B: 74, S: 76, C: 68 };
  let cur = rng.rint(70, 75);
  let storedA = null; // A 段內容（notes/spans/vels），供 A2 複製
  const leadOnsets = [];

  const pickRhythm = (energy) => {
    // 依密度 + 段落能量挑節奏型（長度加權）
    const want = Math.round(1 + (d * 0.7 + energy * 0.3) * (T.rhythms.reduce((m, r) => Math.max(m, r.length), 0) - 1));
    const pool = T.rhythms.filter(r => Math.abs(r.length - want) <= 1);
    return rng.pick(pool.length ? pool : T.rhythms);
  };

  const maxLeap = 3 + Math.round((1 - sm) * 7); // 滑順→3 半音；跳躍→10

  const placeLead = (c, midi, span, vel = 1) => {
    midi = Math.max(LEAD_LO, Math.min(LEAD_HI, midi));
    const r = midiToRow(midi);
    const key = r + ',' + c;
    song.notes[key] = 'lead';
    if (span > 1) song.spans[key] = span;
    if (vel > 1) song.vels[key] = vel;
    leadOnsets.push({ c, midi, key });
    return midi;
  };

  const writeSegment = (secKind, secStart, sg, motif, energy, forceMotif = false) => {
    const seg = (secStart + sg * SEG) / SEG;
    const pcs = pcsAt(seg);
    const scale = chordAwareScale(T.scale, pcs, T.keepClash);
    const center = centerOf[secKind] || 71;
    let rhythm;
    let contour = null;
    if (motif && (forceMotif || rng.chance(hk * 0.85))) {
      rhythm = motif.rhythm; contour = motif.contour; // フック：重用動機
    } else {
      rhythm = pickRhythm(energy);
      if (sg === 0 && !rhythm.includes(0)) rhythm = [0, ...rhythm];
    }
    const placed = [];
    rhythm.forEach((off, i) => {
      const c = secStart + sg * SEG + off;
      const strong = off % 4 === 0;
      let midi;
      if (contour && contour[i] !== undefined) {
        midi = nearestChordTone(motif.base + contour[i], strong ? pcs : pcs, LEAD_LO, LEAD_HI);
        if (!strong) midi = scaleWalk(motif.base + contour[i], scale, 0, LEAD_LO, LEAD_HI);
      } else if (strong || rng.chance(0.55)) {
        const drift = Math.round((center - cur) * 0.3) + rng.rint(-2, 2);
        midi = nearestChordTone(cur + drift, pcs, LEAD_LO, LEAD_HI);
      } else {
        midi = scaleWalk(cur, scale, rng.rint(-2, 2) || 1, LEAD_LO, LEAD_HI);
      }
      if (Math.abs(midi - cur) > maxLeap && placed.length) {
        midi = scaleWalk(cur, scale, midi > cur ? 1 : -1, LEAD_LO, LEAD_HI);
      }
      const nextOff = rhythm[i + 1] ?? SEG;
      let gap = nextOff - off;
      let span = energy > 0.6 ? gap : Math.max(1, Math.round(gap * 0.6));
      if (T.fill === false) span = gap; // 抒情主題用連音
      cur = placeLead(c, midi, Math.min(span, gap), strong && rng.chance(0.3) ? 2 : 1);
      placed.push({ off, midi });
    });
    return { rhythm: [...rhythm], contour: placed.map(p => p.midi - (placed[0]?.midi ?? cur)), base: placed[0]?.midi ?? cur };
  };

  sections.forEach(sec => {
    const secStart = sec.startBar * 16;
    const segs = sec.bars * 2;
    const energy = { A: 0.45, A2: 0.5, B: 0.6, S: 0.85, C: 0.3 }[sec.kind] ?? 0.5;

    if (sec.kind === 'A2' && storedA) {
      // 複製 A 段再重寫尾巴做變化
      const len = Math.min(segs * SEG, storedA.len);
      for (const [k, v] of Object.entries(storedA.notes)) {
        const [r, c] = k.split(',').map(Number);
        if (c < len) {
          const key = r + ',' + (secStart + c);
          song.notes[key] = v;
          if (storedA.spans[k]) song.spans[key] = storedA.spans[k];
          if (storedA.vels[k]) song.vels[key] = storedA.vels[k];
          if (v === 'lead') leadOnsets.push({ c: secStart + c, midi: rowToMidi(r), key });
        }
      }
      const regenSegs = sec.bars >= 4 ? 2 : 1;
      for (let sg = segs - regenSegs; sg < segs; sg++) {
        for (let r = 0; r < 24; r++) for (let off = 0; off < SEG; off++) {
          const key = r + ',' + (secStart + sg * SEG + off);
          if (song.notes[key] === 'lead') {
            delete song.notes[key]; delete song.spans[key]; delete song.vels[key];
            const idx = leadOnsets.findIndex(o => o.key === key);
            if (idx >= 0) leadOnsets.splice(idx, 1);
          }
        }
        writeSegment(sec.kind, secStart, sg, null, energy);
      }
      return;
    }

    let motif = null;
    const capture = sec.kind === 'A' || sec.kind === 'S';
    // 雷特動機：使用者記住的動機強制開場（A/S 段第一段，B 段偶爾）
    const ext = gen.motif && gen.motif.rhythm && gen.motif.rhythm.length >= 2;
    const useExtHere = ext && (sec.kind === 'A' || sec.kind === 'S' || (sec.kind === 'B' && rng.chance(0.4)));
    for (let sg = 0; sg < segs; sg++) {
      if (sg === 0 && useExtHere) {
        const extMotif = { rhythm: gen.motif.rhythm, contour: gen.motif.contour, base: centerOf[sec.kind] || 71 };
        motif = writeSegment(sec.kind, secStart, 0, extMotif, energy, true);
        continue;
      }
      // ゼクエンツ／フック：偶數段有機率變成前段動機的移調重現
      const useMotif = motif && (
        (gen.sequenz && sg % 2 === 1 && rng.chance(0.55)) ||
        (sg >= 2 && sg % 2 === 0 && rng.chance(hk * 0.6))
      );
      const m = writeSegment(sec.kind, secStart, sg, useMotif ? motif : null, energy);
      if (sg === 0) motif = m;
    }
    if (capture && sec.kind === 'A' && !storedA) {
      const notes = {}, spans = {}, vels = {};
      for (const [k, v] of Object.entries(song.notes)) {
        const [r, c] = k.split(',').map(Number);
        if (c >= secStart && c < secStart + segs * SEG) {
          const lk = r + ',' + (c - secStart);
          notes[lk] = v;
          if (song.spans[k]) spans[lk] = song.spans[k];
          if (song.vels[k]) vels[lk] = song.vels[k];
        }
      }
      storedA = { notes, spans, vels, len: segs * SEG };
    }
  });

  // ---- 副歌高潮：預留最高音 ----
  const sSec = sections.find(s => s.kind === 'S');
  if (sSec && sSec.bars >= 2) {
    const s0 = sSec.startBar * 16, sLen = sSec.bars * 16;
    const peakC = s0 + Math.floor(sLen * 0.72 / 4) * 4;
    const seg = Math.floor(peakC / SEG);
    const pcs = pcsAt(seg);
    clearLeadAt(song, leadOnsets, peakC);
    const peak = nearestChordTone(LEAD_HI - 2, pcs, LEAD_HI - 5, LEAD_HI);
    const r = midiToRow(peak);
    const key = r + ',' + peakC;
    song.notes[key] = 'lead'; song.spans[key] = 3; song.vels[key] = 2;
    leadOnsets.push({ c: peakC, midi: peak, key });
  }

  // ---- 和聲（ハモリ）----
  const sorted = [...leadOnsets].sort((a, b) => a.c - b.c);
  sorted.forEach(o => {
    const seg = Math.floor(o.c / SEG);
    const sec = sections.find(s => o.c >= s.startBar * 16 && o.c < (s.startBar + s.bars) * 16);
    const energy = { A: 0.35, A2: 0.4, B: 0.5, S: 0.75, C: 0.2 }[sec?.kind] ?? 0.4;
    if (o.c % 4 !== 0 || !rng.chance(d * 0.5 + energy * 0.45)) return;
    const pcs = pcsAt(seg);
    const h = nearestChordTone(o.midi - rng.pick([3, 4, 5, 7]), pcs.filter(p => p !== pc(o.midi)).length ? pcs.filter(p => p !== pc(o.midi)) : pcs, HARM_LO, Math.min(HARM_HI, o.midi - 2));
    const key = midiToRow(h) + ',' + o.c;
    if (song.notes[key]) return;
    song.notes[key] = 'harm';
    const leadSpan = song.spans[o.key] || 1;
    if (leadSpan > 1) song.spans[key] = leadSpan;
  });

  // ---- 貝斯 ----
  const bassify = (pat) => {
    let bp = pat;
    if (rD < 0.15) bp = bp.filter(p => p[0] === 0);
    else if (rD < 0.35) bp = bp.filter(p => p[0] % 4 === 0);
    if (rD > 0.65) {
      const have = new Set(bp.map(p => p[0]));
      bp = [...bp];
      [2, 6].forEach(o => { if (!have.has(o)) bp.push([o, 'o']); });
    }
    if (rD > 0.85) {
      const have = new Set(bp.map(p => p[0]));
      bp = [...bp];
      [1, 3, 5, 7].forEach(o => { if (!have.has(o)) bp.push([o, 'r']); });
    }
    return [...bp].sort((a, b) => a[0] - b[0]);
  };
  for (let seg = 0; seg < totalSegs; seg++) {
    const pcs = pcsAt(seg);
    if (!pcs.length) continue;
    const root = pcs[0];
    const sec = sections.find(s => seg * SEG >= s.startBar * 16 && seg * SEG < (s.startBar + s.bars) * 16);
    if (sec?.kind === 'C' && rD < 0.5) { // 間奏 break：貝斯只留段首
      if (seg % 2 === 0) placeBass(song, seg * SEG, root, 4);
      continue;
    }
    const pat = bassify(T.bassPat);
    pat.forEach(([off, kind]) => {
      let p = root;
      if (kind === '5') p = (root + 7) % 12;
      if (kind === '3') p = pcs[1] ?? root;
      const nextOff = pat.find(q => q[0] > off)?.[0] ?? SEG;
      placeBass(song, seg * SEG + off, p, Math.max(1, Math.round((nextOff - off) * 0.9)), kind === 'o');
    });
  }

  // ---- 鼓 ----
  const hatPat = rD < 0.25 ? [0, 8] : rD < 0.5 ? [0, 4, 8, 12] : rD < 0.8 ? [0, 2, 4, 6, 8, 10, 12, 14] : [0, 2, 4, 6, 8, 10, 12, 14];
  sections.forEach(sec => {
    const start = sec.startBar * 16, end = start + sec.bars * 16;
    const quiet = sec.kind === 'C';
    for (let bar = 0; bar < sec.bars; bar++) {
      const b0 = start + bar * 16;
      if (quiet && bar < sec.bars - 1) { song.drums['2,' + b0] = 1; song.drums['2,' + (b0 + 8)] = 1; continue; }
      (T.drums.kick || []).forEach(o => song.drums['0,' + (b0 + o)] = 1);
      (T.drums.snare || []).forEach(o => song.drums['1,' + (b0 + o)] = 1);
      (T.drums.hat || hatPat).forEach(o => song.drums['2,' + (b0 + o)] = (rD > 0.8 && o % 4 === 2) ? 2 : 1);
    }
    // 段尾過門
    if (T.fill && sec.bars >= 2 && !T.jingle) {
      const f0 = end - 4;
      [0, 1, 2, 3].forEach((i) => {
        if (rng.chance(0.7 + i * 0.1)) song.drums['1,' + (f0 + i)] = i >= 2 ? 2 : 1;
      });
      delete song.drums['2,' + (end - 2)];
      delete song.drums['2,' + (end - 1)];
    }
  });

  // ---- 噪音火花：段落交界 + 副歌點綴 ----
  sections.forEach((sec, i) => {
    if (i === 0) return;
    const c = sec.startBar * 16;
    const key = midiToRow(76) + ',' + (c - 1);
    if (!song.notes[key] && rng.chance(0.7)) song.notes[key] = 'noise';
  });
  if (sSec && rD > 0.45) {
    const s0 = sSec.startBar * 16, sLen = sSec.bars * 16;
    for (let c = s0; c < s0 + sLen; c += 8) {
      if (rng.chance(rD * 0.4)) {
        const key = midiToRow(rng.pick([74, 76, 78])) + ',' + (c + 6);
        if (!song.notes[key]) song.notes[key] = 'noise';
      }
    }
  }

  // ---- 副歌前導音（アウフタクト）：兩個上行音走進副歌第一音 ----
  if (sSec && sSec.startBar > 0) {
    const s0 = sSec.startBar * 16;
    const firstS = (() => {
      for (let c = s0; c < s0 + 8; c++)
        for (let r = 0; r < 24; r++)
          if (song.notes[r + ',' + c] === 'lead') return { c, midi: rowToMidi(r) };
      return null;
    })();
    if (firstS && rng.chance(0.7)) {
      const scale = chordAwareScale(T.scale, pcsAt(Math.floor((s0 - 1) / SEG)), T.keepClash);
      [2, 1].forEach(back => {
        const c = s0 - back;
        const midi = scaleWalk(firstS.midi, scale, -back, LEAD_LO, LEAD_HI);
        const key = midiToRow(midi) + ',' + c;
        let occupied = false;
        for (let r = 0; r < 24; r++) if (song.notes[r + ',' + c] === 'lead') occupied = true;
        if (!occupied && !song.notes[key]) song.notes[key] = 'lead';
      });
    }
  }

  // ---- 修復通道 ----
  repairSong(song, T, sections, rng);
  return song;
}

// 從現有曲子擷取雷特動機：挑 A 段（或開頭）音數最適中的半小節
export function extractMotif(song) {
  const secA = (song.secTags || []).find(s => s.kind === 'A');
  const start = secA ? secA.startBar * 16 : 0;
  const scanEnd = Math.min(song.steps, start + 64);
  let best = null;
  for (let s0 = start; s0 + SEG <= scanEnd; s0 += SEG) {
    const evs = [];
    for (let c = s0; c < s0 + SEG; c++)
      for (let r = 0; r < 24; r++)
        if (song.notes[r + ',' + c] === 'lead') evs.push({ off: c - s0, midi: rowToMidi(r) });
    if (evs.length < 2) continue;
    // 3~5 音的動機最好記；越靠前越優先
    const score = -Math.abs(evs.length - 4) * 2 - (s0 - start) / SEG;
    if (!best || score > best.score) best = { score, evs };
  }
  if (!best) return null;
  best.evs.sort((a, b) => a.off - b.off);
  return {
    rhythm: best.evs.map(e => e.off),
    contour: best.evs.map(e => e.midi - best.evs[0].midi),
  };
}

function clearLeadAt(song, leadOnsets, c) {
  for (let r = 0; r < 24; r++) {
    const key = r + ',' + c;
    if (song.notes[key] === 'lead') {
      delete song.notes[key]; delete song.spans[key]; delete song.vels[key];
      const idx = leadOnsets.findIndex(o => o.key === key);
      if (idx >= 0) leadOnsets.splice(idx, 1);
    }
  }
}

function placeBass(song, c, pcVal, span, octaveUp = false) {
  let midi = BASS_LO;
  while (pc(midi) !== pcVal && midi <= BASS_HI) midi++;
  if (octaveUp && midi + 12 <= BASS_HI) midi += 12;
  if (midi > BASS_HI) midi = BASS_LO;
  const key = midiToRow(midi) + ',' + c;
  if (song.notes[key]) return;
  song.notes[key] = 'bass';
  if (span > 1) song.spans[key] = span;
}

// ---- 修復：樂句結尾、未解決跳進、強拍貼和弦、終止式 ----
export function repairSong(song, T, sections, rng) {
  const leads = collectLead(song);
  if (!leads.length) return;

  // 1. 未解決大跳：|Δ|>9 → 後音拉回一個八度
  for (let i = 1; i < leads.length; i++) {
    const dlt = leads[i].midi - leads[i - 1].midi;
    if (Math.abs(dlt) > 9) {
      const fixed = leads[i].midi - Math.sign(dlt) * 12;
      if (fixed >= LEAD_LO && fixed <= LEAD_HI) moveLead(song, leads[i], fixed);
    }
  }

  // 2. 段落最後一個音 → 貼到和弦音
  const leads2 = collectLead(song);
  sections.forEach(sec => {
    const end = (sec.startBar + sec.bars) * 16;
    const last = [...leads2].reverse().find(o => o.c < end && o.c >= sec.startBar * 16);
    if (!last) return;
    const pcs = CHORDS[song.chords[Math.floor(last.c / SEG)]] || [0, 4, 7];
    if (!isChordTone(last.midi, pcs)) {
      moveLead(song, last, nearestChordTone(last.midi, pcs, LEAD_LO, LEAD_HI));
    }
  });

  // 3. 終止式：全曲最後一個 lead → 第一個和弦的根音（回到主和弦感），拉長
  const leads3 = collectLead(song);
  const fin = leads3[leads3.length - 1];
  if (fin) {
    const homePcs = CHORDS[song.chords[0]] || [9, 0, 4];
    const tonic = nearestChordTone(fin.midi, [homePcs[0]], LEAD_LO, LEAD_HI);
    moveLead(song, fin, tonic);
    const key = midiToRow(tonic) + ',' + fin.c;
    song.spans[key] = Math.max(song.spans[key] || 1, Math.min(4, song.steps - fin.c));
  }
}

// ===== 日夜配對：從日版衍生夜間變奏 =====
// 不是單純放慢——保留和弦與動機骨架，但：旋律抽疏成連音、和聲變長音鋪底、
// 貝斯半密度、鼓組退到心跳程度、去掉重音。搭配 nightMixerPatch 的回音加深。
export function nightVariant(day) {
  const song = JSON.parse(JSON.stringify(day));
  const rng = new Rng(String(day.seed || 'seed') + '|night');
  song.bpm = Math.max(60, Math.round(day.bpm * 0.78));
  song.seed = (day.seed || '—') + '·夜';

  const steps = song.steps;

  // --- 主旋律：保留強拍骨架，抽掉部分弱拍，剩下的音連成 legato ---
  const leads = collectLead(song);
  for (const o of leads) {
    if (o.c % 8 === 0) continue;                    // 段首永遠保留（動機錨點）
    const drop = o.c % 4 === 0 ? 0.25 : 0.55;       // 弱拍抽更多
    if (rng.chance(drop)) {
      delete song.notes[o.key]; delete song.spans[o.key];
      delete song.vels[o.key]; delete song.slides[o.key];
    }
  }
  const kept = collectLead(song);
  for (let i = 0; i < kept.length; i++) {
    const gap = (kept[i + 1] ? kept[i + 1].c : Math.min(steps, kept[i].c + 8)) - kept[i].c;
    const span = Math.max(song.spans[kept[i].key] || 1, Math.min(gap, 8));
    if (span > 1) song.spans[kept[i].key] = span;
    delete song.vels[kept[i].key];                  // 全部轉輕
  }

  // --- 和聲：全部換成段落長音鋪底 ---
  for (const [k, v] of Object.entries(song.notes)) {
    if (v !== 'harm') { continue; }
    delete song.notes[k]; delete song.spans[k]; delete song.vels[k]; delete song.slides[k];
  }
  for (let seg = 0; seg < steps / SEG; seg++) {
    if (!rng.chance(0.85)) continue;
    const pcs = CHORDS[song.chords[seg]] || [];
    if (!pcs.length) continue;
    const tone = nearestChordTone(69, pcs, HARM_LO, 74);
    const key = midiToRow(tone) + ',' + seg * SEG;
    if (song.notes[key]) continue;
    song.notes[key] = 'harm';
    song.spans[key] = SEG;
  }

  // --- 貝斯：半密度、長音 ---
  const bassKeys = Object.entries(song.notes).filter(([, v]) => v === 'bass').map(([k]) => k);
  for (const k of bassKeys) {
    const c = +k.split(',')[1];
    if (c % 4 !== 0) { delete song.notes[k]; delete song.spans[k]; }
    else song.spans[k] = 4;
  }

  // --- 噪音火花：只留段落交界 ---
  for (const [k, v] of Object.entries(song.notes)) {
    if (v !== 'noise') continue;
    const c = +k.split(',')[1];
    const onBoundary = (song.secTags || []).some(s => Math.abs(s.startBar * 16 - 1 - c) <= 1);
    if (!onBoundary) { delete song.notes[k]; delete song.spans[k]; }
  }

  // --- 鼓：退到心跳程度 ---
  const drums = {};
  for (const [k, v] of Object.entries(song.drums)) {
    if (!v) continue;
    const [l, c] = k.split(',').map(Number);
    if (l === 0 && (c % 16 === 0 || (c % 16 === 8 && rng.chance(0.6)))) drums[k] = 1;  // 大鼓：每小節 1~2 下
    if (l === 1 && c % 16 === 12 && rng.chance(0.35)) drums[k] = 1;                     // 小鼓：偶爾點一下
    if (l === 2 && c % 8 === 4) drums[k] = 1;                                           // 踏鈸：反拍呼吸
  }
  song.drums = drums;
  return song;
}

// 夜版建議混音（套用時備份原值，切回日版還原）
export const NIGHT_MIXER_PATCH = {
  echo: 18, echoFb: 34, vibrato: 48, susDecay: 62,
  duty: { lead: '12.5%', harm: '12.5%' },
  vol: { noise: 40, drum: 58 },
};

function collectLead(song) {
  const out = [];
  for (const [k, v] of Object.entries(song.notes)) {
    if (v !== 'lead') continue;
    const [r, c] = k.split(',').map(Number);
    out.push({ r, c, midi: rowToMidi(r), key: k });
  }
  return out.sort((a, b) => a.c - b.c);
}

function moveLead(song, o, midi) {
  if (midi === o.midi) return;
  const span = song.spans[o.key], vel = song.vels[o.key];
  delete song.notes[o.key]; delete song.spans[o.key]; delete song.vels[o.key];
  const key = midiToRow(midi) + ',' + o.c;
  song.notes[key] = 'lead';
  if (span) song.spans[key] = span;
  if (vel) song.vels[key] = vel;
  o.midi = midi; o.key = key; o.r = midiToRow(midi);
}
