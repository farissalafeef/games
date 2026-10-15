/**
 * محرك الصوتيات عبر Web Audio API
 * مؤثرات صوتية حية واحترافية بدون الحاجة لملفات صوت خارجية
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.2, pitchDecay = true) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      if (pitchDecay) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, freq * 0.6), this.ctx.currentTime + duration);
      }

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  playKey() {
    this.playTone(600 + Math.random() * 200, 'sine', 0.04, 0.05, false);
  }

  playTick() {
    this.playTone(880, 'triangle', 0.06, 0.1, false);
  }

  playComboChime(level = 1) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const scale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51];
    const freq = scale[Math.min(level - 1, scale.length - 1)];
    this.playTone(freq, 'sine', 0.14, 0.18, false);
    setTimeout(() => {
      this.playTone(freq * 1.5, 'sine', 0.18, 0.14, false);
    }, 50);
  }

  playHeartbeat() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    this.playTone(95, 'sine', 0.09, 0.32, true);
    setTimeout(() => {
      this.playTone(75, 'sine', 0.13, 0.25, true);
    }, 130);
  }

  playMagicSparkle() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const notes = [659.25, 783.99, 987.77, 1318.51, 1567.98];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.12, 0.12, false);
      }, idx * 45);
    });
  }

  playSpinClick(pitch = 750) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.16, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    } catch (e) {}
  }

  playStopWhistle() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    // صافرة أوتوبيس كومبلي / STOP الحماسية
    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(1200, now);
    osc1.frequency.linearRampToValueAtTime(1600, now + 0.15);
    osc1.frequency.linearRampToValueAtTime(1400, now + 0.35);

    osc2.frequency.setValueAtTime(1205, now);
    osc2.frequency.linearRampToValueAtTime(1605, now + 0.15);
    osc2.frequency.linearRampToValueAtTime(1405, now + 0.35);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.45);
    osc2.stop(now + 0.45);
  }

  playCorrect() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    // نغمة نجاح ثلاثية لطيفة
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.18, 0.15, false);
      }, idx * 75);
    });
  }

  playWrong() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    this.playTone(220, 'sawtooth', 0.25, 0.15, true);
  }

  playCelebratoryVictory() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    // دالة مساعدة لعزف نغمة نحاسية مجسمة (Brass Horn)
    const playHornNote = (freq, startTime, duration, vol = 0.22) => {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(freq, startTime);
      osc2.frequency.setValueAtTime(freq * 1.004, startTime); // detune خفيف لتجسيم الصوت

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(freq * 2.5, startTime);
      filter.frequency.exponentialRampToValueAtTime(Math.min(freq * 4.5, 6000), startTime + 0.08);
      filter.frequency.exponentialRampToValueAtTime(freq * 1.8, startTime + duration);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(vol, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(startTime);
      osc2.start(startTime);
      osc1.stop(startTime + duration);
      osc2.stop(startTime + duration);
    };

    // معزوفة الفوز الحماسية والاحتفالية (Fanfare)
    // الإيقاع: طاطا-طا-طا-طاااااا!
    const baseFanfare = [
      { f: 523.25, t: 0.00, d: 0.12 }, // C5
      { f: 523.25, t: 0.14, d: 0.12 }, // C5
      { f: 523.25, t: 0.28, d: 0.12 }, // C5
      { f: 659.25, t: 0.42, d: 0.35 }, // E5
      { f: 523.25, t: 0.80, d: 0.14 }, // C5
      { f: 659.25, t: 0.96, d: 0.18 }, // E5
      { f: 783.99, t: 1.16, d: 0.70 }, // G5 (نغمة الانتصار العالية)
      { f: 1046.5, t: 1.88, d: 0.95 }  // C6 (النهاية المدوية)
    ];

    baseFanfare.forEach(note => {
      playHornNote(note.f, now + note.t, note.d, 0.2);
      // إضافة صوت تآلفي مصاحب في النغمات الأخيرة
      if (note.t >= 1.16) {
        playHornNote(note.f * 0.75, now + note.t, note.d, 0.14); // نغمة هارموني رابعة
        playHornNote(note.f * 0.5, now + note.t, note.d, 0.18);  // باص Bass
      }
    });

    // رنين جزيئات لامعة (Sparkles / Stardust) أثناء الاحتفال
    for (let i = 0; i < 12; i++) {
      const sparkleDelay = 0.6 + i * 0.14;
      const sparkleFreq = 1200 + Math.random() * 1200;
      setTimeout(() => {
        this.playTone(sparkleFreq, 'sine', 0.16, 0.06, true);
      }, sparkleDelay * 1000);
    }
  }

  playDefeat() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    // مؤثر "الترمبون الحزين" الشهير للخسارة (Sad Trombone: Wah-Wah-Wah-Waaah)
    const playWahNote = (startFreq, startTime, duration, isFinal = false) => {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      // مذبذب من نوع Sawtooth لإعطاء طابع آلة النفخ
      osc.type = 'sawtooth';

      if (!isFinal) {
        // انزلاق طفيف للأسفل
        osc.frequency.setValueAtTime(startFreq, startTime);
        osc.frequency.linearRampToValueAtTime(startFreq - 8, startTime + duration);
      } else {
        // انزلاق هابط طويل ومحزن للنهاية
        osc.frequency.setValueAtTime(startFreq, startTime);
        osc.frequency.exponentialRampToValueAtTime(startFreq * 0.65, startTime + duration);
      }

      // فلتر متغير مع LFO لمحاكاة اهتزاز الشفاه أو كتمة الترمبون (Wah Effect)
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, startTime);
      filter.Q.setValueAtTime(6, startTime);

      // LFO للاهتزاز
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(isFinal ? 4.5 : 6, startTime);
      lfoGain.gain.setValueAtTime(isFinal ? 180 : 120, startTime);
      lfo.connect(filter.frequency);
      lfo.start(startTime);
      lfo.stop(startTime + duration);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.24, startTime + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    // نغمات الهزيمة الشهيرة الأربعة:
    // Eb4 (311Hz) -> D4 (293Hz) -> Db4 (277Hz) -> C4 الممتدة مع هبوط حاد
    playWahNote(311.13, now, 0.40);
    playWahNote(293.66, now + 0.45, 0.40);
    playWahNote(277.18, now + 0.90, 0.40);
    playWahNote(261.63, now + 1.35, 1.45, true);

    // ضربة درام خفيفة محبطة في النهاية
    setTimeout(() => {
      this.playTone(70, 'triangle', 0.5, 0.25, true);
    }, 1800);
  }

  playGavel() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    // دالة محاكاة ضربة مطرقة خشبية (Court Gavel)
    const strike = (t) => {
      // صوت الاصطدام الحاد (Click / Transient)
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(1400, t);
      clickOsc.frequency.exponentialRampToValueAtTime(120, t + 0.035);
      clickGain.gain.setValueAtTime(0.35, t);
      clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      clickOsc.connect(clickGain);
      clickGain.connect(ctx.destination);
      clickOsc.start(t);
      clickOsc.stop(t + 0.04);

      // رنين الخشب المكتوم (Wood Resonance)
      const bodyOsc = ctx.createOscillator();
      const bodyFilter = ctx.createBiquadFilter();
      const bodyGain = ctx.createGain();
      bodyOsc.type = 'sine';
      bodyOsc.frequency.setValueAtTime(240, t);
      bodyOsc.frequency.exponentialRampToValueAtTime(90, t + 0.12);
      bodyFilter.type = 'lowpass';
      bodyFilter.frequency.setValueAtTime(500, t);
      bodyGain.gain.setValueAtTime(0.3, t);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

      bodyOsc.connect(bodyFilter);
      bodyFilter.connect(bodyGain);
      bodyGain.connect(ctx.destination);
      bodyOsc.start(t);
      bodyOsc.stop(t + 0.14);
    };

    // ضربتان متتاليتان لمطرقة القاضي (طَق .. طَق!)
    strike(now);
    strike(now + 0.18);
  }

  playVoteClick() {
    this.playTone(750, 'sine', 0.06, 0.15, false);
  }

  playVictory() {
    // توجيه إلى الصوت الاحتفالي المتطور
    this.playCelebratoryVictory();
  }

  /**
   * نطق العبارات والمؤثرات الصوتية الصوتية (عربي وإنجليزي)
   * stop: "وقفوا خلاص!" / "Stop! Time's up!"
   * win_first: "كفو! انت الأول!" / "Awesome! You're number one!"
   * made_up: "ما تكدبش!" / "Don't make stuff up!"
   */
  speakVoice(action) {
    if (this.muted) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();
    } catch (e) {}

    const isEn = (typeof i18n !== 'undefined' && i18n.currentLang === 'en');

    const voicePhrases = {
      stop: {
        ar: 'وقفوا خلاص!',
        en: "Stop! Time's up!"
      },
      win_first: {
        ar: 'كفو! انت الأول!',
        en: "Awesome! You're number one!"
      },
      made_up: {
        ar: 'ما تكدبش!',
        en: "Don't make stuff up!"
      }
    };

    const target = voicePhrases[action];
    if (!target) return;

    const text = isEn ? target.en : target.ar;
    const lang = isEn ? 'en-US' : 'ar-SA';

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.volume = 1.0;
    utterance.rate = isEn ? 1.05 : 0.95;
    utterance.pitch = 1.15; // نبرة حماسية وتفاعلية

    // اختيار صوت مناسب للغة إن وجد في المتصفح
    try {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const prefix = isEn ? 'en' : 'ar';
        const match = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(prefix));
        if (match) utterance.voice = match;
      }
    } catch (e) {}

    try {
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('SpeechSynthesis error:', e);
    }
  }
}

const sounds = new SoundEngine();
