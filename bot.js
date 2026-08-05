const http = require('http');
const mineflayer = require('mineflayer');

// 1. سيرفر الويب باش يخلي الخدمة تخدم 24/7 على Render بلاش
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<h1>✅ Tounsi AI Bot is Running Perfectly 24/7!</h1>');
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`[Web Server] Ye5dem 3al port ${PORT}`));

// 2. إعدادات البوت الذكي
const bot = mineflayer.createBot({
  host: 'node-de-free-01.tickhosting.com',
  port: 50589,
  username: 'TounsiBot', // تنجم تبدلها كيما تحب
  version: false
});

let isGreeting = false; // باش ما يعلقش وهو يسلم على العباد

bot.on('spawn', () => {
  console.log('✨ [System] L\'bot d5al lel serveur! AI activé.');
  
  // نقزة صغيرة لتفادي الترسبن داخل بلوكة
  bot.setControlState('jump', true);
  setTimeout(() => bot.setControlState('jump', false), 800);
  
  startAdvancedAI();
});

// 3. العقل المدبر (Advanced AI Engine)
function startAdvancedAI() {
  setInterval(() => {
    try {
      if (isGreeting) return; // كانو قاعد يسلم على واحد، خليه يكمل

      const actions = ['walk', 'lookAround', 'jump', 'chill', 'swing'];
      const action = actions[Math.floor(Math.random() * actions.length)];

      switch (action) {
        case 'walk':
          // يمشي في اتجاه عشوائي
          const yaw = bot.entity.yaw + (Math.random() - 0.5) * 3;
          bot.look(yaw, 0, true);
          bot.setControlState('forward', true);
          
          // نظام تفادي العقبات (Anti-Stuck): كان لقدامو مسكر، ينقز
          let walkTime = 0;
          const walkInterval = setInterval(() => {
            if (bot.entity.isCollidedHorizontally) {
              bot.setControlState('jump', true); // ينقز كان ضرب في بلوكة أو NPC
              setTimeout(() => bot.setControlState('jump', false), 300);
            }
            walkTime += 100;
            if (walkTime >= 1500) {
              clearInterval(walkInterval);
              bot.setControlState('forward', false);
            }
          }, 100);
          break;

        case 'lookAround':
          // يتلفت بطريقة واقعية
          const newYaw = bot.entity.yaw + (Math.random() - 0.5) * 2;
          const newPitch = (Math.random() - 0.5) * 0.5;
          bot.look(newYaw, newPitch, true);
          break;

        case 'jump':
          bot.setControlState('jump', true);
          setTimeout(() => bot.setControlState('jump', false), 250);
          break;

        case 'swing':
          // يضرب بيدو في الهواء (حركة مشهورة للملاعبية اللي فادين)
          bot.swingArm('right');
          break;

        case 'chill':
          // ياقف يتأمل
          break;
      }
    } catch (err) {
      console.log('[AI Error] مشكلة صغيرة تم تجاوزها: ', err.message);
    }
  }, Math.random() * 3000 + 2000); // قرار جديد كل 2 إلى 5 ثواني
}

// 4. التفاعل البشري المتقدم (Human-like Interactions)
bot.on('physicsTick', () => {
  try {
    if (isGreeting) return; // تفادي التكرار

    // يلوج على أقرب لاعب ليه (موش NPC وموش روحو)
    const nearestPlayer = bot.nearestEntity(entity => entity.type === 'player' && entity.username !== bot.username);
    
    if (nearestPlayer && bot.entity.position.distanceTo(nearestPlayer.position) < 4) {
      isGreeting = true;
      
      // يغزرلو لراسو
      bot.lookAt(nearestPlayer.position.offset(0, 1.6, 0), true);
      
      // يسلم عليه بالطريقة الماينكرافتية (Sneak & Swing)
      bot.setControlState('sneak', true);
      bot.swingArm('right');
      
      setTimeout(() => {
        bot.setControlState('sneak', false);
        bot.swingArm('left');
        
        setTimeout(() => {
          bot.setControlState('sneak', true);
          setTimeout(() => {
            bot.setControlState('sneak', false);
            isGreeting = false; // كمل الترحيب، يرجع لحياتو الطبيعية
          }, 200);
        }, 200);
      }, 200);
    }
  } catch (err) {}
});

// 5. نظام الشات الذكي (Smart Chat Engine) بالفرنكو
bot.on('messagestr', (message) => {
  try {
    // كان الميساج من البوت نفسو أو من السيرفر (زيادات فلوس وغيرها)، طفّيه
    if (message.includes(bot.username) || message.includes('added to your account') || message.includes('AFK')) return;
    
    const msg = message.toLowerCase();
    
    // قاموس الإجابات التونسية الذكية
    const greetings = ['w3slm ya m3allem', 'marhba bik ya 5ouya', 'ahla w sahla', 'wesh ya bro'];
    const howAreYou = ['cv hmdlh, wekel chereb re9ed fel lobby 😂', 'hmdlh, rakcha 24/7', 'cv w enty chnya jawik?'];
    const botAccusation = ['chkoun l bot ya m3allem? rani m3ak b 9albi w rabi 🇹🇳', 'bot fi 3inek, rani pro gamer hhh', 'taw yjiblek rabi bot, ena Tounsi 100%'];
    const general = ['hhhhh', 'ey s7i7', 'lol', 'jaw kbir'];

    // دالة لاختيار رد عشوائي باش ما يبانش روبوت
    const randomReply = (array) => array[Math.floor(Math.random() * array.length)];

    if (msg.match(/\b(slm|slam|slama|salem|cc|hi|hello|wesh)\b/)) {
      setTimeout(() => bot.chat(randomReply(greetings)), 1500); // يستنى ثانية ونص باش يبان يكتب
    } 
    else if (msg.match(/\b(cv|ca va|chnwa|chneya|a7welek)\b/)) {
      setTimeout(() => bot.chat(randomReply(howAreYou)), 2000);
    } 
    else if (msg.match(/\b(bot|robot|afk)\b/)) {
      setTimeout(() => bot.chat(randomReply(botAccusation)), 1500);
    }
    // كان واحد ضحك (hhh)، البوت يضحك معاه
    else if (msg.match(/\b(hhh|haha|mdr|lol)\b/)) {
      setTimeout(() => bot.chat('hhhhhhh'), 1000);
    }
  } catch (err) {}
});

// 6. الحماية من الطرد وإعادة الاتصال التلقائي
bot.on('end', (reason) => {
  console.log(`[System] Connexion t9asset (السبب: ${reason})... bech n3awdou nconectiw fi 5 ثواني.`);
  setTimeout(() => process.exit(1), 5000); // الـ Render باش يعاود يشعلو وحدو
});

bot.on('error', (err) => {
  console.log('[System Error] Famma mochkel, ama l\'bot mrigel: ', err.message);
});
