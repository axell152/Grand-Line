import Phaser from "phaser";
import { ISLANDS } from "@/game/data/islands";

export default class SailingScene extends Phaser.Scene {
  constructor() {
    super("Sailing");
  }

  init(data) {
    this.sailingData = data || {};
  }

  create() {
    const d = this.sailingData;
    this.fromIsland = ISLANDS[d.fromIsland];
    this.toIsland = ISLANDS[d.toIsland];
    this.toIslandId = d.toIsland;
    this.toX = d.toX;
    this.toY = d.toY;
    this.elapsed = 0;
    this.duration = 5000;
    this.finished = false;

    this.drawSea();
    this.drawBoat();

    const fromName = this.fromIsland?.name || "Île inconnue";
    const toName = this.toIsland?.name || "Île inconnue";

    this.add.text(512, 95, "VOYAGE EN MER", {
      fontFamily: "monospace",
      fontSize: "34px",
      fontStyle: "bold",
      color: "#f1c40f",
    }).setOrigin(0.5);

    this.add.text(512, 145, `${fromName}  →  ${toName}`, {
      fontFamily: "monospace",
      fontSize: "20px",
      color: "#ffffff",
    }).setOrigin(0.5);

    this.progressBg = this.add.rectangle(512, 650, 620, 22, 0x071522, 1)
      .setStrokeStyle(2, 0xe8c96b);
    this.progress = this.add.rectangle(202, 650, 0, 14, 0x2ecc71, 1)
      .setOrigin(0, 0.5);

    this.timerText = this.add.text(512, 690, "5.0 s", {
      fontFamily: "monospace",
      fontSize: "16px",
      color: "#ead9b8",
    }).setOrigin(0.5);
  }

  drawSea() {
    const g = this.add.graphics();
    g.fillGradientStyle(0x0b3d63, 0x0b3d63, 0x08243d, 0x08243d, 1);
    g.fillRect(0, 0, 1024, 768);

    for (let i = 0; i < 18; i++) {
      const y = 190 + i * 30;
      g.lineStyle(2, 0x4aa3c7, 0.35);
      for (let x = -50; x < 1100; x += 90) {
        g.beginPath();
        g.moveTo(x, y);
        g.lineTo(x + 45, y);
        g.strokePath();
      }
    }

    this.add.circle(850, 105, 55, 0xf1c40f, 0.8);
  }

  drawBoat() {
    this.boat = this.add.container(-180, 405);

    const g = this.add.graphics();
    g.fillStyle(0x5b321f, 1);
    g.beginPath();
    g.moveTo(-85, 20);
    g.lineTo(80, 20);
    g.lineTo(45, 65);
    g.lineTo(-55, 65);
    g.closePath();
    g.fillPath();
    g.lineStyle(4, 0x2b1710, 1);
    g.strokePath();

    g.fillStyle(0xe8c96b, 1);
    g.fillTriangle(-8, -105, -8, 15, 72, 15);
    g.fillStyle(0xf4e7c2, 1);
    g.fillTriangle(-2, -95, -2, 5, 58, 5);
    g.lineStyle(5, 0x2b1710, 1);
    g.lineBetween(-8, -112, -8, 30);

    g.fillStyle(0x0b2545, 1);
    g.fillCircle(-45, 5, 18);
    g.fillCircle(5, 5, 18);
    g.fillCircle(55, 5, 18);

    const flag = this.add.graphics();
    flag.fillStyle(0x101010, 1);
    flag.fillRect(-4, -130, 38, 25);
    flag.fillStyle(0xffffff, 1);
    flag.fillCircle(15, -117, 7);

    this.boat.add([g, flag]);

    this.tweens.add({
      targets: this.boat,
      x: 1200,
      y: 385,
      duration: this.duration,
      ease: "Sine.inOut",
    });

    this.tweens.add({
      targets: this.boat,
      angle: 2.5,
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut",
    });
  }

  update(_time, delta) {
    if (this.finished) return;

    this.elapsed += delta;
    const ratio = Math.min(1, this.elapsed / this.duration);
    this.progress.width = 616 * ratio;
    this.timerText.setText(`${Math.max(0, (this.duration - this.elapsed) / 1000).toFixed(1)} s`);

    if (ratio >= 1) {
      this.finished = true;
      this.scene.start("World", {
        islandId: this.toIslandId,
        x: this.toX,
        y: this.toY,
      });
    }
  }
}
