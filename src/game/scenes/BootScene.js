import Phaser from "phaser";
import { TILE_SIZE } from "@/game/data/islands";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  create() {
    this.makeTileTexture("tile-floor", 0x2f6b3a, 0x255530);
    this.makeTileTexture("tile-wall", 0x1d3b22, 0x14290f);
    this.makeTileTexture("tile-path", 0xcbb073, 0xb59a5c);

    this.makeWarpMarker();
    this.makeTokenTexture();

    this.scene.start("World");
  }

  makeTileTexture(key, base, edge) {
    const g = this.add.graphics();
    g.fillStyle(base, 1);
    g.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
    g.lineStyle(2, edge, 1);
    g.strokeRect(1, 1, TILE_SIZE - 2, TILE_SIZE - 2);
    g.generateTexture(key, TILE_SIZE, TILE_SIZE);
    g.destroy();
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
