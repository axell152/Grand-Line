import Phaser from "phaser";
import { PLAYER_CHARACTER, CHARACTERS } from "@/game/data/characters";
import { saveGame } from "@/game/systems/SaveManager";

export default class CrewScene extends Phaser.Scene {
  constructor() {
    super("CrewScene");
  }

  init(data) {
    this.gameState = data.state;
  }

  create() {
    // Fond semi-transparent
    this.add.rectangle(512, 384, 1024, 768, 0x0b2545, 0.95);

    this.add.text(512, 60, "GESTION DE L'ÉQUIPAGE", {
      fontFamily: "monospace",
      fontSize: "32px",
      color: "#ead9b8",
    }).setOrigin(0.5);

    this.add.text(100, 110, `Niveau ${this.gameState.level}  —  XP ${this.gameState.exp}/${this.gameState.maxExp}`, {
      fontFamily: "monospace",
      fontSize: "18px",
      color: "#ffffff",
    });

    this.add.text(100, 150, "Ordre de combat (le 1er entre au combat en premier) :", {
      fontFamily: "monospace",
      fontSize: "18px",
      color: "#ead9b8",
    });

    this.add.text(512, 720, "[ ▲ / ▼ ] pour réordonner  —  [ T ] ou [ Échap ] pour reprendre la mer", {
      fontFamily: "monospace",
      fontSize: "16px",
      color: "#ead9b8",
    }).setOrigin(0.5);

    if (this.gameState.teamOrder === undefined) {
      this.gameState.teamOrder = ["captain", ...this.gameState.crew];
    }

    this.drawList();

    this.input.keyboard.on("keydown-T", () => this.resumeWorld());
    this.input.keyboard.on("keydown-ESC", () => this.resumeWorld());
  }

  getMemberData(entry) {
    if (entry === "captain") {
      return { name: PLAYER_CHARACTER.name, title: "Capitaine", color: PLAYER_CHARACTER.color };
    }
    const c = CHARACTERS[entry];
    return c ? { name: c.name, title: c.title, color: c.color } : { name: entry, title: "" };
  }

  drawList() {
    if (this.listGroup) this.listGroup.destroy(true);
    this.listGroup = this.add.group();

    const order = this.gameState.teamOrder;

    order.forEach((entry, index) => {
      const data = this.getMemberData(entry);
      const y = 190 + index * 46;

      const swatch = this.add.circle(120, y + 8, 12, data.color || 0xd4a24c).setStrokeStyle(2, 0x1c1c1c);
      const label = this.add.text(150, y, `${index + 1}. ${data.name} — ${data.title}`, {
        fontFamily: "monospace",
        fontSize: "18px",
        color: "#ffffff",
      });
      this.listGroup.add(swatch);
      this.listGroup.add(label);

      if (index > 0) {
        const up = this.add.text(820, y, "▲", { fontFamily: "monospace", fontSize: "20px", color: "#d4a24c" })
          .setInteractive({ useHandCursor: true })
          .on("pointerdown", () => this.moveEntry(index, index - 1))
          .on("pointerover", () => up.setColor("#ffffff"))
          .on("pointerout", () => up.setColor("#d4a24c"));
        this.listGroup.add(up);
      }
      if (index < order.length - 1) {
        const down = this.add.text(860, y, "▼", { fontFamily: "monospace", fontSize: "20px", color: "#d4a24c" })
          .setInteractive({ useHandCursor: true })
          .on("pointerdown", () => this.moveEntry(index, index + 1))
          .on("pointerover", () => down.setColor("#ffffff"))
          .on("pointerout", () => down.setColor("#d4a24c"));
        this.listGroup.add(down);
      }
    });

    if (order.length <= 1) {
      this.listGroup.add(
        this.add.text(150, 190 + order.length * 46 + 10, "Recrutez des membres d'équipage pour pouvoir les réordonner.", {
          fontFamily: "monospace",
          fontSize: "14px",
          color: "#888888",
        })
      );
    }
  }

  moveEntry(from, to) {
    const order = this.gameState.teamOrder;
    const [moved] = order.splice(from, 1);
    order.splice(to, 0, moved);

    this.game.registry.set("gameState", this.gameState);
    saveGame(this.gameState);

    this.drawList();
  }

  resumeWorld() {
    this.scene.stop();
    this.scene.resume("World");
  }
}
