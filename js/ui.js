// 音格畫布（piano-roll）渲染與互動 + 爐芯獸吉祥物
import { ROWS, rowToMidi, NOTE_NAMES, pc, CHORD_CYCLE, CHORDS } from './theory.js';
import { SEC_INFO } from './themes.js';

export const GUT = 46;       // 左側標籤欄
export const SEC_H = 14;     // 段落色帶
export const CHORD_H = 20;   // 和弦列
export const CELL_W = 20;
export const CELL_H = 16;
export const DRUM_GAP = 4;
export const DRUM_ROWS = 3;
export const ROLL_H = SEC_H + CHORD_H + ROWS * CELL_H + DRUM_GAP + DRUM_ROWS * CELL_H;

const COLORS = {
  lead: '#ffd23f', harm: '#ff5f7a', bass: '#4ade8c', noise: '#a5b4ff',
  drums: ['#ff8a4d', '#c77dff', '#6fd8ff'],
  bg: '#150e26', beat: '#1c1333', bar: '#2e2152', seg: '#241a44',
  gut: '#0d0818', text: '#9187bd', chordBg: '#100a1e',
};

export class Roll {
  constructor(canvas, store, transport) {
    this.cv = canvas;
    this.ctx = canvas.getContext('2d');
    this.store = store;
    this.transport = transport;
    this.tool = 'lead';
    this.drag = null;
    this.onSeek = null;   // (step) 時間軸點擊/拖曳
    this._lastSeek = 0;
    this.bindPointer();
  }

  noteTop() { return SEC_H + CHORD_H; }
  drumTop() { return this.noteTop() + ROWS * CELL_H + DRUM_GAP; }

  resize() {
    const { steps } = this.store.song;
    this.cv.width = GUT + steps * CELL_W;
    this.cv.height = ROLL_H;
    this.render();
  }

  // ---- 渲染 ----
  render() {
    const { song } = this.store;
    const g = this.ctx, W = this.cv.width;
    g.fillStyle = COLORS.bg;
    g.fillRect(0, 0, W, ROLL_H);

    const nTop = this.noteTop(), dTop = this.drumTop();

    // 節拍底色
    for (let c = 0; c < song.steps; c++) {
      if (c % 4 === 0) {
        g.fillStyle = COLORS.beat;
        g.fillRect(GUT + c * CELL_W, nTop, CELL_W, ROWS * CELL_H);
        g.fillRect(GUT + c * CELL_W, dTop, CELL_W, DRUM_ROWS * CELL_H);
      }
    }
    // 黑鍵列陰影
    for (let r = 0; r < ROWS; r++) {
      if ([1, 3, 6, 8, 10].includes(pc(rowToMidi(r)))) {
        g.fillStyle = 'rgba(0,0,0,.22)';
        g.fillRect(GUT, nTop + r * CELL_H, W - GUT, CELL_H);
      }
    }
    // 格線
    g.fillStyle = 'rgba(0,0,0,.35)';
    for (let r = 1; r < ROWS; r++) g.fillRect(GUT, nTop + r * CELL_H, W - GUT, 1);
    for (let l = 1; l < DRUM_ROWS; l++) g.fillRect(GUT, dTop + l * CELL_H, W - GUT, 1);
    for (let c = 1; c < song.steps; c++) {
      g.fillStyle = c % 16 === 0 ? COLORS.bar : c % 8 === 0 ? COLORS.seg : 'rgba(0,0,0,.35)';
      const w = c % 8 === 0 ? 2 : 1;
      g.fillRect(GUT + c * CELL_W, SEC_H, w, ROLL_H - SEC_H);
    }

    // 段落色帶
    g.fillStyle = COLORS.chordBg;
    g.fillRect(GUT, 0, W - GUT, SEC_H);
    (song.secTags || []).forEach(sec => {
      const info = SEC_INFO[sec.kind] || { label: sec.kind, color: '#555' };
      const x = GUT + sec.startBar * 16 * CELL_W;
      const w = sec.bars * 16 * CELL_W;
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

    // 和弦列
    g.fillStyle = COLORS.chordBg;
    g.fillRect(GUT, SEC_H, W - GUT, CHORD_H);
    g.font = '12px FPXLatin, FPXHant, monospace';
    song.chords.forEach((ch, i) => {
      const x = GUT + i * 8 * CELL_W;
      g.fillStyle = '#ffc848';
      g.fillText(ch, x + 6, SEC_H + CHORD_H / 2 + 1);
    });

    // 和弦引導：把和弦音的列打淡光
    for (let i = 0; i < song.chords.length; i++) {
      const pcs = CHORDS[song.chords[i]] || [];
      if (!pcs.length) continue;
      const x = GUT + i * 8 * CELL_W, w = 8 * CELL_W;
      for (let r = 0; r < ROWS; r++) {
        if (pcs[0] === pc(rowToMidi(r))) { // 根音較亮
          g.fillStyle = 'rgba(255,200,72,.10)';
          g.fillRect(x, nTop + r * CELL_H, w, CELL_H);
        } else if (pcs.includes(pc(rowToMidi(r)))) {
          g.fillStyle = 'rgba(255,255,255,.045)';
          g.fillRect(x, nTop + r * CELL_H, w, CELL_H);
        }
      }
    }

    // 音符
    for (const [k, inst] of Object.entries(song.notes)) {
      const [r, c] = k.split(',').map(Number);
      if (r < 0 || r >= ROWS || c >= song.steps) continue;
      const span = song.spans[k] || 1;
      const vel = song.vels[k] || 1;
      const col = COLORS[inst] || '#fff';
      const x = GUT + c * CELL_W, y = nTop + r * CELL_H;
      g.globalAlpha = [0.55, 1, 1][vel - 1] ?? 1;
      // 尾巴
      if (span > 1) {
        g.fillStyle = col;
        g.globalAlpha *= 0.4;
        g.fillRect(x + CELL_W - 2, y + 4, (span - 1) * CELL_W, CELL_H - 8);
        g.globalAlpha = [0.55, 1, 1][vel - 1] ?? 1;
      }
      // 本體（像素斜面）
      g.fillStyle = col;
      g.fillRect(x + 1, y + 1, CELL_W - 3, CELL_H - 3);
      g.fillStyle = 'rgba(255,255,255,.5)';
      g.fillRect(x + 1, y + 1, CELL_W - 3, 2);
      g.fillRect(x + 1, y + 1, 2, CELL_H - 3);
      g.fillStyle = 'rgba(0,0,0,.35)';
      g.fillRect(x + 1, y + CELL_H - 4, CELL_W - 3, 2);
      if (vel === 3) { // 重音記號
        g.fillStyle = '#fff';
        g.fillRect(x + CELL_W - 7, y + 3, 3, 3);
      }
      g.globalAlpha = 1;
      // 滑音箭頭
      if (song.slides[k] !== undefined) {
        const tr = song.slides[k];
        const ty = nTop + tr * CELL_H + CELL_H / 2;
        g.strokeStyle = col;
        g.lineWidth = 2;
        g.beginPath();
        g.moveTo(x + CELL_W * span - 4, y + CELL_H / 2);
        g.lineTo(x + CELL_W * span + 4, ty);
        g.stroke();
      }
    }

    // 鼓
    for (const [k, v] of Object.entries(song.drums)) {
      if (!v) continue;
      const [l, c] = k.split(',').map(Number);
      if (l < 0 || l >= DRUM_ROWS || c >= song.steps) continue;
      const col = COLORS.drums[l];
      const x = GUT + c * CELL_W, y = dTop + l * CELL_H;
      g.fillStyle = col;
      const inset = v === 2 ? 2 : 4;
      g.fillRect(x + inset, y + inset, CELL_W - inset * 2 - 1, CELL_H - inset * 2 - 1);
      if (v === 2) {
        g.fillStyle = 'rgba(255,255,255,.55)';
        g.fillRect(x + inset, y + inset, CELL_W - inset * 2 - 1, 2);
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
    const dnames = ['大鼓', '小鼓', '踏鈸'];
    g.font = '12px FPXHant, monospace';
    dnames.forEach((n, l) => {
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
    const c = Math.floor((x - GUT) / CELL_W);
    if (c < 0 || c >= this.store.song.steps) return null;
    const nTop = this.noteTop(), dTop = this.drumTop();
    if (y < SEC_H) return { kind: 'ruler', c };
    if (y >= SEC_H && y < SEC_H + CHORD_H) return { kind: 'chord', seg: Math.floor(c / 8) };
    if (y >= nTop && y < nTop + ROWS * CELL_H) return { kind: 'note', r: Math.floor((y - nTop) / CELL_H), c };
    if (y >= dTop && y < dTop + DRUM_ROWS * CELL_H) return { kind: 'drum', l: Math.floor((y - dTop) / CELL_H), c };
    return null;
  }

  // 找覆蓋此格的音（含 span 尾巴）
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

  // ---- 互動 ----
  bindPointer() {
    this.cv.addEventListener('contextmenu', e => e.preventDefault());
    this.cv.addEventListener('pointerdown', e => {
      const ds = this.locate(e);
      if (!ds) return;
      this.cv.setPointerCapture(e.pointerId);

      // 時間軸：點擊/拖曳從該位置播放（剪輯軟體式 scrub）
      if (ds.kind === 'ruler') {
        this.drag = { mode: 'seek', lastC: -1 };
        this.doSeek(ds.c);
        return;
      }

      const erase = e.button === 2 || this.tool === 'erase';
      this.store.pushHistory();

      if (ds.kind === 'chord') {
        const dir = e.button === 2 ? -1 : 1;
        const cur = this.store.song.chords[ds.seg] || 'Am';
        const i = CHORD_CYCLE.indexOf(cur);
        this.store.song.chords[ds.seg] = CHORD_CYCLE[(i + dir + CHORD_CYCLE.length) % CHORD_CYCLE.length];
        this.store.touch();
        this.render();
        return;
      }

      if (ds.kind === 'drum') {
        this.drag = { mode: 'drum', erase, vel: e.shiftKey ? 2 : 1, painted: new Set() };
        this.applyDrum(ds);
        return;
      }

      // note 區
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
      // 筆：同種音再點 = 擦除
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
      const ds = this.locate(e);
      if (!ds) return;
      const d = this.drag;
      if (d.mode === 'seek') { if (ds.c !== d.lastC) { d.lastC = ds.c; this.doSeek(ds.c); } }
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
        // 放開在不同列 → 滑音
        this.store.song.slides[d.own.key] = d.lastR;
        this.store.touch();
        this.render();
      }
      this.drag = null;
    };
    this.cv.addEventListener('pointerup', up);
    this.cv.addEventListener('pointercancel', up);
  }

  doSeek(c) {
    const now = performance.now();
    if (now - this._lastSeek < 160) return; // 節流：拖曳時不狂重啟
    this._lastSeek = now;
    this.onSeek?.(Math.max(0, Math.min(this.store.song.steps - 1, c)));
  }

  place(ds, inst, accent) {
    const { song } = this.store;
    const key = ds.r + ',' + ds.c;
    // 同格已有其他音 → 覆蓋
    delete song.spans[key]; delete song.vels[key]; delete song.slides[key];
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
    if (d.erase) delete song.drums[key];
    else if (song.drums[key] && d.painted.size === 1 && !d.eraseMode) {
      // 第一下點在已有的鼓上 → 本次拖曳變成擦除
      d.erase = true;
      delete song.drums[key];
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
      K: '#140b22',              // 外框
      S: '#cf5533', SD: '#a03c22', SH: '#ef7a52',   // 香腸
      B: '#e9a558', BD: '#c17f3c', BH: '#f7c98b',   // 麵包
      Y: '#ffd23f', W: '#ffffff', C: '#ff8a75', T: '#ff6b6b',
    };
    const bounce = this.playing ? (this.beat % 2) : 0;
    const y0 = 4 - bounce;
    const wob = this.playing ? ((this.beat >> 1) % 2 ? 1 : 0) : 0; // 左右搖擺

    // 熱氣（播放時）
    if (this.playing) {
      const puff = (this.t >> 3) % 3;
      this.px(6 + puff, y0 - 3, 1, 2, 'rgba(255,236,200,.45)');
      this.px(18 - puff, y0 - 4, 1, 2, 'rgba(255,236,200,.3)');
      if (puff === 1) this.px(12, y0 - 4, 2, 1, 'rgba(255,236,200,.35)');
    }

    // ---- 香腸（含外框圓角）----
    this.px(1 + wob, y0, 24, 7, P.K);
    this.px(0 + wob, y0 + 1, 26, 5, P.K);
    this.px(2 + wob, y0 + 1, 22, 5, P.S);
    this.px(1 + wob, y0 + 2, 24, 3, P.S);
    this.px(3 + wob, y0 + 1, 20, 1, P.SH);
    this.px(2 + wob, y0 + 5, 22, 1, P.SD);

    // 芥末醬波浪（避開臉的位置）
    this.px(3 + wob, y0 + 1, 2, 1, P.Y);
    this.px(5 + wob, y0 + 2, 2, 1, P.Y);
    this.px(18 + wob, y0 + 1, 2, 1, P.Y);
    this.px(20 + wob, y0 + 2, 2, 1, P.Y);

    // ---- 臉 ----
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
    this.px(6 + wob, y0 + 4, 1, 1, P.C);   // 腮紅
    this.px(18 + wob, y0 + 4, 1, 1, P.C);
    if (this.playing) {                     // 唱歌的嘴
      this.px(11 + wob, y0 + 3, 3, 2, P.K);
      this.px(12 + wob, y0 + 4, 1, 1, P.T);
    } else {                                // 微笑（跟眼睛保持距離，避免看起來像皺眉）
      this.px(11 + wob, y0 + 4, 3, 1, P.K);
    }

    // ---- 麵包（抱住香腸下半）----
    this.px(2, y0 + 5, 22, 6, P.K);
    this.px(1, y0 + 6, 24, 4, P.K);
    this.px(3, y0 + 6, 20, 4, P.B);
    this.px(2, y0 + 7, 22, 2, P.B);
    this.px(3, y0 + 6, 20, 1, P.BH);
    this.px(3, y0 + 9, 20, 1, P.BD);
    // 芝麻
    this.px(6, y0 + 7, 1, 1, P.BH);
    this.px(11, y0 + 8, 1, 1, P.BH);
    this.px(16, y0 + 7, 1, 1, P.BH);
    this.px(20, y0 + 8, 1, 1, P.BH);

    // ---- 手（播放時輪流舉手）----
    if (this.playing) {
      const up = this.beat % 2;
      this.px(0, y0 + 4 - up * 3, 2, 2, P.K);
      this.px(24, y0 + 4 - (1 - up) * 3, 2, 2, P.K);
    } else {
      this.px(0, y0 + 7, 2, 2, P.K);
      this.px(24, y0 + 7, 2, 2, P.K);
    }

    // ---- 腳（跳舞時輪流踢）----
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
