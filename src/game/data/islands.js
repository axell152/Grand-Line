export const TILE_SIZE = 32;

// Terrain :
// t = terre / sol naturel
// c = chemin
// p = sol intérieur / zone bâtie
// w = mur / obstacle
// b = passage bloqué par un boss (devient p après victoire)
// d = quai
// s = mer
//
// IMPORTANT : terrain est maintenant l'unique grille des cartes.
// Les wildZones servent uniquement aux rencontres et ne modifient jamais l'apparence.

export const ISLANDS = {
  // ============================================================
  // 1 — SHELLS TOWN
  // ============================================================
  "ile-depart": {
    name: "Shells Town",
    terrain: [
      "ssssssssssssssssssssssssssssssssssssssssssssssss",
      "ssssssssssssssssssssssssssssssssssssssssssssssss",
      "sswwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwss",
      "sswtttttttttttttttwppppppppwtttttttttttttttttwss",
      "sswtttttttttttttttwppppppppwtttttttttttttttttwss",
      "sswtttttttttttttttwppppppppwtttttttttttttttttwss",
      "sswtttttttttttttttwppppppppwtttttttttttttttttwss",
      "sswtttttttttttttttwwwwbwwwwwtttttttttttttttttwss",
      "sswttttttttttttttttttttttttttttttttttttttttttwss",
      "sswttttttttttttttttttttttttttttttttttttttttttwss",
      "sswttttttttttttttttttttttttttttttttttttttttttwss",
      "sswwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwtwwwwwss",
      "sswttttttttttttttttttttttttttttttttttttttttttwss",
      "sswttttttttttttttttttttttttttttttttttttttttttwss",
      "sswttttttttttttttttttttttttttttttttttttttttttwss",
      "sswwwwwtwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwss",
      "sswttttttttttttttttttttttttttttttttttttttttttwss",
      "sswttttttttttttttttttttttttttttttttttttttttttwss",
      "sswttttttttttttttttttttttttttttttttttttttttttwss",
      "sswwwwwwwwwwwwwwwwwwwwwwwwwwwwwwtwwwwwwwwwwwwwss",
      "ssttttttttttttttttttttttttttttttctttttttttttttss",
      "ssttttttttttttttttttttttttttttttctttttttttttttss",
      "ssttttttttttttttttttttttttttttttctttttttttttttss",
      "ssttttttttttttttttttttttttttttttctttttttttttttss",
      "ssttttttttttttttttttttttttttttttctttttttttttttss",
      "sstcccccccccccccccccccccccccccccctttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttss",
      "dddddddddddddddddddddddsssssssssssssssssssssssss",
      "dddddddddddddddddddddddsssssssssssssssssssssssss",
      "ssssssssssssssssssssssssssssssssssssssssssssssss",
      "ssssssssssssssssssssssssssssssssssssssssssssssss",
    ],
    playerStart: { x: 5, y: 25 },
    tavern: { x: 8, y: 23 },
    buildings: [{ x: 8, y: 23, key: "taverne" }],
    recruitNpcs: [{ x: 22, y: 5, characterId: "bretteur", level: 10 }],
    npcs: [
      { id: "citoyen-shells", x: 15, y: 23, name: "Habitant de Shells Town", dialogue: ["La Marine contrôle toute la ville.", "Un chasseur de pirates est retenu prisonnier dans la base."] },
      { id: "marin-shells", x: 34, y: 21, name: "Marine", dialogue: ["Circulez ! La base de la Marine est interdite aux civils.", "Le Colonel Morgan ne tolère aucune intrusion."] },
      { id: "prisonnier-shells", x: 18, y: 23, name: "Prisonnier", dialogue: ["Le sabreur enfermé dans la prison s'appelle Roronoa Zoro.", "Si tu veux l'approcher, commence par vaincre la Marine."] },
      { id: "gardien-port-shells", x: 17, y: 29, name: "Garde du port", dialogue: ["Le départ vers Cocoyasi Village est interdit pour le moment.", "Bats le Colonel Morgan et la route sera ouverte."] },
    ],
    chests: [
      { id: "shells-chest-1", x: 20, y: 4, itemId: "potion", amount: 2 },
      { id: "shells-chest-2", x: 22, y: 4, itemId: "potion", amount: 2 },
      { id: "shells-chest-3", x: 24, y: 4, itemId: "superPotion", amount: 1 },
    ],
    boss: {
      id: "morgan", x: 22, y: 8, respawnX: 24, respawnY: 8, enemyId: "colonelMorgan", level: 8,
      name: "Colonel Morgan", unlockFlag: "boss_ile-depart", respawnMinutes: 15,
      team: [
        { characterId: "marineRecrue", level: 4 },
        { characterId: "marineRecrue", level: 5 },
        { characterId: "colonelMorgan", level: 8, isBoss: true },
      ],
    },
    wildZones: [
      { x1: 4, y1: 16, x2: 44, y2: 18, level: 1, encounterRate: 0.07, enemyPool: ["marineRecrue"] },
      { x1: 4, y1: 12, x2: 44, y2: 14, level: 3, encounterRate: 0.07, enemyPool: ["marineFusilier"] },
      { x1: 4, y1: 3, x2: 44, y2: 10, level: 5, encounterRate: 0.07, enemyPool: ["officierMarine"] },
    ],
    warps: [{ x: 1, y: 29, toIsland: "ile-cocoyasi", toX: 1, toY: 16, lockedBy: "boss_ile-depart" }],
  },

  // ============================================================
  // 2 — COCOYASI VILLAGE
  // ============================================================
  "ile-cocoyasi": {
  name: "Cocoyasi Village",

  terrain: [
  "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
  "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
  "ssqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqss",
  "ssqtttttttttttttttttqtqtttttttttqtqtttttttttttttttttttttqtttqqss",
  "ssqtqqqqqqqtqqqqqqqtqtqtqqqtqqqtqtqtqqqqqtqtqqqqqqqqqqqtqtqtqqss",
  "ssqtqtqtttttqtttqtttqtttttqtttqtqtqtqtttqtqtqtttqtttttttttqtqqss",
  "ssqtqtqtqqqqqtqtqqqtqqqqqqqqqtqtqtqtqtqtqtqqqtqtqtqqqqqqqqqtqqss",
  "ssqtqtttqtttttqtttqtttttttqtttqtqtttttqtqtttqtqtqtqtttttqtttqqss",
  "ssqtqqqqqtqqqqqqqtqqqqqqqtqtqqqtqqqqqqqqqqqtqtqtqqqtqqqtqqtqqqss",
  "ssqtttqtttqtttttqtttttqtqtqtttqtttttttttqtttqtqtttqtttqtttttqqss",
  "ssqtqtqtqqqqqtqqqqqqqtqtqtqqqtqqqqqqqqqtqtqtqtqqqtqqqtqqqqqtqqss",
  "ssqtqtttttttttqtttttttqtqtttttqtttttttttttqtqtqtqtttttqtttqtqqss",
  "ssqqqqqqqqqqqtqtqqqqqqqtqqqtqqqqqqqqqtqqqqqqqtqtqqqqqqqqqtqtqqss",
  "ssqtttttttttttqtqtttttttttqtttttttttqtqtttttttqtttttttttttqtqqss",
  "ssqttttttttttqqtqtqqqtqqqqqtttttttttqqqtqqqqqqqtqqqqqqqtqtqtqqss",
  "dddtttttttttttttqtttqtttttqtttttttttqtttqtqtttqtttttqtttqtqttddd",
  "dddtttttttttttqqqqqtqqqqqtqtttttttttqtqqqtqtqtqtqqqqqtqqqqqttddd",
  "ssqtttttttttttttttqtqtttttqtttttttttqtttqtqtqtqtqtttttqtttqtqqss",
  "ssqtttttttttttqqqtqqqtqqqqqtttttttttqqqtqtqtqtqtqtqqqqqtqtqtqqss",
  "ssqtttttttttttttqtttqtttttttttttttttqtqtqtttqtttqtttttqtqtttqqss",
  "ssqqqqqqqqqqqtqqqtqtqqqqqqqqttttttttqtqtqtqqqqqqqqqqqtqtqqqtqqss",
  "ssqtqtttttttttqtqtqtttqtttttttttttttttqtqtttqtttqtttttqtqtttqqss",
  "ssqtqtqqqqqqqqqtqqqtqtqtqqqtqqqqqqqqqtqtqqqqqtqtqtqqqqqtqtqqqqss",
  "ssqtqtqtttqtttqtttqtqtttttqtttttttqtttqtqtttttqtttqtttttqtqtqqss",
  "ssqtqtqqqtqtqtqqqtqtqqqqqqqqqqqqqtqqqqqtqtqtqqqqqtqqqqqtqtttqqss",
  "ssqtqtttqtqtqtttqtqtqtttqtttttttqtttqtttttqtqtttqtqtqtttqtqtqqss",
  "ssqtqqqtqtqtqtqtqtqqqtqtqtqqqqqtqtqtqtqqqqqqqtqtqtqtqtqtqtttqqss",
  "ssqtttttqtttqtqtqtttttqtttqtttttqtqtttqtttttttqtqtqtqtqtqtqtqqss",
  "ssqtqqqqqqqqqtqtqqqqqqqqqqqtqqqqqqqqqqqtqqqqqqqtqqqtqtqtqtqtqqss",
  "ssqtttttttttttqtttttttttttqtttttttttttttqtttttttttttqtqtttttqqss",
  "ssqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqrqqss",
  "ssqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqss",
  "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
  "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
],


  tavern : {x: 7, y: 16, },
  buildings: [ { x: 7, y: 16, key: "taverne" }, ],
  playerStart: { x: 3, y: 16, },

  recruitNpcs: [
    { x: 33, y: 17, characterId: "navigatrice", level: 15, requiresBattle: true, battleLevel: 15, }, ],

  npcs: [
    { id: "ancien-cocoyasi", x: 10, y: 6, name: "Habitant de Cocoyasi", dialogue: [ "Cocoyasi était autrefois un village paisible.", "Les hommes-poissons ont tout détruit.", ], },
    { id: "habitant-cocoyasi", x: 28, y: 22, name: "Habitante de Cocoyasi", dialogue: [ "Nami est quelque part dans les ruines.", "Elle semble protéger quelque chose...", ], },
    { id: "pecheur-cocoyasi", x: 47, y: 10, name: "Pêcheur", dialogue: [ "Attention aux hommes-poissons.", "Ils rôdent dans toutes les ruines du village.", ], },
  ],

  chests: [
    { id: "cocoyasi-chest-1", x: 13, y: 8, itemId: "potion", amount: 2, },
    { id: "cocoyasi-chest-2", x: 43, y: 20, itemId: "superPotion", amount: 2, },
    { id: "cocoyasi-chest-3", x: 59, y: 31, itemId: "potion", amount: 5, },
  ],

  boss: { id: "arlong-cocoyasi", x: 28, y: 16, respawnX: 27, respawnY: 16, enemyId: "arlong", level: 20, name: "Arlong", unlockFlag: "boss_ile-brume", respawnMinutes: 15,
  team: [ {characterId: "arlong", level: 20, isBoss: true, }, ],
},

  wildZones: [
  // 🟢 Entrée / premières zones
  {x1: 3, y1: 3, x2: 20, y2: 14, level: 9, encounterRate: 0.07, enemyPool: ["fishmanPirate"], },
  // 🟢 Premiers couloirs du labyrinthe
  {x1: 4, y1: 15, x2: 25, y2: 22, level: 10, encounterRate: 0.08, enemyPool: ["fishmanLancer"], },
  // 🟡 Labyrinthe intermédiaire
  {x1: 15, y1: 5, x2: 38, y2: 25, level: 12, encounterRate: 0.09, enemyPool: ["fishmanPirate", "fishmanBountyHunter"], },
  // 🟡 Labyrinthe profond
  {x1: 25, y1: 4, x2: 52, y2: 28, level: 14, encounterRate: 0.10, enemyPool: ["fishmanSwordsman", "fishmanBountyHunter"], },
  // 🟠 Approche d'Arlong Park
  {x1: 38, y1: 8, x2: 60, y2: 25, level: 16, encounterRate: 0.11, enemyPool: ["fishmanBrute", "fishmanLancer"], },
  // 🔴 Zone très proche d'Arlong
  {x1: 48,y1: 12, x2: 61, y2: 21, level: 17, encounterRate: 0.12, enemyPool: ["fishmanCaptain", "fishmanBrute"], },
],

  warps: [
    { x: 1, y: 16, toIsland: "ile-depart", toX: 2, toY: 29, },
    { x: 63, y: 16, toIsland: "ile-hiver", toX: 2, toY: 29, lockedBy: "boss_ile-brume", },
  ],
},

  // ============================================================
  // 3 — SYRUP VILLAGE
  // ============================================================
  "ile-syrup": {
    name: "Syrup Village",
    terrain: [
      "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
      "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
      "ssfffffffffffffffffffffffffffffffffffffafffffffffffffffffffaafffss",
      "ssfffffffaffffffffffffffafffffffffffffffffffffffffffffffffffffaass",
      "ssfffffffffffffffffffffffffffffffffffffffaffffffffffffffffffffffss",
      "ssfffffffffffffffafffffffffffffffaffffffffffffffffffffffffffffffss",
      "ssffffffffffffffffffffffafffffffffffffffffffffffffffffffffffffffss",
      "ssffffffffffffffffffffafffffffffffffffffffffwwwwwwwwwwwwwwwwwwwwss",
      "ssffffffffafffffffffffffffffffffafffffffffffwpppppppppppppppppppss",
      "ssffffffffffffffffffffffffffffffffffffffffffwpppppppppppppppppppss",
      "ssfffffffffffffffffffffffffffaffffffffffffffwpppppppppppppppppppss",
      "ssfffffffffffaffffffffffffffffffffffffffffffwpppppppppppppppppppss",
      "ssfffffffffffffffffffffffffffffaffffffffffffwpppppppppppppppppppss",
      "ssfffffffffffffffffaffffffffffffffffffffffffwpppppppppppppppppppss",
      "ssffffffffffffffffffffffffffffffffffffffffffwpppppppppppppppppppss",
      "ssfffffffffffffffffffffffffaffffffffffffffffwpppppppppppppppppppss",
      "ssffffffffffffffffffffffffffffffffffffffffffwpppppppppppppppppppss",
      "ssfffffffffafffffffffffffffffffaffffffffffffwpppppppppppppppppppss",
      "ssffffffffffffffafffffffffffffffffffffffffffwpppppppppppppppppppss",
      "ssfffffffffffffffffffffaffffffffffffffffffffwpppppppppppppppppppss",
      "ssffffffffffffffffffffffffffffffffffffffffffwpppppppppppppppppppss",
      "ssfffffffffcffafffffffffffffffffffffffffffffwpppppppppppppppppppss",
      "ssfffffffffcfffffffffffaffffffffffffffffffffwpppppppppppppppppppss",
      "ssfffffffffcffffffffffffffffffffffffffafffffwpppppppppppppppppppss",
      "ssfffffffffcfffffffffffffaffffffffffffffffffwpppppppppppppppppppss",
      "ssfffffffffcffffffffffffffffffffffffffffffffwwwwwwwwwwwpwwwwwwwwss",
      "ssfffffffffcffffffffffaffffffffffffffffffffffffffffffffcffffffffss",
      "ssfffffffffcccccccccccccccccccccccccccccccccccccccccccccffffffffss",
      "ssfffffffffffffffffffffffffffffffffffffffffffffffffffffffaffffffss",
      "ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddss",
      "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
      "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
    ],
    playerStart: { x: 3, y: 15 },
    tavern: { x: 10, y: 20 },
    buildings: [
      { x: 10, y: 20, key: "taverne" },
      { x: 54, y: 16, key: "manoir", scale: 0.4 },
    ],
    
    recruitNpcs: [{ x: 62, y: 2, characterId: "tireur", level: 22 }],
    
    npcs: [
      { id: "syrup-maire", x: 15, y: 20, name: "Maire de Syrup Village", dialogue: ["Des pirates rôdent dans la vieille forêt, à l'est.", "Un tireur d'élite du coin rêve de prendre la mer.", "La grande propriété au bout de l'île appartient à une riche héritière."] },
      { id: "syrup-garde", x: 22, y: 13, name: "Garde du village", dialogue: ["Ne t'aventure pas seul dans les bois.", "Le chef des pirates a établi son camp devant le manoir."] },
    ],
    
    chests: [
      { id: "syrup-chest-1", x: 30, y: 14, itemId: "potion", amount: 3 },
      { id: "syrup-chest-2", x: 52, y: 20, itemId: "superPotion", amount: 2 },
    ],

boss: {
  id: "kuro",
  x: 54,
  y: 16,
  enemyId: "kuro",
  level: 30,
  name: "Kuro",
  unlockFlag: "boss_ile-syrup",
  respawnMinutes: 15,
  team: [
    { characterId: "pirateChatNoirSabreur", level: 25 },
    { characterId: "pirateChatNoirPistolet", level: 27 },
    { characterId: "kuro", level: 30, isBoss: true },
  ],
},

specialBosses: [
  {
    id: "jango",
    x: 61,
    y: 3,
    respawnX: 53,
    respawnY: 20,
    enemyId: "jango",
    level: 30,
    name: "Jango",
    unlockFlag: "jango_syrup_defeated",
    respawnMinutes: 15,
    team: [
      { characterId: "jango", level: 30, isBoss: true },
    ],
  },

  {
    id: "freres-nyaban",
    x: 55,
    y: 24,
    respawnX: 58,
    respawnY: 20,
    enemyId: "freresNyaban",
    level: 28,
    name: "Frères Nyaban",
    unlockFlag: "nyaban_syrup_defeated",
    respawnMinutes: 15,
    team: [
      { characterId: "freresNyaban", level: 28, isBoss: true },
    ],
  },
],
    
wildZones: [
  {
    x1: 4,
    y1: 4,
    x2: 28,
    y2: 29,
    level: 19,
    encounterRate: 0.045,
    enemyPool: [
      "pirateChatNoirSabreur",
      "pirateChatNoirPistolet",
    ],
  },

  {
    x1: 29,
    y1: 4,
    x2: 51,
    y2: 29,
    level: 21,
    encounterRate: 0.05,
    enemyPool: [
      "pirateChatNoirSabreur",
      "pirateChatNoirPistolet",
    ],
  },
],
    
    warps: [
      { x: 1, y: 29, toIsland: "ile-cocoyasi", toX: 61, toY: 16 },
      { x: 63, y: 29, toIsland: "ile-baratie", toX: 1, toY: 16 },
    ],
  },

  // ============================================================
  // 4 — BARATIE
  // ============================================================
  "ile-baratie": {
    name: "Baratie",
    terrain: [
      "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
      "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
      "ssssssssssssbbbbbbbbbbbbbbbbbbbbbcbbvbbbbbbbbbbbbbbbssssssssssss",
      "ssssssssbbbbbbbcbbbbbbbvbbbbbbbbbbbbbbcbbbbbbbbbbbbbbbvbssssssss",
      "ssssssbbbbvbbbbbbbbbcbbbbbbbbbbbbbbbbbbbbvbcbbbbbbbbbbbbbbssssss",
      "ssssbbbbbbbbbbbbbbbbbbbbbcbbvbbbbbbbbbbbbbbbbbbbcbbbbbbbbbbvssss",
      "ssssbbbcbbbbbbbvbbbbbbbbbbbbbbcbbbbbbbbbbbbbbbvbbbbbbcbbbbbbssss",
      "ssssbbbbbbbbcbbbbbbbbbbbbbbbbbbbbvbcbbbbbbbbbbbbbbbbbbbbbbcbssss",
      "ssssbbbbbbbbbbbbbcbbvbbbbbbbbbbbbbbbbbbbcbbbbbbbbbbvbbbbbbbbssss",
      "ssssbbbvbbbbbbbbbbbbbbcbbbbbbbbbbbbbbbvbbbbbbcbbbbbbbbbbbbbbssss",
      "sssscbbbbbbbbbbbbbbbbbbbbvbcbbbbbbbbbbbbbbbbbbbbbbcbbbbbvbbbssss",
      "ssssbbbbbcbbvbbbbbbbbbbbbbbbbbbbcbbbbbbbbbbvbbbbbbbbbbbcbbbbssss",
      "ssssbbbbbbbbbbcbbbbbbbbbbbbbbbvbbbbbbcbbbbbbbbbbbbbbbbbbbbbbssss",
      "ssssbbbbbbbbbbbbbvbcbbbbbbbbbbbbbbbbbbbbbbcbbbbbvbbbbbbbbbbbssss",
      "ssssvbbbbbbbbbbbbbbbbbbbcbbbbbbbbbbvbbbbbbbbbbbcbbbbbbbbbbbbssss",
      "ssssbbcbbbbbbbbbbbbbbbvbbbbbbcbbbbbbbbbbbbbbbbbbbbbbcvbbbbbbssss",
      "sbbbbbbbbvbcbbbbbbbbbbbbbbbbbbbbbbcbbbbbvbbbbbbbbbbbbbbbbcbbbbbs",
      "ssssbbbbbbbbbbbbcbbbbbbbbbbvbbbbbbbbbbbcbbbbbbbbbbbbbbbbbbvbssss",
      "ssssbbbbbbbbbbvbbbbbbcbbbbbbbbbbbbbbbbbbbbbbcvbbbbbbbbbbbbbbssss",
      "ssssbbbbbbbbbbbbbbbbbbbbbbcbbbbbvbbbbbbbbbbbbbbbbcbbbbbbbbbbssss",
      "ssssbbbbcbbbbbbbbbbvbbbbbbbbbbbcbbbbbbbbbbbbbbbbbbvbbbcbbbbbssss",
      "ssssbbvbbbbbbcbbbbbbbbbbbbbbbbbbbbbbcvbbbbbbbbbbbbbbbbbbbbbcssss",
      "ssssbbbbbbbbbbbbbbcbbbbbvbbbbbbbbbbbbbbbbcbbbbbbbbbbbbbvbbbbssss",
      "ssssbbbbbbbvbbbbbbbbbbbcbbbbbbbbbbbbbbbbbbvbbbcbbbbbbbbbbbbbssss",
      "ssssbcbbbbbbbbbbbbbbbbbbbbbbcvbbbbbbbbbbbbbbbbbbbbbcbbbbbbbbssss",
      "ssssbbbbbbcbbbbbvbbbbbbbbbbbbbbbbcbbbbbbbbbbbbbvbbbbbbbbcbbbssss",
      "ssssbbbbbbbbbbbcbbbbbbbbbbbbbbbbbbvbbbcbbbbbbbbbbbbbbbbbbbbbssss",
      "ssssbbbbbbbbbbbbbbbbcvbbbbbbbbbbbbbbbbbbbbbcbbbbbbbbvbbbbbbbssss",
      "ssssbbbbvbbbbbbbbbbbbbbbbcbbbbbbbbbbbbbvbbbbbbbbcbbbbbbbbbbbssss",
      "ssssssbcbbbbbbbbbbbbbbbbbbvbbbcbbbbbbbbbbbbbbbbbbbbbbcbbbvssssss",
      "ssssssssbbbbcvbbbbbbbbbbbbbbbbbbbbbcbbbbbbbbvbbbbbbbbbbbssssssss",
      "ssssssssssssbbbbbcbbbbbbbbbbbbbvbbbbbbbbcbbbbbbbbbbbssssssssssss",
      "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
      "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
    ] ,

    playerStart: { x: 5, y: 16 },
    tavern: { x: 14, y: 22 },
    buildings: [
      { x: 29, y: 7, key: "baratie_restaurant", scale: 1.0 },
    ],

    decorations: [
      { x: 10, y: 9, key: "baratie_crate" },
      { x: 11, y: 9, key: "baratie_crate2" },
      { x: 51, y: 9, key: "baratie_crate" },
      { x: 52, y: 9, key: "baratie_crate2" },
      { x: 9, y: 23, key: "baratie_crate2" },
      { x: 10, y: 23, key: "baratie_crate" },
      { x: 53, y: 23, key: "baratie_crate" },
      { x: 54, y: 23, key: "baratie_crate2" },
      { x: 18, y: 5, key: "baratie_lamp" },
      { x: 46, y: 5, key: "baratie_lamp2" },
      { x: 18, y: 27, key: "baratie_lamp2" },
      { x: 46, y: 27, key: "baratie_lamp" },
      { x: 6, y: 15, key: "baratie_hull_side" },
      { x: 57, y: 15, key: "baratie_hull_side2" },
      { x: 6, y: 17, key: "baratie_hull_side" },
      { x: 57, y: 17, key: "baratie_hull_side2" },
    ],

    quests: [
      {
        id: "baratie-1",
        title: "Bienvenue au Baratie",
        description: "Parle à Zeff pour recevoir l'accueil du Baratie.",
        startFlag: "baratie_intro_started",
        completeFlag: "baratie_intro_done",
      },
      {
        id: "baratie-2",
        title: "Les problèmes en cuisine",
        description: "Aide la cuisine à récupérer les ingrédients nécessaires au service.",
        startFlag: "baratie_cuisine_started",
        completeFlag: "baratie_cuisine_done",
      },
      {
        id: "baratie-3",
        title: "Les provisions",
        description: "Récupère les trois caisses de provisions perdues.",
        startFlag: "baratie_provisions_started",
        completeFlag: "baratie_provisions_done",
      },
      {
        id: "baratie-4",
        title: "Des pirates approchent",
        description: "Défends le Baratie contre les hommes de Krieg.",
        startFlag: "baratie_attack_started",
        completeFlag: "baratie_pearl_defeated",
      },
      {
        id: "baratie-5",
        title: "Le bouclier humain",
        description: "Après Pearl, poursuis l'assaut de Krieg et affronte Gin.",
        startFlag: "baratie_gin_started",
        completeFlag: "baratie_gin_defeated",
      },
      {
        id: "baratie-6",
        title: "La bataille du Baratie",
        description: "Repousse Don Krieg et son équipage.",
        startFlag: "baratie_gin_defeated",
        completeFlag: "boss_ile-baratie",
      },
      {
        id: "baratie-7",
        title: "Le rêve de Sanji",
        description: "Après la bataille, affronte Sanji et recrute-le dans l'équipage.",
        startFlag: "boss_ile-baratie",
        completeFlag: "baratie_sanji_recruited",
      },
      {
        id: "baratie-8",
        title: "Johnny & Yosaku",
        description: "Aide les deux chasseurs de primes à retrouver leur cible.",
        startFlag: "baratie_chasseurs_started",
        completeFlag: "baratie_chasseurs_done",
      },
      {
        id: "baratie-9",
        title: "Le meilleur cuisinier",
        description: "Rapporte les ingrédients cachés autour du Baratie.",
        startFlag: "baratie_cuisine_started",
        completeFlag: "baratie_cuisine_done",
      },
    ],

    recruitNpcs: [
      {
        x: 31,
        y: 13,
        characterId: "cuisinier",
        level: 32,
        requiredFlag: "boss_ile-baratie",
        requiresBattle: true,
        battleLevel: 32,
      },
    ],

    npcs: [
      {
        id: "baratie-zeff",
        x: 18,
        y: 12,
        name: "Zeff",
        characterId: "zeff",
        setFlag: "baratie_intro_started",
        completeAfterDialog: "baratie_intro_done",
        dialogue: [
          "Bienvenue au Baratie. Ici, on sert tous ceux qui ont faim.",
          "Les cuisiniers sont en plein service. Si tu veux aider, parle au cuisinier du pont.",
          "Des navires suspects approchent. Si ça tourne mal, défends le restaurant.",
        ],
      },
      {
        id: "baratie-patty",
        x: 22,
        y: 17,
        name: "Patty",
        characterId: "patty",
        dialogue: [
          "Bienvenue au Baratie ! Ici, même les pirates paient leur addition.",
          "Si Krieg attaque, protège surtout la salle du restaurant.",
        ],
      },
      {
        id: "baratie-carne",
        x: 30,
        y: 20,
        name: "Carne",
        characterId: "carne",
        setFlag: "baratie_provisions_started",
        dialogue: [
          "On nous a volé trois caisses de provisions.",
          "J'ai marqué leur emplacement dans la cale. Ouvre les coffres marqués et reviens me voir.",
        ],
      },
      {
        id: "baratie-marine",
        x: 46,
        y: 22,
        name: "Marine",
        characterId: "character_10",
        setFlag: "baratie_attack_started",
        dialogue: [
          "Des navires de Krieg ont été aperçus au large.",
          "Prépare-toi. Le prochain assaut ne sera pas une plaisanterie.",
        ],
      },
      {
        id: "baratie-johnny",
        x: 38,
        y: 8,
        name: "Johnny",
        characterId: "johnny",
        setFlag: "baratie_chasseurs_started",
        dialogue: [
          "Yosaku et moi poursuivons un pirate qui se cache près de la cale.",
          "Trouve-le et nous te récompenserons.",
        ],
      },
      {
        id: "baratie-yosaku",
        x: 42,
        y: 9,
        name: "Yosaku",
        characterId: "yosaku",
        dialogue: [
          "Notre cible porte une veste rouge et se cache parmi les caisses.",
          "Si tu la trouves, montre-nous que tu sais te battre.",
        ],
      },
      {
        id: "baratie-cuisinier",
        x: 20,
        y: 24,
        name: "Cuisinier du Baratie",
        characterId: "baratieCook",
        setFlag: "baratie_cuisine_started",
        dialogue: [
          "Il me manque plusieurs ingrédients pour le service.",
          "Cherche les caisses marquées autour du pont.",
        ],
      },
    ],

    chests: [
      { id: "baratie-chest-1", x: 17, y: 7, itemId: "potion", amount: 2 },
      { id: "baratie-chest-2", x: 24, y: 7, itemId: "potion", amount: 2, setFlag: "baratie_provision_1" },
      { id: "baratie-chest-3", x: 31, y: 7, itemId: "superPotion", amount: 1, setFlag: "baratie_provision_2" },
      { id: "baratie-chest-4", x: 38, y: 7, itemId: "potion", amount: 3, setFlag: "baratie_provision_3" },
      { id: "baratie-chest-5", x: 46, y: 11, itemId: "superPotion", amount: 2 },
      { id: "baratie-chest-6", x: 52, y: 18, itemId: "potion", amount: 4, setFlag: "baratie_chasseurs_target_found" },
      { id: "baratie-chest-7", x: 47, y: 25, itemId: "superPotion", amount: 2 },
      { id: "baratie-chest-8", x: 34, y: 26, itemId: "potion", amount: 5 },
      { id: "baratie-chest-9", x: 27, y: 23, itemId: "superPotion", amount: 2, setFlag: "baratie_cuisine_1" },
      { id: "baratie-chest-10", x: 40, y: 20, itemId: "superPotion", amount: 3, setFlag: "baratie_cuisine_2" },
    ],

    boss: {
      id: "don-krieg-baratie",
      x: 53,
      y: 15,
      enemyId: "donKrieg",
      level: 34,
      name: "Don Krieg",
      unlockFlag: "boss_ile-baratie",
      requiredFlag: "baratie_gin_defeated",
      respawnMinutes: 15,
      team: [
        { characterId: "kriegPirate", level: 27 },
        { characterId: "pearl", level: 31 },
        { characterId: "donKrieg", level: 34, isBoss: true },
      ],
    },

    specialBosses: [
      {
        id: "pearl-baratie",
        x: 47,
        y: 15,
        respawnX: 47,
        respawnY: 20,
        enemyId: "pearl",
        level: 28,
        name: "Pearl",
        unlockFlag: "baratie_pearl_defeated",
        requiredFlag: "baratie_attack_started",
        respawnMinutes: 15,
        team: [
          { characterId: "kriegPirate", level: 24 },
          { characterId: "pearl", level: 28, isBoss: true },
        ],
      },
      {
        id: "gin-baratie",
        x: 41,
        y: 15,
        respawnX: 41,
        respawnY: 20,
        enemyId: "gin",
        level: 30,
        name: "Gin",
        unlockFlag: "baratie_gin_defeated",
        requiredFlag: "baratie_pearl_defeated",
        respawnMinutes: 15,
        team: [
          { characterId: "gin", level: 30, isBoss: true },
        ],
      },
    ],

    wildZones: [
      {
        x1: 8, y1: 4, x2: 25, y2: 28,
        level: 23, encounterRate: 0.045,
        enemyPool: ["pirateBaratie", "pirateBaratieSabreur"],
      },
      {
        x1: 26, y1: 4, x2: 44, y2: 28,
        level: 25, encounterRate: 0.05,
        enemyPool: ["kriegPirate", "pirateBaratiePistolet"],
      },
      {
        x1: 45, y1: 4, x2: 59, y2: 28,
        level: 27, encounterRate: 0.055,
        enemyPool: ["kriegSabreur", "kriegPistolet", "kriegLourd"],
      },
    ],

    warps: [
      { x: 1, y: 16, toIsland: "ile-syrup", toX: 62, toY: 29 },
      { x: 63, y: 16, toIsland: "ile-drum", toX: 2, toY: 16, lockedBy: "boss_ile-baratie" },
    ],
  },

// ============================================================
  // 5 — DRUM ISLAND
  // ============================================================
  "ile-drum": {
    name: "Drum Island",
    terrain: [
      "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
      "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "sdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddss",
      "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
      "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
    ],
    playerStart: { x: 3, y: 16 },
    tavern: { x: 11, y: 23 },
    buildings: [{ x: 11, y: 23, key: "taverne" }],
    recruitNpcs: [{ x: 30, y: 10, characterId: "medecin", level: 43 }],
    npcs: [
      { id: "drum-villageois", x: 16, y: 21, name: "Habitant de Drum", dialogue: ["La neige ne pardonne aucune faiblesse.", "Un médecin remarquable vit quelque part sur cette île."] },
      { id: "drum-chasseur", x: 47, y: 9, name: "Chasseur de montagne", dialogue: ["Les montagnes sont pleines de créatures sauvages.", "Des pirates ont aussi débarqué plus haut."] },
    ],
    chests: [
      { id: "drum-chest-1", x: 20, y: 8, itemId: "superPotion", amount: 2 },
      { id: "drum-chest-2", x: 45, y: 23, itemId: "potion", amount: 5 },
    ],
    boss: {
      id: "drum-boss", x: 56, y: 15, enemyId: "chasseurDePrimes", level: 47,
      name: "Seigneur de la Montagne", unlockFlag: "boss_ile-drum", respawnMinutes: 15,
      team: [
        { characterId: "chasseurDePrimes", level: 38 },
        { characterId: "pirateRival", level: 42 },
        { characterId: "chasseurDePrimes", level: 47, isBoss: true },
      ],
    },
    wildZones: [
      { x1: 8, y1: 5, x2: 24, y2: 28, level: 13, encounterRate: 0.05, enemyPool: ["chasseurDePrimes", "pirateRival"] },
      { x1: 26, y1: 5, x2: 44, y2: 28, level: 14, encounterRate: 0.055, enemyPool: ["chasseurDePrimes", "pirateRival"] },
      { x1: 46, y1: 5, x2: 60, y2: 28, level: 15, encounterRate: 0.06, enemyPool: ["chasseurDePrimes", "officierMarine"] },
    ],
    warps: [
      { x: 2, y: 16, toIsland: "ile-baratie", toX: 61, toY: 16 },
      { x: 63, y: 16, toIsland: "ile-alabasta", toX: 3, toY: 16, lockedBy: "boss_ile-drum" },
    ],
  },

  // ============================================================
  // 6 — ALABASTA
  // ============================================================
  "ile-alabasta": {
    name: "Alabasta",
    terrain: [
      "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
      "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "sdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddss",
      "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
      "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
    ],
    playerStart: { x: 3, y: 16 },
    tavern: { x: 10, y: 23 },
    buildings: [{ x: 10, y: 23, key: "taverne" }],
    recruitNpcs: [{ x: 32, y: 11, characterId: "archeologue", level: 58 }],
    npcs: [
      { id: "alabasta-citoyen", x: 15, y: 21, name: "Habitant d'Alabasta", dialogue: ["Le désert semble sans fin.", "Les ruines anciennes cachent peut-être des réponses sur le monde."] },
      { id: "alabasta-marine", x: 48, y: 22, name: "Marine du désert", dialogue: ["Pirates et agents se disputent le contrôle des routes.", "La sortie vers Water 7 est gardée."] },
    ],
    chests: [
      { id: "alabasta-chest-1", x: 22, y: 8, itemId: "potion", amount: 5 },
      { id: "alabasta-chest-2", x: 44, y: 9, itemId: "superPotion", amount: 3 },
    ],
    boss: {
      id: "alabasta-boss", x: 56, y: 15, enemyId: "chasseurDePrimes", level: 62,
      name: "Chef des Agents", unlockFlag: "boss_ile-alabasta", respawnMinutes: 15,
      team: [
        { characterId: "chasseurDePrimes", level: 52 },
        { characterId: "officierMarine", level: 57 },
        { characterId: "chasseurDePrimes", level: 62, isBoss: true },
      ],
    },
    wildZones: [
      { x1: 8, y1: 5, x2: 24, y2: 28, level: 17, encounterRate: 0.05, enemyPool: ["pirateRival", "chasseurDePrimes"] },
      { x1: 26, y1: 5, x2: 44, y2: 28, level: 18, encounterRate: 0.055, enemyPool: ["chasseurDePrimes", "officierMarine"] },
      { x1: 46, y1: 5, x2: 60, y2: 28, level: 19, encounterRate: 0.06, enemyPool: ["chasseurDePrimes", "officierMarine"] },
    ],
    warps: [
      { x: 2, y: 16, toIsland: "ile-drum", toX: 61, toY: 16 },
      { x: 63, y: 16, toIsland: "ile-water7", toX: 3, toY: 16, lockedBy: "boss_ile-alabasta" },
    ],
  },

  // ============================================================
  // 7 — WATER 7
  // ============================================================
  "ile-water7": {
    name: "Water 7",
    terrain: [
      "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
      "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "sdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddss",
      "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
      "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
    ],
    playerStart: { x: 3, y: 16 },
    tavern: { x: 11, y: 23 },
    buildings: [{ x: 11, y: 23, key: "taverne" }],
    recruitNpcs: [{ x: 34, y: 13, characterId: "charpentier", level: 72 }],
    npcs: [
      { id: "water7-ouvrier", x: 17, y: 21, name: "Ouvrier de Water 7", dialogue: ["Cette ville flotte entre canaux, ponts et grands chantiers.", "Un charpentier exceptionnel travaille quelque part dans les docks."] },
      { id: "water7-agent", x: 48, y: 9, name: "Agent mystérieux", dialogue: ["Les agents spéciaux sont partout.", "Méfie-toi des silhouettes qui surveillent les quais."] },
    ],
    chests: [
      { id: "water7-chest-1", x: 20, y: 8, itemId: "superPotion", amount: 3 },
      { id: "water7-chest-2", x: 45, y: 23, itemId: "potion", amount: 6 },
    ],
    boss: {
      id: "water7-boss", x: 56, y: 15, enemyId: "officierMarine", level: 76,
      name: "Chef des Agents", unlockFlag: "boss_ile-water7", respawnMinutes: 15,
      team: [
        { characterId: "chasseurDePrimes", level: 65 },
        { characterId: "officierMarine", level: 70 },
        { characterId: "officierMarine", level: 76, isBoss: true },
      ],
    },
    wildZones: [
      { x1: 8, y1: 5, x2: 24, y2: 28, level: 20, encounterRate: 0.05, enemyPool: ["pirateRival", "chasseurDePrimes"] },
      { x1: 26, y1: 5, x2: 44, y2: 28, level: 21, encounterRate: 0.055, enemyPool: ["chasseurDePrimes", "officierMarine"] },
      { x1: 46, y1: 5, x2: 60, y2: 28, level: 22, encounterRate: 0.06, enemyPool: ["officierMarine", "chasseurDePrimes"] },
    ],
    warps: [
      { x: 2, y: 16, toIsland: "ile-alabasta", toX: 61, toY: 16 },
      { x: 63, y: 16, toIsland: "ile-thriller-bark", toX: 3, toY: 16, lockedBy: "boss_ile-water7" },
    ],
  },

  // ============================================================
  // 8 — THRILLER BARK
  // ============================================================
  "ile-thriller-bark": {
    name: "Thriller Bark",
    terrain: [
      "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
      "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "sdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddss",
      "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
      "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
    ],
    playerStart: { x: 3, y: 16 },
    tavern: { x: 11, y: 23 },
    buildings: [{ x: 11, y: 23, key: "taverne" }],
    recruitNpcs: [{ x: 34, y: 12, characterId: "musicien", level: 88 }],
    npcs: [
      { id: "thriller-villageois", x: 16, y: 22, name: "Fantôme errant", dialogue: ["Cette île n'a rien de normal.", "Les morts se relèvent dans le brouillard."] },
      { id: "thriller-cimetiere", x: 48, y: 10, name: "Gardien du cimetière", dialogue: ["Ne t'approche pas des tombes après minuit.", "Quelqu'un contrôle les zombies depuis le manoir."] },
    ],
    chests: [
      { id: "thriller-chest-1", x: 21, y: 8, itemId: "superPotion", amount: 4 },
      { id: "thriller-chest-2", x: 45, y: 23, itemId: "potion", amount: 7 },
    ],
    boss: {
      id: "thriller-boss", x: 56, y: 15, enemyId: "chasseurDePrimes", level: 92,
      name: "Maître des Zombies", unlockFlag: "boss_ile-thriller-bark", respawnMinutes: 15,
      team: [
        { characterId: "pirateRival", level: 80 },
        { characterId: "chasseurDePrimes", level: 86 },
        { characterId: "chasseurDePrimes", level: 92, isBoss: true },
      ],
    },
    wildZones: [
      { x1: 8, y1: 5, x2: 24, y2: 28, level: 23, encounterRate: 0.055, enemyPool: ["pirateRival", "chasseurDePrimes"] },
      { x1: 26, y1: 5, x2: 44, y2: 28, level: 24, encounterRate: 0.06, enemyPool: ["chasseurDePrimes", "pirateRival"] },
      { x1: 46, y1: 5, x2: 60, y2: 28, level: 25, encounterRate: 0.065, enemyPool: ["chasseurDePrimes", "officierMarine"] },
    ],
    warps: [
      { x: 2, y: 16, toIsland: "ile-water7", toX: 61, toY: 16 },
      { x: 63, y: 16, toIsland: "ile-finale", toX: 3, toY: 16, lockedBy: "boss_ile-thriller-bark" },
    ],
  },

  // ============================================================
  // 9 — ÎLE FINALE
  // ============================================================
  "ile-finale": {
    name: "Île Finale",
    terrain: [
      "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
      "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttss",
      "sdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddss",
      "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
      "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
    ],
    playerStart: { x: 3, y: 16 },
    tavern: { x: 10, y: 23 },
    buildings: [{ x: 10, y: 23, key: "taverne" }],
    recruitNpcs: [],
    npcs: [
      { id: "final-guide", x: 18, y: 12, name: "Gardien de l'île", dialogue: ["Tu as traversé toute la Grand Line.", "Le dernier adversaire t'attend au bout du chemin."] },
      { id: "final-old", x: 43, y: 22, name: "Vieil aventurier", dialogue: ["Ici se termine ton voyage... ou commence ta légende."] },
    ],
    chests: [
      { id: "final-chest-1", x: 22, y: 8, itemId: "superPotion", amount: 5 },
      { id: "final-chest-2", x: 44, y: 8, itemId: "superPotion", amount: 5 },
      { id: "final-chest-3", x: 52, y: 23, itemId: "potion", amount: 10 },
    ],
    boss: {
      id: "final-boss", x: 56, y: 15, enemyId: "officierMarine", level: 110,
      name: "Gardien de la Grand Line", unlockFlag: "boss_ile-finale", respawnMinutes: 15,
      team: [
        { characterId: "chasseurDePrimes", level: 95 },
        { characterId: "officierMarine", level: 102 },
        { characterId: "officierMarine", level: 110, isBoss: true },
      ],
    },
    wildZones: [
      { x1: 8, y1: 5, x2: 24, y2: 28, level: 26, encounterRate: 0.06, enemyPool: ["chasseurDePrimes", "pirateRival"] },
      { x1: 26, y1: 5, x2: 44, y2: 28, level: 27, encounterRate: 0.065, enemyPool: ["chasseurDePrimes", "officierMarine"] },
      { x1: 46, y1: 5, x2: 60, y2: 28, level: 28, encounterRate: 0.07, enemyPool: ["officierMarine", "chasseurDePrimes"] },
    ],
    warps: [{ x: 2, y: 16, toIsland: "ile-thriller-bark", toX: 61, toY: 16 }],
  },
};

// Compatibilité avec les anciennes sauvegardes :
// ile-brume correspond désormais à Cocoyasi Village,
// ile-hiver correspond désormais à Syrup Village.
ISLANDS["ile-brume"] = ISLANDS["ile-cocoyasi"];
ISLANDS["ile-hiver"] = ISLANDS["ile-syrup"];

export const STARTING_ISLAND = "ile-depart";
