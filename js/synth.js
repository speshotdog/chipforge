// 晶片合成器：NES 風格 2×方波(duty) + 三角波貝斯 + 噪音 + 合成鼓組
// 訊號鏈：ch → master → (retro: bitcrusher wet/dry) → compressor → limiter → 輸出
//        ch → echoSend → delay(+feedback+lowpass) → master
export const CH_VOL = { lead: 0.20, harm: 0.14, bass: 0.30, noise: 0.19 };
export const DUTY_VAL = { '12.5%': 0.125, '25%': 0.25, '50%': 0.5 };

export class ChipSynth {
  constructor(ctx, getMixer, { retroNode = null } = {}) {
    this.ctx = ctx;
    this.getMixer = getMixer;
    this.retroNode = retroNode; // AudioWorkletNode（離線渲染時為 null，改用後處理）
    this.build();
  }

  build() {
    const ctx = this.ctx, m = this.getMixer();
    this.master = ctx.createGain();
    this.master.gain.value = this.masterVal(m);

    this.comp = ctx.createDynamicsCompressor();
    Object.assign(this.comp, {});
    this.comp.threshold.value = -16; this.comp.ratio.value = 4; this.comp.knee.value = 8;

    this.limiter = ctx.createDynamicsCompressor();
    this.limiter.threshold.value = -2; this.limiter.knee.value = 0; this.limiter.ratio.value = 20;
    this.limiter.attack.value = 0.001; this.limiter.release.value = 0.1;

    this.comp.connect(this.limiter);
    this.limiter.connect(ctx.destination);

    // retro 濕/乾混音
    this.retroWet = ctx.createGain(); this.retroWet.gain.value = 0.6;
    this.retroDry = ctx.createGain(); this.retroDry.gain.value = 0.4;
    if (this.retroNode) {
      this.retroNode.connect(this.retroWet);
      this.retroWet.connect(this.comp);
      this.retroDry.connect(this.comp);
    }
    this.routeRetro(!!m.retro);

    // 回音匯流排
    this.echoSend = ctx.createGain();
    this.echoSend.gain.value = (m.echo ?? 8) / 100 * 0.9;
    this.delay = ctx.createDelay(1.2);
    this.fb = ctx.createGain(); this.fb.gain.value = (m.echoFb ?? 22) / 100 * 0.6;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3200;
    this.echoSend.connect(this.delay); this.delay.connect(lp);
    lp.connect(this.fb); this.fb.connect(this.delay); lp.connect(this.master);

    // 噪音緩衝：白噪音 + 128 樣本循環（NES 短模式金屬聲）
    const nb = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const nd = nb.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    this.noiseBuf = nb;
    const pb = ctx.createBuffer(1, 128, ctx.sampleRate);
    const pd = pb.getChannelData(0);
    for (let i = 0; i < pd.length; i++) pd[i] = Math.random() < 0.5 ? -0.7 : 0.7;
    this.metalBuf = pb;

    // duty 方波
    this.waves = {};
    for (const duty of [0.125, 0.25, 0.5]) {
      const n = 32, real = new Float32Array(n), imag = new Float32Array(n);
      for (let i = 1; i < n; i++) imag[i] = (2 / (i * Math.PI)) * Math.sin(Math.PI * i * duty);
      this.waves[duty] = ctx.createPeriodicWave(real, imag);
    }

    // 聲道立體聲位置
    this.pans = {};
    const panMap = { lead: 0, harm: 0.18, bass: 0, noise: -0.2, drum: 0 };
    for (const [ch, v] of Object.entries(panMap)) {
      if (ctx.createStereoPanner) {
        const p = ctx.createStereoPanner(); p.pan.value = v;
        p.connect(this.master); this.pans[ch] = p;
      } else this.pans[ch] = null;
    }
  }

  out(ch) { return this.pans[ch] || this.master; }
  masterVal(m) { return 0.9 * (m.master ?? 60) / 80; }

  routeRetro(on) {
    try { this.master.disconnect(); } catch (e) { }
    if (on && this.retroNode) {
      this.master.connect(this.retroNode);
      this.master.connect(this.retroDry);
    } else this.master.connect(this.comp);
  }

  syncMixer() {
    const m = this.getMixer();
    this.master.gain.value = this.masterVal(m);
    this.echoSend.gain.value = (m.echo ?? 8) / 100 * 0.9;
    this.fb.gain.value = (m.echoFb ?? 22) / 100 * 0.6;
    this.routeRetro(!!m.retro);
  }

  setBpm(bpm) {
    this.delay.delayTime.value = Math.min(1.1, 60 / bpm * 0.75); // 附點八分
  }

  chVol(ch) {
    const m = this.getMixer();
    const anySolo = Object.values(m.solo || {}).some(Boolean);
    if ((m.mute || {})[ch] || (anySolo && !(m.solo || {})[ch])) return 0;
    return ((m.vol || {})[ch] ?? 70) / 75;
  }

  freq(midi) { return 440 * Math.pow(2, (midi - 69) / 12); }

  playNote(inst, midi, time, dur, vel = 1, glideMidi) {
    const m = this.getMixer();
    let mul = this.chVol(inst) * vel;
    if (m.humanize) { time += (Math.random() - 0.5) * 0.008; mul *= 0.85 + Math.random() * 0.3; }
    if (mul <= 0) return;
    const vol = CH_VOL[inst] * mul;
    const ctx = this.ctx;

    if (inst === 'noise') return this.playNoise(midi, time, dur, vol, m);

    const gn = ctx.createGain();
    const osc = ctx.createOscillator();
    let vol2 = vol, extra = null, punch = false;

    if (inst === 'bass') {
      midi -= 12; dur *= 1.1;
      if (glideMidi !== undefined) glideMidi -= 12;
      if (m.bassWave === 'pulse') { osc.setPeriodicWave(this.waves[0.5]); vol2 = vol * 0.55; }
      else if (m.bassWave === 'slap') { osc.type = 'triangle'; vol2 = vol * 1.1; punch = true; }
      else osc.type = 'triangle';
    } else {
      const duty = DUTY_VAL[(m.duty || {})[inst]] ?? (inst === 'lead' ? 0.25 : 0.125);
      osc.setPeriodicWave(this.waves[duty]);
      if (inst === 'lead' && m.pwm) {
        osc.detune.value = -6; vol2 = vol * 0.55;
        extra = { detune: 6, gain: 1, duty };
      }
      if ((m.vibrato ?? 35) > 0) {
        const lfo = ctx.createOscillator(), lg = ctx.createGain();
        lfo.frequency.value = 5.6; lg.gain.value = (m.vibrato ?? 35) / 40 * 7;
        lfo.connect(lg); lg.connect(osc.detune);
        lfo.start(time); lfo.stop(time + dur + 0.4);
      }
    }

    const f = this.freq(midi);
    osc.frequency.value = f;
    const gf = (glideMidi !== undefined && glideMidi !== midi) ? this.freq(glideMidi) : null;
    if (gf) {
      osc.frequency.setValueAtTime(f, time);
      osc.frequency.linearRampToValueAtTime(gf, time + Math.max(0.02, dur));
    } else if (punch) {
      osc.frequency.setValueAtTime(f * 1.7, time);
      osc.frequency.exponentialRampToValueAtTime(f, time + 0.06);
    }

    gn.gain.setValueAtTime(0, time);
    gn.gain.linearRampToValueAtTime(vol2, time + 0.004);
    gn.gain.setTargetAtTime(vol2 * 0.6, time + 0.012, 0.06);
    if (dur > 0.25) {
      const dk = (m.susDecay ?? 78) / 100;
      if (dk > 0) {
        const floor = vol2 * 0.6 * Math.max(0.05, 1 - dk);
        gn.gain.setTargetAtTime(floor, time + 0.15, Math.max(0.08, dur * (1 - dk) * 0.8 + 0.08));
      }
    }
    gn.gain.setTargetAtTime(0, time + dur, 0.025);

    osc.connect(gn);
    gn.connect(this.out(inst));
    if (inst !== 'bass') gn.connect(this.echoSend);

    if (extra) {
      const eo = ctx.createOscillator();
      eo.setPeriodicWave(this.waves[extra.duty]);
      eo.frequency.value = f;
      if (gf) { eo.frequency.setValueAtTime(f, time); eo.frequency.linearRampToValueAtTime(gf, time + Math.max(0.02, dur)); }
      eo.detune.value = extra.detune;
      const eg = ctx.createGain(); eg.gain.value = extra.gain;
      eo.connect(eg); eg.connect(gn);
      eo.start(time); eo.stop(time + dur + 0.4);
    }
    osc.start(time); osc.stop(time + dur + 0.4);
  }

  playNoise(midi, time, dur, vol, m) {
    const ctx = this.ctx;
    const n = ctx.createBufferSource();
    let nVol = vol;
    if (m.noiseMode === 'metal') {
      n.buffer = this.metalBuf; n.loop = true;
      n.playbackRate.value = Math.pow(2, (midi - 60) / 12) * 0.5;
      nVol = vol * 0.55;
    } else n.buffer = this.noiseBuf;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass'; bp.Q.value = 0.9;
    bp.frequency.value = Math.max(120, Math.min(12000, 150 * Math.pow(2, (midi - 60) / 4)));
    const gn = ctx.createGain();
    gn.gain.setValueAtTime(0, time);
    gn.gain.linearRampToValueAtTime(nVol, time + 0.004);
    gn.gain.setTargetAtTime(0, time + dur * 0.5, 0.05);
    n.connect(bp); bp.connect(gn);
    gn.connect(this.out('noise')); gn.connect(this.echoSend);
    n.start(time); n.stop(time + dur + 0.5);
  }

  playDrum(lane, time, vel = 1) {
    const m = this.getMixer();
    let mul = this.chVol('drum') * vel;
    if (m.humanize) { time += (Math.random() - 0.5) * 0.006; mul *= 0.88 + Math.random() * 0.24; }
    if (mul <= 0) return;
    const ctx = this.ctx;
    const laneVol = [(m.kick ?? 70) / 100, (m.snare ?? 55) / 100, (m.hat ?? 45) / 100][lane] ?? 0.6;
    const v = 0.5 * mul * laneVol;

    if (lane === 0) { // 大鼓：三角波下滑 + 點擊
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(160, time);
      o.frequency.exponentialRampToValueAtTime(42, time + 0.11);
      g.gain.setValueAtTime(v * 1.6, time);
      g.gain.setTargetAtTime(0, time + 0.02, 0.05);
      o.connect(g); g.connect(this.out('drum'));
      o.start(time); o.stop(time + 0.3);
      const n = ctx.createBufferSource(); n.buffer = this.noiseBuf;
      const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 900;
      const ng = ctx.createGain();
      ng.gain.setValueAtTime(v * 0.5, time);
      ng.gain.setTargetAtTime(0, time, 0.015);
      n.connect(f); f.connect(ng); ng.connect(this.out('drum'));
      n.start(time); n.stop(time + 0.1);
    } else if (lane === 1) { // 小鼓：噪音 + 短音體
      const n = ctx.createBufferSource(); n.buffer = this.noiseBuf;
      const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 2200; f.Q.value = 0.6;
      const ng = ctx.createGain();
      ng.gain.setValueAtTime(v * 1.1, time);
      ng.gain.setTargetAtTime(0, time + 0.01, 0.045);
      n.connect(f); f.connect(ng); ng.connect(this.out('drum'));
      n.start(time); n.stop(time + 0.25);
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(220, time);
      o.frequency.exponentialRampToValueAtTime(140, time + 0.05);
      g.gain.setValueAtTime(v * 0.5, time);
      g.gain.setTargetAtTime(0, time, 0.03);
      o.connect(g); g.connect(this.out('drum'));
      o.start(time); o.stop(time + 0.15);
    } else { // 腳踏鈸：高通短噪音
      const n = ctx.createBufferSource(); n.buffer = this.noiseBuf;
      const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 6800;
      const ng = ctx.createGain();
      ng.gain.setValueAtTime(v * 0.8, time);
      ng.gain.setTargetAtTime(0, time, vel > 1 ? 0.035 : 0.018);
      n.connect(f); f.connect(ng); ng.connect(this.out('drum'));
      n.start(time); n.stop(time + 0.12);
    }
  }
}

// 建立即時 AudioContext + bitcrusher worklet
export async function createLiveSynth(getMixer) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  let retroNode = null;
  try {
    await ctx.audioWorklet.addModule('worklet/bitcrusher.js');
    retroNode = new AudioWorkletNode(ctx, 'bitcrusher');
  } catch (e) { console.warn('bitcrusher worklet unavailable', e); }
  return new ChipSynth(ctx, getMixer, { retroNode });
}
