/**
 * تكامل Phaser 3 لعجلة الحروف التفاعلية والمؤثرات البصرية وفيزياء الاحتفال
 */

class PhaserWheelScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WheelScene' });
    const isEn = (typeof i18n !== 'undefined' && i18n.currentLang === 'en');
    this.letters = isEn
      ? ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      : ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'];
    this.isSpinning = false;
    this.wheelContainer = null;
    this.pointerContainer = null;
    this.selectedLetter = this.letters[0];
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 18;

    // هالة وظل ناعم خلف العجلة لإعطاء عمق ثلاثي الأبعاد
    const ambientGlow = this.add.graphics();
    ambientGlow.fillStyle(0x000000, 0.4);
    ambientGlow.fillCircle(centerX, centerY + 6, radius + 8);

    // الحاوية الدوارة الرئيسية
    this.wheelContainer = this.add.container(centerX, centerY);

    // تدرج ألوان فخم وهادئ يريح العين (كحلي ملكي + سبج مسائي متناسق)
    const colorA = 0x0f172a; // Obsidian Slate فخم وعميق
    const colorB = 0x1e1b4b; // Midnight Royal Indigo ملكي أنيق

    const sliceAngle = (Math.PI * 2) / this.letters.length;
    const isEn = (typeof i18n !== 'undefined' && i18n.currentLang === 'en');
    const innerRadius = radius - 11;

    // 1. رسم شرائح العجلة الداخلية مع فواصل ذهبية ناعمة
    for (let i = 0; i < this.letters.length; i++) {
      const startAngle = i * sliceAngle - Math.PI / 2;
      const endAngle = startAngle + sliceAngle;
      const color = (i % 2 === 0) ? colorA : colorB;

      const sliceGfx = this.add.graphics();
      sliceGfx.fillStyle(color, 1);
      sliceGfx.lineStyle(1.5, 0xd97706, 0.35); // فاصل ذهبي خفيف وأنيق

      sliceGfx.beginPath();
      sliceGfx.moveTo(0, 0);
      sliceGfx.arc(0, 0, innerRadius, startAngle, endAngle);
      sliceGfx.closePath();
      sliceGfx.fillPath();
      sliceGfx.strokePath();

      this.wheelContainer.add(sliceGfx);

      // موضع الحرف والوسام الدائري
      const textAngle = startAngle + sliceAngle / 2;
      const textRadius = innerRadius * 0.77;
      const tx = Math.cos(textAngle) * textRadius;
      const ty = Math.sin(textAngle) * textRadius;

      // وسام دائري خلف كل حرف لضمان الوضوح التام والقراءة المريحة
      const medallion = this.add.graphics();
      medallion.fillStyle(0x020617, 0.65);
      medallion.lineStyle(1.5, 0xf59e0b, 0.4);
      medallion.fillCircle(tx, ty, 13.5);
      medallion.strokeCircle(tx, ty, 13.5);
      this.wheelContainer.add(medallion);

      // الحرف بحجم خط واضح وظل متقن
      const fontSizePx = isEn ? 19 : 20;
      const letterText = this.add.text(tx, ty, this.letters[i], {
        fontFamily: isEn ? 'Inter, system-ui, sans-serif' : 'Cairo, Tajawal, sans-serif',
        fontSize: `${fontSizePx}px`,
        fontStyle: 'bold',
        color: '#ffffff',
        stroke: '#020617',
        strokeThickness: 3.5
      }).setOrigin(0.5);

      letterText.setRotation(textAngle + Math.PI / 2);
      this.wheelContainer.add(letterText);
    }

    // 2. إطار العجلة الخارجي الفاخر (Metallic Gold Multi-Bezel)
    const rimGfx = this.add.graphics();
    // حافة خارجية داكنة
    rimGfx.lineStyle(4, 0x090d16, 1);
    rimGfx.strokeCircle(0, 0, radius);

    // إطار ذهبي مصقول عريض
    rimGfx.lineStyle(10, 0xd97706, 1);
    rimGfx.strokeCircle(0, 0, radius - 5);

    // حلقة لمعان ذهبية براقة (Specular Highlight)
    rimGfx.lineStyle(1.8, 0xfef08a, 0.95);
    rimGfx.strokeCircle(0, 0, radius - 10);

    // حز داخلي لإعطاء إحساس بالعمق ثلاثي الأبعاد
    rimGfx.lineStyle(2, 0x020617, 0.65);
    rimGfx.strokeCircle(0, 0, radius - 11.5);
    this.wheelContainer.add(rimGfx);

    // 3. المسامير المعدنية البارزة على الإطار الخارجي (Golden 3D Pegs)
    const pegRadius = radius - 5.5;
    const pegsGfx = this.add.graphics();
    for (let i = 0; i < this.letters.length; i++) {
      const angle = i * sliceAngle - Math.PI / 2;
      const px = Math.cos(angle) * pegRadius;
      const py = Math.sin(angle) * pegRadius;

      // قاعدة المسمار
      pegsGfx.fillStyle(0x78350f, 1);
      pegsGfx.fillCircle(px, py, 3.5);

      // قلب المسمار الذهبي اللامع
      pegsGfx.fillStyle(0xf59e0b, 1);
      pegsGfx.fillCircle(px, py, 2.5);

      // وميض النور
      pegsGfx.fillStyle(0xffffff, 0.9);
      pegsGfx.fillCircle(px - 0.8, py - 0.8, 1);
    }
    this.wheelContainer.add(pegsGfx);

    // 4. قلب العجلة الذهبي ثلاثي الأبعاد (Center Hub)
    const hubGfx = this.add.graphics();
    const hubRadius = radius * 0.23;

    // حلقة الترس الذهبي الخارجي
    hubGfx.fillStyle(0x78350f, 1);
    hubGfx.lineStyle(3, 0xf59e0b, 1);
    hubGfx.fillCircle(0, 0, hubRadius);
    hubGfx.strokeCircle(0, 0, hubRadius);

    // قرص ذهبي متوسط
    hubGfx.lineStyle(2, 0xfef08a, 0.9);
    hubGfx.strokeCircle(0, 0, hubRadius * 0.85);

    // قبة سبج داكنة مصقولة
    hubGfx.fillStyle(0x090d16, 1);
    hubGfx.fillCircle(0, 0, hubRadius * 0.72);

    // انعكاس زجاجي ناعم في النصف العلوي
    hubGfx.fillStyle(0xffffff, 0.15);
    hubGfx.beginPath();
    hubGfx.arc(0, 0, hubRadius * 0.65, Math.PI, 0);
    hubGfx.closePath();
    hubGfx.fillPath();

    this.wheelContainer.add(hubGfx);

    // رمز الشعار الذهبي المركزي (نجمة الكريستال الملكية)
    const centerEmblem = this.add.text(0, 0, '✦', {
      fontSize: `${Math.floor(radius * 0.16)}px`,
      color: '#fde047',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.wheelContainer.add(centerEmblem);

    // 5. المؤشر العلوي ثلاثي الأبعاد مع ارتداد فيزيائي حركي (Interactive Spring Pointer)
    this.pointerContainer = this.add.container(centerX, centerY - radius + 11);

    const pointerGfx = this.add.graphics();
    // ظل المؤشر
    pointerGfx.fillStyle(0x000000, 0.4);
    pointerGfx.beginPath();
    pointerGfx.moveTo(-13, 2);
    pointerGfx.lineTo(13, 2);
    pointerGfx.lineTo(0, 36);
    pointerGfx.closePath();
    pointerGfx.fillPath();

    // السهم الذهبي المصقول (وجه أيسر لامع، وجه أيمن مظلل لإعطاء تجسيم ثلاثي الأبعاد)
    // الوجه الأيسر
    pointerGfx.fillStyle(0xfbbf24, 1);
    pointerGfx.beginPath();
    pointerGfx.moveTo(-13, 0);
    pointerGfx.lineTo(0, 0);
    pointerGfx.lineTo(0, 32);
    pointerGfx.closePath();
    pointerGfx.fillPath();

    // الوجه الأيمن
    pointerGfx.fillStyle(0xd97706, 1);
    pointerGfx.beginPath();
    pointerGfx.moveTo(0, 0);
    pointerGfx.lineTo(13, 0);
    pointerGfx.lineTo(0, 32);
    pointerGfx.closePath();
    pointerGfx.fillPath();

    // إطار ذهبي رفيع براق
    pointerGfx.lineStyle(1.5, 0xfef08a, 1);
    pointerGfx.beginPath();
    pointerGfx.moveTo(-13, 0);
    pointerGfx.lineTo(13, 0);
    pointerGfx.lineTo(0, 32);
    pointerGfx.closePath();
    pointerGfx.strokePath();

    // جوهرة ياقوتية مركزية في قلب المؤشر
    pointerGfx.fillStyle(0xef4444, 1);
    pointerGfx.fillCircle(0, 8, 4.5);
    pointerGfx.fillStyle(0xffffff, 0.85);
    pointerGfx.fillCircle(-1, 6.5, 1.5);

    // برغي التثبيت العلوي (Chrome Pivot Pin)
    pointerGfx.fillStyle(0x0f172a, 1);
    pointerGfx.fillCircle(0, 0, 6.5);
    pointerGfx.fillStyle(0xe2e8f0, 1);
    pointerGfx.fillCircle(0, 0, 5);
    pointerGfx.fillStyle(0xffffff, 1);
    pointerGfx.fillCircle(-1.2, -1.2, 1.8);

    this.pointerContainer.add(pointerGfx);
  }

  spinToLetter(targetLetter, onComplete) {
    if (this.isSpinning) return;
    this.isSpinning = true;

    const letterIndex = this.letters.indexOf(targetLetter);
    if (letterIndex === -1) return;

    const sliceAngleDeg = 360 / this.letters.length;
    // زاوية الحرف المستهدف عند المؤشر العلوي (270 درجة أو -90)
    const targetAngle = 360 - (letterIndex * sliceAngleDeg);
    const extraRounds = (4 + Math.floor(Math.random() * 3)) * 360;
    const finalAngle = this.wheelContainer.angle + extraRounds + targetAngle - (this.wheelContainer.angle % 360);

    let lastClickAngle = this.wheelContainer.angle;

    this.tweens.add({
      targets: this.wheelContainer,
      angle: finalAngle,
      duration: 3400,
      ease: 'Cubic.easeOut',
      onUpdate: (tween, target) => {
        const diff = Math.abs(target.angle - lastClickAngle);
        if (diff >= sliceAngleDeg) {
          lastClickAngle = target.angle;

          // ارتداد فيزيائي واقعي للمؤشر العلوي (Spring Flapper Wobble)
          if (this.pointerContainer) {
            this.tweens.killTweensOf(this.pointerContainer);
            this.pointerContainer.angle = -18;
            this.tweens.add({
              targets: this.pointerContainer,
              angle: 0,
              duration: 85,
              ease: 'Back.easeOut'
            });
          }

          if (typeof sounds !== 'undefined') {
            const pitch = 650 + (tween.progress * 400);
            sounds.playSpinClick(pitch);
          }
        }
      },
      onComplete: () => {
        this.isSpinning = false;
        this.selectedLetter = targetLetter;
        if (typeof sounds !== 'undefined') {
          sounds.playCorrect();
        }
        this.burstVictoryEffects();
        if (onComplete) onComplete(targetLetter);
      }
    });
  }

  burstVictoryEffects() {
    const width = this.scale.width;
    const height = this.scale.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 18;

    // موجة ضوئية حلقية تتوسع من المركز (Shockwave Ring)
    const shockwave = this.add.graphics();
    shockwave.lineStyle(4, 0xfacc15, 0.95);
    shockwave.strokeCircle(centerX, centerY, radius * 0.25);
    this.tweens.add({
      targets: shockwave,
      scaleX: 3.4,
      scaleY: 3.4,
      alpha: 0,
      duration: 750,
      ease: 'Cubic.easeOut',
      onComplete: () => shockwave.destroy()
    });

    // انفجار جزيئات ونجوم ذهبية حول العجلة
    for (let i = 0; i < 35; i++) {
      const glyph = i % 2 === 0 ? '✨' : '⭐';
      const star = this.add.text(centerX, centerY, glyph, {
        fontSize: '22px'
      }).setOrigin(0.5);

      const angle = Math.random() * Math.PI * 2;
      const speed = 90 + Math.random() * 160;

      this.tweens.add({
        targets: star,
        x: centerX + Math.cos(angle) * speed,
        y: centerY + Math.sin(angle) * speed,
        alpha: 0,
        scale: 1.6,
        duration: 950,
        ease: 'Power2',
        onComplete: () => star.destroy()
      });
    }
  }
}

let phaserGame = null;
let phaserWheelScene = null;

function initPhaserWheel(containerId, onLetterLand) {
  const container = document.getElementById(containerId);
  if (!container || typeof Phaser === 'undefined') {
    console.warn('Phaser not loaded or container not found');
    return null;
  }

  if (phaserGame) {
    try {
      phaserGame.destroy(true);
    } catch (e) {
      console.warn('Error destroying existing Phaser instance:', e);
    }
    phaserGame = null;
    phaserWheelScene = null;
    container.innerHTML = '';
  }

  const rect = container.getBoundingClientRect();
  const size = Math.min(rect.width || 370, 370);

  const config = {
    type: Phaser.AUTO,
    parent: containerId,
    width: size,
    height: size,
    transparent: true,
    physics: { default: 'arcade' },
    scene: PhaserWheelScene
  };

  phaserGame = new Phaser.Game(config);
  phaserGame.events.on('ready', () => {
    phaserWheelScene = phaserGame.scene.getScene('WheelScene');
  });

  return phaserGame;
}

function triggerWheelSpin(letter, callback) {
  if (phaserWheelScene) {
    phaserWheelScene.spinToLetter(letter, callback);
  } else {
    // خيار بديل سريع بدون Canvas
    if (callback) callback(letter);
  }
}
