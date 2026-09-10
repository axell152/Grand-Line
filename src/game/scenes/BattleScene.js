import Phaser from "phaser";
import { PLAYER_CHARACTER, CHARACTERS, ENEMY_CHARACTERS } from "@/game/data/characters";
import { MOVES } from "@/game/data/moves";
import { createBattler, getTurnOrder, applyMove, isDefeated, scaleEnemyForLevel } from "@/game/systems/BattleSystem";
import { ISLANDS } from "@/game/data/islands"; // Import nécessaire pour récupérer les infos de secours de l'île
const CHARACTER_SPRITES = {
  captain: "character_01",
  bretteur: "character_03",
  navigatrice: "character_04",
  tireur: "character_05",
  medecin: "character_06",
  cuisinier: "character_08",
  charpentier: "character_07",
  musicien: "character_14",
  archeologue: "character_02",
  marineRecrue: "character_10",
  pirateRival: "character_09",
  chasseurDePrimes: "character_13",
  officierMarine: "character_12",
};

function spriteKey(characterId) {
  return CHARACTER_SPRITES[characterId] || "character_01";
}


export default class BattleScene extends Phaser.Scene {
  constructor() {
    super("Battle");
  }

  init(data) {
    this.battleData = data || {};
  }

  create() {
    const {
      mode,
      characterId,
      crew,
      teamOrder,
      playerLevel,
      playerCurrentHp,
      playerMaxHp,
      playerPpData,
      crewDetails,
      enemyLevel,
    } = this.battleData;
    this.battleMode = mode || "wild";
    this.targetCharacterId = characterId;
    this.crewDetails = crewDetails || {};

    const enemySource =
      this.battleMode === "recruit"
        ? CHARACTERS[characterId]
        : scaleEnemyForLevel(ENEMY_CHARACTERS[characterId || "marineRecrue"], enemyLevel || 1);

    const level = playerLevel || 1;
    const heroData = {
      ...PLAYER_CHARACTER,
      level,
      atk: PLAYER_CHARACTER.atk + (level - 1) * 2,
      def: PLAYER_CHARACTER.def + (level - 1) * 1,
      spd: PLAYER_CHARACTER.spd + (level - 1) * 1,
    };

    const captainBattler = createBattler(heroData);
    captainBattler.isCaptain = true;
    if (playerCurrentHp !== undefined) captainBattler.hp = playerCurrentHp;
    if (playerMaxHp !== undefined) captainBattler.maxHp = playerMaxHp;
    if (playerPpData) captainBattler.ppData = { ...playerPpData };

    this.enemy = createBattler(enemySource);

    // L'ordre de l'équipe (capitaine + recrues) vient du menu Équipage : le
    // capitaine n'est plus forcément en tête.
    const order = teamOrder && teamOrder.length ? teamOrder : ["captain", ...(crew || [])];
    this.teamList = order
      .map((entry) => {
        if (entry === "captain") return captainBattler;
        if (!crew || !crew.includes(entry)) return null;

        const base = CHARACTERS[entry];
        if (!base) return null;

        const saved = this.crewDetails[entry] || {};
        const level = saved.level || 1;
        const battler = createBattler({
          ...base,
          level,
          maxHp: base.maxHp + (level - 1) * 8,
          atk: base.atk + (level - 1) * 2,
          def: base.def + (level - 1) * 1,
          spd: base.spd + (level - 1) * 1,
        });
        battler.crewId = entry;
        battler.exp = saved.exp || 0;
        battler.maxExp = saved.maxExp || 100;
        if (saved.hp !== undefined) battler.hp = Math.min(saved.hp, battler.maxHp);
        if (saved.ppData) battler.ppData = { ...saved.ppData };
        return battler;
      })
      .filter(Boolean);

    if (this.teamList.length === 0) this.teamList = [captainBattler];

    // Le premier membre vivant de l'ordre choisi part au combat
    this.player = this.teamList.find((m) => m.hp > 0) || this.teamList[0];

    this.teamList.forEach((member) => {
      if (!member.ppData) {
        member.ppData = {};
        const moves = member.moves || ["taillade"];
        moves.forEach((mKey) => {
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
    const enemyId = this.targetCharacterId || "marineRecrue";
    this.enemySprite = this.add.sprite(760, 220, spriteKey(enemyId), 4);
    this.enemySprite.setScale(5);
    this.enemySprite.setOrigin(0.5, 0.82);
    this.enemySprite.setDepth(10);
    this.enemyNameText = this.add.text(480, 80, "", {
      fontFamily: "monospace",
      fontSize: "24px",
      color: "#ead9b8",
    });
    this.enemyHpBarBg = this.add.rectangle(480, 120, 280, 18, 0x1c1c1c).setOrigin(0, 0.5);
    this.enemyHpBar = this.add.rectangle(482, 120, 276, 14, 0xc0392b).setOrigin(0, 0.5);

    this.playerSprite = this.add.sprite(240, 460, spriteKey(this.player.crewId || "captain"), 1);
    this.playerSprite.setScale(5);
    this.playerSprite.setOrigin(0.5, 0.82);
    this.playerSprite.setDepth(10);
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

  showTeamMenu(forceSwitch = false) {
    this.clearInterfaceElements();

    const boxBg = this.add.rectangle(800, 660, 320, 160, 0x0b2545, 0.95).setStrokeStyle(4, 0xead9b8);
    this.menuGroup.add(boxBg);

    if (!forceSwitch) {
      const backTxt = this.add.text(880, 590, "[RETOUR]", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#d4a24c",
      })
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.showMainMenu());
      this.menuGroup.add(backTxt);
    } else {
      const forcedTxt = this.add.text(650, 590, "⚠ CHOISISSEZ UN PERSONNAGE VIVANT", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#e67e22",
      });
      this.menuGroup.add(forcedTxt);
    }

    this.teamList.forEach((member, index) => {
      const y = 615 + (index * 26);
      const isCurrent = member === this.player;
      const color = isCurrent ? "#7f8c8d" : "#ead9b8";

      const txt = this.add.text(650, y, `• ${member.name} (${member.hp}/${member.maxHp}PV)`, {
        fontFamily: "monospace",
        fontSize: "15px",
        color: color,
      });

      const canSelect = member.hp > 0 && (forceSwitch || !isCurrent);
      if (canSelect) {
        txt.setInteractive({ useHandCursor: true })
           .on("pointerdown", () => {
             this.switchCharacter(member, forceSwitch);
           })
           .on("pointerover", () => txt.setColor("#ffffff"))
           .on("pointerout", () => txt.setColor(color));
      }

      this.menuGroup.add(txt);
    });
  }

  switchCharacter(newMember, forced = false) {
    if (this.locked || this.battleOver || !newMember || newMember.hp <= 0) return;
    this.clearInterfaceElements();
    this.locked = true;

    const previousName = this.player && this.player.hp <= 0 ? `${this.player.name} est K.O.` : `Vous rappelez ${this.player.name}`;
    this.setLog(`${previousName} ${forced ? "Vous envoyez" : "et envoyez"} ${newMember.name} au combat !`);
    this.player = newMember;
    this.playerSprite.setTexture(spriteKey(this.player.crewId || "captain"), 1);
    this.refreshBars();

    if (forced) {
      // Après un K.O., l'attaque ennemie est déjà terminée : choisir un
      // nouveau membre ne consomme pas un tour supplémentaire.
      this.time.delayedCall(900, () => {
        if (this.battleOver) return;
        this.locked = false;
        this.showMainMenu();
      });
      return;
    }

    // Un changement volontaire consomme le tour et l'ennemi riposte.
    this.time.delayedCall(900, () => {
      if (this.battleOver) return;
      const keepGoing = this.enemyReply();
      if (keepGoing !== false && !this.battleOver) {
        this.locked = false;
        this.showMainMenu();
      }
    });
  }

  attemptEscape() {
    this.clearInterfaceElements();
    const failed = Math.random() < 0.30;

    if (failed) {
      this.setLog("Impossible de fuir ! L'ennemi bloque le passage...");
      this.locked = true;
      this.time.delayedCall(1200, () => {
        if (this.battleOver) return;
        
        const keepGoing = this.enemyReply();
        if (keepGoing !== false && !this.battleOver) {
          this.locked = false;
          this.showMainMenu();
        }
      });
    } else {
      this.setLog("Vous avez réussi à fuir le combat saine et sauve !");
      this.saveTeamState();

      this.time.delayedCall(1500, () => {
        const { returnIsland, returnX, returnY } = this.battleData;
        this.scene.start("World", {
          islandId: returnIsland || "start",
          x: returnX || 20,
          y: returnY || 5,
        });
      });
    }
  }

  // Sauvegarde l'état (PV + PP) de tous les membres de l'équipe ayant combattu
  // — capitaine ET recrues — pour que ça persiste d'un combat à l'autre,
  // exactement comme les PV (reset uniquement à la taverne ou en cas de K.O.).
  saveTeamState() {
    const gameState = this.game.registry.get("gameState") || {};
    gameState.crewDetails = gameState.crewDetails || {};

    this.teamList.forEach((member) => {
      if (member.isCaptain) {
        gameState.hp = member.hp;
        gameState.ppData = { ...member.ppData };
      } else if (member.crewId) {
        gameState.crewDetails[member.crewId] = {
          hp: member.hp,
          maxHp: member.maxHp,
          level: member.level || 1,
          exp: member.exp || 0,
          maxExp: member.maxExp || 100,
          ppData: { ...member.ppData },
        };
      }
    });

    this.game.registry.set("gameState", gameState);
    return gameState;
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
      if (defender === this.enemy) {
        // Le membre actif est le seul bénéficiaire de l'XP : exactement comme
        // dans Pokémon, c'est le personnage qui met l'ennemi K.O. qui gagne l'XP.
        this.endBattle(true, attacker);
      } else if (defender === this.player) {
        this.handlePlayerDefeated();
      }
      return false;
    }
    return true;
  }

  handlePlayerDefeated() {
    if (this.battleOver) return false;

    const livingMembers = this.teamList.filter((member) => member.hp > 0);
    this.saveTeamState();

    if (livingMembers.length === 0) {
      this.endBattle(false);
      return false;
    }

    this.locked = true;
    this.setLog(`${this.player.name} est K.O. ! Choisissez un autre membre de l'équipage.`);
    this.time.delayedCall(700, () => {
      if (this.battleOver) return;
      this.showTeamMenu(true);
    });
    return false;
  }

  enemyReply() {
    const enemyMoves = this.enemy.moves || ["taillade"];
    const moveKey = enemyMoves[Math.floor(Math.random() * enemyMoves.length)];
    return this.executeMove(this.enemy, this.player, moveKey);
  }

  endBattle(playerWon, expRecipient = null) {
    this.battleOver = true;
    this.clearInterfaceElements();
    const { returnIsland, returnX, returnY } = this.battleData;

    const gameState = this.saveTeamState();

    if (playerWon) {
      const enemyLevel = this.enemy.level || 1;
      const baseExp = this.battleMode === "recruit" ? 40 : 20;
      const expGained = baseExp * enemyLevel;

      const expRecipientId = expRecipient && expRecipient.isCaptain
        ? "captain"
        : expRecipient?.crewId || "captain";

      if (this.battleMode === "recruit") {
        const recruit = CHARACTERS[this.targetCharacterId] || { name: "Inconnu", recruitLine: "Bien joué !" };
        this.setLog(`${recruit.name} est vaincu(e) !\n${expRecipient?.name || "Le combattant"} gagne +${expGained} XP. "${recruit.recruitLine}"`);
        this.time.delayedCall(2800, () => {
          this.scene.start("World", {
            islandId: returnIsland || "start",
            x: returnX || 20,
            y: returnY || 5,
            recruitedId: this.targetCharacterId,
            expGained,
            expRecipientId,
          });
        });
      } else {
        const loot = 20 + Math.floor(Math.random() * 30);
        this.setLog(`Victoire ! ${expRecipient?.name || "Le combattant"} gagne +${expGained} XP et ${loot} berrys récupérés.`);
        this.time.delayedCall(2200, () => {
          this.scene.start("World", {
            islandId: returnIsland || "start",
            x: returnX || 20,
            y: returnY || 5,
            berrysGained: loot,
            expGained,
            expRecipientId,
          });
        });
      }
    } else {
      this.setLog("Votre équipe est K.O... Réveil d'urgence à la taverne !");
      
      this.time.delayedCall(2000, () => {
        // Soin complet des PV ET des PP de toute l'équipe (capitaine + recrues)
        gameState.hp = gameState.maxHp || 100;
        gameState.ppData = {};
        Object.keys(gameState.crewDetails || {}).forEach((id) => {
          const detail = gameState.crewDetails[id];
          detail.hp = detail.maxHp;
          detail.ppData = {};
        });

        // SÉCURITÉ DE SECOURS : Si aucune taverne n'a été enregistrée, on prend la taverne de l'île actuelle ou le spawn par défaut
        const currentIslandKey = gameState.islandId || returnIsland || "start";
        const islandData = ISLANDS[currentIslandKey];

        if (!gameState.respawnIsland) {
          gameState.respawnIsland = currentIslandKey;
        }
        if (gameState.respawnX === undefined || gameState.respawnY === undefined) {
          if (islandData && islandData.tavern) {
            gameState.respawnX = islandData.tavern.x;
            gameState.respawnY = islandData.tavern.y;
          } else if (islandData && islandData.playerStart) {
            gameState.respawnX = islandData.playerStart.x;
            gameState.respawnY = islandData.playerStart.y;
          } else {
            gameState.respawnX = returnX || 5;
            gameState.respawnY = returnY || 5;
          }
        }

        this.game.registry.set("gameState", gameState);

        // On bascule vers World en demandant explicitement le respawn
        this.scene.start("World", {
          isRespawn: true
        });
      });
    }
  }
}
