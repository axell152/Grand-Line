import Phaser from "phaser";
import { TILE_SIZE } from "@/game/data/islands";

const SPRITES = [
  "character_01", "character_02", "character_03", "character_04",
  "character_05", "character_06", "character_07", "character_08",
  "character_09", "character_10", "character_11", "character_12",
  "character_13", "character_14",
];

const FISHMAN_SPRITES = [
  "fishman_pirate",
  "fishman_lancer",
  "fishman_swordsman",
  "fishman_brute",
  "fishman_bounty_hunter",
  "fishman_captain",
];

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    // Tiles classiques
    this.load.image("tile-floor", "/tiles/floor.png");
    this.load.image("tile-wall", "/tiles/wall.png");
    this.load.image("tile-path", "/tiles/path.png");
    this.load.image("tile-wild", "/tiles/wild.png");
    this.load.image("forest_tree", "/tiles/forest_tree.png");

    // Tiles personnalisés.
    // Chaque image est un atlas 8x8 de cases 32x32.
    const customTiles = [
      // Shells Town
      "village-floor",
      "village-path",
      "military-floor",
      "marine-wall",
      "prison-wall",
      "prison-bars",
      "sea",
      "dock",

      // Cocoyasi
      "cocoyasi-ground",
      "cocoyasi-rubble",
      "cocoyasi-vegetation",
      "cocoyasi-ruins",
    ];

    customTiles.forEach((key) => {
      this.load.spritesheet(
        `tile-${key}`,
        `/tiles/custom/${key}.png`,
        {
          frameWidth: 32,
          frameHeight: 32,
        }
      );
    });

// ===============================
// PERSONNAGES PNJ
// ===============================

// Les character_XX restent les sprites des PNJ.
// 10 frames de 16x16.
SPRITES.forEach((key) => {
  this.load.spritesheet(
    key,
    `/sprites/${key}.png`,
    {
      frameWidth: 16,
      frameHeight: 16,
      endFrame: 9,
    }
  );
});

// ===============================
// PERSONNAGES PRINCIPAUX
// ===============================

// Luffy, Zoro, Nami, Usopp et Sanji sont des spritesheets de 10 frames en 64x64.
// Ce sont les visuels utilisés une fois un personnage recruté (combat, équipage).
// Sur la carte, avant recrutement, ces mêmes personnages apparaissent en PNJ
// génériques (character_XX) — voir CHARACTER_SPRITES dans WorldScene.js.
const MAIN_CHARACTER_SPRITES = [
  {
    key: "luffy",
    file: "luffy.PNG",
  },
  {
    key: "zoro",
    file: "zoro.png",
  },
  {
    key: "nami",
    file: "nami.png",
  },
  {
    key: "usopp",
    file: "usopp.PNG",
  },
  {
    key: "sanji",
    file: "sanji.PNG",
  },
];

MAIN_CHARACTER_SPRITES.forEach(({ key, file }) => {
  this.load.spritesheet(
    key,
    `/sprites/${file}`,
    {
      frameWidth: 64,
      frameHeight: 64,
      endFrame: 9,
    }
  );
});

// ===============================
// MARINES
// ===============================

this.load.image("marine_recrue", "/sprites/marine_recrue.png");
this.load.image("marine_fusilier", "/sprites/marine_fusilier.png");

// ===============================
// BARATIE — ILLUSTRATIONS 1024x1024
// Chargées dans Boot pour être disponibles avant WorldScene/BattleScene.
// Elles restent en haute résolution et sont seulement réduites à l’affichage.
// ===============================
const BARATIE_SPRITES = {
  baratie_zeff: "zeff.png",
  baratie_patty: "patty.png",
  baratie_carne: "carne.png",
  baratie_cook: "baratie_cook.png",
  baratie_johnny: "johnny.png",
  baratie_yosaku: "yosaku.png",
  baratie_pirate: "pirate_don_krieg.png",
  baratie_krieg_pistolet: "pistolet_don_krieg.png",
  baratie_pearl: "pearl.png",
  baratie_gin: "gin.png",
  baratie_don_krieg: "don_krieg.png",
};

Object.entries(BARATIE_SPRITES).forEach(([key, file]) => {
  this.load.image(key, `/sprites/baratie/${file}`);
});
this.load.image("marine_officier", "/sprites/marine_officier.png");
    
// ===============================
// HOMMES-POISSONS
// ===============================

FISHMAN_SPRITES.forEach((key) => {
  this.load.image(
    key,
    `/sprites/${key}.png`
  );
});

// ===============================
// PIRATE CHAT NOIR - SYRUP VILLAGE
// ===============================

this.load.image("pirate_chat_noir_sabreur","/sprites/pirate_chat_noir_sabreur.png");
this.load.image("pirate_chat_noir_pistolet","/sprites/pirate_chat_noir_pistolet.png");
    
// ===============================
// BOSS
// ===============================

this.load.image("jango", "/sprites/jango.png");
this.load.image("sham_buchi", "/sprites/sham_buchi.png");
this.load.image("kuro", "/sprites/kuro.png");    
    
this.load.image(
  "arlong",
  "/sprites/arlong.png"
);

this.load.image(
  "colonel_morgan",
  "/sprites/colonel_morgan.png"
);
  }
  create() {
    this.makeWarpMarker();
    this.createCharacterAnimations();
    this.scene.start("Title");
  }

  makeWarpMarker() {
    const g = this.add.graphics();

    g.fillStyle(0xd4a24c, 1);
    g.fillCircle(
      TILE_SIZE / 2,
      TILE_SIZE / 2,
      6
    );

    g.generateTexture(
      "warp-marker",
      TILE_SIZE,
      TILE_SIZE
    );

    g.destroy();
  }

  createCharacterAnimations() {
  const createAnimationsForSprite = (key) => {
    const animations = [
      {
        suffix: "down",
        frames: [4, 5],
      },
      {
        suffix: "up",
        frames: [6, 7],
      },
      {
        suffix: "side",
        frames: [8, 9],
      },
    ];

    animations.forEach(({ suffix, frames }) => {
      this.anims.create({
        key: `${key}-${suffix}`,
        frames: frames.map((frame) => ({
          key,
          frame,
        })),
        frameRate: 8,
        repeat: -1,
      });
    });
  };

  // PNJ
  SPRITES.forEach((key) => {
    createAnimationsForSprite(key);
  });

  // Personnages principaux
  [
    "luffy",
    "zoro",
    "nami",
    "usopp",
    "sanji",
  ].forEach((key) => {
    createAnimationsForSprite(key);
  });
}
}
