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

    const enemySource = this.battleMode === "recruit"
      ? CHARACTERS[d.characterId]
      : scaleEnemyForLevel(ENEMY_CHARACTERS[d.characterId || "marineRecrue"], d.enemyLevel || 1);

    const level = d.playerLevel || 1;
    const captain = createBattler({
      ...PLAYER_CHARACTER,
      level,
      maxHp: d.playerMaxHp ?? (PLAYER_CHARACTER.maxHp + (level - 1) * 8),
      atk: PLAYER_CHARACTER.atk + (level - 1) * 2,
      def: PLAYER_CHARACTER.def + (level - 1),
      spd: PLAYER_CHARACTER.spd + (level - 1),
    });
    captain.isCaptain = true;
    captain.crewId = "captain";
    if (d.playerCurrentHp !== undefined) captain.hp = Math.min(d.playerCurrentHp, captain.maxHp);
    captain.ppData = { ...(d.playerPpData || {}) };

    this.enemy = createBattler(enemySource);
    this.enemy.type = this.enemy.type || "tranchant";

    const order = d.teamOrder?.length ? d.teamOrder : ["captain", ...(d.crew || [])];
    this.teamList = order.map((entry) => {
      if (entry === "captain") return captain;
      if (!d.crew?.includes(entry) || !CHARACTERS[entry]) return null;
      const base = CHARACTERS[entry];
      const saved = this.crewDetails[entry] || {};
      const lvl = saved.level || 1;
      const member = createBattler({
        ...base, level: lvl,
        maxHp: saved.maxHp || base.maxHp + (lvl - 1) * 8,
        atk: base.atk + (lvl - 1) * 2,
        def: base.def + (lvl - 1),
        spd: base.spd + (lvl - 1),
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
      ? `${this.enemy.name} vous barre la route. Que faites-vous ?`
      : `Un ${this.enemy.name} sauvage apparaît ! Que faites-vous ?`);
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
    const enemyId = this.targetCharacterId || "marineRecrue";
    this.enemySprite = this.add.sprite(760, 245, spriteKey(enemyId), 1).setScale(7).setOrigin(0.5, 0.82).setDepth(10);
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
    this.logText = this.add.text(60, 615, "", { fontFamily: "monospace", fontSize: "18px", color: "#ffffff", wordWrap: { width: 580 } });
  }
  setLog(text) { this.logText?.setText(text); }

  clearInterfaceElements() {
    this.menuGroup?.destroy(true);
    this.menuGroup = this.add.group();
  }

  makeButton(label, x, y, action, enabled = true) {
    const txt = this.add.text(x, y, label, { fontFamily: "monospace", fontSize: "19px", color: enabled ? "#ead9b8" : "#5d6570" })
      .setInteractive({ useHandCursor: enabled });
    if (enabled) txt.on("pointerdown", action).on("pointerover", () => txt.setColor("#ffffff")).on("pointerout", () => txt.setColor("#ead9b8"));
    this.menuGroup.add(txt); return txt;
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
    this.clearInterfaceElements(); this.addMenuBox();
    this.makeButton("[RETOUR]", 900, 570, () => this.showMainMenu(), true);
    (this.player.moves || ["taillade"]).forEach((key, i) => {
      const move = MOVES[key] || { name: key, maxPp: 10, accuracy: 1 };
      const pp = this.player.ppData[key] ?? move.maxPp;
      this.makeButton(`• ${move.name}  ${pp}/${move.maxPp}`, 640, 615 + i * 30, () => {
        this.player.ppData[key] = Math.max(0, pp - 1);
        this.clearInterfaceElements(); this.playerTurnAction(key);
      }, pp > 0);
    });
  }

  showItemsMenu() {
    this.clearInterfaceElements(); this.addMenuBox();
    this.makeButton("[RETOUR]", 900, 570, () => this.showMainMenu());
    Object.keys(ITEMS).forEach((id, i) => {
      const item = ITEMS[id]; const count = this.items[id] || 0;
      const usable = count > 0 && this.player.hp > 0 && this.player.hp < this.player.maxHp;
      this.makeButton(`• ${item.name} x${count}`, 640, 615 + i * 30, () => this.useItem(id), usable);
    });
    this.setLog("Les objets restaurent les PV et consomment le tour.");
  }

  showTeamMenu(forceSwitch = false) {
    this.clearInterfaceElements(); this.addMenuBox();
    if (!forceSwitch) this.makeButton("[RETOUR]", 900, 570, () => this.showMainMenu());
    else this.menuGroup.add(this.add.text(640, 585, "⚠ CHOISISSEZ UN PERSONNAGE VIVANT", { fontFamily: "monospace", fontSize: "14px", color: "#e67e22" }));

    this.teamList.forEach((member, index) => {
      const y = 615 + index * 26;
      const current = member === this.player;
      const alive = member.hp > 0;
      const canSelect = alive && (!current || forceSwitch);
      this.makeButton(`• ${member.name}  ${member.hp}/${member.maxHp} PV`, 640, y, () => this.switchCharacter(member, forceSwitch), canSelect);
    });
  }

  switchCharacter(newMember, forced = false) {
    if (this.battleOver || !newMember || newMember.hp <= 0 || (!forced && this.locked) || (!forced && newMember === this.player)) return;
    this.clearInterfaceElements(); this.locked = true;
    const old = this.player;
    this.player = newMember;
    this.playerSprite.setTexture(spriteKey(newMember.crewId), 1);
    this.setLog(`${old.name} ${old.hp <= 0 ? "est K.O." : "revient à bord"} ! ${newMember.name} prend sa place.`);
    this.refreshBars();
    this.playerSprite.setAlpha(0.4);
    this.tweens.add({ targets: this.playerSprite, alpha: 1, duration: 350 });
    this.time.delayedCall(850, () => {
      if (this.battleOver) return;
      if (forced) { this.locked = false; this.showMainMenu(); return; }
      const keep = this.enemyReply();
      if (keep !== false && !this.battleOver) { this.locked = false; this.showMainMenu(); }
    });
  }


  useItem(id) {
    if (this.locked || this.battleOver || !this.items[id] || !ITEMS[id]) return;
    const item = ITEMS[id];
    if (this.player.hp >= this.player.maxHp) { this.setLog("Les PV sont déjà au maximum."); return; }
    this.items[id] -= 1; this.locked = true; this.clearInterfaceElements();
    const before = this.player.hp;
    this.player.hp = Math.min(this.player.maxHp, this.player.hp + item.heal);
    this.setLog(`${this.player.name} utilise ${item.name} et récupère ${this.player.hp - before} PV !`);
    this.showFloatingText(`+${this.player.hp - before} PV`, this.playerSprite.x, this.playerSprite.y - 70, "#9fd18f");
    this.refreshBars();
    this.time.delayedCall(900, () => {
      const keep = this.enemyReply();
      if (keep !== false && !this.battleOver) { this.locked = false; this.showMainMenu(); }
    });
  }

  playerTurnAction(moveKey) {
    if (this.locked || this.battleOver) return;
    this.locked = true;
    const order = getTurnOrder(this.player, this.enemy);
    const first = order[0] === this.player;
    const steps = first
      ? [() => this.executeMove(this.player, this.enemy, moveKey), () => this.enemyReply()]
      : [() => this.enemyReply(), () => this.executeMove(this.player, this.enemy, moveKey)];
    this.runSequence(steps);
  }

  runSequence(steps, i = 0) {
    if (i >= steps.length || this.battleOver) {
      if (!this.battleOver) { this.player.defending = false; this.locked = false; this.showMainMenu(); }
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
      this.showFloatingText(`${result.critical ? "CRIT ! " : ""}-${result.damage}`, targetSprite.x, targetSprite.y - 65, result.critical ? "#f1c40f" : "#ffffff");
      this.animateAttack(attacker === this.player ? this.playerSprite : this.enemySprite, targetSprite);
    }
    if (result.heal) this.showFloatingText(`+${result.heal} PV`, attacker === this.player ? this.playerSprite.x : this.enemySprite.x, (attacker === this.player ? this.playerSprite.y : this.enemySprite.y) - 65, "#9fd18f");
    if (isDefeated(defender)) {
      if (defender === this.enemy) { this.endBattle(true, attacker); }
      else { this.handlePlayerDefeated(); }
      return false;
    }
    return true;
  }

  animateAttack(from, to) {
    if (!from || !to) return;
    const x = from.x, y = from.y;
    this.tweens.add({ targets: from, x: to.x + (from === this.playerSprite ? -70 : 70), duration: 180, yoyo: true, onComplete: () => { from.x = x; from.y = y; } });
  }
  flashSprite(sprite) {
    sprite.setTint(0xffffff);
    this.time.delayedCall(120, () => sprite.clearTint());
  }
  showFloatingText(text, x, y, color) {
    const t = this.add.text(x, y, text, { fontFamily: "monospace", fontSize: "24px", fontStyle: "bold", color }).setOrigin(0.5).setDepth(30);
    this.tweens.add({ targets: t, y: y - 45, alpha: 0, duration: 800, onComplete: () => t.destroy() });
  }

  handlePlayerDefeated() {
    if (this.battleOver) return false;
    this.player.defending = false;
    const living = this.teamList.filter((m) => m.hp > 0);
    this.saveTeamState();
    if (!living.length) { this.endBattle(false); return false; }
    this.locked = true;
    this.setLog(`${this.player.name} est K.O. ! Choisissez un autre membre de l'équipage.`);
    this.time.delayedCall(650, () => { if (!this.battleOver) this.showTeamMenu(true); });
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
    this.clearInterfaceElements(); this.locked = true;
    if (Math.random() < 0.3) {
      this.setLog("Impossible de fuir ! L'ennemi bloque le passage...");
      this.time.delayedCall(900, () => {
        const keep = this.enemyReply();
        if (keep !== false && !this.battleOver) { this.locked = false; this.showMainMenu(); }
      });
      return;
    }
    this.setLog("Vous avez réussi à fuir le combat !"); this.saveTeamState();
    this.time.delayedCall(1000, () => this.returnToWorld());
  }

  saveTeamState() {
    const state = this.game.registry.get("gameState") || {};
    state.crewDetails ||= {};
    this.teamList.forEach((m) => {
      if (m.isCaptain) {
        state.hp = m.hp; state.maxHp = m.maxHp; state.ppData = { ...m.ppData };
      } else if (m.crewId) {
        state.crewDetails[m.crewId] = {
          hp: m.hp, maxHp: m.maxHp, level: m.level || 1,
          exp: m.exp || 0, maxExp: m.maxExp || 100, ppData: { ...m.ppData },
        };
      }
    });
    state.items = { ...this.items };
    this.game.registry.set("gameState", state);
    return state;
  }

  endBattle(playerWon, expRecipient = null) {
    if (this.battleOver) return;
    this.battleOver = true; this.clearInterfaceElements();
    const state = this.saveTeamState();
    const { returnIsland, returnX, returnY } = this.battleData;
    if (playerWon) {
      const exp = (this.battleMode === "recruit" ? 40 : 20) * (this.enemy.level || 1);
      const id = expRecipient?.isCaptain ? "captain" : (expRecipient?.crewId || "captain");
      const loot = this.battleMode === "recruit" ? 0 : 20 + Math.floor(Math.random() * 30);
      if (this.battleMode !== "recruit") state.berrys = (state.berrys || 0) + loot;
      this.showFloatingText(`+${exp} XP`, 510, 385, "#f1c40f");
      this.setLog(`Victoire ! ${expRecipient?.name || "Le combattant"} gagne ${exp} XP${loot ? ` et ${loot} berrys` : ""}.`);
      this.time.delayedCall(1800, () => this.scene.start("World", { islandId: returnIsland || "start", x: returnX || 20, y: returnY || 5, berrysGained: 0, expGained: exp, expRecipientId: id }));
    } else {
      this.setLog("Toute votre équipe est K.O... Réveil d'urgence à la taverne !");
      this.time.delayedCall(1700, () => {
        state.hp = state.maxHp || PLAYER_CHARACTER.maxHp; state.ppData = {};
        Object.values(state.crewDetails || {}).forEach((d) => { d.hp = d.maxHp; d.ppData = {}; });
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
    this.scene.start("World", { islandId: returnIsland || "ile-depart", x: returnX || 20, y: returnY || 5 });
  }
}
