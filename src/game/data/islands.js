// Légende de tuiles : '.' = sol (marchable), '#' = obstacle (arbre/rocher/eau)
// Chaque ligne de `grid` doit faire la même longueur.

export const TILE_SIZE = 32;

export const ISLANDS = {
  "ile-depart": {
    name: "Île de Cocorico",
    grid: [
      "############",
      "#..........#",
      "#..#....#..#",
      "#..#....#..#",
      "#....PP.....",
      "#....PP....#",
      "#..#....#..#",
      "#..........#",
      "############",
    ],
    playerStart: { x: 5, y: 4 },
    // PNJ à combattre puis recruter
    recruitNpcs: [{ x: 2, y: 2, characterId: "bretteur" }],
    // zone (rectangle en coordonnées de tuiles) où des combats aléatoires peuvent survenir
    wildZones: [{ x1: 1, y1: 1, x2: 10, y2: 7 }],
    wildEncounterRate: 0.02,
    // passages vers d'autres îles : marcher sur cette tuile déclenche le voyage
    warps: [{ x: 11, y: 4, toIsland: "ile-brume", toX: 1, toY: 4 }],
  },

  "ile-brume": {
    name: "Île de la Brume",
    grid: [
      "################",
      "#..............#",
      "#..#........#..#",
      "#..#..####..#..#",
      "................",
      "#..#..####..#..#",
      "#..#........#..#",
      "#..............#",
      "################",
    ],
    playerStart: { x: 1, y: 4 },
    recruitNpcs: [
      { x: 7, y: 2, characterId: "navigatrice" },
      { x: 8, y: 6, characterId: "tireur" },
    ],
    wildZones: [{ x1: 1, y1: 1, x2: 14, y2: 7 }],
    wildEncounterRate: 0.03,
    warps: [
      { x: 0, y: 4, toIsland: "ile-depart", toX: 10, toY: 4 },
      { x: 15, y: 4, toIsland: "ile-hiver", toX: 1, toY: 4 },
    ],
  },

  "ile-hiver": {
    name: "Île d'Hiver",
    grid: [
      "################",
      "#..............#",
      "#..####....##..#",
      "#..............#",
      "................",
      "#..............#",
      "#..##....####..#",
      "#..............#",
      "################",
    ],
    playerStart: { x: 1, y: 4 },
    recruitNpcs: [
      { x: 6, y: 3, characterId: "medecin" },
      { x: 13, y: 6, characterId: "cuisinier" },
    ],
    wildZones: [{ x1: 1, y1: 1, x2: 14, y2: 7 }],
    wildEncounterRate: 0.03,
    warps: [{ x: 0, y: 4, toIsland: "ile-brume", toX: 14, toY: 4 }],
  },
};

export const STARTING_ISLAND = "ile-depart";
