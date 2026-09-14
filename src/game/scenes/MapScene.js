import Phaser from "phaser";
import { ISLANDS } from "@/game/data/islands";

const ISLAND_ORDER = ["ile-depart", "ile-brume", "ile-hiver"];

const ISLAND_STYLES = {
  "ile-depart": { x: 230, y: 330, color: 0x4caf50, accent: 0xdff7df },
  "ile-brume": { x: 510, y: 250, color: 0x6fa8dc, accent: 0xe4f2ff },
  "ile-hiver": { x: 790, y: 170, color: 0xcfe8ff, accent: 0xffffff },
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
    if (id === "ile-depart") return true;
    if (id === "ile-brume") {
      return !!this.mapState.progressFlags?.["boss_ile-depart"];
    }
    if (id === "ile-hiver") {
      return !!this.mapState.progressFlags?.["boss_ile-brume"];
    }
    return false;
  }

  drawMap() {
    const w = this.scale.width;
    const h = this.scale.height;

    this.add.rectangle(w / 2, h / 2, w, h, 0x071522, 1);

    const paper = this.add.rectangle(w / 2, 390, 900, 570, 0xd8c28f, 1)
      .setStrokeStyle(5, 0x4d321b, 1);

    // Vieille carte : taches et lignes de navigation.
    const bg = this.add.graphics();
    bg.fillStyle(0xb99a62, 0.18);
    bg.fillCircle(160, 250, 70);
    bg.fillCircle(850, 500, 95);
    bg.fillCircle(650, 430, 45);
    bg.lineStyle(2, 0x5f492b, 0.35);
    for (let y = 150; y < 620; y += 55) {
      bg.lineBetween(100, y, 920, y);
    }

    this.add.text(w / 2, 80, "CARTE DE GRAND LINE", {
      fontFamily: "monospace",
      fontSize: "36px",
      fontStyle: "bold",
      color: "#f1c40f",
    }).setOrigin(0.5);

    this.add.text(w / 2, 118, "Y / ÉCHAPPE — fermer la carte", {
      fontFamily: "monospace",
      fontSize: "14px",
      color: "#c8d6e5",
    }).setOrigin(0.5);

    // Routes. Une route devient visuellement disponible seulement si les deux îles le sont.
    this.drawRoute("ile-depart", "ile-brume");
    this.drawRoute("ile-brume", "ile-hiver");

    ISLAND_ORDER.forEach((id) => this.drawIslandMarker(id));

    const currentName = ISLANDS[this.mapState.islandId]?.name || "Île inconnue";
    this.add.text(w / 2, 585, `Position actuelle : ${currentName}`, {
      fontFamily: "monospace",
      fontSize: "18px",
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

    this.add.text(85, 735, "● Accessible    ● Verrouillée    ★ Position actuelle", {
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
    g.lineTo((a.x + b.x) / 2, (a.y + b.y) / 2 - 18);
    g.lineTo(b.x, b.y);
    g.strokePath();

    if (!unlocked) {
      this.add.text((a.x + b.x) / 2, (a.y + b.y) / 2 - 42, "VERROUILLÉ", {
        fontFamily: "monospace",
        fontSize: "11px",
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
    g.fillEllipse(style.x, style.y, 150, 82);
    g.lineStyle(current ? 5 : 3, current ? 0xe8c96b : 0x4d321b, 1);
    g.strokeEllipse(style.x, style.y, 150, 82);

    // Petit relief central.
    g.fillStyle(unlocked ? style.accent : 0xaaaaaa, 0.9);
    g.fillTriangle(style.x - 22, style.y + 15, style.x, style.y - 27, style.x + 22, style.y + 15);

    this.add.text(style.x, style.y + 62, island?.name || id, {
      fontFamily: "monospace",
      fontSize: "16px",
      fontStyle: "bold",
      color: "#3b2414",
      align: "center",
      wordWrap: { width: 210 },
    }).setOrigin(0.5);

    if (current) {
      this.add.text(style.x, style.y - 5, "★", {
        fontFamily: "monospace",
        fontSize: "30px",
        color: "#f1c40f",
      }).setOrigin(0.5);
    } else if (!unlocked) {
      this.add.text(style.x, style.y - 3, "🔒", {
        fontFamily: "monospace",
        fontSize: "24px",
      }).setOrigin(0.5);
    }
  }
}
