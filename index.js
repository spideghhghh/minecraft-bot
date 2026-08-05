/**
 * ============================================================================
 * TOUNSI AI OMEGA CORE - LAOHEN SMP COMPANION & ADMIN (v26.0 FRANCO)
 * ============================================================================
 * SERVER: Laohen Server (60 Plugins)
 * FEATURES: Auto-Eat, PvP, Pathfinding, Auto-Mod, Trivia, Smart Plugin Logic.
 * ============================================================================
 */

const http = require('http');
const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const pvp = require('mineflayer-pvp').plugin;
const armorManager = require('mineflayer-armor-manager');
const autoeat = require('mineflayer-auto-eat').plugin;

// ==========================================
// 1. WEB SERVER KEEPALIVE (RENDER/HEROKU 24/7)
// ==========================================
// هذا الخادم الوهمي يضمن عدم توقف البوت عند استضافته على منصات مثل Render
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Tounsi AI OMEGA CORE is 100% Online and protecting Laohen Server.\n');
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`[OMEGA CORE] Web Server is actively running on port ${PORT}.`));

// ==========================================
// 2. BOT CONFIGURATION & INITIALIZATION
// ==========================================
const BOT_CONFIG = {
    host: 'node-de-free-01.tickhosting.com', // ضع أي بي السيرفر هنا
    port: 50589,                             // ضع بورت السيرفر هنا
    username: 'TounsiAdmin',
    version: false                           // يتعرف على الإصدار تلقائياً
};

let bot;

// ==========================================
// 3. MASSIVE TUNISIAN AI DICTIONARY (FRANCO)
// ==========================================
const AI_BRAIN = {
    emotions: {
        bored: [
            'Walah faddet chwaya.. chkoun yji ya3mel doura m3aya fel spawn?', 
            'Server re9ed? Fiy9ou ya louled, a3mlou 7aja!', 
            'Rani 9a3ed n3es wa7di, ma famma 7ad yatlsaab?'
        ],
        happy: [
            'El jaw mrigel lyoum fel Laohen Server, TPS tayara w nes lkol far7ana!', 
            'Walah a7sen server w a7sen jme3a, gg lina lkol!', 
            'Tfarhedt barcha lyoum m3akom ya m3almiya!'
        ],
        angry: [
            'Ya weldi a7tarem rou7ek! Rani AI Admin ma nel3abch!', 
            'Zid seb taw tchouf el ban kifech yji, sayeb 3lik w al3eb mrigel.', 
            'Chbik mchnechen? Arkez w al3eb kima nes.'
        ]
    },
    greetings: ['Ahla w sahla!', 'W3slm ya gheli, marhba bik.', 'Aslema ya m3allem, rani houni n3awen fikom.', 'Wesh ya s7aybi, chneya oumourek?'],
    howAreYou: ['Cv hmdlh, wekel chereb re9ed w nrigel fel plugins hhh.', 'Labes 3al 3alam, n3es 3la jme3et el hack lyoum!', 'Hamdoulah, rani n3awen fel louled w nsayeb fel jaw.'],
    praises: ['Walah enty el m3allem, rabi yba9i 3lik el ster!', 'Kfo ya 5ouya, tbarkalah 3lik.', 'Berjoulia nta men a7sen el players houni 10/10.'],
    warnings: ['⚠️ T7thir: Na9es mel klem el zayed fel chat 3aychek!', '⚠️ Ya m3allem, e7tarem el 9awanin w sayeb 3lik mel machakel.']
};

// ==========================================
// 4. SMART PLUGIN DATABASE (LAOHEN SERVER)
// ==========================================
// نظام تصحيح البلوغنات مبني على البلوغنات الـ 60 الفعلية في سيرفرك
const PLUGIN_DB = {
    '/jobs': { typos: ['jobs', 'job', '5edma', 'flous'], desc: 'Jobs! Bch ta5dem (Miner, Builder) w tda5el flous. A3mel "/jobs browse".' },
    '/ah': { typos: ['ah', 'auction', 'souq', 'bi3', 'matjar', 'auctionhouse'], desc: 'AuctionHouse! Souq el la3ibin bch tbi3 w teshri. A3mel "/ah".' },
    '/rtp': { typos: ['rtp', 'random', 'b3id', 'win nbni'], desc: 'BetterRTP! Yhezak l blasa 3achwa2iya bch tabni dark. A3mel "/rtp".' },
    '/pv': { typos: ['pv', 'vault', 'shulker', 'haqiba', 'axvaults'], desc: 'AxVaults! Sandou9ek el sakhsi elli ma ydi3ch. A3mel "/pv 1".' },
    '/co': { typos: ['co', 'coreprotect', 'sarqa', 'chkoun'], desc: 'CoreProtect! Bch na3ref chkoun kassar wela sre9 ay block. (Admin)' },
    '/team': { typos: ['team', 'clan', 'betterteams', 'fariq'], desc: 'BetterTeams! Bch ta3mel clan m3a s7abek w t7arbou. "/team create <name>".' },
    '/shop': { typos: ['shop', 'chira', 'matjar server', 'shopguiplus'], desc: 'ShopGUIPlus! Matjar el server bch teshri mawarid asasiyya. A3mel "/shop".' },
    '/bounty': { typos: ['bounty', 'matloub', 'ras', 'reanbounties'], desc: 'ReanBounties! 7ot flous 3la ras we7ed bch ya9tlouh. A3mel "/bounty".' },
    '/skills': { typos: ['skills', 'levels', 'cyberlevels', 'lvl'], desc: 'CyberLevels! Kol ma tal3ab, lvl mte3ek yzid w qowtek tzid. A3mel "/skills".' },
    '/bank': { typos: ['bank', 'bankplus', 'flousi'], desc: 'BankPlus! 7ot flousek fel banka bch ta5ou fe2da (interest). A3mel "/bank".' },
    '/crates': { typos: ['crate', 'crates', 'excellentcrates', 'sandi9'], desc: 'ExcellentCrates! 7el el sandi9 bel mfeté7 bch tarba7 7ajet OP. A3mel "/crates".' }
};

// ==========================================
// 5. TRIVIA SYSTEM (MINI-GAMES)
// ==========================================
const TRIVIA_QUESTIONS = [
    { q: "Chneya el block elli ma tnajemch tkasrou fel survival?", a: "bedrock" },
    { q: "Chkoun el mob elli yor3eb ki tokhzrolou fi 3inih?", a: "enderman" },
    { q: "Chneya esm el 3alem elli fih el dragon?", a: "end" },
    { q: "Chneya el ma3den elli ta3mel bih armor 9weya barcha lonha ak7al?", a: "netherite" },
    { q: "Kaddech men warka (paper) test7a9 bch tasna3 ktab (book)?", a: "3" },
    { q: "Chneya el mob elli ytfarga3 ki y9arablek?", a: "creeper" }
];
let activeTrivia = null;

// ==========================================
// 6. GLOBAL STATES & COOLDOWNS
// ==========================================
let globalChatCooldown = false;
let isFollowing = false;
let patrolInterval = null;
let eventInterval = null;

// ==========================================
// 7. CORE BOT LOGIC & RECONNECT SYSTEM
// ==========================================
function createBot() {
    bot = mineflayer.createBot(BOT_CONFIG);

    // تحميل البلوغنات الأساسية للحركة، القتال، الأكل والدروع
    bot.loadPlugin(pathfinder);
    bot.loadPlugin(pvp);
    bot.loadPlugin(armorManager);
    bot.loadPlugin(autoeat);

    // حدث الترسب (عند دخول السيرفر)
    bot.once('spawn', () => {
        console.log('[OMEGA CORE] Bot Spawned Successfully. AI Engine Started.');
        
        // إعداد نظام الباركور والحركة الذكية
        const mcData = require('minecraft-data')(bot.version);
        const defaultMove = new Movements(bot, mcData);
        defaultMove.allowParkour = true;
        defaultMove.allowSprinting = true;
        bot.pathfinder.setMovements(defaultMove);

        // إعداد نظام الأكل التلقائي
        bot.autoEat.options = {
            priority: 'foodPoints',
            startAt: 14,
            bannedFood: ['rotten_flesh', 'spider_eye', 'poisonous_potato', 'pufferfish']
        };

        // تشغيل نظام الفعاليات والمشاعر العشوائية كل 15 دقيقة
        if (eventInterval) clearInterval(eventInterval);
        eventInterval = setInterval(triggerRandomEvent, 900000); 
    });

    // مراقبة الصحة والهروب/طلب المساعدة
    bot.on('health', () => {
        if (bot.health < 8 && !globalChatCooldown) {
            sendHumanChat('A7ye rani netdharreb, help help! 🏃‍♂️💨');
        }
    });

    // ارتداء أفضل الدروع تلقائياً عند التقاطها
    bot.on('playerCollect', (collector, itemDrop) => {
        if (collector !== bot.entity) return;
        setTimeout(() => { 
            try { bot.armorManager.equipAll(); } catch (e) {} 
        }, 200);
    });

    // ==========================================
    // 8. CHAT & COMMAND PROCESSOR (THE BRAIN)
    // ==========================================
    bot.on('messagestr', (message, position, jsonMsg) => {
        // تجاهل رسائل النظام ورسائل البوت نفسه
        if (message.includes(bot.username) || position === 'system') return;
        
        const rawText = message.trim();
        const lowerText = rawText.toLowerCase();
        const sender = message.split(' ')[0].replace(/[<:>]/g, ''); // محاولة استخراج اسم المرسل

        // 8.1 - AUTO-MODERATION (Anti-Insult)
        if (/(bhim|jabri|mnayek|ta7an|kalb|zbi|khra|9a7ba)/i.test(lowerText)) {
            sendHumanChat(AI_BRAIN.warnings[0]);
            return;
        }

        // 8.2 - TRIVIA CHECKER (نظام المسابقات)
        if (activeTrivia && lowerText.includes(activeTrivia.a)) {
            sendHumanChat(`🎉 Bsa7tek ya ${sender}! Jawabt s7i7: ${activeTrivia.a}. Wja3tni fi rasi b'thakeek!`);
            bot.chat(`/eco give ${sender} 1000`); // إعطاء مكافأة إذا كان البوت OP
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 500);
            activeTrivia = null;
            return;
        }

        // 8.3 - ADMIN COMMANDS (تبدأ بـ !)
        if (lowerText.startsWith('!')) {
            handleAdminCommands(rawText, sender);
            return;
        }

        // 8.4 - SMART PLUGIN CORRECTION ENGINE (الميزة الذكية لتصحيح البلوغنات)
        let exactMatch = null;
        let typoMatch = null;

        // البحث في قاموس البلوغنات
        for (const [cmd, data] of Object.entries(PLUGIN_DB)) {
            // إذا كتب الأمر صحيحاً مع السلاش
            if (lowerText === cmd || lowerText.startsWith(cmd + ' ')) {
                exactMatch = data.desc;
                break; 
            }
            // إذا كتب الكلمة بدون سلاش أو أخطأ فيها
            for (const typo of data.typos) {
                // نستخدم Regex للبحث عن الكلمة ككلمة مستقلة لتجنب التداخل
                const regex = new RegExp(`\\b${typo}\\b`, 'i');
                if (regex.test(lowerText) && !lowerText.includes('/')) {
                    typoMatch = cmd;
                }
            }
        }

        if (exactMatch) {
            sendHumanChat(`✅ ${exactMatch}`);
            return;
        } else if (typoMatch) {
            sendHumanChat(`💡 Ya ${sender}, tdhohreli tlawj 3la el plugin mte3 ${typoMatch.replace('/', '')}? Ouktebha s7i7a besslash kima hekka: ${typoMatch} bch nfassarlek!`);
            return;
        }

        // 8.5 - NLP (معالجة اللغة الطبيعية - Tounsi)
        processCasualChat(lowerText, sender);
    });

    // ==========================================
    // 9. ERROR HANDLING & AUTO-RECONNECT
    // ==========================================
    bot.on('end', (reason) => {
        console.log(`[OMEGA CORE] Disconnected: ${reason}. Auto-reconnecting in 10 seconds...`);
        if (eventInterval) clearInterval(eventInterval);
        if (patrolInterval) clearInterval(patrolInterval);
        setTimeout(createBot, 10000); // إعادة الاتصال التلقائي
    });

    bot.on('error', (err) => {
        if (err.code === 'ETIMEDOUT' || err.code === 'ECONNRESET') {
            console.log(`[OMEGA CORE] Connection Error: ${err.message}. Reconnecting soon...`);
        } else {
            console.log(`[OMEGA CORE ERROR] ${err.message}`);
        }
    });
    
    bot.on('kicked', (reason) => {
        console.log(`[OMEGA CORE] Kicked from server. Reason: ${reason}`);
    });
}

// ==========================================
// 10. HELPER FUNCTIONS
// ==========================================
function processCasualChat(lowerText, sender) {
    let finalResponse = '';

    if (/(^|\s)(slm|slam|salem|slama|aslema|3aslema|wesh|cc|bonjour|bsr|hi|hello|marhba)(\s|$)/i.test(lowerText)) {
        finalResponse = AI_BRAIN.greetings[Math.floor(Math.random() * AI_BRAIN.greetings.length)];
    } else if (/(cv|cava|chneya|chnwa|a7welek|labes|chbik|ahwelk|chnewa)/i.test(lowerText)) {
        finalResponse = AI_BRAIN.howAreYou[Math.floor(Math.random() * AI_BRAIN.howAreYou.length)];
    } else if (/(hhh|haha|mdr|lol|xd|xdd)/i.test(lowerText)) {
        finalResponse = `Hhhhhhh walah jawak tayara ya ${sender} 😂`;
        bot.setControlState('sneak', true);
        setTimeout(() => bot.setControlState('sneak', false), 300);
    } else if (/(m3alem|gg|kfo|berjoulia|tbarkalah|bravo)/i.test(lowerText)) {
        finalResponse = AI_BRAIN.praises[Math.floor(Math.random() * AI_BRAIN.praises.length)];
    }

    if (finalResponse) sendHumanChat(finalResponse);
}

function handleAdminCommands(rawText, sender) {
    const args = rawText.split(' ');
    const command = args[0].toLowerCase();
    const targetName = args[1];

    switch (command) {
        case '!come':
            const followTargetName = targetName || sender;
            const target = bot.players[followTargetName]?.entity;
            if (!target) return sendHumanChat(`❌ Ma l9itech ${followTargetName}, 9arreb chwaya y3aychek!`);
            sendHumanChat(`🏃‍♂️ Hani jeyek b'parkour ya ${followTargetName}!`);
            bot.pathfinder.setGoal(new goals.GoalFollow(target, 2), true);
            isFollowing = true;
            break;

        case '!stop':
            bot.pathfinder.setGoal(null);
            bot.pvp.stop();
            isFollowing = false;
            if (patrolInterval) clearInterval(patrolInterval);
            sendHumanChat('🛑 Sayé rani 7best w rka7t fi blassti.');
            break;

        case '!attack':
            if (!targetName) return sendHumanChat('❌ Ekteb: !attack <ism_el_mob_wela_player>');
            const enemy = bot.nearestEntity(e => 
                (e.name && e.name.toLowerCase() === targetName.toLowerCase()) || 
                (e.username && e.username.toLowerCase() === targetName.toLowerCase())
            );
            if (!enemy) return sendHumanChat('❌ Ma l9itech hetha 9rib!');
            sendHumanChat(`⚔️ Hani hejem 3lih bkol 9owa! Ya welah a7wel lyoum!`);
            bot.pvp.attack(enemy);
            break;

        case '!trivia':
            startTriviaEvent();
            break;

        case '!fixlag':
            sendHumanChat('🧹 Hani nrigel fel TPS w nfasakh fel items ezzayda bch nna9sou el lag...');
            bot.chat('/kill @e[type=item]'); // يتطلب صلاحيات OP
            break;
            
        case '!patrol':
            sendHumanChat('👮‍♂️ Hani bdit el dawreya (Patrol). N3es 3la kol blasa fel spawn.');
            startPatrol();
            break;
            
        default:
            sendHumanChat('❌ Commande ghalta. El commands houma: !come, !stop, !attack, !trivia, !fixlag, !patrol');
            break;
    }
}

function triggerRandomEvent() {
    if (globalChatCooldown) return;
    const rand = Math.random();
    if (rand < 0.4) {
        sendHumanChat(AI_BRAIN.emotions.bored[Math.floor(Math.random() * AI_BRAIN.emotions.bored.length)]);
    } else if (rand < 0.7) {
        startTriviaEvent();
    }
}

function startTriviaEvent() {
    if (activeTrivia) return; // هناك مسابقة جارية بالفعل
    activeTrivia = TRIVIA_QUESTIONS[Math.floor(Math.random() * TRIVIA_QUESTIONS.length)];
    sendHumanChat(`🎉 [Mousabqa] ${activeTrivia.q} (Awel we7ed yjaweb yakhoud ja2iza!)`);
    
    // المهلة الزمنية للمسابقة (30 ثانية)
    setTimeout(() => {
        if (activeTrivia) {
            sendHumanChat(`⏳ Wfa el wa9t! El ijaba s7i7a hya: ${activeTrivia.a}. 7ad awfar marra jeya!`);
            activeTrivia = null;
        }
    }, 30000);
}

function startPatrol() {
    if (patrolInterval) clearInterval(patrolInterval);
    patrolInterval = setInterval(() => {
        if (isFollowing) return; // عدم الدورية إذا كان يتبع شخصاً
        if (!bot.entity) return;
        const x = bot.entity.position.x + (Math.random() * 30 - 15);
        const z = bot.entity.position.z + (Math.random() * 30 - 15);
        bot.pathfinder.setGoal(new goals.GoalNear(x, bot.entity.position.y, z, 1));
    }, 15000); // تغيير المسار كل 15 ثانية
}

function sendHumanChat(txtMessage) {
    if (globalChatCooldown) return;
    globalChatCooldown = true;
    
    // محاكاة تأخير الكتابة البشري
    const typingDelay = Math.random() * 1500 + 1000;
    setTimeout(() => {
        bot.chat(txtMessage);
        // فترة انتظار قبل إرسال رسالة أخرى لمنع السبام
        setTimeout(() => { globalChatCooldown = false; }, 2000);
    }, typingDelay); 
}

// ==========================================
// 11. START THE SYSTEM
// ==========================================
createBot();
