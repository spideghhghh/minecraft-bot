const http = require('http');
const mineflayer = require('mineflayer');

// سيرفر ويب وهمي باش Render ما يقصش عليه (يخدم 24/7 بلاش)
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot Tounsi Mrigel w ye5dem 24/7!\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serveur ye5dem 3al port ${PORT}`);
});

// إعدادات البوت التونسي
const bot = mineflayer.createBot({
  host: 'node-de-free-01.tickhosting.com',
  port: 50589,
  username: 'TounsiBot', // تنجم ترجعها ServerGuardian كان تحب
  version: false
});

bot.on('spawn', () => {
  console.log('✨ L\'bot d5al lel serveur w jawou behi, bda y7awes fel lobby!');
  startTunisianGamerAI();
});

// الذكاء الاصطناعي متاع البوت باش يتصرف كإنسان
function startTunisianGamerAI() {
  setInterval(() => {
    // 1. يلوج على أقرب حاجة مثيرة للاهتمام (NPCs، لاعبين، أو Holograms اللي هوما ArmorStands)
    const interestingEntity = bot.nearestEntity((entity) => {
      return (entity.type === 'player' && entity.username !== bot.username) || 
             entity.name === 'armor_stand' || 
             entity.type === 'mob';
    });

    // 2. كان فما حاجة قريبة ليه (أقل من 10 بلوكات)
    if (interestingEntity && bot.entity.position.distanceTo(interestingEntity.position) < 10) {
      
      // يغزر لراس الـ NPC أو يقرا الهولوغرام (يطلع راسو الفوق شوية)
      const targetPos = interestingEntity.position.clone();
      targetPos.y += (interestingEntity.name === 'armor_stand' ? 2.5 : 1.6);
      bot.lookAt(targetPos, true);
      
      // فما احتمال صغير إنه يقدم شوية كأنه يقرب باش يقرا مليح
      if (Math.random() > 0.7 && bot.entity.position.distanceTo(interestingEntity.position) > 3) {
         bot.setControlState('forward', true);
         setTimeout(() => bot.setControlState('forward', false), 1000); // يقدم ثانية ويحبس
      }
      
    } else {
      // 3. كان ما فما حد بحذاه، يحوس وحدو في اللوبي
      const actions = ['walk', 'look', 'jump', 'chill'];
      const action = actions[Math.floor(Math.random() * actions.length)];

      if (action === 'walk') {
        // يمشي القدام في اتجاه عشوائي
        const yaw = bot.entity.yaw + (Math.random() - 0.5) * 2;
        bot.look(yaw, 0, true);
        bot.setControlState('forward', true);
        setTimeout(() => bot.setControlState('forward', false), Math.random() * 2000 + 500); // يمشي بين نص ثانية وثانيتين
      } 
      else if (action === 'look') {
        // يتلفت يمين ويسار يسكاني في البلاصة
        const yaw = bot.entity.yaw + (Math.random() - 0.5) * 3;
        const pitch = (Math.random() - 0.5) * 0.5;
        bot.look(yaw, pitch, true);
      } 
      else if (action === 'jump') {
        // ينقز نقزة خفيفة كأي Gamer فادد
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 300);
      }
      // الـ 'chill' معناها يبقى رايض ما يعمل شيء (Pause طبيعية)
    }
  }, 3000); // ياخو قرار جديد كل 3 ثواني باش تبان الحركة Smooth وواقعية
}

// التفاعل في الشات بالفرنكو التونسي
bot.on('chat', (username, message) => {
  if (username === bot.username) return;
  
  const msg = message.toLowerCase();
  
  if (msg.includes('slm') || msg.includes('slam') || msg.includes('slama')) {
    bot.chat(`w3slm ya ${username}, chnya a7welek ya m3allem?`);
  } else if (msg.includes('chneya') || msg.includes('cv') || msg.includes('ca va') || msg.includes('chnwa')) {
    bot.chat('cv hmdlh, rakcha fel lobby 24/7');
  } else if (msg.includes('wesh') || msg.includes('winok')) {
    bot.chat(`wesh rani houni n3es 3la serveur ya 5ouya`);
  } else if (msg.includes('bot')) {
    bot.chat(`chkoun l bot ya m3allem? ena rani player 3al 3alamia 😂`);
  }
});

// كان طاح السيرفر يعاود يدخل وحدو
bot.on('end', () => {
  console.log('Connexion t9asset... bech n3awdou nconectiw tawwa.');
  setTimeout(() => process.exit(1), 5000);
});

bot.on('error', (err) => {
  console.log('Famma mochkel:', err);
});
