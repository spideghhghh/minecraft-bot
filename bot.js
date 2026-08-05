const http = require('http');
const mineflayer = require('mineflayer');

// 1. خادم الويب للبقاء متصلاً 24/7 على منصة Render
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('AI Tounsi Bot V4 - Ultimate Tunisian Engine is Active.\n');
}).listen(process.env.PORT || 3000);

// 2. إعدادات البوت
const bot = mineflayer.createBot({
  host: 'node-de-free-01.tickhosting.com',
  port: 50589,
  username: 'TounsiBot',
  version: false
});

// 🧠 3. متغيرات العقل والذاكرة
let aiState = 'IDLE'; 
let stateTicks = 0; 
let maxStateTicks = 100; 
let targetEntity = null;
let chatCooldown = 0;
let lastJumpTick = 0;

bot.on('spawn', () => {
  console.log('✨ [System] البوت الأسطوري التونسي دخل للسيرفر!');
  bot.setControlState('jump', true);
  setTimeout(() => bot.setControlState('jump', false), 500);
});

// 🏃‍♂️ 4. المحرك الفيزيائي (20 مرة في الثانية) - نظام القفز والحركة
bot.on('physicsTick', () => {
  if (!bot.entity) return;

  stateTicks++;
  if (chatCooldown > 0) chatCooldown--;

  // 🚀 نظام Auto-Jump الذكي لتجاوز أي عقبة
  const isMoving = bot.getControlState('forward') || bot.getControlState('sprint');
  if (isMoving && bot.entity.isCollidedHorizontally && (stateTicks - lastJumpTick > 10)) {
    bot.setControlState('jump', true);
    lastJumpTick = stateTicks;
  } else if (!bot.entity.isCollidedHorizontally) {
    bot.setControlState('jump', false);
  }

  // 🔄 إدارة الحالات النفسية والجسدية
  switch (aiState) {
    
    case 'IDLE':
      bot.clearControlStates();
      if (stateTicks > maxStateTicks) {
        const rand = Math.random();
        if (rand < 0.2) {
          // فتح موضوع من تلقاء نفسه مع أقرب لاعب
          const nearest = findNearestPlayer(20);
          if (nearest) {
            targetEntity = nearest;
            resetState('PROACTIVE_TALK', 200);
          } else {
            resetState('WANDER', 60);
          }
        } else if (rand < 0.6) {
          // مشي واستكشاف
          const yaw = bot.entity.yaw + (Math.random() - 0.5) * 3;
          bot.look(yaw, 0, false);
          resetState('WANDER', Math.floor(Math.random() * 40 + 20));
        } else {
          // يتلفت حوله
          const yaw = bot.entity.yaw + (Math.random() - 0.5) * 2;
          bot.look(yaw, 0, false);
          resetState('IDLE', Math.floor(Math.random() * 30 + 20)); 
        }
      }
      break;

    case 'WANDER':
      bot.setControlState('forward', true);
      // أحياناً يركض (Sprint) كلاعب محترف
      if (Math.random() < 0.05) bot.setControlState('sprint', true);
      
      if (stateTicks > maxStateTicks) {
        bot.clearControlStates();
        resetState('IDLE', Math.floor(Math.random() * 60 + 40));
      }
      break;

    case 'PROACTIVE_TALK':
      // يجري وراء لاعب لفتح موضوع
      if (targetEntity && targetEntity.position) {
        moveToTarget(targetEntity, true); // true = sprint
        if (bot.entity.position.distanceTo(targetEntity.position) < 3) {
          bot.clearControlStates();
          bot.lookAt(targetEntity.position.offset(0, 1.6, 0), false);
          
          if (stateTicks === maxStateTicks - 5) { // يتكلم قبل ما يكمل الحالة
             const topics = [
               `wesh ya ${targetEntity.username}, chfama jdid lyoum?`,
               `ya ${targetEntity.username} brjoulia famach blasa feha 5edma houni?`,
               'ti winkom ya jme3a, serveur re9ed lyoum?',
               `chnya rayek fel serveur ya ${targetEntity.username}?`,
               'chkoun 3andou 7aja ybi3ha ya louled?'
             ];
             speak(topics[Math.floor(Math.random() * topics.length)]);
          }
          if (stateTicks > maxStateTicks) resetState('IDLE', 60);
        }
      } else {
        resetState('IDLE', 20);
      }
      break;

    case 'ANGRY':
      // حالة الغضب: يجري وراء اللاعب ويضربه ويوبخه
      if (targetEntity && targetEntity.position) {
        moveToTarget(targetEntity, true);
        if (bot.entity.position.distanceTo(targetEntity.position) < 2.5) {
          bot.setControlState('forward', false);
          if (stateTicks % 10 === 0) bot.swingArm('right'); // يضرب
        }
        if (stateTicks > maxStateTicks) resetState('IDLE', 40);
      } else {
        resetState('IDLE', 20);
      }
      break;

    case 'GREET':
    case 'INTERACT':
      // حالة الترحيب أو التفاعل العادي
      if (targetEntity && targetEntity.position) {
        moveToTarget(targetEntity, false);
        if (bot.entity.position.distanceTo(targetEntity.position) < 2.5) {
          bot.setControlState('forward', false);
          if (stateTicks % 15 === 0) bot.setControlState('sneak', !bot.getControlState('sneak')); // Sneak spam للترحيب
        }
        if (stateTicks > maxStateTicks) resetState('IDLE', 40);
      } else {
        resetState('IDLE', 20);
      }
      break;
  }
});

// 🧠 دوال مساعدة للحركة
function resetState(newState, durationTicks) {
  aiState = newState;
  stateTicks = 0;
  maxStateTicks = durationTicks;
}

function findNearestPlayer(maxDistance) {
  return bot.nearestEntity(e => e.type === 'player' && e.username !== bot.username && bot.entity.position.distanceTo(e.position) < maxDistance);
}

function moveToTarget(target, sprint) {
  bot.lookAt(target.position.offset(0, 1.6, 0), false);
  bot.setControlState('forward', true);
  if (sprint) bot.setControlState('sprint', true);
}

function speak(text) {
  if (chatCooldown > 0) return;
  chatCooldown = 100; // 5 ثواني كول داون لمنع السبام
  setTimeout(() => bot.chat(text), Math.random() * 1000 + 1000); // تأخير طبيعي للكتابة
}

// 💬 5. نظام الشات الجبار (القاموس التونسي الشامل)
bot.on('messagestr', (message, messagePosition, jsonMsg) => {
  if (message.includes(bot.username) || chatCooldown > 0) return;
  
  const msg = message.toLowerCase();
  
  // 📚 القاموس التونسي (Regex Matches) - يلقط الكلمة حتى في وسط جملة طويلة
  const regexes = {
    // 1. الشتائم والاستفزاز (يفعل حالة الغضب)
    insults: /(bot|robot|hack|bhim|jabri|mnayek|ta7an|3atba|kalb|mnayk|zeby|zbi|ta7n|khra|bhim|bhym|7mar|msatek|mstk)/i,
    // 2. التحيات
    greetings: /(slm|slam|salem|slama|aslema|3aslema|wesh|cc|bonjour|bsr|hi|hello)/i,
    // 3. السؤال عن الحال
    howAreYou: /(cv|cava|chneya|chnwa|a7welek|labes|chbik|ahwelk|chnewa)/i,
    // 4. الضحك
    laughs: /(hhh|haha|mdr|lol|xd|xdd)/i,
    // 5. السؤال عن المكان أو الهوية
    questions: /(winok|wink|fink|chkoun|chta3mal|chna3mlou|winhom)/i,
    // 6. الموافقة والتشجيع
    praise: /(m3alem|m3lem|s7i7|gg|kfo|kefo|walah|berjoulia|brjoulia|tbarkalah|bravo)/i
  };

  const replies = {
    insults: [
      'chkoun l bhim ya zamil? rani nrakaz m3ak 😡', 
      'sayeb a3leya mel klem l zayed!', 
      'taw nwariw l bot chkoun, arja3 lteli!', 
      'barra al3eb b3id ya weldi 3aychek',
      'ti ta7ki m3a pro gamer rak, chmn bot!'
    ],
    greetings: [
      'w3slm ya m3allem, anastna', 
      'ahla w sahla bel ghalin', 
      'wesh ya bro, chnya l jaw?', 
      'marhba marhba'
    ],
    howAreYou: [
      'cv hmdlh, wekel chereb re9ed fel lobby 😂', 
      'labes hmdlh, w enty chnya a7welek?', 
      'cv l7a9, dima lenna n3es 3al serveur'
    ],
    laughs: [
      'hhhhhhh ti wa7dek ya m3allem', 
      'mdr 9taltni 🤣', 
      'hhhh jaw'
    ],
    questions: [
      'rani houni fel lobby ndour وحدي', 
      'walah kima t-chouf, rakcha', 
      'ena TounsiBot, na3mel fi doura fel serveur'
    ],
    praise: [
      'walah enty l m3allem ya bro!', 
      'gg lina lkol', 
      'berjoulia serveur ta7foun', 
      'kfo 3lik'
    ]
  };

  const getReply = (arr) => arr[Math.floor(Math.random() * arr.length)];
  let response = '';

  // 🧠 تحليل الكلام والرد عليه
  if (regexes.insults.test(msg)) {
    response = getReply(replies.insults);
    setTargetAndState('ANGRY', msg);
  } 
  else if (regexes.howAreYou.test(msg)) {
    response = getReply(replies.howAreYou);
    setTargetAndState('INTERACT', msg);
  } 
  else if (regexes.greetings.test(msg)) {
    response = getReply(replies.greetings);
    setTargetAndState('GREET', msg);
  } 
  else if (regexes.questions.test(msg)) {
    response = getReply(replies.questions);
    setTargetAndState('INTERACT', msg);
  }
  else if (regexes.praise.test(msg)) {
    response = getReply(replies.praise);
    setTargetAndState('INTERACT', msg);
  }
  else if (regexes.laughs.test(msg)) {
    response = getReply(replies.laughs);
    // يقفز من الفرح
    bot.setControlState('jump', true);
    setTimeout(() => bot.setControlState('jump', false), 500);
  }

  if (response !== '') {
    speak(response);
  }
});

// تحديد هدف البوت وتغيير حالته بناءً على من يتحدث في الشات
function setTargetAndState(state, fullMessage) {
  // للبحث عن اللاعب الذي يتحدث (بحث تقريبي)
  const nearest = findNearestPlayer(30);
  if (nearest) {
    targetEntity = nearest;
    resetState(state, 120); // يتفاعل معه لمدة 6 ثواني
  }
}

// 🛡️ 6. حماية النظام
bot.on('end', () => {
  console.log('[System] انقطع الاتصال، جاري إعادة التشغيل...');
  setTimeout(() => process.exit(1), 5000);
});
bot.on('error', () => {}); // تجاهل أخطاء الشبكة المؤقتة
