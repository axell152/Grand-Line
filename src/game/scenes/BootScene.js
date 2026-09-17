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

    // Personnages classiques
    // La majorité utilise 10 frames de 16x16.
    // Zoro et Nami utilisent des spritesheets 10 frames de 64x64.
    SPRITES.forEach((key) => {
      const frameSize =
        key === "character_03" || key === "character_04"
          ? 64
          : 16;

      this.load.spritesheet(
        key,
        `/sprites/${key}.png`,
        {
          frameWidth: frameSize,
          frameHeight: frameSize,
          endFrame: 9,
        }
      );
    });

    // Hommes-poissons de Cocoyasi
    // Ce sont des images statiques : une seule image, pas une spritesheet.
    FISHMAN_SPRITES.forEach((key) => {
      this.load.image(
        key,
        `/sprites/${key}.png`
      );
    });

    // Arlong est également un personnage statique.
    this.load.image(
      "arlong",
      "/sprites/arlong.png"
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
    // Organisation des sprites :
    // 0 = face / bas statique
    // 1 = dos / haut statique
    // 2 = côté statique
    // 3 = inutilisé
    // 4-5 = marche bas
    // 6-7 = marche haut
    // 8-9 = marche côté

    SPRITES.forEach((key) => {
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
    });
  }
}
