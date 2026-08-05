const settings = require('../config/settings');
const { pathfinder } = require('mineflayer-pathfinder');
const autoEat = require('mineflayer-auto-eat').default;

function initMovement(bot) {
    console.log('[MODULE] Bot Movement, Physics & Anti-AFK loaded successfully.');

    // 1. تحميل إضافات المسارات والأكل التلقائي
    bot.loadPlugin(pathfinder);
    bot.loadPlugin(autoEat);

    // 2. نظام إعادة الإحياء التلقائي عند الموت (Auto Respawn)
    bot.on('death', () => {
        console.log('[PHYSICS] Bot died in-game! Respawning in 2 seconds...');
        setTimeout(() => {
            bot.respawn();
            bot.chat('I am back!');
        }, 2000);
    });

    // 3. إعدادات نظام الأكل التلقائي (Auto Eat)
    bot.autoEat.options = {
        priority: 'foodPoints',
        startHTML: 14,
        bannedFood: ['rotten_flesh', 'poisonous_potato', 'spider_eye', 'pufferfish']
    };

    // فحص مستوى الجوع عند تغير الصحة أو الطعام
    bot.on('health', () => {
        if (bot.food < 15) {
            bot.autoEat.eat().catch(() => {});
        }
    });

    // 4. التفاعل البصري: النظر تلقائياً إلى أقرب لاعب محيط بالبوت
    setInterval(() => {
        const playerEntity = bot.nearestEntity(entity => entity.type === 'player' && entity.username !== bot.username);
        if (playerEntity) {
            const pos = playerEntity.position.offset(0, playerEntity.height, 0);
            bot.lookAt(pos);
        }
    }, 2500);

    // 5. نظام Anti-AFK المتقدم (تنفيذ حركات فيزيائية عشوائية)
    const afkIntervalMs = (settings.antiAfkSeconds || 180) * 1000;

    setInterval(() => {
        const actions = ['jump', 'rotate', 'sneak'];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];

        if (randomAction === 'jump') {
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 800);
        } 
        else if (randomAction === 'rotate') {
            const randomYaw = Math.random() * Math.PI * 2;
            const randomPitch = (Math.random() - 0.5) * (Math.PI / 2);
            bot.look(randomYaw, randomPitch, true);
        } 
        else if (randomAction === 'sneak') {
            bot.setControlState('sneak', true);
            setTimeout(() => bot.setControlState('sneak', false), 1200);
        }
    }, afkIntervalMs);
}

module.exports = { initMovement };
