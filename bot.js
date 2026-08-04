const http = require('http');
const mineflayer = require('mineflayer');

// خادم الويب الوهمي لإرضاء منصة Render
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Minecraft AFK Bot is active and running!\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`HTTP server is listening on port ${PORT}`);
});

// إعدادات بوت ماينكرافت
const bot = mineflayer.createBot({
  host: 'node-de-free-01.tickhosting.com',
  port: 50589,
  username: 'ServerGuardian',
  version: false
});

bot.on('spawn', () => {
  console.log('تم تشغيل البوت بنجاح وبدأت حركة الحراسة والتماس مع البيئة!');
  
  // نظام حركة نشط لتفعيل الفيزياء ومقاومة الخمول والماء
  setInterval(() => {
    // التحرك خطوة للأمام ثم للخلف لكي يؤثر فيه تيار الماء
    bot.setControlState('forward', true);
    setTimeout(() => {
      bot.setControlState('forward', false);
      bot.setControlState('back', true);
      setTimeout(() => {
        bot.setControlState('back', false);
      }, 1000);
    }, 1000);

    // قفزة خفيفة وتدوير الرأس
    bot.setControlState('jump', true);
    setTimeout(() => {
      bot.setControlState('jump', false);
    }, 500);
    
    const yaw = bot.entity.yaw + 0.5;
    bot.look(yaw, bot.entity.pitch);
  }, 30000); // تتكرر كل 30 ثانية
});

bot.on('end', () => {
  console.log('انقطع الاتصال، جاري إعادة المحاولة...');
  setTimeout(() => process.exit(1), 10000);
});

bot.on('error', (err) => {
  console.log('حدث خطأ:', err);
});
