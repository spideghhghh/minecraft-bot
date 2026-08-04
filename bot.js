const http = require('http');
const mineflayer = require('mineflayer');

// خادم ويب وهمي لمنصة Render لتبقى الخطة مجانية للأبد
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Smart Human-like Minecraft Bot is running 24/7!\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`HTTP server is listening on port ${PORT}`);
});

// إعدادات البوت الذكي
const bot = mineflayer.createBot({
  host: 'node-de-free-01.tickhosting.com',
  port: 50589,
  username: 'ServerGuardian',
  version: false
});

bot.on('spawn', () => {
  console.log('✨ تم تشغيل البوت الذكي بنجاح، وأصبح يتصرف كلاعب حقيقي تماماً!');
  startHumanAI();
});

// نظام الذكاء الاصطناعي والحركات العشوائية الشبيهة بالبشر
function startHumanAI() {
  setInterval(() => {
    // اختيار سلوك بشري عشوائي
    const humanActions = ['walk', 'lookAround', 'jump', 'sneak', 'chill'];
    const chosenAction = humanActions[Math.floor(Math.random() * humanActions.length)];

    switch (chosenAction) {
      case 'walk':
        // المشي في اتجاه عشوائي لفترة قصيرة
        const directions = ['forward', 'back', 'left', 'right'];
        const randomDir = directions[Math.floor(Math.random() * directions.length)];
        bot.setControlState(randomDir, true);
        setTimeout(() => {
          bot.setControlState(randomDir, false);
        }, Math.random() * 1500 + 500); // بين نصف ثانية وثانيتين
        break;

      case 'lookAround':
        // التلفت الطبيعي بالرأس يميناً ويساراً
        const newYaw = bot.entity.yaw + (Math.random() - 0.5) * 2.5;
        const newPitch = (Math.random() - 0.5) * 0.6;
        bot.look(newYaw, newPitch, true);
        break;

      case 'jump':
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 300);
        break;

      case 'sneak':
        bot.setControlState('sneak', true);
        setTimeout(() => bot.setControlState('sneak', false), 2000);
        break;

      case 'chill':
        // وقفة تأمل أو راحة (لا يفعل شيئاً وكأن اللاعب بعيد عن الكيبورد قليلاً)
        break;
    }
  }, Math.random() * 8000 + 4000); // يتخذ قراراً جديداً كل 4 إلى 12 ثانية عشوائياً
}

// ميزة ذكية: الالتفات التلقائي نحو أي لاعب يقترب منه (كأنه ينظر إليه)
bot.on('physicsTick', () => {
  const playerEntity = bot.nearestEntity((entity) => entity.type === 'player' && entity.username !== bot.username);
  if (playerEntity) {
    const distance = playerEntity.position.distanceTo(bot.entity.position);
    // إذا كان اللاعب على مسافة 6 بلوكات أو أقل، التفت وانظر إليه
    if (distance < 6) {
      bot.lookAt(playerEntity.position.offset(0, playerEntity.height, 0));
    }
  }
});

// ميزة تفاعلية: الرد على الشات
bot.on('chat', (username, message) => {
  if (username === bot.username) return;
  
  if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('مرحبا') || message.toLowerCase().includes('سلام')) {
    bot.chat(`أهلاً بك يا ${username}! أنا حارس السيرفر الذكي 🛡️`);
  }
});

// إعادة الاتصال التلقائي في حال انقطاع السيرفر
bot.on('end', () => {
  console.log('انقطع الاتصال بالسيرفر، جاري إعادة المحاولة خلال ثوانٍ...');
  setTimeout(() => process.exit(1), 5000);
});

bot.on('error', (err) => {
  console.log('حدث خطأ في البوت:', err);
});
