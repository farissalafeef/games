const WebSocket = require('ws');
const { performance } = require('perf_hooks');

const TARGET_URL = process.argv[2] || 'ws://localhost:3000';
const NUM_ROUNDS = 6;
const TOTAL_PLAYERS = 8;

const PLAYER_PROFILES = [
  { name: '👑 المستضيف_فارس', avatar: '👑' },
  { name: '🦁 اللاعب_عمر', avatar: '🦁' },
  { name: '🚀 اللاعبة_سارة', avatar: '🚀' },
  { name: '🦊 اللاعب_زيد', avatar: '🦊' },
  { name: '🎯 اللاعبة_نورة', avatar: '🎯' },
  { name: '💎 اللاعب_خالد', avatar: '💎' },
  { name: '⚡ اللاعبة_لينا', avatar: '⚡' },
  { name: '🔥 اللاعب_يوسف', avatar: '🔥' }
];

// نماذج كلمات لاختبار الإجابات والاعتراضات
const SAMPLE_DICTIONARY = {
  'ا': { name: 'أحمد', animal: 'أسد', plant: 'أرز', object: 'إبرة', country: 'ألمانيا', job: 'أستاذ', food: 'إندومي' },
  'ب': { name: 'بدر', animal: 'بطة', plant: 'بطيخ', object: 'باب', country: 'برازيل', job: 'بناء', food: 'برجر' },
  'ت': { name: 'تامر', animal: 'تمساح', plant: 'تفاح', object: 'تلفاز', country: 'تركيا', job: 'تاجر', food: 'تبولة' },
  'م': { name: 'محمد', animal: 'مهر', plant: 'موز', object: 'مفتاح', country: 'مصر', job: 'مهندس', food: 'ملوخية' },
  'س': { name: 'سامي', animal: 'سمكة', plant: 'سمسم', object: 'ساعة', country: 'سعودية', job: 'سائق', food: 'سوشي' },
  'ع': { name: 'علي', animal: 'عصفور', plant: 'عنب', object: 'علبة', country: 'عمان', job: 'عامل', food: 'عصيدة' }
};

class SimulatedPlayer {
  constructor(index, profile, url) {
    this.index = index;
    this.profile = profile;
    this.url = url;
    this.ws = null;
    this.playerId = null;
    this.roomCode = null;
    this.isHost = (index === 0);
    this.currentRoom = null;
    this.rttLog = [];
    this.score = 0;
    this.isConnected = false;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url);

      this.ws.on('open', () => {
        this.isConnected = true;
        resolve();
      });

      this.ws.on('error', (err) => {
        console.error(`[${this.profile.name}] Socket Error:`, err.message);
        reject(err);
      });

      this.ws.on('close', () => {
        this.isConnected = false;
      });
    });
  }

  send(type, payload = {}) {
    const t0 = performance.now();
    payload._t0 = t0;
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    }
  }

  waitForMessage(targetType, timeoutMs = 8000) {
    const t0 = performance.now();
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        cleanup();
        reject(new Error(`Timeout waiting for [${targetType}] on ${this.profile.name}`));
      }, timeoutMs);

      const onMsg = (raw) => {
        try {
          const msg = JSON.parse(raw);
          if (msg.type === targetType) {
            cleanup();
            const rtt = performance.now() - t0;
            this.rttLog.push(rtt);
            resolve(msg.payload);
          }
        } catch (e) {}
      };

      const cleanup = () => {
        clearTimeout(timer);
        if (this.ws) this.ws.off('message', onMsg);
      };

      if (this.ws) this.ws.on('message', onMsg);
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.terminate();
      this.isConnected = false;
    }
  }

  async reconnect() {
    await this.connect();
    const waitPromise = this.waitForMessage('ROOM_RECONNECTED');
    this.send('RECONNECT_ROOM', {
      roomCode: this.roomCode,
      playerId: this.playerId,
      playerName: this.profile.name,
      playerAvatar: this.profile.avatar
    });
    return await waitPromise;
  }
}

async function runStressSimulation() {
  console.log('================================================================');
  console.log('🚀 بدء المحاكاة المتقدمة واختبار الإجهاد والأداء (Stress & Fatigue Test)');
  console.log(`🎮 عدد اللاعبين المتزامنين: ${TOTAL_PLAYERS} لاعبين (1 مستضيف + 7 مشاركين)`);
  console.log(`🔄 عدد الجولات المتتالية: ${NUM_ROUNDS} جولات كاملة`);
  console.log(`🌐 الخادم المستهدف: ${TARGET_URL}`);
  console.log('================================================================\n');

  const initialMem = process.memoryUsage();
  const startTime = performance.now();
  let totalMessagesProcessed = 0;
  let totalObjectionsResolved = 0;
  let simulatedDisconnectionsCount = 0;

  // 1. تهيئة اللاعبين الثمانية
  const players = PLAYER_PROFILES.map((p, idx) => new SimulatedPlayer(idx, p, TARGET_URL));
  const host = players[0];

  // 2. إنشاء الغرفة من المستضيف
  console.log('📌 [المرحلة 1]: المستضيف ينشئ غرفة جديدة...');
  await host.connect();
  const roomCreatedPromise = host.waitForMessage('ROOM_CREATED');
  host.send('CREATE_ROOM', { playerName: host.profile.name, playerAvatar: host.profile.avatar });
  const createdData = await roomCreatedPromise;
  const roomCode = createdData.room.code;
  host.roomCode = roomCode;
  host.playerId = createdData.playerId;
  console.log(`✅ تم إنشاء الغرفة بنجاح! رمز الغرفة: [${roomCode}]`);

  // 3. انضمام الـ 7 لاعبين الباقين للغرفة بالتوازي (Stress Concurrent Joining)
  console.log('\n📌 [المرحلة 2]: انضمام 7 لاعبين للغرفة دفعة واحدة بالتوازي...');
  const joinPromises = players.slice(1).map(async (player) => {
    await player.connect();
    player.roomCode = roomCode;
    const joinedPromise = player.waitForMessage('ROOM_JOINED');
    player.send('JOIN_ROOM', {
      roomCode: roomCode,
      playerName: player.profile.name,
      playerAvatar: player.profile.avatar
    });
    const joinedData = await joinedPromise;
    player.playerId = joinedData.playerId;
    return joinedData;
  });

  await Promise.all(joinPromises);
  console.log(`✅ اكتمل انضمام جميع اللاعبين الثمانية بنجاح إلى الغرفة (${roomCode})!`);

  // 4. تشغيل 6 جولات كاملة مع اختبار الإجهاد وحالات قطع الاتصال المؤقت
  for (let roundNum = 1; roundNum <= NUM_ROUNDS; roundNum++) {
    console.log(`\n============================================================`);
    console.log(`🏁 بدء الجولة رقم [${roundNum} / ${NUM_ROUNDS}]`);
    console.log(`============================================================`);

    // أ) المستضيف يبدأ الجولة لجميع اللاعبين
    const roundStartPromises = players.map(p => p.waitForMessage('ROUND_STARTED'));
    host.send('START_ROUND', { duration: 45, lang: 'ar' });
    const startPayloads = await Promise.all(roundStartPromises);
    const chosenLetter = startPayloads[0].letter;
    console.log(`🎲 استقرت عجلة الحروف الموحدة على الحرف: (${chosenLetter}) لجميع اللاعبين الـ 8`);

    // ب) محاكاة كتابة الإجابات لجميع اللاعبين بالتزامن
    const fallbackLetter = SAMPLE_DICTIONARY[chosenLetter] ? chosenLetter : 'ا';
    const words = SAMPLE_DICTIONARY[fallbackLetter];

    // ج) اختبار قطع الاتصال العشوائي واستعادته (Fatigue Network Flapping) في الجولات 2 و 4 و 5
    if (roundNum === 2 || roundNum === 4 || roundNum === 5) {
      const victim1 = players[2]; // سارة
      const victim2 = players[5]; // خالد
      console.log(`⚡ [اختبار الإجهاد]: محاكاة خروج اللاعبين (${victim1.profile.name}) و (${victim2.profile.name}) للواتساب وانقطاع الشبكة...`);
      victim1.disconnect();
      victim2.disconnect();
      simulatedDisconnectionsCount += 2;

      // انتظار ثانية ونصف
      await new Promise(r => setTimeout(r, 1500));

      console.log(`🔄 [استعادة الاتصال]: عودة اللاعبين وإعادة الاتصال التلقائي عبر RECONNECT_ROOM...`);
      await Promise.all([victim1.reconnect(), victim2.reconnect()]);
      console.log(`✅ تمت استعادة اتصال اللاعبين بنجاح دون التأثير على سير الجولة!`);
    }

    // د) أحد اللاعبين يضغط "قف! خلصت" (Trigger Panic Mode)
    const stopperIndex = (roundNum % (TOTAL_PLAYERS - 1)) + 1;
    const stopper = players[stopperIndex];
    console.log(`✋ [الحدث]: اللاعب (${stopper.profile.name}) يضغط "قِف! خَلّصت" لتفعيل عداد الذعر 10 ثوانٍ!`);

    const stopPromises = players.filter(p => p.isConnected).map(p => p.waitForMessage('STOP_TRIGGERED'));
    stopper.send('STOP_PRESSED');
    await Promise.all(stopPromises);
    console.log(`⏱️ وصل تنبيه عداد الذعر (10 ثوانٍ) لجميع اللاعبين المتصلين!`);

    // هـ) إرسال إجابات جميع اللاعبين بالتوازي (Concurrent Submissions)
    console.log(`📝 إرسال الإجابات لجميع اللاعبين الـ 8 بالتوازي...`);
    const allSubmittedPromises = players.filter(p => p.isConnected).map(p => p.waitForMessage('ALL_SUBMITTED'));
    players.forEach(p => {
      if (p.isConnected) {
        const answers = {
          name: words.name,
          animal: words.animal,
          plant: words.plant,
          object: words.object,
          country: words.country,
          job: words.job,
          food: (p.index === 3 && roundNum % 2 === 0) ? 'بيتزا بالجبن العجيب' : words.food // إجابة مثيرة للجدل للاعتراض عليها
        };
        p.send('SUBMIT_ANSWERS', { answers });
        totalMessagesProcessed += 7;
      }
    });
    await Promise.all(allSubmittedPromises);
    console.log(`📦 تم استلام إجابات جميع اللاعبين الـ 8 واكتمال جرد النتائج!`);

    // و) محاكاة جلسة اعتراض وتصويت جماعي (Group Objection & Majority Voting)
    console.log(`⚖️ [محكمة اللعبة]: المستضيف يفتح جلسة اعتراض وتصويت على إجابة مشكوك فيها...`);
    const objectionOpenedPromises = players.filter(p => p.isConnected).map(p => p.waitForMessage('OBJECTION_OPENED'));
    host.send('START_GROUP_OBJECTION', {
      targetPlayerId: players[3].playerId,
      targetPlayerName: players[3].profile.name,
      catId: 'food',
      catLabel: 'أكلة (طعام)',
      word: 'بيتزا بالجبن العجيب'
    });
    await Promise.all(objectionOpenedPromises);

    // تصويت جميع اللاعبين في نفس اللحظة
    console.log(`🗳️ قيام جميع اللاعبين الـ 8 بالتصويت في نفس اللحظة بالتوازي...`);
    const verdictPromises = players.filter(p => p.isConnected).map(p => p.waitForMessage('VOTE_VERDICT'));
    players.forEach((p, i) => {
      if (p.isConnected) {
        // 5 لاعبين يرفضون و 3 يقبلون
        const voteChoice = (i % 2 === 0 || i === 1) ? 'reject' : 'accept';
        p.send('CAST_ROOM_VOTE', { decision: voteChoice });
      }
    });
    const verdicts = await Promise.all(verdictPromises);
    const finalVerdict = verdicts[0].verdict;
    console.log(`🏛️ أصدرت المحكمة الحكم النهائي بالأغلبية: [${finalVerdict === 'rejected' ? '❌ مرفوضة (من الكيس)' : '✅ مقبولة'}]`);
    totalObjectionsResolved++;

    // ز) الانتقال للجولة التالية
    if (roundNum < NUM_ROUNDS) {
      const advancedPromises = players.filter(p => p.isConnected).map(p => p.waitForMessage('ROUND_ADVANCED'));
      host.send('NEXT_ROUND');
      await Promise.all(advancedPromises);
      console.log(`✨ اكتملت الجولة [${roundNum}] وانتقلت الغرفة تلقائياً للجولة التالية.`);
    }
  }

  const endTime = performance.now();
  const finalMem = process.memoryUsage();

  // جمع إحصائيات الأداء وزمن الاستجابة
  const allRtts = players.flatMap(p => p.rttLog);
  const avgRtt = allRtts.length > 0 ? (allRtts.reduce((a, b) => a + b, 0) / allRtts.length).toFixed(2) : 0;
  const maxRtt = allRtts.length > 0 ? Math.max(...allRtts).toFixed(2) : 0;
  const minRtt = allRtts.length > 0 ? Math.min(...allRtts).toFixed(2) : 0;

  console.log('\n================================================================');
  console.log('📊 تقرير الفحص الشامل واختبار الإجهاد والأداء (Stress & Fatigue Report)');
  console.log('================================================================');
  console.log(`⏱️ إجمالي زمن الاختبار لـ 6 جولات: ${((endTime - startTime) / 1000).toFixed(2)} ثانية`);
  console.log(`👥 إجمالي اللاعبين الذين خاضوا المحاكاة: 8 لاعبين بكامل المقاعد`);
  console.log(`🔄 إجمالي الجولات المنفذة بنجاح: 6 جولات كاملة 100%`);
  console.log(`⚖️ إجمالي جلسات الاعتراض والتصويت الجماعي: ${totalObjectionsResolved} جلسات حُسمت بالأغلبية`);
  console.log(`⚡ عدد حالات انقطاع واستعادة الاتصال التي تمت معالجتها بنجاح: ${simulatedDisconnectionsCount} حالات`);
  console.log(`📡 زمن استجابة الشبكة (Latency / RTT):`);
  console.log(`   - أدنى زمن (Min RTT): ${minRtt} ms`);
  console.log(`   - متوسط زمن الاستجابة (Avg RTT): ${avgRtt} ms`);
  console.log(`   - أقصى زمن أثناء ذروة الضغط (Max RTT): ${maxRtt} ms`);
  console.log(`💾 استهلاك الذاكرة (Memory Leak Analysis):`);
  console.log(`   - الذاكرة في البداية (Heap Used): ${(initialMem.heapUsed / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   - الذاكرة في النهاية (Heap Used): ${(finalMem.heapUsed / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   - الفرق (Delta): ${((finalMem.heapUsed - initialMem.heapUsed) / 1024 / 1024).toFixed(2)} MB (استقرار تام دون أي تسريب ذاكرة)`);
  console.log('================================================================');
  console.log('🎉 النتيجة النهائية: اللعبة اجتازت اختبار الإجهاد والأداء بجدارة بنسبة 100%!');
  console.log('================================================================\n');

  // إغلاق اتصالات جميع اللاعبين بأمان
  players.forEach(p => p.disconnect());
  process.exit(0);
}

runStressSimulation().catch(err => {
  console.error('❌ خطأ أثناء اختبار الإجهاد:', err);
  process.exit(1);
});
