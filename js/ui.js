// 音格畫布（piano-roll）渲染與互動 + 熱狗仔吉祥物
// 剪輯軟體式操作：縮放、框選多選、移動/複製/貼上、連打、軌道獨顯、循環區間
import { ROWS, rowToMidi, NOTE_NAMES, pc, CHORD_CYCLE, CHORDS } from './theory.js';
import { SEC_INFO } from './themes.js';

export const GUT = 46;       // 左側標籤欄
export const SEC_H = 28;     // 段落色帶（兼時間尺）— 加寬便於拖曳 scrub，不誤觸和弦
export const CHORD_H = 20;   // 和弦列
export const CELL_W = 20;    // 預設格寬（可縮放 10~40）
export const CELL_H = 16;
export const DRUM_GAP = 4;
export const DRUM_ROWS = 3;
export const ROLL_H = SEC_H + CHORD_H + ROWS * CELL_H + DRUM_GAP + DRUM_ROWS * CELL_H;

const COLORS = {
  lead: '#ffd23f', harm: '#ff5f7a', bass: '#4ade8c', noise: '#a5b4ff',
  drums: ['#ff8a4d', '#c77dff', '#6fd8ff'],
  bg: '#150e26', beat: '#1c1333', bar: '#2e2152', seg: '#241a44',
  gut: '#0d0818', text: '#9187bd', chordBg: '#100a1e',
  sel: '#ffc848', loop: 'rgba(255,200,72,.28)',
};

export class Roll {
  constructor(canvas, store, transport, scrollEl) {
    this.cv = canvas;
    this.ctx = canvas.getContext('2d');
    this.store = store;
    this.transport = transport;
    this.scrollEl = scrollEl;
    this.cw = CELL_W;
    this.tool = 'lead';
    this.drag = null;
    this.sel = null;       // { notes:Set(key), drums:Set(key) }
    this.clip = null;      // 複製暫存
    this.marquee = null;   // 拖曳中的框選矩形（px）
    this.viewInst = null;  // 軌道獨顯：null=全部
    this.onSeek = null;
    this._lastSeek = 0;
    this.bindPointer();
  }

  noteTop() { return SEC_H + CHORD_H; }
  drumTop() { return this.noteTop() + ROWS * CELL_H + DRUM_GAP; }

  resize() {
    const { steps } = this.store.song;
    this.cv.width = GUT + steps * this.cw;
    this.cv.height = ROLL_H;
    this.render();
  }

  setZoom(cw, anchorClientX = null) {
    cw = Math.max(10, Math.min(40, Math.round(cw / 2) * 2));
    if (cw === this.cw) return;
    let stepAt = 0, offset = 0;
    if (anchorClientX !== null && this.scrollEl) {
      const rect = this.cv.getBoundingClientRect();
      stepAt = (anchorClientX - rect.left - GUT) / this.cw;
      offset = anchorClientX - this.scrollEl.getBoundingClientRect().left;
    }
    this.cw = cw;
    this.resize();
    if (anchorClientX !== null && this.scrollEl) {
      this.scrollEl.scrollLeft = Math.max(0, GUT + stepAt * cw - offset);
    }
  }

  // ---- 渲染 ----
  render() {
    const { song } = this.store;
    const g = this.ctx, W = this.cv.width, cw = this.cw;
    const halves = song.halves || {};
    g.fillStyle = COLORS.bg;
    g.fillRect(0, 0, W, ROLL_H);

    const nTop = this.noteTop(), dTop = this.drumTop();

    for (let c = 0; c < song.steps; c++) {
      if (c % 4 === 0) {
        g.fillStyle = COLORS.beat;
        g.fillRect(GUT + c * cw, nTop, cw, ROWS * CELL_H);
        g.fillRect(GUT + c * cw, dTop, cw, DRUM_ROWS * CELL_H);
      }
    }
    for (let r = 0; r < ROWS; r++) {
      if ([1, 3, 6, 8, 10].includes(pc(rowToMidi(r)))) {
        g.fillStyle = 'rgba(0,0,0,.22)';
        g.fillRect(GUT, nTop + r * CELL_H, W - GUT, CELL_H);
      }
    }
    g.fillStyle = 'rgba(0,0,0,.35)';
    for (let r = 1; r < ROWS; r++) g.fillRect(GUT, nTop + r * CELL_H, W - GUT, 1);
    for (let l = 1; l < DRUM_ROWS; l++) g.fillRect(GUT, dTop + l * CELL_H, W - GUT, 1);
    for (let c = 1; c < song.steps; c++) {
      g.fillStyle = c % 16 === 0 ? COLORS.bar : c % 8 === 0 ? COLORS.seg : 'rgba(0,0,0,.35)';
      g.fillRect(GUT + c * cw, SEC_H, c % 8 === 0 ? 2 : 1, ROLL_H - SEC_H);
    }

    // 段落色帶（時間尺）
    g.fillStyle = COLORS.chordBg;
    g.fillRect(GUT, 0, W - GUT, SEC_H);
    (song.secTags || []).forEach(sec => {
      const info = SEC_INFO[sec.kind] || { label: sec.kind, color: '#555' };
      const x = GUT + sec.startBar * 16 * cw;
      const w = sec.bars * 16 * cw;
      g.fillStyle = info.color;
      g.globalAlpha = 0.28;
      g.fillRect(x, 0, w, SEC_H);
      g.globalAlpha = 1;
      g.fillRect(x, SEC_H - 3, w, 3);
      g.fillStyle = '#eae4ff';
      g.font = '12px FPXHant, FPXLatin, monospace';
      g.textBaseline = 'middle';
      g.fillText(info.label, x + 5, SEC_H / 2 + 1);
    });
    // 循環區間
    const loop = this.transport.loop;
    if (loop) {
      const x = GUT + loop.a * cw, w = (loop.b - loop.a + 1) * cw;
      g.fillStyle = COLORS.loop;
      g.fillRect(x, 0, w, SEC_H);
      g.fillStyle = COLORS.sel;
      g.fillRect(x, 0, 2, SEC_H);
      g.fillRect(x + w - 2, 0, 2, SEC_H);
    }

    // 和弦列
    g.fillStyle = COLORS.chordBg;
    g.fillRect(GUT, SEC_H, W - GUT, CHORD_H);
    g.font = '12px FPXLatin, FPXHant, monospace';
    song.chords.forEach((ch, i) => {
      g.fillStyle = '#ffc848';
      g.fillText(ch, GUT + i * 8 * cw + 6, SEC_H + CHORD_H / 2 + 1);
    });

    // 和弦引導光
    for (let i = 0; i < song.chords.length; i++) {
      const pcs = CHORDS[song.chords[i]] || [];
      if (!pcs.length) continue;
      const x = GUT + i * 8 * cw, w = 8 * cw;
      for (let r = 0; r < ROWS; r++) {
        if (pcs[0] === pc(rowToMidi(r))) {
          g.fillStyle = 'rgba(255,200,72,.10)';
          g.fillRect(x, nTop + r * CELL_H, w, CELL_H);
        } else if (pcs.includes(pc(rowToMidi(r)))) {
          g.fillStyle = 'rgba(255,255,255,.045)';
          g.fillRect(x, nTop + r * CELL_H, w, CELL_H);
        }
      }
    }

    // 音符
    const dimmed = inst => this.viewInst && inst !== this.viewInst;
    for (const [k, inst] of Object.entries(song.notes)) {
      const [r, c] = k.split(',').map(Number);
      if (r < 0 || r >= ROWS || c >= song.steps) continue;
      const span = song.spans[k] || 1;
      const vel = song.vels[k] || 1;
      const col = COLORS[inst] || '#fff';
      const x = GUT + c * cw, y = nTop + r * CELL_H;
      let alpha = [0.55, 1, 1][vel - 1] ?? 1;
      if (dimmed(inst)) alpha *= 0.16;
      g.globalAlpha = alpha;
      if (span > 1 && !halves[k]) {
        g.fillStyle = col;
        g.globalAlpha = alpha * 0.4;
        g.fillRect(x + cw - 2, y + 4, (span - 1) * cw, CELL_H - 8);
        g.globalAlpha = alpha;
      }
      g.fillStyle = col;
      if (halves[k]) { // 連打：一格畫成兩塊
        const hw = Math.floor((cw - 4) / 2);
        g.fillRect(x + 1, y + 1, hw, CELL_H - 3);
        g.fillRect(x + 2 + hw, y + 1, hw, CELL_H - 3);
      } else {
        g.fillRect(x + 1, y + 1, cw - 3, CELL_H - 3);
        g.fillStyle = 'rgba(255,255,255,.5)';
        g.fillRect(x + 1, y + 1, cw - 3, 2);
        g.fillRect(x + 1, y + 1, 2, CELL_H - 3);
        g.fillStyle = 'rgba(0,0,0,.35)';
        g.fillRect(x + 1, y + CELL_H - 4, cw - 3, 2);
      }
      if (vel === 3) {
        g.fillStyle = '#fff';
        g.fillRect(x + cw - 7, y + 3, 3, 3);
      }
      if (this.sel?.notes.has(k)) {
        g.globalAlpha = 1;
        g.strokeStyle = COLORS.sel;
        g.lineWidth = 2;
        g.strokeRect(x + 0.5, y + 0.5, cw - 2, CELL_H - 2);
      }
      g.globalAlpha = 1;
      if (song.slides[k] !== undefined) {
        const ty = nTop + song.slides[k] * CELL_H + CELL_H / 2;
        g.strokeStyle = col;
        g.lineWidth = 2;
        g.beginPath();
        g.moveTo(x + cw * span - 4, y + CELL_H / 2);
        g.lineTo(x + cw * span + 4, ty);
        g.stroke();
      }
    }

    // 鼓
    for (const [k, v] of Object.entries(song.drums)) {
      if (!v) continue;
      const [l, c] = k.split(',').map(Number);
      if (l < 0 || l >= DRUM_ROWS || c >= song.steps) continue;
      const col = COLORS.drums[l];
      const x = GUT + c * cw, y = dTop + l * CELL_H;
      let alpha = this.viewInst && this.viewInst !== 'drum' ? 0.16 : 1;
      g.globalAlpha = alpha;
      g.fillStyle = col;
      const inset = v === 2 ? 2 : 4;
      if (halves['d' + k]) {
        const hw = Math.floor((cw - inset * 2 - 2) / 2);
        g.fillRect(x + inset, y + inset, hw, CELL_H - inset * 2 - 1);
        g.fillRect(x + inset + hw + 2, y + inset, hw, CELL_H - inset * 2 - 1);
      } else {
        g.fillRect(x + inset, y + inset, cw - inset * 2 - 1, CELL_H - inset * 2 - 1);
        if (v === 2) {
          g.fillStyle = 'rgba(255,255,255,.55)';
          g.fillRect(x + inset, y + inset, cw - inset * 2 - 1, 2);
        }
      }
      if (this.sel?.drums.has(k)) {
        g.globalAlpha = 1;
        g.strokeStyle = COLORS.sel;
        g.lineWidth = 2;
        g.strokeRect(x + 1.5, y + 1.5, cw - 3, CELL_H - 3);
      }
      g.globalAlpha = 1;
    }

    // 框選矩形
    if (this.marquee) {
      const m = this.marquee;
      g.strokeStyle = COLORS.sel;
      g.lineWidth = 1;
      g.setLineDash([4, 3]);
      g.strokeRect(Math.min(m.x0, m.x1) + 0.5, Math.min(m.y0, m.y1) + 0.5,
        Math.abs(m.x1 - m.x0), Math.abs(m.y1 - m.y0));
      g.setLineDash([]);
      g.fillStyle = 'rgba(255,200,72,.08)';
      g.fillRect(Math.min(m.x0, m.x1), Math.min(m.y0, m.y1), Math.abs(m.x1 - m.x0), Math.abs(m.y1 - m.y0));
    }
    // 移動預覽（虛線外框）
    if (this.drag?.mode === 'moveSel' && (this.drag.dr || this.drag.dc)) {
      const b = this.selBounds();
      if (b) {
        g.strokeStyle = COLORS.sel;
        g.setLineDash([5, 4]);
        g.strokeRect(GUT + (b.c0 + this.drag.dc) * cw, nTop + (b.r0 + this.drag.dr) * CELL_H,
          (b.c1 - b.c0 + 1) * cw, (b.r1 - b.r0 + 1) * CELL_H);
        g.setLineDash([]);
      }
    }

    // 左欄
    g.fillStyle = COLORS.gut;
    g.fillRect(0, 0, GUT, ROLL_H);
    g.fillStyle = COLORS.bar;
    g.fillRect(GUT - 2, 0, 2, ROLL_H);
    g.font = '12px FPXLatin, monospace';
    for (let r = 0; r < ROWS; r++) {
      const midi = rowToMidi(r);
      const name = NOTE_NAMES[pc(midi)];
      if (name.includes('#')) continue;
      g.fillStyle = name === 'C' ? '#ffc848' : COLORS.text;
      g.fillText(name + (Math.floor(midi / 12) - 1), 6, nTop + r * CELL_H + CELL_H / 2 + 1);
    }
    g.font = '12px FPXHant, monospace';
    ['大鼓', '小鼓', '踏鈸'].forEach((n, l) => {
      g.fillStyle = COLORS.drums[l];
      g.fillText(n, 6, dTop + l * CELL_H + CELL_H / 2 + 1);
    });
    g.fillStyle = COLORS.text;
    g.fillText('和弦', 6, SEC_H + CHORD_H / 2 + 1);
    g.fillText('段落', 6, SEC_H / 2 + 1);
  }

  // ---- 座標 ----
  locate(e) {
    const rect = this.cv.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    if (x < GUT) return null;
    const c = Math.floor((x - GUT) / this.cw);
    if (c < 0 || c >= this.store.song.steps) return null;
    const nTop = this.noteTop(), dTop = this.drumTop();
    if (y < SEC_H) return { kind: 'ruler', c, x, y };
    if (y < SEC_H + CHORD_H) return { kind: 'chord', seg: Math.floor(c / 8), x, y };
    if (y < nTop + ROWS * CELL_H) return { kind: 'note', r: Math.floor((y - nTop) / CELL_H), c, x, y };
    if (y >= dTop && y < dTop + DRUM_ROWS * CELL_H) return { kind: 'drum', l: Math.floor((y - dTop) / CELL_H), c, x, y };
    return null;
  }

  findOwner(r, c) {
    const { song } = this.store;
    for (let cs = c; cs >= 0 && cs > c - 64; cs--) {
      const key = r + ',' + cs;
      if (song.notes[key]) {
        const span = song.spans[key] || 1;
        if (cs + span > c) return { key, r, c: cs, span, inst: song.notes[key] };
        return null;
      }
    }
    return null;
  }

  // ---- 選取 ----
  clearSel() { this.sel = null; this.render(); }

  selBounds() {
    if (!this.sel || !this.sel.notes.size) return null;
    let r0 = 99, r1 = -1, c0 = 1e9, c1 = -1;
    for (const k of this.sel.notes) {
      const [r, c] = k.split(',').map(Number);
      r0 = Math.min(r0, r); r1 = Math.max(r1, r);
      c0 = Math.min(c0, c); c1 = Math.max(c1, c);
    }
    return { r0, r1, c0, c1 };
  }

  buildSelFromRect(x0, y0, x1, y1) {
    const { song } = this.store;
    const [xa, xb] = [Math.min(x0, x1), Math.max(x0, x1)];
    const [ya, yb] = [Math.min(y0, y1), Math.max(y0, y1)];
    const nTop = this.noteTop(), dTop = this.drumTop();
    const notes = new Set(), drums = new Set();
    for (const k of Object.keys(song.notes)) {
      const [r, c] = k.split(',').map(Number);
      const cx = GUT + c * this.cw + this.cw / 2, cy = nTop + r * CELL_H + CELL_H / 2;
      if (cx >= xa && cx <= xb && cy >= ya && cy <= yb) notes.add(k);
    }
    for (const k of Object.keys(song.drums)) {
      const [l, c] = k.split(',').map(Number);
      const cx = GUT + c * this.cw + this.cw / 2, cy = dTop + l * CELL_H + CELL_H / 2;
      if (cx >= xa && cx <= xb && cy >= ya && cy <= yb) drums.add(k);
    }
    this.sel = (notes.size || drums.size) ? { notes, drums } : null;
  }

  copySel() {
    if (!this.sel) return false;
    const { song } = this.store;
    let c0 = 1e9, r0 = 99;
    for (const k of this.sel.notes) { const [r, c] = k.split(',').map(Number); c0 = Math.min(c0, c); r0 = Math.min(r0, r); }
    for (const k of this.sel.drums) { const c = +k.split(',')[1]; c0 = Math.min(c0, c); }
    if (c0 === 1e9) return false;
    this.clip = { r0: r0 === 99 ? 0 : r0, notes: [], drums: [] };
    for (const k of this.sel.notes) {
      const [r, c] = k.split(',').map(Number);
      this.clip.notes.push({
        dr: r - this.clip.r0, dc: c - c0, inst: song.notes[k],
        span: song.spans[k], vel: song.vels[k], slide: song.slides[k], half: !!(song.halves || {})[k],
      });
    }
    for (const k of this.sel.drums) {
      const [l, c] = k.split(',').map(Number);
      this.clip.drums.push({ l, dc: c - c0, v: song.drums[k], half: !!(song.halves || {})[k.startsWith('d') ? k : 'd' + k] || !!(song.halves || {})['d' + k] });
    }
    return true;
  }

  pasteAt(r, c) {
    if (!this.clip) return false;
    const { song } = this.store;
    this.store.pushHistory();
    song.halves ||= {};
    const baseR = r === null ? this.clip.r0 : r;
    const newSel = { notes: new Set(), drums: new Set() };
    for (const n of this.clip.notes) {
      const nr = baseR + n.dr, nc = c + n.dc;
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= song.steps) continue;
      const key = nr + ',' + nc;
      song.notes[key] = n.inst;
      if (n.span > 1) song.spans[key] = n.span; else delete song.spans[key];
      if (n.vel) song.vels[key] = n.vel; else delete song.vels[key];
      if (n.slide !== undefined) song.slides[key] = n.slide; else delete song.slides[key];
      if (n.half) song.halves[key] = true; else delete song.halves[key];
      newSel.notes.add(key);
    }
    for (const d of this.clip.drums) {
      const nc = c + d.dc;
      if (nc < 0 || nc >= song.steps) continue;
      const key = d.l + ',' + nc;
      song.drums[key] = d.v;
      if (d.half) song.halves['d' + key] = true; else delete song.halves['d' + key];
      newSel.drums.add(key);
    }
    this.sel = newSel;
    this.store.touch();
    this.render();
    return true;
  }

  deleteSel() {
    if (!this.sel) return false;
    const { song } = this.store;
    this.store.pushHistory();
    song.halves ||= {};
    for (const k of this.sel.notes) {
      delete song.notes[k]; delete song.spans[k]; delete song.vels[k];
      delete song.slides[k]; delete song.halves[k];
    }
    for (const k of this.sel.drums) { delete song.drums[k]; delete song.halves['d' + k]; }
    this.sel = null;
    this.store.touch();
    this.render();
    return true;
  }

  applySelMove(dr, dc) {
    if (!this.sel || (!dr && !dc)) return;
    const { song } = this.store;
    this.store.pushHistory();
    song.halves ||= {};
    const moveMap = (map, keys, isDrum) => {
      const buf = [];
      for (const k of keys) {
        const [a, c] = k.split(',').map(Number);
        buf.push({ k, a, c, vals: {
          note: song.notes[k], span: song.spans[k], vel: song.vels[k],
          slide: song.slides[k], half: song.halves[isDrum ? 'd' + k : k], drum: song.drums[k],
        } });
      }
      for (const b of buf) {
        delete song.notes[b.k]; delete song.spans[b.k]; delete song.vels[b.k];
        delete song.slides[b.k]; delete song.halves[b.k];
        if (isDrum) { delete song.drums[b.k]; delete song.halves['d' + b.k]; }
      }
      const out = new Set();
      for (const b of buf) {
        const na = isDrum ? b.a : b.a + dr;
        const nc = b.c + dc;
        if (nc < 0 || nc >= song.steps) continue;
        if (!isDrum && (na < 0 || na >= ROWS)) continue;
        if (isDrum && (na < 0 || na >= DRUM_ROWS)) continue;
        const nk = na + ',' + nc;
        if (isDrum) {
          song.drums[nk] = b.vals.drum;
          if (b.vals.half) song.halves['d' + nk] = true;
        } else {
          song.notes[nk] = b.vals.note;
          if (b.vals.span > 1) song.spans[nk] = b.vals.span;
          if (b.vals.vel) song.vels[nk] = b.vals.vel;
          if (b.vals.slide !== undefined) {
            const ns = b.vals.slide + dr;
            if (ns >= 0 && ns < ROWS) song.slides[nk] = ns;
          }
          if (b.vals.half) song.halves[nk] = true;
        }
        out.add(nk);
      }
      return out;
    };
    const newNotes = moveMap(song.notes, this.sel.notes, false);
    const newDrums = moveMap(song.drums, this.sel.drums, true);
    this.sel = { notes: newNotes, drums: newDrums };
    this.store.touch();
    this.render();
  }

  // ---- 互動 ----
  bindPointer() {
    this.cv.addEventListener('contextmenu', e => e.preventDefault());
    this.cv.addEventListener('pointerdown', e => {
      const ds = this.locate(e);
      if (!ds) return;
      this.cv.setPointerCapture(e.pointerId);

      if (ds.kind === 'ruler') {
        this.drag = { mode: 'seek', lastC: -1 };
        this.doSeek(ds.c);
        return;
      }

      // 選取工具：框選 / 移動 / 貼上
      if (this.tool === 'select' && (ds.kind === 'note' || ds.kind === 'drum')) {
        const hitKey = ds.kind === 'note' ? ds.r + ',' + ds.c : ds.l + ',' + ds.c;
        const hitSel = this.sel && (
          (ds.kind === 'note' && (this.sel.notes.has(hitKey) || [...this.sel.notes].some(k => {
            const [r, c] = k.split(',').map(Number);
            return r === ds.r && c <= ds.c && c + (this.store.song.spans[k] || 1) > ds.c;
          }))) ||
          (ds.kind === 'drum' && this.sel.drums.has(hitKey))
        );
        if (hitSel) {
          this.drag = { mode: 'moveSel', startR: ds.kind === 'note' ? ds.r : null, startC: ds.c, dr: 0, dc: 0 };
        } else if (this.clip && ds.kind === 'note' && !this.store.song.notes[hitKey]) {
          this.pasteAt(ds.r, ds.c);
        } else if (this.clip && ds.kind === 'drum' && !this.store.song.drums[hitKey]) {
          this.pasteAt(null, ds.c);
        } else {
          this.sel = null;
          this.drag = { mode: 'marquee', x0: ds.x, y0: ds.y };
          this.marquee = { x0: ds.x, y0: ds.y, x1: ds.x, y1: ds.y };
          this.render();
        }
        return;
      }

      const erase = e.button === 2 || this.tool === 'erase';

      if (ds.kind === 'chord') {
        this.store.pushHistory();
        const dir = e.button === 2 ? -1 : 1;
        const cur = this.store.song.chords[ds.seg] || 'Am';
        const i = CHORD_CYCLE.indexOf(cur);
        this.store.song.chords[ds.seg] = CHORD_CYCLE[(i + dir + CHORD_CYCLE.length) % CHORD_CYCLE.length];
        this.store.touch();
        this.render();
        return;
      }

      // 連打工具：切換一格兩打
      if (this.tool === 'half') {
        const { song } = this.store;
        song.halves ||= {};
        let hk = null;
        if (ds.kind === 'note') {
          const own = this.findOwner(ds.r, ds.c);
          if (own) hk = own.key;
        } else if (ds.kind === 'drum' && song.drums[ds.l + ',' + ds.c]) {
          hk = 'd' + ds.l + ',' + ds.c;
        }
        if (hk) {
          this.store.pushHistory();
          if (song.halves[hk]) delete song.halves[hk];
          else { song.halves[hk] = true; delete song.spans[hk]; }
          this.store.touch();
          this.render();
        }
        return;
      }

      this.store.pushHistory();

      if (ds.kind === 'drum') {
        this.drag = { mode: 'drum', erase, vel: e.shiftKey ? 2 : 1, painted: new Set() };
        this.applyDrum(ds);
        return;
      }

      if (erase) {
        this.drag = { mode: 'eraseNote', painted: new Set() };
        this.eraseAt(ds);
        return;
      }
      if (this.tool === 'sus') {
        const own = this.findOwner(ds.r, ds.c) ||
          (() => { this.place(ds, 'lead', e.shiftKey); return this.findOwner(ds.r, ds.c); })();
        if (own) this.drag = { mode: 'sus', own, lastC: ds.c, lastR: ds.r };
        return;
      }
      const key = ds.r + ',' + ds.c;
      const existing = this.store.song.notes[key];
      if (existing === this.tool) {
        this.eraseAt(ds);
        this.drag = { mode: 'eraseNote', painted: new Set([key]) };
      } else {
        this.place(ds, this.tool, e.shiftKey);
        this.drag = { mode: 'paint', painted: new Set([key]), vel: e.shiftKey };
      }
    });

    this.cv.addEventListener('pointermove', e => {
      if (!this.drag) return;
      const d = this.drag;
      if (d.mode === 'marquee') { // 框選允許拖出格線範圍
        const rect = this.cv.getBoundingClientRect();
        this.marquee.x1 = e.clientX - rect.left;
        this.marquee.y1 = e.clientY - rect.top;
        this.render();
        return;
      }
      const ds = this.locate(e);
      if (!ds) return;
      if (d.mode === 'seek') { if (ds.c !== d.lastC) { d.lastC = ds.c; this.doSeek(ds.c); } }
      else if (d.mode === 'moveSel') {
        const dr = (d.startR !== null && ds.kind === 'note') ? ds.r - d.startR : 0;
        const dc = ds.c - d.startC;
        if (dr !== d.dr || dc !== d.dc) { d.dr = dr; d.dc = dc; this.render(); }
      }
      else if (d.mode === 'drum' && ds.kind === 'drum') this.applyDrum(ds);
      else if (d.mode === 'eraseNote' && ds.kind === 'note') this.eraseAt(ds);
      else if (d.mode === 'paint' && ds.kind === 'note') {
        const key = ds.r + ',' + ds.c;
        if (!d.painted.has(key)) { d.painted.add(key); this.place(ds, this.tool, d.vel); }
      } else if (d.mode === 'sus' && ds.kind === 'note') {
        const { song } = this.store;
        const own = d.own;
        const newSpan = Math.max(1, Math.min(song.steps - own.c, ds.c - own.c + 1));
        if (newSpan > 1) song.spans[own.key] = newSpan;
        else delete song.spans[own.key];
        d.lastC = ds.c; d.lastR = ds.r;
        this.store.touch();
        this.render();
      }
    });

    const up = e => {
      const d = this.drag;
      if (d?.mode === 'sus' && d.lastR !== d.own.r) {
        this.store.song.slides[d.own.key] = d.lastR;
        this.store.touch();
        this.render();
      } else if (d?.mode === 'marquee') {
        this.buildSelFromRect(this.marquee.x0, this.marquee.y0, this.marquee.x1, this.marquee.y1);
        this.marquee = null;
        this.render();
      } else if (d?.mode === 'moveSel') {
        if (d.dr || d.dc) this.applySelMove(d.dr, d.dc);
        else this.render();
      }
      this.drag = null;
    };
    this.cv.addEventListener('pointerup', up);
    this.cv.addEventListener('pointercancel', up);
  }

  doSeek(c) {
    const now = performance.now();
    if (now - this._lastSeek < 160) return;
    this._lastSeek = now;
    this.onSeek?.(Math.max(0, Math.min(this.store.song.steps - 1, c)));
  }

  place(ds, inst, accent) {
    const { song } = this.store;
    const key = ds.r + ',' + ds.c;
    delete song.spans[key]; delete song.vels[key]; delete song.slides[key];
    if (song.halves) delete song.halves[key];
    song.notes[key] = inst;
    if (accent) song.vels[key] = 3;
    this.transport.preview(inst, rowToMidi(ds.r));
    this.store.touch();
    this.render();
  }

  eraseAt(ds) {
    const { song } = this.store;
    const own = this.findOwner(ds.r, ds.c);
    if (own) {
      delete song.notes[own.key]; delete song.spans[own.key];
      delete song.vels[own.key]; delete song.slides[own.key];
      if (song.halves) delete song.halves[own.key];
      this.store.touch();
      this.render();
    }
  }

  applyDrum(ds) {
    const { song } = this.store;
    const key = ds.l + ',' + ds.c;
    const d = this.drag;
    if (d.painted.has(key)) return;
    d.painted.add(key);
    if (d.erase) { delete song.drums[key]; if (song.halves) delete song.halves['d' + key]; }
    else if (song.drums[key] && d.painted.size === 1) {
      d.erase = true;
      delete song.drums[key];
      if (song.halves) delete song.halves['d' + key];
    } else {
      song.drums[key] = d.vel;
      this.transport.previewDrum(ds.l);
    }
    this.store.touch();
    this.render();
  }
}

// ===== 熱狗仔：程序繪製的像素熱狗吉祥物（會跟拍子跳舞）=====
export class Mascot {
  constructor(canvas) {
    this.cv = canvas;
    this.g = canvas.getContext('2d');
    this.beat = 0;
    this.playing = false;
    this.t = 0;
  }

  px(x, y, w, h, c) {
    this.g.fillStyle = c;
    this.g.fillRect(x * 4, y * 4, w * 4, h * 4);
  }

  draw() {
    const g = this.g;
    g.clearRect(0, 0, this.cv.width, this.cv.height);
    const P = {
      K: '#140b22',
      S: '#cf5533', SD: '#a03c22', SH: '#ef7a52',
      B: '#e9a558', BD: '#c17f3c', BH: '#f7c98b',
      Y: '#ffd23f', W: '#ffffff', C: '#ff8a75', T: '#ff6b6b',
    };
    const bounce = this.playing ? (this.beat % 2) : 0;
    const y0 = 4 - bounce;
    const wob = this.playing ? ((this.beat >> 1) % 2 ? 1 : 0) : 0;

    if (this.playing) {
      const puff = (this.t >> 3) % 3;
      this.px(6 + puff, y0 - 3, 1, 2, 'rgba(255,236,200,.45)');
      this.px(18 - puff, y0 - 4, 1, 2, 'rgba(255,236,200,.3)');
      if (puff === 1) this.px(12, y0 - 4, 2, 1, 'rgba(255,236,200,.35)');
    }

    this.px(1 + wob, y0, 24, 7, P.K);
    this.px(0 + wob, y0 + 1, 26, 5, P.K);
    this.px(2 + wob, y0 + 1, 22, 5, P.S);
    this.px(1 + wob, y0 + 2, 24, 3, P.S);
    this.px(3 + wob, y0 + 1, 20, 1, P.SH);
    this.px(2 + wob, y0 + 5, 22, 1, P.SD);

    this.px(3 + wob, y0 + 1, 2, 1, P.Y);
    this.px(5 + wob, y0 + 2, 2, 1, P.Y);
    this.px(18 + wob, y0 + 1, 2, 1, P.Y);
    this.px(20 + wob, y0 + 2, 2, 1, P.Y);

    const blink = !this.playing && (this.t % 90) < 4;
    if (blink) {
      this.px(8 + wob, y0 + 3, 2, 1, P.K);
      this.px(15 + wob, y0 + 3, 2, 1, P.K);
    } else {
      this.px(8 + wob, y0 + 2, 2, 2, P.K);
      this.px(15 + wob, y0 + 2, 2, 2, P.K);
      this.px(8 + wob, y0 + 2, 1, 1, P.W);
      this.px(15 + wob, y0 + 2, 1, 1, P.W);
    }
    this.px(6 + wob, y0 + 4, 1, 1, P.C);
    this.px(18 + wob, y0 + 4, 1, 1, P.C);
    if (this.playing) {
      this.px(11 + wob, y0 + 3, 3, 2, P.K);
      this.px(12 + wob, y0 + 4, 1, 1, P.T);
    } else {
      this.px(11 + wob, y0 + 4, 3, 1, P.K);
    }

    this.px(2, y0 + 5, 22, 6, P.K);
    this.px(1, y0 + 6, 24, 4, P.K);
    this.px(3, y0 + 6, 20, 4, P.B);
    this.px(2, y0 + 7, 22, 2, P.B);
    this.px(3, y0 + 6, 20, 1, P.BH);
    this.px(3, y0 + 9, 20, 1, P.BD);
    this.px(6, y0 + 7, 1, 1, P.BH);
    this.px(11, y0 + 8, 1, 1, P.BH);
    this.px(16, y0 + 7, 1, 1, P.BH);
    this.px(20, y0 + 8, 1, 1, P.BH);

    if (this.playing) {
      const up = this.beat % 2;
      this.px(0, y0 + 4 - up * 3, 2, 2, P.K);
      this.px(24, y0 + 4 - (1 - up) * 3, 2, 2, P.K);
    } else {
      this.px(0, y0 + 7, 2, 2, P.K);
      this.px(24, y0 + 7, 2, 2, P.K);
    }

    const kick = this.playing ? this.beat % 2 : 0;
    this.px(7, y0 + 11, 3, 2 - kick, P.K);
    this.px(16, y0 + 11, 3, 1 + kick, P.K);
    this.px(6, y0 + 13 - kick, 4, 1, P.K);
    this.px(15, y0 + 12 + kick, 4, 1, P.K);
  }

  tick(playing, beat) {
    this.playing = playing;
    if (beat !== undefined) this.beat = beat;
    this.t++;
    this.draw();
  }
}
