import Phaser from "phaser";
import { ISLANDS, STARTING_ISLAND, TILE_SIZE } from "@/game/data/islands";
import { CHARACTERS, ENEMY_CHARACTERS } from "@/game/data/characters";
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

export default class WorldScene extends Phaser.Scene {
  constructor() {
    super("World");
  }

  preload() {
    this.load.image("taverne", "tiles/taverne.jpg");
  }
  
  init(data) {
    this.incoming = data || {};
  }

  create() {
    this.initState();

    this.isMoving = false;
    this.cursors = this.input.keyboard.createCursorKeys();
    
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.Z,
      left: Phaser.Input.Keyboard.KeyCodes.Q,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    this.input.keyboard.on('keydown-T', () => {
      this.scene.launch("CrewScene", { state: this.state });
      this.scene.pause();
    });

    if (typeof this.incoming.expGained === "number") {
      this.applyExperience(
        this.incoming.expRecipientId || "captain",
        this.incoming.expGained
      );
      this.persist();
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
          ppData: {},
        };
      }
      this.persist();
    }
    if (typeof this.incoming.berrysGained === "number") {
      this.state.berrys += this.incoming.berrysGained;
      this.persist();
    }

    this.drawIsland();
    this.drawHud();
  }

  initState() {
    const registry = this.game.registry;
    if (!registry.get("gameState")) {
      const startingIslandData = ISLANDS[STARTING_ISLAND];
      const defaultX = startingIslandData.tavern ? startingIslandData.tavern.x : startingIslandData.playerStart.x;
      const defaultY = startingIslandData.tavern ? startingIslandData.tavern.y : startingIslandData.playerStart.y;

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
        hp: 100,
        maxHp: 100,
        ppData: {},
        crewDetails: {},
        items: { ...STARTING_ITEMS },
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
            hp: save.hp !== undefined ? save.hp : 100,
            maxHp: save.maxHp !== undefined ? save.maxHp : 100,
            ppData: save.ppData || {},
            crewDetails: save.crewDetails || {},
            items: save.items || { ...STARTING_ITEMS },
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
    if (this.state.hp === undefined) this.state.hp = 100;
    if (this.state.maxHp === undefined) this.state.maxHp = 100;
    if (this.state.respawnIsland === undefined) this.state.respawnIsland = this.state.islandId;
    if (this.state.respawnX === undefined) this.state.respawnX = this.state.x;
    if (this.state.respawnY === undefined) this.state.respawnY = this.state.y;
    if (this.state.teamOrder === undefined) this.state.teamOrder = ["captain", ...this.state.crew];
    if (this.state.ppData === undefined) this.state.ppData = {};
    if (this.state.crewDetails === undefined) this.state.crewDetails = {};
    if (this.state.items === undefined) this.state.items = { ...STARTING_ITEMS };

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
    if (!xp) return;

    if (memberId === "captain") {
      this.state.exp += xp;

      while (this.state.exp >= this.state.maxExp) {
        this.state.exp -= this.state.maxExp;
        this.state.level += 1;
        this.state.maxExp = Math.round(this.state.maxExp * 1.4);
        this.state.maxHp += 8;
        this.state.hp = Math.min(this.state.maxHp, this.state.hp + 8);
      }
      return;
    }

    const base = CHARACTERS[memberId];
    if (!base) return;

    this.state.crewDetails = this.state.crewDetails || {};
    const detail = this.state.crewDetails[memberId] || {
      level: 1,
      exp: 0,
      maxExp: 100,
      hp: base.maxHp,
      maxHp: base.maxHp,
      ppData: {},
    };

    detail.level = detail.level || 1;
    detail.exp = detail.exp || 0;
    detail.maxExp = detail.maxExp || 100;
    detail.maxHp = detail.maxHp || base.maxHp + (detail.level - 1) * 8;
    detail.hp = detail.hp ?? detail.maxHp;
    detail.exp += xp;

    while (detail.exp >= detail.maxExp) {
      detail.exp -= detail.maxExp;
      detail.level += 1;
      detail.maxExp = Math.round(detail.maxExp * 1.4);
      detail.maxHp += 8;
      detail.hp = Math.min(detail.maxHp, detail.hp + 8);
    }

    this.state.crewDetails[memberId] = detail;
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

        const img = this.add
          .image(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2, key)
          .setDepth(0);
        if (zone) img.setTint(zoneColors[zone.level] || 0xe8895f);
      }
    }

    if (island.buildings) {
      island.buildings.forEach((b) => {
        const buildingSprite = this.add.image(
          b.x * TILE_SIZE + TILE_SIZE / 2,
          (b.y + 1) * TILE_SIZE,
          b.key
        )
        .setOrigin(0.5, 1)
        .setDepth(b.y);

        buildingSprite.setScale(0.15); 
      });
    }

    island.warps.forEach((warp) => {
      this.add.image(
        warp.x * TILE_SIZE + TILE_SIZE / 2,
        warp.y * TILE_SIZE + TILE_SIZE / 2,
        "warp-marker"
      ).setDepth(warp.y);
    });

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

    this.cameras.main.setBounds(0, 0, island.grid[0].length * TILE_SIZE, island.grid.length * TILE_SIZE);
    this.cameras.main.startFollow(this.player, true);
  }

  drawHud() {
    this.hudText = this.add
      .text(6, 6, "", {
        fontFamily: "monospace",
        fontSize: "12px",
        color: "#ead9b8",
        backgroundColor: "#0b2545cc",
        padding: { x: 6, y: 4 },
      })
      .setScrollFactor(0)
      .setDepth(1000);
    this.updateHud();
  }

  updateHud() {
    const island = this.island;
    this.hudText.setText(
      `${island.name}\nÉquipage: ${this.state.crew.length} | Berrys: ${this.state.berrys} | Nv.${this.state.level} | PV: ${this.state.hp}/${this.state.maxHp}`
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
    if (this.isMoving) return;

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
      this.scene.restart({ islandId: warp.toIsland, x: warp.toX, y: warp.toY });
      return;
    }

    const zone = island.wildZones.find(
      (z) => x >= z.x1 && x <= z.x2 && y >= z.y1 && y <= z.y2
    );
    if (zone && Math.random() < zone.encounterRate) {
      const pool = zone.enemyPool && zone.enemyPool.length ? zone.enemyPool : Object.keys(ENEMY_CHARACTERS);
      const randomId = pool[Math.floor(Math.random() * pool.length)];
      this.startBattle({ mode: "wild", characterId: randomId, enemyLevel: zone.level || 1 });
      return;
    }

    this.updateHud();
  }

  startBattle({ mode, characterId, enemyLevel }) {
    this.scene.start("Battle", {
      mode,
      characterId,
      enemyLevel,
      crew: this.state.crew,
      teamOrder: this.state.teamOrder,
      playerLevel: this.state.level,
      playerExp: this.state.exp,
      playerCurrentHp: this.state.hp,
      playerMaxHp: this.state.maxHp,
      playerPpData: this.state.ppData,
      crewDetails: this.state.crewDetails,
      items: this.state.items,
      returnIsland: this.state.islandId,
      returnX: this.state.x,
      returnY: this.state.y,
    });
  }
}
