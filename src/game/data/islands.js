export const TILE_SIZE = 32;

export const ISLANDS = {
  "ile-depart": {
    name: "Shells Town",
    // Shells Town est volontairement très ouverte : presque toute la surface
    // accessible est de la terre. Les seuls vrais murs sont ceux de la prison.
    // Terrain visuel ET structurel : on modèle l'île ici, case par case.
    // t = terre, c = chemin, p = sol intérieur, w = mur, b = entrée de prison,
    // d = quai, s = mer.
    // Les zones sauvages ne modifient jamais ce terrain.
    terrain: [
      "ssssssssssssssssssssssssssssssssssssssssssssssss",
      "ssssssssssssssssssssssssssssssssssssssssssssssss",
      "ssttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttss",
      "sstttttttttttttttttttttttttttttttttwwwwwwwwwwtss",
      "sstttttttttttttttttttttttttttttttttwppppppppwtss",
      "sstttttttttttttttttttttttttttttttttwppppppppwtss",
      "sstttttttttttttttttttttttttttttttttwppppppppwtss",
      "sstttttttttttttttttttttttttttttttttwppppppppwtss",
      "sstttttttttttttttttttttttttttttttttwppppppppwtss",
      "sstttttttttttttttttttttttttttttttttwppppppppwtss",
      "sstttttttttttttttttttttttttttttttttwppppppppwtss",
      "sstttttttttttttttttttttttttttttttttwppppppppwtss",
      "sstttttttttttttttttttttttttttttttttwppppppppwtss",
      "sstttttttttttttttttttttttttttttttttwwwwbwwwwwtss",
      "sstttttttttttttttttttttttttttttttttttttcttttttss",
      "sstttttttttttttttttttttttttttttttttttttcttttttss",
      "sstttttttttttttttttttttttttttttttttttttcttttttss",
      "sstttttttttttttttttttttttttttttttttttttcttttttss",
      "sstttttttttttttttttttttttttttttttttttttcttttttss",
      "sstcccccccccccccccccccccccccccccccccccccttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttss",
      "ssttttttttttttttttttttttttttttttttttttttttttttss",
      "dddddddddddddddddddddddsssssssssssssssssssssssss",
      "dddddddddddddddddddddddsssssssssssssssssssssssss",
      "ssssssssssssssssssssssssssssssssssssssssssssssss",
      "ssssssssssssssssssssssssssssssssssssssssssssssss",
    ],

    playerStart: { x: 5, y: 25 },
    tavern: { x: 8, y: 23 },
    buildings: [
      { x: 8, y: 23, key: "taverne" }
    ],
    recruitNpcs: [
      // Zoro est visible dans la prison dès le début. Morgan bloque l'entrée.
      { x: 39, y: 13, characterId: "bretteur", level: 10 },
    ],
    npcs: [
      {
        id: "citoyen-shells",
        x: 15,
        y: 23,
        name: "Habitant de Shells Town",
        dialogue: [
          "La Marine contrôle toute la ville.",
          "Un chasseur de pirates est retenu prisonnier dans la base.",
        ],
      },
      {
        id: "marin-shells",
        x: 41,
        y: 21,
        name: "Marine",
        dialogue: [
          "Circulez ! La base de la Marine est interdite aux civils.",
          "Le Colonel Morgan ne tolère aucune intrusion.",
        ],
      },
      {
        id: "prisonnier-shells",
        x: 18,
        y: 23,
        name: "Prisonnier",
        dialogue: [
          "Le sabreur enfermé dans la prison s'appelle Roronoa Zoro.",
          "Si tu veux l'approcher, commence par vaincre la Marine.",
        ],
      },
      {
        id: "gardien-port-shells",
        x: 8,
        y: 29,
        name: "Garde du port",
        dialogue: [
          "Le départ vers Cocoyasi Village est interdit pour le moment.",
          "Bats le Colonel Morgan et la route sera ouverte.",
        ],
      },
    ],
    chests: [
      { id: "shells-chest-1", x: 38, y: 10, itemId: "potion", amount: 2 },
      { id: "shells-chest-2", x: 40, y: 10, itemId: "potion", amount: 2 },
      { id: "shells-chest-3", x: 42, y: 10, itemId: "superPotion", amount: 1 },
    ],
    boss: {
      id: "morgan",
      x: 39,
      y: 18,
      enemyId: "officierMarine",
      level: 8,
      name: "Colonel Morgan",
      unlockFlag: "boss_ile-depart",
      respawnMinutes: 15,
      team: [
        { characterId: "marineRecrue", level: 4 },
        { characterId: "marineRecrue", level: 5 },
        { characterId: "officierMarine", level: 8, isBoss: true },
      ],
    },
    // Zone sauvage discrète : aucun revêtement spécial n'est affiché.
    // Les rencontres sont concentrées dans la moitié est, autour de la prison.
    wildZones: [
      { x1: 20, y1: 4, x2: 44, y2: 7, level: 1, encounterRate: 0.045, enemyPool: ["marineRecrue"] },
      { x1: 20, y1: 8, x2: 34, y2: 18, level: 1, encounterRate: 0.05, enemyPool: ["marineRecrue"] },
      { x1: 45, y1: 8, x2: 45, y2: 18, level: 2, encounterRate: 0.05, enemyPool: ["marineRecrue", "officierMarine"] },
      { x1: 20, y1: 19, x2: 44, y2: 28, level: 2, encounterRate: 0.055, enemyPool: ["marineRecrue", "officierMarine"] },
    ],
    warps: [
      { x: 1, y: 3, toIsland: "ile-brume", toX: 3, toY: 16, lockedBy: "boss_ile-depart" },
    ],
  },

  "ile-brume": {
    name: "Île de la Brume",
    terrain: [

      "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",

      "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",

      "wwttttttttttwwwwwtttttttttttttttttttttwwwwwtttttttttttttttttttww",

      "wwttttttttttwwwwwtttttttttttttwwwwttttwwwwwtttttttttttttttttttww",

      "wwtttttwwwwwwwwwwtttttttttttttwwwwttttttttttttttwwwwwttttwwwwtww",

      "wwwwwttwwwwwtttttttttttwwwwtttwwwwttttttttttttwwwwwwwtttwwwwwtww",

      "wwwwwttwwwwwtttttttttttwwwwtttttttttttttttttttwwwwwwwtwwwwwwwtww",

      "wwtttttttttttttttttttttttttttttttttttttttttttttttttwwtwwwwwwwtww",

      "wwtwwwwwwwwwttttttttttttttttwwwwttttttttwwwtttttwwwwwttwwwwwwtww",

      "wwtwwwwwwtttttttttttttttttttwwwwttttttttwwwttttttttttttwwwwwttww",

      "wwttttttttttttttwwwwttttttttwwwwttttttttwwwtttwwwtttttwwwtttttww",

      "wwttttttttttttttwwwwtttttttwwwwwtttttttwwwwwttwwwtttttwwwtttttww",

      "wwtttwwwtttttwwwwwtttttttttwwwwttttttttwwwwwttwwwtttttwwwtttttww",

      "wwtttwwwtttttwwwwwtttttttttwwwwtttttttwwwwwwttwwwtttttwwwtttttww",

      "wwtttwwwtttttwwwwwwwttttttttttttttttttwwwwwtttwwwtttttttttttttww",

      "wwtttwwwwwwwwwwwwwwwttttttttttttttttttwwwwwtttttttttttttttttttww",

      "wwtttwwwwwwwwtttttttttttttttttttttttttwwwtttttttttttttttttttttww",

      "wwttttttwwwwwtttttttttttttttttttttttttttttttttttttttttttttttttww",

      "wwttttttwwwwwtttttwwtttttttttttttttttttwwwttttttttttttttttttttww",

      "wwtttttttttttttwwwwwtttttttttttttttttttwwwttttttttttttttttttttww",

      "wwtttttttttttttwwwwwtwwwwwttttttttttttttttttttttttttttttttttttww",

      "wwtwwwttttttttttttwwtwwwwwttttttttttttttttttttttttttttttttttttww",

      "wwtwwwttttttttttttwwttttttttttttttttttttttttttttttttttttttttttww",

      "wwtwwwtttttttttttttttttttttwwwwtttttttttttttttttttttttttttttttww",

      "wwtttttttttttttttttttttttttwwwttttttttttttttttttttttttttttttttww",

      "wwtttttttwwwwwtttttttttttttwwwwtttttttttttttttttttttttttttttttww",

      "wwtttttttwwwwwtwwttwwwtttttwwwwtttttttttttttttttttttwwttttttttww",

      "wwtttttttwwwwwtwwttwwwtttttwwwwtttttttttttttttttttttwwwwwwttttww",

      "wwtttttttwwwwwtwwtttttttttttttttttttttttttttttttttttwwwwwwttttww",

      "wwttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttww",

      "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",

      "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",

    ],
    playerStart: { x: 3, y: 16 },
    recruitNpcs: [
      { x: 12, y: 8, characterId: "navigatrice" },
      { x: 30, y: 24, characterId: "tireur" },
      { x: 50, y: 7, characterId: "musicien" },
    ],
    npcs: [
      {
        id: "guide-brume",
        x: 22,
        y: 4,
        name: "Guide de la Brume",
        dialogue: [
          "La brume cache de nombreux dangers.",
          "Plus tu avances vers l'est, plus les ennemis deviennent puissants.",
        ],
      },
      {
        id: "marin-brume",
        x: 43,
        y: 28,
        name: "Marin blessé",
        dialogue: [
          "Le chef de la Marine contrôle la sortie de l'île.",
          "Trouve-le à l'est et bats-le pour poursuivre ton voyage.",
        ],
      },
    ],
    chests: [
      { id: "brume-chest-1", x: 21, y: 17, itemId: "potion", amount: 2 },
      { id: "brume-chest-2", x: 56, y: 26, itemId: "superPotion", amount: 2 },
    ],
    boss: {
      id: "brume",
      x: 56,
      y: 25,
      enemyId: "officierMarine",
      level: 40,
      name: "Commandant Brume",
      unlockFlag: "boss_ile-brume",
      respawnMinutes: 15,
      team: [
        { characterId: "pirateRival", level: 30 },
        { characterId: "chasseurDePrimes", level: 35 },
        { characterId: "officierMarine", level: 40, isBoss: true },
      ],
    },
    wildZones: [
      { x1: 4, y1: 6, x2: 20, y2: 26, level: 1, encounterRate: 0.035, enemyPool: ["marineRecrue", "pirateRival"] },
      { x1: 22, y1: 4, x2: 42, y2: 28, level: 2, encounterRate: 0.045, enemyPool: ["marineRecrue", "pirateRival", "chasseurDePrimes"] },
      { x1: 44, y1: 4, x2: 61, y2: 28, level: 3, encounterRate: 0.05, enemyPool: ["chasseurDePrimes", "officierMarine"] },
    ],
    warps: [
      { x: 2, y: 16, toIsland: "ile-depart", toX: 44, toY: 16 },
      { x: 61, y: 16, toIsland: "ile-hiver", toX: 3, toY: 16, lockedBy: "boss_ile-brume" },
    ],
  },

  "ile-hiver": {
    name: "Île d'Hiver",
    terrain: [

      "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",

      "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",

      "wwttwwwtttttttttttttttwwwtttttttttttttttttttttttttttttttttttttww",

      "wwwwwwwtttttttttttttttwwwttttttttttttttttttttttttttttttttwwwttww",

      "wwwwwwwttttwwttwwwwtttwwwttttttttwwwwwttttttttwwwwwttttttwwwttww",

      "wwwwwwwttttwwwwwwwwtttwwwttttttttwwwwwtttttttwwwwwwtttttttttttww",

      "wwwwwwwtttttwwwwwwwttttttttttttttwwwwwtttttttwwwwwttttttwwwwttww",

      "wwtttttttttttttwwwwttttttttttttttwwwwwtttttttwwwwwttttttwwwwttww",

      "wwttttttttttwwwwttttttttwwwwwtttttttttttttttttttttttttttttttttww",

      "wwttttttttttttwwttttttttwwwwwtttttttttttttttwwwwttttttttttttttww",

      "wwttttttttttttttttttttttwwwwwtttttttttttttttwwwwttttttwwwtttttww",

      "wwttttttttttttttttttttttwwwwwwwwwwtttttttwwwttttttttttwwwtttttww",

      "wwttttttttttttttttttttttttttwwwwwwtttttttwwwwwwtwwttttwwwtttttww",

      "wwttttttttttttttttttttttttttwwwwwwtttttttwwwwwwwwwttttttttttttww",

      "wwttttttttttttttttttttttttwwwwwwwwtttwwwwwwwwwwwwwttttttttttttww",

      "wwtttttttttttttttttwwwwtttwwttwwwwtttwwwwttwwwwwwwtttttwwwttttww",

      "wwtttttttttttttttttwwwwtttwwtttttttttwwwwttwwwwwwwtttttwwwttttww",

      "wwttttttttttttttwwtwwwwtttwwtttttttttwwwwttttttttttttttwwwttttww",

      "wwttttttttttttttwwtwwwwtttwwtttttttttttttttttttttttttttwwwttttww",

      "wwtttttttttttttttttwwwwwwwwttttttttttttwwwwwttttttttttttttttttww",

      "wwttttttttttttttttttttwwwwwttttttttttttwwwwwttttttttttttwwttttww",

      "wwttttttttttttttttttttwwwwwttttwwwwwwttwwwwwwwwwwwwwwwttwwttttww",

      "wwttttttttttttttttttttwwwwwttttwwwwwwttwwwwwwwwwwwwwwwttwwwtttww",

      "wwttttwwwttttttttttttttttttttttwwwwwwttttttwwwwwwwwtttttwwwtttww",

      "wwttttwwwttttttttttttttttttttttwwwwwwtttttttttttwwtttttttwwtttww",

      "wwtttttttttttttttttttttttttttttwwwtwwtttttttttttwwwttttttwwtttww",

      "wwtttttttttttttttttttttttttttttttttwwtttttttttttttttttttttttttww",

      "wwtttttttttttttttttttttttttttttttttwwtttttttttttttttttttttttttww",

      "wwtttttwwwwwttttttttttttttttttttttttttttttttttttttttttttttttttww",

      "wwtttttwwwwwttttttttttttttttttttttttttttttttttttttttttttttttttww",

      "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",

      "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",

    ],
    playerStart: { x: 3, y: 16 },
    recruitNpcs: [
      { x: 14, y: 7, characterId: "medecin" },
      { x: 50, y: 24, characterId: "cuisinier" },
      { x: 32, y: 26, characterId: "archeologue" },
    ],
    npcs: [
      {
        id: "ermite-hiver",
        x: 27,
        y: 4,
        name: "Ermite des neiges",
        dialogue: [
          "Bienvenue sur l'Île d'Hiver.",
          "Ici, seuls les pirates les plus solides atteignent le sommet.",
        ],
      },
    ],
    chests: [
      { id: "hiver-chest-1", x: 23, y: 26, itemId: "superPotion", amount: 2 },
      { id: "hiver-chest-2", x: 55, y: 25, itemId: "potion", amount: 3 },
    ],
    boss: {
      id: "amiral-glaces",
      x: 56,
      y: 26,
      enemyId: "officierMarine",
      level: 80,
      name: "Amiral des Glaces",
      unlockFlag: "boss_ile-hiver",
      respawnMinutes: 15,
      team: [
        { characterId: "officierMarine", level: 65 },
        { characterId: "chasseurDePrimes", level: 70 },
        { characterId: "officierMarine", level: 80, isBoss: true },
      ],
    },
    wildZones: [
      { x1: 4, y1: 4, x2: 22, y2: 28, level: 2, encounterRate: 0.04, enemyPool: ["marineRecrue", "pirateRival", "chasseurDePrimes"] },
      { x1: 24, y1: 4, x2: 44, y2: 28, level: 3, encounterRate: 0.05, enemyPool: ["chasseurDePrimes", "officierMarine"] },
      { x1: 46, y1: 4, x2: 61, y2: 28, level: 4, encounterRate: 0.055, enemyPool: ["officierMarine", "chasseurDePrimes"] },
    ],
    warps: [{ x: 2, y: 16, toIsland: "ile-brume", toX: 60, toY: 16 }],
  },
};

export const STARTING_ISLAND = "ile-depart";