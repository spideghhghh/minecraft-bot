const http = require('http');
const mineflayer = require('mineflayer');

// خادم الويب للبقاء 24/7 مجاناً
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('AI Human-Bot V3 (Tick-Based State Machine) is Active.\n');
}).listen(process.env.PORT || 3000);

const bot = mineflayer.createBot({
  host: 'node-de-free-01.tickhosting.com',
  port: 50589,
  username: 'TounsiBot',
  version: false
});

// 🧠 عقل البوت (State Machine Variables)
let aiState = 'IDLE'; 
let stateTicks = 0; // عداد الوقت داخل كل حالة
let maxStateTicks = 100; // متى يغير حالته
let targetEntity = null;
let chatCooldown = 0;

bot.on('spawn', () => {
  bot.setControlState('jump', true);
  setTimeout(() => bot.setControlState('jump', false), 500); // تفادي بلوك الترسبن
});

// ⚙️ المحرك الأساسي (يشتغل مع كل فريم في اللعبة - 20 مرة في الثانية)
bot.on('physicsTick', () => {
  if (!bot.entity) return;

  stateTicks++;
  if (chatCooldown > 0) chatCooldown--;

  // نظام Anti-Stuck أوتوماتيكي (إذا كان يمشي وضرب في حيط ينقز)
  if (bot.getControlState('forward') && bot.entity.isCollidedHorizontally) {
    bot.setControlState('jump', true);
  } else {
    bot.setControlState('jump', false);
  }

  // 🔄 إدارة الحالات النفسية والجسدية
  switch (aiState) {
    
    case 'IDLE':
      bot.clearControlStates();
      if (stateTicks > maxStateTicks) {
        // قرار بشري جديد
        const rand = Math.random();
        if (rand < 0.3) {
          // يتلفت برزانة
          const yaw = bot.entity.yaw + (Math.random() - 0.5) * 1.5;
          bot.look(yaw, 0, false);
          resetState('IDLE', Math.floor(Math.random() * 40 + 20)); 
        } else if (rand < 0.8) {
          // يمشي يكتشف
          const yaw = bot.entity.yaw + (Math.random() - 0.5) * 3;
          bot.look(yaw, 0, false);
          resetState('WANDER', Math.floor(Math.random() * 30 + 15));
        } else {
          // يعمل Sneak كأنه فادد
          bot.setControlState('sneak', true);
          resetState('IDLE', 10);
        }
      }
      break;

    case 'WANDER':
      bot.setControlState('forward', true);
      if (stateTicks > maxStateTicks) {
        bot.setControlState('forward', false);
        resetState('IDLE', Math.floor(Math.random() * 60 + 40));
      }
      break;

    case 'ANGRY':
    case 'GREET':
      if (targetEntity && targetEntity.position) {
        const dist = bot.entity.position.distanceTo(targetEntity.position);
        bot.lookAt(targetEntity.position.offset(0, 1.6, 0), false);
        
        if (dist > 2.5 && stateTicks < 150) {
          bot.setControlState('forward', true); // يقدم نحوه
        } else {
          bot.setControlState('forward', false); // ياقف قدامو
          if (aiState === 'ANGRY' && stateTicks % 10 === 0) bot.swingArm('right'); // يضرب من الغش
          if (aiState === 'GREET' && stateTicks % 15 === 0) {
             bot.setControlState('sneak', !bot.getControlState('sneak')); // يتبادل التحية
          }
        }

        if (stateTicks > 60) { // يهدى بعد 3 ثواني
          bot.clearControlStates();
          targetEntity = null;
          resetState('IDLE', 40);
        }
      } else {
        resetState('IDLE', 20);
      }
      break;
  }
});

function resetState(newState, durationTicks) {
  aiState = newState;
  stateTicks = 0;
  maxStateTicks = durationTicks;
}

// 💬 نظام الشات الذكي (تفاعل بدون سبام وبدون أخطاء)
bot.on('messagestr', (message) => {
  if (message.includes(bot.username) || chatCooldown > 0) return;
  
  const msg = message.toLowerCase();
  let response = '';

  const replies = {
    greet: ['w3slm', 'marhba m3allem', 'ahla w sahla', 'wesh ya bro'],
    howAreYou: ['cv hmdlh, rakcha houni', 'hmdlh labes, w enty?', 'cv l7a9, dima lenna'],
    angry: ['chkoun l bot ya bhim? rani nrakaz m3ak 😡', 'sayebna 3ad', 'bot fi 3inek!']
  };

  const getReply = (arr) => arr[Math.floor(Math.random() * arr.length)];

  if (/(bot|robot|afk|hack)/i.test(msg)) {
    response = getReply(replies.angry);
    setTargetAndState('ANGRY');
  } else if (/(slm|slam|slama|salem|cc|hi|hello|wesh)/i.test(msg)) {
    response = getReply(replies.greet);
    setTargetAndState('GREET');
  } else if (/(cv|ca va|chnwa|chneya|a7welek)/i.test(msg)) {
    response = getReply(replies.howAreYou);
    setTargetAndState('GREET');
  }

  if (response) {
    chatCooldown = 140; // 7 ثواني Cooldown كامل لمنع السبام
    setTimeout(() => bot.chat(response), Math.random() * 1000 + 1000); // تأخير بشري في الكتابة
  }
});

// يلوج على أقرب لاعب ويتوجهلو
function setTargetAndState(state) {
  const nearest = bot.nearestEntity(e => e.type === 'player' && e.username !== bot.username);
  if (nearest && bot.entity.position.distanceTo(nearest.position) < 15) {
    targetEntity = nearest;
    resetState(state, 100);
  }
}

// 🛡️ حماية النظام وإعادة الاتصال
bot.on('end', () => setTimeout(() => process.exit(1), 5000));
bot.on('error', () => {}); // تجاهل أخطاء الشبكة المؤقتة لضمان عدم توقف البوت
