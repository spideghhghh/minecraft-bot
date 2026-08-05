// نظام حماية ضد الإغراق (Cooldown) لمنع تكرار الردود لنفس اللاعب
const lastResponseTime = new Map();

function canRespond(username, cooldownMs = 4000) {
    const now = Date.now();
    const last = lastResponseTime.get(username) || 0;
    if (now - last > cooldownMs) {
        lastResponseTime.set(username, now);
        return true;
    }
    return false;
}

function initChatAssistant(bot) {
    console.log('[MODULE] Chat Assistant & Typo Corrector loaded successfully.');

    // خريطة تصحيح الأخطاء الإملائية الشائعة للأوامر
    const typoCorrections = {
        'spwn': 'Did you mean "/spawn"? Type "/spawn" to teleport to spawn!',
        'spwan': 'Did you mean "/spawn"? Type "/spawn" to teleport to spawn!',
        'rtpp': 'Did you mean "/rtp"? Type "/rtp" to jump to a random wild location!',
        'wildd': 'Did you mean "/rtp"? Type "/rtp" to search for a wild area!',
        'shopp': 'Did you mean "/shop"? Type "/shop" to open the main server market!',
        'sop': 'Did you mean "/shop"? Type "/shop" to buy or sell items!',
        'balence': 'Did you mean "/bal"? Type "/bal" or "/bank" to check your money balance!',
        'balanc': 'Did you mean "/bal"? Type "/bal" to check your money!',
        'crate': 'Did you mean "/crates"? Type "/crates" to view all crate rewards!',
        'helpp': 'Did you mean "/help"? Type "/help" to view all available commands!',
        'jobb': 'Did you mean "/jobs"? Type "/jobs" to choose a job and make money!'
    };

    bot.on('chat', (username, message) => {
        // تجاهل رسائل البوت نفسه
        if (username === bot.username) return;

        const cleanMsg = message.trim().toLowerCase();

        // 1. التعرّف على الأخطاء الإملائية وتصحيحها
        if (typoCorrections[cleanMsg]) {
            if (canRespond(username)) {
                bot.chat(`Hey ${username}! ${typoCorrections[cleanMsg]}`);
            }
            return;
        }

        // 2. المساعد الذكي للإجابة عن أسئلة السيرفر (مبني على بلوغنات سيرفرك)
        if (!canRespond(username)) return;

        // الأسئلة المتعلقة بجمع المال (BankPlus / Jobs / ShopGUIPlus)
        if (cleanMsg.includes('how to get money') || cleanMsg.includes('how to make money') || cleanMsg.includes('how to earn')) {
            bot.chat(`Hey ${username}! You can earn money by joining /jobs, selling items in /shop, or using /ah!`);
        }
        // الأسئلة المتعلقة بحماية الأراضي (ProtectionStones)
        else if (cleanMsg.includes('how to protect') || cleanMsg.includes('claim land') || cleanMsg.includes('protect house')) {
            bot.chat(`Hey ${username}! Type "/ps get" to receive a protection block, then place it to protect your house!`);
        }
        // الأسئلة المتعلقة باللفل والرتب (CyberLevels)
        else if (cleanMsg.includes('how to level up') || cleanMsg.includes('how to rankup') || cleanMsg.includes('my level')) {
            bot.chat(`Hey ${username}! Just play actively to get XP, and type "/levels" to view your current status!`);
        }
        // الأسئلة المتعلقة بالتنقل (BetterRTP)
        else if (cleanMsg.includes('where to build') || cleanMsg.includes('how to teleport') || cleanMsg.includes('go to wild')) {
            bot.chat(`Hey ${username}! Type "/rtp" to automatically teleport to a safe building spot in the wild!`);
        }
        // الأسئلة المتعلقة الجوائز اليومية (AxRewards / ExcellentCrates)
        else if (cleanMsg.includes('free reward') || cleanMsg.includes('daily reward') || cleanMsg.includes('free key')) {
            bot.chat(`Hey ${username}! Use "/rewards" to claim daily items, or vote to get free crate keys!`);
        }
        // التفاعل مع التحيات
        else if (cleanMsg === 'hi' || cleanMsg === 'hello' || cleanMsg === 'hey') {
            bot.chat(`Hello ${username}! Welcome! Need any help? Just ask in chat!`);
        }
    });
}

module.exports = { initChatAssistant };
