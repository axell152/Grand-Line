import Phaser from "phaser";
import { ISLANDS, STARTING_ISLAND } from "@/game/data/islands";
import { PLAYER_CHARACTER } from "@/game/data/characters";
import { STARTING_ITEMS } from "@/game/data/items";
import { saveGame, loadGame } from "@/game/systems/SaveManager";

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super("Title");
  }

  create() {
    this.drawBackground();
    this.showMainMenu();

  }

  drawBackground() {
    this.add.rectangle(512, 384, 1024, 768, 0x071522, 1);

    this.add.circle(512, 300, 175, 0x0b2545, 1).setStrokeStyle(4, 0xd4a24c, 0.9);
    this.add.text(512, 235, "GRAND", {
      fontFamily: "monospace",
      fontSize: "48px",
      fontStyle: "bold",
      color: "#ead9b8",
    }).setOrigin(0.5);
    this.add.text(512, 295, "LINE", {
      fontFamily: "monospace",
      fontSize: "62px",
      fontStyle: "bold",
      color: "#d4a24c",
    }).setOrigin(0.5);
    this.add.text(512, 365, "UNE AVENTURE COMMENCE...", {
      fontFamily: "monospace",
      fontSize: "16px",
      color: "#9fb4c7",
    }).setOrigin(0.5);
  }

  clearUi() {
    this.uiGroup?.destroy(true);
    this.uiGroup = this.add.group();
  }

  makeButton(label, y, action, width = 360) {
    const bg = this.add.rectangle(512, y, width, 54, 0x0b2545, 1)
      .setStrokeStyle(2, 0xead9b8, 1)
      .setInteractive({ useHandCursor: true });

    const text = this.add.text(512, y, label, {
      fontFamily: "monospace",
      fontSize: "18px",
      color: "#ead9b8",
      fontStyle: "bold",
    }).setOrigin(0.5);

    bg.on("pointerover", () => {
      bg.setFillStyle(0x173b5c, 1);
      text.setColor("#ffffff");
    });
    bg.on("pointerout", () => {
      bg.setFillStyle(0x0b2545, 1);
      text.setColor("#ead9b8");
    });
    bg.on("pointerdown", action);

    this.uiGroup.add(bg);
    this.uiGroup.add(text);
  }

  showMainMenu() {
    this.screen = "menu";
    this.clearUi();

    this.addUiText("BIENVENUE DANS GRAND LINE", 445, 18, "#ead9b8");
    this.makeButton("▶ NOUVELLE AVENTURE", 515, () => this.showNewGameConfirmation());
    this.makeButton("▶ CHARGER LA SAUVEGARDE", 585, () => this.loadSavedGame());
  }

  addUiText(text, y, fontSize = 18, color = "#ffffff") {
    const obj = this.add.text(512, y, text, {
      fontFamily: "monospace",
      fontSize: `${fontSize}px`,
      color,
      align: "center",
      wordWrap: { width: 800 },
    }).setOrigin(0.5);
    this.uiGroup.add(obj);
    return obj;
  }

  showNewGameConfirmation() {
    this.screen = "confirm";
    this.clearUi();

    this.addUiText("NOUVELLE AVENTURE", 445, 25, "#d4a24c");
    this.addUiText(
      "Commencer une nouvelle aventure ?\n\nVotre progression actuelle sera remplacée.",
      495,
      17,
      "#ead9b8"
    );

    this.makeButton("▶ OUI, COMMENCER", 595, () => this.showNameScreen(), 320);
    this.makeButton("▶ ANNULER", 660, () => this.showMainMenu(), 320);
  }

  showNameScreen() {
    this.screen = "name";
    this.nameValue = "";
    this.clearUi();

    this.addUiText("NOUVEAU CAPITAINE", 445, 25, "#d4a24c");
    this.addUiText("Comment s'appelle ton capitaine ?", 490, 18, "#ead9b8");

    this.nameBox = this.add.rectangle(512, 545, 520, 58, 0x071522, 1)
      .setStrokeStyle(3, 0xead9b8, 1);
    this.uiGroup.add(this.nameBox);

    this.nameText = this.add.text(512, 545, "|", {
      fontFamily: "monospace",
      fontSize: "25px",
      color: "#ffffff",
    }).setOrigin(0.5);
    this.uiGroup.add(this.nameText);

    this.addUiText("Entre 1 et 18 caractères • Entrée pour commencer", 590, 14, "#9fb4c7");
    this.makeButton("▶ COMMENCER L'AVENTURE", 650, () => this.startNewGame(), 360);
    this.makeButton("▶ RETOUR", 715, () => this.showNewGameConfirmation(), 220);

    this.input.keyboard.off("keydown", this.handleNameKey, this);
    this.handleNameKey = (event) => this.onNameKey(event);
    this.input.keyboard.on("keydown", this.handleNameKey, this);
  }

  onNameKey(event) {
    if (this.screen !== "name") return;

    if (event.key === "Backspace") {
      this.nameValue = this.nameValue.slice(0, -1);
    } else if (event.key === "Enter") {
      this.startNewGame();
      return;
    } else if (event.key && event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
      if (this.nameValue.length < 18) this.nameValue += event.key;
    }

    this.nameText?.setText(`${this.nameValue}|`);
  }

  createNewState(playerName) {
    const startingIslandData = ISLANDS[STARTING_ISLAND];
    const defaultX = startingIslandData.tavern
      ? startingIslandData.tavern.x
      : startingIslandData.playerStart.x;
    const defaultY = startingIslandData.tavern
      ? startingIslandData.tavern.y
      : startingIslandData.playerStart.y;

    return {
      playerName,
      islandId: STARTING_ISLAND,
      x: defaultX,
      y: defaultY,
      respawnIsland: STARTING_ISLAND,
      respawnX: defaultX,
      respawnY: defaultY,
      crew: [],
      teamOrder: ["captain"],
      berrys: 0,
      level: 1,
      exp: 0,
      maxExp: 100,
      hp: PLAYER_CHARACTER.maxHp,
      maxHp: PLAYER_CHARACTER.maxHp,
      atk: PLAYER_CHARACTER.atk,
      def: PLAYER_CHARACTER.def,
      spd: PLAYER_CHARACTER.spd,
      moves: [...PLAYER_CHARACTER.moves].slice(0, 4),
      ppData: {},
      crewDetails: {},
      items: { ...STARTING_ITEMS },
      progressFlags: {},
      openedChests: {},
      bossRespawns: {},
    };
  }

  async startNewGame() {
    if (this.screen !== "name" || this.starting) return;

    const playerName = this.nameValue.trim();
    if (!playerName) {
      this.addUiText("Entre un nom pour continuer.", 620, 15, "#e67e22");
      return;
    }

    this.input.keyboard.off("keydown", this.handleNameKey, this);
    this.starting = true;

    const state = this.createNewState(playerName);
    this.game.registry.set("gameState", state);

    // La sauvegarde locale est immédiate et la sauvegarde Blob est tentée ensuite.
    await saveGame(state);
    this.scene.start("World");
  }

  async loadSavedGame() {
    if (this.loading) return;
    this.loading = true;
    this.clearUi();
    this.addUiText("CHARGEMENT...", 525, 22, "#d4a24c");

    const save = await loadGame();

    if (!save) {
      this.loading = false;
      this.screen = "no-save";
      this.clearUi();
      this.addUiText("AUCUNE SAUVEGARDE TROUVÉE", 500, 22, "#e67e22");
      this.addUiText("Commence une nouvelle aventure pour créer une sauvegarde.", 545, 15, "#ead9b8");
      this.makeButton("▶ RETOUR", 620, () => this.showMainMenu(), 220);
      return;
    }

    this.game.registry.set("gameState", save);
    this.scene.start("World");
  }
}
