import Phaser from "phaser";
import { CHARACTERS } from "@/game/data/characters";

export default class CrewScene extends Phaser.Scene {
  constructor() {
    super("CrewScene");
  }

  init(data) {
    this.state = data.state || {};
  }

  create() {
    // Fond semi-transparent ou couleur de l'UI
    const g = this.add.graphics();
    g.fillGradientStyle(0x0b2545, 0x0b2545, 0x13315c, 0x13315c, 1);
    g.fillRect(0, 0, 1024, 768);

    // Titre principal
    this.add.text(512, 60, "GESTION DE L'ÉQUIPAGE", {
      fontFamily: "monospace",
      fontSize: "28px",
      color: "#ead9b8",
      fontStyle: "bold",
    }).setOrigin(0.5);

    // Section Capitaine (Niveau, Expérience et PV)
    this.add.text(100, 140, "Capitaine (Niveau " + (this.state.level || 1) + ")", {
      fontFamily: "monospace",
      fontSize: "20px",
      color: "#d4a24c",
      fontStyle: "bold",
    });

    this.add.text(100, 180, "Expérience : " + (this.state.exp || 0) + " / " + (this.state.maxExp || 100), {
      fontFamily: "monospace",
      fontSize: "16px",
      color: "#ead9b8",
    });

    this.add.text(100, 210, "Points de Vie : " + (this.state.hp || 100) + " / " + (this.state.maxHp || 100), {
      fontFamily: "monospace",
      fontSize: "16px",
      color: "#27ae60",
    });

    // Section Membres d'équipage
    const crewIds = this.state.crew || [];
    this.add.text(100, 270, "Membres à bord (" + crewIds.length + ") :", {
      fontFamily: "monospace",
      fontSize: "20px",
      color: "#ead9b8",
      fontStyle: "bold",
    });

    if (crewIds.length === 0) {
      this.add.text(100, 310, "Aucun membre pour l'instant. Explorez et recrutez !", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#7f8c8d",
      });
    } else {
      // S'assure que crewDetails existe pour stocker les PV des membres
      if (!this.state.crewDetails) {
        this.state.crewDetails = crewIds.map(id => {
          const charData = CHARACTERS[id] || {};
          return {
            id: id,
            name: charData.name || id,
            hp: charData.maxHp || 100,
            maxHp: charData.maxHp || 100,
          };
        });
      }

      // Affichage de chaque membre de l'équipage avec ses PV
      crewIds.forEach((charId, index) => {
        const charData = CHARACTERS[charId] || { name: charId };
        
        // Récupère les PV du membre s'ils existent dans l'état, sinon valeurs par défaut
        const memberDetail = this.state.crewDetails.find(m => m.id === charId) || {
          hp: charData.maxHp || 100,
          maxHp: charData.maxHp || 100,
        };

        const yPos = 310 + (index * 40);
        this.add.text(120, yPos, `• ${charData.name}`, {
          fontFamily: "monospace",
          fontSize: "16px",
          color: "#ffffff",
        });

        this.add.text(350, yPos, `PV : ${memberDetail.hp} / ${memberDetail.maxHp}`, {
          fontFamily: "monospace",
          fontSize: "16px",
          color: "#27ae60",
        });
      });
    }

    // Instructions de fermeture
    this.add.text(512, 700, "Appuyez sur [ T ] ou [ Échap ] pour reprendre la mer", {
      fontFamily: "monospace",
      fontSize: "14px",
      color: "#ead9b8",
    }).setOrigin(0.5);

    // Gestionnaires de fermeture de la scène (T ou Échap)
    this.input.keyboard.on('keydown-T', () => this.closeScene());
    this.input.keyboard.on('keydown-ESC', () => this.closeScene());
  }

  closeScene() {
    this.scene.stop();
    this.scene.resume("World");
  }
}
