/**
 * عجلة الحروف الخفيفة (Canvas 2D بدون مكتبات خارجية)
 * - تُرسم مرة واحدة فقط، ثم تدور عبر CSS transform (تسريع GPU) => سلسة جداً على الجوال
 * - استدعاء الـ callback مضمون دائماً حتى لو حدث خطأ (حتى لا تتوقف اللعبة)
 * - نفس الواجهة السابقة: initPhaserWheel(containerId, cb) و triggerWheelSpin(letter, cb)
 */

const WHEEL_AR_LETTERS = ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'];
const WHEEL_EN_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const LightWheel = {
  container: null,
  canvas: null,
  pointer: null,
  letters: WHEEL_AR_LETTERS,
  angle: 0,          // الزاوية الحالية بالدرجات
  size: 320,
  spinRaf: null,
  spinToken: 0,

  currentLetters() {
    const isEn = (typeof i18n !== 'undefined' && i18n.currentLang === 'en');
    return isEn ? WHEEL_EN_LETTERS : WHEEL_AR_LETTERS;
  },

  init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return null;
    this.cancelSpin();
    this.container = container;
    container.innerHTML = '';
    container.style.position = 'relative';

    const rect = container.getBoundingClientRect();
    this.size = Math.round(Math.min(rect.width || 320, rect.height || rect.width || 320, 370));

    // العجلة
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'lw-wheel';
    this.canvas.style.width = this.size + 'px';
    this.canvas.style.height = this.size + 'px';
    this.canvas.style.willChange = 'transform';
    container.appendChild(this.canvas);

    // المؤشر العلوي
    this.pointer = document.createElement('div');
    this.pointer.className = 'lw-pointer';
    this.pointer.innerHTML =
      '<svg viewBox="0 0 30 40" width="30" height="40" aria-hidden="true">' +
      '<path d="M2 2 L28 2 L15 36 Z" fill="#d97706" stroke="#fef08a" stroke-width="1.5" stroke-linejoin="round"/>' +
      '<path d="M2 2 L15 2 L15 36 Z" fill="#fbbf24"/>' +
      '<circle cx="15" cy="10" r="4.5" fill="#ef4444"/>' +
      '<circle cx="15" cy="3" r="5" fill="#e2e8f0" stroke="#0f172a" stroke-width="1.5"/>' +
      '</svg>';
    container.appendChild(this.pointer);

    this.letters = this.currentLetters();
    this.draw();
    this.applyRotation();
    return this;
  },

  draw() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const s = this.size;
    this.canvas.width = Math.round(s * dpr);
    this.canvas.height = Math.round(s * dpr);
    const ctx = this.canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, s, s);

    const c = s / 2;
    const radius = c - 6;
    const inner = radius - 11;
    const n = this.letters.length;
    const slice = (Math.PI * 2) / n;
    const isEn = this.letters === WHEEL_EN_LETTERS;

    ctx.save();
    ctx.translate(c, c);

    // الشرائح
    for (let i = 0; i < n; i++) {
      const a0 = i * slice - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, inner, a0, a0 + slice);
      ctx.closePath();
      ctx.fillStyle = i % 2 === 0 ? '#0f172a' : '#1e1b4b';
      ctx.fill();
      ctx.strokeStyle = 'rgba(217,119,6,0.35)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // الحروف
    const fontPx = Math.max(15, Math.round(s * (isEn ? 0.052 : 0.056)));
    const medR = Math.max(11, Math.round(s * 0.038));
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${fontPx}px ${isEn ? 'Inter, system-ui, sans-serif' : 'Cairo, Tajawal, system-ui, sans-serif'}`;
    for (let i = 0; i < n; i++) {
      const mid = i * slice - Math.PI / 2 + slice / 2;
      const r = inner * 0.78;
      const x = Math.cos(mid) * r;
      const y = Math.sin(mid) * r;
      ctx.beginPath();
      ctx.arc(x, y, medR, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(2,6,23,0.65)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(245,158,11,0.45)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(mid + Math.PI / 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(this.letters[i], 0, 1);
      ctx.restore();
    }

    // الإطار الذهبي
    ctx.lineWidth = 4; ctx.strokeStyle = '#090d16';
    ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 10; ctx.strokeStyle = '#d97706';
    ctx.beginPath(); ctx.arc(0, 0, radius - 5, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 1.8; ctx.strokeStyle = 'rgba(254,240,138,0.95)';
    ctx.beginPath(); ctx.arc(0, 0, radius - 10, 0, Math.PI * 2); ctx.stroke();

    // المسامير
    for (let i = 0; i < n; i++) {
      const a = i * slice - Math.PI / 2;
      const px = Math.cos(a) * (radius - 5.5);
      const py = Math.sin(a) * (radius - 5.5);
      ctx.fillStyle = '#78350f'; ctx.beginPath(); ctx.arc(px, py, 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2); ctx.fill();
    }

    // المركز
    const hub = radius * 0.23;
    ctx.fillStyle = '#78350f'; ctx.beginPath(); ctx.arc(0, 0, hub, 0, Math.PI * 2); ctx.fill();
    ctx.lineWidth = 3; ctx.strokeStyle = '#f59e0b'; ctx.stroke();
    ctx.fillStyle = '#090d16'; ctx.beginPath(); ctx.arc(0, 0, hub * 0.72, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fde047';
    ctx.font = `bold ${Math.round(radius * 0.16)}px system-ui, sans-serif`;
    ctx.fillText('✦', 0, 1);

    ctx.restore();
  },

  applyRotation() {
    if (this.canvas) this.canvas.style.transform = `rotate(${this.angle}deg)`;
  },

  cancelSpin() {
    if (this.spinRaf) cancelAnimationFrame(this.spinRaf);
    this.spinRaf = null;
    this.spinToken++;
  },

  spinTo(letter, onDone) {
    let finished = false;
    const done = () => {
      if (finished) return;
      finished = true;
      try { if (onDone) onDone(letter); } catch (e) { console.error(e); }
    };

    try {
      // اختيار مجموعة الحروف المناسبة للحرف المطلوب (يتجنب مشاكل تبديل اللغة)
      const wanted = WHEEL_AR_LETTERS.includes(letter) ? WHEEL_AR_LETTERS : WHEEL_EN_LETTERS;
      if (!this.canvas || !document.body.contains(this.canvas)) {
        const el = document.getElementById('phaser-wheel-container');
        if (el) this.init('phaser-wheel-container');
      }
      if (!this.canvas) { done(); return; }
      if (this.letters !== wanted) { this.letters = wanted; this.draw(); }

      const idx = this.letters.indexOf(letter);
      if (idx === -1) { done(); return; }

      this.cancelSpin();
      const token = this.spinToken;
      const sliceDeg = 360 / this.letters.length;
      // الحرف i يقع منتصفه عند (i+0.5)*slice من الأعلى، ندوّر العجلة بعكسه
      const targetMod = (360 - (idx + 0.5) * sliceDeg + 360) % 360;
      const startAngle = this.angle;
      const currentMod = ((startAngle % 360) + 360) % 360;
      let delta = targetMod - currentMod;
      if (delta < 0) delta += 360;
      const totalDelta = delta + (4 + Math.floor(Math.random() * 3)) * 360;

      const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const duration = reduceMotion ? 600 : 3400;
      const t0 = performance.now();
      let lastTick = Math.floor(startAngle / sliceDeg);

      const step = (now) => {
        if (token !== this.spinToken) { done(); return; }
        const p = Math.min(1, (now - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        this.angle = startAngle + totalDelta * eased;
        this.applyRotation();

        const tick = Math.floor(this.angle / sliceDeg);
        if (tick !== lastTick) {
          lastTick = tick;
          this.flapPointer();
          if (typeof sounds !== 'undefined' && sounds.playSpinClick) {
            try { sounds.playSpinClick(650 + p * 400); } catch (e) {}
          }
        }

        if (p < 1) {
          this.spinRaf = requestAnimationFrame(step);
        } else {
          this.spinRaf = null;
          this.angle = this.angle % 360;
          this.applyRotation();
          if (typeof sounds !== 'undefined' && sounds.playCorrect) {
            try { sounds.playCorrect(); } catch (e) {}
          }
          this.burst();
          done();
        }
      };
      this.spinRaf = requestAnimationFrame(step);

      // حماية: إذا كانت الصفحة في الخلفية (rAF متوقف) نكمل اللعبة رغم ذلك
      setTimeout(() => {
        if (!finished && token === this.spinToken) {
          this.cancelSpin();
          this.angle = (startAngle + totalDelta) % 360;
          this.applyRotation();
          done();
        }
      }, duration + 1500);
    } catch (err) {
      console.error('Wheel error:', err);
      done();
    }
  },

  flapPointer() {
    if (!this.pointer) return;
    this.pointer.classList.remove('lw-flap');
    void this.pointer.offsetWidth; // إعادة تشغيل الحركة
    this.pointer.classList.add('lw-flap');
  },

  burst() {
    if (!this.container) return;
    const glyphs = ['✨', '⭐'];
    for (let i = 0; i < 12; i++) {
      const s = document.createElement('span');
      s.className = 'lw-spark';
      s.textContent = glyphs[i % 2];
      const a = (i / 12) * Math.PI * 2;
      const d = this.size * 0.45;
      s.style.setProperty('--dx', `${Math.cos(a) * d}px`);
      s.style.setProperty('--dy', `${Math.sin(a) * d}px`);
      this.container.appendChild(s);
      setTimeout(() => s.remove(), 900);
    }
  }
};

// ===== نفس الواجهة القديمة حتى يعمل باقي الكود بدون تعديل =====
let phaserWheelScene = null;

function initPhaserWheel(containerId) {
  LightWheel.init(containerId);
  phaserWheelScene = LightWheel;
  return LightWheel;
}

function triggerWheelSpin(letter, callback) {
  LightWheel.spinTo(letter, callback);
}

// إعادة الرسم عند تغيير حجم الشاشة / تدوير الجوال
let _wheelResizeTimer = null;
window.addEventListener('resize', () => {
  clearTimeout(_wheelResizeTimer);
  _wheelResizeTimer = setTimeout(() => {
    if (LightWheel.container && !LightWheel.spinRaf) {
      const keepAngle = LightWheel.angle;
      const keepLetters = LightWheel.letters;
      LightWheel.init(LightWheel.container.id);
      LightWheel.letters = keepLetters;
      LightWheel.draw();
      LightWheel.angle = keepAngle;
      LightWheel.applyRotation();
    }
  }, 250);
});
