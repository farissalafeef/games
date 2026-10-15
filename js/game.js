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

    // محرك التقدم والخبرة والتلميحات الذكية (Retention Engine)
    this.playerXP = parseInt(localStorage.getItem('khalast_xp') || '0', 10);
    this.playerLevel = parseInt(localStorage.getItem('khalast_level') || '1', 10);
    this.hintsRemaining = 3;
    this.activeModifier = null;
    this.aiBubbleTimeout = null;

    // سلسلة الأيام والأوسمة
    this.dailyStreak = parseInt(localStorage.getItem('khalast_daily_streak') || '1', 10);
    this.unlockedAchievements = JSON.parse(localStorage.getItem('khalast_achievements') || '[]');
  }

  init() {
    const initialLang = (typeof i18n !== 'undefined') ? i18n.currentLang : 'ar';
    this.updateCategoriesForLanguage(initialLang);
    this.updateStatsDisplay();
    this.updatePlayerProfileUI();
    this.initDailyStreak();
    this.renderAchievementsList();
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
    this.updatePlayerProfileUI();

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
        this.closeStreakModal();
        this.closeAchievementsModal();
        settingsDrawer.classList.toggle('open');
        this.checkBodyModalState();
      });
    }
    if (closeSettingsBtn && settingsDrawer) {
      closeSettingsBtn.addEventListener('click', () => {
        settingsDrawer.classList.remove('open');
        this.checkBodyModalState();
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

    // أزرار الخروج والانسحاب
    const modalExitBtn = document.getElementById('modal-exit-game-btn');
    if (modalExitBtn) {
      modalExitBtn.addEventListener('click', () => this.exitGame(false));
    }

    const btnForfeit = document.getElementById('btn-forfeit');
    if (btnForfeit) {
      btnForfeit.addEventListener('click', () => this.exitGame(true));
    }

    const headerExitBtn = document.getElementById('header-exit-btn');
    if (headerExitBtn) {
      headerExitBtn.addEventListener('click', () => this.exitGame(true));
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

    // زر مشاركة التحدي الفيروسي
    const modalShareBtn = document.getElementById('modal-share-btn');
    if (modalShareBtn) {
      modalShareBtn.addEventListener('click', () => this.shareChallenge());
    }

    // زر التلميح السحري (Hint Button)
    const btnHint = document.getElementById('btn-hint');
    if (btnHint) {
      btnHint.addEventListener('click', () => this.useMagicHint());
    }

    // زر نافذة سلسلة الأيام
    const btnStreak = document.getElementById('streak-badge-btn');
    if (btnStreak) {
      btnStreak.addEventListener('click', () => this.openStreakModal());
    }
    const btnCloseStreak = document.getElementById('close-streak-btn');
    if (btnCloseStreak) {
      btnCloseStreak.addEventListener('click', () => this.closeStreakModal());
    }

    // زر نافذة الأوسمة والإنجازات
    const btnAchievements = document.getElementById('achievements-btn');
    if (btnAchievements) {
      btnAchievements.addEventListener('click', () => this.openAchievementsModal());
    }
    const btnCloseAchievements = document.getElementById('close-achievements-btn');
    if (btnCloseAchievements) {
      btnCloseAchievements.addEventListener('click', () => this.closeAchievementsModal());
    }

    // زر مشاركة التحدي عبر واتساب
    const btnWhatsAppModal = document.getElementById('modal-whatsapp-btn');
    if (btnWhatsAppModal) {
      btnWhatsAppModal.addEventListener('click', () => this.shareWhatsApp());
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
      input.addEventListener('focus', () => {
        // تمرير الحقل بسلاسة إلى منتصف شاشة الجوال فوق الكيبورد
        setTimeout(() => {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 180);
      });
      let prevFilled = false;
      input.addEventListener('input', (e) => {
        sounds.playKey();
        const hasText = input.value.trim().length > 0;
        if (hasText && !prevFilled) {
          prevFilled = true;
          try { if (navigator.vibrate) navigator.vibrate(25); } catch (err) {}
          const newFilledCount = this.checkInputProgress();
          sounds.playComboChime(newFilledCount);
        } else if (!hasText && prevFilled) {
          prevFilled = false;
          this.checkInputProgress();
        } else {
          this.checkInputProgress();
        }
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
    const isEn = (typeof i18n !== 'undefined' && i18n.currentLang === 'en');

    activeCats.forEach(cat => {
      const input = document.getElementById(`input-${cat.id}`);
      const icon = document.getElementById(`status-icon-${cat.id}`);
      const card = input ? input.closest('.category-card') : null;

      if (input && input.value.trim().length > 0) {
        filledCount++;
        if (icon) {
          icon.textContent = '✅';
          icon.classList.add('active');
        }
        if (card) card.classList.add('completed');
      } else {
        if (icon) {
          icon.textContent = '⚪';
          icon.classList.remove('active');
        }
        if (card) card.classList.remove('completed');
      }
    });

    // تحديث شريط التقدم اللحظي والكومبو
    const progressCount = document.getElementById('hud-progress-count');
    const progressFill = document.getElementById('hud-progress-fill');
    const streakText = document.getElementById('hud-streak-text');

    if (progressCount) progressCount.textContent = `${filledCount} / ${activeCats.length}`;
    if (progressFill) {
      const pct = (filledCount / activeCats.length) * 100;
      progressFill.style.width = `${pct}%`;
    }
    if (streakText) {
      streakText.textContent = isEn ? `${filledCount} Streak` : `${filledCount} متتالي`;
    }

    const stopBtn = document.getElementById('btn-stop');
    if (stopBtn && this.isRoundActive) {
      if (filledCount >= activeCats.length) {
        stopBtn.disabled = false;
        stopBtn.classList.add('ready-pulse');
      }
    }

    return filledCount;
  }

  startNewRound() {
    const spinBtn = document.getElementById('spin-btn');
    if (spinBtn) spinBtn.disabled = true;

    // تصفير الجولة السابقة وإخفاء زر قِف حتى تبدأ الجولة فعلياً
    this.isRoundActive = false;
    this.isPanicMode = false;
    this.stoppedBy = null;
    document.body.classList.remove('round-in-progress');
    const stopContainer = document.getElementById('stop-action-container');
    if (stopContainer) stopContainer.classList.remove('active');
    clearInterval(this.timerInterval);
    clearInterval(this.aiTypingInterval);

    // إعادة ضبط التلميحات السحرية ومعدّل الجولة الغامض
    this.hintsRemaining = 3;
    const hintBadge = document.getElementById('hint-count-badge');
    if (hintBadge) hintBadge.textContent = '3';
    const hintBtn = document.getElementById('btn-hint');
    if (hintBtn) hintBtn.disabled = false;
    this.rollMysteryModifier();

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
    if (this.activeModifier !== 'blitz_speed') {
      this.timeLeft = this.timerDuration;
    }
    document.body.classList.add('round-in-progress');

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

    const headerExitBtn = document.getElementById('header-exit-btn');
    if (headerExitBtn) headerExitBtn.style.display = 'inline-flex';

    const spinBtn = document.getElementById('spin-btn');
    if (spinBtn) spinBtn.disabled = true;

    this.startTimer();
    this.startAiSimulation();
    this.updateStatsDisplay();
  }

  exitGame(confirmPrompt = true) {
    if (confirmPrompt) {
      const isEn = (typeof i18n !== 'undefined' && i18n.currentLang === 'en');
      const msg = isEn
        ? (i18n.t('exit_confirm') || 'Are you sure you want to forfeit and exit to the main menu?')
        : (typeof i18n !== 'undefined' ? i18n.t('exit_confirm') : 'هل أنت متأكد من الانسحاب والخروج من اللعبة والعودة للرئيسية؟');
      if (!confirm(msg)) return;
    }

    // إيقاف جميع المؤقتات وحلقات المحاكاة
    clearInterval(this.timerInterval);
    clearInterval(this.aiTypingInterval);
    this.isRoundActive = false;
    this.isPanicMode = false;
    this.stoppedBy = null;
    this.currentLetter = null;
    this.currentVote = null;
    this.currentRound = 1;
    this.totalScore = 0;
    this.aiTotalScore = 0;
    this.playerAnswers = {};
    this.aiAnswers = {};
    this.aiObjections = [];

    // إزالة صنف الجولة الجارية
    document.body.classList.remove('round-in-progress');

    // إخفاء الحاويات العائمة وأزرار الخروج
    const stopContainer = document.getElementById('stop-action-container');
    if (stopContainer) stopContainer.classList.remove('active');

    const headerExitBtn = document.getElementById('header-exit-btn');
    if (headerExitBtn) headerExitBtn.style.display = 'none';

    this.closeResultsModal();
    this.closeVotingModal();

    // إعادة زر التدوير والشارة للوضع المبدئي
    const spinBtn = document.getElementById('spin-btn');
    if (spinBtn) spinBtn.disabled = false;

    const badge = document.getElementById('target-letter-badge');
    if (badge) badge.textContent = '؟';

    const letterNameEl = document.getElementById('target-letter-name');
    if (letterNameEl) {
      letterNameEl.textContent = (typeof i18n !== 'undefined') ? i18n.t('target_letter_ready') : 'جاهز للبدء؟';
    }

    // تفريغ وتعطيل حقول الإدخال
    const activeCats = this.getActiveCategories();
    activeCats.forEach(cat => {
      const input = document.getElementById(`input-${cat.id}`);
      const icon = document.getElementById(`status-icon-${cat.id}`);
      if (input) {
        input.value = '';
        input.disabled = true;
      }
      if (icon) icon.classList.remove('active');
    });

    // إعادة ضبط عداد الوقت
    const timerEl = document.getElementById('stat-timer');
    const unit = (typeof i18n !== 'undefined') ? i18n.t('seconds_unit') : 'ثانية';
    if (timerEl) timerEl.textContent = `${this.timerDuration} ${unit}`;

    // إعادة ضبط بطاقة الخصم الذكي
    const aiStatus = document.getElementById('ai-status');
    const aiFill = document.getElementById('ai-progress-fill');
    if (aiStatus) {
      aiStatus.textContent = (typeof i18n !== 'undefined') ? i18n.t('ai_waiting') : 'في انتظار بدء الجولة...';
    }
    if (aiFill) aiFill.style.width = '0%';

    const modifierBanner = document.getElementById('mystery-modifier-banner');
    if (modifierBanner) modifierBanner.style.display = 'none';

    const aiBubble = document.getElementById('ai-bubble');
    if (aiBubble) aiBubble.style.display = 'none';

    this.updateStatsDisplay();

    // إذا كان في غرفة أونلاين: مغادرة الغرفة
    if (typeof multiplayer !== 'undefined' && multiplayer.currentRoom) {
      multiplayer.leaveRoom();
    }
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

      const timerCard = document.querySelector('.timer-card');
      if (this.timeLeft <= 10) {
        if (timerVal) timerVal.classList.add('timer-critical');
        if (timerCard) timerCard.classList.add('panic');
        sounds.playHeartbeat();
      } else {
        if (timerVal) timerVal.classList.remove('timer-critical');
        if (timerCard) timerCard.classList.remove('panic');
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

    const isEn = (typeof i18n !== 'undefined' && i18n.currentLang === 'en');
    const startPhrases = isEn
      ? ['Ready for action! ⚡', 'Show me your speed! 🚀', 'Fun letter today! 🎲']
      : ['أنا جاهز ومتحمس! 🔥', 'وريني سرعتك اليوم! ⚡', 'حرف جميل وتحدي قوي! 🎲'];
    this.showAiBubble(startPhrases[Math.floor(Math.random() * startPhrases.length)]);

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

        if (filledSoFar === 2) {
          this.showAiBubble(isEn ? 'Got two categories! 🏃' : 'كتبت إجابتين بالتمام! 🏃');
        } else if (filledSoFar === 4) {
          this.showAiBubble(isEn ? 'Almost done! ⏳' : 'قربت أخلص وأضغط قِف! ⏳');
        }

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
    setTimeout(() => sounds.speakVoice('stop'), 120);
    this.stoppedBy = 'player';

    const isEn = (typeof i18n !== 'undefined' && i18n.currentLang === 'en');
    this.showAiBubble(isEn ? 'Whoa, you beat me to STOP! 🛑' : 'يا ساتر سبقتني بالزر! 🛑');

    if (this.timeLeft >= 35) {
      this.unlockAchievement('fast_stop');
    }

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
    setTimeout(() => sounds.speakVoice('stop'), 120);
    this.stoppedBy = 'ai';

    const isEn = (typeof i18n !== 'undefined' && i18n.currentLang === 'en');
    this.showAiBubble(isEn ? 'STOP! Finished first! 😎' : 'قف! خلصت قبلك 😎');

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
    document.body.classList.remove('round-in-progress');
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
    this.closeStreakModal();
    this.closeAchievementsModal();
    const settingsDrawer = document.getElementById('settings-drawer');
    if (settingsDrawer) settingsDrawer.classList.remove('open');
    if (typeof multiplayer !== 'undefined' && multiplayer.closeMultiplayerModal) multiplayer.closeMultiplayerModal();

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
            <div class="ai-objection-badge">⚠️ اعتراض: "${firstObj.word || ''}"</div>
            <p class="ai-objection-remark">${firstObj.remark}</p>
          </div>
          <button class="btn-objection-action" onclick="game.startObjection('${firstObj.catId}', 'player')">
            ⚖️ جلسة التحكيم والتصويت
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
    this.checkBodyModalState();

    // تشغيل المؤثر الصوتي للنتيجة الأولية
    const roundP = this.reviewResults.reduce((s, r) => s + (r.pPoints || 0), 0) + (this.stoppedBy === 'player' ? 5 : 0);
    const roundAi = this.reviewResults.reduce((s, r) => s + (r.aiPoints || 0), 0);

    if (this.gameMode === 'vs_ai') {
      if (roundP > roundAi) {
        sounds.playCelebratoryVictory();
        this.fireConfetti();
        setTimeout(() => sounds.speakVoice('win_first'), 500);
      } else if (roundP < roundAi) {
        sounds.playDefeat();
      } else {
        sounds.playCorrect();
      }
    } else {
      if (roundP >= 30) {
        sounds.playCelebratoryVictory();
        this.fireConfetti();
        setTimeout(() => sounds.speakVoice('win_first'), 500);
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
    const isEn = (typeof i18n !== 'undefined' && i18n.currentLang === 'en');

    // حساب مضاعفات ومكافآت الجولة الغامضة ونقاط الخبرة المستمرة
    let bonusText = '';
    let earnedXP = roundP;
    if (this.stoppedBy === 'player') earnedXP += 10;

    if (this.activeModifier === 'double_points') {
      roundP *= 2;
      earnedXP *= 2;
      bonusText = isEn ? ' (⚡ 2X Active!)' : ' (⚡ نقاط مضاعفة 2X!)';
    } else if (this.activeModifier === 'blitz_speed' && this.timeLeft > 0) {
      earnedXP += 15;
      bonusText = isEn ? ' (⏱️ Blitz Bonus +15 XP)' : ' (⏱️ بونص سرعة البرق +15 خبرة)';
    } else if (this.activeModifier === 'perfect_seven') {
      const filledAll = this.reviewResults.length >= 7 && this.reviewResults.every(r => r.playerWord && r.pPoints > 0);
      if (filledAll) {
        roundP += 20;
        earnedXP += 25;
        bonusText = isEn ? ' (🎯 Perfect 7 Bonus +20 pts)' : ' (🎯 بونص الكمال +20 نقطة)';
      }
    }

    // إضافة نقاط الخبرة للملف الدائم للاعب
    this.addXP(earnedXP);

    if (modalScore) {
      if (typeof i18n !== 'undefined') {
        modalScore.innerHTML = i18n.t('round_score_summary', { pScore: roundP, aiScore: roundAi }) +
          `<br><span style="font-size:0.95rem;color:#10b981;font-weight:700;">✨ +${earnedXP} XP خبرة${bonusText}</span>`;
      } else {
        modalScore.innerHTML = `مجموع نقاطك في هذه الجولة: <strong>${roundP}</strong> | نقاط الخصم: <strong>${roundAi}</strong>` +
          `<br><span style="font-size:0.95rem;color:#10b981;font-weight:700;">✨ +${earnedXP} XP خبرة${bonusText}</span>`;
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

    // فحص وتفعيل إنجازات الجولة والأوسمة التراكمية
    if (this.reviewResults.length >= 7 && this.reviewResults.every(r => r.pPoints === 10)) {
      this.unlockAchievement('perfect_70');
    }

    const validCount = this.reviewResults.filter(r => r.pPoints > 0).length;
    let totalWords = parseInt(localStorage.getItem('khalast_words_count') || '0', 10) + validCount;
    localStorage.setItem('khalast_words_count', totalWords);
    if (totalWords >= 25) {
      this.unlockAchievement('words_collector');
    }

    if (this.gameMode === 'vs_ai') {
      if (roundP > roundAi) {
        if (this.hintsRemaining === 3) {
          this.unlockAchievement('flawless_no_hint');
        }
        let winStreak = parseInt(localStorage.getItem('khalast_win_streak') || '0', 10) + 1;
        localStorage.setItem('khalast_win_streak', winStreak);
        if (winStreak >= 3) {
          this.unlockAchievement('undefeated_3');
        }
      } else if (roundP < roundAi) {
        localStorage.setItem('khalast_win_streak', '0');
      }
    }

    // حساب وعرض وسام اللقب الفخري (Dopamine Rank Card)
    const rankCard = document.getElementById('player-rank-card');
    const rankIcon = document.getElementById('rank-icon');
    const rankTitle = document.getElementById('rank-title');
    const rankDesc = document.getElementById('rank-desc');

    if (rankCard && rankIcon && rankTitle && rankDesc) {
      if (roundP >= 55) {
        rankIcon.textContent = '👑';
        rankTitle.textContent = isEn ? 'Master of Words' : 'سلطان الكلمات الأسطوري';
        rankDesc.textContent = isEn ? 'Flawless performance, lightning speed!' : 'أداء بطولي استثنائي وسرعة بديهة خيالية!';
      } else if (roundP >= 40) {
        rankIcon.textContent = '⚡';
        rankTitle.textContent = isEn ? 'Letter Falcon' : 'صقر الحروف الذهبي';
        rankDesc.textContent = isEn ? 'Brilliant answers and sharp reflexes!' : 'سرعة بديهة مذهلة وكلمات فصيحة قوية!';
      } else if (roundP >= 20) {
        rankIcon.textContent = '🎯';
        rankTitle.textContent = isEn ? 'Word Knight' : 'فارس التحدي الذكي';
        rankDesc.textContent = isEn ? 'Great score, solid competitive spirit!' : 'إجابات ذكية ومنافسة شرسة تستحق التقدير!';
      } else {
        rankIcon.textContent = '🌟';
        rankTitle.textContent = isEn ? 'Rising Star' : 'نجم واعد في الميدان';
        rankDesc.textContent = isEn ? 'Good effort! Next round will be yours!' : 'محاولة جيدة، والجولة القادمة ستكون لك!';
      }
    }
  }

  shareChallenge() {
    let roundP = this.reviewResults.reduce((s, r) => s + (r.pPoints || 0), 0);
    if (this.stoppedBy === 'player') roundP += 5;
    const letter = this.currentLetter || '؟';
    const isEn = (typeof i18n !== 'undefined' && i18n.currentLang === 'en');
    const url = window.location.href.split('#')[0];

    const shareTitle = isEn ? 'Word Challenge Game' : 'تحدي لعبة الحروف والكلمات';
    const shareText = isEn
      ? `🔥 Can you beat my score? I just scored ${roundP} points on letter (${letter}) in Words Game! Play now: ${url}`
      : `🔥 هل تقدر تفوز علي؟ حققت ${roundP} نقطة في لعبة الحروف والكلمات بحرف (${letter})! ادخل وتحداهم الآن: ${url}`;

    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        text: shareText,
        url: url
      }).catch(() => {});
    } else {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(() => {
          this.showToast(isEn ? 'Challenge link copied! Share with friends 🚀' : 'تم نسخ نص ورابط التحدي! شاركه الآن مع أصحابك 🚀');
        });
      } else {
        this.showToast(isEn ? 'Share with your friends: ' + url : 'شارك الرابط مع أصدقائك: ' + url);
      }
    }
  }

  showToast(message) {
    let toast = document.getElementById('game-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'game-toast';
      toast.className = 'game-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  getLevelConfig(level) {
    const isEn = (typeof i18n !== 'undefined' && i18n.currentLang === 'en');
    const ranks = [
      { lvl: 1, maxXP: 150, titleAr: 'مبتدئ الحروف 🌟', titleEn: 'Word Novice 🌟' },
      { lvl: 2, maxXP: 380, titleAr: 'هاوي الفصاحة 🎯', titleEn: 'Word Explorer 🎯' },
      { lvl: 3, maxXP: 750, titleAr: 'فارس الكلمات ⚔️', titleEn: 'Word Knight ⚔️' },
      { lvl: 4, maxXP: 1350, titleAr: 'صقر الحروف الذهبي 🦅', titleEn: 'Letter Falcon 🦅' },
      { lvl: 5, maxXP: 2200, titleAr: 'أستاذ المعاجم 🎓', titleEn: 'Dictionary Master 🎓' },
      { lvl: 6, maxXP: 3500, titleAr: 'سلطان الحروف الأسطوري 👑', titleEn: 'Grand Word Emperor 👑' },
      { lvl: 7, maxXP: 5500, titleAr: 'حاكم لغة الضاد الخالد 🏆', titleEn: 'Immortal Word Legend 🏆' }
    ];
    return ranks.find(r => r.lvl === level) || ranks[ranks.length - 1];
  }

  updatePlayerProfileUI() {
    const levelBadge = document.getElementById('profile-level-badge');
    const rankName = document.getElementById('profile-rank-name');
    const xpCounter = document.getElementById('profile-xp-counter');
    const xpFill = document.getElementById('profile-xp-fill');

    const isEn = (typeof i18n !== 'undefined' && i18n.currentLang === 'en');
    const cfg = this.getLevelConfig(this.playerLevel);
    const rankTitle = isEn ? cfg.titleEn : cfg.titleAr;

    let prevMax = 0;
    if (this.playerLevel > 1) {
      const prevCfg = this.getLevelConfig(this.playerLevel - 1);
      prevMax = prevCfg.maxXP;
    }
    const xpInBracket = Math.max(0, this.playerXP - prevMax);
    const bracketSize = Math.max(1, cfg.maxXP - prevMax);
    const pct = Math.min(100, Math.floor((xpInBracket / bracketSize) * 100));

    if (levelBadge) levelBadge.textContent = `Lv. ${this.playerLevel}`;
    if (rankName) rankName.textContent = rankTitle;
    if (xpCounter) xpCounter.textContent = `${this.playerXP} / ${cfg.maxXP} XP`;
    if (xpFill) xpFill.style.width = `${pct}%`;
  }

  addXP(amount) {
    if (amount <= 0) return;
    const oldLevel = this.playerLevel;
    this.playerXP += amount;

    while (this.playerLevel < 7) {
      const currentCfg = this.getLevelConfig(this.playerLevel);
      if (this.playerXP >= currentCfg.maxXP) {
        this.playerLevel++;
      } else {
        break;
      }
    }

    try {
      localStorage.setItem('khalast_xp', this.playerXP);
      localStorage.setItem('khalast_level', this.playerLevel);
    } catch (e) {}

    this.updatePlayerProfileUI();

    if (this.playerLevel > oldLevel) {
      const newCfg = this.getLevelConfig(this.playerLevel);
      const isEn = (typeof i18n !== 'undefined' && i18n.currentLang === 'en');
      const rankTitle = isEn ? newCfg.titleEn : newCfg.titleAr;
      const toastMsg = (typeof i18n !== 'undefined')
        ? i18n.t('level_up_toast', { level: this.playerLevel, rank: rankTitle })
        : `🎉 كفو! ترقيت إلى المستوى ${this.playerLevel}: ${rankTitle}! 🏆`;

      sounds.playCelebratoryVictory();
      this.fireConfetti();
      this.showToast(toastMsg);
    }
  }

  useMagicHint() {
    if (!this.isRoundActive) return;
    const isEn = (typeof i18n !== 'undefined' && i18n.currentLang === 'en');

    if (this.hintsRemaining <= 0) {
      this.showToast(isEn ? 'No hints left in this round!' : 'لا توجد تلميحات متبقية في هذه الجولة!');
      return;
    }

    const activeCats = this.getActiveCategories();
    // ابحث عن أول حقل فارغ
    let targetCat = activeCats.find(cat => {
      const input = document.getElementById(`input-${cat.id}`);
      return !input || !input.value.trim();
    });

    if (!targetCat) targetCat = activeCats[0];
    if (!targetCat) return;

    const input = document.getElementById(`input-${targetCat.id}`);
    if (!input) return;

    let candidateWord = '';
    if (isEn && typeof ENGLISH_DICTIONARY !== 'undefined') {
      const list = ENGLISH_DICTIONARY[this.currentLetter]?.[targetCat.id];
      if (list && list.length > 0) candidateWord = list[Math.floor(Math.random() * list.length)];
    } else if (typeof ARABIC_DICTIONARY !== 'undefined') {
      const list = ARABIC_DICTIONARY[this.currentLetter]?.[targetCat.id];
      if (list && list.length > 0) candidateWord = list[Math.floor(Math.random() * list.length)];
    }

    this.hintsRemaining--;
    const hintBadge = document.getElementById('hint-count-badge');
    if (hintBadge) hintBadge.textContent = this.hintsRemaining;

    const hintBtn = document.getElementById('btn-hint');
    if (hintBtn && this.hintsRemaining <= 0) {
      hintBtn.disabled = true;
    }

    sounds.playMagicSparkle();

    if (candidateWord) {
      const prefix = candidateWord.substring(0, 2);
      input.placeholder = `💡 تلميح: يبدأ بـ (${prefix}...)`;
      input.classList.add('hint-pulse');
      setTimeout(() => input.classList.remove('hint-pulse'), 1500);
      input.focus();

      const catLabel = (typeof i18n !== 'undefined') ? i18n.t(`cat_${targetCat.id}`) : targetCat.label;
      const toastMsg = (typeof i18n !== 'undefined')
        ? i18n.t('hint_toast', { cat: catLabel, prefix: prefix })
        : `💡 تلميح لتصنيف (${catLabel}): كلمة تبدأ بـ (${prefix}...)`;
      this.showToast(toastMsg);
    } else {
      this.showToast(isEn ? 'Try thinking of a creative word!' : '💡 فكّر بكلمة تبدأ بالحرف!');
    }
  }

  showAiBubble(text) {
    const bubble = document.getElementById('ai-bubble');
    if (!bubble || this.gameMode !== 'vs_ai') return;
    bubble.textContent = text;
    bubble.style.display = 'block';
    clearTimeout(this.aiBubbleTimeout);
    this.aiBubbleTimeout = setTimeout(() => {
      bubble.style.display = 'none';
    }, 2800);
  }

  rollMysteryModifier() {
    const banner = document.getElementById('mystery-modifier-banner');
    const isEn = (typeof i18n !== 'undefined' && i18n.currentLang === 'en');

    // فرصة 45% لظهور معدّل جولة مفاجئ لكسر الرتابة والملل
    if (Math.random() < 0.45) {
      const rand = Math.random();
      if (rand < 0.4) {
        this.activeModifier = 'double_points';
        if (banner) {
          banner.style.display = 'flex';
          banner.innerHTML = isEn
            ? '⚡ <strong>Double Points (2X)!</strong> All round points doubled!'
            : '⚡ <strong>جولة مضاعفة النقاط (2X)!</strong> جميع نقاط الجولة تحتسب مرتين!';
        }
      } else if (rand < 0.75) {
        this.activeModifier = 'blitz_speed';
        this.timeLeft = 35; // جولة برق سريعة
        if (banner) {
          banner.style.display = 'flex';
          banner.innerHTML = isEn
            ? '⏱️ <strong>Speed Blitz (35s)!</strong> Fast pace with +15 bonus XP!'
            : '⏱️ <strong>تحدي البرق (35 ثانية)!</strong> سرعة فائقة و +15 نقطة خبرة بونص!';
        }
      } else {
        this.activeModifier = 'perfect_seven';
        if (banner) {
          banner.style.display = 'flex';
          banner.innerHTML = isEn
            ? '🎯 <strong>Perfect 7 Challenge!</strong> +20 bonus XP if you fill all 7 categories!'
            : '🎯 <strong>تحدي الكمال!</strong> +20 نقطة بونص إذا جاوبت على الـ 7 تصنيفات كاملة!';
        }
      }
    } else {
      this.activeModifier = null;
      if (banner) banner.style.display = 'none';
    }
  }

  getAchievementsConfig() {
    const isEn = (typeof i18n !== 'undefined' && i18n.currentLang === 'en');
    return [
      {
        id: 'fast_stop',
        icon: '⚡',
        titleAr: 'البرق الخاطف',
        titleEn: 'Lightning Fast',
        descAr: 'أنهِ الجولة واضغط (قِف! خَلّصت) في أول 25 ثانية من الوقت!',
        descEn: 'Finish round and call STOP within the first 25 seconds!'
      },
      {
        id: 'perfect_70',
        icon: '🎯',
        titleAr: 'العلامة الكاملة',
        titleEn: 'Flawless 70',
        descAr: 'اجمع 70 نقطة كاملة (10 نقاط في جميع التصنيفات الـ 7)!',
        descEn: 'Score 70 points (10 points in all 7 categories) in one round!'
      },
      {
        id: 'words_collector',
        icon: '📚',
        titleAr: 'قاموس الفصحى',
        titleEn: 'Word Lexicon',
        descAr: 'اكتب واجمع 25 كلمة عربية صحيحة ومعتمدة في رصيدك.',
        descEn: 'Successfully submit 25 valid dictionary words in total.'
      },
      {
        id: 'streak_3',
        icon: '🔥',
        titleAr: 'شعلة الاستمرار',
        titleEn: 'Flame Champion',
        descAr: 'العب اللعبة وحافظ على سلسلتك اليومية لمدة 3 أيام متتالية!',
        descEn: 'Maintain your daily playing streak for 3 consecutive days!'
      },
      {
        id: 'flawless_no_hint',
        icon: '💡',
        titleAr: 'العقل اللامع',
        titleEn: 'Mastermind',
        descAr: 'تفوّق على الخصم الذكي في جولة دون استخدام أي تلميح سحري!',
        descEn: 'Defeat AI in a round without using any magic hints!'
      },
      {
        id: 'undefeated_3',
        icon: '👑',
        titleAr: 'صائد الانتصارات',
        titleEn: 'Victory Streak',
        descAr: 'حقّق 3 انتصارات متتالية ضد الخصم الذكي دون أي هزيمة!',
        descEn: 'Win 3 rounds in a row against the AI without defeat!'
      },
      {
        id: 'social_butterfly',
        icon: '👥',
        titleAr: 'روح الجماعة',
        titleEn: 'Social Hero',
        descAr: 'شارك أو استضف جولة في غرف الأصدقاء أونلاين حتى 8 لاعبين.',
        descEn: 'Play an online multiplayer room with your friends.'
      }
    ];
  }

  renderAchievementsList() {
    const grid = document.getElementById('achievements-grid');
    const badgeCount = document.getElementById('achievements-count-badge');
    const config = this.getAchievementsConfig();
    const isEn = (typeof i18n !== 'undefined' && i18n.currentLang === 'en');

    if (badgeCount) {
      badgeCount.textContent = `${this.unlockedAchievements.length}/${config.length}`;
    }

    if (!grid) return;
    grid.innerHTML = '';

    config.forEach(ach => {
      const isUnlocked = this.unlockedAchievements.includes(ach.id);
      const card = document.createElement('div');
      card.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;

      const title = isEn ? ach.titleEn : ach.titleAr;
      const desc = isEn ? ach.descEn : ach.descAr;
      const statusText = isUnlocked
        ? (isEn ? 'Unlocked 🏆' : 'مكتمل 🏆')
        : (isEn ? 'Locked 🔒' : 'قيد التقدم 🔒');

      card.innerHTML = `
        <div class="achievement-icon">${ach.icon}</div>
        <div class="achievement-info">
          <div class="achievement-title">${title}</div>
          <div class="achievement-desc">${desc}</div>
        </div>
        <div class="achievement-status-badge ${isUnlocked ? 'unlocked' : 'locked'}">
          ${statusText}
        </div>
      `;
      grid.appendChild(card);
    });
  }

  unlockAchievement(id) {
    if (this.unlockedAchievements.includes(id)) return;
    this.unlockedAchievements.push(id);
    try {
      localStorage.setItem('khalast_achievements', JSON.stringify(this.unlockedAchievements));
    } catch (e) {}

    const config = this.getAchievementsConfig();
    const ach = config.find(a => a.id === id);
    if (!ach) return;

    const isEn = (typeof i18n !== 'undefined' && i18n.currentLang === 'en');
    const title = isEn ? ach.titleEn : ach.titleAr;

    this.addXP(100);
    sounds.playCelebratoryVictory();
    this.fireConfetti();
    this.renderAchievementsList();

    const toastMsg = isEn
      ? `🏅 Achievement Unlocked: ${title} (+100 XP)!`
      : `🏅 إنجاز جديد مفتوح: ${title} (+100 XP)!`;
    this.showToast(toastMsg);
  }

  initDailyStreak() {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = localStorage.getItem('khalast_last_played_date');
    let streak = parseInt(localStorage.getItem('khalast_daily_streak') || '1', 10);

    if (lastDate) {
      const last = new Date(lastDate);
      const curr = new Date(today);
      const diffDays = Math.round((curr - last) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak++;
        localStorage.setItem('khalast_daily_streak', streak);
        localStorage.setItem('khalast_last_played_date', today);
        this.addXP(50);
        setTimeout(() => {
          this.showToast(`🔥 حافظت على شعلتك اليومية! مكافأة اليوم: +50 XP!`);
        }, 1200);
      } else if (diffDays > 1) {
        streak = 1;
        localStorage.setItem('khalast_daily_streak', streak);
        localStorage.setItem('khalast_last_played_date', today);
      }
    } else {
      localStorage.setItem('khalast_last_played_date', today);
      localStorage.setItem('khalast_daily_streak', streak);
    }

    this.dailyStreak = streak;
    const streakBadge = document.getElementById('streak-count-badge');
    if (streakBadge) streakBadge.textContent = streak;

    if (streak >= 3) {
      this.unlockAchievement('streak_3');
    }
  }

  openStreakModal() {
    this.closeAchievementsModal();
    const settingsDrawer = document.getElementById('settings-drawer');
    if (settingsDrawer) settingsDrawer.classList.remove('open');
    if (typeof multiplayer !== 'undefined' && multiplayer.closeMultiplayerModal) multiplayer.closeMultiplayerModal();

    const modal = document.getElementById('streak-modal');
    if (!modal) return;
    const daysEl = document.getElementById('modal-streak-days');
    const trackEl = document.getElementById('streak-week-track');

    if (daysEl) daysEl.textContent = `${this.dailyStreak} ${this.dailyStreak === 1 ? 'يوم' : 'أيام'}`;

    if (trackEl) {
      trackEl.innerHTML = '';
      const daysOfWeek = ['سبت', 'أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة'];
      const todayDayIdx = new Date().getDay(); // 0 is Sun, 6 is Sat

      daysOfWeek.forEach((dayName, idx) => {
        const cell = document.createElement('div');
        const isActive = idx <= (todayDayIdx === 6 ? 0 : todayDayIdx + 1);
        cell.className = `streak-day-cell ${isActive ? 'active' : ''}`;
        cell.innerHTML = `
          <div class="streak-day-icon">${isActive ? '🔥' : '⚪'}</div>
          <div class="streak-day-name">${dayName}</div>
        `;
        trackEl.appendChild(cell);
      });
    }

    modal.classList.add('active');
    this.checkBodyModalState();
  }

  closeStreakModal() {
    const modal = document.getElementById('streak-modal');
    if (modal) modal.classList.remove('active');
    this.checkBodyModalState();
  }

  openAchievementsModal() {
    this.closeStreakModal();
    const settingsDrawer = document.getElementById('settings-drawer');
    if (settingsDrawer) settingsDrawer.classList.remove('open');
    if (typeof multiplayer !== 'undefined' && multiplayer.closeMultiplayerModal) multiplayer.closeMultiplayerModal();

    this.renderAchievementsList();
    const modal = document.getElementById('achievements-modal');
    if (modal) modal.classList.add('active');
    this.checkBodyModalState();
  }

  closeAchievementsModal() {
    const modal = document.getElementById('achievements-modal');
    if (modal) modal.classList.remove('active');
    this.checkBodyModalState();
  }

  shareWhatsApp() {
    let roundP = this.reviewResults.reduce((s, r) => s + (r.pPoints || 0), 0);
    if (this.stoppedBy === 'player') roundP += 5;
    const letter = this.currentLetter || '؟';
    const isEn = (typeof i18n !== 'undefined' && i18n.currentLang === 'en');
    const url = window.location.href.split('#')[0];

    const text = isEn
      ? `🔥 Word Challenge! Can you beat my score of ${roundP} points on letter (${letter})?\nPlay with me now: ${url}`
      : `🔥 تحدي الحروف والكلمات!\nهل تقدر تفوز علي؟ حققت ${roundP} نقطة بحرف (${letter})!\nادخل والعب معي الآن: ${url}`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
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
    this.checkBodyModalState();

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
      sounds.speakVoice('made_up');
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
    const activeCats = this.getActiveCategories();
    const catObj = activeCats.find(c => c.id === catId);
    const catLabel = catObj ? catObj.label : catId;
    const isEn = (typeof i18n !== 'undefined' && i18n.currentLang === 'en');

    // 1. الحكم المعجمي (أستاذ اللغة) - فحص معجمي صارم وحقيقي
    let j1Vote = 'accepted';
    let j1Comment = '';
    if (!word || word.trim().length === 0) {
      j1Vote = 'rejected';
      j1Comment = isEn ? 'The field is empty! ❌' : 'الحقل فارغ تماماً! ❌';
    } else if (!val.valid && val.reason && (val.reason.includes('لا تبدأ') || val.reason.includes('does not start'))) {
      j1Vote = 'rejected';
      j1Comment = isEn ? `Word does not start with (${letter})! ❌` : `الكلمة لا تبدأ بالحرف المطلوب (${letter})! ❌`;
    } else if (val.valid && val.exactMatch) {
      j1Vote = 'accepted';
      j1Comment = isEn ? `Verified in authoritative dictionaries as (${catLabel})! ✅` : `اللفظ فصيح ومثبت في المعاجم العربية المعتمدة كـ(${catLabel}) ✅`;
    } else {
      j1Vote = 'rejected';
      j1Comment = isEn ? `Not recorded in authoritative dictionaries as (${catLabel})! ❌` : `بحثت في المعاجم العربية ولم أجد هذا اللفظ كـ(${catLabel}) ❌`;
    }

    // 2. الخصم المنافس - الروح التنافسية والشك
    let j2Vote = 'rejected';
    let j2Comment = '';
    if (target === 'ai') {
      // الخصم يدافع عن إجابته
      j2Vote = 'accepted';
      j2Comment = isEn ? 'My answer is standard and strictly accurate! ✅' : 'إجابتي دقيقة وصحيحة ومن صلب المعجم! ✅';
    } else {
      // الخصم يقيّم كلمة اللاعب
      if (val.valid && val.exactMatch) {
        j2Vote = 'accepted';
        j2Comment = isEn ? 'Fair enough, the word is well-known and correct ✅' : 'الكلمة معروفة وصحيحة، أعترف بها بروح رياضية ✅';
      } else {
        j2Vote = 'rejected';
        j2Comment = isEn ? 'I strongly object! That word sounds completely made-up! ❌' : 'أعترض بشدة! الكلمة غير مقنعة ومؤلفة من الرأس لكسب النقاط! ❌';
      }
    }

    // 3. الحكم المحايد - صوت العقل والميزان والترجيح المنطقي بين أستاذ اللغة والمنافس
    let j3Vote = 'accepted';
    let j3Comment = '';

    if (j1Vote === 'accepted' && j2Vote === 'accepted') {
      // إجماع على القبول
      j3Vote = 'accepted';
      j3Comment = isEn ? 'Unanimous consent: The word is verified and indisputable ✅' : 'إجماع الحكام: اللفظ فصيح ومعروف ولا وجه للشك فيه ✅';
    } else if (j1Vote === 'rejected' && j2Vote === 'rejected') {
      // إجماع على الرفض
      j3Vote = 'rejected';
      j3Comment = isEn ? 'Unanimous rejection: Lacks dictionary basis and fails review ❌' : 'إجماع الحكام: الكلمة تفتقر للسند المعجمي ومرفوضة بالإجماع ❌';
    } else if (j1Vote === 'accepted' && j2Vote === 'rejected') {
      // أستاذ اللغة أثبتها معجمياً واعتراض الخصم كيدي/تنافسي
      j3Vote = 'accepted';
      j3Comment = isEn ? 'Language Professor verified standard dictionary proof; opponent objection is dismissed ✅' : 'أستاذ اللغة أثبت صحة اللفظ معجمياً، واعتراض الخصم كيدي.. أقبل الكلمة ✅';
    } else {
      // أستاذ اللغة رفض لعدم ثبوتها في المعجم
      j3Vote = 'rejected';
      j3Comment = isEn ? 'Linguistic accuracy is paramount; lacking dictionary evidence, I uphold the rejection ❌' : 'المعجم هو الفيصل الأساسي؛ وما دام أستاذ اللغة لم يثبتها، أرفضها ❌';
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
        setTimeout(() => {
          sounds.playWrong();
          sounds.speakVoice('made_up');
        }, 250);
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
            <div class="ai-objection-badge">⚠️ اعتراض إضافي: "${nextObj.word || ''}"</div>
            <p class="ai-objection-remark">${nextObj.remark}</p>
          </div>
          <button class="btn-objection-action" onclick="game.startObjection('${nextObj.catId}', 'player')">
            ⚖️ جلسة التحكيم والتصويت
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
    this.checkBodyModalState();
  }

  closeResultsModal() {
    const modal = document.getElementById('results-modal');
    if (modal) modal.classList.remove('active');
    this.checkBodyModalState();
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

  checkBodyModalState() {
    const anyModal = document.querySelector('.modal-backdrop.active, .settings-drawer.open');
    if (anyModal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }

  fireConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;

    if (this._confettiAnimId) {
      cancelAnimationFrame(this._confettiAnimId);
      this._confettiAnimId = null;
    }

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const isMobile = window.innerWidth <= 768;
    const count = isMobile ? 55 : 85;
    const particles = [];
    const colors = ['#f59e0b', '#ec4899', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444'];
    const w = canvas.width;
    const h = canvas.height;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: w / 2,
        y: h / 2,
        vx: (Math.random() - 0.5) * (isMobile ? 12 : 16),
        vy: (Math.random() - 1.2) * (isMobile ? 12 : 15),
        size: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 8,
        life: 1
      });
    }

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.32; // gravity
        p.rotation += p.rSpeed;
        p.life -= 0.018;

        if (p.life <= 0) continue;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }

      frame++;
      if (frame < 65) {
        this._confettiAnimId = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, w, h);
        this._confettiAnimId = null;
      }
    };
    this._confettiAnimId = requestAnimationFrame(animate);
  }
}

let game = null;
window.addEventListener('DOMContentLoaded', () => {
  game = new EnsanHayawanGame();
  game.init();
});
