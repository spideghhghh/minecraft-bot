// قائمة الإعلانات والنصائح التلقائية
const serverTips = [
    'Tip: Protect your build! Use "/ps get" to claim protection blocks.',
    'Tip: Need money? Join a job with "/jobs" or sell items in "/shop".',
    'Tip: Want a wild start? Use "/rtp" to find a safe building location.',
    'Tip: Check your daily rewards every day using "/rewards"!',
    'Tip: Store your money safely! Use "/bank deposit" to keep it secure.'
];

function initModeration(bot) {
    console.log('[MODULE] Moderation & Announcement System loaded successfully.');

    // ==========================================
    // 1. نظام الترحيب باللاعبين الجدد
    // ==========================================
    bot.on('playerJoined', (player) => {
        if (player.username === bot.username) return;

        // تأخير بسيط لمنع تداخل الرسائل عند الدخول
        setTimeout(() => {
            bot.chat(`Welcome to the server, ${player.username}! Have fun and type /help if needed.`);
        }, 3000);
    });

    // ==========================================
    // 2. نظام الإعلانات الدورية (كل 10 دقائق)
    // ==========================================
    let tipIndex = 0;
    setInterval(() => {
        const currentTip = serverTips[tipIndex];
        bot.chat(`[SERVER TIP] ${currentTip}`);
        
        // الانتقال للنصيحة التالية
        tipIndex = (tipIndex + 1) % serverTips.length;
    }, 10 * 60 * 1000);

    // ==========================================
    // 3. نظام الإشراف ومراقبة الدردشة (Anti-Caps & Anti-Spam)
    // ==========================================
    bot.on('chat', (username, message) => {
        if (username === bot.username) return;

        // فحص استخدام الأحرف الكبيرة المفرط (Caps Spam)
        if (message.length > 8) {
            const capsCount = message.replace(/[^A-Z]/g, '').length;
            const capsPercentage = (capsCount / message.length) * 100;

            if (capsPercentage > 80) {
                bot.chat(`${username}, please do not use ALL CAPS in chat!`);
                return;
            }
        }

        // فحص الروابط الخارجية الخبيثة
        if (message.includes('http://') || message.includes('https://') || message.includes('www.')) {
            bot.chat(`${username}, external links are not allowed in chat!`);
            // تحذير اللاعب أو كتمه باستخدام أمر الإشراف المتاح لديك (LuckPerms / Essentials)
            bot.chat(`/warn ${username} Posting external links`);
        }
    });
}

module.exports = { initModeration };
