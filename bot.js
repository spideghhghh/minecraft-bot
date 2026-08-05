const http = require('http');
const mineflayer = require('mineflayer');

// سيرفر ويب وهمي باش Render يخليه يخدم 24/7 بلاش
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('System Online.\n');
}).listen(process.env.PORT || 3000);

// إعدادات البوت (اسم يبان كأنه لاعب حقيقي قديم في السيرفر)
const bot = mineflayer.createBot({
  host: 'node-de-free-01.tickhosting.com',
  port: 50589,
  username: 'Tounsi_Pro',
  version: false
});

// ذاكرة وعقل البوت
let aiState = 'IDLE'; 
let stateTicks = 0; 
let maxStateTicks = 140; 
let targetEntity = null;
let chatCooldown = 0;
let lastJumpTick = 0;
const usedReplies = new Set();

bot.on('spawn', () => {
  console.log('✨ [System] Tounsi_Pro d5al lel serveur.');
  bot.setControlState('jump', true);
  setTimeout(() => bot.setControlState('jump', false), 400);
});

// المحرك الفيزيائي الخارق (حل نهائي للارتطام بالعقبات)
bot.on('physicsTick', () => {
  if (!bot.entity) return;

  stateTicks++;
  if (chatCooldown > 0) chatCooldown--;

  // نظام تفادي العقبات والقفز الفوري الذكي
  const isMoving = bot.getControlState('forward') || bot.getControlState('sprint');
  if (isMoving && bot.entity.isCollidedHorizontally && (stateTicks - lastJumpTick > 10)) {
    bot.setControlState('jump', true);
    lastJumpTick = stateTicks;
  } else if (!bot.entity.isCollidedHorizontally && stateTicks - lastJumpTick > 10) {
    bot.setControlState('jump', false);
  }

  // الحالات النفسية والحركة الحقيقية
  switch (aiState) {
    case 'IDLE':
      bot.clearControlStates();
      if (stateTicks > maxStateTicks) {
        const rand = Math.random();
        if (rand < 0.6) {
          // استكشاف هادئ في اللوبي
          const yaw = bot.entity.yaw + (Math.random() - 0.5) * 3;
          bot.look(yaw, 0, false);
          resetState('WANDER', Math.floor(Math.random() * 60 + 30));
        } else {
          // مراقبة المحيط
          const nearest = bot.nearestEntity(e => e.type === 'player' && e.username !== bot.username);
          if (nearest && bot.entity.position.distanceTo(nearest.position) < 10) {
            bot.lookAt(nearest.position.offset(0, 1.6, 0), false);
          }
          resetState('IDLE', Math.floor(Math.random() * 50 + 20));
        }
      }
      break;

    case 'WANDER':
      bot.setControlState('forward', true);
      if (Math.random() < 0.04) bot.setControlState('sprint', true);
      if (stateTicks > maxStateTicks) {
        bot.clearControlStates();
        resetState('IDLE', Math.floor(Math.random() * 70 + 30));
      }
      break;

    case 'INTERACT':
    case 'GUIDE':
      if (targetEntity && targetEntity.position) {
        bot.lookAt(targetEntity.position.offset(0, 1.6, 0), false);
        if (bot.entity.position.distanceTo(targetEntity.position) > 3) {
          bot.setControlState('forward', true);
        } else {
          bot.setControlState('forward', false);
          if (stateTicks % 20 === 0) bot.setControlState('sneak', !bot.getControlState('sneak'));
        }
        if (stateTicks > maxStateTicks) {
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

function speak(text) {
  if (chatCooldown > 0) return;
  chatCooldown = 140; // منع السبام التام (رد واحد كل 7 ثواني كحد أدنى)
  setTimeout(() => bot.chat(text), Math.random() * 800 + 700);
}

function getUniqueReply(array) {
  const available = array.filter(item => !usedReplies.has(item));
  if (available.length === 0) {
    usedReplies.clear();
    return array[Math.floor(Math.random() * array.length)];
  }
  const chosen = available[Math.floor(Math.random() * available.length)];
  usedReplies.add(chosen);
  if (usedReplies.size > 30) usedReplies.clear();
  return chosen;
}

// القاموس التونسي الشامل + دليل البلوغنات الكامل (Plugins Guide)
bot.on('messagestr', (message) => {
  if (message.includes(bot.username) || message.includes('added to your account') || message.includes('AFK Shards') || chatCooldown > 0) return;
  
  const msg = message.toLowerCase();
  let response = '';

  const knowledgeBase = {
    // 1. شرح بلوغنات السيرفر (Jobs, RTP, Crates, AFK, Auction, Vaults...)
    plugins: {
      regex: /(jobs|wazaif|خدمة|خدمان|rtp|random|teleport|انتقال|عشوائي|crates|sandouq|صندوق|axafk|afk|ايفك|خمول|vaults|shulkers|صناديق|vault|auction|market|سوق|بيع|شراء|rtp|crates|kits|رتب)/i,
      replies: [
        'hab t5edem w tdir flous? ekteb /jobs w e5tar 5edmtk fel serveur!',
        't7eb teta9al b 3ochwaya? esta3mel /rtp taw ywihk fi blasa o5ra fel map.',
        'el Crates (ExcellentCrates) talgahom fel lobby, a3tiha key w jarreb zhoork ken t ربح.',
        'zone l\'AFK (AxAFKZone) te3tik coins w shards ki tbander gadi w tra9ed!',
        't7eb tbi3 w tchri m3a l 3bed? sta3mel /ah (AuctionHouse) wela l Market.',
        'el Vaults w Shulkers ya3tiwk msa7et takhzin zayda bash inventory mte3k matet9alch.'
      ]
    },
    // 2. التحيات التونسية الأصلية
    greetings: {
      regex: /(slm|slam|salem|slama|aslema|3aslema|wesh|cc|bonjour|bsr|hi|hello|marhba)/i,
      replies: [
        'w3slm ya m3allem, anastna fel SMP!',
        'ahla w sahla bel ghalin, chnewa jawik?',
        'wesh ya bro, marhba bik fi LaMohen Server',
        'aslema ya m3allem, rani houni n3es w n3awen'
      ]
    },
    // 3. السؤال عن الحال
    howAreYou: {
      regex: /(cv|cava|chneya|chnwa|a7welek|labes|chbik|ahwelk|chnewa|ca va)/i,
      replies: [
        'cv hmdlh, wekel chereb re9ed fel lobby 😂',
        'labes hmdlh, w enty chnya a7welek m3a el surv?',
        'cv l7a9, dima lenna n9ariw fel 3bad'
      ]
    },
    // 4. الضحك التونسي
    laughs: {
      regex: /(hhh|haha|mdr|lol|xd|xdd)/i,
      replies: [
        'hhhhhhh ti wa7dek ya m3allem jawk 3al 3alam',
        'mdr 9taltni bel da7k 🤣',
        'jaw kbir houni fel serveur hhhh'
      ]
    },
    // 5. الاستفزاز أو اتهامه بأنه بوت
    insults: {
      regex: /(bot|robot|hack|bhim|jabri|mnayek|ta7an|3atba|kalb|mnayk|zeby|zbi|ta7n|khra|bhym|7mar|msatek)/i,
      replies: [
        'chkoun l bhim ya zamil? rani player kifek mouch bot!',
        'sayeb a3leya mel klem l zayed ya m3allem',
        'taw nwariw l bot chkoun, arja3 lteli w rkez m3aya',
        'barra al3eb b3id ya weldi 3aychek'
      ]
    },
    // 6. المساعدة والاستفسارات العامة
    help: {
      regex: /(winok|wink|fink|chkoun|chta3mal|chna3mlou|winhom|plugins|بلوغن|help|مساعدة)/i,
      replies: [
        'rani houni fel lobby nraقب في الـ plugins w n3awen f lyouled',
        'walah kima t-chouf, na3mel fi doura w nfasir fel adawat',
        'el server fih 60 plugin mriglin, ken t7eb 7aja o5ra saqsi w njawbek'
      ]
    }
  };

  for (const key in knowledgeBase) {
    if (knowledgeBase[key].regex.test(msg)) {
      response = getUniqueReply(knowledgeBase[key].replies);
      break;
    }
  }

  if (response !== '') {
    const nearest = bot.nearestEntity(e => e.type === 'player' && e.username !== bot.username);
    if (nearest && bot.entity.position.distanceTo(nearest.position) < 15) {
      targetEntity = nearest;
      resetState('GUIDE', 120);
    }
    speak(response);
  }
});

// الحماية الشاملة وإعادة الاتصال السريع
bot.on('end', () => {
  setTimeout(() => process.exit(1), 3000);
});
bot.on('error', () => {});
