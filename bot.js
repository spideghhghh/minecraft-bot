/**
 * ============================================================================
 * TOUNSI AI OMNISCIENT ULTRA-ADVANCED SMP COMPANION, PARKOUR & PLUGIN GUIDE (v21.0 FRANCO)
 * ============================================================================
 * System ad5am w akthar thaka' lasdar Minecraft SMP.
 * Kol chay belfranco (Latin script) bech ma yetharafch wela yokhroj maqloub fel Minecraft chat!
 * ============================================================================
 */

const http = require('http');
const mineflayer = require('mineflayer');

const webKeepAliveServer = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end('Tounsi AI Omniscient Ultra Core is 100% Active, Stable and Running 24/7.\n');
});
const SERVER_PORT = process.env.PORT || 3000;
webKeepAliveServer.listen(SERVER_PORT, () => {
  console.log(`[Web Server Core] El server mrigel w y5dem 3al port ${SERVER_PORT} bkol kouwa.`);
});

const bot = mineflayer.createBot({
  host: 'node-de-free-01.tickhosting.com',
  port: 50589,
  username: 'TounsiOmniscient',
  version: false
});

const OMNISCIENT_SERVER_PLUGINS = {
  jobs: {
    keywords: ['jobs', 'wazaif', '5edma', '5edman', 'flous', 'niveau', 'kifech n5dem'],
    desc: 'Plugin el wazaif (Jobs). Yatik el horreya bch t5tar mehna (Miner, Digger, Woodcutter, Hunter, Farmer) w tlam el flous w el XP felkol.',
    commands: ['/jobs browse', '/jobs join <name>', '/jobs stats', '/jobs leave <name>', '/jobs info <name>']
  },
  betterRtp: {
    keywords: ['rtp', 'random', 'teleport', 'inmiqal', '3achwa2i', 'blasa b3ida', 'tabyid', 'win nbni'],
    desc: 'El intiqal el 3achwa2i (BetterRTP). Ysabbik fi ihdithiyat b3ida fel 3alem bch tabni dark be amen w b3id 3el saraqa.',
    commands: ['/rtp']
  },
  excellentCrates: {
    keywords: ['crates', 'sandouq', 'sndouq', 'mifte7', 'keys', 'zhoor', 'jawez', 'krayts'],
    desc: 'El sandouq el kobra (ExcellentCrates). Mawjoudin fel lobby, tstakhdem el mafatih bch taftahhom w ta5ou jawez w silahet nadra.',
    commands: ['Tawajoh l mintaqat el sandouq fel lobby w a3mel clic droit belfeyel']
  },
  axAfkZone: {
    keywords: ['afk', 'khmoul', 'axafkzone', 'shards', 'coins', 'telfil afk', 'raqed', 'n5ali el bot'],
    desc: 'Mintaqat el AFK el m5asasa (AxAFKZone). Ta3tik coins w shards w enti waqef w ma tat7arakch fel ghorfa.',
    commands: ['Tawajoh l ghorfat el AFK fel lobby w eb9a gadi']
  },
  auctionHouse: {
    keywords: ['auction', 'market', 'souq', 'bi3', 'chira', 'ah', 'flous', 'el matar', 'chkoun yechri'],
    desc: 'El souq el markazi (AuctionHouse). Ysamahlek bch tabi3 w teshri el aghrad w el silahet binethkom.',
    commands: ['/ah', '/ah sell <price>', '/ah collect']
  },
  axVaults: {
    keywords: ['vaults', 'shulkers', 'khazin', 'vault', 'pv', 'haqiba', 'misa7a'],
    desc: 'El vaultat w sandouq el ta5zin el sahabi (AxVaults / AxShulkers). Misa7a ta5zin sakhsiyya amina w ma tdi3ch.',
    commands: ['/vault', '/pv <number>']
  },
  protectionStones: {
    keywords: ['claim', 'protection', 'hmiya', 'dari', 'sarqa', 'protectionstones', 'hajar 7miya'],
    desc: 'Hmiyat el aradi (ProtectionStones). Tothec hajar 5as bch thmi mintaqatak w dark men el takrib w el sorka.',
    commands: ['Hot hajar el hmiya fel markaz mte3 el ardh elli t7eb thmiha']
  },
  teleportationSystem: {
    keywords: ['tpa', 'tp', 'warp', 'home', 'sethome', 'tpaccept', 'el dar', 'mawqe3'],
    desc: 'Awamir el tanaqol el asasiyya. Tsajel dark w tnaqel liha waqt ma t7eb wela totlob tpa m3a s7abek.',
    commands: ['/sethome <name>', '/home <name>', '/tpa <player>', '/tpaccept', '/warp']
  },
  cyberLevels: {
    keywords: ['skills', 'levels', 'cyberlevels', 'mostawayat', 'telfil', 'tawwarni', 'level'],
    desc: 'Nitham el mostawayat w el maharat el motaqaddem (CyberLevels). Yardfa3 min qowet s5siytek m3a kol injaz.',
    commands: ['/levels', '/skills']
  },
  shopGuiPlus: {
    keywords: ['shop', 'store', 'shop', 'matjar', 'chira adawat', 'bi3 lel matjar'],
    desc: 'Matjar el server er-rasmi (ShopGUIPlus). Bech teshri w tabi3 el mawarid el asasiyya moqabil el omolat.',
    commands: ['/shop']
  },
  reanBounties: {
    keywords: ['bounty', 'bounties', 'ja2izat qatl', 'mokaf2a', 'ras', 'matloub'],
    desc: 'Nitham el mokaf2at (ReanBounties). Tothec mokaf2a lli yaqtol la3eb mo3ayyan wela tabhath 3el matloubin.',
    commands: ['/bounty', '/bounty set <player> <amount>']
  },
  betterTeams: {
    keywords: ['team', 'cland', 'clan', 'betterteams', 'fariq', 'clan', 'group', 'sahab'],
    desc: 'Nitham el foraqa w el klanat (BetterTeams). Bech ta3mel fariq m3a s7abek w tcharmek el hmiya.',
    commands: ['/team create <name>', '/team invite <player>', '/team accept']
  },
  tempFly: {
    keywords: ['fly', 'tempfly', 'tayaran', 'tyer', 'ntayer'],
    desc: 'Nitham el tayaran el moaqqat (TempFly). Ysamahlek bel tayaran f fatra mahdouda fel 3awam el masmouha.',
    commands: ['/tempfly', '/fly time']
  },
  worldGuard: {
    keywords: ['worldguard', 'region', 'mintaqa mahmiya', 'spawn'],
    desc: 'Hmiyat el 3awam w el manatiq el 3amma (WorldGuard). Yamna3 taksir el block fel lobby w el manatiq er-rasmiyya.',
    commands: ['El manatiq el 3amma mahmiya bil tqil']
  },
  multiverse: {
    keywords: ['multiverse', 'world', '3alem', '3awam', 'nether', 'the_end'],
    desc: 'Idarat el 3awam el mota3addida (Multiverse-Core). Yrobat 3awam el server ba3dhom (El 3alem el 3adi, Nether, End).',
    commands: ['/mv list']
  }
};

const TUNISIAN_PERFECT_LEXICON = {
  greetings: [
    'w3slm ya m3allem, chnya a7welek lyoum fel surv?',
    'ahla w sahla bel ghalin, nchalla omourek mrigla',
    'wesh ya bro, marhba bik m3ana fel server lyoum',
    'aslema ya m3allem, rani houni n3es w n3awen fel louled',
    'ahla bik, chnewa el jaw m3ak fel la3b lyoum?'
  ],
  howAreYou: [
    'cv hmdlh, wekel chereb re9ed fel lobby w n9ari fil louled 😂',
    'labes hmdlh, w enty chnya a7welek m3a el surv w el buildat?',
    'cv l7a9, dima lenna ndouro fel server w nsa9siw 3la el 3bad',
    'kolchi mrigel w hmdlh, nchalla enty zeda jawak behi'
  ],
  laughs: [
    'hhhhhhh ti wa7dek ya m3allem jawak 3al 3alam',
    'mdr qtaltni bel da7k, wallah 0 ghalet 😂',
    'jaw kbir houni fel server hhhh wa7dek',
    'ya rajel ti faztek tayara barcha'
  ],
  insultsResponse: [
    'chkoun el bhim ya zamil? rani guide mte3 server mouch bot ya 5ouya!',
    'sayeb 3leya mel klem el zayed, rani player kifek w n3awen fi nes',
    'taw nwariw el bot chkoun, arja3 lteli w rkez m3aya fel la3b',
    'barra al3eb b3id ya weldi 3aychek, rak ta3mel fi fazat fargheya'
  ],
  praiseResponse: [
    'walah enty el m3allem ya bro, rabi yfadhlek w y3awnk',
    'gg lina lkol, server ta7foun w el 3bad lkol fih ndhifa',
    'berjoulia el a5laq w el jaw houni 10/10 maak w m3a el ba9iya',
    'rabi yfadhlek ya m3allem, dima fel 10 3la 10'
  ],
  proactiveStarters: [
    'wesh ya louled, famach chkoun yghez m3aya lel boss lyoum wela na3mlou farm?',
    'brjoulia famach blasa heyla fel map na3rafha bch na3mel build gadi?',
    'chkoun 3andou haja ybiha wela yosrof fel auction lyoum?',
    'ti winkom ya jme3a, el server re9ed wela kol wahed mashoul fel base mte3ou?'
  ]
};

let activeAiState = 'IDLE'; 
let stateTickCounter = 0; 
let stateDurationTicks = 120; 
let targetPlayerEntity = null;
let globalChatCooldown = 0;
let lastJumpExecutionTick = 0;
let previousPositionX = 0;
let previousPositionZ = 0;
let consecutiveStuckCounter = 0;
const shortTermMemoryStream = [];

bot.on('spawn', () => {
  console.log('[Tounsi Omniscient AI] Bot trasban benjah w ka annou ostoura hayya w admin mohthraf fel server!');
  bot.setControlState('jump', true);
  setTimeout(() => bot.setControlState('jump', false), 400);
});

bot.on('physicsTick', () => {
  if (!bot.entity) return;

  stateTickCounter++;
  if (globalChatCooldown > 0) globalChatCooldown--;

  const isBotMoving = bot.getControlState('forward') || bot.getControlState('sprint') || bot.getControlState('jump');
  
  if (isBotMoving) {
    const activePos = bot.entity.position;
    const movedDistance = Math.hypot(activePos.x - previousPositionX, activePos.z - previousPositionZ);
    
    if (movedDistance < 0.03) {
      consecutiveStuckCounter++;
      if (consecutiveStuckCounter > 6 && (stateTickCounter - lastJumpExecutionTick > 5)) {
        bot.setControlState('jump', true);
        bot.setControlState('sprint', true);
        lastJumpExecutionTick = stateTickCounter;
        bot.look(bot.entity.yaw + (Math.random() > 0.5 ? 1.8 : -1.8), (Math.random() - 0.5) * 0.3, true);
        consecutiveStuckCounter = 0;
      }
    } else {
      consecutiveStuckCounter = 0;
      if (bot.entity.isCollidedHorizontally && (stateTickCounter - lastJumpExecutionTick > 8)) {
        bot.setControlState('jump', true);
        lastJumpExecutionTick = stateTickCounter;
      } else if (!bot.entity.isCollidedHorizontally && (stateTickCounter - lastJumpExecutionTick > 8)) {
        bot.setControlState('jump', false);
      }
    }
    previousPositionX = activePos.x;
    previousPositionZ = activePos.z;
  } else {
    bot.setControlState('jump', false);
  }

  switch (activeAiState) {
    case 'IDLE':
      bot.clearControlStates();
      if (stateTickCounter > stateDurationTicks) {
        const decisionRand = Math.random();
        if (decisionRand < 0.3) {
          const nearbyPlayer = bot.nearestEntity(e => e.type === 'player' && e.username !== bot.username);
          if (nearbyPlayer && bot.entity.position.distanceTo(nearbyPlayer.position) < 14) {
            targetPlayerEntity = nearbyPlayer;
            transitionState('PROACTIVE_TALK', 90);
          } else {
            transitionState('WANDER_AROUND', 50);
          }
        } else if (decisionRand < 0.75) {
          const newYaw = bot.entity.yaw + (Math.random() - 0.5) * 3.5;
          bot.look(newYaw, (Math.random() - 0.5) * 0.3, true);
          if (Math.random() < 0.2) bot.setControlState('jump', true);
          transitionState('WANDER_AROUND', Math.floor(Math.random() * 60 + 30));
        } else {
          const nearest = bot.nearestEntity(e => e.type === 'player' && e.username !== bot.username);
          if (nearest && bot.entity.position.distanceTo(nearest.position) < 12) {
            bot.lookAt(nearest.position.offset(0, 1.6, 0), true);
          }
          transitionState('IDLE', Math.floor(Math.random() * 50 + 25));
        }
      }
      break;

    case 'WANDER_AROUND':
      bot.setControlState('forward', true);
      if (Math.random() < 0.05) bot.setControlState('sprint', true);
      if (stateTickCounter > stateDurationTicks) {
        bot.clearControlStates();
        transitionState('IDLE', Math.floor(Math.random() * 70 + 30));
      }
      break;

    case 'PROACTIVE_TALK':
      if (targetPlayerEntity && targetPlayerEntity.position) {
        bot.lookAt(targetPlayerEntity.position.offset(0, 1.6, 0), true);
        if (bot.entity.position.distanceTo(targetPlayerEntity.position) > 4) {
          bot.setControlState('forward', true);
        } else {
          bot.setControlState('forward', false);
          if (stateTickCounter === 25) {
            const starters = TUNISIAN_PERFECT_LEXICON.proactiveStarters;
            sendHumanChat(starters[Math.floor(Math.random() * starters.length)]);
          }
        }
        if (stateTickCounter > stateDurationTicks) {
          bot.clearControlStates();
          targetPlayerEntity = null;
          transitionState('IDLE', 40);
        }
      } else {
        transitionState('IDLE', 20);
      }
      break;

    case 'GUIDING_PLAYER':
    case 'INTERACTING':
      if (targetPlayerEntity && targetPlayerEntity.position) {
        bot.lookAt(targetPlayerEntity.position.offset(0, 1.6, 0), true);
        if (bot.entity.position.distanceTo(targetPlayerEntity.position) > 3) {
          bot.setControlState('forward', true);
        } else {
          bot.setControlState('forward', false);
          if (stateTickCounter % 20 === 0) bot.setControlState('sneak', !bot.getControlState('sneak'));
        }
        if (stateTickCounter > stateDurationTicks) {
          bot.clearControlStates();
          targetPlayerEntity = null;
          transitionState('IDLE', 40);
        }
      } else {
        transitionState('IDLE', 20);
      }
      break;
  }
});

function transitionState(newState, ticksDuration) {
  activeAiState = newState;
  stateTickCounter = 0;
  stateDurationTicks = ticksDuration;
}

function sendHumanChat(txtMessage) {
  if (globalChatCooldown > 0) return;
  globalChatCooldown = 85;
  setTimeout(() => {
    bot.chat(txtMessage);
  }, Math.random() * 400 + 350);
}

bot.on('messagestr', (message) => {
  if (message.includes(bot.username) || message.includes('added to your account') || message.includes('AFK Shards') || globalChatCooldown > 0) return;
  
  const rawText = message.trim();
  const lowerText = rawText.toLowerCase();

  shortTermMemoryStream.push(lowerText);
  if (shortTermMemoryStream.length > 25) shortTermMemoryStream.shift();

  let finalResponse = '';
  let targetAiState = 'INTERACTING';

  let matchedPluginKey = null;
  for (const [pKey, pData] of Object.entries(OMNISCIENT_SERVER_PLUGINS)) {
    for (const aliasKeyword of pData.keywords) {
      if (lowerText.includes(aliasKeyword) || lowerText.includes('/' + pKey)) {
        matchedPluginKey = pKey;
        break;
      }
    }
    if (matchedPluginKey) break;
  }

  if (matchedPluginKey) {
    const pInfo = OMNISCIENT_SERVER_PLUGINS[matchedPluginKey];
    finalResponse = `💡 ${pInfo.desc} El awamir el mota7ira: ${pInfo.commands.join(' | ')}`;
    targetAiState = 'GUIDING_PLAYER';
  } 
  else if (/(slm|slam|salem|slama|aslema|3aslema|wesh|cc|bonjour|bsr|hi|hello|marhba)/i.test(lowerText)) {
    const list = TUNISIAN_PERFECT_LEXICON.greetings;
    finalResponse = list[Math.floor(Math.random() * list.length)];
    targetAiState = 'INTERACTING';
  }
  else if (/(cv|cava|chneya|chnwa|a7welek|labes|chbik|ahwelk|chnewa|ca va)/i.test(lowerText)) {
    const list = TUNISIAN_PERFECT_LEXICON.howAreYou;
    finalResponse = list[Math.floor(Math.random() * list.length)];
    targetAiState = 'INTERACTING';
  }
  else if (/(hhh|haha|mdr|lol|xd|xdd)/i.test(lowerText)) {
    const list = TUNISIAN_PERFECT_LEXICON.laughs;
    finalResponse = list[Math.floor(Math.random() * list.length)];
    bot.setControlState('jump', true);
    setTimeout(() => bot.setControlState('jump', false), 350);
  }
  else if (/(bot|robot|hack|bhim|jabri|mnayek|ta7an|3atba|kalb|mnayk|zeby|zbi|ta7n|khra)/i.test(lowerText)) {
    const list = TUNISIAN_PERFECT_LEXICON.insultsResponse;
    finalResponse = list[Math.floor(Math.random() * list.length)];
    targetAiState = 'INTERACTING';
  }
  else if (/(m3alem|m3lem|s7i7|gg|kfo|kefo|walah|berjoulia|brjoulia|tbarkalah|bravo)/i.test(lowerText)) {
    const list = TUNISIAN_PERFECT_LEXICON.praiseResponse;
    finalResponse = list[Math.floor(Math.random() * list.length)];
  }
  else if (/(help|mosa3da|kifech|chamel|chneya na3mel|win nimchi|chnou fama|plugin)/i.test(lowerText)) {
    finalResponse = '🔍 El server fih barcha plugins qawia: tnajem t5dem bel /jobs, tantqal 3achwa2i bel /rtp, tabi3 fel /ah, wela taftah crates fel lobby. Is2alni 3la ay plugin bel ism taw nfassrahoulk!';
    targetAiState = 'GUIDING_PLAYER';
  }

  if (finalResponse !== '') {
    const nearestPlayerEntity = bot.nearestEntity(e => e.type === 'player' && e.username !== bot.username);
    if (nearestPlayerEntity && bot.entity.position.distanceTo(nearestPlayerEntity.position) < 18) {
      targetPlayerEntity = nearestPlayerEntity;
      transitionState(targetAiState, 140);
    }
    sendHumanChat(finalResponse);
  }
});

bot.on('end', (reasonCode) => {
  console.log(`[System Warning] Ingiat el ittisal (Sabab: ${reasonCode}). Jari i3adet el tachghil el fawri...`);
  setTimeout(() => process.exit(1), 2000);
});

bot.on('error', (errorObj) => {
  if (errorObj.code === 'ETIMEDOUT' || errorObj.code === 'ECONNRESET') return;
  console.log('[System Error Handled]:', errorObj.message);
});
