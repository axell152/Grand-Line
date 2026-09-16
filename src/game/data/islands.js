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
      id: "morgan", x: 22, y: 8, respawnX: 24, respawnY: 8, enemyId: "officierMarine", level: 8,
      name: "Colonel Morgan", unlockFlag: "boss_ile-depart", respawnMinutes: 15,
      team: [
        { characterId: "marineRecrue", level: 4 },
        { characterId: "marineRecrue", level: 5 },
        { characterId: "officierMarine", level: 8, isBoss: true },
      ],
    },
    wildZones: [
      { x1: 4, y1: 16, x2: 44, y2: 18, level: 1, encounterRate: 0.1, enemyPool: ["marineRecrue"] },
      { x1: 4, y1: 12, x2: 44, y2: 14, level: 2, encounterRate: 0.1, enemyPool: ["marineRecrue"] },
      { x1: 4, y1: 3, x2: 44, y2: 10, level: 3, encounterRate: 0.1, enemyPool: ["marineRecrue", "officierMarine"] },
      { x1: 4, y1: 5, x2: 44, y2: 4, level: 10, encounterRate: 0.07, enemyPool: ["marineRecrue", "officierMarine"] },
    ],
    warps: [{ x: 1, y: 29, toIsland: "ile-cocoyasi", toX: 3, toY: 16, lockedBy: "boss_ile-depart" }],
  },

  // ============================================================
  // 2 — COCOYASI VILLAGE
  // ============================================================
  "ile-cocoyasi": {
  name: "Cocoyasi Village",

  terrain: [
    "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
    "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",

    "ssggggggggggggggggggggggggggggggggggggggggggggggggggggggggggss",
    "ssggggggggggggggggqqqqqqqqqqqqqqqqggggggggggggggggggggggggggss",
    "ssggggggggggggggggqgggggggggggggqggggggggggggggggggggggggggss",
    "ssggggggggggggggggqgggggggggggggqggggggqqqqqqqqqqqqqqqqggggss",
    "ssggggqqqqqqqqqqqqqggggggggggggggqgggggqvvvvvvvvvvvvvvvqggggss",
    "ssggggqggggggggggggggggggggggggggqgggggqvvvvvvvvvvvvvvvqggggss",
    "ssggggqggggggggggggggggggggggggggqgggggqvvvvvvvvvvvvvvvqggggss",
    "ssggggqggggggggggqqqqqqqqqqqqqqqqqgggggqvvvvvvvvvvvvvvvqggggss",

    "ssggggqggggggggggqrrrrrrrrrrrrrrrqgggggqvvvvvvvvvvvvvvvqggggss",
    "ssggggqggggggggggqrrrrrrrrrrrrrrrqgggggqqqqqqqqqqqqqqqqqggggss",
    "ssggggqggggggggggqrrrrrrrrrrrrrrrqqqqqqqqggggggggggggggggggss",
    "ssggggqggggggggggqrrrrrrrrrrrrrrrggggggggggggggggggggggggggss",
    "ssggggqggggggggggqrrrrrrrrrrrrrrrggggggggggggqqqqqqqqqqqqqss",
    "ssggggqggggggggggqrrrrrrrrrrrrrrrggggggggggggqggggggggggggqss",

    "ssggggqggggggggggqqqqqqqqqqqqqqqqggggggggggggqggggggggggggqss",
    "ssggggqgggggggggggggggggggggggggggggggggggggqggggggggggggqss",
    "ssggggqgggggggggggggggggggggggggggggggggggggqggggggggggggqss",
    "ssggggqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqggggggggggggqss",

    "ssggggggggggggggggggggggggggggggggggggggggggqggggggggggggqss",
    "ssggggggggggggggggggqqqqqqqqqqqqqqqqqqqqqqqqqggggggggggggqss",
    "ssggggggggggggggggggqggggggggggggggggggggggggggggggggggggqss",
    "ssggggggggggggggggggqggggggggggggggggggggggggggggggggggggqss",
    "ssggggggggggggggggggqggggggqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqss",
    "ssggggggggggggggggggqgggggqggggggggggggggggggggggggggggggss",
    "ssggggggggggggggggggqgggggqggggggggggggggggggggggggggggggss",
    "ssggggggggggggggggggqgggggqggggggggggqqqqqqqqqqqqqqqqqqqqss",
    "ssggggggggggggggggggqgggggqggggggggggqgggggggggggggggggggss",
    "ssggggggggggggggggggqgggggqggggggggggqgggggggggggggggggggss",
    "ssggggggggggggggggggqqqqqqqqqqqqqqqqqqgggggggggggggggggggss",

    "ssccccccccccccccccccccccccccccccccccccccccccccccccccccccccccss",
    "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
  ],

  playerStart: {
    x: 3,
    y: 16,
  },

  recruitNpcs: [
    {
      x: 57,
      y: 27,
      characterId: "navigatrice",
      level: 15,
      requiresBattle: true,
      battleLevel: 15,
    },
  ],

  npcs: [
    {
      id: "ancien-cocoyasi",
      x: 10,
      y: 6,
      name: "Habitant de Cocoyasi",
      dialogue: [
        "Cocoyasi était autrefois un village paisible.",
        "Les hommes-poissons ont tout détruit.",
      ],
    },

    {
      id: "habitant-cocoyasi",
      x: 28,
      y: 22,
      name: "Habitante de Cocoyasi",
      dialogue: [
        "Nami est quelque part dans les ruines.",
        "Elle semble protéger quelque chose...",
      ],
    },

    {
      id: "pecheur-cocoyasi",
      x: 47,
      y: 10,
      name: "Pêcheur",
      dialogue: [
        "Attention aux hommes-poissons.",
        "Ils rôdent dans toutes les ruines du village.",
      ],
    },
  ],

  chests: [
    {
      id: "cocoyasi-chest-1",
      x: 13,
      y: 8,
      itemId: "potion",
      amount: 2,
    },

    {
      id: "cocoyasi-chest-2",
      x: 34,
      y: 14,
      itemId: "superPotion",
      amount: 1,
    },

    {
      id: "cocoyasi-chest-3",
      x: 50,
      y: 24,
      itemId: "potion",
      amount: 3,
    },
  ],

  boss: {
    id: "nami-cocoyasi",
    x: 57,
    y: 27,

    enemyId: "navigatrice",

    level: 15,

    name: "Nami",

    unlockFlag: "boss_ile-brume",

    respawnMinutes: 15,

    team: [
      {
        characterId: "pirateRival",
        level: 12,
      },

      {
        characterId: "chasseurDePrimes",
        level: 13,
      },

      {
        characterId: "navigatrice",
        level: 15,
        isBoss: true,
      },
    ],
  },

  wildZones: [
    {
      x1: 4,
      y1: 4,
      x2: 22,
      y2: 30,

      level: 7,

      encounterRate: 0.045,

      enemyPool: [
        "pirateRival",
        "chasseurDePrimes",
      ],
    },

    {
      x1: 24,
      y1: 4,
      x2: 43,
      y2: 30,

      level: 9,

      encounterRate: 0.05,

      enemyPool: [
        "pirateRival",
        "chasseurDePrimes",
        "marineRecrue",
      ],
    },

    {
      x1: 45,
      y1: 4,
      x2: 62,
      y2: 30,

      level: 11,

      encounterRate: 0.055,

      enemyPool: [
        "chasseurDePrimes",
        "pirateRival",
      ],
    },
  ],

  warps: [
    {
      x: 2,
      y: 16,
      toIsland: "ile-depart",
      toX: 1,
      toY: 3,
    },

    {
      x: 62,
      y: 16,
      toIsland: "ile-hiver",
      toX: 3,
      toY: 16,
      lockedBy: "boss_ile-brume",
    },
  ],
},

  // ============================================================
  // 3 — SYRUP VILLAGE
  // ============================================================
  "ile-syrup": {
    name: "Syrup Village",
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
    recruitNpcs: [{ x: 32, y: 10, characterId: "tireur", level: 22 }],
    npcs: [
      { id: "syrup-maire", x: 16, y: 12, name: "Habitant de Syrup Village", dialogue: ["Des pirates rivaux rôdent autour du village.", "Un tireur d'élite du coin rêve de prendre la mer."] },
      { id: "syrup-garde", x: 46, y: 22, name: "Garde du village", dialogue: ["La vieille forêt à l'est est infestée de pirates.", "Le chef ennemi garde la sortie de l'île."] },
    ],
    chests: [
      { id: "syrup-chest-1", x: 20, y: 7, itemId: "potion", amount: 3 },
      { id: "syrup-chest-2", x: 42, y: 9, itemId: "superPotion", amount: 2 },
    ],
    boss: {
      id: "kuro", x: 56, y: 15, enemyId: "pirateRival", level: 27,
      name: "Capitaine Pirate Rival", unlockFlag: "boss_ile-syrup", respawnMinutes: 15,
      team: [
        { characterId: "pirateRival", level: 20 },
        { characterId: "chasseurDePrimes", level: 23 },
        { characterId: "pirateRival", level: 27, isBoss: true },
      ],
    },
    wildZones: [
      { x1: 8, y1: 5, x2: 24, y2: 28, level: 7, encounterRate: 0.045, enemyPool: ["pirateRival"] },
      { x1: 26, y1: 5, x2: 44, y2: 28, level: 8, encounterRate: 0.05, enemyPool: ["pirateRival", "chasseurDePrimes"] },
      { x1: 46, y1: 5, x2: 60, y2: 28, level: 9, encounterRate: 0.055, enemyPool: ["chasseurDePrimes", "pirateRival"] },
    ],
    warps: [
      { x: 2, y: 16, toIsland: "ile-cocoyasi", toX: 61, toY: 16 },
      { x: 63, y: 16, toIsland: "ile-baratie", toX: 3, toY: 16, lockedBy: "boss_ile-syrup" },
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
    tavern: { x: 12, y: 23 },
    buildings: [{ x: 12, y: 23, key: "taverne" }],
    recruitNpcs: [{ x: 31, y: 13, characterId: "cuisinier", level: 32 }],
    npcs: [
      { id: "baratie-chef", x: 17, y: 12, name: "Chef du Baratie", dialogue: ["Bienvenue au Baratie ! Ici, on sert les pirates comme les Marines.", "Un cuisinier hors pair cherche un équipage capable de tenir la mer."] },
      { id: "baratie-marin", x: 48, y: 22, name: "Marine", dialogue: ["Des pirates rivaux se battent encore près du restaurant.", "Ne reste pas sur le quai quand les Marines arrivent."] },
    ],
    chests: [
      { id: "baratie-chest-1", x: 21, y: 8, itemId: "potion", amount: 4 },
      { id: "baratie-chest-2", x: 43, y: 8, itemId: "superPotion", amount: 2 },
    ],
    boss: {
      id: "baratie-amiral", x: 56, y: 15, enemyId: "officierMarine", level: 36,
      name: "Officier du Baratie", unlockFlag: "boss_ile-baratie", respawnMinutes: 15,
      team: [
        { characterId: "pirateRival", level: 28 },
        { characterId: "officierMarine", level: 32 },
        { characterId: "officierMarine", level: 36, isBoss: true },
      ],
    },
    wildZones: [
      { x1: 8, y1: 5, x2: 24, y2: 28, level: 10, encounterRate: 0.045, enemyPool: ["pirateRival", "marineRecrue"] },
      { x1: 26, y1: 5, x2: 44, y2: 28, level: 11, encounterRate: 0.05, enemyPool: ["pirateRival", "officierMarine"] },
      { x1: 46, y1: 5, x2: 60, y2: 28, level: 12, encounterRate: 0.055, enemyPool: ["officierMarine", "pirateRival"] },
    ],
    warps: [
      { x: 2, y: 16, toIsland: "ile-syrup", toX: 61, toY: 16 },
      { x: 63, y: 16, toIsland: "ile-drum", toX: 3, toY: 16, lockedBy: "boss_ile-baratie" },
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
