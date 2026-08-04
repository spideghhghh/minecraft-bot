const http = require('http');
const mineflayer = require('mineflayer');

// 1. خادم ويب وهمي بسيط لتلبية شروط منصة Render وفتح البورت المطلوب مجاناً
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Minecraft AFK Bot is active and running!\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`HTTP server is listening on port ${PORT}`);
});

// 2. كود بوت ماينكرافت للحراسة
const bot = mineflayer.createBot({
  host: 'node-de-free-01.tickhosting.com',
  port: 50589,
  username: 'ServerGuardian',
  version: false
});

bot.on('spawn', () => {
  console.log('تم تشغيل البوت بنجاح وحراسة السيرفر نشطة!');
  
  // نظام منع الطرد (القفز وتحريك الرأس كل دقيقة)
  setInterval(() => {
    bot.setControlState('jump', true);
    setTimeout(() => {
      bot.setControlState('jump', false);
    }, 500);
    
    const yaw = bot.entity.yaw + 1;
    bot.look(yaw, bot.entity.pitch);
  }, 60000);
});

bot.on('end', () => {
  console.log('انقطع الاتصال، جاري إعادة المحاولة...');
  setTimeout(() => process.exit(1), 10000);
});

bot.on('error', (err) => {
  console.log('حدث خطأ:', err);
});
