import Phaser from "phaser";
import { PLAYER_CHARACTER, CHARACTERS, ENEMY_CHARACTERS } from "@/game/data/characters";
import { MOVES } from "@/game/data/moves";
import { ITEMS } from "@/game/data/items";
import { createBattler, getTurnOrder, applyMove, isDefeated, scaleEnemyForLevel } from "@/game/systems/BattleSystem";
import { ISLANDS } from "@/game/data/islands";

const CHARACTER_SPRITES = {
  captain: "character_01", bretteur: "character_03", navigatrice: "character_04",
  tireur: "character_05", medecin: "character_06", cuisinier: "character_08",
  charpentier: "character_07", musicien: "character_14", archeologue: "character_02",
  marineRecrue: "character_10", pirateRival: "character_09", chasseurDePrimes: "character_13",
  officierMarine: "character_12",
};
const spriteKey = (id) => CHARACTER_SPRITES[id] || "character_01";

export default class BattleScene extends Phaser.Scene {
  constructor() { super("Battle"); }
  init(data) { this.battleData = data || {}; }

  create() {
    const d = this.battleData;
    this.battleMode = d.mode || "wild";
    this.targetCharacterId = d.characterId;
    this.crewDetails = d.crewDetails || {};
    this.items = { potion: 0, superPotion: 0, ...(d.items || {}) };
    this.isBossBattle = d.boss === true && Array.isArray(d.bossTeam) && d.bossTeam.length > 0;
    this.bossId = d.bossId;
    this.bossEnemyIndex = 0;
    this.bossExpRewards = [];

    const enemySource = this.battleMode === "recruit"
      ? CHARACTERS[d.characterId]
      : scaleEnemyForLevel(ENEMY_CHARACTERS[d.characterId || "marineRecrue"], d.enemyLevel || 1);

    const level = d.playerLevel || 1;
    const captain = createBattler({
      ...PLAYER_CHARACTER,
      level,
      maxHp: d.playerMaxHp ?? (PLAYER_CHARACTER.maxHp + (level - 1) * 8),
      atk: d.playerAtk ?? (PLAYER_CHARACTER.atk + (level - 1) * 2),
      def: d.playerDef ?? (PLAYER_CHARACTER.def + (level - 1)),
      spd: d.playerSpd ?? (PLAYER_CHARACTER.spd + (level - 1)),
      moves: d.playerMoves?.length ? d.playerMoves : PLAYER_CHARACTER.moves,
    });
    captain.name = d.playerName || captain.name || "Capitaine";
    captain.isCaptain = true;
    captain.crewId = "captain";
    captain.exp = d.playerExp || 0;
    captain.maxExp = d.playerMaxExp || 100;
    if (d.playerCurrentHp !== undefined) captain.hp = Math.min(d.playerCurrentHp, captain.maxHp);
    captain.ppData = { ...(d.playerPpData || {}) };

    if (this.isBossBattle) {
      this.enemyTeam = d.bossTeam.map((entry) => {
        const base = ENEMY_CHARACTERS[entry.characterId];
        const scaled = scaleEnemyForLevel(base, entry.level || 1);
        const enemy = createBattler(scaled);
        enemy.type = enemy.type || "tranchant";
        enemy.isBossMember = entry.isBoss === true;
        if (entry.name) enemy.name = entry.name;
        return enemy;
      });
      this.enemy = this.enemyTeam[0];
      this.targetCharacterId = d.bossTeam[0].characterId;
      this.bossEnemyIndex = 0;
    } else {
      this.enemy = createBattler(enemySource);
      if (d.bossName) this.enemy.name = d.bossName;
      this.enemy.type = this.enemy.type || "tranchant";
    }

    const order = d.teamOrder?.length ? d.teamOrder : ["captain", ...(d.crew || [])];
    this.teamList = order.map((entry) => {
      if (entry === "captain") return captain;
      if (!d.crew?.includes(entry) || !CHARACTERS[entry]) return null;

      const base = CHARACTERS[entry];
      const saved = this.crewDetails[entry] || {};
      const lvl = saved.level || 1;
      const member = createBattler({
        ...base,
        level: lvl,
        maxHp: saved.maxHp || base.maxHp + (lvl - 1) * 8,
        atk: saved.atk ?? base.atk + (lvl - 1) * 2,
        def: saved.def ?? base.def + (lvl - 1),
        spd: saved.spd ?? base.spd + (lvl - 1),
        moves: saved.moves?.length ? saved.moves : base.moves,
      });
      member.crewId = entry;
      member.exp = saved.exp || 0;
      member.maxExp = saved.maxExp || 100;
      if (saved.hp !== undefined) member.hp = Math.min(saved.hp, member.maxHp);
      member.ppData = { ...(saved.ppData || {}) };
      return member;
    }).filter(Boolean);

    if (!this.teamList.length) this.teamList = [captain];
    this.teamList.forEach((m) => this.initPp(m));
    this.player = this.teamList.find((m) => m.hp > 0) || this.teamList[0];

    this.locked = false;
    this.battleOver = false;
    this.drawBackground();
    this.drawCombatants();
    this.drawLog();
    this.showMainMenu();
    this.setLog(this.battleMode === "recruit"
      ? `${captain.name} fait face à ${this.enemy.name}.`
      : `${captain.name} rencontre un ${this.enemy.name} sauvage !`);
  }

  initPp(member) {
    member.ppData ||= {};
    (member.moves || ["taillade"]).forEach((key) => {
      member.ppData[key] ??= MOVES[key]?.maxPp || 10;
    });
  }

  drawBackground() {
    const g = this.add.graphics();
    g.fillGradientStyle(0x102b46, 0x102b46, 0x071522, 0x071522, 1);
    g.fillRect(0, 0, 1024, 768);
    g.fillStyle(0x1e5b45, 1); g.fillEllipse(760, 320, 420, 150);
    g.fillStyle(0x2a6b50, 1); g.fillEllipse(240, 555, 500, 160);
    this.add.text(30, 25, "GRAND LINE", { fontFamily: "monospace", fontSize: "18px", color: "#d4a24c" });
  }

  drawCombatants() {
    const enemyId = this.targetCharacterId || this.battleData.characterId || "marineRecrue";
    this.enemySprite = this.add.sprite(760, 245, spriteKey(enemyId), 0).setScale(7).setOrigin(0.5, 0.82).setDepth(10);
    this.enemyNameText = this.add.text(480, 72, "", { fontFamily: "monospace", fontSize: "21px", color: "#ead9b8" });
    this.enemyHpBarBg = this.add.rectangle(480, 110, 300, 20, 0x161616).setOrigin(0, 0.5);
    this.enemyHpBar = this.add.rectangle(482, 110, 296, 16, 0xc0392b).setOrigin(0, 0.5);

    this.playerSprite = this.add.sprite(240, 470, spriteKey(this.player.crewId), 1).setScale(7).setOrigin(0.5, 0.82).setDepth(10);
    this.playerNameText = this.add.text(300, 495, "", { fontFamily: "monospace", fontSize: "21px", color: "#ead9b8" });
    this.playerHpBarBg = this.add.rectangle(300, 533, 300, 20, 0x161616).setOrigin(0, 0.5);
    this.playerHpBar = this.add.rectangle(302, 533, 296, 16, 0x27ae60).setOrigin(0, 0.5);

    this.refreshBars();
  }

  refreshBars() {
    if (!this.enemy || !this.player) return;
    this.enemyNameText.setText(`${this.enemy.name}  N.${this.enemy.level || 1}  |  ${this.enemy.hp}/${this.enemy.maxHp} PV`);
    this.playerNameText.setText(`${this.player.name}  N.${this.player.level || 1}  |  ${this.player.hp}/${this.player.maxHp} PV`);
    this.enemyHpBar.width = 296 * Math.max(0, this.enemy.hp / this.enemy.maxHp);
    this.playerHpBar.width = 296 * Math.max(0, this.player.hp / this.player.maxHp);
    this.enemyHpBar.setFillStyle(this.enemy.hp / this.enemy.maxHp < 0.3 ? 0xc0392b : 0x27ae60);
    this.playerHpBar.setFillStyle(this.player.hp / this.player.maxHp < 0.3 ? 0xe67e22 : 0x27ae60);
  }

  drawLog() {
    this.add.rectangle(340, 675, 650, 145, 0x071522, 0.94).setStrokeStyle(3, 0xead9b8);
    this.logText = this.add.text(60, 615, "", {
      fontFamily: "monospace", fontSize: "18px", color: "#ffffff",
      wordWrap: { width: 580 },
    });
  }

  setLog(text) { this.logText?.setText(text); }

  waitForContinue(callback) {
    if (this.continueCleanup) this.continueCleanup();

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      this.continueCleanup?.();
      this.continueCleanup = null;
      callback?.();
    };

    const onPointerDown = () => finish();
    const onKeyDown = () => finish();

    this.input.on("pointerdown", onPointerDown);
    this.input.keyboard?.on("keydown", onKeyDown);

    this.continueCleanup = () => {
      this.input.off("pointerdown", onPointerDown);
      this.input.keyboard?.off("keydown", onKeyDown);
    };
  }

  clearInterfaceElements() {
    this.menuGroup?.destroy(true);
    this.menuGroup = this.add.group();
  }

  makeButton(label, x, y, action, enabled = true) {
    const txt = this.add.text(x, y, label, {
      fontFamily: "monospace",
      fontSize: "19px",
      color: enabled ? "#ead9b8" : "#5d6570",
    }).setInteractive({ useHandCursor: enabled });

    if (enabled) {
      txt.on("pointerdown", action)
        .on("pointerover", () => txt.setColor("#ffffff"))
        .on("pointerout", () => txt.setColor("#ead9b8"));
    }

    this.menuGroup.add(txt);
    return txt;
  }

  showMainMenu() {
    this.clearInterfaceElements();
    this.addMenuBox();
    this.makeButton("▶ ATTAQUE", 655, 610, () => this.showMovesMenu());
    this.makeButton("▶ TEAM", 835, 610, () => this.showTeamMenu());
    this.makeButton("▶ OBJETS", 655, 675, () => this.showItemsMenu());
    this.makeButton("▶ FUITE", 835, 675, () => this.attemptEscape());
  }

  addMenuBox() {
    const bg = this.add.rectangle(820, 675, 390, 155, 0x0b2545, 0.97).setStrokeStyle(3, 0xead9b8);
    this.menuGroup.add(bg);
  }

  showMovesMenu() {
    this.clearInterfaceElements();
    this.addMenuBox();
    this.makeButton("[RETOUR]", 930, 600, () => this.showMainMenu(), true);

    (this.player.moves || ["taillade"]).forEach((key, i) => {
      const move = MOVES[key] || { name: key, maxPp: 10, accuracy: 1 };
      const pp = this.player.ppData[key] ?? move.maxPp;
      this.makeButton(`• ${move.name}  ${pp}/${move.maxPp}`, 640, 615 + i * 30, () => {
        this.player.ppData[key] = Math.max(0, pp - 1);
        this.clearInterfaceElements();
        this.playerTurnAction(key);
      }, pp > 0);
    });
  }

  showItemsMenu() {
    this.clearInterfaceElements();
    this.addMenuBox();
    this.makeButton("[RETOUR]", 930, 600, () => this.showMainMenu());

    Object.keys(ITEMS).forEach((id, i) => {
      const item = ITEMS[id];
      const count = this.items[id] || 0;
      const usable = count > 0 && this.player.hp > 0 && this.player.hp < this.player.maxHp;
      this.makeButton(`• ${item.name} x${count}`, 640, 615 + i * 30, () => this.useItem(id), usable);
    });
    this.setLog("Les objets restaurent les PV et consomment le tour.");
  }

  showTeamMenu(forceSwitch = false) {
    this.clearInterfaceElements();
    this.addMenuBox();

    if (!forceSwitch) {
      this.makeButton("[RETOUR]", 930, 600, () => this.showMainMenu());
    } else {
      this.menuGroup.add(this.add.text(640, 585, "⚠ CHOISISSEZ UN PERSONNAGE VIVANT", {
        fontFamily: "monospace", fontSize: "14px", color: "#e67e22",
      }));
    }

    this.teamList.forEach((member, index) => {
      const y = 615 + index * 26;
      const current = member === this.player;
      const alive = member.hp > 0;
      const canSelect = alive && (!current || forceSwitch);
      this.makeButton(
        `• ${member.name}  ${member.hp}/${member.maxHp} PV`,
        640, y,
        () => this.switchCharacter(member, forceSwitch),
        canSelect
      );
    });
  }

  switchCharacter(newMember, forced = false) {
    if (
      this.battleOver ||
      !newMember ||
      newMember.hp <= 0 ||
      (!forced && this.locked) ||
      (!forced && newMember === this.player)
    ) return;

    this.clearInterfaceElements();
    this.locked = true;

    const old = this.player;
    this.player = newMember;
    this.playerSprite.setTexture(spriteKey(newMember.crewId), 1);
    this.setLog(`${old.name} ${old.hp <= 0 ? "est K.O." : "revient à bord"} ! ${newMember.name} prend sa place.`);
    this.refreshBars();

    this.playerSprite.setAlpha(0.4);
    this.tweens.add({ targets: this.playerSprite, alpha: 1, duration: 350 });

    this.time.delayedCall(850, () => {
      if (this.battleOver) return;
      if (forced) {
        this.locked = false;
        this.showMainMenu();
        return;
      }

      const keep = this.enemyReply();
      if (keep !== false && !this.battleOver) {
        this.locked = false;
        this.showMainMenu();
      }
    });
  }

  useItem(id) {
    if (this.locked || this.battleOver || !this.items[id] || !ITEMS[id]) return;

    const item = ITEMS[id];
    if (this.player.hp >= this.player.maxHp) {
      this.setLog("Les PV sont déjà au maximum.");
      return;
    }

    this.items[id] -= 1;
    this.locked = true;
    this.clearInterfaceElements();

    const before = this.player.hp;
    this.player.hp = Math.min(this.player.maxHp, this.player.hp + item.heal);
    this.setLog(`${this.player.name} utilise ${item.name} et récupère ${this.player.hp - before} PV !`);
    this.showFloatingText(`+${this.player.hp - before} PV`, this.playerSprite.x, this.playerSprite.y - 70, "#9fd18f");
    this.refreshBars();

    this.time.delayedCall(900, () => {
      const keep = this.enemyReply();
      if (keep !== false && !this.battleOver) {
        this.locked = false;
        this.showMainMenu();
      }
    });
  }

  playerTurnAction(moveKey) {
    if (this.locked || this.battleOver) return;

    this.locked = true;
    const order = getTurnOrder(this.player, this.enemy);
    const first = order[0] === this.player;

    const steps = first
      ? [
          () => this.executeMove(this.player, this.enemy, moveKey),
          () => this.enemyReply(),
        ]
      : [
          () => this.enemyReply(),
          () => this.executeMove(this.player, this.enemy, moveKey),
        ];

    this.runSequence(steps);
  }

  runSequence(steps, i = 0) {
    if (i >= steps.length || this.battleOver) {
      if (!this.battleOver) {
        this.locked = false;
        this.showMainMenu();
      }
      return;
    }

    const keep = steps[i]();
    if (keep === false) return;

    this.time.delayedCall(950, () => this.runSequence(steps, i + 1));
  }

  executeMove(attacker, defender, moveKey) {
    const move = MOVES[moveKey];
    const result = applyMove(attacker, defender, moveKey);

    this.setLog(result.text);
    this.refreshBars();

    if (result.damage) {
      const targetSprite = defender === this.enemy ? this.enemySprite : this.playerSprite;
      this.flashSprite(targetSprite);
      this.showFloatingText(
        `${result.critical ? "CRIT ! " : ""}-${result.damage}`,
        targetSprite.x,
        targetSprite.y - 65,
        result.critical ? "#f1c40f" : "#ffffff"
      );
      this.animateAttack(
        attacker === this.player ? this.playerSprite : this.enemySprite,
        targetSprite
      );
    }

    if (result.heal) {
      this.showFloatingText(
        `+${result.heal} PV`,
        attacker === this.player ? this.playerSprite.x : this.enemySprite.x,
        (attacker === this.player ? this.playerSprite.y : this.enemySprite.y) - 65,
        "#9fd18f"
      );
    }

    if (isDefeated(defender)) {
      if (defender === this.enemy) {
        this.handleEnemyDefeated(attacker);
      } else {
        this.handlePlayerDefeated();
      }
      return false;
    }

    return true;
  }

  animateAttack(from, to) {
    if (!from || !to) return;
    const x = from.x;
    const y = from.y;

    this.tweens.add({
      targets: from,
      x: to.x + (from === this.playerSprite ? -70 : 70),
      duration: 180,
      yoyo: true,
      onComplete: () => {
        from.x = x;
        from.y = y;
      },
    });
  }

  flashSprite(sprite) {
    sprite.setTint(0xffffff);
    this.time.delayedCall(120, () => sprite.clearTint());
  }

  showFloatingText(text, x, y, color) {
    const t = this.add.text(x, y, text, {
      fontFamily: "monospace",
      fontSize: "24px",
      fontStyle: "bold",
      color,
    }).setOrigin(0.5).setDepth(30);

    this.tweens.add({
      targets: t,
      y: y - 45,
      alpha: 0,
      duration: 800,
      onComplete: () => t.destroy(),
    });
  }

  handleEnemyDefeated(attacker) {
    if (this.battleOver) return false;

    const enemy = this.enemy;
    const enemyLevel = enemy.level || 1;
    const xp = this.battleMode === "recruit" ? 40 * enemyLevel : 20 * enemyLevel;
    const recipientId = attacker?.isCaptain ? "captain" : (attacker?.crewId || "captain");

    if (this.isBossBattle) {
      this.bossExpRewards.push({
        recipientId,
        xp,
        winnerName: attacker?.name || this.battleData.playerName || "Capitaine",
        enemyName: enemy.name,
      });
    }

    this.locked = true;
    this.setLog(`💀 ${enemy.name} est K.O. !\n⭐ ${attacker?.name || "Capitaine"} gagne ${xp} XP !\n\n▶ CLIQUEZ OU APPUYEZ SUR UNE TOUCHE POUR CONTINUER`);
    this.showFloatingText(`+${xp} XP`, this.playerSprite.x, this.playerSprite.y - 95, "#f1c40f");
    this.showFloatingText("K.O. !", this.enemySprite.x, this.enemySprite.y - 90, "#e74c3c");

    this.waitForContinue(() => {
      if (this.battleOver) return;

      if (this.isBossBattle && this.bossEnemyIndex < this.enemyTeam.length - 1) {
        this.bossEnemyIndex += 1;
        this.enemy = this.enemyTeam[this.bossEnemyIndex];
        this.targetCharacterId = this.battleData.bossTeam[this.bossEnemyIndex].characterId;
        this.enemySprite.setTexture(spriteKey(this.targetCharacterId), 0);
        this.enemySprite.setAlpha(0);
        this.enemySprite.setScale(7);
        this.tweens.add({ targets: this.enemySprite, alpha: 1, duration: 350 });
        this.refreshBars();
        this.setLog(`${this.enemy.name} entre dans le combat !`);
        this.locked = false;
        this.showMainMenu();
        return;
      }

      this.endBattle(true, attacker);
    });

    return false;
  }

  handlePlayerDefeated() {
    if (this.battleOver) return false;

    const living = this.teamList.filter((m) => m.hp > 0);
    this.saveTeamState();

    if (!living.length) {
      this.endBattle(false);
      return false;
    }

    this.locked = true;
    this.setLog(`${this.player.name} est K.O. ! Choisissez un autre membre de l'équipage.\n\n▶ CLIQUEZ OU APPUYEZ SUR UNE TOUCHE`);

    this.waitForContinue(() => {
      if (!this.battleOver) this.showTeamMenu(true);
    });

    return false;
  }

  enemyReply() {
    if (isDefeated(this.enemy) || this.battleOver) return false;

    const moves = this.enemy.moves || ["taillade"];
    const key = moves[Math.floor(Math.random() * moves.length)];
    return this.executeMove(this.enemy, this.player, key);
  }

  attemptEscape() {
    if (this.locked || this.battleOver) return;

    this.clearInterfaceElements();
    this.locked = true;

    if (Math.random() < 0.3) {
      this.setLog("Impossible de fuir ! L'ennemi bloque le passage...");
      this.time.delayedCall(900, () => {
        const keep = this.enemyReply();
        if (keep !== false && !this.battleOver) {
          this.locked = false;
          this.showMainMenu();
        }
      });
      return;
    }

    this.setLog(`${this.player.name} réussit à fuir le combat !`);
    this.saveTeamState();
    this.time.delayedCall(1000, () => this.returnToWorld());
  }

  saveTeamState() {
    const state = this.game.registry.get("gameState") || {};
    state.crewDetails ||= {};

    this.teamList.forEach((m) => {
      if (m.isCaptain) {
        state.hp = m.hp;
        state.maxHp = m.maxHp;
        state.level = m.level || 1;
        state.exp = m.exp || 0;
        state.maxExp = m.maxExp || 100;
        state.moves = [...(m.moves || [])];
        state.ppData = { ...m.ppData };
      } else if (m.crewId) {
        state.crewDetails[m.crewId] = {
          hp: m.hp,
          maxHp: m.maxHp,
          atk: m.atk,
          def: m.def,
          spd: m.spd,
          level: m.level || 1,
          exp: m.exp || 0,
          maxExp: m.maxExp || 100,
          moves: [...(m.moves || [])],
          ppData: { ...m.ppData },
        };
      }
    });

    state.items = { ...this.items };
    this.game.registry.set("gameState", state);
    return state;
  }

  endBattle(playerWon, expRecipient = null) {
    if (this.battleOver) return;

    this.battleOver = true;
    this.clearInterfaceElements();

    const state = this.saveTeamState();
    const { returnIsland, returnX, returnY } = this.battleData;

    if (playerWon) {
      let expRewards = this.bossExpRewards || [];

      if (!this.isBossBattle && !expRewards.length) {
        const enemyLevel = this.enemy.level || 1;
        const exp = this.battleMode === "recruit" ? 40 * enemyLevel : 20 * enemyLevel;
        const id = expRecipient?.isCaptain ? "captain" : (expRecipient?.crewId || "captain");
        expRewards = [{
          recipientId: id,
          xp: exp,
          winnerName: expRecipient?.name || this.battleData.playerName || "Capitaine",
          enemyName: this.enemy.name,
        }];
      }

      const totalXp = expRewards.reduce((sum, reward) => sum + (Number(reward.xp) || 0), 0);
      const loot = this.battleMode === "recruit" ? 0 : (this.isBossBattle ? 1000 : 20 + Math.floor(Math.random() * 30));
      const lastWinner = expRecipient?.name || expRewards[expRewards.length - 1]?.winnerName || this.battleData.playerName || "Capitaine";
      const completeBossVictory = this.isBossBattle;
      const respawnMinutes = Number(this.battleData.bossRespawnMinutes) || 15;
      const bossRespawnAt = completeBossVictory ? Date.now() + respawnMinutes * 60 * 1000 : undefined;

      this.showFloatingText(`+${totalXp} XP`, 510, 385, "#f1c40f");
      this.setLog(completeBossVictory
        ? `🏆 Victoire !\n${lastWinner} et l'équipage remportent ${totalXp} XP au total !\n\n▶ CLIQUEZ OU APPUYEZ SUR UNE TOUCHE POUR CONTINUER`
        : `🏆 Victoire !\n${lastWinner} gagne ${totalXp} XP${loot ? ` et ${loot} berrys` : ""}.\n\n▶ CLIQUEZ OU APPUYEZ SUR UNE TOUCHE POUR CONTINUER`);

      this.waitForContinue(() => this.scene.start("World", {
        islandId: returnIsland || "ile-depart",
        x: returnX ?? 20,
        y: returnY ?? 5,
        berrysGained: loot,
        expGained: this.isBossBattle ? undefined : totalXp,
        expRecipientId: this.isBossBattle ? undefined : expRewards[0]?.recipientId,
        expRewards,
        battleVictory: true,
        battleWinnerName: lastWinner,
        bossVictory: completeBossVictory,
        bossId: this.battleData.bossId,
        bossUnlockFlag: this.battleData.bossUnlockFlag,
        bossRespawnAt,
        bossComplete: completeBossVictory,
        bossName: this.battleData.bossName,
        recruitedId: this.battleMode === "recruit" ? this.targetCharacterId : undefined,
      }));
    } else {
      this.setLog(`💀 Toute l'équipe est K.O. !\nRetour à la taverne.\n\n▶ CLIQUEZ OU APPUYEZ SUR UNE TOUCHE POUR CONTINUER`);
      this.showFloatingText("ÉQUIPE K.O. !", 510, 385, "#e74c3c");

      this.waitForContinue(() => {
        state.hp = state.maxHp || PLAYER_CHARACTER.maxHp;
        state.ppData = {};

        Object.values(state.crewDetails || {}).forEach((d) => {
          d.hp = d.maxHp;
          d.ppData = {};
        });

        const islandKey = state.islandId || returnIsland || "ile-depart";
        const island = ISLANDS[islandKey];

        state.respawnIsland ||= islandKey;
        state.respawnX ??= island?.tavern?.x ?? island?.playerStart?.x ?? returnX ?? 5;
        state.respawnY ??= island?.tavern?.y ?? island?.playerStart?.y ?? returnY ?? 5;

        this.game.registry.set("gameState", state);
        this.scene.start("World", { isRespawn: true });
      });
    }
  }

  returnToWorld() {
    const { returnIsland, returnX, returnY } = this.battleData;
    this.scene.start("World", {
      islandId: returnIsland || "ile-depart",
      x: returnX || 20,
      y: returnY || 5,
    });
  }
}