const settings = require('../config/settings');

let isEventActive = false;
let currentAnswer = null;
let eventTimeout = null;

// قائمة الكلمات المخصصة لتحديات السرعة وفك التشفير
const sampleWords = ['DIAMOND', 'NETHERITE', 'PROTECTION', 'CRAFTING', 'SURVIVAL', 'DRAGON', 'EMERALD'];

function initEventEngine(bot) {
    console.log('[MODULE] Event Engine & Rewards System loaded successfully.');

    // ضبط المؤقت للفعاليات الدورية
    const intervalMs = settings.events.intervalMinutes * 60 * 1000;
    setInterval(() => {
        if (!isEventActive) {
            triggerRandomEvent(bot);
        }
    }, intervalMs);

    // مراقبة الدردشة للتحقق من إجابات اللاعبين
    bot.on('chat', (username, message) => {
        if (username === bot.username || !isEventActive || !currentAnswer) return;

        const playerInput = message.trim().toUpperCase();

        if (playerInput === currentAnswer.toString().toUpperCase()) {
            handleWinner(bot, username);
        }
    });
}

// اختيار فعالية عشوائية
function triggerRandomEvent(bot) {
    const eventType = Math.floor(Math.random() * 3); // 0: Math, 1: Fast Typing, 2: Unscramble

    isEventActive = true;

    if (eventType === 0) {
        // فعالية الرياضيات
        const num1 = Math.floor(Math.random() * 40) + 10;
        const num2 = Math.floor(Math.random() * 40) + 10;
        currentAnswer = num1 + num2;

        bot.chat(`[EVENT] Fast Math! What is ${num1} + ${num2}? First to answer wins a reward!`);
    } 
    else if (eventType === 1) {
        // فعالية سرعة الكتابة
        const word = sampleWords[Math.floor(Math.random() * sampleWords.length)];
        currentAnswer = word;

        bot.chat(`[EVENT] Speed Type! Type this word quickly: "${word}"`);
    } 
    else {
        // فعالية فك التشفير (Unscramble)
        const word = sampleWords[Math.floor(Math.random() * sampleWords.length)];
        const scrambled = word.split('').sort(() => 0.5 - Math.random()).join('');
        currentAnswer = word;

        bot.chat(`[EVENT] Unscramble! Guess the hidden word: "${scrambled}"`);
    }

    // حد أقصى للفعالية (45 ثانية) إذا لم يجب أحد
    eventTimeout = setTimeout(() => {
        if (isEventActive) {
            bot.chat(`[EVENT] Time is up! Nobody got the correct answer. The answer was: ${currentAnswer}`);
            resetEventState();
        }
    }, 45000);
}

// التعامل مع اللاعب الفائز وتوزيع الجوائز
function handleWinner(bot, username) {
    clearTimeout(eventTimeout);
    
    bot.chat(`[EVENT] GG! ${username} won the event! Correct answer: ${currentAnswer}`);
    
    // إعطاء جوائز باستخدام أوامر الإضافات المتاحة في السيرفر
    // 1. إعطاء مفتاح كرايت من إضافة ExcellentCrates
    bot.chat(`/crate key give ${username} common 1`);

    // 2. إعطاء مبلغ مالي للاعب عبر Essentials / BankPlus
    bot.chat(`/eco give ${username} 500`);

    bot.chat(`[REWARD] ${username} received 1x Crate Key and ${settings.events.currencySymbol}500!`);

    resetEventState();
}

function resetEventState() {
    isEventActive = false;
    currentAnswer = null;
    eventTimeout = null;
}

module.exports = { initEventEngine };
