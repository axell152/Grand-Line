import Phaser from "phaser";
import { ISLANDS, STARTING_ISLAND, TILE_SIZE } from "@/game/data/islands";
import { CHARACTERS, ENEMY_CHARACTERS, PLAYER_CHARACTER } from "@/game/data/characters";
import { MOVES } from "@/game/data/moves";
import { STARTING_ITEMS } from "@/game/data/items";
import { saveGame, loadGame } from "@/game/systems/SaveManager";

const DIRECTIONS = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
};

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

function formatMoveStats(moveKey) {
  const move = MOVES[moveKey];
  if (!move) return "Attaque inconnue";

  const type = move.type ? move.type.toUpperCase() : "NORMAL";
  const precision = `${Math.round((move.accuracy ?? 1) * 100)}%`;
  const power = move.heal ? `Soin ${move.heal} PV` : `Puissance ${move.power}`;
  return `${type}  |  ${power}  |  Précision ${precision}  |  PP ${move.maxPp}`;
}

export default class WorldScene extends Phaser.Scene {
  constructor() {
    super("World");
  }

  preload() {
    this.load.image("taverne", "tiles/taverne.jpg");
  }

  init(data) {
    this.incoming = data || {};
    this.learningQueue = [];
    this.learningObjects = [];
  }

  create() {
    this.initState();

    this.isMoving = false;
    this.cursors = this.input.keyboard.createCursorKeys();

    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.Z,
      left: Phaser.Input.Keyboard.KeyCodes.Q,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    this.input.keyboard.on("keydown-E", () => this.interact());
    this.input.keyboard.on("keydown-SPACE", () => this.interact());

    this.input.keyboard.on("keydown-T", () => {
      this.scene.launch("CrewScene", { state: this.state });
      this.scene.pause();
    });

    const expRewards = Array.isArray(this.incoming.expRewards)
      ? this.incoming.expRewards
      : (typeof this.incoming.expGained === "number"
        ? [{ recipientId: this.incoming.expRecipientId || "captain", xp: this.incoming.expGained }]
        : []);

    if (expRewards.length) {
      const allLearnQueue = [];
      expRewards.forEach((reward) => {
        const result = this.applyExperience(reward.recipientId || "captain", reward.xp);
        if (result?.learnQueue?.length) allLearnQueue.push(...result.learnQueue);
      });
      this.persist();

      if (allLearnQueue.length) {
        this.learningQueue = [...allLearnQueue];
        this.time.delayedCall(250, () => this.showNextLearningPrompt());
      }
    }

    if (this.incoming.recruitedId) {
      const recruitedId = this.incoming.recruitedId;
      if (!this.state.crew.includes(recruitedId)) {
        this.state.crew.push(recruitedId);
      }
      if (!this.state.teamOrder.includes(recruitedId)) {
        this.state.teamOrder.push(recruitedId);
      }
      if (!this.state.crewDetails[recruitedId]) {
        const base = CHARACTERS[recruitedId];
        this.state.crewDetails[recruitedId] = {
          level: 1,
          exp: 0,
          maxExp: 100,
          hp: base?.maxHp || 1,
          maxHp: base?.maxHp || 1,
          atk: base?.atk || 1,
          def: base?.def || 1,
          spd: base?.spd || 1,
          moves: [...(base?.moves || [])].slice(0, 4),
          ppData: {},
        };
      }
      this.persist();
    }

    if (typeof this.incoming.berrysGained === "number") {
      this.state.berrys += this.incoming.berrysGained;
      this.persist();
    }

    if (this.incoming.bossVictory) {
      if (this.incoming.bossUnlockFlag) {
        this.state.progressFlags[this.incoming.bossUnlockFlag] = true;
      }

      if (this.incoming.bossId && this.incoming.bossRespawnAt) {
        this.state.bossRespawns[this.incoming.bossId] = this.incoming.bossRespawnAt;
      }

      this.persist();
    }

  if (this.incoming.battleVictory) {
  const xp = Array.isArray(this.incoming.expRewards)
    ? this.incoming.expRewards.reduce((sum, reward) => sum + (Number(reward.xp) || 0), 0)
    : (Number(this.incoming.expGained) || 0);
  const berrys = Number(this.incoming.berrysGained) || 0;
  const winner = this.incoming.battleWinnerName || "Le combattant";

  this.showVictoryReward(winner, xp, berrys);
}
    
    this.drawIsland();
    this.drawHud();
  }

  initState() {
    const registry = this.game.registry;

    if (!registry.get("gameState")) {
      const startingIslandData = ISLANDS[STARTING_ISLAND];
      const defaultX = startingIslandData.tavern
        ? startingIslandData.tavern.x
        : startingIslandData.playerStart.x;
      const defaultY = startingIslandData.tavern
        ? startingIslandData.tavern.y
        : startingIslandData.playerStart.y;

      registry.set("gameState", {
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
      });

      loadGame().then((save) => {
        if (save) {
          this.game.registry.set("gameState", {
            islandId: save.islandId,
            x: save.x,
            y: save.y,
            respawnIsland: save.respawnIsland || save.islandId,
            respawnX: save.respawnX !== undefined ? save.respawnX : save.x,
            respawnY: save.respawnY !== undefined ? save.respawnY : save.y,
            crew: save.crew || [],
            teamOrder: save.teamOrder || ["captain", ...(save.crew || [])],
            berrys: save.berrys || 0,
            level: save.level || 1,
            exp: save.exp || 0,
            maxExp: save.maxExp || 100,
            hp: save.hp !== undefined ? save.hp : PLAYER_CHARACTER.maxHp,
            maxHp: save.maxHp !== undefined ? save.maxHp : PLAYER_CHARACTER.maxHp,
            atk: save.atk ?? PLAYER_CHARACTER.atk,
            def: save.def ?? PLAYER_CHARACTER.def,
            spd: save.spd ?? PLAYER_CHARACTER.spd,
            moves: save.moves?.length ? save.moves.slice(0, 4) : [...PLAYER_CHARACTER.moves].slice(0, 4),
            ppData: save.ppData || {},
            crewDetails: save.crewDetails || {},
            items: save.items || { ...STARTING_ITEMS },
            progressFlags: save.progressFlags || {},
            openedChests: save.openedChests || {},
          });

          if (this.scene.isActive("World")) {
            this.scene.restart();
          }
        }
      });
    }

    this.state = registry.get("gameState");

    if (this.state.level === undefined) this.state.level = 1;
    if (this.state.exp === undefined) this.state.exp = 0;
    if (this.state.maxExp === undefined) this.state.maxExp = 100;
    if (this.state.hp === undefined) this.state.hp = PLAYER_CHARACTER.maxHp;
    if (this.state.maxHp === undefined) this.state.maxHp = PLAYER_CHARACTER.maxHp;
    if (this.state.atk === undefined) this.state.atk = PLAYER_CHARACTER.atk + (this.state.level - 1) * 2;
    if (this.state.def === undefined) this.state.def = PLAYER_CHARACTER.def + (this.state.level - 1);
    if (this.state.spd === undefined) this.state.spd = PLAYER_CHARACTER.spd + (this.state.level - 1);
    if (!Array.isArray(this.state.moves) || !this.state.moves.length) {
      this.state.moves = [...PLAYER_CHARACTER.moves].slice(0, 4);
    }
    this.state.moves = this.state.moves.slice(0, 4);
    if (this.state.respawnIsland === undefined) this.state.respawnIsland = this.state.islandId;
    if (this.state.respawnX === undefined) this.state.respawnX = this.state.x;
    if (this.state.respawnY === undefined) this.state.respawnY = this.state.y;
    if (this.state.teamOrder === undefined) this.state.teamOrder = ["captain", ...this.state.crew];
    if (this.state.ppData === undefined) this.state.ppData = {};
    if (this.state.crewDetails === undefined) this.state.crewDetails = {};
    if (this.state.items === undefined) this.state.items = { ...STARTING_ITEMS };
    if (this.state.progressFlags === undefined) this.state.progressFlags = {};
    if (this.state.openedChests === undefined) this.state.openedChests = {};
    if (this.state.bossRespawns === undefined) this.state.bossRespawns = {};

    Object.keys(this.state.crewDetails).forEach((id) => {
      const base = CHARACTERS[id];
      const detail = this.state.crewDetails[id];
      if (!base) return;
      detail.level ||= 1;
      detail.exp ||= 0;
      detail.maxExp ||= 100;
      detail.maxHp ||= base.maxHp + (detail.level - 1) * 8;
      detail.atk ??= base.atk + (detail.level - 1) * 2;
      detail.def ??= base.def + (detail.level - 1);
      detail.spd ??= base.spd + (detail.level - 1);
      detail.hp ??= detail.maxHp;
      if (!Array.isArray(detail.moves) || !detail.moves.length) {
        detail.moves = [...base.moves].slice(0, 4);
      }
      detail.moves = detail.moves.slice(0, 4);
      detail.ppData ||= {};
    });

    if (this.incoming.isRespawn) {
      this.state.islandId = this.state.respawnIsland;
      this.state.x = this.state.respawnX;
      this.state.y = this.state.respawnY;
    } else if (this.incoming.islandId) {
      this.state.islandId = this.incoming.islandId;
      this.state.x = this.incoming.x;
      this.state.y = this.incoming.y;
    }
  }

  applyExperience(memberId, amount) {
  const xp = Math.max(0, Number(amount) || 0);

  if (!xp) {
    return {
      learnQueue: [],
      levelsGained: 0,
    };
  }

  const learnQueue = [];
  let levelsGained = 0;

  const applyLevelUp = (target, base) => {
    target.level += 1;

    // XP nécessaire pour le prochain niveau.
    target.maxExp = Math.round(target.maxExp * 1.4);

    // Progression des statistiques.
    target.maxHp += 8;
    target.atk += 2;
    target.def += 1;
    target.spd += 1;

    // Lors d'un niveau gagné, on récupère quelques PV.
    target.hp = Math.min(
      target.maxHp,
      target.hp + 8
    );

    levelsGained += 1;

    // Vérifie si une nouvelle attaque est apprise.
    const learnset = base?.learnset || [];

    learnset
      .filter((entry) => entry.level === target.level)
      .forEach((entry) => {
        if (!entry.move) return;

        if (!Array.isArray(target.moves)) {
          target.moves = [];
        }

        // Déjà connue : rien à faire.
        if (target.moves.includes(entry.move)) {
          return;
        }

        learnQueue.push({
          memberId,
          memberName: target.name || base.name,
          moveKey: entry.move,
        });
      });
  };

  // ============================================================
  // CAPITAINE
  // ============================================================

  if (memberId === "captain") {
    const target = this.state;
    const base = PLAYER_CHARACTER;

    target.level ||= 1;
    target.exp ||= 0;
    target.maxExp ||= 100;

    target.maxHp ||= base.maxHp;

    target.atk ??=
      base.atk + (target.level - 1) * 2;

    target.def ??=
      base.def + (target.level - 1);

    target.spd ??=
      base.spd + (target.level - 1);

    target.moves = Array.isArray(target.moves)
      ? target.moves.slice(0, 4)
      : [...base.moves].slice(0, 4);

    // Ajout de l'XP.
    target.exp += xp;

    // Gestion de plusieurs niveaux d'un coup
    // si le joueur gagne beaucoup d'XP.
    while (target.exp >= target.maxExp) {
      target.exp -= target.maxExp;

      applyLevelUp(
        target,
        base
      );
    }

    return {
      learnQueue,
      levelsGained,
    };
  }

  // ============================================================
  // MEMBRE DE L'ÉQUIPAGE
  // ============================================================

  const base = CHARACTERS[memberId];

  if (!base) {
    return {
      learnQueue: [],
      levelsGained: 0,
    };
  }

  this.state.crewDetails ||= {};

  const detail =
    this.state.crewDetails[memberId] || {
      level: 1,
      exp: 0,
      maxExp: 100,

      hp: base.maxHp,
      maxHp: base.maxHp,

      atk: base.atk,
      def: base.def,
      spd: base.spd,

      moves: [...base.moves].slice(0, 4),

      ppData: {},
    };

  detail.name = base.name;

  detail.level ||= 1;
  detail.exp ||= 0;
  detail.maxExp ||= 100;

  detail.maxHp ||=
    base.maxHp + (detail.level - 1) * 8;

  detail.atk ??=
    base.atk + (detail.level - 1) * 2;

  detail.def ??=
    base.def + (detail.level - 1);

  detail.spd ??=
    base.spd + (detail.level - 1);

  detail.hp ??= detail.maxHp;

  detail.moves = Array.isArray(detail.moves)
    ? detail.moves.slice(0, 4)
    : [...base.moves].slice(0, 4);

  detail.ppData ||= {};

  // Ajout de l'XP au bon personnage.
  detail.exp += xp;

  // Gestion d'un ou plusieurs niveaux.
  while (detail.exp >= detail.maxExp) {
    detail.exp -= detail.maxExp;

    applyLevelUp(
      detail,
      base
    );
  }

  this.state.crewDetails[memberId] = detail;

  return {
    learnQueue,
    levelsGained,
  };
}

  clearLearningUI() {
    this.learningObjects.forEach((obj) => obj?.destroy?.());
    this.learningObjects = [];
  }

  addLearningText(text, x, y, style = {}) {
    const obj = this.add.text(x, y, text, {
      fontFamily: "monospace",
      color: "#ffffff",
      ...style,
    }).setScrollFactor(0).setDepth(5000);
    this.learningObjects.push(obj);
    return obj;
  }

  addLearningButton(label, x, y, width, action) {
    const bg = this.add.rectangle(x, y, width, 34, 0x173b5c, 1)
      .setStrokeStyle(2, 0xead9b8)
      .setInteractive({ useHandCursor: true })
      .setScrollFactor(0)
      .setDepth(5000);

    const txt = this.add.text(x, y, label, {
      fontFamily: "monospace",
      fontSize: "14px",
      color: "#ead9b8",
      align: "center",
      wordWrap: { width: width - 16 },
    }).setOrigin(0.5).setScrollFactor(0).setDepth(5001);

    bg.on("pointerover", () => txt.setColor("#ffffff"));
    bg.on("pointerout", () => txt.setColor("#ead9b8"));
    bg.on("pointerdown", action);

    this.learningObjects.push(bg, txt);
    return { bg, txt };
  }

  showNextLearningPrompt() {
    this.clearLearningUI();

    if (!this.learningQueue.length) {
      this.persist();
      this.updateHud();
      return;
    }

    const event = this.learningQueue.shift();
    const target = event.memberId === "captain"
      ? this.state
      : this.state.crewDetails[event.memberId];

    if (!target) {
      this.showNextLearningPrompt();
      return;
    }

    const newMove = MOVES[event.moveKey];
    if (!newMove) {
      this.showNextLearningPrompt();
      return;
    }

    const currentMoves = Array.isArray(target.moves) ? target.moves : [];

    // Si le personnage a encore une place, apprentissage automatique.
    if (currentMoves.length < 4) {
      currentMoves.push(event.moveKey);
      target.moves = currentMoves.slice(0, 4);
      target.ppData ||= {};
      target.ppData[event.moveKey] = newMove.maxPp;

      this.persist();
      this.showLearningMessage(
        `${event.memberName} apprend ${newMove.name} !`,
        () => this.showNextLearningPrompt()
      );
      return;
    }

    this.showReplaceMovePrompt(event, target, currentMoves);
  }

  showLearningMessage(title, onContinue) {
    const shade = this.add.rectangle(512, 384, 1024, 768, 0x000000, 0.65)
      .setScrollFactor(0).setDepth(4999);
    const panel = this.add.rectangle(512, 350, 720, 230, 0x0b2545, 1)
      .setStrokeStyle(3, 0xead9b8)
      .setScrollFactor(0).setDepth(5000);

    this.learningObjects.push(shade, panel);

    this.addLearningText("NOUVELLE ATTAQUE", 512, 285, {
      fontSize: "25px",
      color: "#f1c40f",
    }).setOrigin(0.5);

    this.addLearningText(title, 512, 345, {
      fontSize: "21px",
      align: "center",
    }).setOrigin(0.5);

    this.addLearningButton("CONTINUER", 512, 420, 220, () => {
      this.clearLearningUI();
      onContinue();
    });
  }

  showReplaceMovePrompt(event, target, currentMoves) {
    const newMove = MOVES[event.moveKey];

    const shade = this.add.rectangle(512, 384, 1024, 768, 0x000000, 0.72)
      .setScrollFactor(0).setDepth(4999);
    const panel = this.add.rectangle(512, 360, 900, 650, 0x0b2545, 1)
      .setStrokeStyle(3, 0xead9b8)
      .setScrollFactor(0).setDepth(5000);

    this.learningObjects.push(shade, panel);

    this.addLearningText(`${event.memberName} veut apprendre :`, 512, 100, {
      fontSize: "20px",
      align: "center",
    }).setOrigin(0.5);

    this.addLearningText(newMove.name, 512, 135, {
      fontSize: "30px",
      color: "#f1c40f",
      fontStyle: "bold",
    }).setOrigin(0.5);

    this.addLearningText(formatMoveStats(event.moveKey), 512, 180, {
      fontSize: "15px",
      color: "#ead9b8",
      align: "center",
    }).setOrigin(0.5);

    this.addLearningText("Vous avez déjà 4 attaques. Choisissez celle à remplacer :", 512, 225, {
      fontSize: "17px",
      align: "center",
    }).setOrigin(0.5);

    currentMoves.forEach((moveKey, index) => {
      const move = MOVES[moveKey];
      const y = 285 + index * 72;

      this.addLearningButton(
        `${index + 1}. ${move?.name || moveKey}`,
        512, y, 760,
        () => this.showMoveComparison(event, target, currentMoves, index)
      );

      this.addLearningText(formatMoveStats(moveKey), 512, y + 24, {
        fontSize: "12px",
        color: "#b9c6d3",
        align: "center",
      }).setOrigin(0.5);
    });

    this.addLearningButton("GARDER MES 4 ATTAQUES", 512, 590, 300, () => {
      this.persist();
      this.showLearningMessage(
        `${event.memberName} garde ses 4 attaques et n'apprend pas ${newMove.name}.`,
        () => this.showNextLearningPrompt()
      );
    });
  }

  showMoveComparison(event, target, currentMoves, replaceIndex) {
    const oldMoveKey = currentMoves[replaceIndex];
    const oldMove = MOVES[oldMoveKey];
    const newMove = MOVES[event.moveKey];

    this.clearLearningUI();

    const shade = this.add.rectangle(512, 384, 1024, 768, 0x000000, 0.72)
      .setScrollFactor(0).setDepth(4999);
    const panel = this.add.rectangle(512, 360, 900, 560, 0x0b2545, 1)
      .setStrokeStyle(3, 0xead9b8)
      .setScrollFactor(0).setDepth(5000);

    this.learningObjects.push(shade, panel);

    this.addLearningText("REMPLACER CETTE ATTAQUE ?", 512, 105, {
      fontSize: "24px",
      color: "#f1c40f",
    }).setOrigin(0.5);

    this.addLearningText(`ACTUELLE : ${oldMove?.name || oldMoveKey}`, 270, 165, {
      fontSize: "18px",
    }).setOrigin(0.5);

    this.addLearningText(`NOUVELLE : ${newMove.name}`, 755, 165, {
      fontSize: "18px",
      color: "#f1c40f",
    }).setOrigin(0.5);

    this.addLearningText(formatMoveStats(oldMoveKey), 270, 220, {
      fontSize: "14px",
      color: "#b9c6d3",
      align: "center",
      wordWrap: { width: 380 },
    }).setOrigin(0.5);

    this.addLearningText(formatMoveStats(event.moveKey), 755, 220, {
      fontSize: "14px",
      color: "#b9c6d3",
      align: "center",
      wordWrap: { width: 380 },
    }).setOrigin(0.5);

    this.addLearningButton("OUI, REMPLACER", 300, 330, 300, () => {
      target.moves = [...currentMoves];
      target.moves[replaceIndex] = event.moveKey;
      target.ppData ||= {};
      target.ppData[event.moveKey] = newMove.maxPp;
      delete target.ppData[oldMoveKey];

      this.persist();
      this.showLearningMessage(
        `${event.memberName} oublie ${oldMove?.name || oldMoveKey} et apprend ${newMove.name} !`,
        () => this.showNextLearningPrompt()
      );
    });

    this.addLearningButton("NON, GARDER L'ATTAQUE", 725, 330, 300, () => {
      this.showReplaceMovePrompt(event, target, currentMoves);
    });

    this.addLearningText(
      "Les 4 autres attaques restent inchangées.",
      512, 430,
      { fontSize: "15px", color: "#ead9b8", align: "center" }
    ).setOrigin(0.5);
  }

  persist() {
    this.game.registry.set("gameState", this.state);
    saveGame(this.state);
  }

  get island() {
    return ISLANDS[this.state.islandId];
  }

  drawIsland() {
    const island = this.island;
    this.tileLayer = this.add.group();
    this.npcSprites = {};

    const zoneColors = { 1: 0xffffff, 2: 0xf3c46a, 3: 0xe8895f, 4: 0xb07cd6 };
    const zoneAt = (x, y) =>
      island.wildZones.find((z) => x >= z.x1 && x <= z.x2 && y >= z.y1 && y <= z.y2);

    for (let y = 0; y < island.grid.length; y++) {
      const row = island.grid[y];
      for (let x = 0; x < row.length; x++) {
        const tile = row[x];
        let key = tile === "#" ? "tile-wall" : tile === "P" ? "tile-path" : "tile-floor";

        const zone = tile === "." ? zoneAt(x, y) : null;
        if (zone) key = "tile-wild";

        const img = this.add.image(
          x * TILE_SIZE + TILE_SIZE / 2,
          y * TILE_SIZE + TILE_SIZE / 2,
          key
        ).setDepth(0);

        if (zone) img.setTint(zoneColors[zone.level] || 0xe8895f);
      }
    }

    if (island.buildings) {
      island.buildings.forEach((b) => {
        const buildingSprite = this.add.image(
          b.x * TILE_SIZE + TILE_SIZE / 2,
          (b.y + 1) * TILE_SIZE,
          b.key
        ).setOrigin(0.5, 1).setDepth(b.y);

        buildingSprite.setScale(0.15);
      });
    }

    island.warps.forEach((warp) => {
      const locked = warp.lockedBy && !this.state.progressFlags?.[warp.lockedBy];
      const marker = this.add.image(
        warp.x * TILE_SIZE + TILE_SIZE / 2,
        warp.y * TILE_SIZE + TILE_SIZE / 2,
        "warp-marker"
      ).setDepth(warp.y);

      if (locked) {
        marker.setTint(0x7f8c8d);
        marker.setAlpha(0.8);
      }
    });

    // PNJ de dialogue.
    this.talkNpcSprites = {};
    (island.npcs || []).forEach((npc) => {
      const sprite = this.add.sprite(
        npc.x * TILE_SIZE + TILE_SIZE / 2,
        npc.y * TILE_SIZE + TILE_SIZE / 2,
        spriteKey(npc.characterId || "captain"),
        0
      );

      sprite.setScale(2.5);
      sprite.setOrigin(0.5, 0.78);
      sprite.setDepth(npc.y + 0.5);
      this.talkNpcSprites[`${npc.x},${npc.y}`] = npc;
    });

    // Coffres.
    this.chestSprites = {};
    (island.chests || []).forEach((chest) => {
      if (this.state.openedChests?.[chest.id]) return;

      const g = this.add.graphics().setDepth(chest.y + 0.4);
      const px = chest.x * TILE_SIZE + TILE_SIZE / 2;
      const py = chest.y * TILE_SIZE + TILE_SIZE / 2;
      g.fillStyle(0x8b5a2b, 1);
      g.fillRect(px - 11, py - 7, 22, 14);
      g.fillStyle(0xd4a24c, 1);
      g.fillRect(px - 11, py - 7, 22, 4);
      g.lineStyle(2, 0x3b2414, 1);
      g.strokeRect(px - 11, py - 7, 22, 14);
      this.chestSprites[`${chest.x},${chest.y}`] = chest;
    });

    // Boss d'île.
    this.bossSprite = null;
    if (island.boss && !this.state.progressFlags?.[island.boss.unlockFlag]) {
      const boss = island.boss;
      this.bossSprite = this.add.sprite(
        boss.x * TILE_SIZE + TILE_SIZE / 2,
        boss.y * TILE_SIZE + TILE_SIZE / 2,
        spriteKey(boss.enemyId),
        0
      );
      this.bossSprite.setScale(2.5);
      this.bossSprite.setOrigin(0.5, 0.78);
      this.bossSprite.setDepth(boss.y + 0.5);
    }

    island.recruitNpcs
      .filter((npc) => !this.state.crew.includes(npc.characterId))
      .forEach((npc) => {
        const sprite = this.add.sprite(
          npc.x * TILE_SIZE + TILE_SIZE / 2,
          npc.y * TILE_SIZE + TILE_SIZE / 2,
          spriteKey(npc.characterId),
          0
        );

        sprite.setScale(2.5);
        sprite.setOrigin(0.5, 0.78);
        sprite.setDepth(npc.y + 0.5);
        this.npcSprites[`${npc.x},${npc.y}`] = npc.characterId;
      });

    this.player = this.add.sprite(
      this.state.x * TILE_SIZE + TILE_SIZE / 2,
      this.state.y * TILE_SIZE + TILE_SIZE / 2,
      spriteKey("captain"),
      0
    );

    this.player.setScale(2.5);
    this.player.setOrigin(0.5, 0.78);
    this.player.setDepth(999);
    this.playerDirection = "down";
    this.player.play(`${spriteKey("captain")}-down`);
    this.cameras.main.setBounds(
  0,
  0,
  island.grid[0].length * TILE_SIZE,
  island.grid.length * TILE_SIZE
);

this.cameras.main.startFollow(this.player, true);
  }

showVictoryReward(winner, xp, berrys) {
  const width = this.scale.width;
  const height = this.scale.height;

  const objects = [];

  const overlay = this.add.rectangle(
    width / 2,
    height / 2,
    520,
    220,
    0x071a2d,
    0.96
  )
    .setStrokeStyle(3, 0xe8c96b)
    .setScrollFactor(0)
    .setDepth(10000);

  const title = this.add.text(
    width / 2,
    height / 2 - 75,
    "🏆 VICTOIRE !",
    {
      fontFamily: "monospace",
      fontSize: "30px",
      fontStyle: "bold",
      color: "#f1c40f",
      align: "center",
    }
  )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(10001);

  const reward = this.add.text(
    width / 2,
    height / 2 - 15,
    `${winner}\ngagne ${xp} XP`,
    {
      fontFamily: "monospace",
      fontSize: "20px",
      color: "#ffffff",
      align: "center",
      lineSpacing: 8,
    }
  )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(10001);

  const money = this.add.text(
    width / 2,
    height / 2 + 55,
    `💰 +${berrys} Berrys`,
    {
      fontFamily: "monospace",
      fontSize: "22px",
      fontStyle: "bold",
      color: "#f1c40f",
      align: "center",
    }
  )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(10001);

  const hint = this.add.text(
    width / 2,
    height / 2 + 95,
    "APPUYEZ SUR UNE TOUCHE OU CLIQUEZ",
    {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#aaaaaa",
      align: "center",
    }
  )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(10001);

  objects.push(overlay, title, reward, money, hint);

  let closed = false;

  const closePanel = () => {
    if (closed) return;
    closed = true;

    objects.forEach((obj) => obj.destroy());

    this.input.keyboard?.off("keydown", closePanel);
    this.input.off("pointerdown", closePanel);
  };

  // Touche clavier
  this.input.keyboard?.once("keydown", closePanel);

  // Clic souris
  this.input.once("pointerdown", closePanel);
}
  
  drawHud() {
    this.hudText = this.add.text(6, 6, "", {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#ead9b8",
      backgroundColor: "#0b2545cc",
      padding: { x: 6, y: 4 },
    }).setScrollFactor(0).setDepth(1000);

    this.updateHud();
  }

  updateHud() {
    const island = this.island;
    this.hudText?.setText(
      `${island.name}\nÉquipage: ${this.state.crew.length} | Berrys: ${this.state.berrys} | Nv.${this.state.level} | XP: ${this.state.exp}/${this.state.maxExp} | PV: ${this.state.hp}/${this.state.maxHp}`
    );
  }

  tileAt(x, y) {
    const island = this.island;
    if (y < 0 || y >= island.grid.length) return "#";
    const row = island.grid[y];
    if (x < 0 || x >= row.length) return "#";
    return row[x];
  }

  update() {
    if (this.isMoving || this.learningObjects.length) return;

    let dir = null;
    if (this.cursors.left.isDown || this.wasd.left.isDown) dir = "left";
    else if (this.cursors.right.isDown || this.wasd.right.isDown) dir = "right";
    else if (this.cursors.up.isDown || this.wasd.up.isDown) dir = "up";
    else if (this.cursors.down.isDown || this.wasd.down.isDown) dir = "down";

    if (!dir) return;

    const { dx, dy } = DIRECTIONS[dir];
    this.playerDirection = dir;
    const captainKey = spriteKey("captain");

    if (dir === "left") {
      this.player.setFlipX(true);
      this.player.play(`${captainKey}-side`, true);
    } else if (dir === "right") {
      this.player.setFlipX(false);
      this.player.play(`${captainKey}-side`, true);
    } else {
      this.player.setFlipX(false);
      this.player.play(`${captainKey}-${dir}`, true);
    }

    const targetX = this.state.x + dx;
    const targetY = this.state.y + dy;
    const key = `${targetX},${targetY}`;

    if (this.npcSprites[key]) {
      this.startBattle({ mode: "recruit", characterId: this.npcSprites[key] });
      return;
    }

    const talkNpc = this.talkNpcSprites?.[key];
    if (talkNpc) {
      this.showNpcDialog(talkNpc);
      return;
    }

    const lockedWarp = this.island.warps.find(
      (warp) =>
        warp.x === targetX &&
        warp.y === targetY &&
        warp.lockedBy &&
        !this.state.progressFlags?.[warp.lockedBy]
    );

    if (lockedWarp) {
      this.showMessage("PASSAGE BLOQUÉ", "Bats le boss de cette île pour continuer.");
      return;
    }

    if (this.tileAt(targetX, targetY) === "#") return;

    this.isMoving = true;
    this.state.x = targetX;
    this.state.y = targetY;
    this.player.setDepth(999);

    this.tweens.add({
      targets: this.player,
      x: targetX * TILE_SIZE + TILE_SIZE / 2,
      y: targetY * TILE_SIZE + TILE_SIZE / 2,
      duration: 140,
      onComplete: () => {
        this.isMoving = false;
        const idleFrame = { down: 0, up: 6, left: 8, right: 8 }[this.playerDirection] ?? 0;
        this.player.stop();
        this.player.setFrame(idleFrame);
        this.persist();
        this.checkTileEvents(targetX, targetY);
      },
    });
  }

  checkTileEvents(x, y) {
    const island = this.island;

    const chest = (island.chests || []).find(
      (c) => c.x === x && c.y === y && !this.state.openedChests?.[c.id]
    );

    if (chest) {
      this.openChest(chest);
      return;
    }

    if (
      island.boss &&
      x === island.boss.x &&
      y === island.boss.y &&
      !this.isBossOnCooldown(island.boss)
    ) {
      this.startBattle({
        mode: "wild",
        characterId: island.boss.enemyId,
        enemyLevel: island.boss.level,
        boss: true,
        bossId: island.boss.id,
        bossTeam: island.boss.team,
        bossRespawnMinutes: island.boss.respawnMinutes || 15,
        bossName: island.boss.name,
        bossUnlockFlag: island.boss.unlockFlag,
      });
      return;
    }

    if (island.tavern && island.tavern.x === x && island.tavern.y === y) {
      this.state.respawnIsland = this.state.islandId;
      this.state.respawnX = x;
      this.state.respawnY = y;

      this.state.hp = this.state.maxHp;
      this.state.ppData = {};

      Object.keys(this.state.crewDetails || {}).forEach((id) => {
        const detail = this.state.crewDetails[id];
        detail.hp = detail.maxHp;
        detail.ppData = {};
      });

      this.persist();
      this.updateHud();
      return;
    }

    const warp = island.warps.find((w) => w.x === x && w.y === y);
    if (warp) {
      if (warp.lockedBy && !this.state.progressFlags?.[warp.lockedBy]) {
        this.showMessage("PASSAGE BLOQUÉ", "Bats le boss de cette île pour continuer.");
        return;
      }

      this.scene.restart({ islandId: warp.toIsland, x: warp.toX, y: warp.toY });
      return;
    }

    const zone = island.wildZones.find(
      (z) => x >= z.x1 && x <= z.x2 && y >= z.y1 && y <= z.y2
    );

    if (zone && Math.random() < zone.encounterRate) {
      const pool = zone.enemyPool && zone.enemyPool.length
        ? zone.enemyPool
        : Object.keys(ENEMY_CHARACTERS);

      const randomId = pool[Math.floor(Math.random() * pool.length)];
      this.startBattle({
        mode: "wild",
        characterId: randomId,
        enemyLevel: zone.level || 1,
      });
      return;
    }

    this.updateHud();
  }

  showMessage(title, message) {
    if (this.messageGroup) this.messageGroup.destroy(true);

    const width = this.scale.width;
    const height = this.scale.height;
    this.messageGroup = this.add.group();

    const bg = this.add.rectangle(
      width / 2,
      height / 2,
      520,
      180,
      0x071a2d,
      0.97
    ).setStrokeStyle(3, 0xe8c96b).setScrollFactor(0).setDepth(12000);

    const titleText = this.add.text(width / 2, height / 2 - 55, title, {
      fontFamily: "monospace",
      fontSize: "24px",
      fontStyle: "bold",
      color: "#f1c40f",
      align: "center",
    }).setOrigin(0.5).setScrollFactor(0).setDepth(12001);

    const body = this.add.text(width / 2, height / 2 + 5, message, {
      fontFamily: "monospace",
      fontSize: "16px",
      color: "#ffffff",
      align: "center",
      wordWrap: { width: 450 },
    }).setOrigin(0.5).setScrollFactor(0).setDepth(12001);

    const hint = this.add.text(width / 2, height / 2 + 62, "E / ESPACE / CLIC", {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#aaaaaa",
    }).setOrigin(0.5).setScrollFactor(0).setDepth(12001);

    this.messageGroup.addMultiple([bg, titleText, body, hint]);

    const close = () => {
      this.messageGroup?.destroy(true);
      this.messageGroup = null;
      this.input.keyboard?.off("keydown-E", close);
      this.input.keyboard?.off("keydown-SPACE", close);
      this.input.off("pointerdown", close);
    };

    this.time.delayedCall(100, () => {
      this.input.keyboard?.on("keydown-E", close);
      this.input.keyboard?.on("keydown-SPACE", close);
      this.input.on("pointerdown", close);
    });
  }

  showNpcDialog(npc) {
    if (this.dialogGroup) {
      this.dialogGroup.destroy(true);
      this.dialogGroup = null;
      return;
    }

    const lines = Array.isArray(npc.dialogue) ? npc.dialogue : [String(npc.dialogue || "")];
    if (npc.setFlag) {
      this.state.progressFlags[npc.setFlag] = true;
      this.persist();
    }

    let page = 0;
    const drawPage = () => {
      this.dialogGroup?.destroy(true);
      this.dialogGroup = this.add.group();

      const width = this.scale.width;
      const height = this.scale.height;
      const bg = this.add.rectangle(width / 2, height - 105, 820, 150, 0x071522, 0.97)
        .setStrokeStyle(3, 0xe8c96b)
        .setScrollFactor(0)
        .setDepth(11000);

      const name = this.add.text(125, height - 165, npc.name || "PNJ", {
        fontFamily: "monospace",
        fontSize: "18px",
        fontStyle: "bold",
        color: "#f1c40f",
      }).setScrollFactor(0).setDepth(11001);

      const text = this.add.text(125, height - 130, lines[page], {
        fontFamily: "monospace",
        fontSize: "16px",
        color: "#ffffff",
        wordWrap: { width: 690 },
      }).setScrollFactor(0).setDepth(11001);

      const hint = this.add.text(760, height - 72, page < lines.length - 1 ? "E ▶" : "E ✕", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#aaaaaa",
      }).setScrollFactor(0).setDepth(11001);

      this.dialogGroup.addMultiple([bg, name, text, hint]);
    };

    const next = () => {
      if (!this.dialogGroup) return;
      if (page < lines.length - 1) {
        page += 1;
        drawPage();
      } else {
        this.dialogGroup.destroy(true);
        this.dialogGroup = null;
        this.input.keyboard?.off("keydown-E", next);
        this.input.keyboard?.off("keydown-SPACE", next);
      }
    };

    this.time.delayedCall(100, () => {
      this.input.keyboard?.on("keydown-E", next);
      this.input.keyboard?.on("keydown-SPACE", next);
      this.input.once("pointerdown", next);
    });

    drawPage();
  }

  openChest(key, chest) {
  if (!chest || chest.opened) return;

  chest.opened = true;

  // Récompense du coffre
  const reward = chest.reward || {};
  const berryReward = Number(reward.berrys || 0);

  if (berryReward > 0) {
    this.state.berrys = (this.state.berrys || 0) + berryReward;
  }

  if (reward.item) {
    this.state.items = this.state.items || {};
    this.state.items[reward.item] =
      (this.state.items[reward.item] || 0) + (reward.quantity || 1);
  }

  // Supprime uniquement le véritable objet graphique Phaser
  const sprite = this.chestGraphics?.[key];

  if (sprite && typeof sprite.destroy === "function") {
    sprite.destroy();
  }

  if (this.chestGraphics) {
    delete this.chestGraphics[key];
  }

  // Sauvegarde le coffre comme ouvert
  this.state.openedChests = this.state.openedChests || {};
  this.state.openedChests[key] = true;

  this.persist();

  let message = "Coffre ouvert !";

  if (berryReward > 0) {
    message += `\n+${berryReward} Berrys`;
  }

  if (reward.item) {
    const quantity = reward.quantity || 1;
    message += `\n+${quantity} ${reward.item}`;
  }

  this.showMessage(message);
}

  interact() {
    if (this.isMoving || this.learningObjects.length || this.dialogGroup || this.messageGroup) return;

    const { dx, dy } = DIRECTIONS[this.playerDirection] || DIRECTIONS.down;
    const x = this.state.x + dx;
    const y = this.state.y + dy;
    const key = `${x},${y}`;

    const npc = this.talkNpcSprites?.[key];
    if (npc) {
      this.showNpcDialog(npc);
      return;
    }

    const chest = this.chestSprites?.[key];
    if (chest) {
      this.openChest(chest);
      return;
    }

    const boss = this.island.boss;
    if (
      boss &&
      boss.x === x &&
      boss.y === y &&
      !this.isBossOnCooldown(boss)
    ) {
      this.startBattle({
        mode: "wild",
        characterId: boss.enemyId,
        enemyLevel: boss.level,
        boss: true,
        bossId: boss.id,
        bossTeam: boss.team,
        bossRespawnMinutes: boss.respawnMinutes || 15,
        bossName: boss.name,
        bossUnlockFlag: boss.unlockFlag,
      });
    }
  }

  isBossOnCooldown(boss) {
    if (!boss?.id) return false;
    const respawnAt = Number(this.state.bossRespawns?.[boss.id] || 0);
    return respawnAt > Date.now();
  }

  startBattle({ mode, characterId, enemyLevel, boss = false, bossId, bossTeam, bossRespawnMinutes, bossName, bossUnlockFlag }) {
    this.scene.start("Battle", {
      mode,
      characterId,
      enemyLevel,
      boss,
      bossId,
      bossTeam,
      bossRespawnMinutes,
      bossName,
      bossUnlockFlag,
      crew: this.state.crew,
      teamOrder: this.state.teamOrder,
      playerLevel: this.state.level,
      playerExp: this.state.exp,
      playerMaxExp: this.state.maxExp,
      playerCurrentHp: this.state.hp,
      playerMaxHp: this.state.maxHp,
      playerAtk: this.state.atk,
      playerDef: this.state.def,
      playerSpd: this.state.spd,
      playerMoves: this.state.moves,
      playerPpData: this.state.ppData,
      crewDetails: this.state.crewDetails,
      items: this.state.items,
      returnIsland: this.state.islandId,
      returnX: this.state.x,
      returnY: this.state.y,
    });
  }
}
