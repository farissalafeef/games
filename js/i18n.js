/**
 * نظام التدويل واللغات (عربي / English)
 * يدعم التبديل اللحظي بين العربية والإنجليزية مع تعديل اتجاه الواجهة (RTL / LTR)
 */

const TRANSLATIONS = {
  ar: {
    app_title: 'إنسان حيوان نبات جماد بلاد',
    app_subtitle: 'التحدي العربي الكلاسيكي بأسلوب حديث وتفاعلي',
    lang_btn: '🌐 English',
    mp_btn: '👥 غرف الأصدقاء (حتى 8)',
    sound_on: '🔊 الصوت: مفعل',
    sound_off: '🔇 الصوت: مغلق',
    settings_btn: '⚙️ الإعدادات',
    stat_round: 'الجولة الحالية',
    stat_your_score: 'نقاطك',
    stat_ai_score: 'نقاط الخصم',
    stat_timer: 'الوقت المتبقي',
    seconds_unit: 'ثانية',
    target_letter_ready: 'جاهز للبدء؟',
    target_letter_desc: 'اضغط الزر لتدوير عجلة الحروف وبدء التحدي',
    target_letter_name: 'حرف',
    spin_btn: '🎲 تدوير العجلة وبدء الجولة',
    ai_title: 'الخصم الذكي (كمبيوتر)',
    ai_waiting: 'في انتظار بدء الجولة...',
    ai_thinking: 'الخصم يفكر...',
    ai_typing: 'الخصم يكتب في: {cat}...',
    ai_finished: 'الخصم جاهز وقال قِف! خَلّصت!',
    stop_btn: '🛑 قِف! خَلّصت',
    stop_btn_pressed: '⚡ أعلنت النهاية (خَلّصت)! جاري التحقق...',
    stop_btn_opponent: '⚠️ الخصم قال قِف! خَلّصت.. تبقت 10 ثوانٍ!',
    first_stop_bonus: 'أحسنت! أعلنت (قِف! خَلّصت) أولاً وحصلت على +5 نقاط إضافية للسرعة!',
    time_up: 'انتهى الوقت المحدد للجولة!',
    
    // التصنيفات
    cat_human: 'إنسان (اسم شخص)',
    cat_human_ph: 'مثال: أحمد، سارة...',
    cat_animal: 'حيوان',
    cat_animal_ph: 'مثال: أسد، بطة...',
    cat_plant: 'نبات (خضار/فواكه)',
    cat_plant_ph: 'مثال: أناناس، بطيخ...',
    cat_object: 'جماد',
    cat_object_ph: 'مثال: إبرة، باب...',
    cat_country: 'بلاد (دولة / عاصمة)',
    cat_country_ph: 'مثال: ألمانيا، بيروت...',
    cat_job: 'مهنة (وظيفة)',
    cat_job_ph: 'مثال: أستاذ، بناء...',
    cat_food: 'أكلة (طعام / طبق)',
    cat_food_ph: 'مثال: أرز، بيتزا...',

    // نافذة النتائج
    results_title: '🏁 نتائج الجولة',
    th_category: 'التصنيف',
    th_your_answer: 'إجابتك',
    th_ai_answer: 'إجابة الخصم',
    th_points: 'النقاط',
    empty_word: '(فارغ)',
    points_unit: 'نقطة',
    edit_btn: 'تعديل ✍️',
    challenge_btn: '✋ اعتراض وتصويت',
    next_round_btn: '⚡ الجولة التالية ➡️',
    exit_game_btn: '🚪 خروج للرئيسية',
    share_btn: '📢 شارك نتيجتك وتحداهم!',
    whatsapp_btn: '💬 واتساب',
    btn_forfeit: '🏳️ انسحاب',
    btn_hint: '💡 تلميح',
    hint_toast: '💡 تلميح لتصنيف ({cat}): كلمة تبدأ بـ ({prefix}...)',
    hint_empty: 'لا توجد تلميحات متبقية في هذه الجولة!',
    mod_double: '⚡ جولة مضاعفة النقاط (2X)! جميع النقاط تحتسب مرتين',
    mod_blitz: '⏱️ تحدي البرق (35 ثانية)! سرعة فائقة و +15 نقطة إضافية',
    mod_perfect: '🎯 تحدي الكمال! بونص +20 نقطة إذا أجبت على الـ 7 كلها',
    level_up_toast: '🎉 كفو! ترقيت إلى المستوى {level}: {rank}! 🏆',
    exit_confirm: 'هل أنت متأكد من الخروج من اللعبة والعودة للقائمة الرئيسية؟',
    stamp_rejected: '❌ مرفوضة بالتصويت (من الكيس)',
    stamp_accepted: '✅ مقبولة بالتصويت',
    ai_objecting_tag: '⚠️ الخصم يعترض! (يشك أنها من الكيس) ✋',
    ai_objecting_title: '⚠️ الخصم الذكي يعترض على إجابتك!',
    go_vote_btn: '⚖️ فتح جلسة التصويت فوراً',
    win_banner: '🏆 مبروك! فزت في هذه الجولة وتفوقت على الخصم! 🎉',
    loss_banner: '😢 للأسف! تفوق عليك الخصم الذكي في هذه الجولة',
    tie_banner: '🤝 تعادل متكافئ بينك وبين الخصم!',
    round_score_summary: 'مجموع نقاطك في هذه الجولة: <strong>{pScore}</strong> | نقاط الخصم: <strong>{aiScore}</strong>',

    // نافذة التحكيم والتصويت
    court_title: '⚖️ محكمة اللعبة: جلسة اعتراض وتصويت',
    court_subtitle: 'اعترض اللاعبون على الكلمة.. صوتوا الآن لحسم أمرها بالأغلبية!',
    vote_human_title: '👥 تصويت الجلسة واللاعبين الحاضرين',
    vote_accept_btn: '👍 مقبولة وصحيحة',
    vote_reject_btn: '👎 اعتراض! (من الكيس)',
    vote_resolve_btn: '⚖️ حسم القرار بأغلبية الحاضرين',
    vote_jury_title: '🤖 هيئة التحكيم الذكية (3 قضاة)',
    vote_jury_btn: '⚡ تصويت الحكام التلقائي',
    jury_waiting: 'في انتظار المراجعة...',
    jury_1_name: 'أستاذ اللغة (المعجمي)',
    jury_2_name: 'الخصم المنافس',
    jury_3_name: 'الحكم المحايد',
    close_btn: 'إلغاء وإغلاق',
    apply_verdict_btn: '✅ اعتماد النتيجة وتحديث النقاط',

    // نافذة اللعب الجماعي
    mp_modal_title: '👥 اللعب مع الأصدقاء أونلاين',
    mp_modal_subtitle: 'أنشئ غرفة وشارك الرابط أو الرمز مع أصدقائك (الحد الأقصى 8 لاعبين)',
    mp_name_label: 'اسمك أو لقبك في اللعبة',
    mp_name_ph: 'اكتب اسمك هنا...',
    mp_avatar_label: 'اختر شخصيتك (الأفاتار)',
    mp_new_room_title: 'غرفة جديدة',
    mp_new_room_desc: 'أنشئ غرفة وتولَّ قيادة الجولة كمستضيف (Host)',
    mp_create_btn: '✨ إنشاء غرفة',
    mp_join_room_title: 'الانضمام لغرفة',
    mp_code_ph: 'رمز الغرفة (مثال: K7B2)',
    mp_join_btn: '🚀 انضمام بالكود',
    mp_invite_label: 'رمز دعوة الغرفة الخاص بكم:',
    mp_copy_btn: '📋 نسخ رابط الدعوة للأصدقاء',
    mp_copy_success: '✅ تم نسخ الرابط!',
    mp_share_hint: 'أرسل الرابط لأصدقائك للانضمام فوراً بضغطة واحدة!',
    mp_seats_label: '👥 مقاعد اللاعبين في الغرفة:',
    mp_start_game_btn: '🚀 بدء اللعبة للجميع الآن!',
    mp_empty_slot: 'مكان شاغر',
    host_badge: '👑 مستضيف',
    me_badge: '(أنت)',

    // الإعدادات
    settings_title: '⚙️ إعدادات اللعبة',
    sound_test_label: '🔊 اختبار المؤثرات الصوتية',
    test_victory_btn: '🎺 تجربة صوت الفوز والاحتفال 🎉',
    test_defeat_btn: '🎺 تجربة صوت الخسارة (الترمبون الحزين) 😢',
    mode_label: 'نمط اللعب',
    mode_vs_ai: 'ضد الخصم الذكي (AI)',
    mode_solo: 'تحدي الوقت الفردي (Time Attack)',
    mode_free: 'لعب حر بدون منافس',
    diff_label: 'مستوى ذكاء الخصم',
    diff_easy: 'سهل (مبتدئ)',
    diff_medium: 'متوسط (عادي)',
    diff_hard: 'خبير (سريع ودقيق)',
    timer_label: 'مدة المؤقت لكل جولة',
    timer_30: 'نصف دقيقة (30 ثانية)',
    timer_60: 'دقيقة واحدة (60 ثانية)',
    timer_90: 'دقيقة ونصف (90 ثانية)',
    timer_120: 'دقيقتين (120 ثانية - الافتراضي)',
    timer_inf: 'بدون مؤقت (غير محدود)'
  },

  en: {
    app_title: 'Categories: Word Battle',
    app_subtitle: 'The Classic Word Game with Real-time Multiplayer & Smart AI',
    lang_btn: '🌐 العربية',
    mp_btn: '👥 Friends Rooms (Up to 8)',
    sound_on: '🔊 Sound: ON',
    sound_off: '🔇 Sound: OFF',
    settings_btn: '⚙️ Settings',
    stat_round: 'Round',
    stat_your_score: 'Your Score',
    stat_ai_score: 'Opponent Score',
    stat_timer: 'Time Left',
    seconds_unit: 's',
    target_letter_ready: 'Ready to Play?',
    target_letter_desc: 'Spin the wheel to select a letter and start the round',
    target_letter_name: 'Letter',
    spin_btn: '🎲 Spin Wheel & Start Round',
    ai_title: 'Smart AI Opponent',
    ai_waiting: 'Waiting for round to start...',
    ai_thinking: 'Opponent is thinking...',
    ai_typing: 'Opponent is typing: {cat}...',
    ai_finished: 'Opponent is done and yelled STOP!',
    stop_btn: '🛑 STOP! I\'M DONE',
    stop_btn_pressed: '⚡ Declared STOP! Verifying answers...',
    stop_btn_opponent: '⚠️ Opponent yelled STOP! 10s panic time left!',
    first_stop_bonus: 'Awesome! You called STOP first and earned +5 speed bonus points!',
    time_up: 'Time is up for this round!',

    // Categories
    cat_human: 'Person (Name)',
    cat_human_ph: 'e.g. Alex, Sarah, David...',
    cat_animal: 'Animal',
    cat_animal_ph: 'e.g. Lion, Tiger, Eagle...',
    cat_plant: 'Plant (Fruit / Veg)',
    cat_plant_ph: 'e.g. Apple, Banana, Rose...',
    cat_object: 'Inanimate Object',
    cat_object_ph: 'e.g. Airplane, Book, Chair...',
    cat_country: 'Country / City',
    cat_country_ph: 'e.g. Canada, London, France...',
    cat_job: 'Profession / Job',
    cat_job_ph: 'e.g. Doctor, Engineer, Pilot...',
    cat_food: 'Food / Dish',
    cat_food_ph: 'e.g. Burger, Pizza, Pasta...',

    // Results Modal
    results_title: '🏁 Round Results',
    th_category: 'Category',
    th_your_answer: 'Your Answer',
    th_ai_answer: 'Opponent Answer',
    th_points: 'Points',
    empty_word: '(Empty)',
    points_unit: 'pts',
    edit_btn: 'Edit ✍️',
    challenge_btn: '✋ Object & Vote',
    next_round_btn: '⚡ Next Round ➡️',
    exit_game_btn: '🚪 Exit to Menu',
    share_btn: '📢 Share & Challenge!',
    whatsapp_btn: '💬 WhatsApp',
    btn_forfeit: '🏳️ Forfeit',
    btn_hint: '💡 Hint',
    hint_toast: '💡 Hint for ({cat}): Word starts with ({prefix}...)',
    hint_empty: 'No hints left in this round!',
    mod_double: '⚡ Double Points Round (2X)! All points multiplied by 2',
    mod_blitz: '⏱️ Speed Blitz (35s)! Super fast + 15 bonus XP points',
    mod_perfect: '🎯 Perfect 7 Challenge! +20 bonus XP if you fill all 7 categories',
    level_up_toast: '🎉 Level Up! You reached Level {level}: {rank}! 🏆',
    exit_confirm: 'Are you sure you want to exit and return to the main menu?',
    stamp_rejected: '❌ Rejected by Vote (Made up)',
    stamp_accepted: '✅ Accepted by Vote',
    ai_objecting_tag: '⚠️ Opponent Objects! (Suspects made-up word) ✋',
    ai_objecting_title: '⚠️ The AI Opponent objects to your answer!',
    go_vote_btn: '⚖️ Open Voting Court Now',
    win_banner: '🏆 Victory! You won this round! 🎉',
    loss_banner: '😢 Defeat! The opponent outscored you this round',
    tie_banner: '🤝 A fair tie between you and the opponent!',
    round_score_summary: 'Your round score: <strong>{pScore}</strong> | Opponent score: <strong>{aiScore}</strong>',

    // Voting Modal
    court_title: '⚖️ Game Court: Objection & Majority Vote',
    court_subtitle: 'Players challenged this answer.. Vote now to settle by majority!',
    vote_human_title: '👥 Group & Players In-Room Vote',
    vote_accept_btn: '👍 Valid & Accepted',
    vote_reject_btn: '👎 Objection! (Made up)',
    vote_resolve_btn: '⚖️ Settle by Majority Vote',
    vote_jury_title: '🤖 Smart AI Jury (3 Judges)',
    vote_jury_btn: '⚡ Run AI Jury Vote',
    jury_waiting: 'Awaiting review...',
    jury_1_name: 'Language Professor (Dictionary)',
    jury_2_name: 'Competitive Opponent',
    jury_3_name: 'Neutral Referee',
    close_btn: 'Cancel & Close',
    apply_verdict_btn: '✅ Confirm Verdict & Update Score',

    // Multiplayer
    mp_modal_title: '👥 Play with Friends Online',
    mp_modal_subtitle: 'Create a room and share the link or invite code (Up to 8 players)',
    mp_name_label: 'Your Player Name / Tag',
    mp_name_ph: 'Enter your name...',
    mp_avatar_label: 'Choose your avatar',
    mp_new_room_title: 'Create New Room',
    mp_new_room_desc: 'Host a private room for your friends',
    mp_create_btn: '✨ Create Room',
    mp_join_room_title: 'Join Existing Room',
    mp_code_ph: 'Room code (e.g. K7B2)',
    mp_join_btn: '🚀 Join with Code',
    mp_invite_label: 'Your Private Room Invite Code:',
    mp_copy_btn: '📋 Copy Invite Link for Friends',
    mp_copy_success: '✅ Link Copied to Clipboard!',
    mp_share_hint: 'Send the link to friends to join instantly with one click!',
    mp_seats_label: '👥 Player Seats in Room:',
    mp_start_game_btn: '🚀 Start Game for Everyone Now!',
    mp_empty_slot: 'Empty Seat',
    host_badge: '👑 Host',
    me_badge: '(You)',

    // Settings
    settings_title: '⚙️ Game Settings',
    sound_test_label: '🔊 Sound Effects Preview',
    test_victory_btn: '🎺 Victory Fanfare Preview 🎉',
    test_defeat_btn: '🎺 Defeat Sad Trombone Preview 😢',
    mode_label: 'Game Mode',
    mode_vs_ai: 'Vs Smart AI Bot',
    mode_solo: 'Solo Time Attack',
    mode_free: 'Free Play (No Opponent)',
    diff_label: 'Opponent Difficulty',
    diff_easy: 'Easy (Casual)',
    diff_medium: 'Medium (Balanced)',
    diff_hard: 'Expert (Fast & Accurate)',
    timer_label: 'Timer Duration per Round',
    timer_30: 'Half a minute (30 seconds)',
    timer_60: '1 minute (60 seconds)',
    timer_90: '1.5 minutes (90 seconds)',
    timer_120: '2 minutes (120 seconds - Default)',
    timer_inf: 'No Timer (Infinite)'
  }
};

class I18nManager {
  constructor() {
    this.currentLang = localStorage.getItem('khalast_lang') || 'ar';
  }

  init() {
    this.applyLanguage(this.currentLang);
    this.bindLanguageSwitcher();
  }

  t(key, params = {}) {
    const dict = TRANSLATIONS[this.currentLang] || TRANSLATIONS['ar'];
    let text = dict[key] || TRANSLATIONS['ar'][key] || key;
    Object.keys(params).forEach(k => {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), params[k]);
    });
    return text;
  }

  toggleLanguage() {
    const nextLang = this.currentLang === 'ar' ? 'en' : 'ar';
    this.applyLanguage(nextLang);
  }

  applyLanguage(lang) {
    this.currentLang = lang;
    localStorage.setItem('khalast_lang', lang);

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    if (lang === 'en') {
      document.body.classList.add('lang-en');
    } else {
      document.body.classList.remove('lang-en');
    }

    // تحديث كافة النصوص ذات سمة data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = this.t(key);
      }
    });

    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      if (key) {
        el.setAttribute('placeholder', this.t(key));
      }
    });

    // تحديث زر اللغة
    const langBtn = document.getElementById('toggle-lang-btn');
    if (langBtn) {
      langBtn.textContent = this.t('lang_btn');
    }

    // إعادة رسم الحقول بلغة جديدة
    if (typeof game !== 'undefined' && game && game.categories) {
      game.updateCategoriesForLanguage(lang);
    }

    // إعادة رسم عجلة الحروف
    if (typeof initPhaserWheel !== 'undefined') {
      const phaserContainer = document.getElementById('phaser-wheel-container');
      if (phaserContainer) {
        phaserContainer.innerHTML = '';
        initPhaserWheel('phaser-wheel-container', (selectedLetter) => {
          if (typeof game !== 'undefined' && game) game.onLetterChosen(selectedLetter);
        });
      }
    }
  }

  bindLanguageSwitcher() {
    const btn = document.getElementById('toggle-lang-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        this.toggleLanguage();
      });
    }
  }
}

const i18n = new I18nManager();
window.addEventListener('DOMContentLoaded', () => {
  i18n.init();
});
