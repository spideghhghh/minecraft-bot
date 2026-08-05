const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals: { GoalFollow } } = require('mineflayer-pathfinder');
const autoEat = require('mineflayer-auto-eat').plugin;
const express = require('express');

// ===================================================
// ⚙️ إعدادات السيرفر المباشرة (بدون ملفات خارجية)
// ===================================================
const CONFIG = {
  host: 'node-de-free-01.tickhosting.com',
  port: 50589,
  username: 'Rodbalek',
  auth: 'offline',
  reconnectDelay: 10000 // إعادة الاتصال كل 10 ثواني
};

// ===================================================
// 🌐 سيرفر WEB لضمان التشغيل 24/7 على Render
// ===================================================
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Bot Status: ONLINE 🟢'));
app.listen(PORT, () => console.log(`[Web Server] Active on port ${PORT}`));

// ===================================================
// 🤖 المحرك الرئيسي للبوت
// ===================================================
let bot = null;
let afkTimer = null;
let chatTimer = null;

function createBot() {
  console.log(`[Connecting...] Trying to join ${CONFIG.host}:${CONFIG.port}...`);

  bot = mineflayer.createBot({
    host: CONFIG.host,
    port: CONFIG.port,
    username: CONFIG.username,
    auth: CONFIG.auth,
    // ترك النسخة تلقائية يمنع الطرد السريع للمشكلات
    checkTimeoutInterval: 60000
  });

  // تحميل الإضافات
  bot.loadPlugin(pathfinder);
  bot.loadPlugin(autoEat);

  bot.once('spawn', () => {
    console.log(`[SUCCESS] ✅ Bot '${bot.username}' joined the server successfully!`);

    // إعداد الأكل التلقائي
    bot.autoEat.options = { priority: 'foodPoints', startAt: 14 };

    // نظام الحركة الذكية Anti-AFK
    if (afkTimer) clearInterval(afkTimer);
    afkTimer = setInterval(() => {
      if (!bot || !bot.entity) return;

      const yaw = Math.random() * Math.PI * 2;
      const pitch = (Math.random() - 0.5) * Math.PI;
      bot.look(yaw, pitch, true);
      bot.swingArm('mainhand');

      if (Math.random() > 0.5) {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 400);
      }
    }, 15000);

    // نظام الدردشة التلقائية
    const messages = [
      "Hani mrigel f24/7!",
      "Subscribe To Tyrox!",
      "Aya marhba bel jme3a!"
    ];
    let msgIdx = 0;
    if (chatTimer) clearInterval(chatTimer);
    chatTimer = setInterval(() => {
      if (bot && bot.entity) {
        bot.chat(messages[msgIdx]);
        msgIdx = (msgIdx + 1) % messages.length;
      }
    }, 60000);
  });

  // ===================================================
  // 💬 التفاعل والتجاوب الذكي مع اللاعبين
  // ===================================================
  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    const msg = message.toLowerCase();

    // ردود حية ومحاكاة بشرية
    if (msg.includes('aslema') || msg.includes('hi') || msg.includes('مرحبا') || msg.includes('هلا')) {
      setTimeout(() => bot.chat(`Aslema ya ${username}!`), 2000);
    } 
    else if (msg.includes('cv') || msg.includes('كيفك') || msg.includes('labes')) {
      setTimeout(() => bot.chat('Hamdoullah labes 100%, w enti?'), 2000);
    } 
    // أمر التتبع: تعال / ijani
    else if (msg.includes('ijani') || msg.includes('تعال')) {
      const target = bot.players[username]?.entity;
      if (target) {
        bot.chat(`Jayik ya ${username}!`);
        const mcData = require('minecraft-data')(bot.version);
        const defaultMove = new Movements(bot, mcData);
        bot.pathfinder.setMovements(defaultMove);
        bot.pathfinder.setGoal(new GoalFollow(target, 2), true);
      } else {
        bot.chat(`Mani3ch chafek ya ${username}, 9rabli chwaya!`);
      }
    } 
    // أمر التوقف: o9of / وقف
    else if (msg.includes('o9of') || msg.includes('وقف')) {
      bot.chat('Mrigel wa9aft!');
      bot.pathfinder.setGoal(null);
    }
  });

  bot.on('health', () => {
    if (bot.food < 15) bot.autoEat.eat().catch(() => {});
  });

  bot.on('kicked', (reason) => console.log('[KICKED]:', reason));
  bot.on('error', (err) => console.error('[ERROR]:', err.message));

  bot.on('end', () => {
    console.log(`[DISCONNECTED] Retrying connection in ${CONFIG.reconnectDelay / 1000} seconds...`);
    if (afkTimer) clearInterval(afkTimer);
    if (chatTimer) clearInterval(chatTimer);
    setTimeout(createBot, CONFIG.reconnectDelay);
  });
}

createBot();
