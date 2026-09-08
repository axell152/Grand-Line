import Phaser from "phaser";
import { CHARACTERS } from "@/game/data/characters";

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

    this.add.text(512, 80, "GESTION DE L'ÉQUIPAGE", {
      fontFamily: "monospace",
      fontSize: "32px",
      color: "#ead9b8",
    }).setOrigin(0.5);

    // Infos du Capitaine
    this.add.text(100, 160, `Capitaine (Niveau ${this.gameState.level})`, {
      fontFamily: "monospace",
      fontSize: "22px",
      color: "#d4a24c",
    });
    this.add.text(100, 200, `Expérience : ${this.gameState.exp} / ${this.gameState.maxExp}`, {
      fontFamily: "monospace",
      fontSize: "18px",
      color: "#ffffff",
    });

    // Liste des membres recrutés
    this.add.text(100, 260, `Membres à bord (${this.gameState.crew.length}) :`, {
      fontFamily: "monospace",
      fontSize: "20px",
      color: "#ead9b8",
    });

    if (this.gameState.crew.length === 0) {
      this.add.text(100, 310, "Aucun membre pour l'instant. Explorez et recrutez !", {
        fontFamily: "monospace",
        fontSize: "16px",
        color: "#888888",
      });
    } else {
      this.gameState.crew.forEach((charId, index) => {
        const charData = CHARACTERS[charId];
        const y = 310 + index * 40;
        this.add.text(120, y, `- ${charData.name} (${charData.title})`, {
          fontFamily: "monospace",
          fontSize: "18px",
          color: "#ffffff",
        });
      });
    }

    // Instruction pour fermer
    this.add.text(512, 680, "Appuyez sur [ T ] ou [ Échap ] pour reprendre la mer", {
      fontFamily: "monospace",
      fontSize: "16px",
      color: "#ead9b8",
    }).setOrigin(0.5);

    this.input.keyboard.on("keydown-T", () => this.resumeWorld());
    this.input.keyboard.on("keydown-ESC", () => this.resumeWorld());
  }

  resumeWorld() {
    this.scene.stop();
    this.scene.resume("World");
  }
}
