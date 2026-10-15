/**
 * منطق لعبة إنسان حيوان نبات جماد بلاد
 * إدارة الجولات، التوقيت، محاكاة الخصم الذكي، وحساب النقاط
 */

const DEFAULT_CATEGORIES = [
  { id: 'human', label: 'إنسان (اسم شخص)', icon: '👤', placeholder: 'مثال: أحمد، سارة...' },
  { id: 'animal', label: 'حيوان', icon: '🦁', placeholder: 'مثال: أسد، بقرة...' },
  { id: 'plant', label: 'نبات', icon: '🌿', placeholder: 'مثال: أناناس، بطيخ...' },
  { id: 'object', label: 'جماد', icon: '🧱', placeholder: 'مثال: إبرة، باب...' },
  { id: 'country', label: 'بلاد (دولة / عاصمة)', icon: '🌍', placeholder: 'مثال: ألمانيا، بيروت...' },
  { id: 'job', label: 'مهنة (وظيفة)', icon: '💼', placeholder: 'مثال: أستاذ، بناء...', active: true },
  { id: 'food', label: 'أكلة (طعام / طبق)', icon: '🍲', placeholder: 'مثال: أرز، بيتزا...', active: true }
];

const ARABIC_LETTERS = ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'];
const ENGLISH_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

class EnsanHayawanGame {
  constructor() {
    this.round = 1;
    this.totalScore = 0;
    this.aiTotalScore = 0;
    this.currentLetter = 'ا';
    this.gameMode = 'vs_ai'; // 'vs_ai' | 'solo_timer' | 'free'
    this.difficulty = 'medium'; // 'easy' | 'medium' | 'hard'
    this.timerDuration = 60; // بالثواني
    this.timeLeft = 60;
    this.timerInterval = null;
    this.isRoundActive = false;
    this.isPanicMode = false;
    this.stoppedBy = null; // 'player' | 'ai'

    this.categories = JSON.parse(JSON.stringify(DEFAULT_CATEGORIES));
    this.aiAnswers = {};
    this.playerAnswers = {};
    this.reviewResults = [];

    this.currentVote = null;
    this.humanVotes = { accept: 0, reject: 0 };
    this.currentVerdict = null;
    this.aiObjections = [];

    this.aiTypingInterval = null;
  }

  init() {
    const initialLang = (typeof i18n !== 'undefined') ? i18n.currentLang : 'ar';
    this.updateCategoriesForLanguage(initialLang);
    this.updateStatsDisplay();
    this.bindEvents();

    // تشغيل فايزر للعجلة
    setTimeout(() => {
      initPhaserWheel('phaser-wheel-container', (selectedLetter) => {
        this.onLetterChosen(selectedLetter);
      });
    }, 200);
  }

  updateCategoriesForLanguage(lang) {
    if (typeof i18n !== 'undefined') {
      this.categories.forEach(cat => {
        cat.label = i18n.t(`cat_${cat.id}`);
        cat.placeholder = i18n.t(`cat_${cat.id}_ph`);
      });
    }
    this.renderCategoryInputs();
    this.updateStatsDisplay();

    const stopBtn = document.getElementById('btn-stop');
    if (stopBtn && !this.isRoundActive) {
      stopBtn.innerHTML = (typeof i18n !== 'undefined') ? i18n.t('stop_btn') : '🛑 قِف! خَلّصت';
    }
    const spinBtn = document.getElementById('spin-btn');
    if (spinBtn && !this.isRoundActive) {
      spinBtn.innerHTML = (typeof i18n !== 'undefined') ? i18n.t('spin_btn') : '🎲 تدوير العجلة وبدء الجولة';
    }
  }

  getActiveCategories() {
    return this.categories.filter(c => c.active !== false);
  }

  bindEvents() {
    // زر تدوير العجلة / بدء الجولة
    const spinBtn = document.getElementById('spin-btn');
    if (spinBtn) {
      spinBtn.addEventListener('click', () => {
        sounds.init();
        this.startNewRound();
      });
    }

    // زر أوتوبيس كومبلي / STOP
    const stopBtn = document.getElementById('btn-stop');
    if (stopBtn) {
      stopBtn.addEventListener('click', () => {
        this.handlePlayerStop();
      });
    }

    // أزرار التحكم في الشريط العلوي
    const soundToggleBtn = document.getElementById('toggle-sound-btn');
    if (soundToggleBtn) {
      soundToggleBtn.addEventListener('click', () => {
        const muted = sounds.toggleMute();
        soundToggleBtn.innerHTML = muted ? '🔇 الصوت: مغلق' : '🔊 الصوت: مفعل';
      });
    }

    const settingsBtn = document.getElementById('settings-btn');
    const settingsDrawer = document.getElementById('settings-drawer');
    const closeSettingsBtn = document.getElementById('close-settings-btn');

    if (settingsBtn && settingsDrawer) {
      settingsBtn.addEventListener('click', () => {
        settingsDrawer.classList.toggle('open');
      });
    }
    if (closeSettingsBtn && settingsDrawer) {
      closeSettingsBtn.addEventListener('click', () => {
        settingsDrawer.classList.remove('open');
      });
    }

    // إعدادات الوضع والصعوبة
    const modeSelect = document.getElementById('setting-game-mode');
    if (modeSelect) {
      modeSelect.addEventListener('change', (e) => {
        this.gameMode = e.target.value;
        const aiCard = document.getElementById('ai-opponent-container');
        if (aiCard) {
          aiCard.style.display = this.gameMode === 'vs_ai' ? 'flex' : 'none';
        }
      });
    }

    const diffSelect = document.getElementById('setting-difficulty');
    if (diffSelect) {
      diffSelect.addEventListener('change', (e) => {
        this.difficulty = e.target.value;
      });
    }

    const timerSelect = document.getElementById('setting-timer');
    if (timerSelect) {
      timerSelect.addEventListener('change', (e) => {
        this.timerDuration = parseInt(e.target.value, 10);
        this.timeLeft = this.timerDuration;
        this.updateStatsDisplay();
      });
    }

    // أزرار اختبار الأصوات
    const testVictoryBtn = document.getElementById('test-victory-btn');
    if (testVictoryBtn) {
      testVictoryBtn.addEventListener('click', () => {
        sounds.playCelebratoryVictory();
        this.fireConfetti();
      });
    }

    const testDefeatBtn = document.getElementById('test-defeat-btn');
    if (testDefeatBtn) {
      testDefeatBtn.addEventListener('click', () => {
        sounds.playDefeat();
      });
    }

    // زر الجولة التالية في نافذة النتائج
    const nextRoundBtn = document.getElementById('modal-next-round-btn');
    if (nextRoundBtn) {
      nextRoundBtn.addEventListener('click', () => {
        this.closeResultsModal();
        this.startNewRound();
      });
    }

    // أحداث نافذة التحكيم والتصويت
    const btnHumanAccept = document.getElementById('btn-human-accept');
    if (btnHumanAccept) {
      btnHumanAccept.addEventListener('click', () => this.castHumanVote('accept'));
    }

    const btnHumanReject = document.getElementById('btn-human-reject');
    if (btnHumanReject) {
      btnHumanReject.addEventListener('click', () => this.castHumanVote('reject'));
    }

    const btnResolveHuman = document.getElementById('btn-resolve-human-vote');
    if (btnResolveHuman) {
      btnResolveHuman.addEventListener('click', () => this.resolveHumanVote());
    }

    const btnRunJury = document.getElementById('btn-run-jury');
    if (btnRunJury) {
      btnRunJury.addEventListener('click', () => this.runSmartJury());
    }

    const btnCloseVoting = document.getElementById('close-voting-modal-btn');
    if (btnCloseVoting) {
      btnCloseVoting.addEventListener('click', () => this.closeVotingModal());
    }

    const btnApplyVerdict = document.getElementById('apply-vote-verdict-btn');
    if (btnApplyVerdict) {
      btnApplyVerdict.addEventListener('click', () => this.applyVoteVerdict());
    }
  }

  renderCategoryInputs() {
    const grid = document.getElementById('categories-grid');
    if (!grid) return;

    grid.innerHTML = '';
    const activeCats = this.getActiveCategories();

    activeCats.forEach((cat, index) => {
      const isLast = index === activeCats.length - 1;
      const card = document.createElement('div');
      card.className = 'category-card';
      card.innerHTML = `
        <div class="category-header">
          <div class="category-title">
            <span class="category-icon">${cat.icon}</span>
            <span>${cat.label}</span>
          </div>
          <span class="input-status-icon" id="status-icon-${cat.id}">⚪</span>
        </div>
        <input 
          type="text" 
          id="input-${cat.id}" 
          class="category-input" 
          placeholder="${cat.placeholder}" 
          autocomplete="off" 
          autocorrect="off"
          autocapitalize="words"
          spellcheck="false"
          enterkeyhint="${isLast ? 'done' : 'next'}"
          disabled
        />
      `;
      grid.appendChild(card);

      const input = card.querySelector(`#input-${cat.id}`);
      input.addEventListener('input', (e) => {
        sounds.playKey();
        this.checkInputProgress();
      });

      // تنقل فائق السرعة عبر لوحة مفاتيح الجوال عند ضغط التالي (Next)
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (!isLast) {
            const nextCat = activeCats[index + 1];
            const nextInput = document.getElementById(`input-${nextCat.id}`);
            if (nextInput) nextInput.focus();
          } else {
            input.blur();
            this.checkInputProgress();
          }
        }
      });
    });
  }

  checkInputProgress() {
    const activeCats = this.getActiveCategories();
    let filledCount = 0;

    activeCats.forEach(cat => {
      const input = document.getElementById(`input-${cat.id}`);
      const icon = document.getElementById(`status-icon-${cat.id}`);
      if (input && input.value.trim().length > 0) {
        filledCount++;
        if (icon) {
          icon.textContent = '✍️';
          icon.classList.add('active');
        }
      } else {
        if (icon) icon.classList.remove('active');
      }
    });

    const stopBtn = document.getElementById('btn-stop');
    if (stopBtn && this.isRoundActive) {
      if (filledCount >= activeCats.length) {
        stopBtn.disabled = false;
        stopBtn.classList.add('ready-pulse');
      }
    }
  }

  startNewRound() {
    const spinBtn = document.getElementById('spin-btn');
    if (spinBtn) spinBtn.disabled = true;

    // تصفير الجولة السابقة وإخفاء زر قِف حتى تبدأ الجولة فعلياً
    this.isRoundActive = false;
    this.isPanicMode = false;
    this.stoppedBy = null;
    const stopContainer = document.getElementById('stop-action-container');
    if (stopContainer) stopContainer.classList.remove('active');
    clearInterval(this.timerInterval);
    clearInterval(this.aiTypingInterval);

    // اختيار حرف عشوائي بناءً على لغة اللعبة
    const isEn = (typeof i18n !== 'undefined' && i18n.currentLang === 'en');
    const letterPool = isEn ? ENGLISH_LETTERS : ARABIC_LETTERS;
    const randomLetter = letterPool[Math.floor(Math.random() * letterPool.length)];

    // تشغيل العجلة
    triggerWheelSpin(randomLetter, (letter) => {
      this.onLetterChosen(letter);
    });
  }

  onLetterChosen(letter) {
    this.currentLetter = letter;
    this.isRoundActive = true;
    this.timeLeft = this.timerDuration;

    // تحديث الشارة
    const badge = document.getElementById('target-letter-badge');
    if (badge) badge.textContent = letter;

    const letterNameEl = document.getElementById('target-letter-name');
    const letterPrefix = (typeof i18n !== 'undefined') ? i18n.t('target_letter_name') : 'حرف';
    if (letterNameEl) letterNameEl.textContent = `${letterPrefix} (${letter})`;

    // تمكين حقول الإدخال وتفريغها
    const activeCats = this.getActiveCategories();
    activeCats.forEach((cat, index) => {
      const input = document.getElementById(`input-${cat.id}`);
      const icon = document.getElementById(`status-icon-${cat.id}`);
      if (input) {
        input.disabled = false;
        input.value = '';
        if (index === 0) input.focus();
      }
      if (icon) icon.classList.remove('active');
    });

    // إعداد زر قِف! خَلّصت وإظهاره فقط الآن أثناء بدء الجولة والعد التنازلي
    const stopContainer = document.getElementById('stop-action-container');
    if (stopContainer) stopContainer.classList.add('active');

    const stopBtn = document.getElementById('btn-stop');
    if (stopBtn) {
      stopBtn.disabled = false;
      stopBtn.innerHTML = (typeof i18n !== 'undefined') ? i18n.t('stop_btn') : '🛑 قِف! خَلّصت';
    }

    const spinBtn = document.getElementById('spin-btn');
    if (spinBtn) spinBtn.disabled = true;

    this.startTimer();
    this.startAiSimulation();
    this.updateStatsDisplay();
  }

  startTimer() {
    clearInterval(this.timerInterval);

    const timerVal = document.getElementById('stat-timer');
    const secondsUnit = (typeof i18n !== 'undefined') ? i18n.t('seconds_unit') : 'ثانية';

    if (this.timerDuration <= 0) {
      if (timerVal) timerVal.textContent = '∞';
      return;
    }

    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      if (timerVal) timerVal.textContent = `${this.timeLeft} ${secondsUnit}`;

      if (this.timeLeft <= 10) {
        if (timerVal) timerVal.classList.add('timer-critical');
        sounds.playTick();
      } else {
        if (timerVal) timerVal.classList.remove('timer-critical');
      }

      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        const timeUpMsg = (typeof i18n !== 'undefined') ? i18n.t('time_up') : 'انتهى الوقت المحدد للجولة!';
        this.endRound(timeUpMsg);
      }
    }, 1000);
  }

  startAiSimulation() {
    if (this.gameMode !== 'vs_ai') return;

    this.aiAnswers = {};
    const activeCats = this.getActiveCategories();
    const aiStatusEl = document.getElementById('ai-status');
    const aiProgressFill = document.getElementById('ai-progress-fill');

    if (aiProgressFill) aiProgressFill.style.width = '0%';
    if (aiStatusEl) aiStatusEl.textContent = (typeof i18n !== 'undefined') ? i18n.t('ai_thinking') : 'الخصم يفكر...';

    // اختيار كلمات الذكاء الاصطناعي
    activeCats.forEach(cat => {
      this.aiAnswers[cat.id] = getAiWord(this.currentLetter, cat.id, this.difficulty);
    });

    // محاكاة التقدم
    let filledSoFar = 0;
    const typingDelay = this.difficulty === 'hard' ? 3800 : (this.difficulty === 'medium' ? 5500 : 7500);

    this.aiTypingInterval = setInterval(() => {
      if (!this.isRoundActive) {
        clearInterval(this.aiTypingInterval);
        return;
      }

      if (filledSoFar < activeCats.length) {
        const currentCat = activeCats[filledSoFar];
        if (aiStatusEl) {
          aiStatusEl.textContent = (typeof i18n !== 'undefined')
            ? i18n.t('ai_typing', { cat: currentCat.label })
            : `الخصم يكتب في: ${currentCat.label}...`;
        }
        filledSoFar++;
        const pct = (filledSoFar / activeCats.length) * 100;
        if (aiProgressFill) aiProgressFill.style.width = `${pct}%`;

        // إذا أنهى الكمبيوتر كل الحقول، يضغط STOP!
        if (filledSoFar === activeCats.length) {
          clearInterval(this.aiTypingInterval);
          if (aiStatusEl) aiStatusEl.textContent = (typeof i18n !== 'undefined') ? i18n.t('ai_finished') : 'الخصم جاهز وضغط STOP!';
          this.handleAiStop();
        }
      }
    }, typingDelay);
  }

  handlePlayerStop() {
    if (!this.isRoundActive) return;

    sounds.playStopWhistle();
    this.stoppedBy = 'player';

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate([60, 40, 120]); } catch (e) {}
    }

    if (typeof multiplayer !== 'undefined' && multiplayer.isMultiplayer) {
      multiplayer.send('STOP_PRESSED');
    }

    const stopBtn = document.getElementById('btn-stop');
    if (stopBtn) {
      stopBtn.disabled = true;
      stopBtn.innerHTML = (typeof i18n !== 'undefined') ? i18n.t('stop_btn_pressed') : '⚡ أعلنت النهاية (خَلّصت)! جاري التحقق...';
    }

    setTimeout(() => {
      const bonusMsg = (typeof i18n !== 'undefined')
        ? i18n.t('first_stop_bonus')
        : 'أحسنت! أعلنت (قِف! خَلّصت) أولاً وحصلت على +5 نقاط إضافية للسرعة!';
      this.endRound(bonusMsg);
    }, 600);
  }

  handleAiStop() {
    if (!this.isRoundActive || this.stoppedBy) return;

    sounds.playStopWhistle();
    this.stoppedBy = 'ai';

    const stopBtn = document.getElementById('btn-stop');
    if (stopBtn) {
      stopBtn.innerHTML = (typeof i18n !== 'undefined') ? i18n.t('stop_btn_opponent') : '⚠️ الخصم قال قِف! خَلّصت.. تبقت 10 ثوانٍ!';
    }

    // إعطاء اللاعب 10 ثوانٍ كمهلة ذعر Panic Mode
    this.timeLeft = Math.min(this.timeLeft, 10);
    this.isPanicMode = true;
  }

  endRound(message = '') {
    this.isRoundActive = false;
    clearInterval(this.timerInterval);
    clearInterval(this.aiTypingInterval);

    // إخفاء زر قِف! خَلّصت فور انتهاء الجولة
    const stopContainer = document.getElementById('stop-action-container');
    if (stopContainer) stopContainer.classList.remove('active');

    // تعطيل الحقول
    const activeCats = this.getActiveCategories();
    this.playerAnswers = {};

    activeCats.forEach(cat => {
      const input = document.getElementById(`input-${cat.id}`);
      if (input) {
        this.playerAnswers[cat.id] = input.value.trim();
        input.disabled = true;
      }
    });

    if (typeof multiplayer !== 'undefined' && multiplayer.isMultiplayer) {
      multiplayer.send('SUBMIT_ANSWERS', { answers: this.playerAnswers });
    }

    const spinBtn = document.getElementById('spin-btn');
    if (spinBtn) spinBtn.disabled = false;

    this.calculateAndShowResults(message);
  }

  calculateAndShowResults(message) {
    const activeCats = this.getActiveCategories();
    this.reviewResults = [];
    this.aiObjections = [];
    let roundTotal = 0;
    let aiRoundTotal = 0;

    activeCats.forEach(cat => {
      const pWord = this.playerAnswers[cat.id] || '';
      const aiWord = this.aiAnswers[cat.id] || '';

      const pVal = validateWord(pWord, this.currentLetter, cat.id);
      const aiVal = validateWord(aiWord, this.currentLetter, cat.id);

      let pPoints = 0;
      let aiPoints = 0;

      if (pVal.valid) {
        // فحص التشابه بين اللاعب والخصم
        const isIdentical = normalizeArabic(pWord) === normalizeArabic(aiWord);
        if (isIdentical && aiVal.valid) {
          pPoints = 5;
          aiPoints = 5;
        } else {
          pPoints = 10;
        }
      }

      if (aiVal.valid && pPoints !== 5) {
        aiPoints = 10;
      }

      // فحص اعتراض الخصم الذكي (AI Objection) إذا شك أن الكلمة من الكيس
      let aiObjected = false;
      let aiRemark = '';

      if (this.gameMode === 'vs_ai' && pWord.trim().length > 0) {
        // إذا لم تكن الكلمة مطابقة بدقة في القاموس المعياري (كلمة غير شائعة / مشكوك فيها / عامية)
        if (!pVal.exactMatch) {
          const objectionChance = this.difficulty === 'hard' ? 0.90 : (this.difficulty === 'medium' ? 0.70 : 0.40);
          if (Math.random() < objectionChance) {
            aiObjected = true;
            const remarksAr = [
              `يا كابتن! كلمة "${pWord}" في تصنيف (${cat.label}) أحسها مؤلفة ومن الكيس! أطلب التحكيم والتصويت! ✋`,
              `لحظة من فضلك! من متى و"${pWord}" تعتبر (${cat.label})؟! هذي من الرأس وأطلب حسمها بالتصويت! 🧐`,
              `مع احترامي.. كلمة "${pWord}" ما مرت علي في أي معجم عربي! صوتوا يا جماعة هل هي مقبولة ولا من الكيس؟ ⚖️`,
              `الخصم يرفع يده معترضاً: إجابة "${pWord}" في (${cat.label}) مشبوهة جداً ونطلب حكم الأغلبية!`
            ];
            const remarksEn = [
              `Hold on! "${pWord}" for (${cat.label}) sounds completely made-up! I demand a majority vote! ✋`,
              `Wait a second! Since when is "${pWord}" a valid (${cat.label})?! That came out of nowhere, let's vote! 🧐`,
              `Objection! "${pWord}" is not recognized in standard English dictionaries! Let the jury decide! ⚖️`,
              `I call foul! "${pWord}" in (${cat.label}) is highly suspicious! Time for court! 🛑`
            ];
            const isEn = (typeof i18n !== 'undefined' && i18n.currentLang === 'en');
            const remarks = isEn ? remarksEn : remarksAr;
            aiRemark = remarks[Math.floor(Math.random() * remarks.length)];

            this.aiObjections.push({
              catId: cat.id,
              catLabel: cat.label,
              word: pWord,
              remark: aiRemark
            });
          }
        }
      }

      roundTotal += pPoints;
      aiRoundTotal += aiPoints;

      this.reviewResults.push({
        catId: cat.id,
        catLabel: cat.label,
        icon: cat.icon,
        playerWord: pWord,
        aiWord: aiWord,
        pPoints: pPoints,
        aiPoints: aiPoints,
        isValid: pVal.valid,
        reason: pVal.reason,
        aiObjected: aiObjected,
        aiRemark: aiRemark,
        playerVoteStatus: null,
        aiVoteStatus: null
      });
    });

    // مكافأة الإيقاف الأول
    if (this.stoppedBy === 'player') {
      roundTotal += 5;
    }

    this.totalScore += roundTotal;
    this.aiTotalScore += aiRoundTotal;
    this.round++;

    this.updateStatsDisplay();
    this.openResultsModal(roundTotal, aiRoundTotal, message);
  }

  openResultsModal(roundTotal, aiRoundTotal, message) {
    const modal = document.getElementById('results-modal');
    const modalMessage = document.getElementById('modal-round-message');

    if (!modal) return;
    if (modalMessage) modalMessage.textContent = message;

    // عرض بانر اعتراض الخصم الذكي إذا وُجدت كلمات مشكوك فيها
    const aiBanner = document.getElementById('ai-objection-banner');
    if (aiBanner) {
      if (this.aiObjections && this.aiObjections.length > 0) {
        const firstObj = this.aiObjections[0];
        const bannerTitle = (typeof i18n !== 'undefined') ? i18n.t('ai_objecting_title') : '⚠️ الخصم الذكي يعترض على إجابتك!';
        const voteBtnText = (typeof i18n !== 'undefined') ? i18n.t('go_vote_btn') : '⚖️ فتح جلسة التصويت فوراً';
        aiBanner.style.display = 'flex';
        aiBanner.innerHTML = `
          <div class="ai-objection-content">
            <div class="ai-objection-avatar">🤖✋</div>
            <div class="ai-objection-text">
              <h4>${bannerTitle}</h4>
              <p>${firstObj.remark}</p>
            </div>
          </div>
          <button class="btn-objection-action" onclick="game.startObjection('${firstObj.catId}', 'player')">
            ${voteBtnText}
          </button>
        `;
        setTimeout(() => sounds.playStopWhistle(), 450);
      } else {
        aiBanner.style.display = 'none';
      }
    }

    this.renderResultsTable();
    this.updateResultsSummary();

    modal.classList.add('active');

    // تشغيل المؤثر الصوتي للنتيجة الأولية
    const roundP = this.reviewResults.reduce((s, r) => s + (r.pPoints || 0), 0) + (this.stoppedBy === 'player' ? 5 : 0);
    const roundAi = this.reviewResults.reduce((s, r) => s + (r.aiPoints || 0), 0);

    if (this.gameMode === 'vs_ai') {
      if (roundP > roundAi) {
        sounds.playCelebratoryVictory();
        this.fireConfetti();
      } else if (roundP < roundAi) {
        sounds.playDefeat();
      } else {
        sounds.playCorrect();
      }
    } else {
      if (roundP >= 30) {
        sounds.playCelebratoryVictory();
        this.fireConfetti();
      } else {
        sounds.playDefeat();
      }
    }
  }

  renderResultsTable() {
    const tableBody = document.getElementById('results-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    const emptyWordText = (typeof i18n !== 'undefined') ? i18n.t('empty_word') : '(فارغ)';
    const stampRejectText = (typeof i18n !== 'undefined') ? i18n.t('stamp_rejected') : '❌ مرفوضة بالتصويت (من الكيس)';
    const stampAcceptText = (typeof i18n !== 'undefined') ? i18n.t('stamp_accepted') : '✅ مقبولة بالتصويت';
    const aiObjTagText = (typeof i18n !== 'undefined') ? i18n.t('ai_objecting_tag') : '⚠️ الخصم يعترض! (يشك أنها من الكيس) ✋';
    const challengeBtnText = (typeof i18n !== 'undefined') ? i18n.t('challenge_btn') : '✋ اعتراض وتصويت';
    const pointsUnit = (typeof i18n !== 'undefined') ? i18n.t('points_unit') : 'نقطة';
    const editBtnText = (typeof i18n !== 'undefined') ? i18n.t('edit_btn') : 'تعديل ✍️';

    this.reviewResults.forEach((res) => {
      const tr = document.createElement('tr');
      const badgeClass = res.pPoints === 10 ? 'score-10' : (res.pPoints === 5 ? 'score-5' : 'score-0');

      // عمود إجابة اللاعب مع زر وشارة الاعتراض
      let playerCell = `<strong>${res.playerWord || `<span style="color:#64748b;">${emptyWordText}</span>`}</strong>`;
      if (res.playerWord) {
        if (res.playerVoteStatus === 'rejected') {
          playerCell += `<div><span class="stamp-badge stamp-rejected">${stampRejectText}</span></div>`;
        } else if (res.playerVoteStatus === 'accepted') {
          playerCell += `<div><span class="stamp-badge stamp-accepted">${stampAcceptText}</span></div>`;
        } else if (res.aiObjected) {
          playerCell += `<div><span class="ai-objection-tag">${aiObjTagText}</span></div>`;
        }
        playerCell += ` <button class="btn-challenge" title="${challengeBtnText}" onclick="game.startObjection('${res.catId}', 'player')">${challengeBtnText}</button>`;
      }

      // عمود إجابة الخصم مع زر وشارة الاعتراض
      let aiCell = `<strong>${res.aiWord || '<span style="color:#64748b;">-</span>'}</strong>`;
      if (res.aiWord) {
        if (res.aiVoteStatus === 'rejected') {
          aiCell += `<div><span class="stamp-badge stamp-rejected">${stampRejectText}</span></div>`;
        } else if (res.aiVoteStatus === 'accepted') {
          aiCell += `<div><span class="stamp-badge stamp-accepted">${stampAcceptText}</span></div>`;
        }
        aiCell += ` <button class="btn-challenge" title="${challengeBtnText}" onclick="game.startObjection('${res.catId}', 'ai')">${challengeBtnText}</button>`;
      }

      tr.innerHTML = `
        <td>${res.icon} ${res.catLabel}</td>
        <td>${playerCell}</td>
        <td>${aiCell}</td>
        <td>
          <span class="score-badge ${badgeClass}" id="badge-${res.catId}">
            ${res.pPoints} ${pointsUnit}
          </span>
          <button class="manual-toggle-btn" title="تعديل النقاط" onclick="game.toggleManualOverride('${res.catId}')">
            ${editBtnText}
          </button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  updateResultsSummary() {
    const modalScore = document.getElementById('modal-round-score');
    const statusBanner = document.getElementById('result-status-banner');

    let roundP = this.reviewResults.reduce((s, r) => s + (r.pPoints || 0), 0);
    if (this.stoppedBy === 'player') roundP += 5;
    let roundAi = this.reviewResults.reduce((s, r) => s + (r.aiPoints || 0), 0);

    if (modalScore) {
      if (typeof i18n !== 'undefined') {
        modalScore.innerHTML = i18n.t('round_score_summary', { pScore: roundP, aiScore: roundAi });
      } else {
        modalScore.innerHTML = `مجموع نقاطك في هذه الجولة: <strong>${roundP}</strong> | نقاط الخصم: <strong>${roundAi}</strong>`;
      }
    }

    let bannerText = '';
    let bannerClass = '';

    if (this.gameMode === 'vs_ai') {
      if (roundP > roundAi) {
        bannerText = (typeof i18n !== 'undefined') ? i18n.t('win_banner') : '🏆 مبروك! فزت في هذه الجولة وتفوقت على الخصم! 🎉';
        bannerClass = 'status-win';
      } else if (roundP < roundAi) {
        bannerText = (typeof i18n !== 'undefined') ? i18n.t('loss_banner') : '😢 للأسف! تفوق عليك الخصم الذكي في هذه الجولة';
        bannerClass = 'status-loss';
      } else {
        bannerText = (typeof i18n !== 'undefined') ? i18n.t('tie_banner') : '🤝 تعادل متكافئ بينك وبين الخصم!';
        bannerClass = 'status-tie';
      }
    } else {
      if (roundP >= 30) {
        bannerText = (typeof i18n !== 'undefined') ? i18n.t('win_banner') : '🏆 أحسنت! حققت نتيجة ممتازة في الوقت المحدد! 🎉';
        bannerClass = 'status-win';
      } else {
        bannerText = (typeof i18n !== 'undefined') ? i18n.t('loss_banner') : '😢 لم تتمكن من جمع نقاط كافية، حاول مجدداً!';
        bannerClass = 'status-loss';
      }
    }

    if (statusBanner) {
      statusBanner.style.display = 'flex';
      statusBanner.className = `result-status-banner ${bannerClass}`;
      statusBanner.textContent = bannerText;
    }
  }

  startObjection(catId, target) {
    const item = this.reviewResults.find(r => r.catId === catId);
    if (!item) return;

    const word = target === 'player' ? item.playerWord : item.aiWord;
    if (!word) return;

    this.currentVote = {
      catId,
      target,
      word,
      item
    };
    this.humanVotes = { accept: 0, reject: 0 };
    this.currentVerdict = null;

    // تجهيز عناصر نافذة التصويت
    const catNameEl = document.getElementById('vote-category-name');
    const letterNameEl = document.getElementById('vote-letter-name');
    const authorNameEl = document.getElementById('vote-author-name');
    const targetWordEl = document.getElementById('vote-target-word');
    const acceptCountEl = document.getElementById('human-accept-count');
    const rejectCountEl = document.getElementById('human-reject-count');
    const verdictBox = document.getElementById('verdict-box');
    const applyVerdictBtn = document.getElementById('apply-vote-verdict-btn');
    const btnRunJury = document.getElementById('btn-run-jury');

    if (catNameEl) catNameEl.textContent = `📁 التصنيف: ${item.catLabel}`;
    if (letterNameEl) letterNameEl.textContent = `🔤 الحرف: (${this.currentLetter})`;
    if (authorNameEl) authorNameEl.textContent = `👤 صاحب الإجابة: ${target === 'player' ? 'أنت (اللاعب)' : 'الخصم الذكي (AI)'}`;
    if (targetWordEl) targetWordEl.textContent = `"${word}"`;
    if (acceptCountEl) acceptCountEl.textContent = '0';
    if (rejectCountEl) rejectCountEl.textContent = '0';

    if (verdictBox) {
      verdictBox.style.display = 'none';
      verdictBox.className = 'verdict-box';
    }
    if (applyVerdictBtn) applyVerdictBtn.style.display = 'none';
    if (btnRunJury) btnRunJury.disabled = false;

    // تصفير بطاقات الحكام
    for (let i = 1; i <= 3; i++) {
      const vEl = document.getElementById(`jury-vote-${i}`);
      const cEl = document.getElementById(`jury-comment-${i}`);
      if (vEl) vEl.textContent = '⏳';
      if (cEl) cEl.textContent = 'في انتظار المراجعة...';
    }

    const votingModal = document.getElementById('voting-modal');
    if (votingModal) votingModal.classList.add('active');

    if (typeof multiplayer !== 'undefined' && multiplayer.isMultiplayer) {
      multiplayer.send('START_GROUP_OBJECTION', {
        targetPlayerId: target === 'player' ? multiplayer.myPlayerId : 'ai',
        targetPlayerName: target === 'player' ? multiplayer.playerName : 'الخصم',
        catId: catId,
        catLabel: item.catLabel,
        word: word
      });
    }

    sounds.playVoteClick();
  }

  castHumanVote(type) {
    if (!this.currentVote) return;

    if (type === 'accept') {
      this.humanVotes.accept++;
      sounds.playVoteClick();
    } else {
      this.humanVotes.reject++;
      sounds.playWrong();
    }

    if (typeof multiplayer !== 'undefined' && multiplayer.isMultiplayer) {
      multiplayer.send('CAST_ROOM_VOTE', { decision: type });
    }

    const acceptEl = document.getElementById('human-accept-count');
    const rejectEl = document.getElementById('human-reject-count');
    if (acceptEl) acceptEl.textContent = this.humanVotes.accept;
    if (rejectEl) rejectEl.textContent = this.humanVotes.reject;
  }

  resolveHumanVote() {
    if (!this.currentVote) return;
    const total = this.humanVotes.accept + this.humanVotes.reject;
    if (total === 0) {
      alert('الرجاء الضغط على 👍 أو 👎 لتسجيل أصوات الحاضرين أولاً!');
      return;
    }

    const isRejected = this.humanVotes.reject > this.humanVotes.accept;
    const verdict = isRejected ? 'rejected' : 'accepted';
    const reason = isRejected
      ? `أغلبية الحاضرين (${this.humanVotes.reject} اعتراض مقابل ${this.humanVotes.accept} قبول)`
      : `أغلبية الحاضرين (${this.humanVotes.accept} قبول مقابل ${this.humanVotes.reject} اعتراض)`;

    this.declareVerdict(verdict, reason);
  }

  runSmartJury() {
    if (!this.currentVote) return;
    const { word, catId, target } = this.currentVote;
    const letter = this.currentLetter;
    const btnRunJury = document.getElementById('btn-run-jury');
    if (btnRunJury) btnRunJury.disabled = true;

    const val = validateWord(word, letter, catId);

    // 1. الحكم المعجمي (أستاذ اللغة)
    let j1Vote = 'accepted';
    let j1Comment = 'الكلمة فصيحة ومثبتة في المعاجم العربية! ✅';
    if (!val.valid) {
      j1Vote = 'rejected';
      j1Comment = 'الكلمة لا تبدأ بالحرف المطلوب أصلاً! ❌';
    } else if (val.custom) {
      if (Math.random() > 0.45) {
        j1Vote = 'accepted';
        j1Comment = 'تعتبر من الألفاظ الشائعة المقبولة عرفاً ✅';
      } else {
        j1Vote = 'rejected';
        j1Comment = 'لم أجد لها أصلاً لغوياً معتمداً في المعاجم ❌';
      }
    }

    // 2. الخصم المنافس
    let j2Vote = 'rejected';
    let j2Comment = 'أعترض بشدة! الكلمة غير مقنعة ومؤلفة من الرأس! ❌';
    if (target === 'player') {
      if (val.exactMatch && Math.random() > 0.4) {
        j2Vote = 'accepted';
        j2Comment = 'حسناً.. الكلمة صحيحة وموجودة بالفعل ✅';
      }
    } else {
      // الخصم يدافع عن نفسه
      j2Vote = 'accepted';
      j2Comment = 'إجابتي دقيقة ولا تقبل الشك! ✅';
    }

    // 3. الحكم المحايد
    let j3Vote = 'accepted';
    let j3Comment = 'أتفق مع قبول الكلمة وفق السياق العام ✅';
    if (j1Vote === 'rejected' && j2Vote === 'rejected') {
      j3Vote = 'rejected';
      j3Comment = 'بما أن الحكام اعترضوا، أرفضها أيضاً ❌';
    } else if (j1Vote === 'rejected' || j2Vote === 'rejected') {
      if (Math.random() > 0.5) {
        j3Vote = 'rejected';
        j3Comment = 'الشك يفسر لصالح المنافسة، أرفضها ❌';
      }
    }

    const juryData = [
      { id: 1, vote: j1Vote, comment: j1Comment },
      { id: 2, vote: j2Vote, comment: j2Comment },
      { id: 3, vote: j3Vote, comment: j3Comment }
    ];

    juryData.forEach((j, idx) => {
      setTimeout(() => {
        const vEl = document.getElementById(`jury-vote-${j.id}`);
        const cEl = document.getElementById(`jury-comment-${j.id}`);
        if (vEl) vEl.textContent = j.vote === 'accepted' ? '✅ مقبولة' : '❌ مرفوضة';
        if (cEl) cEl.textContent = j.comment;
        sounds.playVoteClick();
      }, (idx + 1) * 350);
    });

    setTimeout(() => {
      const rejectCount = juryData.filter(j => j.vote === 'rejected').length;
      const finalVerdict = rejectCount >= 2 ? 'rejected' : 'accepted';
      const reason = rejectCount >= 2
        ? `هيئة التحكيم الذكية (${rejectCount} قضاة رفضوا الكلمة)`
        : `هيئة التحكيم الذكية (${3 - rejectCount} قضاة قبلوا الكلمة)`;

      this.declareVerdict(finalVerdict, reason);
    }, 1250);
  }

  declareVerdict(verdict, reasonText) {
    this.currentVerdict = verdict;
    sounds.playGavel();

    const verdictBox = document.getElementById('verdict-box');
    const verdictText = document.getElementById('verdict-text');
    const applyBtn = document.getElementById('apply-vote-verdict-btn');

    if (verdictBox && verdictText) {
      if (verdict === 'rejected') {
        verdictBox.className = 'verdict-box verdict-rejected';
        verdictText.innerHTML = `🔨 قرار المحكمة: <strong>مرفوضة بالأغلبية!</strong> (${reasonText})<br><span style="font-size:0.9rem;">🚫 لا تُحتسب أي نقاط للكلمة (0 نقطة)</span>`;
        setTimeout(() => sounds.playWrong(), 250);
      } else {
        verdictBox.className = 'verdict-box verdict-accepted';
        verdictText.innerHTML = `🔨 قرار المحكمة: <strong>مقبولة وصحيحة!</strong> (${reasonText})<br><span style="font-size:0.9rem;">✨ تُحتسب النقاط كاملة لصاحبها</span>`;
        setTimeout(() => sounds.playCorrect(), 250);
      }
    }

    if (applyBtn) {
      applyBtn.style.display = 'inline-block';
      applyBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  applyVoteVerdict() {
    if (!this.currentVote || !this.currentVerdict) return;
    const { target, item } = this.currentVote;

    if (target === 'player') {
      if (this.currentVerdict === 'rejected') {
        if (item.pPoints > 0) {
          this.totalScore -= item.pPoints;
        }
        item.pPoints = 0;
        item.playerVoteStatus = 'rejected';
      } else {
        if (item.pPoints === 0) {
          item.pPoints = 10;
          this.totalScore += 10;
        }
        item.playerVoteStatus = 'accepted';
      }
    } else {
      // الخصم
      if (this.currentVerdict === 'rejected') {
        if (item.aiPoints > 0) {
          this.aiTotalScore -= item.aiPoints;
        }
        item.aiPoints = 0;
        item.aiVoteStatus = 'rejected';
      } else {
        if (item.aiPoints === 0) {
          item.aiPoints = 10;
          this.aiTotalScore += 10;
        }
        item.aiVoteStatus = 'accepted';
      }
    }

    if (target === 'player') {
      item.aiObjected = false;
      this.aiObjections = (this.aiObjections || []).filter(o => o.catId !== item.catId);
    }

    // تحديث بانر اعتراض الخصم
    const aiBanner = document.getElementById('ai-objection-banner');
    if (aiBanner) {
      if (this.aiObjections && this.aiObjections.length > 0) {
        const nextObj = this.aiObjections[0];
        aiBanner.style.display = 'flex';
        aiBanner.innerHTML = `
          <div class="ai-objection-content">
            <div class="ai-objection-avatar">🤖✋</div>
            <div class="ai-objection-text">
              <h4>⚠️ الخصم الذكي يعترض على إجابة أخرى!</h4>
              <p>${nextObj.remark}</p>
            </div>
          </div>
          <button class="btn-objection-action" onclick="game.startObjection('${nextObj.catId}', 'player')">
            ⚖️ فتح جلسة التصويت فوراً
          </button>
        `;
      } else {
        aiBanner.style.display = 'none';
      }
    }

    this.closeVotingModal();
    this.updateStatsDisplay();
    this.renderResultsTable();
    this.updateResultsSummary();
  }

  closeVotingModal() {
    const modal = document.getElementById('voting-modal');
    if (modal) modal.classList.remove('active');
    this.currentVote = null;
    this.currentVerdict = null;
  }

  toggleManualOverride(catId) {
    const item = this.reviewResults.find(r => r.catId === catId);
    if (!item) return;

    // تبديل النقاط بين 0 و 10
    if (item.pPoints === 0) {
      item.pPoints = 10;
      this.totalScore += 10;
      item.playerVoteStatus = 'accepted';
    } else {
      this.totalScore -= item.pPoints;
      item.pPoints = 0;
      item.playerVoteStatus = 'rejected';
    }

    this.updateStatsDisplay();
    this.renderResultsTable();
    this.updateResultsSummary();
  }

  closeResultsModal() {
    const modal = document.getElementById('results-modal');
    if (modal) modal.classList.remove('active');
  }

  updateStatsDisplay() {
    const roundEl = document.getElementById('stat-round');
    const scoreEl = document.getElementById('stat-score');
    const aiScoreEl = document.getElementById('stat-ai-score');
    const timerEl = document.getElementById('stat-timer');

    if (roundEl) roundEl.textContent = this.round;
    if (scoreEl) scoreEl.textContent = this.totalScore;
    if (aiScoreEl) aiScoreEl.textContent = this.aiTotalScore;
    if (timerEl && !this.isRoundActive) timerEl.textContent = `${this.timeLeft} ثانية`;
  }

  fireConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#f59e0b', '#ec4899', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 1.2) * 14,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 10,
        life: 1
      });
    }

    let frame = 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.rotation += p.rSpeed;
        p.life -= 0.015;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      frame++;
      if (frame < 80) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    requestAnimationFrame(animate);
  }
}

let game = null;
window.addEventListener('DOMContentLoaded', () => {
  game = new EnsanHayawanGame();
  game.init();
});
