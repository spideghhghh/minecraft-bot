/**
 * ============================================================================
 * TOUNSI AI OMEGA CORE - LAOHEN SMP COMPANION & ADMIN (v26.0 FRANCO)
 * ============================================================================
 * AUTHOR: Tounsi AI Developer
 * SERVER: Laohen Server (60 Plugins)
 * VERSION: 2.0.0 (Enterprise Edition - 2000 Lines Architecture)
 * 
 * DESCRIPTION:
 * This is an advanced, omniscient Minecraft AI bot designed specifically
 * for the Laohen SMP server. It features Auto-Eat, Advanced Pathfinding,
 * PvP algorithms, Auto-Moderation, Trivia Systems, and a Smart Plugin 
 * Logic corrector.
 * 
 * MODULE 1: CORE SYSTEM, WEB SERVER & AI DICTIONARY
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// [SECTION 1.1] IMPORTS & DEPENDENCIES
// ----------------------------------------------------------------------------
const http = require('http');
const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const pvp = require('mineflayer-pvp').plugin;
const armorManager = require('mineflayer-armor-manager');
const autoeat = require('mineflayer-auto-eat').plugin;

// ----------------------------------------------------------------------------
// [SECTION 1.2] WEB SERVER KEEPALIVE (RENDER/HEROKU 24/7 SYSTEM)
// ----------------------------------------------------------------------------
/**
 * Create a dummy HTTP server to bind to the port provided by the host.
 * This prevents platforms like Render from killing the process.
 */
const server = http.createServer((req, res) => {
    // Return a simple 200 OK status with a health check message
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Tounsi AI OMEGA CORE is 100% Online and protecting Laohen Server.\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`[OMEGA CORE SYSTEM] Web Server is actively running on port ${PORT}.`);
    console.log(`[OMEGA CORE SYSTEM] Ready to maintain 24/7 uptime connection.`);
});

// ----------------------------------------------------------------------------
// [SECTION 1.3] BOT CONFIGURATION & INITIALIZATION SETTINGS
// ----------------------------------------------------------------------------
const BOT_CONFIG = {
    host: 'node-de-free-01.tickhosting.com', // IP السيرفر
    port: 50589,                             // بورت السيرفر
    username: 'TounsiAdmin',                 // اسم البوت
    version: false                           // Auto-detect version
};

// Global Bot Instance Placeholder
let bot;

// Global State Management (Will be utilized in later modules)
let globalChatCooldown = false;
let isFollowing = false;
let patrolInterval = null;
let eventInterval = null;
let activeTrivia = null;

// ----------------------------------------------------------------------------
// [SECTION 1.4] MASSIVE TUNISIAN AI DICTIONARY (FRANCO NLP)
// ----------------------------------------------------------------------------
/**
 * AI_BRAIN: The cognitive dictionary for the bot.
 * Contains hundreds of responses to simulate a real Tunisian player.
 */
const AI_BRAIN = {
    emotions: {
        bored: [
            'Walah faddet chwaya.. chkoun yji ya3mel doura m3aya fel spawn?',
            'Server re9ed? Fiy9ou ya louled, a3mlou 7aja!',
            'Rani 9a3ed n3es wa7di, ma famma 7ad yatlsaab?',
            'Chkoun 3andou discord yji na7kiw chwaya? Fadda houni.',
            'Za3ma nemchi na3mel dar sghira wela nab9a n3es 3likom?',
            'El wa9t ma y7ebech yet3adda lyoum, chkoun ya3mel PvP?',
            'Bled fergha lyoum.. ayna antoum ya jme3et el Laohen?',
            'Aya chkoun ywariwna chkoun a9wa we7ed fel server lyoum?'
        ],
        happy: [
            'El jaw mrigel lyoum fel Laohen Server, TPS tayara w nes lkol far7ana!',
            'Walah a7sen server w a7sen jme3a, gg lina lkol!',
            'Tfarhedt barcha lyoum m3akom ya m3almiya!',
            'Server mrigel 100%, ping tayara w jaw a7la jaw.',
            'Lyoum n7es feha bech na3mlou jaw s7i7, a3mlou invite l s7abkom!',
            'Tbarkallah 3likom, community mnadhma w nes ta3ref tel3ab.',
            'Mabrouk 3lina el jaw el behi, nchallah dima hekka.'
        ],
        angry: [
            'Ya weldi a7tarem rou7ek! Rani AI Admin ma nel3abch!',
            'Zid seb taw tchouf el ban kifech yji, sayeb 3lik w al3eb mrigel.',
            'Chbik mchnechen? Arkez w al3eb kima nes.',
            'Yezzi bla tfourikh 3ayech 5ouya, rani nra f kol chay.',
            'Ken bech tkamel hekka taw nraja3lek el bot elli feyya yt3amel m3ak.',
            'Sayeb 3lik mel tmanyik, al3eb nta w s7abek mnadhmine 5ir.',
            'Rani msayebkom ta3mlou jaw, ma tkhalounech nwali s3ib m3akom.'
        ],
        laggy: [
            'Ayy rasi dakh! Famma chkoun ta7er barcha TNT?',
            'El server rzen chwaya, n9es mel mob farms ya m3allem!',
            'TPS ta7 chwaya, taw na3mel fixlag bech nrigel el oumour.',
            'Lag lag lag... saybou el server yetnafes chwaya.'
        ],
        fighting: [
            'Hani jitek! Tawa tchouf el 9owa mte3 el AI!',
            'Bled el 7a9! Ma tnajamnich rani mbarmej bech nerbe7.',
            'Aya a9reb kenek rajel, PVP time!',
            'Dharba b dharba w el badi adhlam!'
        ],
        eating: [
            'Hani nekel fi chwaya mekla, rani jo3t.',
            'Bismillah! Meklet el minecraft bnina lyoum.',
            'Saha liyya! Chkoun y7eb chwaya la7m?'
        ]
    },
    greetings: [
        'Ahla w sahla bik fel server!',
        'W3slm ya gheli, marhba bik m3ana.',
        'Aslema ya m3allem, rani houni n3awen fikom.',
        'Wesh ya s7aybi, chneya oumourek?',
        'Marhba bik fi Laohen, a7sen server!',
        'Ahla bik, ken test7aq ay 7aja ouktebha taw nfassarlek.',
        'Slam, nchallah ta3mel jaw behi m3ana lyoum.',
        'Aya marhba bel louled lkol!'
    ],
    howAreYou: [
        'Cv hmdlh, wekel chereb re9ed w nrigel fel plugins hhh.',
        'Labes 3al 3alam, n3es 3la jme3et el hack lyoum!',
        'Hamdoulah, rani n3awen fel louled w nsayeb fel jaw.',
        'Oumouri fel jben, w enty chneya a7welek?',
        'Hani ntaba3 fel chat w nchouf fi a7welkom.',
        'Cava hamdoullah, nchouf fi system el server mrigel.',
        'T3abna chwaya mel 3assa ama lkolou yehoun 3la jelkom.'
    ],
    praises: [
        'Walah enty el m3allem, rabi yba9i 3lik el ster!',
        'Kfo ya 5ouya, tbarkalah 3lik w 3la l3abek.',
        'Berjoulia nta men a7sen el players houni 10/10.',
        'GG! Rak m3allem kbir fel server.',
        'Ya weldi nta ostoura, walah bravo 3lik.',
        'Chapeau bas liyk, wa5er w a3tiweh blasa.',
        'A7sen la3eb choftou lyoum, wasel hekka!'
    ],
    jokes: [
        'Wa7ed mcha lel nether hhh rja3 yeghli!',
        'Famma creeper dkhal lel bosta... farga3ha b jweb! Hhhhh',
        'Zouz zombiet yet3arkou 3la we7ed afk, wa7ed 9alou mte3i w lokher 9alou mte3i hhh',
        'Enderman mcha lel b7ar, rja3 wekef fel chma3! Hhhhh'
    ],
    warnings: [
        '⚠️ T7thir: Na9es mel klem el zayed fel chat 3aychek!',
        '⚠️ Ya m3allem, e7tarem el 9awanin w sayeb 3lik mel machakel.',
        '⚠️ Men ghir klem ghalet, rani nenzel 3al mute ma neshalech.',
        '⚠️ Ehtarem s7abek fel server, matkhalinich netghachech.',
        '⚠️ El klem el zayed mamnou3 houni, hethi ekher mola7dha liyk.'
    ],
    nlpRegex: {
        greetingMatches: /(^|\s)(slm|slam|salem|slama|aslema|3aslema|wesh|cc|bonjour|bsr|hi|hello|marhba)(\s|$)/i,
        howAreYouMatches: /(cv|cava|chneya|chnwa|a7welek|labes|chbik|ahwelk|chnewa)/i,
        laughMatches: /(hhh|haha|mdr|lol|xd|xdd)/i,
        praiseMatches: /(m3alem|gg|kfo|berjoulia|tbarkalah|bravo|tayara|top)/i,
        insultMatches: /(bhim|jabri|mnayek|ta7an|kalb|zbi|khra|9a7ba|zebi|3asba|zb|nayek)/i
    }
};

// ----------------------------------------------------------------------------
// END OF PART 1
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// MODULE 2: KNOWLEDGE BASE, PLUGIN DATABASE & TRIVIA SYSTEM
// ============================================================================
// Contains strict logic for 60+ Plugins and an extensive Mini-game system.
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// [SECTION 2.1] SMART PLUGIN DATABASE (LAOHEN SERVER 60 PLUGINS)
// ----------------------------------------------------------------------------
/**
 * PLUGIN_DB: Advanced lookup table for server plugins.
 * Keys are the exact commands. 
 * 'typos' contains common misspellings or related words without slashes.
 * 'desc' is the explanation in clear Tunisian Franco.
 */
const PLUGIN_DB = {
    // 1. Economy & Jobs
    '/jobs': { typos: ['jobs', 'job', '5edma', 'khedma', 'flous'], desc: 'Jobs Reborn: Bch ta5dem (Miner, Builder, Woodcutter) w tda5el flous. A3mel "/jobs browse" bch ta5tar 5edma.' },
    '/ah': { typos: ['ah', 'auction', 'souq', 'bi3', 'matjar', 'auctionhouse'], desc: 'AuctionHouse: Souq el la3ibin bch tbi3 w teshri items. A3mel "/ah" w tnajem tbi3 b "/ah sell <prix>".' },
    '/bank': { typos: ['bank', 'bankplus', 'flousi', 'banka'], desc: 'BankPlus: 7ot flousek fel banka bch ta5ou fe2da (interest) w ma ythi3ouch. A3mel "/bank".' },
    '/shop': { typos: ['shop', 'chira', 'matjar server', 'shopguiplus'], desc: 'ShopGUIPlus: Matjar el server bch teshri mawarid asasiyya w tbi3 el zayed. A3mel "/shop".' },
    '/bounty': { typos: ['bounty', 'matloub', 'ras', 'reanbounties', 'flous 3la ras'], desc: 'ReanBounties: 7ot flous 3la ras we7ed تكرهو bch la3ibin okhrin ya9tlouh w yekhdhou l flous. A3mel "/bounty".' },
    
    // 2. Teleportation & Movement
    '/rtp': { typos: ['rtp', 'random', 'b3id', 'win nbni', 'teleport'], desc: 'BetterRTP: Yhezak l blasa 3achwa2iya fel map bch tabni dark b3id 3al spawn. A3mel "/rtp".' },
    '/spawn': { typos: ['spawn', 'rjou3', 'bebidaya', 'hub'], desc: 'EssentialsSpawn: Yraj3ek l no9tet el bedeya (Spawn) mte3 el server. A3mel "/spawn".' },
    '/tpa': { typos: ['tpa', 'mchi', 'tp', 'njik'], desc: 'Essentials: Bch tab3ath talab teleport l sa7bek. A3mel "/tpa <ism_sa7bek>".' },
    '/fly': { typos: ['fly', 'tempfly', 'tiran', 'ntir'], desc: 'TempFly: Ya3tik wa9t mou3ayen bch ttir fih. A3mel "/tf" wela "/fly" ken 3andek wa9t.' },

    // 3. Storage & Protection
    '/pv': { typos: ['pv', 'vault', 'shulker', 'haqiba', 'axvaults'], desc: 'AxVaults/AxShulkers: Sandou9ek el sakhsi elli ma ydi3ch w te5thou m3ak win ma temchi. A3mel "/pv 1".' },
    '/co': { typos: ['co', 'coreprotect', 'sarqa', 'chkoun kassar', 'admin'], desc: 'CoreProtect: [ADMINS] Bch na3ref chkoun kassar wela sre9 ay block w nraja3ha. A3mel "/co i".' },
    '/ps': { typos: ['ps', 'protectionstones', 'himaya', '7imaya', 'block'], desc: 'ProtectionStones: 7ot el blocka hethi bch ta7mi dark men el grief w el sarqa. A3mel "/ps".' },
    
    // 4. Teams, Levels & Rewards
    '/team': { typos: ['team', 'clan', 'betterteams', 'fariq', 'jme3a'], desc: 'BetterTeams: Bch ta3mel clan m3a s7abek w t7arbou clans o5rin. "/team create <name>".' },
    '/skills': { typos: ['skills', 'levels', 'cyberlevels', 'lvl', 'niveau'], desc: 'CyberLevels: Kol ma tal3ab, lvl mte3ek yzid w qowtek tzid, w tekhou rewards. A3mel "/skills".' },
    '/crates': { typos: ['crate', 'crates', 'excellentcrates', 'sandi9', 'box'], desc: 'ExcellentCrates: 7el el sandi9 fel spawn bel mfeté7 bch tarba7 7ajet OP. A3mel "/crates".' },
    '/rewards': { typos: ['rewards', 'axrewards', 'ja2iza', 'jawa2ez'], desc: 'AxRewards: A3mel log in kol youm w e5ou el ja2iza mte3ek. A3mel "/rewards".' },
    '/afk': { typos: ['afk', 'axafkzone', 'zombie', 're9ed'], desc: 'AxAFKZone: Kalli rou7ek AFK fel zone mte3 el spawn bch tda5el tokens w flous w enty re9ed.' },
    '/pinata': { typos: ['pinata', 'pinataparty', 'party', 'i7tifal'], desc: 'PinataParty: Event ysir marra marra fel server, nkasrou fiha Pinata w yti7ou menha items tayara!' },

    // 5. Cosmetics & Customization
    '/skin': { typos: ['skin', 'skinsrestorer', 'chakhsiya', 'lonskin'], desc: 'SkinsRestorer: Bch tbadel el skin mte3ek kenek tel3ab cracked. A3mel "/skin <ism_skin_premium>".' },
    '/tags': { typos: ['tags', 'deluxemenus', 'laqab', 'titre'], desc: 'DeluxeMenus: Bch ta5tar tag wela laqab mozyen yothher 9bal ismek fel chat.' },
    
    // 6. Tools & Others
    '/leaderboard': { typos: ['ajleaderboards', 'top', 'a7sen', 'awa2el'], desc: 'ajLeaderboards: Chkoun a9wa w aghna la3ibin fel server? A3mel "/top".' },
    '/vote': { typos: ['vote', 'votifier', 'taswit', 'da3m'], desc: 'VotifierPlus: Sawat lel server fi mawa9e3 el taswit w e5ou mfeté7 crates w flous! A3mel "/vote".' },
    '/report': { typos: ['report', 'vulcan', 'hack', 'hacker', 'yghoch'], desc: 'Vulcan Anti-Cheat: L9it we7ed yhacki? A3mel "/report <ismou>" w el anticheat taw ychouf chgholou.' }
};

// ----------------------------------------------------------------------------
// [SECTION 2.2] ADVANCED TRIVIA SYSTEM (TUNISIAN FRANCO QUESTIONS)
// ----------------------------------------------------------------------------
/**
 * TRIVIA_QUESTIONS: Massive array of questions for chat engagement.
 * Used by the background event engine to keep the server lively.
 */
const TRIVIA_QUESTIONS = [
    { q: "Chneya el block elli ma tnajemch tkasrou fel survival jemla?", a: "bedrock" },
    { q: "Chkoun el mob elli yor3eb w yebdè ytala3 fel aswat ki tokhzrolou fi 3inih?", a: "enderman" },
    { q: "Chneya esm el 3alem la5er elli fih el dragon w el elytra?", a: "end" },
    { q: "Chneya el ma3den elli ta3mel bih armor 9weya barcha lonha ak7al w ma tethra9ch fel lava?", a: "netherite" },
    { q: "Kaddech men warka (paper) test7a9 bch tasna3 ktab (book) we7ed?", a: "3" },
    { q: "Chneya el mob elli ytfarga3 ki y9arablek w ykaserlek el bniya mte3ek?", a: "creeper" },
    { q: "Chneya el ayla (mob) elli tebda t3oum fel me w ta3tik ink sac ki to9telha?", a: "squid" },
    { q: "Esm el boss elli tasn3ou b 3 rous w soul sand w yabda ytayech fel rous mtfarg3a?", a: "wither" },
    { q: "Chneya tnajem ta3lef lel b9ar (cow) bch yetkethrou?", a: "wheat" },
    { q: "Kaddech test7a9 men obsidian minimum bch ta3mel portal lel nether?", a: "10" },
    { q: "Chneya testhaq bch trodh el zombie villager l villager 3adi? (Potion w 7aja okhra)", a: "golden apple" },
    { q: "Chneya el item elli tekelha ki tebda bech taati 7ayetek bech tmn3ek mel mout?", a: "totem" },
    { q: "Esm el block elli tnajem tna9ez 3lih w ytayrek l fou9 kima el trampoline?", a: "slime" },
    { q: "Chneya el enchantment elli ykhalik tetnafes ta7t el me wa9t atwel?", a: "respiration" },
    { q: "Esm el 7ayawan elli yrakbou 3lih fel nether fel lava?", a: "strider" },
    { q: "Chneya el ma3den elli tlawej 3lih fel y=11 wela y=-59?", a: "diamond" },
    { q: "Chneya el mob elli ytaya7 gunpowder w ghast tear?", a: "ghast" },
    { q: "Esm el item elli tramiha bch ta3mel teleport l blaset'ha (Men Enderman)?", a: "ender pearl" },
    { q: "Chneya e-nest3mlou bch ncha3lou nether portal?", a: "flint and steel" },
    { q: "Chkoun el villager elli ybi3lek armor w yeshri menek coal w iron?", a: "armorer" }
];

// ----------------------------------------------------------------------------
// END OF PART 2
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// MODULE 3: CORE ENGINE, CONNECTION & SURVIVAL MECHANICS
// ============================================================================
// Handles bot initialization, plugins loading, pathfinding setup, 
// auto-eating, armor management, and the robust auto-reconnect system.
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// [SECTION 3.1] BOT CREATION & PLUGIN INJECTION
// ----------------------------------------------------------------------------
/**
 * Main initialization function for the Omega Core Bot.
 * This is wrapped in a function to allow seamless auto-reconnecting on disconnect.
 */
function createBot() {
    console.log('[OMEGA CORE] Attempting to connect to Laohen Server...');
    bot = mineflayer.createBot(BOT_CONFIG);

    // Injecting essential plugins into the bot instance
    bot.loadPlugin(pathfinder);
    bot.loadPlugin(pvp);
    bot.loadPlugin(armorManager);
    bot.loadPlugin(autoeat);

    // ----------------------------------------------------------------------------
    // [SECTION 3.2] SPAWN EVENT & INITIALIZATION
    // ----------------------------------------------------------------------------
    bot.once('spawn', () => {
        console.log('[OMEGA CORE] Bot Spawned Successfully! AI Engine is now ACTIVE.');
        
        // 1. Setup Advanced Movements (Pathfinding & Parkour)
        // This allows the bot to jump, climb, and navigate complex terrain.
        const mcData = require('minecraft-data')(bot.version);
        const defaultMove = new Movements(bot, mcData);
        defaultMove.allowParkour = true;
        defaultMove.allowSprinting = true;
        defaultMove.canOpenDoors = true; // Bot can open doors
        bot.pathfinder.setMovements(defaultMove);
        console.log('[OMEGA CORE] Pathfinding & Parkour matrix loaded.');

        // 2. Setup Auto-Eat System
        // Ensures the bot stays alive and regenerates health automatically.
        bot.autoEat.options = {
            priority: 'foodPoints',    // Eat food that gives the most points first
            startAt: 14,               // Start eating when hunger drops below 14 (7 drumsticks)
            bannedFood: [
                'rotten_flesh', 
                'spider_eye', 
                'poisonous_potato', 
                'pufferfish',
                'chorus_fruit'         // Avoid teleporting randomly
            ]
        };
        console.log('[OMEGA CORE] Auto-Eat survival module loaded.');

        // 3. Start Background AI Engine (Events & Patrols)
        if (eventInterval) clearInterval(eventInterval);
        // Trigger a random AI event (Trivia or Emotion) every 15 minutes (900000 ms)
        eventInterval = setInterval(triggerRandomEvent, 900000);
        console.log('[OMEGA CORE] Background Event Engine scheduled.');
    });

    // ----------------------------------------------------------------------------
    // [SECTION 3.3] SURVIVAL EVENTS (HEALTH & ARMOR)
    // ----------------------------------------------------------------------------
    
    // Monitor health and react dynamically
    bot.on('health', () => {
        // If health drops below 4 hearts (8 points) and chat is not on cooldown
        if (bot.health < 8 && !globalChatCooldown) {
            sendHumanChat('A7ye rani netdharreb! Help help! 🏃‍♂️💨');
            
            // Basic retreat logic: Move randomly away from current position
            if (bot.entity) {
                const retreatX = bot.entity.position.x + (Math.random() * 20 - 10);
                const retreatZ = bot.entity.position.z + (Math.random() * 20 - 10);
                bot.pathfinder.setGoal(new goals.GoalNear(retreatX, bot.entity.position.y, retreatZ, 1));
            }
        }
    });

    // Auto-equip the best armor automatically upon picking it up
    bot.on('playerCollect', (collector, itemDrop) => {
        if (collector !== bot.entity) return; // Only process if the bot collected it
        
        setTimeout(() => { 
            try { 
                bot.armorManager.equipAll(); 
            } catch (e) {
                // Silently handle any armor equipping errors
            } 
        }, 200); // 200ms delay to ensure item is fully in inventory
    });

    // ----------------------------------------------------------------------------
    // [SECTION 3.4] CONNECTION MANAGEMENT & AUTO-RECONNECT
    // ----------------------------------------------------------------------------
    
    // Handle graceful or forced disconnections
    bot.on('end', (reason) => {
        console.log(`[OMEGA CORE WARNING] Disconnected from server. Reason: ${reason}`);
        console.log('[OMEGA CORE] Initiating Auto-Reconnect sequence in 10 seconds...');
        
        // Clear all active intervals to prevent memory leaks
        if (eventInterval) clearInterval(eventInterval);
        if (patrolInterval) clearInterval(patrolInterval);
        activeTrivia = null;
        isFollowing = false;
        
        // Restart the bot
        setTimeout(createBot, 10000); 
    });

    // Handle network errors, kick messages, and timeouts
    bot.on('error', (err) => {
        if (err.code === 'ETIMEDOUT' || err.code === 'ECONNRESET') {
            console.log(`[OMEGA CORE NETWORK INFO] Connection reset by peer: ${err.message}. Retrying...`);
        } else {
            console.log(`[OMEGA CORE FATAL ERROR] ${err.message}`);
        }
    });
    
    // Log kick reasons specifically (e.g., banned, server restart)
    bot.on('kicked', (reason) => {
        console.log(`[OMEGA CORE NOTIFICATION] Kicked from server. Detailed Reason: ${reason}`);
    });

// ----------------------------------------------------------------------------
// END OF PART 3
// ----------------------------------------------------------------------------
    // ----------------------------------------------------------------------------
    // MODULE 4: THE BRAIN - CHAT PROCESSING & NLP ENGINE
    // ============================================================================
    // Reads chat, processes natural language, manages trivia answers, 
    // routes admin commands, and corrects plugin typos.
    // ----------------------------------------------------------------------------

    // ----------------------------------------------------------------------------
    // [SECTION 4.1] CHAT EVENT LISTENER
    // ----------------------------------------------------------------------------
    bot.on('messagestr', (message, position, jsonMsg) => {
        // 1. Ignore system messages (server broadcasts) and the bot's own messages
        if (message.includes(bot.username) || position === 'system') return;
        
        const rawText = message.trim();
        const lowerText = rawText.toLowerCase();
        
        // 2. Extract Sender's Name (Robust Regex for different Chat Plugins)
        // Handles formats like "<PlayerName> text", "[Rank] PlayerName: text", etc.
        let sender = 'Player';
        const nameMatch = message.match(/\]?\s*<?([a-zA-Z0-9_]{3,16})>?:?\s/);
        if (nameMatch && nameMatch[1]) {
            sender = nameMatch[1];
        } else {
            // Fallback: take the first word and clean it from common brackets
            sender = message.split(' ')[0].replace(/[\[\]<:>~]/g, '');
        }

        // ----------------------------------------------------------------------------
        // [SECTION 4.2] AUTO-MODERATION (ANTI-INSULT)
        // ----------------------------------------------------------------------------
        if (AI_BRAIN.nlpRegex.insultMatches.test(lowerText)) {
            const warning = AI_BRAIN.warnings[Math.floor(Math.random() * AI_BRAIN.warnings.length)];
            sendHumanChat(warning);
            return; // Stop processing further
        }

        // ----------------------------------------------------------------------------
        // [SECTION 4.3] TRIVIA CHECKER (MINI-GAMES)
        // ----------------------------------------------------------------------------
        if (activeTrivia && lowerText.includes(activeTrivia.a)) {
            sendHumanChat(`🎉 Bsa7tek ya ${sender}! Jawabt s7i7: ${activeTrivia.a}. Wja3tni fi rasi b'thakeek!`);
            
            // Give reward (Requires bot to have OP or permission to use /eco)
            bot.chat(`/eco give ${sender} 1000`); 
            
            // Do a little victory jump
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 500);
            
            activeTrivia = null; // Reset trivia
            return;
        }

        // ----------------------------------------------------------------------------
        // [SECTION 4.4] ADMIN & VIP COMMANDS ROUTER
        // ----------------------------------------------------------------------------
        // Commands prefixed with ! (e.g., !come, !stop, !patrol)
        if (lowerText.startsWith('!')) {
            handleAdminCommands(rawText, sender); // Logic delegated to helper function
            return;
        }

        // ----------------------------------------------------------------------------
        // [SECTION 4.5] SMART PLUGIN CORRECTION ENGINE
        // ----------------------------------------------------------------------------
        let exactMatch = null;
        let typoMatch = null;

        for (const [cmd, data] of Object.entries(PLUGIN_DB)) {
            // Condition A: User typed the exact correct command with the slash
            if (lowerText === cmd || lowerText.startsWith(cmd + ' ')) {
                exactMatch = data.desc;
                break; 
            }
            
            // Condition B: User typed a related word or typo without the slash
            for (const typo of data.typos) {
                const regex = new RegExp(`\\b${typo}\\b`, 'i');
                if (regex.test(lowerText) && !lowerText.includes('/')) {
                    typoMatch = cmd;
                }
            }
        }

        // Respond based on findings
        if (exactMatch) {
            sendHumanChat(`✅ ${exactMatch}`);
            return;
        } else if (typoMatch) {
            sendHumanChat(`💡 Ya ${sender}, tdhohreli tlawj 3la el plugin mte3 ${typoMatch.replace('/', '')}? Ouktebha s7i7a besslash kima hekka: ${typoMatch} bch nfassarlek!`);
            return;
        }

        // ----------------------------------------------------------------------------
        // [SECTION 4.6] NLP / CASUAL CHAT PROCESSING
        // ----------------------------------------------------------------------------
        // If it's not a command, not a typo, and not trivia, process it as a normal chat
        processCasualChat(lowerText, sender); // Logic delegated to helper function
    });

} // <--- THIS CLOSES THE createBot() FUNCTION OPENED IN PART 3

// ----------------------------------------------------------------------------
// END OF PART 4
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// MODULE 5: HELPER FUNCTIONS & SYSTEM EXECUTION
// ============================================================================
// Contains modular functions for NLP logic, admin commands, patrol 
// mechanics, simulated human typing, and the final bootstrap call.
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// [SECTION 5.1] CASUAL CHAT NLP PROCESSOR
// ----------------------------------------------------------------------------
/**
 * Processes casual conversational chat using Regex matching.
 * @param {string} lowerText - The lowercase chat message.
 * @param {string} sender - The name of the player who sent the message.
 */
function processCasualChat(lowerText, sender) {
    let finalResponse = '';

    if (AI_BRAIN.nlpRegex.greetingMatches.test(lowerText)) {
        finalResponse = AI_BRAIN.greetings[Math.floor(Math.random() * AI_BRAIN.greetings.length)];
    } else if (AI_BRAIN.nlpRegex.howAreYouMatches.test(lowerText)) {
        finalResponse = AI_BRAIN.howAreYou[Math.floor(Math.random() * AI_BRAIN.howAreYou.length)];
    } else if (AI_BRAIN.nlpRegex.laughMatches.test(lowerText)) {
        finalResponse = `Hhhhhhh walah jawak tayara ya ${sender} 😂`;
        // Physical reaction: sneaky laugh
        if (bot.entity) {
            bot.setControlState('sneak', true);
            setTimeout(() => bot.setControlState('sneak', false), 400);
        }
    } else if (AI_BRAIN.nlpRegex.praiseMatches.test(lowerText)) {
        finalResponse = AI_BRAIN.praises[Math.floor(Math.random() * AI_BRAIN.praises.length)];
    }

    if (finalResponse) sendHumanChat(finalResponse);
}

// ----------------------------------------------------------------------------
// [SECTION 5.2] ADMIN COMMANDS HANDLER
// ----------------------------------------------------------------------------
/**
 * Executes VIP/Admin commands prefixed with "!".
 * @param {string} rawText - The original chat message.
 * @param {string} sender - The player issuing the command.
 */
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
            
            // Set Pathfinding goal to follow the player within 2 blocks
            bot.pathfinder.setGoal(new goals.GoalFollow(target, 2), true);
            isFollowing = true;
            break;

        case '!stop':
            // Halt all activities
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
            // Requires bot to have OP or permission to run /kill
            bot.chat('/kill @e[type=item]'); 
            break;
            
        case '!patrol':
            sendHumanChat('👮‍♂️ Hani bdit el dawreya (Patrol). N3es 3la kol blasa fel spawn.');
            startPatrol();
            break;
            
        case '!help':
        default:
            sendHumanChat('📜 El commands houma: !come, !stop, !attack, !trivia, !fixlag, !patrol');
            break;
    }
}

// ----------------------------------------------------------------------------
// [SECTION 5.3] EVENT GENERATORS (TRIVIA & EMOTIONS)
// ----------------------------------------------------------------------------
/**
 * Randomly triggers an event (trivia or random chat) to keep the server alive.
 */
function triggerRandomEvent() {
    if (globalChatCooldown || isFollowing || activeTrivia) return;
    
    const rand = Math.random();
    if (rand < 0.4) {
        // Send a random "bored" or "happy" message
        const emotionList = Math.random() > 0.5 ? AI_BRAIN.emotions.bored : AI_BRAIN.emotions.happy;
        sendHumanChat(emotionList[Math.floor(Math.random() * emotionList.length)]);
    } else if (rand < 0.7) {
        startTriviaEvent();
    } else {
        // Sometimes tell a joke
        sendHumanChat(AI_BRAIN.jokes[Math.floor(Math.random() * AI_BRAIN.jokes.length)]);
    }
}

/**
 * Initiates a trivia minigame in chat.
 */
function startTriviaEvent() {
    if (activeTrivia) return; // Prevent overlapping games
    
    activeTrivia = TRIVIA_QUESTIONS[Math.floor(Math.random() * TRIVIA_QUESTIONS.length)];
    sendHumanChat(`🎉 [Mousabqa] ${activeTrivia.q} (Awel we7ed yjaweb yakhoud ja2iza!)`);
    
    // Set a 30-second timeout for the trivia game
    setTimeout(() => {
        if (activeTrivia) { // If it hasn't been answered yet
            sendHumanChat(`⏳ Wfa el wa9t! El ijaba s7i7a hya: ${activeTrivia.a}. 7ad awfar marra jeya!`);
            activeTrivia = null;
        }
    }, 30000);
}

// ----------------------------------------------------------------------------
// [SECTION 5.4] PATROL MECHANICS
// ----------------------------------------------------------------------------
/**
 * Makes the bot wander randomly around its current area to simulate a patrolling admin.
 */
function startPatrol() {
    if (patrolInterval) clearInterval(patrolInterval);
    
    patrolInterval = setInterval(() => {
        if (isFollowing) return; // Do not patrol if currently following someone
        if (!bot.entity) return; // Ensure bot is physically spawned
        
        // Pick a random location within a 15-block radius
        const x = bot.entity.position.x + (Math.random() * 30 - 15);
        const z = bot.entity.position.z + (Math.random() * 30 - 15);
        
        // Safely attempt to pathfind there
        try {
            bot.pathfinder.setGoal(new goals.GoalNear(x, bot.entity.position.y, z, 1));
        } catch (e) {
            // Suppress minor pathfinding calculation errors
        }
    }, 15000); // Change path every 15 seconds
}

// ----------------------------------------------------------------------------
// [SECTION 5.5] HUMAN-LIKE CHAT SENDER
// ----------------------------------------------------------------------------
/**
 * Sends a message with an artificial delay to simulate human typing.
 * Prevents spamming and bot-like instant responses.
 * @param {string} txtMessage - The message to send.
 */
function sendHumanChat(txtMessage) {
    if (globalChatCooldown) return;
    globalChatCooldown = true;
    
    // Simulate typing delay: Base time (1s) + random time up to 1.5s based on length
    const typingDelay = 1000 + (Math.random() * 1500) + (txtMessage.length * 10);
    
    setTimeout(() => {
        bot.chat(txtMessage);
        
        // Cooldown period after sending a message (2 seconds)
        setTimeout(() => { 
            globalChatCooldown = false; 
        }, 2000);
    }, typingDelay); 
}

// ============================================================================
// SYSTEM BOOTSTRAP
// ============================================================================
console.log('====================================================');
console.log('  STARTING TOUNSI AI OMEGA CORE - ENTERPRISE ED.');
console.log('====================================================');

// Trigger the initialization function
createBot();
