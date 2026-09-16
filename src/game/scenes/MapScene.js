import Phaser from "phaser";
import { ISLANDS } from "@/game/data/islands";

// Ordre officiel de l'aventure.
const ISLAND_ORDER = [
  "ile-depart",
  "ile-cocoyasi",
  "ile-syrup",
  "ile-baratie",
  "ile-drum",
  "ile-alabasta",
  "ile-water7",
  "ile-thriller-bark",
  "ile-finale",
];

// Positionnement provisoire : la carte sera retravaillée visuellement plus tard.
const ISLAND_STYLES = {
  "ile-depart": { x: 125, y: 190, color: 0x4caf50, accent: 0xdff7df },
  "ile-cocoyasi": { x: 300, y: 285, color: 0x56a8c7, accent: 0xe0f7ff },
  "ile-syrup": { x: 475, y: 185, color: 0x78a84f, accent: 0xe9f5d8 },
  "ile-baratie": { x: 650, y: 285, color: 0xb77a42, accent: 0xffe5bd },
  "ile-drum": { x: 825, y: 185, color: 0xcfe8ff, accent: 0xffffff },
  "ile-alabasta": { x: 210, y: 465, color: 0xd7a04d, accent: 0xffedbb },
  "ile-water7": { x: 430, y: 565, color: 0x4c9fb5, accent: 0xd8f8ff },
  "ile-thriller-bark": { x: 665, y: 465, color: 0x55506f, accent: 0xd9d5f4 },
  "ile-finale": { x: 850, y: 565, color: 0x9b7b3e, accent: 0xfff0b0 },
};

export default class MapScene extends Phaser.Scene {
  constructor() {
    super("Map");
  }

  init(data) {
    this.mapState = data?.state || this.game.registry.get("gameState") || {};
  }

  create() {
    this.input.keyboard?.on("keydown-Y", this.closeMap, this);
    this.input.keyboard?.on("keydown-ESC", this.closeMap, this);
    this.input.on("pointerdown", this.handlePointer, this);
    this.drawMap();
  }

  shutdown() {
    this.input.keyboard?.off("keydown-Y", this.closeMap, this);
    this.input.keyboard?.off("keydown-ESC", this.closeMap, this);
    this.input.off("pointerdown", this.handlePointer, this);
  }

  closeMap() {
    this.scene.stop("Map");
    this.scene.resume("World");
  }

  handlePointer(pointer) {
    if (pointer.x >= 450 && pointer.x <= 574 && pointer.y >= 660 && pointer.y <= 710) {
      this.closeMap();
    }
  }

  isUnlocked(id) {
    const index = ISLAND_ORDER.indexOf(id);
    if (index <= 0) return true;

    const previousId = ISLAND_ORDER[index - 1];
    const previousBossFlag = ISLANDS[previousId]?.boss?.unlockFlag;
    return !!previousBossFlag && !!this.mapState.progressFlags?.[previousBossFlag];
  }

  drawMap() {
    const w = this.scale.width;
    const h = this.scale.height;

    this.add.rectangle(w / 2, h / 2, w, h, 0x071522, 1);

    this.add.rectangle(w / 2, 390, 930, 570, 0xd8c28f, 1)
      .setStrokeStyle(5, 0x4d321b, 1);

    const bg = this.add.graphics();
    bg.fillStyle(0xb99a62, 0.18);
    bg.fillCircle(140, 240, 70);
    bg.fillCircle(850, 510, 95);
    bg.fillCircle(540, 430, 55);
    bg.lineStyle(2, 0x5f492b, 0.35);
    for (let y = 150; y < 620; y += 55) bg.lineBetween(65, y, 975, y);

    this.add.text(w / 2, 70, "CARTE DE GRAND LINE", {
      fontFamily: "monospace",
      fontSize: "34px",
      fontStyle: "bold",
      color: "#f1c40f",
    }).setOrigin(0.5);

    this.add.text(w / 2, 108, "Y / ÉCHAP — fermer la carte", {
      fontFamily: "monospace",
      fontSize: "14px",
      color: "#c8d6e5",
    }).setOrigin(0.5);

    for (let i = 0; i < ISLAND_ORDER.length - 1; i++) {
      this.drawRoute(ISLAND_ORDER[i], ISLAND_ORDER[i + 1]);
    }

    ISLAND_ORDER.forEach((id) => this.drawIslandMarker(id));

    const currentName = ISLANDS[this.mapState.islandId]?.name || "Île inconnue";
    this.add.text(w / 2, 625, `Position actuelle : ${currentName}`, {
      fontFamily: "monospace",
      fontSize: "17px",
      fontStyle: "bold",
      color: "#3b2414",
    }).setOrigin(0.5);

    this.add.rectangle(w / 2, 685, 170, 44, 0x17324d, 1)
      .setStrokeStyle(2, 0xe8c96b, 1);
    this.add.text(w / 2, 685, "FERMER [Y]", {
      fontFamily: "monospace",
      fontSize: "15px",
      fontStyle: "bold",
      color: "#ffffff",
    }).setOrigin(0.5);

    this.add.text(70, 735, "● Accessible    ● Verrouillée    ★ Position actuelle", {
      fontFamily: "monospace",
      fontSize: "13px",
      color: "#ead9b8",
    });
  }

  drawRoute(fromId, toId) {
    const a = ISLAND_STYLES[fromId];
    const b = ISLAND_STYLES[toId];
    if (!a || !b) return;

    const unlocked = this.isUnlocked(fromId) && this.isUnlocked(toId);
    const g = this.add.graphics();
    g.lineStyle(5, unlocked ? 0x76552c : 0x777777, unlocked ? 0.9 : 0.45);
    g.beginPath();
    g.moveTo(a.x, a.y);
    g.lineTo((a.x + b.x) / 2, (a.y + b.y) / 2 - 12);
    g.lineTo(b.x, b.y);
    g.strokePath();

    if (!unlocked) {
      this.add.text((a.x + b.x) / 2, (a.y + b.y) / 2 - 32, "VERROUILLÉ", {
        fontFamily: "monospace",
        fontSize: "10px",
        fontStyle: "bold",
        color: "#5c5c5c",
      }).setOrigin(0.5);
    }
  }

  drawIslandMarker(id) {
    const island = ISLANDS[id];
    const style = ISLAND_STYLES[id];
    const unlocked = this.isUnlocked(id);
    const current = this.mapState.islandId === id;

    const g = this.add.graphics();
    g.fillStyle(unlocked ? style.color : 0x777777, unlocked ? 1 : 0.55);
    g.fillEllipse(style.x, style.y, 140, 76);
    g.lineStyle(current ? 5 : 3, current ? 0xe8c96b : 0x4d321b, 1);
    g.strokeEllipse(style.x, style.y, 140, 76);

    g.fillStyle(unlocked ? style.accent : 0xaaaaaa, 0.9);
    g.fillTriangle(style.x - 20, style.y + 14, style.x, style.y - 24, style.x + 20, style.y + 14);

    this.add.text(style.x, style.y + 57, island?.name || id, {
      fontFamily: "monospace",
      fontSize: "13px",
      fontStyle: "bold",
      color: "#3b2414",
      align: "center",
      wordWrap: { width: 145 },
    }).setOrigin(0.5);

    if (current) {
      this.add.text(style.x, style.y - 4, "★", {
        fontFamily: "monospace",
        fontSize: "28px",
        color: "#f1c40f",
      }).setOrigin(0.5);
    } else if (!unlocked) {
      this.add.text(style.x, style.y - 3, "🔒", {
        fontFamily: "monospace",
        fontSize: "22px",
      }).setOrigin(0.5);
    }
  }
}
