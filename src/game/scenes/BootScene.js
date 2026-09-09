import Phaser from "phaser";
import { TILE_SIZE } from "@/game/data/islands";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    this.load.image("tile-floor", "/tiles/floor.png");
    this.load.image("tile-wall", "/tiles/wall.png");
    this.load.image("tile-path", "/tiles/path.png");
    this.load.image("tile-wild", "/tiles/wild.png");
  }

  create() {
    this.makeWarpMarker();
    this.makeTokenTexture();

    this.scene.start("World");
  }

  makeWarpMarker() {
    const g = this.add.graphics();
    g.fillStyle(0xd4a24c, 1);
    g.fillCircle(TILE_SIZE / 2, TILE_SIZE / 2, 6);
    g.generateTexture("warp-marker", TILE_SIZE, TILE_SIZE);
    g.destroy();
  }

  makeTokenTexture() {
    // Jeton générique blanc — sera teinté (tint) selon le personnage
    const size = 28;
    const g = this.add.graphics();
    g.fillStyle(0xffffff, 1);
    g.fillCircle(size / 2, size / 2, size / 2 - 2);
    g.lineStyle(2, 0x1c1c1c, 1);
    g.strokeCircle(size / 2, size / 2, size / 2 - 2);
    g.generateTexture("token", size, size);
    g.destroy();
  }
}
