import Phaser from "phaser";
import { PLAYER_CHARACTER, CHARACTERS, ENEMY_CHARACTERS } from "@/game/data/characters";
import { MOVES } from "@/game/data/moves";
import { createBattler, getTurnOrder, applyMove, isDefeated } from "@/game/systems/BattleSystem";

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super("Battle");
  }

  init(data) {
    this.battleData = data || {};
  }

  create() {
    const { mode, characterId, crew, playerLevel } = this.battleData;
    this.battleMode = mode || "wild";
    this.targetCharacterId = characterId;

    const enemySource =
      this.battleMode === "recruit" ? CHARACTERS[characterId] : ENEMY_CHARACTERS[characterId || "bandit"];

    const heroData = {
      ...PLAYER_CHARACTER,
      level: playerLevel || 1,
    };

    this.player = createBattler(heroData);
    this.enemy = createBattler(enemySource);
    
    this.teamList = [
      { ...this.player, isMain: true },
      ...(crew || []).map(charId => createBattler(CHARACTERS[charId]))
    ];

    this.teamList.forEach(member => {
      if (!member.ppData) {
        member.ppData = {};
        const moves = member.moves || ["taillade"];
        moves.forEach(mKey => {
          const moveInfo = MOVES[mKey] || { maxPp: 10 };
          member.ppData[mKey] = moveInfo.maxPp || 10;
        });
      }
    });

    this.locked = false;
    this.battleOver = false;

    this.drawBackground();
    this.drawCombatants();
    this.drawLog();
    this.showMainMenu();

    this.setLog(
      this.battleMode === "recruit"
        ? `${this.enemy.name} vous barre la route. Que faites-vous ?`
        : `Un ${this.enemy.name} sauvage apparaît ! Que faites-vous ?`
    );
  }

  drawBackground() {
    const g = this.add.graphics();
    g.fillGradientStyle(0x13315c, 0x13315c, 0x0b2545, 0x0b2545, 1);
    g.fillRect(0, 0, 1024, 768);
  }

  drawCombatants() {
    this.enemyToken = this.add.circle(760, 220, 52, this.enemy.color || 0x555555).setStrokeStyle(4, 0x1c1c1c);
    this.enemyNameText = this.add.text(480, 80, "", {
      fontFamily: "monospace",
      fontSize: "24px",
      color: "#ead9b8",
    });
    this.enemyHpBarBg = this.add.rectangle(480, 120, 280, 18, 0x1c1c1c).setOrigin(0, 0.5);
    this.enemyHpBar = this.add.rectangle(482, 120, 276, 14, 0xc0392b).setOrigin(0, 0.5);

    this.playerToken = this.add.circle(240, 460, 52, this.player.color || 0xd4a24c).setStrokeStyle(4, 0x1c1c1c);
    this.playerNameText = this.add.text(300, 500, "", {
      fontFamily: "monospace",
      fontSize: "24px",
      color: "#ead9b8",
    });
    this.playerHpBarBg = this.add.rectangle(300, 544, 280, 18, 0x1c1c1c).setOrigin(0, 0.5);
    this.playerHpBar = this.add.rectangle(302, 544, 276, 14, 0x27ae60).setOrigin(0, 0.5);

    this.refreshBars();
  }

  refreshBars() {
    if (!this.enemy || !this.player) return;
    this.enemyNameText.setText(`${this.enemy.name} (N.${this.enemy.level || 1})  ${this.enemy.hp}/${this.enemy.maxHp}`);
    this.playerNameText.setText(`${this.player.name} (N.${this.player.level || 1})  ${this.player.hp}/${this.player.maxHp}`);

    const enemyRatio = Math.max(0, this.enemy.hp / this.enemy.maxHp);
    const playerRatio = Math.max(0, this.player.hp / this.player.maxHp);
    this.enemyHpBar.width = 276 * enemyRatio;
    this.playerHpBar.width = 276 * playerRatio;
  }

  drawLog() {
    this.add.rectangle(340, 660, 640, 160, 0x0b2545, 0.9).setStrokeStyle(4, 0xead9b8);
    this.logText = this.add.text(60, 600, "", {
      fontFamily: "monospace",
      fontSize: "20px",
      color: "#ffffff",
      wordWrap: { width: 580 },
    });
  }

  setLog(text) {
    if (this.logText) this.logText.setText(text);
  }

  clearInterfaceElements() {
    if (this.menuGroup) {
      this.menuGroup.destroy(true);
    }
    this.menuGroup = this.add.group();
  }

  showMainMenu() {
    this.clearInterfaceElements();

    const boxBg = this.add.rectangle(800, 660, 320, 160, 0x0b2545, 0.95).setStrokeStyle(4, 0xead9b8);
    this.menuGroup.add(boxBg);

    const options = [
      { label: "▶ ATTAQ", x: 670, y: 615, action: () => this.showMovesMenu() },
      { label: "▶ TEAM", x: 830, y: 615, action: () => this.showTeamMenu() },
      { label: "▶ OBJET", x: 670, y: 690, action: () => this.setLog("Aucun objet disponible pour l'instant !") },
      { label: "▶ FUITE", x: 830, y: 690, action: () => this.attemptEscape() },
    ];

    options.forEach(opt => {
      const txt = this.add.text(opt.x, opt.y, opt.label, {
        fontFamily: "monospace",
        fontSize: "22px",
        color: "#ead9b8",
      })
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", opt.action)
      .on("pointerover", () => txt.setColor("#ffffff"))
      .on("pointerout", () => txt.setColor("#ead9b8"));

      this.menuGroup.add(txt);
    });
  }

  showMovesMenu() {
    this.clearInterfaceElements();

    const boxBg = this.add.rectangle(800, 660, 320, 160, 0x0b2545, 0.95).setStrokeStyle(4, 0xead9b8);
    this.menuGroup.add(boxBg);

    const backTxt = this.add.text(880, 590, "[RETOUR]", {
      fontFamily: "monospace",
      fontSize: "14px",
      color: "#d4a24c",
    })
    .setInteractive({ useHandCursor: true })
    .on("pointerdown", () => this.showMainMenu());
    this.menuGroup.add(backTxt);

    const movesList = this.player.moves || ["taillade"];

    movesList.forEach((moveKey, index) => {
      const move = MOVES[moveKey] || { name: moveKey, maxPp: 10 };
      if (!this.player.ppData) this.player.ppData = {};
      if (this.player.ppData[moveKey] === undefined) {
        this.player.ppData[moveKey] = move.maxPp || 10;
      }
      
      const currentPp = this.player.ppData[moveKey];
      const maxPp = move.maxPp || 10;
      const y = 615 + (index * 26);

      const txt = this.add.text(650, y, `• ${move.name} (${currentPp}/${maxPp})`, {
        fontFamily: "monospace",
        fontSize: "15px",
        color: currentPp > 0 ? "#ead9b8" : "#7f8c8d",
      });

      if (currentPp > 0) {
        txt.setInteractive({ useHandCursor: true })
           .on("pointerdown", () => {
             this.player.ppData[moveKey] = currentPp - 1;
             this.clearInterfaceElements();
             this.playerTurnAction(moveKey);
           })
           .on("pointerover", () => txt.setColor("#ffffff"))
           .on("pointerout", () => txt.setColor("#ead9b8"));
      }

      this.menuGroup.add(txt);
    });
  }

  showTeamMenu() {
    this.clearInterfaceElements();

    const boxBg = this.add.rectangle(800, 660, 320, 160, 0x0b2545, 0.95).setStrokeStyle(4, 0xead9b8);
    this.menuGroup.add(boxBg);

    const backTxt = this.add.text(880, 590, "[RETOUR]", {
      fontFamily: "monospace",
      fontSize: "14px",
      color: "#d4a24c",
    })
    .setInteractive({ useHandCursor: true })
    .on("pointerdown", () => this.showMainMenu());
    this.menuGroup.add(backTxt);

    this.teamList.forEach((member, index) => {
      const y = 615 + (index * 26);
      const isCurrent = member.id === this.player.id;
      const color = isCurrent ? "#7f8c8d" : "#ead9b8";

      const txt = this.add.text(650, y, `• ${member.name} (${member.hp}/${member.maxHp}PV)`, {
        fontFamily: "monospace",
        fontSize: "15px",
        color: color,
      });

      if (!isCurrent && member.hp > 0) {
        txt.setInteractive({ useHandCursor: true })
           .on("pointerdown", () => {
             this.switchCharacter(member);
           })
           .on("pointerover", () => txt.setColor("#ffffff"))
           .on("pointerout", () => txt.setColor(color));
      }

      this.menuGroup.add(txt);
    });
  }

  switchCharacter(newMember) {
    this.clearInterfaceElements();
    this.setLog(`Vous rappelez ${this.player.name} et envoyez ${newMember.name} au combat !`);
    this.player = newMember;
    this.playerToken.setFillStyle(this.player.color || 0xd4a24c);
    this.refreshBars();

    this.time.delayedCall(1200, () => {
      this.enemyReply();
    });
  }

  attemptEscape() {
    this.clearInterfaceElements();
    const failed = Math.random() < 0.30;

    if (failed) {
      this.setLog("Impossible de fuir ! L'ennemi bloque le passage...");
      this.time.delayedCall(1200, () => {
        this.enemyReply();
      });
    } else {
      this.setLog("Vous avez réussi à fuir le combat saine et sauve !");
      const { returnIsland, returnX, returnY } = this.battleData;
      this.time.delayedCall(1500, () => {
        this.scene.start("World", {
          islandId: returnIsland || "start",
          x: returnX || 5,
          y: returnY || 5,
        });
      });
    }
  }

  playerTurnAction(moveKey) {
    if (this.locked || this.battleOver) return;
    this.locked = true;

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
        this.showMainMenu();
      }
      return;
    }
    const keepGoing = steps[i]();
    if (keepGoing === false) return;
    this.time.delayedCall(1000, () => this.runSequence(steps, i + 1));
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
    const enemyMoves = this.enemy.moves || ["taillade"];
    const moveKey = enemyMoves[Math.floor(Math.random() * enemyMoves.length)];
    return this.executeMove(this.enemy, this.player, moveKey);
  }

  endBattle(playerWon) {
    this.battleOver = true;
    this.clearInterfaceElements();
    const { returnIsland, returnX, returnY } = this.battleData;

    if (playerWon) {
      const expGained = this.battleMode === "recruit" ? 40 : 20;

      if (this.battleMode === "recruit") {
        const recruit = CHARACTERS[this.targetCharacterId] || { name: "Inconnu", recruitLine: "Bien joué !" };
        this.setLog(`${recruit.name} est vaincu(e) !\n+${expGained} XP. "${recruit.recruitLine}"`);
        this.time.delayedCall(2800, () => {
          this.scene.start("World", {
            islandId: returnIsland || "start",
            x: returnX || 5,
            y: returnY || 5,
            recruitedId: this.targetCharacterId,
            expGained: expGained,
          });
        });
      } else {
        const loot = 20 + Math.floor(Math.random() * 30);
        this.setLog(`Victoire ! +${expGained} XP et ${loot} berrys récupérés.`);
        this.time.delayedCall(2200, () => {
          this.scene.start("World", {
            islandId: returnIsland || "start",
            x: returnX || 5,
            y: returnY || 5,
            berrysGained: loot,
            expGained: expGained,
          });
        });
      }
    } else {
      this.setLog("Votre équipe est K.O... Réveil d'urgence à la taverne !");
      this.time.delayedCall(2000, () => {
        const respawnData = this.game.registry.get("gameState") || {};
        this.scene.start("World", {
          islandId: respawnData.respawnIsland || returnIsland || "start",
          x: respawnData.respawnX || returnX || 5,
          y: respawnData.respawnY || returnY || 5,
        });
      });
    }
  }
}
