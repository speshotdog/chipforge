// ChipForge 進入點：組裝 store / 合成器 / 傳輸 / 音格 / 鍛造流程
import { Store, BAR_OPTIONS, defaultMixer } from './state.js';
import { createLiveSynth } from './synth.js';
import { Transport } from './scheduler.js';
import { Roll, Mascot, GUT, CELL_W } from './ui.js';
import { THEMES, CATEGORIES } from './themes.js';
import { composeSong, nightVariant, NIGHT_MIXER_PATCH, extractMotif } from './composer.js';
import { forge, varySeed, DIRECTOR_MODES, POWER_LEVELS, scoreSong, makeSeed } from './director.js';
import { exportWav, exportMidi, exportJson, importJson, songToUrl, songFromHash } from './exporter.js';

const $ = id => document.getElementById(id);

async function boot() {
  const store = new Store();
  store.load();

  // 分享連結載入
  const shared = await songFromHash(location.hash);
  if (shared) {
    store.song = shared;
    history.replaceState(null, '', location.pathname);
  }

  const synth = await createLiveSynth(() => store.mixer);
  const transport = new Transport(synth, store);
  const roll = new Roll($('roll'), store, transport);
  const mascot = new Mascot($('mascot'));
  const playhead = $('playhead');
  const rollScroll = $('rollScroll');

  let busy = false;
  let candidates = [];

  // ===== 傳輸 =====
  const btnPlay = $('btnPlay');
  btnPlay.onclick = () => transport.toggle();
  transport.onState = playing => {
    btnPlay.textContent = playing ? '■ 停止' : '▶ 播放';
    btnPlay.classList.toggle('playing', playing);
    if (!playing) playhead.style.opacity = 0;
  };
  transport.onStep = step => {
    playhead.style.opacity = 1;
    playhead.style.left = (GUT + step * CELL_W) + 'px';
    mascot.beat = Math.floor(step / 4);
    const x = GUT + step * CELL_W;
    if (x < rollScroll.scrollLeft + 40 || x > rollScroll.scrollLeft + rollScroll.clientWidth - 60) {
      rollScroll.scrollLeft = Math.max(0, x - 80);
    }
  };

  // 時間軸 scrub：點/拖段落色帶從該處播放
  roll.onSeek = step => transport.start(step);

  // ===== 頂欄 =====
  const bpmInput = $('bpm'), bpmVal = $('bpmVal');
  bpmInput.oninput = () => {
    store.song.bpm = +bpmInput.value;
    bpmVal.textContent = bpmInput.value;
    synth.setBpm(store.song.bpm);
    store.save();
  };

  const masterVol = $('masterVol'), masterVolVal = $('masterVolVal');
  masterVol.value = store.mixer.master ?? 60;
  masterVolVal.textContent = masterVol.value;
  masterVol.oninput = () => {
    store.mixer.master = +masterVol.value;
    masterVolVal.textContent = masterVol.value;
    synth.syncMixer();
    store.save();
  };

  const barPicker = $('barPicker');
  BAR_OPTIONS.forEach(b => {
    const btn = document.createElement('button');
    btn.textContent = b;
    btn.dataset.bars = b;
    btn.onclick = () => { store.setBars(b); };
    barPicker.appendChild(btn);
  });

  $('btnUndo').onclick = () => store.undo();
  $('btnRedo').onclick = () => store.redo();
  $('btnClear').onclick = () => {
    if (!confirm('確定要把音格全部清空嗎？')) return;
    store.mutate(s => {
      s.notes = {}; s.spans = {}; s.vels = {}; s.slides = {}; s.drums = {};
      s.secTags = null; s.seed = null;
    });
  };

  // ===== 工具列 =====
  document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      roll.tool = btn.dataset.tool;
    };
  });

  // ===== 主題：分類選單 =====
  const themesEl = $('themes');
  const catsEl = $('themeCats');
  const catOf = themeId => CATEGORIES.find(c => c.themes.includes(themeId)) || CATEGORIES[0];
  let activeCat = localStorage.getItem('chipforge.cat.v1') || catOf(store.song.theme).id;
  if (!CATEGORIES.some(c => c.id === activeCat)) activeCat = CATEGORIES[0].id;

  function renderCats() {
    catsEl.innerHTML = '';
    CATEGORIES.forEach(cat => {
      const tab = document.createElement('button');
      tab.className = 'cat-tab' + (cat.id === activeCat ? ' active' : '');
      tab.textContent = cat.label;
      tab.onclick = () => {
        activeCat = cat.id;
        localStorage.setItem('chipforge.cat.v1', activeCat);
        renderCats(); renderThemeChips();
      };
      catsEl.appendChild(tab);
    });
  }

  function renderThemeChips() {
    themesEl.innerHTML = '';
    const cat = CATEGORIES.find(c => c.id === activeCat) || CATEGORIES[0];
    cat.themes.forEach(id => {
      const t = THEMES[id];
      if (!t) return;
      const chip = document.createElement('button');
      chip.className = 'theme-chip' + (id === store.song.theme ? ' active' : '');
      chip.dataset.theme = id;
      chip.innerHTML = `<b>${t.icon}</b>${t.label}`;
      chip.onclick = () => {
        store.song.theme = id;
        refreshThemeChips();
        doForge();
      };
      themesEl.appendChild(chip);
    });
  }

  function refreshThemeChips() {
    document.querySelectorAll('.theme-chip').forEach(c =>
      c.classList.toggle('active', c.dataset.theme === store.song.theme));
  }
  renderCats();
  renderThemeChips();

  // ===== 屬性滑桿 =====
  const SLIDERS = [
    ['density', '音符密度', '疏', '密'],
    ['rhythm', '節奏密度', '緩', '刻'],
    ['speed', '速度傾向', '慢', '快'],
    ['drama', '戲劇性', '穩', '展'],
    ['mood', '明暗', '暗', '亮'],
    ['hook', '記憶點', '變', '重'],
    ['smooth', '滑順度', '跳', '唱'],
  ];
  const slidersEl = $('sliders');
  SLIDERS.forEach(([key, name]) => {
    const row = document.createElement('div');
    row.className = 'sl-row';
    row.innerHTML = `<span class="sl-name">${name}</span>
      <input type="range" class="px-range" min="0" max="100" value="${store.gen[key]}" data-gen="${key}">
      <span class="sl-val">${store.gen[key]}</span>`;
    const input = row.querySelector('input'), val = row.querySelector('.sl-val');
    input.oninput = () => { store.gen[key] = +input.value; val.textContent = input.value; store.save(); };
    slidersEl.appendChild(row);
  });
  $('tglSeq').checked = store.gen.sequenz;
  $('tglSeq').onchange = e => { store.gen.sequenz = e.target.checked; store.save(); };

  // ===== 總監循環按鈕 =====
  const cycDirector = $('cycDirector'), cycPower = $('cycPower'), cycForm = $('cycForm');
  const FORMS = [['auto', '自動'], ['hookfirst', '開場副歌'], ['loop', '遊戲循環'], ['boss', '魔王戰']];
  const cycle = (btn, list, key, labelOf) => {
    const refresh = () => btn.textContent = labelOf();
    btn.onclick = () => {
      const idx = list.findIndex(x => (x.id ?? x[0]) === store.gen[key]);
      const next = list[(idx + 1) % list.length];
      store.gen[key] = next.id ?? next[0];
      store.save(); refresh();
    };
    refresh();
  };
  cycle(cycDirector, DIRECTOR_MODES, 'director',
    () => (DIRECTOR_MODES.find(m => m.id === store.gen.director) || DIRECTOR_MODES[0]).label);
  cycle(cycPower, POWER_LEVELS, 'power',
    () => (POWER_LEVELS.find(p => p.id === store.gen.power) || POWER_LEVELS[1]).label);
  cycle(cycForm, FORMS, 'form',
    () => (FORMS.find(f => f[0] === store.gen.form) || FORMS[0])[1]);

  // ===== 鍛造 =====
  const forgeStatus = $('forgeStatus'), candidatesEl = $('candidates'), btnForge = $('btnForge');

  async function doForge() {
    if (busy) return;
    busy = true;
    btnForge.disabled = true;
    forgeStatus.classList.add('busy');
    transport.stop();
    const theme = store.song.theme in THEMES ? store.song.theme : 'bright';
    const count = (POWER_LEVELS.find(p => p.id === store.gen.power) || POWER_LEVELS[1]).count;
    forgeStatus.textContent = `熔爐加熱中 0/${count}`;
    // 曲風配器提示：抒情系自動換鋼琴主奏；沒有提示的曲風把鋼琴還原成方波
    const tone = THEMES[theme].tone;
    if (tone) {
      store.mixer.duty = { ...store.mixer.duty, ...tone };
    } else if (store.mixer.duty.lead === 'piano') {
      store.mixer.duty = { ...store.mixer.duty, lead: '25%' };
    }
    synth.syncMixer();
    try {
      const picked = await forge({
        theme, steps: store.song.steps, gen: store.gen, count,
        onProgress: (i, n) => forgeStatus.textContent = `鍛造中 ${i}/${n}`,
      });
      candidates = picked;
      clearPair(); // 新鍛的曲子與舊日夜配對無關
      applyCandidate(0, false);
      renderCandidates();
      forgeStatus.textContent = count > 1 ? `出爐！自動選了最高分（${picked[0].score.toFixed(1)} 分）` : '出爐！';
      transport.start(0);
    } catch (e) {
      console.error(e);
      forgeStatus.textContent = '鍛造失敗，再試一次';
    }
    forgeStatus.classList.remove('busy');
    btnForge.disabled = false;
    busy = false;
  }

  function applyCandidate(i, play = true) {
    const c = candidates[i];
    if (!c) return;
    const song = JSON.parse(JSON.stringify(c.song));
    store.applySong(song);
    bpmInput.value = song.bpm; bpmVal.textContent = song.bpm;
    synth.setBpm(song.bpm);
    document.querySelectorAll('.cand-chip').forEach((el, j) => el.classList.toggle('active', j === i));
    if (play) transport.start(0);
  }

  function renderCandidates() {
    candidatesEl.innerHTML = '';
    if (candidates.length < 2) return;
    candidates.forEach((c, i) => {
      const chip = document.createElement('button');
      chip.className = 'cand-chip' + (i === 0 ? ' active' : '');
      chip.innerHTML = `曲${'一二三'[i] || i + 1}<small>${c.score.toFixed(1)}</small>`;
      chip.onclick = () => applyCandidate(i);
      candidatesEl.appendChild(chip);
    });
  }

  // ===== 雷特動機（Leitmotif）=====
  const btnMotif = $('btnMotif');
  function refreshMotifBtn() {
    const m = store.gen.motif;
    if (m && m.rhythm) {
      btnMotif.textContent = `♪×${m.rhythm.length} 使用中（點擊清除）`;
      btnMotif.style.color = 'var(--lead)';
    } else {
      btnMotif.textContent = '記住動機';
      btnMotif.style.color = '';
    }
  }
  btnMotif.onclick = () => {
    if (store.gen.motif) {
      store.gen.motif = null;
      forgeStatus.textContent = '動機已清除，之後的新曲回到自由旋律';
    } else {
      const m = extractMotif(store.song);
      if (!m) { forgeStatus.textContent = '找不到可用的動機（主旋律太少）'; return; }
      store.gen.motif = m;
      forgeStatus.textContent = `記住了 ${m.rhythm.length} 音動機！之後每首新曲都會以它開場`;
    }
    store.save();
    refreshMotifBtn();
  };
  refreshMotifBtn();

  // ===== 地區 BGM 日夜配對 =====
  const PAIR_LS = 'chipforge.pair.v1';
  let pair = null;
  try { pair = JSON.parse(localStorage.getItem(PAIR_LS)); } catch (e) { }

  function savePair() {
    try { localStorage.setItem(PAIR_LS, JSON.stringify(pair)); } catch (e) { }
  }

  function applyNightMixer() {
    if (!pair.mixerBackup) {
      pair.mixerBackup = JSON.parse(JSON.stringify(store.mixer));
      const m = store.mixer;
      for (const [k, v] of Object.entries(NIGHT_MIXER_PATCH)) {
        if (typeof v === 'object') m[k] = { ...m[k], ...v };
        else m[k] = v;
      }
    }
  }
  function restoreDayMixer() {
    if (pair?.mixerBackup) {
      store.mixer = pair.mixerBackup;
      pair.mixerBackup = null;
    }
  }

  function applyPairVersion(which, play = true) {
    if (!pair?.[which]) return;
    if (which === 'night') applyNightMixer(); else restoreDayMixer();
    synth.syncMixer();
    pair.current = which;
    savePair();
    const song = JSON.parse(JSON.stringify(pair[which]));
    store.applySong(song);
    bpmInput.value = song.bpm; bpmVal.textContent = song.bpm;
    synth.setBpm(song.bpm);
    renderPairChips();
    if (play) transport.start(0);
  }

  function renderPairChips() {
    const el = $('pairChips');
    el.innerHTML = '';
    if (!pair?.day) return;
    [['day', '☀ 日版'], ['night', '🌙 夜版']].forEach(([which, label]) => {
      const chip = document.createElement('button');
      chip.className = 'cand-chip pair-chip' + (pair.current === which ? ` active-${which}` : '');
      chip.textContent = label;
      chip.onclick = () => applyPairVersion(which);
      el.appendChild(chip);
    });
  }

  $('btnNight').onclick = () => {
    if (busy) return;
    restoreDayMixer?.();
    const day = JSON.parse(JSON.stringify(store.song));
    const night = nightVariant(day);
    pair = { day, night, current: 'night', mixerBackup: null };
    forgeStatus.textContent = '夜間變奏完成，可用日夜按鈕即時切換';
    applyPairVersion('night');
  };

  function clearPair() {
    if (pair?.mixerBackup) restoreDayMixer();
    pair = null;
    savePair();
    renderPairChips();
  }
  renderPairChips();

  btnForge.onclick = doForge;
  $('btnReforge').onclick = doForge;
  $('btnVary').onclick = () => {
    if (busy) return;
    const theme = store.song.theme in THEMES ? store.song.theme : 'bright';
    const seed = varySeed(store.song.seed || makeSeed(theme, store.gen), 'v' + Date.now() % 997);
    const song = composeSong({ theme, steps: store.song.steps, gen: store.gen, seed });
    candidates = [{ song, seed, score: scoreSong(song, store.gen.director) }];
    candidatesEl.innerHTML = '';
    clearPair();
    applyCandidate(0);
    forgeStatus.textContent = '變奏完成';
  };

  // ===== 匯出 =====
  $('btnWav').onclick = async e => {
    const btn = e.currentTarget;
    if (btn.disabled) return;
    btn.disabled = true; btn.textContent = '渲染中…';
    try { await exportWav(store.song, store.mixer); }
    catch (err) { console.error(err); alert('WAV 匯出失敗'); }
    btn.disabled = false; btn.textContent = '♪ WAV 音檔';
  };
  $('btnMidi').onclick = () => exportMidi(store.song, store.mixer);
  $('btnJson').onclick = () => exportJson(store.song);
  $('btnLoad').onclick = () => $('fileInput').click();
  $('fileInput').onchange = e => {
    const f = e.target.files[0];
    if (f) importJson(f, s => { store.applySong(s); });
    e.target.value = '';
  };
  $('btnShare').onclick = async () => {
    const url = await songToUrl(store.song);
    try {
      await navigator.clipboard.writeText(url);
      $('exHint').textContent = '連結已複製！整首曲子都在網址裡';
    } catch (e) {
      prompt('複製這個連結：', url);
    }
    setTimeout(() => $('exHint').textContent = '曲子會自動保存在瀏覽器裡', 4000);
  };

  // ===== 混音台 =====
  const modal = $('mixerModal');
  $('btnMixer').onclick = () => { buildMixer(); modal.classList.remove('hidden'); };
  $('btnMixClose').onclick = () => modal.classList.add('hidden');
  modal.onclick = e => { if (e.target === modal) modal.classList.add('hidden'); };
  $('btnMixReset').onclick = () => {
    if (!confirm('混音台恢復預設值？（曲子不受影響）')) return;
    store.mixer = defaultMixer();
    synth.syncMixer(); store.save(); buildMixer();
  };

  function buildMixer() {
    const m = store.mixer;
    const body = $('mixerBody');
    body.innerHTML = '';
    const sep = txt => {
      const el = document.createElement('div');
      el.className = 'mx-sep'; el.textContent = txt;
      body.appendChild(el);
    };
    const slider = (label, get, set, min = 0, max = 100) => {
      const row = document.createElement('div');
      row.className = 'mx-row';
      row.innerHTML = `<span class="mx-name">${label}</span>
        <input type="range" class="px-range" min="${min}" max="${max}" value="${get()}">
        <span class="mx-val">${get()}</span><span></span><span></span>`;
      const inp = row.querySelector('input'), val = row.querySelector('.mx-val');
      inp.oninput = () => { set(+inp.value); val.textContent = inp.value; synth.syncMixer(); store.save(); };
      body.appendChild(row);
      return row;
    };
    const CH_NAMES = { lead: '主旋律', harm: '和聲', bass: '貝斯', noise: '噪音', drum: '鼓組' };
    sep('音量／獨奏');
    for (const ch of Object.keys(CH_NAMES)) {
      const row = slider(CH_NAMES[ch], () => m.vol[ch], v => m.vol[ch] = v);
      const ms = document.createElement('div');
      ms.className = 'mx-ms';
      const bM = document.createElement('button'); bM.textContent = 'M';
      const bS = document.createElement('button'); bS.textContent = 'S';
      const refresh = () => {
        bM.className = m.mute[ch] ? 'on-m' : '';
        bS.className = m.solo[ch] ? 'on-s' : '';
      };
      bM.onclick = () => { m.mute[ch] = !m.mute[ch]; refresh(); store.save(); };
      bS.onclick = () => { m.solo[ch] = !m.solo[ch]; refresh(); store.save(); };
      refresh();
      ms.append(bM, bS);
      row.children[3].replaceWith(ms);
    }
    sep('鼓組音量');
    slider('大鼓', () => m.kick, v => m.kick = v);
    slider('小鼓', () => m.snare, v => m.snare = v);
    slider('踏鈸', () => m.hat, v => m.hat = v);
    sep('音色');
    const opts = document.createElement('div');
    opts.className = 'mx-opts';
    opts.innerHTML = `
      <label>主旋律波形 <select data-k="dutyLead">
        <option value="12.5%">方波 12.5%</option><option value="25%">方波 25%</option><option value="50%">方波 50%</option><option value="piano">鋼琴 🎹</option>
      </select></label>
      <label>和聲波形 <select data-k="dutyHarm">
        <option value="12.5%">方波 12.5%</option><option value="25%">方波 25%</option><option value="50%">方波 50%</option><option value="piano">鋼琴 🎹</option>
      </select></label>
      <label>貝斯 <select data-k="bassWave">
        <option value="tri">三角波</option><option value="pulse">方波</option><option value="slap">擊弦</option>
      </select></label>
      <label>噪音 <select data-k="noiseMode">
        <option value="white">白噪音</option><option value="metal">金屬(短循環)</option>
      </select></label>
      <label><input type="checkbox" data-k="pwm"> 主旋律 PWM 疊音</label>`;
    opts.querySelector('[data-k=dutyLead]').value = m.duty.lead;
    opts.querySelector('[data-k=dutyHarm]').value = m.duty.harm;
    opts.querySelector('[data-k=bassWave]').value = m.bassWave;
    opts.querySelector('[data-k=noiseMode]').value = m.noiseMode;
    opts.querySelector('[data-k=pwm]').checked = m.pwm;
    opts.querySelector('[data-k=dutyLead]').onchange = e => { m.duty.lead = e.target.value; store.save(); };
    opts.querySelector('[data-k=dutyHarm]').onchange = e => { m.duty.harm = e.target.value; store.save(); };
    opts.querySelector('[data-k=bassWave]').onchange = e => { m.bassWave = e.target.value; store.save(); };
    opts.querySelector('[data-k=noiseMode]').onchange = e => { m.noiseMode = e.target.value; store.save(); };
    opts.querySelector('[data-k=pwm]').onchange = e => { m.pwm = e.target.checked; store.save(); };
    body.appendChild(opts);
    sep('效果');
    slider('顫音', () => m.vibrato, v => m.vibrato = v);
    slider('回音量', () => m.echo, v => m.echo = v);
    slider('回音回饋', () => m.echoFb, v => m.echoFb = v);
    slider('長音衰減', () => m.susDecay, v => m.susDecay = v);
    slider('總音量', () => m.master, v => { m.master = v; masterVol.value = v; masterVolVal.textContent = v; });
    const tgl = document.createElement('div');
    tgl.className = 'mx-opts';
    tgl.innerHTML = `
      <label><input type="checkbox" data-k="retro"> RETRO 降解（真 bitcrush）</label>
      <label><input type="checkbox" data-k="swing"> 搖擺</label>
      <label><input type="checkbox" data-k="humanize"> 人性化</label>`;
    for (const k of ['retro', 'swing', 'humanize']) {
      const el = tgl.querySelector(`[data-k=${k}]`);
      el.checked = m[k];
      el.onchange = e => { m[k] = e.target.checked; synth.syncMixer(); store.save(); };
    }
    body.appendChild(tgl);
  }

  // ===== 鍵盤 =====
  document.addEventListener('keydown', e => {
    if (e.target.matches('input, select, textarea')) return;
    if (e.code === 'Space') { e.preventDefault(); transport.toggle(); }
    else if (e.ctrlKey && e.key === 'z') { e.preventDefault(); store.undo(); }
    else if (e.ctrlKey && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) { e.preventDefault(); store.redo(); }
  });

  // ===== store 變更 → UI 同步 =====
  let lastSteps = 0;
  const syncUI = () => {
    const s = store.song;
    if (s.steps !== lastSteps) { lastSteps = s.steps; roll.resize(); }
    else roll.render();
    bpmInput.value = s.bpm; bpmVal.textContent = s.bpm;
    barPicker.querySelectorAll('button').forEach(b =>
      b.classList.toggle('active', +b.dataset.bars === s.steps / 16));
    $('seedBadge').textContent = s.seed ? 'SEED ' + s.seed : 'SEED —';
    refreshThemeChips();
  };
  store.onChange(syncUI);

  // 吉祥物心跳
  setInterval(() => mascot.tick(transport.playing), 100);

  syncUI();
}

boot();
