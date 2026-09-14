import Phaser from "phaser";

export default class SailingScene extends Phaser.Scene {
  constructor() {
    super("Sailing");
  }

  init(data) {
    this.travelData = data || {};
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    this.drawOcean(width, height);
    this.createBoat(width, height);
    this.createInterface(width, height);
    this.createWaves(width, height);

    // Le voyage dure exactement 5 secondes.
    this.time.delayedCall(5000, () => {
      this.scene.start("World", {
        islandId: this.travelData.islandId,
        x: this.travelData.x,
        y: this.travelData.y,
      });
    });
  }

  drawOcean(width, height) {
    this.add.rectangle(0, 0, width, height, 0x0b5d7a).setOrigin(0);
    this.add.rectangle(0, 0, width, height * 0.52, 0x167fa0).setOrigin(0);

    // Petites lignes d'écume pour donner du mouvement à la mer.
    const foam = this.add.graphics();
    foam.lineStyle(2, 0x8ed8e8, 0.28);

    for (let y = 90; y < height; y += 70) {
      for (let x = (y % 140) - 80; x < width + 80; x += 170) {
        foam.beginPath();
        foam.moveTo(x, y);
        foam.lineTo(x + 45, y);
        foam.moveTo(x + 62, y);
        foam.lineTo(x + 95, y);
        foam.strokePath();
      }
    }
  }

  createBoat(width, height) {
    const boat = this.add.container(-180, height / 2 + 35);
    boat.setDepth(20);

    const shadow = this.add.ellipse(0, 55, 190, 30, 0x06384d, 0.35);
    const hull = this.add.graphics();
    hull.fillStyle(0x6e351d, 1);
    hull.beginPath();
    hull.moveTo(-105, 10);
    hull.lineTo(105, 10);
    hull.lineTo(70, 55);
    hull.lineTo(-65, 55);
    hull.closePath();
    hull.fillPath();
    hull.lineStyle(4, 0x3b1d12, 1);
    hull.strokePath();

    hull.fillStyle(0xd4a24c, 1);
    hull.fillRect(-82, 8, 164, 10);

    const mast = this.add.rectangle(0, -125, 8, 145, 0x4a2a18);
    const sail = this.add.graphics();
    sail.fillStyle(0xf4e7c5, 1);
    sail.beginPath();
    sail.moveTo(8, -118);
    sail.lineTo(82, -45);
    sail.lineTo(8, -45);
    sail.closePath();
    sail.fillPath();
    sail.lineStyle(3, 0x6b4a2a, 1);
    sail.strokePath();

    const flag = this.add.graphics();
    flag.fillStyle(0x151515, 1);
    flag.fillTriangle(4, -128, 45, -116, 4, -104);
    flag.fillStyle(0xd4a24c, 1);
    flag.fillCircle(16, -116, 4);

    const cabin = this.add.rectangle(-48, -2, 55, 32, 0x8d4c27)
      .setStrokeStyle(3, 0x3b1d12);
    const window = this.add.rectangle(-48, -3, 18, 14, 0x7fd0d8)
      .setStrokeStyle(2, 0x3b1d12);

    boat.add([shadow, hull, mast, sail, flag, cabin, window]);
    this.boat = boat;

    this.tweens.add({
      targets: boat,
      x: width + 180,
      duration: 5000,
      ease: "Sine.inOut",
    });

    this.tweens.add({
      targets: boat,
      y: height / 2 + 25,
      duration: 850,
      yoyo: true,
      repeat: 5,
      ease: "Sine.inOut",
    });
  }

  createWaves(width, height) {
    const waveGroup = this.add.group();

    for (let i = 0; i < 18; i++) {
      const wave = this.add.arc(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(80, height - 40),
        Phaser.Math.Between(10, 22),
        195,
        345,
        false,
        0xffffff,
        0
      );
      wave.setStrokeStyle(2, 0xc4f1f4, 0.35);
      wave.setDepth(10);
      waveGroup.add(wave);
    }

    this.tweens.add({
      targets: waveGroup.getChildren(),
      x: -45,
      duration: 1400,
      repeat: -1,
      ease: "Linear",
      onRepeat: () => {
        waveGroup.getChildren().forEach((wave) => {
          if (wave.x < -30) {
            wave.x = width + Phaser.Math.Between(0, 80);
            wave.y = Phaser.Math.Between(80, height - 40);
          }
        });
      },
    });
  }

  createInterface(width, height) {
    this.add.text(width / 2, 55, "VOYAGE EN MER", {
      fontFamily: "monospace",
      fontSize: "34px",
      fontStyle: "bold",
      color: "#ffffff",
      stroke: "#06384d",
      strokeThickness: 7,
      align: "center",
    }).setOrigin(0.5).setDepth(100);

    this.add.text(
      width / 2,
      108,
      `${this.travelData.fromIsland || "Île de départ"}  →  ${this.travelData.toIsland || "Nouvelle île"}`,
      {
        fontFamily: "monospace",
        fontSize: "19px",
        color: "#f4e7c5",
        stroke: "#06384d",
        strokeThickness: 5,
        align: "center",
      }
    ).setOrigin(0.5).setDepth(100);

    this.add.text(width / 2, height - 75, "CAP SUR LA PROCHAINE ÎLE...", {
      fontFamily: "monospace",
      fontSize: "16px",
      fontStyle: "bold",
      color: "#ffffff",
      stroke: "#06384d",
      strokeThickness: 5,
    }).setOrigin(0.5).setDepth(100);

    const progressBg = this.add.rectangle(width / 2, height - 38, 420, 12, 0x06384d, 0.8)
      .setStrokeStyle(2, 0xf4e7c5, 0.7)
      .setDepth(100);
    const progress = this.add.rectangle(width / 2 - 207, height - 38, 0, 6, 0xf4e7c5, 1)
      .setOrigin(0, 0.5)
      .setDepth(101);

    this.tweens.add({
      targets: progress,
      width: 414,
      duration: 5000,
      ease: "Linear",
    });

    void progressBg;
  }
}
