import Phaser from "phaser";
import { TILE_SIZE } from "@/game/data/islands";

const SPRITES = [
  "character_01", "character_02", "character_03", "character_04",
  "character_05", "character_06", "character_07", "character_08",
  "character_09", "character_10", "character_11", "character_12",
  "character_13", "character_14",
];

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    this.load.image("tile-floor", "/tiles/floor.png");
    this.load.image("tile-wall", "/tiles/wall.png");
    this.load.image("tile-path", "/tiles/path.png");
    this.load.image("tile-wild", "/tiles/wild.png");

    // Tiles spécifiques à Shells Town.
    this.load.image("tile-village-floor", "/tiles/custom/village_floor.png");
    this.load.image("tile-village-path", "/tiles/custom/village_path.png");
    this.load.image("tile-military-floor", "/tiles/custom/military_floor.png");
    this.load.image("tile-marine-wall", "/tiles/custom/marine_wall.png");
    this.load.image("tile-prison-wall", "/tiles/custom/prison_wall.png");
    this.load.image("tile-prison-bars", "/tiles/custom/prison_bars.png");
    this.load.image("tile-sea", "/tiles/custom/sea.png");
    this.load.image("tile-dock", "/tiles/custom/dock.png");

    // La majorité des personnages utilisent 10 frames de 16x16.
    // Le bretteur utilise une spritesheet plus détaillée en 10 frames de 64x64.
    SPRITES.forEach((key) => {
      const frameSize = key === "character_03" ? 64 : 16;
      this.load.spritesheet(key, `/sprites/${key}.png`, {
        frameWidth: frameSize,
        frameHeight: frameSize,
        endFrame: 9,
      });
    });
  }

  create() {
    this.makeWarpMarker();
    this.createCharacterAnimations();
    this.scene.start("Title");
  }

  makeWarpMarker() {
    const g = this.add.graphics();
    g.fillStyle(0xd4a24c, 1);
    g.fillCircle(TILE_SIZE / 2, TILE_SIZE / 2, 6);
    g.generateTexture("warp-marker", TILE_SIZE, TILE_SIZE);
    g.destroy();
  }

  createCharacterAnimations() {
    // Organisation utilisée par les sprites fournis :
    // 0-2 = bas, 3-5 = haut, 6-7 = gauche, 8-9 = droite.
    SPRITES.forEach((key) => {
      const animations = [
  { suffix: "down", frames: [4, 5] },
  { suffix: "up", frames: [6, 7] },
  { suffix: "side", frames: [8, 9] },
];

      animations.forEach(({ suffix, frames }) => {
        this.anims.create({
          key: `${key}-${suffix}`,
          frames: frames.map((frame) => ({ key, frame })),
          frameRate: 8,
          repeat: -1,
        });
      });
    });
  }
}
