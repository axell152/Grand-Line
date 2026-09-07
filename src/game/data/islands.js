// Légende de tuiles : '.' = sol (marchable), '#' = obstacle (arbre/rocher/eau)
// Chaque ligne de `grid` doit faire la même longueur.
//
// Îles agrandies (x2 en largeur et en hauteur) par rapport à la version
// initiale : même taille de tuile (TILE_SIZE = 32px, inchangée), mais
// beaucoup plus de cases à parcourir sur chaque île.

export const TILE_SIZE = 32;

export const ISLANDS = {
  "ile-depart": {
    name: "Île de Cocorico",
    grid: [
      "########################",
      "########################",
      "##....................##",
      "##....................##",
      "##....##........##....##",
      "##....##........##....##",
      "##....##........##....##",
      "##....##........##....##",
      "##........PPPP..........",
      "##........PPPP..........",
      "##........PPPP........##",
      "##........PPPP........##",
      "##....##........##....##",
      "##....##........##....##",
      "##....................##",
      "##....................##",
      "########################",
      "########################",
    ],
    playerStart: { x: 10, y: 8 },
    // PNJ à combattre puis recruter
    recruitNpcs: [{ x: 4, y: 4, characterId: "bretteur" }],
    // zone (rectangle en coordonnées de tuiles) où des combats aléatoires peuvent survenir
    wildZones: [{ x1: 2, y1: 2, x2: 21, y2: 15 }],
    wildEncounterRate: 0.02,
    // passages vers d'autres îles : marcher sur cette tuile déclenche le voyage
    warps: [{ x: 22, y: 8, toIsland: "ile-brume", toX: 2, toY: 8 }],
  },

  "ile-brume": {
    name: "Île de la Brume",
    grid: [
      "################################",
      "################################",
      "##............................##",
      "##............................##",
      "##....##................##....##",
      "##....##................##....##",
      "##....##....########....##....##",
      "##....##....########....##....##",
      "................................",
      "................................",
      "##....##....########....##....##",
      "##....##....########....##....##",
      "##....##................##....##",
      "##....##................##....##",
      "##............................##",
      "##............................##",
      "################################",
      "################################",
    ],
    playerStart: { x: 2, y: 8 },
    recruitNpcs: [
      { x: 14, y: 4, characterId: "navigatrice" },
      { x: 16, y: 12, characterId: "tireur" },
    ],
    wildZones: [{ x1: 2, y1: 2, x2: 29, y2: 15 }],
    wildEncounterRate: 0.03,
    warps: [
      { x: 0, y: 8, toIsland: "ile-depart", toX: 20, toY: 8 },
      { x: 30, y: 8, toIsland: "ile-hiver", toX: 2, toY: 8 },
    ],
  },

  "ile-hiver": {
    name: "Île d'Hiver",
    grid: [
      "################################",
      "################################",
      "##............................##",
      "##............................##",
      "##....########........####....##",
      "##....########........####....##",
      "##............................##",
      "##............................##",
      "................................",
      "................................",
      "##............................##",
      "##............................##",
      "##....####........########....##",
      "##....####........########....##",
      "##............................##",
      "##............................##",
      "################################",
      "################################",
    ],
    playerStart: { x: 2, y: 8 },
    recruitNpcs: [
      { x: 12, y: 6, characterId: "medecin" },
      { x: 26, y: 12, characterId: "cuisinier" },
    ],
    wildZones: [{ x1: 2, y1: 2, x2: 29, y2: 15 }],
    wildEncounterRate: 0.03,
    warps: [{ x: 0, y: 8, toIsland: "ile-brume", toX: 28, toY: 8 }],
  },
};

export const STARTING_ISLAND = "ile-depart";
