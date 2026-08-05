require('dotenv').config();
const mineflayer = require('mineflayer');
const chalk = require('chalk');

// 1. تشغيل الموقع الوهمي لمنع إغلاق الاستضافة (Render / Replit)
const startWebServer = require('./web/server');
startWebServer();

// 2. استدعاء الموديولات والأجهزة الوظيفية
const settings = require('./config/settings');
const { initMovement } = require('./modules/botMovement');
const { initChatAssistant } = require('./modules/chatAssistant');
const { initEventEngine } = require('./modules/eventEngine');
const { initModeration } = require('./modules/moderation');

// إعدادات إنشاء البوت
const botOptions = {
    host: settings.server.host,
    port: settings.server.port,
    username: settings.bot.username,
    version: settings.server.version,
    auth: settings.bot.authType
};

let bot = null;

function createBotInstance() {
    console.log(chalk.yellow('[SYSTEM] Connecting to Minecraft Server...'));
    
    bot = mineflayer.createBot(botOptions);

    // ==========================================
    // عند تسجيل الدخول بنجاح
    // ==========================================
    bot.once('spawn', () => {
        console.log(chalk.green(`[SUCCESS] Bot "${bot.username}" joined the server successfully!`));
        
        // إرسال رسالة عند الدخول
        bot.chat('Hello everyone! AdminBot is now online to help and host events!');

        // تفعيل الأنظمة والموديولات المختلفة
        initMovement(bot);
        initChatAssistant(bot);
        initEventEngine(bot);
        initModeration(bot);
    });

    // ==========================================
    // التعامل مع الأخطاء وإعادة الاتصال التلقائي
    // ==========================================
    bot.on('kicked', (reason) => {
        console.log(chalk.red(`[KICKED] Bot was kicked from server. Reason:`), reason);
    });

    bot.on('error', (err) => {
        console.log(chalk.red(`[ERROR] Connection error:`), err.message || err);
    });

    bot.on('end', (reason) => {
        console.log(chalk.yellow(`[DISCONNECT] Disconnected (${reason}). Reconnecting in ${settings.reconnectDelay / 1000} seconds...`));
        
        // تنظيف الأحداث وإعادة المحاولة
        bot.removeAllListeners();
        setTimeout(createBotInstance, settings.reconnectDelay);
    });
}

// بدء التشغيل
createBotInstance();
