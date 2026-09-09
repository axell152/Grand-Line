import Phaser from "phaser";
import { ISLANDS, STARTING_ISLAND, TILE_SIZE } from "@/game/data/islands";
import { CHARACTERS, ENEMY_CHARACTERS } from "@/game/data/characters";
import { saveGame, loadGame } from "@/game/systems/SaveManager";

const DIRECTIONS = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
};

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
    
    // Support ZQSD / AZERTY
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.Z,
      left: Phaser.Input.Keyboard.KeyCodes.Q,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    // Écoute de la touche T pour ouvrir la gestion d'équipage
    this.input.keyboard.on('keydown-T', () => {
      this.scene.launch("CrewScene", { state: this.state });
      this.scene.pause();
    });

    // Gestion de l'XP et des montées de niveau cumulatives
    if (typeof this.incoming.expGained === "number") {
      this.state.exp += this.incoming.expGained;
      
      while (this.state.exp >= this.state.maxExp) {
        this.state.exp -= this.state.maxExp;
        this.state.level += 1;
        this.state.maxExp = Math.round(this.state.maxExp * 1.4);
      }
      this.persist();
    }
    
    this.drawIsland();
    this.drawHud();

    if (this.incoming.recruitedId) {
      this.state.crew.push(this.incoming.recruitedId);
      this.persist();
    }
    if (typeof this.incoming.berrysGained === "number") {
      this.state.berrys += this.incoming.berrysGained;
      this.persist();
    }
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
        berrys: 0,
        level: 1,
        exp: 0,
        maxExp: 100,
        hp: 100,
        maxHp: 100,
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
            berrys: save.berrys || 0,
            level: save.level || 1,
            exp: save.exp || 0,
            maxExp: save.maxExp || 100,
            hp: save.hp !== undefined ? save.hp : 100,
            maxHp: save.maxHp !== undefined ? save.maxHp : 100,
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

    if (this.incoming.islandId) {
      this.state.islandId = this.incoming.islandId;
      this.state.x = this.incoming.x;
      this.state.y = this.incoming.y;
    }
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

    for (let y = 0; y < island.grid.length; y++) {
      const row = island.grid[y];
      for (let x = 0; x < row.length; x++) {
        const tile = row[x];
        const key = tile === "#" ? "tile-wall" : tile === "P" ? "tile-path" : "tile-floor";
        this.add.image(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2, key).setDepth(0);
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
        const charData = CHARACTERS[npc.characterId];
        const sprite = this.add.image(
          npc.x * TILE_SIZE + TILE_SIZE / 2,
          npc.y * TILE_SIZE + TILE_SIZE / 2,
          "token"
        );
        sprite.setTint(charData.color);
        sprite.setDepth(npc.y);
        this.npcSprites[`${npc.x},${npc.y}`] = npc.characterId;
      });

    this.player = this.add.image(
      this.state.x * TILE_SIZE + TILE_SIZE / 2,
      this.state.y * TILE_SIZE + TILE_SIZE / 2,
      "token"
    );
    this.player.setTint(0xd4a24c);
    this.player.setDepth(999); 

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
      if (this.state.crewDetails && Array.isArray(this.state.crewDetails)) {
        this.state.crewDetails.forEach(m => { 
          m.hp = m.maxHp; 
          m.ppData = undefined; 
        });
      }
      this.persist();
      this.updateHud();
      return;
    }
    
    const warp = island.warps.find((w) => w.x === x && w.y === y);
    if (warp) {
      this.scene.restart({ islandId: warp.toIsland, x: warp.toX, y: warp.toY });
      return;
    }

    const inWildZone = island.wildZones.some(
      (z) => x >= z.x1 && x <= z.x2 && y >= z.y1 && y <= z.y2
    );
    if (inWildZone && Math.random() < island.wildEncounterRate) {
      const ids = Object.keys(ENEMY_CHARACTERS);
      const randomId = ids[Math.floor(Math.random() * ids.length)];
      this.startBattle({ mode: "wild", characterId: randomId });
      return;
    }

    this.updateHud();
  }

  startBattle({ mode, characterId }) {
    this.scene.start("Battle", {
      mode,
      characterId,
      crew: this.state.crew,
      playerLevel: this.state.level,
      playerExp: this.state.exp,
      playerCurrentHp: this.state.hp,
      playerMaxHp: this.state.maxHp,
      returnIsland: this.state.islandId,
      returnX: this.state.x,
      returnY: this.state.y,
    });
  }
}
