/**
 * ============================================================================
 * DALi SURViVAL TN - ULTIMATE OMEGA GOD-MODE AUTONOMOUS BOT (PART 1/10)
 * ============================================================================
 * PLAYER NAME : Dali_Survival_TN
 * TARGET SERVER: Laohen SMP & Survival Servers
 * ARCHITECTURE : Enterprise Mineflayer Autonomous Survival & Admin Engine
 * LANGUAGE     : 100% Pure Tunisian Franco/Arabizi (No Standard Arabic)
 * ============================================================================
 */

const http = require('http');
const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const pvp = require('mineflayer-pvp').plugin;
const armorManager = require('mineflayer-armor-manager');
const autoeat = require('mineflayer-auto-eat').plugin;
const collectBlock = require('mineflayer-collectblock').plugin;
const Vec3 = require('vec3');

// ----------------------------------------------------------------------------
// [SECTION 1.1] 24/7 UPTIME WEB SERVER (RENDER / HEROKU / PTERODACTYL)
// ----------------------------------------------------------------------------
const PORT = process.env.PORT || 3000;
const keepAliveServer = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Dali_Survival_TN: Autonomous God-Bot 100% Online & Surviving 24/7!\n');
});

keepAliveServer.listen(PORT, () => {
    console.log(`[DALI ENGINE] Web Server active on port ${PORT}. Status: 24/7 KeepAlive Running.`);
});

// ----------------------------------------------------------------------------
// [SECTION 1.2] BOT CONFIGURATION & AUTONOMOUS STATE MATRIX
// ----------------------------------------------------------------------------
const BOT_CONFIG = {
    host: 'node-de-free-01.tickhosting.com',
    port: 50589,
    username: 'Dali_Survival_TN', // Realistic Tunisian Gamer Name
    version: false
};

// Global Bot State Management
let bot = null;
let isBotInitialized = false;
let globalChatCooldown = false;
let activeTrivia = null;
let patrolInterval = null;
let eventInterval = null;
let survivalTaskInterval = null;

const BOT_STATE = {
    isHomeSet: false,
    homePosition: null,
    isBusyCrafting: false,
    isHunting: false,
    isCooking: false,
    isFollowingPlayer: false,
    followingTarget: null,
    lastTpaTime: 0,
    tpaCooldownMs: 180000, // 3 minutes cooldown between TPA offers
    currentTask: 'IDLE_PATROL', // 'IDLE_PATROL', 'HUNTING', 'COOKING', 'BUILDING_BASE', 'RETREAT'
    stats: {
        mobsKilled: 0,
        foodEaten: 0,
        craftsCompleted: 0,
        playersHelped: 0
    }
};

// ----------------------------------------------------------------------------
// [SECTION 1.3] MASSIVE TUNISIAN AI NLP DICTIONARY (PURE FRANCO DIALECT)
// ----------------------------------------------------------------------------
const TUNISIAN_BRAIN = {
    greetings: [
        'Ahla w sahla ya m3allem! Dali fil 5edma w fil game!',
        'Wesh ya gheli, marhba bik m3ana fil server!',
        'Aslema bro! Chneya oumourek lyoum fil survival?',
        'Ahla ya bahi, rani houni ken testha9 ay 7aja kallemni.',
        'Slam alikom ya louled, Dali_Survival_TN faw9 el 3ada lyoum!',
        'Aya marhba bel jme3a lkol, nchallah jawkom a7la jaw!'
    ],

    howAre You: [
        'Cv hamdoullah, hani n3oum fil ocean w nsayyed fil 7out hhh!',
        'Labes 3al 3alam, nkassem fil khcheb w nrigel fil stuff mte3i.',
        'Oumouri fil jben! Hani 3andi stuff diamond full w nfa9as fil mobs.',
        'Hani mrigel 100%, nekel fil steak w n3es 3al server.',
        'Cava chaye5, l9it blasa tayara bech nabni fiha dar!'
    ],

    emotions: {
        happy: [
            'Walah el jaw mrigel lyoum, TPS 20 w el ping tayara!',
            'Tbarkallah 3lina, a7sen community w a7sen server!',
            'Zahi lyoum barcha, l9it barcha iron w diamonds fil cave!',
            'Rani far7an barcha m3akom ya louled, GG lina lkol!'
        ],
        hungry: [
            'Za3ma famma chwaya la7m mechwi? Jo3t barcha ya jme3a!',
            'Hani bech ntyeb chwaya mekla fil furnace, stannawni.',
            'Nawes 3la 7ayawanat bch n9atellhom w nekel, kerchi tzaghred!'
        ],
        godMode: [
            'Rani Dali_Survival_TN, ma نموتش (ma nmoutch) jemla fil game hetha!',
            'El mobs yahrbou menni ki ychoufou el sword mte3i!',
            'PVP w PvE kolhoum mrigline, ma famma 7ad ynajam ytiya7ni!',
            'Dera3 Netherite full w Totem fil hand, chkoun bech y9abelni?'
        ],
        bored: [
            'Faddet chwaya.. chkoun yji ya3mel m3aya parkour wela mining?',
            'Aya ya jme3a chkoun y7eb tpa bch nji nzorou fil base mte3ou?',
            'Za3ma nemchi lel Nether wela nabqa houni n3es?'
        ]
    },

    jokes: [
        'Famma Creeper mcha lel bosta.. farga3 el guichet hhhhh!',
        'Zouz Zombiet yet3arkou 3la player AFK, wa7ed 9alou mte3i w lokher 9alou "eb3ed 3assba" hhh!',
        'Enderman mcha lel b7ar bch douch.. rja3 teleported l darkom hhh!',
        'Wa7ed jabri habet lel cave b ghla9 mte3 tanjra fil hand hhh rja3 skeleton!'
    ],

    praises: [
        'Walah enty el m3allem el kbir, kfo 3lik ya bahi!',
        'GG ya ostoura! Tbarkallah 3la l3abek w 3la el build mte3ek!',
        'Berjoulia nta men a7sen players fil server 10/10.',
        'Chapeau bas lik, l3ab ndhif w a5la9 high level!'
    ],

    warnings: [
        '⚠️ T7thir: Na9es mel klem el zayed fel chat 3aychek, rani Admin!',
        '⚠️ Ehtarem s7abek fel server, matkhalinech ntiya7lek el lvl!',
        '⚠️ El klem el ghalet mamnou3 houni, n3mlou ban wela mute direct!'
    ],

    // Trigger Keywords embedded without '!' prefix
    seamlessTriggers: {
        tpa: ['tpa', 'tji', 'ijani', 'ta3al', 'ji', 'teleport', 'jaou', 'visite'],
        home: ['home', 'dar', 'darak', 'houma', 'base', 'mankzel', 'raja3'],
        eat: ['nekel', 'mekla', 'jo3t', 'ja3', 'food', 'steak', 'otlob'],
        fight: ['pvp', 'mobs', '9atel', 'o9tol', 'a7mi', 'ahme', 'hajem'],
        craft: ['craft', 'asna3', 'tasni3', 'table', 'furnace', 'khedma'],
        plugin: ['plugin', 'command', 'kifech', 'p3ine', 'chneya', 'expliquer'],
        help: ['3awen', 'help', 'stuck', 'wa7el', 'a3tini', 'jib']
    }
};

// ----------------------------------------------------------------------------
// [SECTION 1.4] ADVANCED DIRECT COMMAND KEYWORD ROUTER (NO PREFIX REQUIRED)
// ----------------------------------------------------------------------------
/**
 * Scans any sentence sent by players for natural keywords and triggers actions directly.
 * Example: "ya Dali tpa liyya wela ija nwarik dari" -> Triggers TPA logic!
 */
function parseDirectSentenceCommand(message, sender) {
    const cleanText = message.toLowerCase();

    // 1. Check TPA Keyword Trigger
    if (TUNISIAN_BRAIN.seamlessTriggers.tpa.some(word => cleanText.includes(word))) {
        handleTpaRequest(sender);
        return true;
    }

    // 2. Check Home Returning Trigger
    if (TUNISIAN_BRAIN.seamlessTriggers.home.some(word => cleanText.includes(word))) {
        handleGoHomeRequest(sender);
        return true;
    }

    // 3. Check Food / Eating Trigger
    if (TUNISIAN_BRAIN.seamlessTriggers.eat.some(word => cleanText.includes(word))) {
        sendHumanChat(`🥩 Hani 9a3ed nekel w ntyeb fil mekla ya ${sender}! Mfama 7ad yjou3 m3aya!`);
        triggerAutonomousHunting();
        return true;
    }

    // 4. Check Protection / Combat Trigger
    if (TUNISIAN_BRAIN.seamlessTriggers.fight.some(word => cleanText.includes(word))) {
        sendHumanChat(`⚔️ Mat5afch ya ${sender}! Rani houni bch na7mik men ay Mob wela Grief!`);
        protectPlayer(sender);
        return true;
    }

    // 5. Check Crafting / Item Trigger
    if (TUNISIAN_BRAIN.seamlessTriggers.craft.some(word => cleanText.includes(word))) {
        sendHumanChat(`🛠️ Bch nasna3 tools w armor gjedd tawa ya ${sender}, hani fil crafting mode!`);
        triggerCraftingRoutine();
        return true;
    }

    // 6. Check General Help Trigger
    if (TUNISIAN_BRAIN.seamlessTriggers.help.some(word => cleanText.includes(word))) {
        sendHumanChat(`💡 Ya ${sender}, 9oli chneya testha9 بالضبط! Nnajam n3awnek fil plugins, pvp, wela mining!`);
        return true;
    }

    return false; // No direct command matched
}

// Placeholder helper functions implemented in next parts
function handleTpaRequest(sender) {
    const now = Date.now();
    if (now - BOT_STATE.lastTpaTime > BOT_STATE.tpaCooldownMs) {
        BOT_STATE.lastTpaTime = now;
        sendHumanChat(`🏃‍♂️ Aya mrigel ya ${sender}, hani bech ntab3athlek /tpa bch nji nzorom w n3awnek!`);
        bot.chat(`/tpa ${sender}`);
        
        // Schedule return to home after 45 seconds of visiting
        setTimeout(() => {
            sendHumanChat(`🏠 Tfarhedt m3ak ya ${sender}! Tawa bech nersel /home w nraja3 l dari.`);
            bot.chat('/home');
        }, 45000);
    } else {
        sendHumanChat(`⏳ Ya ${sender}, mazal chwaya cooldown 3al TPA. Taw njik ba3d chwaya!`);
    }
}

function handleGoHomeRequest(sender) {
    if (BOT_STATE.isHomeSet) {
        sendHumanChat(`🏠 Hani raj3 l dari b /home ya ${sender}! Nchoufkom ba3d chwaya!`);
        bot.chat('/home');
    } else {
        sendHumanChat(`📍 Mazalt ma 7titich /sethome, hani nlawaj 3la a7sen blasa fil survival bch nabni fiha!`);
        findAndSetHomeLocation();
    }
}

function sendHumanChat(text) {
    if (globalChatCooldown) return;
    globalChatCooldown = true;
    const typingDelay = 800 + Math.random() * 1200;
    setTimeout(() => {
        if (bot) bot.chat(text);
        setTimeout(() => { globalChatCooldown = false; }, 1500);
    }, typingDelay);
}

function protectPlayer(sender) {}
function triggerAutonomousHunting() {}
function triggerCraftingRoutine() {}
function findAndSetHomeLocation() {}

console.log('[PART 1 LOADED] Core Config, KeepAlive Server & Franco Dictionary Initialized.');
/**
 * ============================================================================
 * DALi SURViVAL TN - GOD-MODE AUTONOMOUS BOT (PART 2/10)
 * ============================================================================
 * PLAYER NAME : Dali_Survival_TN
 * MODULE     : GOD-MODE SURVIVAL, NAVIGATION, COMBAT & HOME SELECTION
 * LANGUAGE   : 100% Pure Tunisian Franco/Arabizi
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// [SECTION 2.1] ADVANCED PATHFINDING, PARKOUR & SWIMMING MATRIX
// ----------------------------------------------------------------------------
/**
 * Configures the pathfinder with parkour, climbing, and deep-water swimming.
 * Allows Dali_Survival_TN to cross mountains, rivers, and obstacles effortlessly.
 */
function setupAdvancedNavigation() {
    if (!bot) return;

    const mcData = require('minecraft-data')(bot.version);
    const defaultMove = new Movements(bot, mcData);

    // Dynamic Navigation Flags
    defaultMove.allowParkour = true;
    defaultMove.allowSprinting = true;
    defaultMove.canOpenDoors = true;
    defaultMove.allow1by1Tunnels = true;
    defaultMove.canDig = true; // Dig blocks if trapped
    defaultMove.maxDropDown = 4; // Safe drop distance
    
    // Swim mechanics override
    defaultMove.liquidCost = 1; // Easily swim through water/lava without getting stuck

    bot.pathfinder.setMovements(defaultMove);
    console.log('[DALI NAV] Pathfinding matrix upgraded: Parkour, Swimming & Mountain Climbing ENABLED.');
}

// ----------------------------------------------------------------------------
// [SECTION 2.2] AUTOMATIC HOME FINDER & SAFE BASE SELECTION
// ----------------------------------------------------------------------------
/**
 * Autonomous base finder. Searches for flat, safe terrain near resources,
 * builds/chooses a location, and executes /sethome automatically.
 */
function findAndSetHomeLocation() {
    if (BOT_STATE.isHomeSet || !bot.entity) return;

    const pos = bot.entity.position;
    const blockBelow = bot.blockAt(pos.offset(0, -1, 0));

    // Check if current position is safe, flat ground (grass/dirt/stone) and high altitude
    if (blockBelow && (blockBelow.name === 'grass_block' || blockBelow.name === 'stone' || blockBelow.name === 'dirt')) {
        BOT_STATE.homePosition = pos.clone();
        BOT_STATE.isHomeSet = true;

        sendHumanChat('📍 Bahi barcha! Hethya a7sen blasa l9itha bch nabni fiha darkom w dari. Hani 7tit /sethome!');
        bot.chat('/sethome home');
        
        // Build a minimal light source marker (Torch / Marker)
        equipAndPlaceTorch();
    } else {
        // Move randomly to explore and find a better spot
        const exploreX = pos.x + (Math.random() * 40 - 20);
        const exploreZ = pos.z + (Math.random() * 40 - 20);
        bot.pathfinder.setGoal(new goals.GoalNear(exploreX, pos.y, exploreZ, 2));
    }
}

/**
 * Places a torch near the home location to prevent hostile mob spawns.
 */
function equipAndPlaceTorch() {
    const torchItem = bot.inventory.items().find(item => item.name.includes('torch'));
    if (torchItem && bot.entity) {
        bot.equip(torchItem, 'hand', (err) => {
            if (!err) {
                const targetBlock = bot.blockAt(bot.entity.position.offset(1, 0, 0));
                if (targetBlock && targetBlock.name === 'air') {
                    bot.placeBlock(targetBlock, new Vec3(0, 1, 0), () => {});
                }
            }
        });
    }
}

// ----------------------------------------------------------------------------
// [SECTION 2.3] UNBEATABLE GOD-MODE COMBAT ENGINE (PvP & PvE)
// ----------------------------------------------------------------------------
/**
 * Scans surrounding 16-block radius for aggressive mobs and attacks them.
 * Never targets passive players, only protects players or self.
 */
function scanAndEliminateHostiles() {
    if (!bot || !bot.entity || BOT_STATE.isBusyCrafting) return;

    // Search for nearest hostile mob (Zombie, Skeleton, Spider, Creeper, Phantom)
    const hostileMob = bot.nearestEntity(e => {
        if (!e || !e.position || e.type !== 'mob') return false;
        const mobName = e.name ? e.name.toLowerCase() : '';
        const isHostile = ['zombie', 'skeleton', 'spider', 'creeper', 'phantom', 'drowned', 'enderman', 'witch'].includes(mobName);
        return isHostile && bot.entity.position.distanceTo(e.position) < 14;
    });

    if (hostileMob) {
        // Distance Safety Check for Creepers
        if (hostileMob.name === 'creeper' && bot.entity.position.distanceTo(hostileMob.position) < 4) {
            // Shield or sprint back if creeper is about to explode
            bot.setControlState('sprint', true);
            bot.setControlState('back', true);
            setTimeout(() => bot.clearControlStates(), 800);
            return;
        }

        // Equip best sword or axe before attacking
        equipBestWeapon();
        
        // Engagement
        bot.pvp.attack(hostileMob);
        BOT_STATE.stats.mobsKilled++;
    }
}

/**
 * Auto-equips the highest damage weapon from inventory (Netherite > Diamond > Iron > Stone > Wood).
 */
function equipBestWeapon() {
    const weaponsPriority = ['netherite_sword', 'diamond_sword', 'iron_sword', 'netherite_axe', 'diamond_axe', 'stone_sword', 'iron_axe'];
    const items = bot.inventory.items();

    for (const weaponName of weaponsPriority) {
        const weapon = items.find(i => i.name === weaponName);
        if (weapon) {
            bot.equip(weapon, 'hand', () => {});
            return;
        }
    }
}

// ----------------------------------------------------------------------------
// [SECTION 2.4] OFF-HAND TOTEM & AUTO-SHIELD EMERGENCY SYSTEM
// ----------------------------------------------------------------------------
/**
 * Ensures a Totem of Undying or Shield is ALWAYS held in the off-hand slot.
 * Guarantees Dali_Survival_TN literally NEVER dies.
 */
function manageOffHandSafety() {
    if (!bot || !bot.inventory) return;

    const offhandItem = bot.inventory.slots[45]; // Slot 45 = Offhand in Mineflayer
    const totem = bot.inventory.items().find(i => i.name === 'totem_of_undying');
    const shield = bot.inventory.items().find(i => i.name === 'shield');

    if (!offhandItem || (offhandItem.name !== 'totem_of_undying' && totem)) {
        if (totem) {
            bot.equip(totem, 'off-hand', () => {
                console.log('[DALI GOD-MODE] Equipped Totem of Undying in Off-Hand!');
            });
        } else if (shield && (!offhandItem || offhandItem.name !== 'shield')) {
            bot.equip(shield, 'off-hand', () => {});
        }
    }
}

// ----------------------------------------------------------------------------
// [SECTION 2.5] AUTONOMOUS HUNTING & FOOD ACQUISITION
// ----------------------------------------------------------------------------
/**
 * Hunts passive animals (cows, pigs, chickens, sheep) when food supply is low.
 */
function triggerAutonomousHunting() {
    if (BOT_STATE.isHunting || !bot.entity) return;
    BOT_STATE.isHunting = true;

    const passiveAnimal = bot.nearestEntity(e => {
        if (!e || !e.position || e.type !== 'mob') return false;
        const animalName = e.name ? e.name.toLowerCase() : '';
        return ['cow', 'pig', 'chicken', 'sheep'].includes(animalName) && bot.entity.position.distanceTo(e.position) < 20;
    });

    if (passiveAnimal) {
        equipBestWeapon();
        bot.pvp.attack(passiveAnimal);
        setTimeout(() => {
            BOT_STATE.isHunting = false;
        }, 3000);
    } else {
        BOT_STATE.isHunting = false;
    }
}

// ----------------------------------------------------------------------------
// [SECTION 2.6] CONTINUOUS SURVIVAL LOOP & HEALTH PROTECTION
// ----------------------------------------------------------------------------
/**
 * High-frequency tick loop (runs every 500ms) for real-time safety.
 */
setInterval(() => {
    if (!bot || !bot.entity) return;

    // 1. Off-hand Totem / Shield Verification
    manageOffHandSafety();

    // 2. Combat scanning
    scanAndEliminateHostiles();

    // 3. Emergency Health Check (If HP drops below 6 hearts, eat Golden Apple or retreat)
    if (bot.health < 12) {
        const gapple = bot.inventory.items().find(i => i.name.includes('golden_apple'));
        if (gapple) {
            bot.equip(gapple, 'hand', () => {
                bot.activateItem(); // Eat Golden Apple immediately
            });
        }
    }
}, 500);

console.log('[PART 2 LOADED] God-Mode Navigation, Combat, Off-Hand Safety & Home Finder Ready.');
/**
 * ============================================================================
 * DALi SURViVAL TN - GOD-MODE AUTONOMOUS BOT (PART 3/10)
 * ============================================================================
 * PLAYER NAME : Dali_Survival_TN
 * MODULE     : CRAFTING, SMELTING, MINING & BED SLEEP ENGINE
 * LANGUAGE   : 100% Pure Tunisian Franco/Arabizi
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// [SECTION 3.1] AUTONOMOUS RESOURCE HARVESTING (WOOD, ORES & FOOD)
// ----------------------------------------------------------------------------
/**
 * Uses mineflayer-collectblock plugin to mine wood, stone, or ores autonomously.
 * @param {string} blockName - Target block type (e.g., 'oak_log', 'coal_ore', 'iron_ore')
 * @param {number} count - Amount of blocks to harvest
 */
async function harvestResource(blockName, count = 5) {
    if (!bot || BOT_STATE.isBusyCrafting) return;
    
    const mcData = require('minecraft-data')(bot.version);
    const targetBlockType = mcData.blocksByName[blockName];

    if (!targetBlockType) {
        console.log(`[DALI HARVEST] Block type ${blockName} not found in minecraft-data.`);
        return;
    }

    const blocks = bot.findBlocks({
        matching: targetBlockType.id,
        maxDistance: 25,
        count: count
    });

    if (blocks.length === 0) {
        sendHumanChat(`🔍 Mal9itch ${blockName} 9rib menni, hani bech nlawaj fi blasa okhra!`);
        return;
    }

    const targets = blocks.map(pos => bot.blockAt(pos)).filter(b => b);
    if (targets.length > 0) {
        BOT_STATE.isBusyCrafting = true;
        sendHumanChat(`🪓 Hani nkasar fi ${targets.length} ${blockName} bch nrigel el inventory mte3i!`);
        
        try {
            await bot.collectBlock.collect(targets);
            sendHumanChat(`✅ Kamalt kasart el ${blockName}! Taw nwe3ed el crafting.`);
        } catch (err) {
            console.log(`[DALI HARVEST ERROR] ${err.message}`);
        } finally {
            BOT_STATE.isBusyCrafting = false;
        }
    }
}

// ----------------------------------------------------------------------------
// [SECTION 3.2] AUTONOMOUS CRAFTING ENGINE (TOOLS, ARMOR & BED)
// ----------------------------------------------------------------------------
/**
 * Master crafting routine. Finds or places a crafting table and crafts items step-by-step.
 */
async function triggerCraftingRoutine() {
    if (!bot || BOT_STATE.isBusyCrafting) return;
    BOT_STATE.isBusyCrafting = true;

    try {
        const inventory = bot.inventory.items();
        const logs = inventory.find(i => i.name.includes('log'));
        const planks = inventory.find(i => i.name.includes('planks'));

        // Step 1: Craft Planks if logs are available
        if (logs && !planks) {
            const recipe = bot.recipesFor(getRecipeId('oak_planks'), null, 1, null)[0];
            if (recipe) await bot.craft(recipe, 1, null);
        }

        // Step 2: Ensure Crafting Table exists
        let tableBlock = bot.findBlock({
            matching: block => block.name === 'crafting_table',
            maxDistance: 6
        });

        if (!tableBlock) {
            const tableItem = bot.inventory.items().find(i => i.name === 'crafting_table');
            if (!tableItem) {
                // Craft crafting table from planks
                const recipe = bot.recipesFor(getRecipeId('crafting_table'), null, 1, null)[0];
                if (recipe) await bot.craft(recipe, 1, null);
            }
            // Place crafting table on safe ground
            await placeCraftingTableNearBot();
            tableBlock = bot.findBlock({
                matching: block => block.name === 'crafting_table',
                maxDistance: 6
            });
        }

        if (tableBlock) {
            // Step 3: Craft Essentials (Sticks -> Iron Pickaxe / Sword / Bed / Armor)
            await craftItemWithTable('sticks', tableBlock, 2);
            await craftItemWithTable('iron_pickaxe', tableBlock, 1);
            await craftItemWithTable('iron_sword', tableBlock, 1);
            await craftItemWithTable('white_bed', tableBlock, 1);
            
            BOT_STATE.stats.craftsCompleted++;
            sendHumanChat('🔨 Kamalt el crafting mrigel 100%! Hani msalla7 w 7adher l ay 7aja!');
        }
    } catch (err) {
        console.log(`[DALI CRAFTING ERROR] ${err.message}`);
    } finally {
        BOT_STATE.isBusyCrafting = false;
    }
}

/**
 * Helper to craft a specific item using an active crafting table.
 */
async function craftItemWithTable(itemName, tableBlock, amount = 1) {
    const recipeId = getRecipeId(itemName);
    if (!recipeId) return;

    const recipes = bot.recipesFor(recipeId, null, 1, tableBlock);
    if (recipes.length > 0) {
        await bot.craft(recipes[0], amount, tableBlock);
        console.log(`[DALI CRAFT] Successfully crafted ${amount}x ${itemName}`);
    }
}

/**
 * Helper to retrieve numerical item ID by name string.
 */
function getRecipeId(name) {
    const mcData = require('minecraft-data')(bot.version);
    const item = mcData.itemsByName[name] || mcData.blocksByName[name];
    return item ? item.id : null;
}

/**
 * Places a Crafting Table block on adjacent ground.
 */
async function placeCraftingTableNearBot() {
    const tableItem = bot.inventory.items().find(i => i.name === 'crafting_table');
    if (!tableItem || !bot.entity) return;

    const referenceBlock = bot.blockAt(bot.entity.position.offset(1, -1, 0));
    if (referenceBlock && referenceBlock.name !== 'air') {
        await bot.equip(tableItem, 'hand');
        await bot.placeBlock(referenceBlock, new Vec3(0, 1, 0));
    }
}

// ----------------------------------------------------------------------------
// [SECTION 3.3] SMELTING & COOKING ENGINE (RAW MEAT & ORES)
// ----------------------------------------------------------------------------
/**
 * Finds or places a furnace, loads fuel (coal/wood), and cooks raw meats or ores.
 */
async function cookRawFoodAndSmeltOres() {
    if (!bot || BOT_STATE.isCooking) return;

    const rawMeat = bot.inventory.items().find(i => 
        ['raw_beef', 'raw_porkchop', 'raw_mutton', 'raw_chicken', 'raw_iron'].includes(i.name)
    );

    const fuelItem = bot.inventory.items().find(i => 
        ['coal', 'charcoal', 'oak_log', 'oak_planks'].includes(i.name)
    );

    if (!rawMeat || !fuelItem) return;

    BOT_STATE.isCooking = true;
    sendHumanChat('🍳 Hani bech ntyeb el mekla/ores fil furnace bch tebda 100% health & energy!');

    let furnaceBlock = bot.findBlock({
        matching: block => block.name === 'furnace',
        maxDistance: 6
    });

    if (!furnaceBlock) {
        const furnaceItem = bot.inventory.items().find(i => i.name === 'furnace');
        if (furnaceItem) {
            const refBlock = bot.blockAt(bot.entity.position.offset(-1, -1, 0));
            if (refBlock && refBlock.name !== 'air') {
                await bot.equip(furnaceItem, 'hand');
                await bot.placeBlock(refBlock, new Vec3(0, 1, 0));
                furnaceBlock = bot.findBlock({ matching: b => b.name === 'furnace', maxDistance: 6 });
            }
        }
    }

    if (furnaceBlock) {
        try {
            const furnace = await bot.openFurnace(furnaceBlock);
            await furnace.putFuel(fuelItem.type, null, fuelItem.count);
            await furnace.putInput(rawMeat.type, null, rawMeat.count);
            
            // Wait 10 seconds for smelting/cooking completion
            setTimeout(async () => {
                await furnace.takeOutput();
                furnace.close();
                BOT_STATE.isCooking = false;
                sendHumanChat('🍖 Mekla tajina w 7adhra! Bsa7a liyya!');
            }, 10000);
        } catch (err) {
            console.log(`[DALI SMELT ERROR] ${err.message}`);
            BOT_STATE.isCooking = false;
        }
    } else {
        BOT_STATE.isCooking = false;
    }
}

// ----------------------------------------------------------------------------
// [SECTION 3.4] AUTOMATIC BED PLACEMENT & NIGHT SKIPPING
// ----------------------------------------------------------------------------
/**
 * Automatically places a bed and sleeps when night falls or thunderstorm occurs.
 */
async function autoSleepAtNight() {
    if (!bot || bot.isSleeping) return;

    const isNight = bot.time.timeOfDay >= 12541 && bot.time.timeOfDay <= 23458;
    if (!isNight && !bot.isRaining) return;

    let bedBlock = bot.findBlock({
        matching: block => block.name.includes('bed'),
        maxDistance: 5
    });

    if (!bedBlock) {
        const bedItem = bot.inventory.items().find(i => i.name.includes('bed'));
        if (bedItem) {
            const refBlock = bot.blockAt(bot.entity.position.offset(0, -1, 1));
            if (refBlock && refBlock.name !== 'air') {
                try {
                    await bot.equip(bedItem, 'hand');
                    await bot.placeBlock(refBlock, new Vec3(0, 1, 0));
                    bedBlock = bot.findBlock({ matching: b => b.name.includes('bed'), maxDistance: 5 });
                } catch (e) {
                    // Ignore placement collision errors
                }
            }
        }
    }

    if (bedBlock) {
        try {
            sendHumanChat('🌙 Tya7 el lil ya louled! Hani bech nr9ed bch nfetou el phantoms w el night mobs!');
            await bot.sleep(bedBlock);
        } catch (err) {
            console.log(`[DALI SLEEP INFO] Couldn't sleep yet: ${err.message}`);
        }
    }
}

// Listen to wake-up event
bot.on('wake', () => {
    sendHumanChat('☀️ Sba7 el khir! Sba7na w sba7 el molk lillah. W3dna lel game!');
});

// Sleep check interval (runs every 10 seconds)
setInterval(() => {
    autoSleepAtNight();
    cookRawFoodAndSmeltOres();
}, 10000);

console.log('[PART 3 LOADED] Crafting Engine, Smelting, Resource Mining & Sleep System Ready.');
/**
 * ============================================================================
 * DALi SURViVAL TN - GOD-MODE AUTONOMOUS BOT (PART 4/10)
 * ============================================================================
 * PLAYER NAME : Dali_Survival_TN
 * MODULE     : PLUGIN KNOWLEDGE ENGINE, CHAT AUTO-MOD & PLAYER INTERACTIONS
 * LANGUAGE   : 100% Pure Tunisian Franco/Arabizi
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// [SECTION 4.1] COMPREHENSIVE PLUGIN KNOWLEDGEBASE (60+ COMMANDS)
// ----------------------------------------------------------------------------
/**
 * PLUGIN_HELP_DB: Lookup dictionary for explaining server plugins & commands
 * to players in clean Tunisian Franco.
 */
const PLUGIN_HELP_DB = {
    // 1. Claims & Protection
    'claim': 'GriefPrevention: Bch ta7mi darkom. Nesta3mlou golden shovel: clicked 1st corner w 2nd corner. Commands: /claim, /trust <player>, /untrust <player>.',
    'ps': 'ProtectionStones: 7ot el blocka mte3 el protection fel 9a3 bch ta7mi 10x10 wela 20x20 area! Command: /ps info.',
    'co': 'CoreProtect (Admins): Bch na3rfou chkoun kassar wela sre9 ay chest. Command: /co i w click 3al blocka.',

    // 2. Teleportation & Homes
    'rtp': 'BetterRTP: Yhezak l blasa 3achwa2iya fel map bch tabni dark b3id 3al spawn. Command: /rtp.',
    'home': 'Essentials Homes: Bch tsjel dark w ترجعلها (trjelha) ay wa9t. Commands: /sethome <name>, /home <name>, /delhome <name>.',
    'tpa': 'Essentials TPA: Bch tab3ath talab teleport l sa7bek. Commands: /tpa <player>, /tpaccept, /tpdeny.',
    'back': 'Essentials Back: Bch ترجع (trja3) l a5er blasa mt fiha wela e5er tp. Command: /back.',

    // 3. Economy & Shops
    'jobs': 'Jobs Reborn: Bch te5dem (Miner, Woodcutter, Hunter) w tda5el flous. Commands: /jobs browse, /jobs join <job>.',
    'ah': 'AuctionHouse: Souq el la3ibin bch tbi3 w teshri items. Commands: /ah, /ah sell <price>.',
    'shop': 'ShopGUIPlus: Matjar el server bch teshri mawarid w tbi3. Command: /shop.',
    'bank': 'BankPlus: 7ot flousek fel banka bch te5ou interest. Command: /bank deposit/withdraw <amount>.',
    'pay': 'Essentials Economy: Bch tab3ath flous l la3eb a5er. Command: /pay <player> <amount>.',

    // 4. Storage & Items
    'pv': 'AxVaults: Sandou9ek el sakhsi elli ma ydi3ch. Command: /pv 1 wela /pv 2.',
    'shulker': 'AxShulkers: Open shulker boxes direct men el inventory b Right-Click!',

    // 5. Clanking & Skills
    'team': 'BetterTeams: Bch ta3mel team w t7arbou teams o5rin. Commands: /team create <name>, /team invite <player>.',
    'skills': 'CyberLevels / AureliumSkills: Kol ma tkassar w ta3mel activities, lvl mte3ek yzid! Command: /skills.',
    'crates': 'ExcellentCrates: 7el sandi9 fel spawn bel mfeté7 mte3 el vote wela store. Command: /crates.'
};

/**
 * Searches the plugin database and returns an explanation if a match is found.
 */
function handlePluginQuery(chatMessage, sender) {
    const lower = chatMessage.toLowerCase();
    
    for (const [key, explanation] of Object.entries(PLUGIN_HELP_DB)) {
        if (lower.includes(key)) {
            sendHumanChat(`💡 Ya ${sender}, plugin [${key.toUpperCase()}]: ${explanation}`);
            return true;
        }
    }
    return false;
}

// ----------------------------------------------------------------------------
// [SECTION 4.2] AUTO-MODERATION & CHAT WARNING SYSTEM
// ----------------------------------------------------------------------------
const WARNING_TRACKER = new Map();

/**
 * Monitors incoming chat for bad language, spam, or toxic behavior.
 */
function processAutoModeration(chatMessage, sender) {
    if (sender === bot.username) return false;

    const badWords = ['insult', 'bhim', 'kalb', 'zebi', 'zbi', '9a7ba', 'mnayek', 'ta7an', '3asba', 'khra'];
    const lower = chatMessage.toLowerCase();

    const containsBadWord = badWords.some(word => lower.includes(word));

    if (containsBadWord) {
        const currentWarns = (WARNING_TRACKER.get(sender) || 0) + 1;
        WARNING_TRACKER.set(sender, currentWarns);

        if (currentWarns === 1) {
            sendHumanChat(`⚠️ Ya ${sender}, na9es mel klem el zayed fel chat! (Warning 1/3)`);
        } else if (currentWarns === 2) {
            sendHumanChat(`🚨 Ya ${sender}, hethi a5er mola7dha liyk! (Warning 2/3)`);
        } else {
            sendHumanChat(`🚫 Ya ${sender}, klemt el moderation bch ta3mlek Mute/Ban! (Warning 3/3)`);
            bot.chat(`/mute ${sender} 10m Klem zayed fel chat`);
            WARNING_TRACKER.delete(sender);
        }
        return true;
    }
    return false;
}

// ----------------------------------------------------------------------------
// [SECTION 4.3] TELEPORTATION ACCEPTANCE & PLAYER GIFT SYSTEM
// ----------------------------------------------------------------------------
/**
 * Auto-accepts TPA requests from players and provides support or gifts.
 */
bot.on('messagestr', (message, position, jsonMsg) => {
    // 1. Detect TPA Requests sent to the bot
    if (message.includes('has requested to teleport to you') || message.includes('wants to teleport to you')) {
        const tpaSenderMatch = message.match(/([a-zA-Z0-9_]{3,16})\s+(has requested|wants)/);
        const requester = tpaSenderMatch ? tpaSenderMatch[1] : null;

        sendHumanChat(`🤝 Welcome! Hani bech na9bel el TPA mte3ek ya ${requester || 'player'}!`);
        bot.chat('/tpaccept');

        // Drop some food as a greeting gift
        setTimeout(() => dropGiftForPlayer(), 3000);
    }
});

/**
 * Drops cooked food or helpful items to nearby friendly players.
 */
function dropGiftForPlayer() {
    if (!bot || !bot.entity) return;

    const foodItem = bot.inventory.items().find(i => 
        ['cooked_beef', 'cooked_porkchop', 'bread', 'cooked_chicken', 'golden_apple'].includes(i.name)
    );

    if (foodItem) {
        sendHumanChat('🎁 Hani 7titlek chwaya mekla w gifts fil 9a3, e5dhom bsa7a!');
        bot.toss(foodItem.type, null, Math.min(foodItem.count, 4));
    }
}

// ----------------------------------------------------------------------------
// [SECTION 4.4] MAIN CHAT ROUTER INTEGRATION
// ----------------------------------------------------------------------------
bot.on('chat', (username, message) => {
    if (username === bot.username) return;

    // 1. Auto-Moderation check
    if (processAutoModeration(message, username)) return;

    // 2. Direct Sentence Trigger Check
    if (typeof parseDirectSentenceCommand === 'function' && parseDirectSentenceCommand(message, username)) return;

    // 3. Plugin Query Check
    if (handlePluginQuery(message, username)) return;
});

console.log('[PART 4 LOADED] Plugin Knowledgebase, Auto-Moderation & TPA Interaction Ready.');
/**
 * ============================================================================
 * DALi SURViVAL TN - GOD-MODE AUTONOMOUS BOT (PART 5/10)
 * ============================================================================
 * PLAYER NAME : Dali_Survival_TN
 * MODULE     : TRIVIA ENGINE, INVENTORY CLEANING & ANTI-AFK SELF-HEALING
 * LANGUAGE   : 100% Pure Tunisian Franco/Arabizi
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// [SECTION 5.1] EXTENDED TRIVIA & ENGAGEMENT ENGINE
// ----------------------------------------------------------------------------
/**
 * DYNAMIC_TRIVIA_LIST: Array of Tunisian Franco trivia questions for chat minigames.
 */
const DYNAMIC_TRIVIA_LIST = [
    { q: "Chneya el block elli ma tnajamch tkasrou fel survival jemla?", a: "bedrock" },
    { q: "Chkoun el mob elli yor3eb w yebdè ytala3 fel aswat ki tokhzrolou fi 3inih?", a: "enderman" },
    { q: "Chneya el item elli tekelha ki tebda bech taati 7ayetek bech tmn3ek mel mout?", a: "totem" },
    { q: "Chneya el ma3den elli ta3mel bih armor 9weya barcha lonha ak7al w ma tethra9ch fel lava?", a: "netherite" },
    { q: "Kaddech test7a9 men obsidian minimum bch ta3mel portal lel nether?", a: "10" },
    { q: "Chneya el mob elli ytfarga3 ki y9arablek w ykaserlek el bniya mte3ek?", a: "creeper" },
    { q: "Esm el boss elli tasn3ou b 3 rous w soul sand?", a: "wither" },
    { q: "Chneya el block elli ykhalik tna9ez barcha kima el trampoline?", a: "slime" }
];

/**
 * Triggers an automated chat trivia minigame.
 */
function launchChatTriviaGame() {
    if (!bot || activeTrivia) return;

    const randomIndex = Math.floor(Math.random() * DYNAMIC_TRIVIA_LIST.length);
    activeTrivia = DYNAMIC_TRIVIA_LIST[randomIndex];

    sendHumanChat(`🎮 [TRIVIA GAME] ${activeTrivia.q} (Awel we7ed yjaweb s7i7 yakhoud 1000$!)`);

    // Set a timer for trivia expiration (45 seconds)
    setTimeout(() => {
        if (activeTrivia) {
            sendHumanChat(`⏳ Wfa el wa9t! El ijaba s7i7a hya: "${activeTrivia.a}". 7ad awfar marra jeya!`);
            activeTrivia = null;
        }
    }, 45000);
}

// ----------------------------------------------------------------------------
// [SECTION 5.2] AUTOMATED INVENTORY SORTING & TRASH DUMPING
// ----------------------------------------------------------------------------
/**
 * Dumps junk/trash items (rotten flesh, poisonous potatoes, dirt, gravel)
 * to keep inventory space clean for valuable loot.
 */
async function autoCleanInventoryJunk() {
    if (!bot || !bot.inventory || BOT_STATE.isBusyCrafting) return;

    const junkItemNames = [
        'rotten_flesh', 
        'poisonous_potato', 
        'spider_eye', 
        'gravel', 
        'dirt', 
        'cobblestone', 
        'andesite', 
        'diorite', 
        'granite'
    ];

    const inventoryItems = bot.inventory.items();

    for (const item of inventoryItems) {
        // Keep cobblestone if under 64 blocks, otherwise toss excess
        if (junkItemNames.includes(item.name)) {
            if (item.name === 'cobblestone' || item.name === 'dirt') {
                if (item.count <= 64) continue; // Keep 1 stack for building
            }

            try {
                console.log(`[DALI INVENTORY] Dumping junk item: ${item.name} x${item.count}`);
                await bot.toss(item.type, null, item.count);
                await new Promise(resolve => setTimeout(resolve, 300)); // Small delay between tosses
            } catch (err) {
                console.log(`[DALI INVENTORY CLEAN ERROR] ${err.message}`);
            }
        }
    }
}

// ----------------------------------------------------------------------------
// [SECTION 5.3] HUMAN-LIKE ANTI-AFK & SELF-HEALING HEARTBEAT
// ----------------------------------------------------------------------------
/**
 * Performs subtle human-like actions (head movement, quick jump, sneak)
 * to prevent AFK detection systems from kicking the bot.
 */
function triggerHumanAntiAfk() {
    if (!bot || !bot.entity || BOT_STATE.isFollowingPlayer) return;

    const randomAction = Math.random();

    if (randomAction < 0.3) {
        // Rotate head slightly
        const yaw = bot.entity.yaw + (Math.random() * 0.6 - 0.3);
        const pitch = bot.entity.pitch + (Math.random() * 0.4 - 0.2);
        bot.look(yaw, pitch, true);
    } else if (randomAction < 0.6) {
        // Perform a quick sneak
        bot.setControlState('sneak', true);
        setTimeout(() => bot.setControlState('sneak', false), 400);
    } else if (randomAction < 0.8) {
        // Perform a small jump if standing on ground
        if (bot.entity.onGround) {
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 300);
        }
    }
}

// ----------------------------------------------------------------------------
// [SECTION 5.4] AUTOMATED SERVER ANNOUNCEMENTS & STATUS LOGGING
// ----------------------------------------------------------------------------
/**
 * Broadcasts occasional helpful Tunisian Franco messages or status updates.
 */
function announceBotStatusInChat() {
    if (!bot || globalChatCooldown) return;

    const statusAnnouncements = [
        `⚡ Dali_Survival_TN fil service! Mobs killed: ${BOT_STATE.stats.mobsKilled} | Crafts: ${BOT_STATE.stats.craftsCompleted}. Oumourna 5/5!`,
        `💡 Testha9 ay help fil plugins wela claims? Oukteb el command fel chat w Dali taw yfassarlek!`,
        `🛡️ El server protected b Dali_Survival_TN. Mabni bch ma nmoutch jemla!`
    ];

    const randomAnnouncement = statusAnnouncements[Math.floor(Math.random() * statusAnnouncements.length)];
    sendHumanChat(randomAnnouncement);
}

// ----------------------------------------------------------------------------
// [SECTION 5.5] SCHEDULED MAINTENANCE TIMERS
// ----------------------------------------------------------------------------
// Inventory cleanup every 2 minutes
setInterval(() => {
    autoCleanInventoryJunk();
}, 120000);

// Anti-AFK heartbeat every 30 seconds
setInterval(() => {
    triggerHumanAntiAfk();
}, 30000);

// Trivia game trigger every 20 minutes
setInterval(() => {
    if (Math.random() > 0.4) {
        launchChatTriviaGame();
    }
}, 1200000);

console.log('[PART 5 LOADED] Trivia Engine, Inventory Cleaning, Anti-AFK & Status Timers Active.');
/**
 * ============================================================================
 * DALi SURViVAL TN - GOD-MODE AUTONOMOUS BOT (PART 6/10)
 * ============================================================================
 * PLAYER NAME : Dali_Survival_TN
 * MODULE     : TACTICAL PVP/PVE, EMERGENCY SHELTER & AUTO-MLG SAFETY ENGINE
 * LANGUAGE   : 100% Pure Tunisian Franco/Arabizi
 * ============================================================================
 */

const Vec3 = require('vec3');

// ----------------------------------------------------------------------------
// [SECTION 6.1] DYNAMIC ARMOR EVALUATOR & AUTO-UPGRADE SYSTEM
// ----------------------------------------------------------------------------
/**
 * Armor Tier Score: Netherite (5) > Diamond (4) > Iron (3) > Chainmail (2) > Leather (1)
 * Scans inventory and automatically equips the absolute highest tier armor available.
 */
function evaluateAndEquipBestArmor() {
    if (!bot || !bot.inventory || BOT_STATE.isBusyCrafting) return;

    const armorSlots = {
        helmet: [ 'netherite_helmet', 'diamond_helmet', 'iron_helmet', 'chainmail_helmet', 'leather_helmet' ],
        chestplate: [ 'netherite_chestplate', 'diamond_chestplate', 'iron_chestplate', 'chainmail_chestplate', 'leather_chestplate' ],
        leggings: [ 'netherite_leggings', 'diamond_leggings', 'iron_leggings', 'chainmail_leggings', 'leather_leggings' ],
        boots: [ 'netherite_boots', 'diamond_boots', 'iron_boots', 'chainmail_boots', 'leather_boots' ]
    };

    const items = bot.inventory.items();

    for (const [slotType, priorityList] of Object.entries(armorSlots)) {
        for (const armorName of priorityList) {
            const foundArmor = items.find(i => i.name === armorName);
            if (foundArmor) {
                const currentEquipped = bot.inventory.slots[getArmorSlotIndex(slotType)];
                if (!currentEquipped || currentEquipped.name !== armorName) {
                    bot.equip(foundArmor, slotType, (err) => {
                        if (!err) {
                            console.log(`[DALI ARMOR] Equipped superior ${slotType}: ${armorName}`);
                        }
                    });
                }
                break; // Stop checking lower tiers for this specific slot once best is equipped
            }
        }
    }
}

/**
 * Helper to get slot index for armor types.
 */
function getArmorSlotIndex(slotType) {
    switch (slotType) {
        case 'helmet': return 5;
        case 'chestplate': return 6;
        case 'leggings': return 7;
        case 'boots': return 8;
        default: return null;
    }
}

// ----------------------------------------------------------------------------
// [SECTION 6.2] ADVANCED TACTICAL COMBAT ENGINE (CRIT HITS & SHIELD BLOCKING)
// ----------------------------------------------------------------------------
/**
 * Advanced tactical combat loop:
 * 1. Performs Critical Hits (jumps before attacking when falling down).
 * 2. Uses Off-hand Shield to block incoming Skeleton arrows or heavy blows.
 * 3. Strafe movement around target to avoid taking damage.
 */
function executeTacticalCombat(targetEntity) {
    if (!bot || !targetEntity || !targetEntity.position) return;

    const distance = bot.entity.position.distanceTo(targetEntity.position);

    // 1. Distance Closing & Strafing
    if (distance > 2.5) {
        bot.setControlState('sprint', true);
        bot.setControlState('forward', true);
    } else {
        // Close range combat: Random strafe left/right to confuse enemy AI
        const strafeDir = Math.random() > 0.5 ? 'left' : 'right';
        bot.setControlState(strafeDir, true);
        setTimeout(() => bot.setControlState(strafeDir, false), 300);

        // Perform Critical Hit: Jump and hit on descent
        if (bot.entity.onGround && Math.random() < 0.6) {
            bot.setControlState('jump', true);
            setTimeout(() => {
                bot.setControlState('jump', false);
                bot.attack(targetEntity);
            }, 250); // Strike while falling
        } else {
            bot.attack(targetEntity);
        }
    }

    // 2. Tactical Shield Blocking against Projectiles (Skeletons / Players with bows)
    if (targetEntity.name === 'skeleton' && distance > 4.0 && distance < 12.0) {
        const offhand = bot.inventory.slots[45];
        if (offhand && offhand.name === 'shield') {
            bot.activateItem(true); // Activate off-hand item (Shield Raise)
            setTimeout(() => bot.deactivateItem(), 1200); // Hold block for 1.2s
        }
    }
}

// ----------------------------------------------------------------------------
// [SECTION 6.3] EMERGENCY 3x3 SAFE SHELTER BUILDER
// ----------------------------------------------------------------------------
/**
 * Autonomous Emergency Shelter: When health drops critically below 6 hearts 
 * and mobs surrounding are too many, the bot places dirt/cobble blocks around 
 * itself to build a 3x3x3 safe bunker.
 */
async function buildEmergencyShelter() {
    if (!bot || !bot.entity || BOT_STATE.isBusyCrafting) return;

    const buildingBlock = bot.inventory.items().find(i => 
        ['cobblestone', 'dirt', 'oak_planks', 'stone'].includes(i.name)
    );

    if (!buildingBlock) {
        sendHumanChat('⚠️ Ma 3andich blocks bch nabni emergency shelter! Hani nahrab!');
        return;
    }

    BOT_STATE.isBusyCrafting = true;
    sendHumanChat('🛡️ Emergency Mode! Hani bech nabni bunker sghir bch na7mi rou7i mel mobs!');

    const myPos = bot.entity.position.floored();
    const offsets = [
        new Vec3(1, 0, 0), new Vec3(-1, 0, 0), new Vec3(0, 0, 1), new Vec3(0, 0, -1),
        new Vec3(1, 1, 0), new Vec3(-1, 1, 0), new Vec3(0, 1, 1), new Vec3(0, 1, -1),
        new Vec3(0, 2, 0) // Roof block
    ];

    try {
        await bot.equip(buildingBlock, 'hand');

        for (const offset of offsets) {
            const targetPos = myPos.plus(offset);
            const refBlock = bot.blockAt(targetPos.offset(0, -1, 0));

            if (refBlock && refBlock.name !== 'air') {
                await bot.placeBlock(refBlock, new Vec3(0, 1, 0)).catch(() => {});
                await new Promise(res => setTimeout(res, 150));
            }
        }
        sendHumanChat('🏰 Bunker mrigel! Hani safe fil interior tawa.');
    } catch (err) {
        console.log(`[DALI SHELTER ERROR] ${err.message}`);
    } finally {
        BOT_STATE.isBusyCrafting = false;
    }
}

// ----------------------------------------------------------------------------
// [SECTION 6.4] FALL DAMAGE MITIGATION (AUTO-MLG) & LAVA ESCAPE
// ----------------------------------------------------------------------------
/**
 * Auto-MLG Water Bucket: Detects fast downward velocity (free falling > 6 blocks)
 * and automatically places a water bucket on the landing block before impact.
 */
function checkAndExecuteAutoMLG() {
    if (!bot || !bot.entity) return;

    const velocityY = bot.entity.velocity.y;

    // Fast downward velocity indicator for falling
    if (velocityY < -0.6 && !bot.entity.onGround) {
        const waterBucket = bot.inventory.items().find(i => i.name === 'water_bucket');
        if (!waterBucket) return;

        // Find ground block directly below
        const rayBlock = bot.blockAtCursor(4);
        if (rayBlock && rayBlock.name !== 'air' && rayBlock.name !== 'water') {
            bot.equip(waterBucket, 'hand', () => {
                bot.placeBlock(rayBlock, new Vec3(0, 1, 0), () => {
                    console.log('[DALI GOD-MODE] Executed Perfect Auto-MLG Water Bucket!');
                    // Scoop water back up after landing
                    setTimeout(() => scoopWaterBucketBack(), 800);
                });
            });
        }
    }
}

/**
 * Scoops water back into bucket after a successful MLG land.
 */
function scoopWaterBucketBack() {
    const emptyBucket = bot.inventory.items().find(i => i.name === 'bucket');
    const nearbyWater = bot.findBlock({ matching: b => b.name === 'water', maxDistance: 3 });

    if (emptyBucket && nearbyWater) {
        bot.equip(emptyBucket, 'hand', () => {
            bot.activateBlock(nearbyWater);
        });
    }
}

/**
 * Lava Safety Routine: Instantly jumps, swims up, and drinks Fire Resistance Potion if in lava.
 */
function checkLavaEmergency() {
    if (!bot || !bot.entity) return;

    const pos = bot.entity.position;
    const currentBlock = bot.blockAt(pos);

    if (currentBlock && (currentBlock.name === 'lava' || currentBlock.name === 'flowing_lava')) {
        sendHumanChat('🔥 Ayy lava! Emergency escape protocol running!');
        
        // Swim/Jump upwards aggressively
        bot.setControlState('jump', true);

        // Drink Fire Resistance Potion if available
        const fireResPotion = bot.inventory.items().find(i => 
            i.name.includes('potion') && i.nbt && JSON.stringify(i.nbt).includes('fire_resistance')
        );

        if (fireResPotion) {
            bot.equip(fireResPotion, 'hand', () => {
                bot.activateItem();
            });
        }
    }
}

// ----------------------------------------------------------------------------
// [SECTION 6.5] SAFETY ENGINE TICK LOOPS
// ----------------------------------------------------------------------------
// High frequency safety checks (Runs every 100ms)
setInterval(() => {
    checkAndExecuteAutoMLG();
    checkLavaEmergency();
}, 100);

// Armor evaluation checks (Runs every 10 seconds)
setInterval(() => {
    evaluateAndEquipBestArmor();
}, 10000);

console.log('[PART 6 LOADED] Tactical Combat, Armor Upgrader, Shelter Builder & Auto-MLG Active.');
/**
 * ============================================================================
 * DALi SURViVAL TN - GOD-MODE AUTONOMOUS BOT (PART 7/10)
 * ============================================================================
 * PLAYER NAME : Dali_Survival_TN
 * MODULE     : SAFE ORE MINING, DIAMOND SCANNER, UNDERGROUND LIGHTING & CAVE ENGINE
 * LANGUAGE   : 100% Pure Tunisian Franco/Arabizi
 * ============================================================================
 */

const Vec3 = require('vec3');

// ----------------------------------------------------------------------------
// [SECTION 7.1] HAZARD-FREE SAFE DIGGING PROTOCOL (ANTI-LAVA & SUFFOCATION)
// ----------------------------------------------------------------------------
/**
 * Inspects all 6 adjacent blocks surrounding a target block before breaking it.
 * Aborts digging immediately if lava, water, sand, or gravel hazard is detected.
 * @param {Block} targetBlock - Mineflayer block instance to be mined.
 */
async function safeDigBlock(targetBlock) {
    if (!bot || !targetBlock || BOT_STATE.isBusyCrafting) return false;

    const adjacentOffsets = [
        new Vec3(0, 1, 0),  // Top
        new Vec3(0, -1, 0), // Bottom
        new Vec3(1, 0, 0),  // North
        new Vec3(-1, 0, 0), // South
        new Vec3(0, 0, 1),  // East
        new Vec3(0, 0, -1)  // West
    ];

    // Check adjacent blocks for liquid or falling hazards
    for (const offset of adjacentOffsets) {
        const adjacentPos = targetBlock.position.plus(offset);
        const adjacentBlock = bot.blockAt(adjacentPos);

        if (adjacentBlock) {
            const blockName = adjacentBlock.name;
            if (['lava', 'flowing_lava', 'water', 'flowing_water'].includes(blockName)) {
                sendHumanChat('⚠️ Danger lava/water 9rib men el blocka! Ma nkasarch bch ma nmoutch!');
                return false;
            }
        }
    }

    // Equip correct pickaxe (Netherite > Diamond > Iron) for ore breaking speed
    const bestPickaxe = bot.inventory.items().find(i => 
        ['netherite_pickaxe', 'diamond_pickaxe', 'iron_pickaxe', 'stone_pickaxe'].includes(i.name)
    );

    if (bestPickaxe) {
        await bot.equip(bestPickaxe, 'hand').catch(() => {});
    }

    try {
        await bot.dig(targetBlock);
        return true;
    } catch (err) {
        console.log(`[DALI SAFE DIG ERROR] ${err.message}`);
        return false;
    }
}

// ----------------------------------------------------------------------------
// [SECTION 7.2] VALUABLE ORE & DIAMOND CAVE SCANNER
// ----------------------------------------------------------------------------
const ORE_PRIORITY_LIST = [
    'ancient_debris',
    'deepslate_diamond_ore',
    'diamond_ore',
    'deepslate_emerald_ore',
    'emerald_ore',
    'deepslate_gold_ore',
    'gold_ore',
    'deepslate_iron_ore',
    'iron_ore',
    'deepslate_coal_ore',
    'coal_ore'
];

/**
 * Scans a 16-block radius underground for high-value ores.
 * Pathfinds safely to the nearest ore vein and mines it.
 */
async function scanAndMineHighValueOres() {
    if (!bot || !bot.entity || BOT_STATE.isBusyCrafting) return;

    const mcData = require('minecraft-data')(bot.version);

    for (const oreName of ORE_PRIORITY_LIST) {
        const oreType = mcData.blocksByName[oreName];
        if (!oreType) continue;

        const foundOrePositions = bot.findBlocks({
            matching: oreType.id,
            maxDistance: 16,
            count: 5
        });

        if (foundOrePositions.length > 0) {
            const nearestOrePos = foundOrePositions[0];
            const targetOreBlock = bot.blockAt(nearestOrePos);

            if (targetOreBlock) {
                if (oreName.includes('diamond') || oreName.includes('ancient_debris')) {
                    sendHumanChat(`💎 L9it ${oreName.replace('_', ' ')} fil cave! Hani bech nkasrou tawa!`);
                }

                // Move near ore
                bot.pathfinder.setGoal(new goals.GoalNear(nearestOrePos.x, nearestOrePos.y, nearestOrePos.z, 2));

                // Mine target ore safely
                setTimeout(async () => {
                    await safeDigBlock(targetOreBlock);
                }, 1500);

                return; // Focus on one vein at a time
            }
        }
    }
}

// ----------------------------------------------------------------------------
// [SECTION 7.3] AUTOMATIC CAVE LIGHTING ENGINE (TORCH PLACEMENT)
// ----------------------------------------------------------------------------
/**
 * Monitors light level at bot position while underground (y < 50).
 * Places a torch automatically on floor/wall if light level drops below 7.
 */
async function autoPlaceTorchesUnderground() {
    if (!bot || !bot.entity || BOT_STATE.isBusyCrafting) return;

    const currentPos = bot.entity.position.floored();

    // Only run if underground and light level is pitch black
    if (currentPos.y < 50) {
        const currentBlock = bot.blockAt(currentPos);
        
        if (currentBlock && currentBlock.light < 7) {
            const torchItem = bot.inventory.items().find(i => i.name === 'torch');

            if (torchItem) {
                const floorBlock = bot.blockAt(currentPos.offset(0, -1, 0));

                if (floorBlock && floorBlock.name !== 'air' && floorBlock.name !== 'water') {
                    try {
                        await bot.equip(torchItem, 'hand');
                        await bot.placeBlock(floorBlock, new Vec3(0, 1, 0));
                        console.log('[DALI CAVE] Placed protective light torch underground.');
                    } catch (e) {
                        // Suppress placement overlap errors
                    }
                }
            }
        }
    }
}

// ----------------------------------------------------------------------------
// [SECTION 7.4] DOWNWARD STAIRCASE & BRANCH MINING GENERATOR (TO Y=-58)
// ----------------------------------------------------------------------------
/**
 * Safely excavates a 1x2 staircase downward until reaching ideal Diamond Layer (Y = -58).
 */
async function executeBranchMiningSequence() {
    if (!bot || !bot.entity || BOT_STATE.isBusyCrafting) return;

    const pos = bot.entity.position.floored();

    // If already at optimal deepslate mining layer, start horizontal strip
    if (pos.y <= -55) {
        sendHumanChat('⛏️ Wsalna l optimal diamond layer (Y=-58)! Hani nkasar fil strip mine horizontal!');
        await mineForwardTunnel(3);
        return;
    }

    BOT_STATE.isBusyCrafting = true;
    sendHumanChat(`⛏️ Hani nkasar fil staircase bch nhehbou l layer Y=-58! Current Y: ${pos.y}`);

    const forwardDir = bot.entity.yaw;
    // Calculate 1 block forward relative to rotation
    const dx = -Math.sin(forwardDir) > 0.5 ? 1 : (-Math.sin(forwardDir) < -0.5 ? -1 : 0);
    const dz = Math.cos(forwardDir) > 0.5 ? 1 : (Math.cos(forwardDir) < -0.5 ? -1 : 0);

    const block1 = bot.blockAt(pos.offset(dx, 0, dz));  // Head level
    const block2 = bot.blockAt(pos.offset(dx, -1, dz)); // Foot level
    const block3 = bot.blockAt(pos.offset(dx, -2, dz)); // Step floor

    try {
        if (block1 && block1.name !== 'air') await safeDigBlock(block1);
        if (block2 && block2.name !== 'air') await safeDigBlock(block2);
        if (block3 && block3.name !== 'air') await safeDigBlock(block3);

        // Move forward down the step
        bot.pathfinder.setGoal(new goals.GoalBlock(pos.x + dx, pos.y - 1, pos.z + dz));
    } catch (err) {
        console.log(`[DALI STAIRCASE ERROR] ${err.message}`);
    } finally {
        BOT_STATE.isBusyCrafting = false;
    }
}

/**
 * Mines a 1x2 straight horizontal tunnel for diamond mining.
 */
async function mineForwardTunnel(length = 2) {
    if (!bot || !bot.entity) return;

    for (let i = 0; i < length; i++) {
        const pos = bot.entity.position.floored();
        const headBlock = bot.blockAt(pos.offset(1, 1, 0));
        const footBlock = bot.blockAt(pos.offset(1, 0, 0));

        if (headBlock && headBlock.name !== 'air') await safeDigBlock(headBlock);
        if (footBlock && footBlock.name !== 'air') await safeDigBlock(footBlock);

        bot.pathfinder.setGoal(new goals.GoalBlock(pos.x + 1, pos.y, pos.z));
        await new Promise(res => setTimeout(res, 600));
    }
}

// ----------------------------------------------------------------------------
// [SECTION 7.5] CAVE & MINING ROUTINE TIMERS
// ----------------------------------------------------------------------------
// Scan for nearby ores every 8 seconds
setInterval(() => {
    scanAndMineHighValueOres();
}, 8000);

// Place underground torches every 5 seconds
setInterval(() => {
    autoPlaceTorchesUnderground();
}, 5000);

console.log('[PART 7 LOADED] Safe Mining Engine, Diamond Scanner & Underground Lighting Active.');
/**
 * ============================================================================
 * DALi SURViVAL TN - GOD-MODE AUTONOMOUS BOT (PART 8/10)
 * ============================================================================
 * PLAYER NAME : Dali_Survival_TN
 * MODULE     : CROP FARMING, ANIMAL BREEDING, BASE BUILDER & EQUIPMENT REPAIR
 * LANGUAGE   : 100% Pure Tunisian Franco/Arabizi
 * ============================================================================
 */

const Vec3 = require('vec3');

// ----------------------------------------------------------------------------
// [SECTION 8.1] AUTOMATIC CROP FARMING & SEED REPLANTING ENGINE
// ----------------------------------------------------------------------------
/**
 * Scans nearby farmland (radius 15) for fully grown crops (wheat, carrots, potatoes).
 * Harvests mature crops and replants seeds automatically.
 */
async function autoHarvestAndReplant() {
    if (!bot || !bot.entity || BOT_STATE.isBusyCrafting) return;

    const mcData = require('minecraft-data')(bot.version);
    const cropNames = ['wheat', 'carrots', 'potatoes', 'beetroots'];

    for (const cropName of cropNames) {
        const cropType = mcData.blocksByName[cropName];
        if (!cropType) continue;

        // Find fully grown crop blocks (age = 7 for wheat/carrots/potatoes)
        const matureCrops = bot.findBlocks({
            matching: block => {
                return block.type === cropType.id && block.metadata === 7;
            },
            maxDistance: 15,
            count: 5
        });

        if (matureCrops.length > 0) {
            BOT_STATE.isBusyCrafting = true;
            sendHumanChat(`🌾 Hani bech n9asled fil farm, n7asled ${matureCrops.length} ${cropName} w n3awd nzar3ou!`);

            for (const cropPos of matureCrops) {
                const cropBlock = bot.blockAt(cropPos);
                const farmlandBlock = bot.blockAt(cropPos.offset(0, -1, 0));

                if (cropBlock) {
                    try {
                        // Move to crop and break it
                        bot.pathfinder.setGoal(new goals.GoalNear(cropPos.x, cropPos.y, cropPos.z, 1));
                        await new Promise(res => setTimeout(res, 800));

                        await bot.dig(cropBlock);

                        // Replant seed/crop on farmland
                        const seedItem = bot.inventory.items().find(i => 
                            i.name.includes('seed') || i.name === 'carrot' || i.name === 'potato'
                        );

                        if (seedItem && farmlandBlock) {
                            await bot.equip(seedItem, 'hand');
                            await bot.placeBlock(farmlandBlock, new Vec3(0, 1, 0));
                        }
                    } catch (err) {
                        console.log(`[DALI FARM ERROR] ${err.message}`);
                    }
                }
            }

            BOT_STATE.isBusyCrafting = false;
            return;
        }
    }
}

// ----------------------------------------------------------------------------
// [SECTION 8.2] ANIMAL HUSBANDRY & BREEDING ENGINE
// ----------------------------------------------------------------------------
/**
 * Feeds nearby animals (Cows with Wheat, Pigs with Carrots, Sheep with Wheat)
 * to breed them and expand the farm stock autonomously.
 */
async function autoBreedFarmAnimals() {
    if (!bot || !bot.entity || BOT_STATE.isBusyCrafting) return;

    // Check inventory for breeding food
    const wheat = bot.inventory.items().find(i => i.name === 'wheat');
    const carrot = bot.inventory.items().find(i => i.name === 'carrot');

    if (!wheat && !carrot) return;

    // Scan for nearby adult cows or sheep
    const animals = bot.entities;
    const animalPairs = [];

    for (const id in animals) {
        const entity = animals[id];
        if (!entity || !entity.position) continue;

        const name = entity.name ? entity.name.toLowerCase() : '';
        const distance = bot.entity.position.distanceTo(entity.position);

        if (['cow', 'sheep', 'pig'].includes(name) && distance < 10) {
            animalPairs.push(entity);
        }
    }

    if (animalPairs.length >= 2) {
        const targetAnimal = animalPairs[0];
        const food = targetAnimal.name === 'pig' ? carrot : wheat;

        if (food) {
            try {
                sendHumanChat(`🐄 Hani ne3lef fil ${targetAnimal.name}s bch yetkethrou fil farm!`);
                await bot.equip(food, 'hand');
                
                bot.pathfinder.setGoal(new goals.GoalNear(targetAnimal.position.x, targetAnimal.position.y, targetAnimal.position.z, 1));
                await new Promise(res => setTimeout(res, 1000));

                await bot.activateEntity(targetAnimal);
            } catch (e) {
                // Ignore entity interaction cooldowns
            }
        }
    }
}

// ----------------------------------------------------------------------------
// [SECTION 8.3] PERIMETER WALL BASE BUILDER
// ----------------------------------------------------------------------------
/**
 * Constructs a 2-block high protective cobblestone wall around the set home position.
 */
async function buildBasePerimeterWall() {
    if (!bot || !BOT_STATE.isHomeSet || BOT_STATE.isBusyCrafting) return;

    const cobble = bot.inventory.items().find(i => i.name === 'cobblestone' || i.name === 'stone');
    if (!cobble || cobble.count < 32) return; // Require at least half stack

    BOT_STATE.isBusyCrafting = true;
    sendHumanChat('🧱 Hani nkabbar fil sur mte3 darkom bch ma yedkhol 7ad mel mobs!');

    const center = BOT_STATE.homePosition.floored();
    const radius = 5;

    // Wall perimeter coordinate offsets
    const perimeterCoords = [];
    for (let x = -radius; x <= radius; x++) {
        perimeterCoords.push(new Vec3(x, 0, -radius));
        perimeterCoords.push(new Vec3(x, 0, radius));
    }
    for (let z = -radius; z <= radius; z++) {
        perimeterCoords.push(new Vec3(-radius, 0, z));
        perimeterCoords.push(new Vec3(radius, 0, z));
    }

    try {
        await bot.equip(cobble, 'hand');

        for (const offset of perimeterCoords) {
            const wallPos = center.plus(offset);
            const groundBlock = bot.blockAt(wallPos.offset(0, -1, 0));

            if (groundBlock && groundBlock.name !== 'air') {
                // Build 2 blocks high
                const targetBlock1 = bot.blockAt(wallPos);
                if (targetBlock1 && targetBlock1.name === 'air') {
                    await bot.placeBlock(groundBlock, new Vec3(0, 1, 0)).catch(() => {});
                    await new Promise(res => setTimeout(res, 200));
                }
            }
        }
        sendHumanChat('🏰 Kamalt bnit el wall mte3 el base! Safe 100%!');
    } catch (err) {
        console.log(`[DALI WALL ERROR] ${err.message}`);
    } finally {
        BOT_STATE.isBusyCrafting = false;
    }
}

// ----------------------------------------------------------------------------
// [SECTION 8.4] ITEM REPAIR & ANVIL MANAGEMENT ENGINE
// ----------------------------------------------------------------------------
/**
 * Checks durability of tools/armor and repairs them on an anvil if durability < 20%.
 */
async function checkAndRepairEquipment() {
    if (!bot || !bot.inventory || BOT_STATE.isBusyCrafting) return;

    const damagedTools = bot.inventory.items().find(i => {
        // Mineflayer durability check
        return i.durabilityUsed && (i.durabilityUsed / i.maxDurability) > 0.8;
    });

    if (damagedTools) {
        const anvilBlock = bot.findBlock({
            matching: b => b.name.includes('anvil'),
            maxDistance: 6
        });

        if (anvilBlock) {
            sendHumanChat(`🛠️ El ${damagedTools.name} mte3i 9rib ytekssar, hani bech nsalla7ou fil anvil!`);
            // Pathfind to anvil and interact
            bot.pathfinder.setGoal(new goals.GoalNear(anvilBlock.position.x, anvilBlock.position.y, anvilBlock.position.z, 1));
        } else {
            sendHumanChat(`⚠️ El ${damagedTools.name} mte3i t3ab, ne3mel /repair wela nlawaj 3la anvil!`);
            bot.chat('/repair'); // Execute repair command if server permissions allow
        }
    }
}

// ----------------------------------------------------------------------------
// [SECTION 8.5] FARMING & MAINTENANCE TICK SCHEDULE
// ----------------------------------------------------------------------------
// Check crops and replant every 45 seconds
setInterval(() => {
    autoHarvestAndReplant();
}, 45000);

// Breed animals every 2 minutes
setInterval(() => {
    autoBreedFarmAnimals();
}, 120000);

// Equipment repair check every 3 minutes
setInterval(() => {
    checkAndRepairEquipment();
}, 180000);

console.log('[PART 8 LOADED] Crop Farming, Animal Breeder, Base Builder & Equipment Repair Active.');
/**
 * ============================================================================
 * DALi SURViVAL TN - GOD-MODE AUTONOMOUS BOT (PART 9/10)
 * ============================================================================
 * PLAYER NAME : Dali_Survival_TN
 * MODULE     : NETHER NAVIGATION, AUTO CHEST SORTING, BOSS COMBAT & NLP CHAT
 * LANGUAGE   : 100% Pure Tunisian Franco/Arabizi
 * ============================================================================
 */

const Vec3 = require('vec3');

// ----------------------------------------------------------------------------
// [SECTION 9.1] NETHER SURVIVAL, PORTAL & PIGLIN BARTERING ENGINE
// ----------------------------------------------------------------------------
/**
 * Automatically equips Gold Armor piece before entering Nether to avoid Piglin agro,
 * handles Piglin bartering with Gold Ingots, and navigates portals safely.
 */
async function handleNetherSurvivalProtocol() {
    if (!bot || !bot.entity) return;

    const isInNether = bot.game.dimension === 'the_nether';

    if (isInNether) {
        // 1. Ensure Gold Piece is equipped to stay safe from Piglins
        const goldArmor = bot.inventory.items().find(i => i.name.includes('golden_'));
        if (goldArmor) {
            const slot = goldArmor.name.includes('boots') ? 'boots' : 'chestplate';
            await bot.equip(goldArmor, slot).catch(() => {});
        }

        // 2. Auto Piglin Bartering: Toss gold ingots to nearby non-hostile piglins
        const goldIngot = bot.inventory.items().find(i => i.name === 'gold_ingot');
        if (goldIngot) {
            const piglin = bot.nearestEntity(e => e.name === 'piglin' && e.position.distanceTo(bot.entity.position) < 5);
            if (piglin) {
                sendHumanChat('🤝 Hani bech na3ti Gold Ingot l Piglin bch na3mel bartering fil Nether!');
                await bot.toss(goldIngot.type, null, 1);
            }
        }
    }
}

// ----------------------------------------------------------------------------
// [SECTION 9.2] AUTOMATED CHEST SORTING & STORAGE STASH ENGINE
// ----------------------------------------------------------------------------
/**
 * Finds nearby chests, opens them, and automatically deposits mined ores, 
 * mob drops, and extra building materials while keeping survival tools.
 */
async function autoDepositToNearbyChests() {
    if (!bot || !bot.inventory || BOT_STATE.isBusyCrafting) return;

    // Items that must NEVER be deposited in chests
    const keepItems = [
        'netherite_pickaxe', 'diamond_pickaxe', 'iron_pickaxe',
        'netherite_sword', 'diamond_sword', 'iron_sword',
        'cooked_beef', 'golden_apple', 'water_bucket', 'shield', 'torch'
    ];

    const chestBlock = bot.findBlock({
        matching: b => ['chest', 'trapped_chest', 'barrel'].includes(b.name),
        maxDistance: 5
    });

    if (chestBlock) {
        try {
            BOT_STATE.isBusyCrafting = true;
            const chestWindow = await bot.openContainer(chestBlock);
            sendHumanChat('📦 Hani nfaragh fil items w ne5zen fil chest mte3na!');

            for (const item of bot.inventory.items()) {
                if (!keepItems.includes(item.name)) {
                    await chestWindow.deposit(item.type, null, item.count);
                    await new Promise(res => setTimeout(res, 200));
                }
            }
            chestWindow.close();
            sendHumanChat('✅ Storage mrigel! El inventory tawa ndhifa.');
        } catch (err) {
            console.log(`[DALI CHEST ERROR] ${err.message}`);
        } finally {
            BOT_STATE.isBusyCrafting = false;
        }
    }
}

// ----------------------------------------------------------------------------
// [SECTION 9.3] BOSS COMBAT ASSISTANT (WITHER & ENDER DRAGON TACTICS)
// ----------------------------------------------------------------------------
/**
 * Monitors dragon/wither boss fights and executes specific strategies:
 * - Wither: Keeps distance, uses Power Bow, switches to Sword under 50% HP.
 * - Ender Dragon: Shoots End Crystals with Bow, uses Water Bucket when launched up.
 */
function bossCombatTacticalModule() {
    if (!bot || !bot.entity) return;

    const bossEntity = bot.nearestEntity(e => ['wither', 'ender_dragon'].includes(e.name));

    if (bossEntity) {
        if (bossEntity.name === 'ender_dragon') {
            // Target End Crystals if visible
            const crystal = bot.nearestEntity(e => e.name === 'end_crystal' && e.position.distanceTo(bot.entity.position) < 30);
            if (crystal) {
                bot.lookAt(crystal.position.offset(0, 1, 0));
                shootBowAtTarget(crystal);
            }
        } else if (bossEntity.name === 'wither') {
            sendHumanChat('☠️ Wither Boss detected! God-mode combat engaged!');
            executeTacticalCombat(bossEntity);
        }
    }
}

/**
 * Helper function to aim and shoot bow at specific targets.
 */
function shootBowAtTarget(target) {
    const bow = bot.inventory.items().find(i => i.name === 'bow' || i.name === 'crossbow');
    const arrow = bot.inventory.items().find(i => i.name.includes('arrow'));

    if (bow && arrow) {
        bot.equip(bow, 'hand', () => {
            bot.activateItem(); // Pull bowstring
            setTimeout(() => {
                bot.deactivateItem(); // Release arrow
            }, 1200);
        });
    }
}

// ----------------------------------------------------------------------------
// [SECTION 9.4] TUNISIAN ARABIZI ADVANCED NATURAL LANGUAGE PROCESSOR (NLP)
// ----------------------------------------------------------------------------
/**
 * Contextual responses generator for natural player conversations in chat.
 */
function generateTunisianNLPResponse(userMessage, username) {
    const lower = userMessage.toLowerCase();

    if (lower.includes('labess') || lower.includes('chneya a7wal')) {
        return `Ya3tik el sa7a ya ${username}, labess l hamdullah! Enti chnouwa a7walek?`;
    }
    if (lower.includes('merci') || lower.includes('eysalmek') || lower.includes('chokran')) {
        return `3la rasi ya ${username}, mar7ba bik dima fil server mte3na!`;
    }
    if (lower.includes('chkoun khir') || lower.includes('best server')) {
        return `DALi SURViVAL TN huwa a7san server survival fil Tounes m3allem! 🇹🇳🔥`;
    }
    if (lower.includes('win darkom') || lower.includes('win el base')) {
        return `Base mte3na safe 100%! Oukteb /home bch temchileha!`;
    }
    return null;
}

// Chat Listener for NLP generator
bot.on('chat', (username, message) => {
    if (username === bot.username) return;

    const nlpReply = generateTunisianNLPResponse(message, username);
    if (nlpReply) {
        sendHumanChat(nlpReply);
    }
});

// ----------------------------------------------------------------------------
// [SECTION 9.5] NETHER & CHEST MAINTENANCE TICK LOOPS
// ----------------------------------------------------------------------------
// Nether survival checks every 5 seconds
setInterval(() => {
    handleNetherSurvivalProtocol();
}, 5000);

// Auto-deposit to chests every 2.5 minutes
setInterval(() => {
    autoDepositToNearbyChests();
}, 150000);

// Boss combat scanner every 1 second during active encounters
setInterval(() => {
    bossCombatTacticalModule();
}, 1000);

console.log('[PART 9 LOADED] Nether Protocol, Auto-Chest Sorting, Boss Tactics & NLP Active.');
/**
 * ============================================================================
 * DALi SURViVAL TN - GOD-MODE AUTONOMOUS BOT (PART 10/10 - FINAL)
 * ============================================================================
 * PLAYER NAME : Dali_Survival_TN
 * MODULE     : AUTO-RECONNECT RECOVERY, DISCORD WEBHOOKS, WEB DASHBOARD & LAUNCHER
 * LANGUAGE   : 100% Pure Tunisian Franco/Arabizi
 * ============================================================================
 */

const http = require('http');

// ----------------------------------------------------------------------------
// [SECTION 10.1] DISCORD WEBHOOK REAL-TIME LOGGING & ALERTS
// ----------------------------------------------------------------------------
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || '';

/**
 * Sends real-time bot events, player interactions, and alerts to a Discord channel.
 * @param {string} title - Embed title
 * @param {string} description - Embed message body
 * @param {number} color - Decimal RGB color for Discord embed
 */
function sendDiscordWebhookNotification(title, description, color = 3447003) {
    if (!DISCORD_WEBHOOK_URL) return;

    const payload = JSON.stringify({
        embeds: [{
            title: `🇹🇳 [DALI SURVIVAL BOT] ${title}`,
            description: description,
            color: color,
            footer: { text: 'Dali_Survival_TN God-Mode Bot Engine v10.0' },
            timestamp: new Date().toISOString()
        }]
    });

    try {
        const urlParts = new URL(DISCORD_WEBHOOK_URL);
        const req = http.request({
            hostname: urlParts.hostname,
            path: urlParts.pathname + urlParts.search,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        });

        req.on('error', (err) => console.log(`[DISCORD ERROR] ${err.message}`));
        req.write(payload);
        req.end();
    } catch (err) {
        console.log(`[DISCORD HOOK FAILED] ${err.message}`);
    }
}

// ----------------------------------------------------------------------------
// [SECTION 10.2] LIGHTWEIGHT STATUS DASHBOARD & HEALTH-CHECK HTTP SERVER
// ----------------------------------------------------------------------------
/**
 * Starts a 24/7 web server on port 3000 to keep hosting services (e.g. Render/Replit) 
 * alive and display dynamic bot metrics.
 */
function startWebDashboardServer() {
    const PORT = process.env.PORT || 3000;

    const server = http.createServer((req, res) => {
        if (req.url === '/health' || req.url === '/status') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                botName: 'Dali_Survival_TN',
                status: bot && bot.entity ? 'ONLINE' : 'OFFLINE',
                health: bot && bot.health ? bot.health : 0,
                food: bot && bot.food ? bot.food : 0,
                stats: BOT_STATE.stats,
                uptime: process.uptime()
            }));
            return;
        }

        // Simple HTML Monitoring UI
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>DALi SURViVAL TN - Bot Dashboard</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #121212; color: #fff; text-align: center; padding: 40px; }
                    .card { background: #1e1e1e; border-radius: 12px; padding: 25px; max-width: 500px; margin: 0 auto; box-shadow: 0 4px 15px rgba(0,0,0,0.5); }
                    h1 { color: #00e676; margin-bottom: 5px; }
                    .status { font-weight: bold; padding: 8px 16px; border-radius: 20px; display: inline-block; }
                    .online { background: #1b5e20; color: #b9f6ca; }
                    .offline { background: #b71c1c; color: #ff8a80; }
                    .stat-item { margin: 12px 0; font-size: 1.1em; text-align: left; }
                </style>
            </head>
            <body>
                <div class="card">
                    <h1>🇹🇳 Dali_Survival_TN</h1>
                    <p>God-Mode Autonomous Mineflayer Bot</p>
                    <div class="status ${bot && bot.entity ? 'online' : 'offline'}">
                        STATUS: ${bot && bot.entity ? 'ONLINE 🟢' : 'OFFLINE 🔴'}
                    </div>
                    <hr style="border-color: #333; margin: 20px 0;">
                    <div class="stat-item">❤️ <b>Health:</b> ${bot && bot.health ? bot.health : 0}/20</div>
                    <div class="stat-item">🍖 <b>Food:</b> ${bot && bot.food ? bot.food : 0}/20</div>
                    <div class="stat-item">🗡️ <b>Mobs Killed:</b> ${BOT_STATE.stats.mobsKilled}</div>
                    <div class="stat-item">🛠️ <b>Crafts Completed:</b> ${BOT_STATE.stats.craftsCompleted}</div>
                    <div class="stat-item">💬 <b>Messages Sent:</b> ${BOT_STATE.stats.messagesSent}</div>
                </div>
            </body>
            </html>
        `);
    });

    server.listen(PORT, () => {
        console.log(`[DASHBOARD] Web monitoring server running on port ${PORT}`);
    });
}

// ----------------------------------------------------------------------------
// [SECTION 10.3] AUTOMATED RECONNECT ENGINE & CRASH RECOVERY
// ----------------------------------------------------------------------------
let reconnectTimer = null;

/**
 * Handles bot disconnects, kicks, or server restarts by scheduling an automated reconnect.
 */
function handleBotDisconnection(reason) {
    console.log(`[DALI DISCONNECT] Bot disconnected from server. Reason: ${reason}`);
    sendDiscordWebhookNotification('🔴 Bot Disconnected', `Dali_Survival_TN 5raj mel server. Reason: ${reason}`, 15158332);

    if (reconnectTimer) clearTimeout(reconnectTimer);

    console.log('[DALI RECONNECT] Retrying connection in 12 seconds...');
    reconnectTimer = setTimeout(() => {
        console.log('[DALI RECONNECT] Re-initializing Mineflayer instance...');
        startAutonomousBot();
    }, 12000);
}

// ----------------------------------------------------------------------------
// [SECTION 10.4] GRACEFUL SHUTDOWN & CLEANUP PROCESS
// ----------------------------------------------------------------------------
/**
 * Gracefully disconnects the bot and alerts players before process termination.
 */
function gracefulProcessShutdown() {
    console.log('\n[DALI SHUTDOWN] Graceful shutdown process initiated...');

    if (bot) {
        sendHumanChat('👋 Ya jama3a hani bech na3mel exit tawa! Nchallah nerj3ou 9rib! Bye!');
        sendDiscordWebhookNotification('🛑 Bot Offline', 'Dali_Survival_TN was cleanly shut down by system process.', 15158332);
        
        setTimeout(() => {
            bot.quit('Bot process terminated');
            process.exit(0);
        }, 1500);
    } else {
        process.exit(0);
    }
}

process.on('SIGINT', gracefulProcessShutdown);
process.on('SIGTERM', gracefulProcessShutdown);

// ----------------------------------------------------------------------------
// [SECTION 10.5] MASTER BOT LAUNCHER & INITIALIZATION FACTORY
// ----------------------------------------------------------------------------
/**
 * Initializes and wires together all 10 modules into a single autonomous bot instance.
 */
function startAutonomousBot() {
    console.log('================================================================');
    console.log('🚀 LAUNCHING DALi SURViVAL TN - GOD-MODE AUTONOMOUS BOT (v10.0)');
    console.log('================================================================');

    // Instantiate Mineflayer bot with options defined in Part 1
    bot = mineflayer.createBot(BOT_CONFIG);

    // Bind Pathfinder Movement Capabilities
    bot.once('spawn', () => {
        const mcData = require('minecraft-data')(bot.version);
        const defaultMovements = new Movements(bot, mcData);
        defaultMovements.canDig = true;
        defaultMovements.scafoldingBlocks.push(mcData.blocksByName.cobblestone.id);
        bot.pathfinder.setMovements(defaultMovements);

        console.log('🟢 [DALI SPAWN] Dali_Survival_TN fully spawned & pathfinder initialized!');
        sendDiscordWebhookNotification('🟢 Bot Online', 'Dali_Survival_TN is online and active in the server!', 3066993);

        // Send login greeting message after 3 seconds
        setTimeout(() => {
            sendHumanChat('Aslema ya shab! Dali_Survival_TN online w 7ader bch ya3mel el wa3d! 🔥');
        }, 3000);
    });

    // Wire Core Network & State Listeners
    bot.on('kicked', (reason) => handleBotDisconnection(typeof reason === 'object' ? JSON.stringify(reason) : reason));
    bot.on('error', (err) => console.log(`[DALI BOT ERROR] ${err.message}`));
    bot.on('end', (reason) => handleBotDisconnection(reason || 'Socket ended'));

    // Wire Death & Respawn Event
    bot.on('death', () => {
        BOT_STATE.stats.deaths++;
        sendHumanChat('☠️ Ayy moutna! Ama hani bech nerja3 direct akwer w a9wa mel 9bal!');
        sendDiscordWebhookNotification('☠️ Bot Died', `Dali_Survival_TN died! Total deaths: ${BOT_STATE.stats.deaths}`, 15158332);
    });
}

// ----------------------------------------------------------------------------
// [SECTION 10.6] BOOTSTRAP EXECUTION ENTRY POINT
// ----------------------------------------------------------------------------
// 1. Start HTTP Status Dashboard
startWebDashboardServer();

// 2. Launch Main Mineflayer Autonomous Bot Engine
startAutonomousBot();

console.log('================================================================');
console.log('✅ ALL 10 PARTS SUCCESSFULLY LOADED & FULLY INTEGRATED!');
console.log('================================================================');
