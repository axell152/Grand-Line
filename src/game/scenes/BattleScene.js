import Phaser from "phaser";
import { PLAYER_CHARACTER, CHARACTERS, ENEMY_CHARACTERS } from "@/game/data/characters";
import { MOVES } from "@/game/data/moves";
import { createBattler, getTurnOrder, applyMove, isDefeated } from "@/game/systems/BattleSystem";

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super("Battle");
  }

  init(data) {
    this.battleData = data;
  }

  create() {
    const { mode, characterId, crewSize } = this.battleData;

    const enemySource =
      mode === "recruit" ? CHARACTERS[characterId] : ENEMY_CHARACTERS[characterId];

    // L'équipage recruté renforce le capitaine (bonus cumulatif) — nécessaire
    // vu la difficulté des recrues et ennemis désormais bien plus costauds.
    const heroData = {
      ...PLAYER_CHARACTER,
      atk: PLAYER_CHARACTER.atk + crewSize * 3,
      maxHp: PLAYER_CHARACTER.maxHp + crewSize * 6,
    };

    this.player = createBattler(heroData);
    this.enemy = createBattler(enemySource);
    this.locked = false;
    this.battleOver = false;

    this.drawBackground();
    this.drawCombatants();
    this.drawLog();
    this.drawMoveButtons();

    this.setLog(
      mode === "recruit"
        ? `${this.enemy.name} vous barre la route. Un combat s'engage !`
        : `Un ${this.enemy.name} surgit !`
    );
  }

  drawBackground() {
    const g = this.add.graphics();
    g.fillGradientStyle(0x13315c, 0x13315c, 0x0b2545, 0x0b2545, 1);
    g.fillRect(0, 0, 1024, 768);
  }

  drawCombatants() {
    this.enemyToken = this.add.circle(760, 220, 52, this.enemy.color).setStrokeStyle(4, 0x1c1c1c);
    this.enemyNameText = this.add.text(480, 80, "", {
      fontFamily: "monospace",
      fontSize: "26px",
      color: "#ead9b8",
    });
    this.enemyHpBarBg = this.add.rectangle(480, 124, 280, 20, 0x1c1c1c).setOrigin(0, 0.5);
    this.enemyHpBar = this.add.rectangle(482, 124, 276, 16, 0xc0392b).setOrigin(0, 0.5);

    this.playerToken = this.add.circle(240, 560, 52, this.player.color).setStrokeStyle(4, 0x1c1c1c);
    this.playerNameText = this.add.text(300, 600, "", {
      fontFamily: "monospace",
      fontSize: "26px",
      color: "#ead9b8",
    });
    this.playerHpBarBg = this.add.rectangle(300, 644, 280, 20, 0x1c1c1c).setOrigin(0, 0.5);
    this.playerHpBar = this.add.rectangle(302, 644, 276, 16, 0x27ae60).setOrigin(0, 0.5);

    this.refreshBars();
  }

  refreshBars() {
    this.enemyNameText.setText(`${this.enemy.name}  ${this.enemy.hp}/${this.enemy.maxHp}`);
    this.playerNameText.setText(`${this.player.name}  ${this.player.hp}/${this.player.maxHp}`);

    const enemyRatio = Math.max(0, this.enemy.hp / this.enemy.maxHp);
    const playerRatio = Math.max(0, this.player.hp / this.player.maxHp);
    this.enemyHpBar.width = 276 * enemyRatio;
    this.playerHpBar.width = 276 * playerRatio;
  }

  drawLog() {
    this.logText = this.add.text(40, 300, "", {
      fontFamily: "monospace",
      fontSize: "24px",
      color: "#ffffff",
      wordWrap: { width: 940 },
    });
  }

  setLog(text) {
    this.logText.setText(text);
  }

  drawMoveButtons() {
    this.buttonObjects = [];
    const moves = this.player.moves;
    const startY = 420;

    moves.forEach((moveKey, i) => {
      const move = MOVES[moveKey];
      const y = startY + i * 68;

      const bg = this.add
        .rectangle(40, y, 600, 56, 0x1c1c1c, 0.6)
        .setOrigin(0, 0.5)
        .setStrokeStyle(2, 0xd4a24c)
        .setInteractive({ useHandCursor: true });

      const label = this.add.text(60, y, move.name, {
        fontFamily: "monospace",
        fontSize: "26px",
        color: "#ead9b8",
      }).setOrigin(0, 0.5);

      bg.on("pointerdown", () => this.playerTurn(moveKey));
      bg.on("pointerover", () => bg.setFillStyle(0x2f6b3a, 0.7));
      bg.on("pointerout", () => bg.setFillStyle(0x1c1c1c, 0.6));

      this.buttonObjects.push(bg, label);
    });
  }

  setButtonsEnabled(enabled) {
    this.buttonObjects.forEach((obj) => {
      if (obj.input) obj.input.enabled = enabled;
      obj.setAlpha(enabled ? 1 : 0.4);
    });
  }

  playerTurn(moveKey) {
    if (this.locked || this.battleOver) return;
    this.locked = true;
    this.setButtonsEnabled(false);

    const order = getTurnOrder(this.player, this.enemy);
    const playerFirst = order[0] === this.player;

    const sequence = playerFirst
      ? [
          () => this.executeMove(this.player, this.enemy, moveKey),
          () => this.enemyReply(),
        ]
      : [
          () => this.enemyReply(true),
          () => this.executeMove(this.player, this.enemy, moveKey),
        ];

    this.runSequence(sequence);
  }

  runSequence(steps, i = 0) {
    if (i >= steps.length || this.battleOver) {
      if (!this.battleOver) {
        this.locked = false;
        this.setButtonsEnabled(true);
      }
      return;
    }
    const keepGoing = steps[i]();
    if (keepGoing === false) return; // la bataille s'est terminée pendant cette étape
    this.time.delayedCall(900, () => this.runSequence(steps, i + 1));
  }

  executeMove(attacker, defender, moveKey) {
    const result = applyMove(attacker, defender, moveKey);
    this.setLog(result.text);
    this.refreshBars();

    if (isDefeated(defender)) {
      this.endBattle(defender === this.enemy);
      return false;
    }
    return true;
  }

  enemyReply() {
    const moveKey = this.enemy.moves[Math.floor(Math.random() * this.enemy.moves.length)];
    return this.executeMove(this.enemy, this.player, moveKey);
  }

  endBattle(playerWon) {
  this.battleOver = true;
  this.setButtonsEnabled(false);
  const { mode, characterId, returnIsland, returnX, returnY } = this.battleData;

  if (playerWon) {
    // Calcul de l'XP gagnée (basée sur l'ennemi)
    const expGained = mode === "recruit" ? 40 : 20; 

    if (mode === "recruit") {
      const recruit = CHARACTERS[characterId];
      this.setLog(`${recruit.name} est vaincu(e) !\n+${expGained} XP. "${recruit.recruitLine}"`);
      this.time.delayedCall(2800, () => {
        this.scene.start("World", {
          islandId: returnIsland,
          x: returnX,
          y: returnY,
          recruitedId: characterId,
          expGained: expGained,
        });
      });
    } else {
      const loot = 20 + Math.floor(Math.random() * 30);
      this.setLog(`Victoire ! +${expGained} XP et ${loot} berrys.`);
      this.time.delayedCall(2200, () => {
        this.scene.start("World", {
          islandId: returnIsland,
          x: returnX,
          y: returnY,
          berrysGained: loot,
          expGained: expGained,
        });
      });
    }
  } else {
    this.setLog("Vous êtes à court de forces... Retour au dernier point sûr.");
    this.time.delayedCall(1800, () => {
      this.scene.start("World", {
        islandId: returnIsland,
        x: returnX,
        y: returnY,
      });
    });
  }
}
