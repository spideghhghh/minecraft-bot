const http = require('http');
const mineflayer = require('mineflayer');

// 1. خادم الويب للبقاء متصلاً 24/7 مجاناً على Render
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Ultimate SMP Guide Tounsi Bot is Active 24/7.\n');
}).listen(process.env.PORT || 3000);

// 2. إعدادات البوت (اسم متوافق مع SMP)
const bot = mineflayer.createBot({
  host: 'node-de-free-01.tickhosting.com',
  port: 50589,
  username: 'GuideTounsi',
  version: false
});

// 🧠 3. متغيرات الذاكرة والعقل
let aiState = 'IDLE'; 
let stateTicks = 0; 
let maxStateTicks = 120; 
let targetEntity = null;
let chatCooldown = 0;
let lastJumpTick = 0;
const usedReplies = new Set(); // منع تكرار نفس الرد تماماً لزيادة الواقعية

bot.on('spawn', () => {
  console.log('✨ [System] المرشد الأسطوري التونسي دخل للسيرفر وجاهز!');
  bot.setControlState('jump', true);
  setTimeout(() => bot.setControlState('jump', false), 500);
});

// 🏃‍♂️ 4. المحرك الفيزيائي الواقعي (20 مرة في الثانية)
bot.on('physicsTick', () => {
  if (!bot.entity) return;

  stateTicks++;
  if (chatCooldown > 0) chatCooldown--;

  // نظام القفز التلقائي فوق العقبات
  const isMoving = bot.getControlState('forward') || bot.getControlState('sprint');
  if (isMoving && bot.entity.isCollidedHorizontally && (stateTicks - lastJumpTick > 15)) {
    bot.setControlState('jump', true);
    lastJumpTick = stateTicks;
  } else if (!bot.entity.isCollidedHorizontally) {
    bot.setControlState('jump', false);
  }

  // إدارة الحالات النفسية والجسدية
  switch (aiState) {
    case 'IDLE':
      bot.clearControlStates();
      if (stateTicks > maxStateTicks) {
        const rand = Math.random();
        if (rand < 0.5) {
          // استكشاف هادئ في اللوبي
          const yaw = bot.entity.yaw + (Math.random() - 0.5) * 2.5;
          bot.look(yaw, 0, false);
          resetState('WANDER', Math.floor(Math.random() * 50 + 25));
        } else {
          // التفت حوله لمراقبة اللاعبين
          const nearest = bot.nearestEntity(e => e.type === 'player' && e.username !== bot.username);
          if (nearest && bot.entity.position.distanceTo(nearest.position) < 8) {
            bot.lookAt(nearest.position.offset(0, 1.6, 0), false);
          }
          resetState('IDLE', Math.floor(Math.random() * 40 + 30));
        }
      }
      break;

    case 'WANDER':
      bot.setControlState('forward', true);
      if (Math.random() < 0.03) bot.setControlState('sprint', true);
      if (stateTicks > maxStateTicks) {
        bot.clearControlStates();
        resetState('IDLE', Math.floor(Math.random() * 80 + 40));
      }
      break;

    case 'ANGRY':
    case 'INTERACT':
    case 'GUIDE':
      if (targetEntity && targetEntity.position) {
        moveToTarget(targetEntity, false);
        if (bot.entity.position.distanceTo(targetEntity.position) < 2.5) {
          bot.setControlState('forward', false);
          bot.lookAt(targetEntity.position.offset(0, 1.6, 0), false);
          if (aiState === 'ANGRY' && stateTicks % 10 === 0) bot.swingArm('right');
          if (aiState === 'INTERACT' && stateTicks % 20 === 0) bot.setControlState('sneak', !bot.getControlState('sneak'));
        }
        if (stateTicks > maxStateTicks) {
          bot.clearControlStates();
          targetEntity = null;
          resetState('IDLE', 60);
        }
      } else {
        resetState('IDLE', 30);
      }
      break;
  }
});

function resetState(newState, durationTicks) {
  aiState = newState;
  stateTicks = 0;
  maxStateTicks = durationTicks;
}

function moveToTarget(target, sprint) {
  bot.lookAt(target.position.offset(0, 1.6, 0), false);
  bot.setControlState('forward', true);
  if (sprint) bot.setControlState('sprint', true);
}

function speak(text) {
  if (chatCooldown > 0) return;
  chatCooldown = 160; // 8 ثواني كول داون لضمان عدم السبام نهائياً
  setTimeout(() => bot.chat(text), Math.random() * 1000 + 800);
}

// دالة لاختيار رد فريد بدون تكرار
function getUniqueReply(array) {
  const available = array.filter(item => !usedReplies.has(item));
  if (available.length === 0) {
    usedReplies.clear();
    return array[Math.floor(Math.random() * array.length)];
  }
  const chosen = available[Math.floor(Math.random() * available.length)];
  usedReplies.add(chosen);
  if (usedReplies.size > 25) usedReplies.clear();
  return chosen;
}

// 💬 5. نظام الشات والقاموس التونسي الشامل + مرشد البلوغنات المتطور
bot.on('messagestr', (message) => {
  // تجاهل رسائل البوت نفسه أو رسائل النظام المتكررة
  if (message.includes(bot.username) || message.includes('added to your account') || message.includes('AFK Shards') || chatCooldown > 0) return;
  
  const msg = message.toLowerCase();
  let response = '';
  let targetState = 'INTERACT';

  // 📚 القاموس التونسي الشامل ومرشد البلوغنات (SMP Plugins Guide)
  const categories = {
    // أسرار وظائف البلوغنات (Plugins Explanations)
    pluginsHelp: {
      regex: /(jobs|wazaif|خدمة|خدمان|rtp|random|teleport|انتقال|عشوائي|crates|sandouq|صندوق|crates|axafk|afk|ايفك|خمول|vaults|shulkers|صناديق|vault|auction|market|سوق|بيع|شراء)/i,
      replies: [
        'hab ydir job? emshi lel NPC wela ekteb /jobs bash t5edem w tdir flous fel serveur!',
        't7eb teta9al b 3ochwaya? esta3mel /rtp w taw yرميك في بلاصة عشوائية في العالم.',
        'el Crates (ExcellentCrates) tal9ahom fel lobby, a3tiha key w jarreb zhoork!',
        'zone l\'AFK (AxAFKZone) te3tيك coins w afk shards ki tbander gadi w tרقد!',
        't7eb tbi3 w tchri? sta3mel AuctionHouse wela l Market mte3 serveur.',
        'el Vaults w Shulkers ya3tiwk msa7et takhzin zayda bash matet9alch inventory mte3k.'
      ]
    },
    // السبت والشتائم والاستفزاز
    insults: {
      regex: /(bot|robot|hack|bhim|jabri|mnayek|ta7an|3atba|kalb|mnayk|zeby|zbi|ta7n|khra|bhym|7mar|msatek)/i,
      replies: [
        'chkoun l bhim ya zamil? rani guide mte3 serveur mouch bot!',
        'sayeb a3leya mel klem l zayed, rani player kifek',
        'taw nwariw l bot chkoun, arja3 lteli w rkez m3aya',
        'barra al3eb b3id ya weldi 3aychek, rak ta3mel fi fazat fargheya'
      ]
    },
    // التحيات التونسية الكاملة
    greetings: {
      regex: /(slm|slam|salem|slama|aslema|3aslema|wesh|cc|bonjour|bsr|hi|hello|marhba)/i,
      replies: [
        'w3slm ya m3allem, anastna fel SMP!',
        'ahla w sahla bel ghalin, chnewa jawik?',
        'wesh ya bro, marhba bik fi LaMohen Server',
        'aslema ya m3allem, rani houni n3es w n3awen fel louled'
      ]
    },
    // السؤال عن الحال
    howAreYou: {
      regex: /(cv|cava|chneya|chnwa|a7welek|labes|chbik|ahwelk|chnewa|ca va)/i,
      replies: [
        'cv hmdlh, wekel chereb re9ed fel lobby w n9ari fil louled 😂',
        'labes hmdlh, w enty chnya a7welek m3a el surv?',
        'cv l7a9, dima lenna n9ariw fel 3باد 9anoun serveur'
      ]
    },
    // الضحك والتفاعل
    laughs: {
      regex: /(hhh|haha|mdr|lol|xd|xdd)/i,
      replies: [
        'hhhhhhh ti wa7dek ya m3allem jawk 3al 3alam',
        'mdr 9taltni bel da7k 🤣',
        'jaw kbir houni fel serveur hhhh'
      ]
    },
    // السؤال عن المكان والمهام
    questions: {
      regex: /(winok|wink|fink|chkoun|chta3mal|chna3mlou|winhom|plugins|بلوغن)/i,
      replies: [
        'rani houni fel lobby nraقب في الـ plugins w n3awen f lyouled',
        'walah kima t-chouf, na3mel fi doura w nfasir fel 2adawat',
        'el server fih 60 plugin mriglin, ken t7eb 7aja o5ra sa9si w njawbek'
      ]
    },
    // التشجيع والمدح
    praise: {
      regex: /(m3alem|m3lem|s7i7|gg|kfo|kefo|walah|berjoulia|brjoulia|tbarkalah|bravo)/i,
      replies: [
        'walah enty l m3allem ya bro, rabi yfdlek',
        'gg lina lkol, serveur ta7foun w nsanou ndhif',
        'berjoulia el a5laq houni 10% 10'
      ]
    }
  };

  // مطابقة الرسالة مع الكلمات المفتاحية
  for (const key in categories) {
    if (categories[key].regex.test(msg)) {
      response = getUniqueReply(categories[key].replies);
      if (key === 'insults') targetState = 'ANGRY';
      break;
    }
  }

  // إذا وجدنا رداً مناسباً، نحدد الهدف (أقرب لاعب) ونتوجه إليه بذكاء
  if (response !== '') {
    const nearest = bot.nearestEntity(e => e.type === 'player' && e.username !== bot.username);
    if (nearest && bot.entity.position.distanceTo(nearest.position) < 20) {
      targetEntity = nearest;
      resetState(targetState, 140);
    }
    speak(response);
  }
});

// 🛡️ 6. حماية النظام ضد الانقطاع
bot.on('end', () => {
  console.log('[System] انقطع الاتصال، جاري إعادة التشغيل الفوري...');
  setTimeout(() => process.exit(1), 5000);
});
bot.on('error', () => {}); // تجاهل أخطاء الشبكة المؤقتة
