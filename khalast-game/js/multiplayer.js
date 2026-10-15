/**
 * إدارة غرف اللعب الجماعي عبر الإنترنت (حتى 8 لاعبين)
 * تدعم الدعوة برمز الغرفة أو الرابط المباشر، وتزامن الجولات والتصويت المباشر
 */

class MultiplayerManager {
  constructor() {
    this.ws = null;
    this.currentRoom = null;
    this.myPlayerId = null;
    this.playerName = 'اللاعب';
    this.playerAvatar = '🎮';
    this.isMultiplayer = false;
  }

  init() {
    this.bindDomEvents();
    this.restoreSession();
    this.checkUrlForRoomInvite();

    // استعادة الاتصال التلقائي عند العودة للمتصفح من الواتساب أو الخلفية
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && this.isMultiplayer && this.currentRoom) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
          this.attemptReconnect();
        }
      }
    });
  }

  saveSession() {
    if (!this.currentRoom || !this.myPlayerId) return;
    try {
      sessionStorage.setItem('khalast_mp_room', this.currentRoom.code);
      sessionStorage.setItem('khalast_mp_pid', this.myPlayerId);
      sessionStorage.setItem('khalast_mp_name', this.playerName);
      sessionStorage.setItem('khalast_mp_avatar', this.playerAvatar);
    } catch (e) {}
  }

  restoreSession() {
    try {
      const room = sessionStorage.getItem('khalast_mp_room');
      const pid = sessionStorage.getItem('khalast_mp_pid');
      const name = sessionStorage.getItem('khalast_mp_name');
      const avatar = sessionStorage.getItem('khalast_mp_avatar');
      if (name) this.playerName = name;
      if (avatar) this.playerAvatar = avatar;

      // إذا كانت هناك جلسة نشطة سابقة نحاول استعادتها فوراً
      if (room && pid) {
        this.currentRoom = { code: room, players: [], maxPlayers: 8 };
        this.myPlayerId = pid;
        this.isMultiplayer = true;
        this.attemptReconnect();
      }
    } catch (e) {}
  }

  clearSession() {
    try {
      sessionStorage.removeItem('khalast_mp_room');
      sessionStorage.removeItem('khalast_mp_pid');
    } catch (e) {}
  }

  attemptReconnect() {
    if (this._reconnecting) return;
    this._reconnecting = true;
    const isEn = (typeof i18n !== 'undefined' && i18n.currentLang === 'en');
    this.showMpStatus(isEn ? '⏳ Reconnecting to room...' : '⏳ جاري استعادة الاتصال بالغرفة تلقائياً...');

    let attempts = 0;
    const tryConnect = () => {
      attempts++;
      if (attempts > 6 || !this.isMultiplayer) {
        this._reconnecting = false;
        this.showMpStatus('');
        return;
      }
      this.connect(() => {
        this._reconnecting = false;
        this.showMpStatus('');
        const roomCode = this.currentRoom ? this.currentRoom.code : sessionStorage.getItem('khalast_mp_room');
        const playerId = this.myPlayerId || sessionStorage.getItem('khalast_mp_pid');
        if (roomCode) {
          this.send('RECONNECT_ROOM', {
            roomCode: roomCode,
            playerId: playerId,
            playerName: this.playerName,
            playerAvatar: this.playerAvatar
          });
        }
      });
      setTimeout(tryConnect, 2500);
    };
    tryConnect();
  }

  connect(onOpen) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      if (onOpen) onOpen();
      return;
    }
    if (this.ws && this.ws.readyState === WebSocket.CONNECTING) {
      this._pendingOpen = onOpen;
      return;
    }

    const isEn = (typeof i18n !== 'undefined' && i18n.currentLang === 'en');
    this.showMpStatus(isEn ? '⏳ Connecting to server...' : '⏳ جاري الاتصال بالخادم...');

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    this._pendingOpen = onOpen;
    try {
      this.ws = new WebSocket(wsUrl);
    } catch (e) {
      this.showMpStatus(isEn ? '❌ Could not connect. Try again.' : '❌ تعذر الاتصال، حاول مرة أخرى.');
      return;
    }

    clearTimeout(this._connectTimer);
    this._connectTimer = setTimeout(() => {
      if (this.ws && this.ws.readyState !== WebSocket.OPEN) {
        try { this.ws.close(); } catch (e) {}
        this.showMpStatus(isEn ? '❌ Server is waking up, please try again in a few seconds.' : '❌ الخادم يستيقظ، حاول مرة أخرى بعد ثوانٍ.');
      }
    }, 15000);

    this.ws.onopen = () => {
      clearTimeout(this._connectTimer);
      console.log('✅ تم الاتصال بخادم الغرف بنجاح');
      this.showMpStatus('');
      const cb = this._pendingOpen;
      this._pendingOpen = null;
      if (cb) cb();
    };

    this.ws.onerror = () => {
      this.showMpStatus(isEn ? '❌ Connection error. Try again.' : '❌ خطأ في الاتصال، حاول مرة أخرى.');
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleServerMessage(data);
      } catch (err) {
        console.error('Error parsing WS message:', err);
      }
    };

    this.ws.onclose = () => {
      clearTimeout(this._connectTimer);
      console.log('⚠️ انقطع اتصال WebSocket');
      if (this.isMultiplayer && this.currentRoom) {
        this.attemptReconnect();
      }
    };
  }

  showMpStatus(text) {
    let el = document.getElementById('mp-conn-status');
    if (!el) {
      const modal = document.getElementById('mp-select-view') || document.body;
      el = document.createElement('div');
      el.id = 'mp-conn-status';
      el.style.cssText = 'margin:10px 0;padding:8px 12px;border-radius:10px;background:rgba(15,23,42,.85);color:#fde68a;font-weight:700;text-align:center;font-size:.95rem;';
      modal.prepend(el);
    }
    el.textContent = text;
    el.style.display = text ? 'block' : 'none';
  }

  send(type, payload = {}) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    }
  }

  bindDomEvents() {
    // زر فتح نافذة اللعب مع الأصدقاء في شريط الرأس
    const openMpBtn = document.getElementById('open-mp-btn');
    if (openMpBtn) {
      openMpBtn.addEventListener('click', () => {
        this.openMultiplayerModal();
      });
    }

    // إغلاق النافذة
    const closeMpBtn = document.getElementById('close-mp-modal-btn');
    if (closeMpBtn) {
      closeMpBtn.addEventListener('click', () => {
        this.closeMultiplayerModal();
      });
    }

    // زر إنشاء غرفة جديدة
    const btnCreateRoom = document.getElementById('btn-create-room');
    if (btnCreateRoom) {
      btnCreateRoom.addEventListener('click', () => {
        this.createRoom();
      });
    }

    // زر الانضمام بكود
    const btnJoinRoom = document.getElementById('btn-join-room');
    if (btnJoinRoom) {
      btnJoinRoom.addEventListener('click', () => {
        const codeInput = document.getElementById('input-room-code');
        const code = codeInput ? codeInput.value.trim().toUpperCase() : '';
        if (!code) {
          alert('يرجى إدخال رمز الغرفة المكون من 4 خانات!');
          return;
        }
        this.joinRoom(code);
      });
    }

    // إدخال رمز الغرفة وتنسيقه تلقائياً
    const codeInput = document.getElementById('input-room-code');
    if (codeInput) {
      codeInput.addEventListener('input', () => {
        codeInput.value = codeInput.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      });
      codeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const code = codeInput.value.trim().toUpperCase();
          if (code) this.joinRoom(code);
        }
      });
    }

    // زر نسخ الرابط
    const btnCopyLink = document.getElementById('btn-copy-room-link');
    if (btnCopyLink) {
      btnCopyLink.addEventListener('click', () => {
        this.copyInviteLink();
      });
    }

    // زر دعوة الأصدقاء عبر واتساب
    const btnWhatsAppRoom = document.getElementById('btn-whatsapp-room-link');
    if (btnWhatsAppRoom) {
      btnWhatsAppRoom.addEventListener('click', () => {
        this.shareWhatsAppInvite();
      });
    }

    // زر بدء الجولة من المستضيف
    const btnStartMpGame = document.getElementById('btn-start-mp-game');
    if (btnStartMpGame) {
      btnStartMpGame.addEventListener('click', () => {
        this.startRoomRound();
      });
    }

    // اختيار الأفاتار
    const avatarBtns = document.querySelectorAll('.avatar-option');
    avatarBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        avatarBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.playerAvatar = btn.getAttribute('data-avatar') || '🎮';
      });
    });
  }

  checkUrlForRoomInvite() {
    const params = new URLSearchParams(window.location.search);
    let roomCode = params.get('room');

    // فحص المسار المختصر مثل /join/ABCD أو /r/ABCD
    const pathMatch = window.location.pathname.match(/\/(join|r)\/([A-Za-z0-9]+)/i);
    if (pathMatch && pathMatch[2]) {
      roomCode = pathMatch[2];
    }

    if (roomCode) {
      roomCode = roomCode.toUpperCase().trim();
      this.openMultiplayerModal();
      const codeInput = document.getElementById('input-room-code');
      if (codeInput) {
        codeInput.value = roomCode;
      }
      const isEn = (typeof i18n !== 'undefined' && i18n.currentLang === 'en');
      this.showMpStatus(isEn ? `🎉 Joining room (${roomCode})...` : `🎉 جاري الانضمام تلقائياً للغرفة (${roomCode})...`);

      // دخول تلقائي للغرفة بعد نصف ثانية لمنع أي ارتباك للاعب المنضم
      setTimeout(() => {
        this.joinRoom(roomCode);
      }, 500);
    }
  }

  shareWhatsAppInvite() {
    if (!this.currentRoom) return;
    const url = `${window.location.origin}/join/${this.currentRoom.code}`;
    const isEn = (typeof i18n !== 'undefined' && i18n.currentLang === 'en');
    const msg = isEn
      ? `🎮 Play with me in Words Challenge!\nRoom Code: ${this.currentRoom.code}\nJoin instantly: ${url}`
      : `🎮 تعال العب معي في تحدي الحروف والكلمات!\nرمز الغرفة: ${this.currentRoom.code}\nادخل والعب معي فوراً بضغطة واحدة: ${url}`;
    
    // مشاركة عبر واجهة النظام الرسمية Share Sheet لعدم فصل المتصفح في الجوال
    if (navigator.share) {
      navigator.share({
        title: isEn ? 'Words Challenge Room' : 'غرفة تحدي الحروف والكلمات',
        text: msg,
        url: url
      }).catch(() => {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
      });
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
    }
  }

  getUserInputs() {
    const nameInput = document.getElementById('input-player-name');
    this.playerName = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : 'لاعب ' + Math.floor(Math.random() * 99 + 1);
    return { name: this.playerName, avatar: this.playerAvatar };
  }

  createRoom() {
    const user = this.getUserInputs();
    this.connect(() => {
      this.send('CREATE_ROOM', {
        playerName: user.name,
        playerAvatar: user.avatar
      });
    });
  }

  joinRoom(roomCode) {
    const user = this.getUserInputs();
    this.connect(() => {
      this.send('JOIN_ROOM', {
        roomCode: roomCode,
        playerName: user.name,
        playerAvatar: user.avatar
      });
    });
  }

  startRoomRound() {
    if (!this.currentRoom || this.currentRoom.hostId !== this.myPlayerId) return;
    const currentLang = (typeof i18n !== 'undefined') ? i18n.currentLang : 'ar';
    this.send('START_ROUND', { duration: 60, lang: currentLang });
  }

  copyInviteLink() {
    if (!this.currentRoom) return;
    // رابط دعوة مباشر وذكي وسريع الحفظ: /join/CODE
    const url = `${window.location.origin}/join/${this.currentRoom.code}`;
    const copySuccess = (typeof i18n !== 'undefined') ? i18n.t('mp_copy_success') : '✅ تم نسخ الرابط!';
    navigator.clipboard.writeText(url).then(() => {
      const btn = document.getElementById('btn-copy-room-link');
      if (btn) {
        const oldText = btn.innerHTML;
        btn.innerHTML = copySuccess;
        setTimeout(() => btn.innerHTML = oldText, 2000);
      }
    }).catch(err => {
      const promptLabel = (typeof i18n !== 'undefined' && i18n.currentLang === 'en') ? 'Copy room invite link:' : 'انسخ رابط الدعوة من هنا:';
      prompt(promptLabel, url);
    });
  }

  handleServerMessage(data) {
    const { type, payload } = data;

    switch (type) {
      case 'ROOM_CREATED':
      case 'ROOM_JOINED':
      case 'ROOM_RECONNECTED': {
        this.isMultiplayer = true;
        this.currentRoom = payload.room;
        this.myPlayerId = payload.playerId;
        this.saveSession();
        this.renderLobbyUI();
        this.updateHeaderRoomBadge();
        if (typeof game !== 'undefined' && game.unlockAchievement) {
          game.unlockAchievement('social_butterfly');
        }
        break;
      }

      case 'ROOM_PLAYERS_UPDATE': {
        this.currentRoom = payload.room;
        this.renderLobbyUI();
        this.updateHeaderRoomBadge();
        if (payload.joinedPlayerName && payload.joinedPlayerName !== this.playerName) {
          if (typeof sounds !== 'undefined') sounds.playCorrect();
        }
        break;
      }

      case 'ROUND_STARTED': {
        this.closeMultiplayerModal();
        if (payload.lang && typeof i18n !== 'undefined' && i18n.currentLang !== payload.lang) {
          i18n.applyLanguage(payload.lang);
        }
        if (typeof game !== 'undefined') {
          // بدء الجولة المتزامنة في لعبة اللاعب
          game.isRoundActive = true;
          game.currentLetter = payload.letter;
          game.round = payload.round;
          game.timeLeft = payload.duration;

          // تدوير عجلة الحروف لتستقر على الحرف الموحد للجميع
          triggerWheelSpin(payload.letter, () => {
            game.onLetterChosen(payload.letter);
          });
        }
        break;
      }

      case 'STOP_TRIGGERED': {
        // شخص ما في الغرفة ضغط "قِف! خَلّصت"
        if (typeof sounds !== 'undefined') {
          sounds.playStopWhistle();
          setTimeout(() => sounds.speakVoice('stop'), 120);
        }
        if (typeof game !== 'undefined') {
          game.timeLeft = Math.min(game.timeLeft, payload.panicSeconds);
          game.isPanicMode = true;
          const stopBtn = document.getElementById('btn-stop');
          if (stopBtn) {
            stopBtn.innerHTML = `⚠️ ${payload.stoppedByName} أعلن قِف! خَلّصت.. تبقت 10 ثوانٍ!`;
            stopBtn.disabled = true;
          }
        }
        break;
      }

      case 'ROUND_ENDED_FORCED': {
        if (typeof game !== 'undefined') {
          // جمع الإجابات وإرسالها للخادم
          const activeCats = game.getActiveCategories();
          const myAnswers = {};
          activeCats.forEach(c => {
            const input = document.getElementById(`input-${c.id}`);
            myAnswers[c.id] = input ? input.value.trim() : '';
          });

          this.send('SUBMIT_ANSWERS', { answers: myAnswers });
          game.endRound(payload.message || 'انتهت الجولة!');
        }
        break;
      }

      case 'ALL_SUBMITTED': {
        // تم استلام جميع إجابات اللاعبين الثمانية
        console.log('جميع اللاعبين أرسلوا إجاباتهم:', payload.allAnswers);
        break;
      }

      case 'OBJECTION_OPENED': {
        // جلسة اعتراض جماعية مفتوحة من لاعب آخر
        if (typeof sounds !== 'undefined') sounds.playGavel();
        const modal = document.getElementById('voting-modal');
        const wordEl = document.getElementById('vote-target-word');
        const authorEl = document.getElementById('vote-author-name');
        const catEl = document.getElementById('vote-category-name');
        const letterEl = document.getElementById('vote-letter-name');

        if (wordEl) wordEl.textContent = `"${payload.word}"`;
        if (authorEl) authorEl.textContent = `👤 صاحب الإجابة: ${payload.targetPlayerName}`;
        if (catEl) catEl.textContent = `📁 التصنيف: ${payload.catLabel}`;
        if (letterEl) letterEl.textContent = `🔤 الحرف: (${payload.letter})`;

        if (modal) modal.classList.add('active');
        break;
      }

      case 'VOTES_UPDATED': {
        const acceptEl = document.getElementById('human-accept-count');
        const rejectEl = document.getElementById('human-reject-count');
        if (acceptEl) acceptEl.textContent = payload.acceptCount;
        if (rejectEl) rejectEl.textContent = payload.rejectCount;
        break;
      }

      case 'VOTE_VERDICT': {
        if (typeof game !== 'undefined') {
          game.declareVerdict(payload.verdict, `تصويت الغرفة المشتركة (${payload.acceptCount} مع مقابل ${payload.rejectCount} ضد)`);
        }
        break;
      }

      case 'ERROR': {
        alert(payload.message || 'حدث خطأ في الغرفة');
        break;
      }
    }
  }

  renderLobbyUI() {
    const selectView = document.getElementById('mp-select-view');
    const lobbyView = document.getElementById('mp-lobby-view');
    if (selectView) selectView.style.display = 'none';
    if (lobbyView) lobbyView.style.display = 'block';

    const roomCodeBadge = document.getElementById('display-room-code');
    if (roomCodeBadge && this.currentRoom) {
      roomCodeBadge.textContent = this.currentRoom.code;
    }

    const playersCountBadge = document.getElementById('display-players-count');
    const playersUnit = (typeof i18n !== 'undefined' && i18n.currentLang === 'en') ? 'players' : 'لاعبين';
    if (playersCountBadge && this.currentRoom) {
      playersCountBadge.textContent = `${this.currentRoom.players.length} / ${this.currentRoom.maxPlayers} ${playersUnit}`;
    }

    const slotsGrid = document.getElementById('lobby-players-grid');
    if (slotsGrid && this.currentRoom) {
      slotsGrid.innerHTML = '';
      const hostBadgeText = (typeof i18n !== 'undefined') ? i18n.t('host_badge') : '👑 مستضيف';
      const meBadgeText = (typeof i18n !== 'undefined') ? i18n.t('me_badge') : '(أنت)';
      const emptySlotText = (typeof i18n !== 'undefined') ? i18n.t('mp_empty_slot') : 'مكان شاغر';
      const pointsUnit = (typeof i18n !== 'undefined') ? i18n.t('points_unit') : 'نقطة';

      for (let i = 0; i < this.currentRoom.maxPlayers; i++) {
        const player = this.currentRoom.players[i];
        const card = document.createElement('div');
        card.className = `player-slot-card ${player ? 'filled' : 'empty'}`;

        if (player) {
          card.innerHTML = `
            <div class="slot-avatar">${player.avatar}</div>
            <div class="slot-name">
              ${player.name}
              ${player.isHost ? `<span class="host-badge">${hostBadgeText}</span>` : ''}
              ${player.id === this.myPlayerId ? `<span class="me-badge">${meBadgeText}</span>` : ''}
            </div>
            <div class="slot-score">${player.score} ${pointsUnit}</div>
          `;
        } else {
          card.innerHTML = `
            <div class="slot-avatar" style="opacity:0.3;">👤</div>
            <div class="slot-name" style="color:var(--text-muted);">${emptySlotText} ${i + 1}</div>
          `;
        }
        slotsGrid.appendChild(card);
      }
    }

    // زر بدء اللعبة متاح فقط للمستضيف
    const btnStart = document.getElementById('btn-start-mp-game');
    if (btnStart) {
      const isHost = this.currentRoom && this.currentRoom.hostId === this.myPlayerId;
      btnStart.style.display = isHost ? 'block' : 'none';
    }
  }

  updateHeaderRoomBadge() {
    const badge = document.getElementById('header-room-badge');
    if (badge && this.currentRoom) {
      badge.style.display = 'inline-flex';
      badge.innerHTML = `👥 غرفة: <strong>${this.currentRoom.code}</strong> (${this.currentRoom.players.length}/8)`;
    }
  }

  openMultiplayerModal() {
    if (window.game) {
      if (window.game.closeStreakModal) window.game.closeStreakModal();
      if (window.game.closeAchievementsModal) window.game.closeAchievementsModal();
    }
    const settingsDrawer = document.getElementById('settings-drawer');
    if (settingsDrawer) settingsDrawer.classList.remove('open');

    const modal = document.getElementById('multiplayer-modal');
    if (modal) modal.classList.add('active');
    if (window.game && window.game.checkBodyModalState) window.game.checkBodyModalState();
  }

  closeMultiplayerModal() {
    const modal = document.getElementById('multiplayer-modal');
    if (modal) modal.classList.remove('active');
    if (window.game && window.game.checkBodyModalState) window.game.checkBodyModalState();
  }

  exitMultiplayer() {
    this.isMultiplayer = false;
    this.currentRoom = null;
    this.myPlayerId = null;
    this.clearSession();
    const badge = document.getElementById('header-room-badge');
    if (badge) badge.style.display = 'none';
    this.closeMultiplayerModal();
  }
}

const multiplayer = new MultiplayerManager();
window.addEventListener('DOMContentLoaded', () => {
  multiplayer.init();
});
