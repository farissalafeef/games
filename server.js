const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { WebSocketServer, WebSocket } = require('ws');

const PORT = process.env.PORT || 3000;
const MAX_PLAYERS_PER_ROOM = 8;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml'
};

// خادم الملفات الثابتة وروابط الدعوة السريعة
const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];

  // دعم الروابط المختصرة السريعة مثل /join/ABCD أو /r/ABCD
  if (reqPath === '/' || /^\/(join|r)\/[A-Za-z0-9]+\/?$/i.test(reqPath)) {
    reqPath = '/index.html';
  }

  const filePath = path.join(__dirname, reqPath);
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end();
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404: الملف غير موجود');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    const headers = { 'Content-Type': contentType };
    if (ext === '.html' || reqPath === '/sw.js') {
      headers['Cache-Control'] = 'no-cache';
    } else {
      headers['Cache-Control'] = 'public, max-age=86400';
    }

    const compressible = ['.html', '.css', '.js', '.json', '.svg'].includes(ext);
    const acceptsGzip = /\bgzip\b/.test(req.headers['accept-encoding'] || '');
    if (compressible && acceptsGzip) {
      headers['Content-Encoding'] = 'gzip';
      headers['Vary'] = 'Accept-Encoding';
      res.writeHead(200, headers);
      fs.createReadStream(filePath).pipe(zlib.createGzip()).pipe(res);
    } else {
      res.writeHead(200, headers);
      fs.createReadStream(filePath).pipe(res);
    }
  });
});

// إدارة غرف اللعب المشتركة (حتى 8 لاعبين)
const rooms = new Map();

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return rooms.has(code) ? generateRoomCode() : code;
}

function broadcastToRoom(room, data, excludeWs = null) {
  const payload = JSON.stringify(data);
  room.players.forEach(p => {
    if (p.ws && p.ws.readyState === WebSocket.OPEN && p.ws !== excludeWs) {
      p.ws.send(payload);
    }
  });
}

function getSafeRoomData(room) {
  return {
    code: room.code,
    hostId: room.hostId,
    state: room.state,
    letter: room.letter,
    round: room.round,
    maxPlayers: MAX_PLAYERS_PER_ROOM,
    players: room.players.map(p => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      score: p.score,
      isHost: p.id === room.hostId,
      disconnected: !!p.disconnected,
      hasSubmitted: !!(room.answers && room.answers[p.id])
    }))
  };
}

// إنشاء خادم WebSocket للغرف واللعب الجماعي المباشر
const wss = new WebSocketServer({ server });

// نبض دوري لإبقاء الاتصال حياً عبر بروكسي Render وشبكات الجوال بمرونة
const heartbeat = setInterval(() => {
  wss.clients.forEach((client) => {
    if (client.isAlive === false) {
      client.missedPings = (client.missedPings || 0) + 1;
      if (client.missedPings >= 2) {
        return client.terminate();
      }
    } else {
      client.missedPings = 0;
    }
    client.isAlive = false;
    try { client.ping(); } catch (e) {}
  });
}, 20000);
wss.on('close', () => clearInterval(heartbeat));

wss.on('connection', (ws) => {
  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });
  let playerRoomCode = null;
  let playerId = null;

  ws.on('message', (messageRaw) => {
    try {
      const msg = JSON.parse(messageRaw);
      const { type, payload } = msg;

      switch (type) {
        // إنشاء غرفة جديدة
        case 'CREATE_ROOM': {
          const roomCode = generateRoomCode();
          playerId = 'p_' + Math.random().toString(36).substring(2, 9);
          playerRoomCode = roomCode;

          const newRoom = {
            code: roomCode,
            hostId: playerId,
            state: 'LOBBY',
            letter: 'ا',
            round: 1,
            players: [{
              id: playerId,
              name: payload.playerName || 'المستضيف',
              avatar: payload.playerAvatar || '👑',
              score: 0,
              ws: ws
            }],
            answers: {},
            stoppedBy: null,
            panicTimeout: null
          };

          rooms.set(roomCode, newRoom);

          ws.send(JSON.stringify({
            type: 'ROOM_CREATED',
            payload: {
              room: getSafeRoomData(newRoom),
              playerId: playerId
            }
          }));
          break;
        }

        // الانضمام لغرفة عبر الكود أو الرابط
        case 'JOIN_ROOM': {
          const reqCode = (payload.roomCode || '').toUpperCase().trim();
          const targetRoom = rooms.get(reqCode);

          if (!targetRoom) {
            ws.send(JSON.stringify({
              type: 'ERROR',
              payload: { message: `عذراً، الغرفة (${reqCode}) غير موجودة!` }
            }));
            return;
          }

          if (targetRoom.players.length >= MAX_PLAYERS_PER_ROOM) {
            ws.send(JSON.stringify({
              type: 'ERROR',
              payload: { message: `الغرفة ممتلئة! الحد الأقصى هو ${MAX_PLAYERS_PER_ROOM} لاعبين.` }
            }));
            return;
          }

          if (targetRoom.state !== 'LOBBY' && targetRoom.state !== 'RESULTS') {
            ws.send(JSON.stringify({
              type: 'ERROR',
              payload: { message: 'الجولة جارية حالياً في هذه الغرفة، يرجى الانتظار لحين انتهاء الجولة.' }
            }));
            return;
          }

          playerId = 'p_' + Math.random().toString(36).substring(2, 9);
          playerRoomCode = reqCode;

          targetRoom.players.push({
            id: playerId,
            name: payload.playerName || `لاعب ${targetRoom.players.length + 1}`,
            avatar: payload.playerAvatar || '🎮',
            score: 0,
            ws: ws
          });

          // إرسال تأكيد الانضمام للاعب الجديد
          ws.send(JSON.stringify({
            type: 'ROOM_JOINED',
            payload: {
              room: getSafeRoomData(targetRoom),
              playerId: playerId
            }
          }));

          // إشعار كافة لاعبي الغرفة بانضمام اللاعب الجديد
          broadcastToRoom(targetRoom, {
            type: 'ROOM_PLAYERS_UPDATE',
            payload: {
              room: getSafeRoomData(targetRoom),
              joinedPlayerName: payload.playerName
            }
          });
          break;
        }

        // استعادة الاتصال بالغرفة (بعد التبديل لتطبيق آخر أو ضعف الشبكة)
        case 'RECONNECT_ROOM': {
          const reqCode = (payload.roomCode || '').toUpperCase().trim();
          const targetRoom = rooms.get(reqCode);
          if (!targetRoom) {
            ws.send(JSON.stringify({
              type: 'ERROR',
              payload: { message: `انتهت صلاحية الغرفة (${reqCode}) أو تم إغلاقها.` }
            }));
            return;
          }

          const existingPlayer = targetRoom.players.find(p => p.id === payload.playerId);
          if (existingPlayer) {
            if (existingPlayer.disconnectTimeout) {
              clearTimeout(existingPlayer.disconnectTimeout);
              existingPlayer.disconnectTimeout = null;
            }
            existingPlayer.ws = ws;
            existingPlayer.disconnected = false;
            playerId = existingPlayer.id;
            playerRoomCode = reqCode;

            ws.send(JSON.stringify({
              type: 'ROOM_RECONNECTED',
              payload: {
                room: getSafeRoomData(targetRoom),
                playerId: playerId
              }
            }));

            broadcastToRoom(targetRoom, {
              type: 'ROOM_PLAYERS_UPDATE',
              payload: { room: getSafeRoomData(targetRoom) }
            });
          } else {
            // انضمام كلاعب جديد في حال لم يُعثر على اللاعب السابق
            if (targetRoom.players.length < MAX_PLAYERS_PER_ROOM) {
              playerId = payload.playerId || ('p_' + Math.random().toString(36).substring(2, 9));
              playerRoomCode = reqCode;
              targetRoom.players.push({
                id: playerId,
                name: payload.playerName || `لاعب ${targetRoom.players.length + 1}`,
                avatar: payload.playerAvatar || '🎮',
                score: 0,
                ws: ws
              });

              ws.send(JSON.stringify({
                type: 'ROOM_JOINED',
                payload: {
                  room: getSafeRoomData(targetRoom),
                  playerId: playerId
                }
              }));

              broadcastToRoom(targetRoom, {
                type: 'ROOM_PLAYERS_UPDATE',
                payload: {
                  room: getSafeRoomData(targetRoom),
                  joinedPlayerName: payload.playerName
                }
              });
            } else {
              ws.send(JSON.stringify({
                type: 'ERROR',
                payload: { message: 'الغرفة ممتلئة بالكامل!' }
              }));
            }
          }
          break;
        }

        // بدء الجولة (من قِبل المستضيف فقط) - يدعم العربية والإنجليزية
        case 'START_ROUND': {
          const room = rooms.get(playerRoomCode);
          if (!room || room.hostId !== playerId) return;

          const ARABIC_LETTERS = ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'];
          const ENGLISH_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

          const isEn = payload.lang === 'en';
          const pool = isEn ? ENGLISH_LETTERS : ARABIC_LETTERS;

          room.letter = pool[Math.floor(Math.random() * pool.length)];
          room.lang = isEn ? 'en' : 'ar';
          room.state = 'PLAYING';
          room.answers = {};
          room.stoppedBy = null;
          clearTimeout(room.panicTimeout);

          broadcastToRoom(room, {
            type: 'ROUND_STARTED',
            payload: {
              letter: room.letter,
              lang: room.lang,
              round: room.round,
              duration: payload.duration || 120
            }
          });
          break;
        }

        // ضغط زر "قِف! خَلّصت" من قِبل أول لاعب ينتهي
        case 'STOP_PRESSED': {
          const room = rooms.get(playerRoomCode);
          if (!room || room.state !== 'PLAYING') return;

          const player = room.players.find(p => p.id === playerId);
          if (!player) return;

          room.state = 'PANIC';
          room.stoppedBy = player.name;

          // مكافأة السرعة +5 نقاط
          player.score += 5;

          // إرسال تنبيه صافرة التوقف وبدء مهلة الذعر (10 ثوانٍ) للجميع
          broadcastToRoom(room, {
            type: 'STOP_TRIGGERED',
            payload: {
              stoppedByName: player.name,
              panicSeconds: 10
            }
          });

          // إنهاء الجولة بعد 10 ثوانٍ تلقائياً
          room.panicTimeout = setTimeout(() => {
            room.state = 'RESULTS';
            broadcastToRoom(room, {
              type: 'ROUND_ENDED_FORCED',
              payload: { message: 'انتهت مهلة الـ 10 ثوانٍ! جاري تجميع الإجابات...' }
            });
          }, 10500);
          break;
        }

        // إرسال إجابات اللاعب
        case 'SUBMIT_ANSWERS': {
          const room = rooms.get(playerRoomCode);
          if (!room) return;

          room.answers[playerId] = payload.answers || {};

          // إعلام الغرفة بتقديم الإجابة
          broadcastToRoom(room, {
            type: 'PLAYER_SUBMITTED',
            payload: {
              playerId: playerId,
              submittedCount: Object.keys(room.answers).length,
              totalPlayers: room.players.length
            }
          });

          // إذا قدم الجميع إجاباتهم
          if (Object.keys(room.answers).length >= room.players.length) {
            clearTimeout(room.panicTimeout);
            room.state = 'RESULTS';
            broadcastToRoom(room, {
              type: 'ALL_SUBMITTED',
              payload: {
                allAnswers: room.answers,
                players: getSafeRoomData(room).players
              }
            });
          }
          break;
        }

        // بدء جلسة اعتراض وتصويت جماعية على إجابة لاعب
        case 'START_GROUP_OBJECTION': {
          const room = rooms.get(playerRoomCode);
          if (!room) return;

          room.currentVote = {
            targetPlayerId: payload.targetPlayerId,
            targetPlayerName: payload.targetPlayerName,
            catId: payload.catId,
            catLabel: payload.catLabel,
            word: payload.word,
            votes: {}, // playerId -> 'accept' | 'reject'
            active: true
          };

          broadcastToRoom(room, {
            type: 'OBJECTION_OPENED',
            payload: {
              targetPlayerName: payload.targetPlayerName,
              catLabel: payload.catLabel,
              word: payload.word,
              letter: room.letter
            }
          });
          break;
        }

        // تصويت أحد اللاعبين في الغرفة
        case 'CAST_ROOM_VOTE': {
          const room = rooms.get(playerRoomCode);
          if (!room || !room.currentVote || !room.currentVote.active) return;

          room.currentVote.votes[playerId] = payload.decision; // 'accept' | 'reject'

          const acceptCount = Object.values(room.currentVote.votes).filter(v => v === 'accept').length;
          const rejectCount = Object.values(room.currentVote.votes).filter(v => v === 'reject').length;

          // بث تحديث الأصوات المباشر لجميع اللاعبين
          broadcastToRoom(room, {
            type: 'VOTES_UPDATED',
            payload: {
              acceptCount,
              rejectCount,
              totalVotes: Object.keys(room.currentVote.votes).length,
              totalPlayers: room.players.length
            }
          });

          // إذا صوتت الأغلبية المطلقة أو جميع اللاعبين
          const majority = Math.floor(room.players.length / 2) + 1;
          if (rejectCount >= majority || acceptCount >= majority || Object.keys(room.currentVote.votes).length >= room.players.length) {
            const finalVerdict = rejectCount > acceptCount ? 'rejected' : 'accepted';
            room.currentVote.active = false;

            // تطبيق النتيجة على نقاط صاحب الإجابة
            const targetP = room.players.find(p => p.id === room.currentVote.targetPlayerId);
            if (targetP && finalVerdict === 'rejected') {
              targetP.score = Math.max(0, targetP.score - 10);
            }

            broadcastToRoom(room, {
              type: 'VOTE_VERDICT',
              payload: {
                verdict: finalVerdict,
                targetPlayerId: room.currentVote.targetPlayerId,
                catId: room.currentVote.catId,
                acceptCount,
                rejectCount,
                updatedPlayers: getSafeRoomData(room).players
              }
            });
          }
          break;
        }

        // تحديث نقاط نهائي من التحكيم
        case 'UPDATE_SCORE': {
          const room = rooms.get(playerRoomCode);
          if (!room || room.hostId !== playerId) return;

          const p = room.players.find(pl => pl.id === payload.targetPlayerId);
          if (p) {
            p.score += payload.delta;
            broadcastToRoom(room, {
              type: 'ROOM_PLAYERS_UPDATE',
              payload: { room: getSafeRoomData(room) }
            });
          }
          break;
        }

        // الانتقال للجولة التالية
        case 'NEXT_ROUND': {
          const room = rooms.get(playerRoomCode);
          if (!room || room.hostId !== playerId) return;

          room.round++;
          room.state = 'LOBBY';
          broadcastToRoom(room, {
            type: 'ROUND_ADVANCED',
            payload: { room: getSafeRoomData(room) }
          });
          break;
        }
      }
    } catch (e) {
      console.error('Error parsing WS message:', e);
    }
  });

  // معالجة انقطاع الاتصال بمرونة وأمان للهواتف المحمولة
  ws.on('close', () => {
    if (playerRoomCode && rooms.has(playerRoomCode)) {
      const room = rooms.get(playerRoomCode);
      const player = room.players.find(p => p.id === playerId);
      
      if (player) {
        player.ws = null;
        player.disconnected = true;

        // إشعار بقية اللاعبين بحالة الاتصال
        broadcastToRoom(room, {
          type: 'ROOM_PLAYERS_UPDATE',
          payload: { room: getSafeRoomData(room) }
        });

        // مهلة أمان 90 ثانية لإتاحة إعادة الاتصال عند مشاركة الرابط أو التبديل للواتساب
        if (player.disconnectTimeout) clearTimeout(player.disconnectTimeout);
        player.disconnectTimeout = setTimeout(() => {
          if (!rooms.has(playerRoomCode)) return;
          const currentRoom = rooms.get(playerRoomCode);
          const pIndex = currentRoom.players.findIndex(p => p.id === playerId);
          if (pIndex !== -1 && currentRoom.players[pIndex].disconnected) {
            const leftPlayer = currentRoom.players[pIndex];
            currentRoom.players.splice(pIndex, 1);

            // إذا فرغت الغرفة تماماً نحذفها
            if (currentRoom.players.length === 0) {
              clearTimeout(currentRoom.panicTimeout);
              rooms.delete(playerRoomCode);
            } else {
              // إذا كان المغادر هو المستضيف، ننقل الاستضافة للاعب التالي
              if (currentRoom.hostId === playerId) {
                currentRoom.hostId = currentRoom.players[0].id;
              }
              broadcastToRoom(currentRoom, {
                type: 'PLAYER_LEFT',
                payload: {
                  playerName: leftPlayer.name,
                  room: getSafeRoomData(currentRoom)
                }
              });
            }
          }
        }, 90000);
      }
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🎮 لعبة إنسان حيوان نبات جماد بلاد تعمل على المنفذ: ${PORT}`);
});
