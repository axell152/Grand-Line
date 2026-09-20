import Phaser from "phaser";
import { PLAYER_CHARACTER, CHARACTERS } from "@/game/data/characters";
import { MOVES } from "@/game/data/moves";
import { ITEMS, STARTING_ITEMS } from "@/game/data/items";
import { saveGame } from "@/game/systems/SaveManager";

const CHARACTER_SPRITES = { captain: "luffy", bretteur: "zoro", navigatrice: "nami", tireur: "usopp", medecin: "character_06", cuisinier: "sanji", charpentier: "character_07", musicien: "character_14", archeologue: "character_02" };

// Luffy / Zoro / Nami / Usopp / Sanji sont des feuilles de sprites 64x64 (4x plus
// grandes que les PNJ génériques character_XX, en 16x16) : on compense leur échelle.
const BIG_SPRITE_KEYS = new Set(["luffy", "zoro", "nami", "usopp", "sanji"]);
const isBigSprite = (entry) => BIG_SPRITE_KEYS.has(CHARACTER_SPRITES[entry] || "character_01");

export default class CrewScene extends Phaser.Scene {
  constructor() {
    super("CrewScene");
  }

  init(data) {
  this.gameState =
    this.game?.registry?.get("gameState") ||
    data?.state ||
    {};
}

  create() {
    this.add.rectangle(512, 384, 1024, 768, 0x0b2545, 0.95);

    this.add.text(512, 40, "GESTION DE L'ÉQUIPAGE", {
      fontFamily: "monospace",
      fontSize: "30px",
      color: "#ead9b8",
    }).setOrigin(0.5);

    this.add.text(90, 82, "Ordre de combat (clique un nom pour voir le détail) :", {
      fontFamily: "monospace",
      fontSize: "16px",
      color: "#ead9b8",
    });

    // Séparation visuelle entre la liste (gauche) et le détail (droite)
    this.add.rectangle(534, 400, 2, 620, 0xead9b8, 0.4);

    this.add.text(512, 740, "[ ▲/▼ ] réordonner   [ clic ] utiliser un objet   [ T ] ou [ Échap ] reprendre la mer", {
      fontFamily: "monospace",
      fontSize: "14px",
      color: "#ead9b8",
    }).setOrigin(0.5);

    if (this.gameState.teamOrder === undefined) {
      this.gameState.teamOrder = ["captain", ...this.gameState.crew];
    }

    this.selected = this.gameState.teamOrder[0];

    this.refreshCrewDisplay();

    this.input.keyboard.on("keydown-T", () => this.resumeWorld());
    this.input.keyboard.on("keydown-ESC", () => this.resumeWorld());
  }

refreshCrewDisplay() {
  // Toujours récupérer la version la plus récente du jeu
  const latestState = this.game.registry.get("gameState");

  if (latestState) {
    this.gameState = latestState;
  }

  // Sécurité si l'ordre n'existe pas encore
  if (!this.gameState.teamOrder) {
    this.gameState.teamOrder = [
      "captain",
      ...(this.gameState.crew || []),
    ];
  }

  // Si le personnage sélectionné n'est plus présent
  if (!this.gameState.teamOrder.includes(this.selected)) {
    this.selected = this.gameState.teamOrder[0];
  }

  this.drawList();
  this.drawDetail();
}
  
  getMemberData(entry) {
  if (entry === "captain") {
    return {
      ...PLAYER_CHARACTER,
      ...this.gameState,
      name: this.gameState?.playerName || "Capitaine",
      title: "Capitaine",
      moves: Array.isArray(this.gameState?.moves)
        ? this.gameState.moves
        : PLAYER_CHARACTER.moves,
    };
  }

  const base = CHARACTERS[entry] || {
    name: entry,
    title: "",
    moves: [],
  };

  const detail = this.gameState?.crewDetails?.[entry] || {};

  return {
    ...base,
    ...detail,
    name: detail.name || base.name,
    title: detail.title || base.title,
    moves: Array.isArray(detail.moves)
      ? detail.moves
      : base.moves,
  };
}
  getMemberProgress(entry) {
    if (entry === "captain") {
      return { level: this.gameState.level || 1, exp: this.gameState.exp || 0, maxExp: this.gameState.maxExp || 100 };
    }
    const detail = this.gameState.crewDetails && this.gameState.crewDetails[entry];
    return {
      level: detail?.level || 1,
      exp: detail?.exp || 0,
      maxExp: detail?.maxExp || 100,
    };
  }

  getMemberHp(entry) {
    if (entry === "captain") {
      return { hp: this.gameState.hp, maxHp: this.gameState.maxHp };
    }
    const detail = this.gameState.crewDetails && this.gameState.crewDetails[entry];
    const base = CHARACTERS[entry];
    if (detail) return { hp: detail.hp, maxHp: detail.maxHp || base.maxHp };
    return { hp: base.maxHp, maxHp: base.maxHp };
  }

  getMemberPp(entry, moveKey, maxPp) {
    if (entry === "captain") {
      const pp = this.gameState.ppData && this.gameState.ppData[moveKey];
      return pp === undefined ? maxPp : pp;
    }
    const detail = this.gameState.crewDetails && this.gameState.crewDetails[entry];
    const pp = detail && detail.ppData && detail.ppData[moveKey];
    return pp === undefined ? maxPp : pp;
  }

  drawList() {
    if (this.listGroup) this.listGroup.destroy(true);
    this.listGroup = this.add.group();

    const order = this.gameState.teamOrder;

    order.forEach((entry, index) => {
      const data = this.getMemberData(entry);
      const { hp, maxHp } = this.getMemberHp(entry);
      const y = 120 + index * 60;
      const isSelected = entry === this.selected;

      const sprite = this.add.sprite(110, y + 12, CHARACTER_SPRITES[entry] || "character_01", 0).setScale(isBigSprite(entry) ? 0.525 : 2.1);
      this.listGroup.add(sprite);

      const nameTxt = this.add.text(140, y, `${index + 1}. ${data.name}`, {
        fontFamily: "monospace",
        fontSize: "17px",
        color: isSelected ? "#ffffff" : "#ead9b8",
        fontStyle: isSelected ? "bold" : "normal",
      })
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => {
          this.selected = entry;
          this.drawList();
          this.drawDetail();
        });
      this.listGroup.add(nameTxt);

      const hpColor = hp <= 0 ? "#c0392b" : hp < maxHp * 0.3 ? "#e67e22" : "#9fd18f";
      const hpTxt = this.add.text(140, y + 20, `PV ${hp}/${maxHp}`, {
        fontFamily: "monospace",
        fontSize: "14px",
        color: hpColor,
      });
      this.listGroup.add(hpTxt);

      if (index > 0) {
        const up = this.add.text(460, y, "▲", { fontFamily: "monospace", fontSize: "18px", color: "#d4a24c" })
          .setInteractive({ useHandCursor: true })
          .on("pointerdown", () => this.moveEntry(index, index - 1))
          .on("pointerover", () => up.setColor("#ffffff"))
          .on("pointerout", () => up.setColor("#d4a24c"));
        this.listGroup.add(up);
      }
      if (index < order.length - 1) {
        const down = this.add.text(490, y, "▼", { fontFamily: "monospace", fontSize: "18px", color: "#d4a24c" })
          .setInteractive({ useHandCursor: true })
          .on("pointerdown", () => this.moveEntry(index, index + 1))
          .on("pointerover", () => down.setColor("#ffffff"))
          .on("pointerout", () => down.setColor("#d4a24c"));
        this.listGroup.add(down);
      }
    });
  }

  drawDetail() {
    if (this.detailGroup) this.detailGroup.destroy(true);
    this.detailGroup = this.add.group();

    const entry = this.selected;
    const data = this.getMemberData(entry);
    const { hp, maxHp } = this.getMemberHp(entry);

    const portrait = this.add.sprite(820, 215, CHARACTER_SPRITES[entry] || "character_01", 0).setScale(isBigSprite(entry) ? 1.25 : 5);
    this.detailGroup.add(portrait);

    const title = this.add.text(570, 110, `${data.name}`, {
      fontFamily: "monospace",
      fontSize: "24px",
      color: "#d4a24c",
    });
    this.detailGroup.add(title);

    const subtitle = this.add.text(570, 145, data.title || "", {
      fontFamily: "monospace",
      fontSize: "16px",
      color: "#9fb4c7",
    });
    this.detailGroup.add(subtitle);

    let y = 185;

    const progress = this.getMemberProgress(entry);
    this.detailGroup.add(this.add.text(570, y, `Niveau ${progress.level}`, {
      fontFamily: "monospace", fontSize: "18px", color: "#ffffff",
    }));
    y += 26;
    this.detailGroup.add(this.add.text(570, y, `XP : ${progress.exp} / ${progress.maxExp}`, {
      fontFamily: "monospace", fontSize: "16px", color: "#9fb4c7",
    }));
    y += 34;

    this.detailGroup.add(this.add.text(570, y, `PV : ${hp} / ${maxHp}`, {
      fontFamily: "monospace", fontSize: "18px", color: "#9fd18f",
    }));
    y += 30;
    this.detailGroup.add(this.add.text(570, y, `ATQ ${data.atk}   DEF ${data.def}   VIT ${data.spd}`, {
      fontFamily: "monospace", fontSize: "16px", color: "#ffffff",
    }));
    y += 40;

    this.detailGroup.add(this.add.text(570, y, "Attaques :", {
      fontFamily: "monospace", fontSize: "18px", color: "#d4a24c",
    }));
    y += 30;

    const moves = data.moves || [];
    moves.forEach((moveKey) => {
      const move = MOVES[moveKey] || { name: moveKey, power: 0, maxPp: 10, accuracy: 1 };
      const maxPp = move.maxPp || 10;
      const currentPp = this.getMemberPp(entry, moveKey, maxPp);
      const effect = move.heal
        ? `Soigne ${move.heal} PV`
        : `Dégâts : ${move.power}`;

      this.detailGroup.add(this.add.text(590, y, `• ${move.name}`, {
        fontFamily: "monospace", fontSize: "16px", color: "#ead9b8",
      }));
      this.detailGroup.add(this.add.text(590, y + 20, `   ${effect}   |   PP ${currentPp}/${maxPp}   |   Précision ${Math.round((move.accuracy || 1) * 100)}%`, {
        fontFamily: "monospace", fontSize: "14px", color: currentPp > 0 ? "#9fb4c7" : "#7f8c8d",
      }));
      y += 48;
    });

    if (moves.length === 0) {
      this.detailGroup.add(this.add.text(590, y, "Aucune attaque connue.", {
        fontFamily: "monospace", fontSize: "14px", color: "#7f8c8d",
      }));
      y += 30;
    } else {
      y += 6;
    }

    this.detailGroup.add(this.add.text(570, y, "Objets :", {
      fontFamily: "monospace", fontSize: "18px", color: "#d4a24c",
    }));
    y += 30;

    const items = this.gameState.items || STARTING_ITEMS;
    const usableItemIds = Object.keys(ITEMS).filter((id) => ITEMS[id].heal);

    if (hp >= maxHp) {
      this.detailGroup.add(this.add.text(590, y, "PV déjà au maximum.", {
        fontFamily: "monospace", fontSize: "14px", color: "#7f8c8d",
      }));
      y += 26;
    }

    usableItemIds.forEach((itemId) => {
      const item = ITEMS[itemId];
      const count = items[itemId] || 0;
      const usable = count > 0 && hp < maxHp;

      const label = this.add.text(
        590,
        y,
        `${usable ? "▶ " : "   "}${item.name} (x${count}) — Soigne ${item.heal} PV`,
        {
          fontFamily: "monospace",
          fontSize: "15px",
          color: usable ? "#9fd18f" : "#7f8c8d",
        }
      );

      if (usable) {
        label
          .setInteractive({ useHandCursor: true })
          .on("pointerdown", () => this.useItem(itemId))
          .on("pointerover", () => label.setColor("#ffffff"))
          .on("pointerout", () => label.setColor("#9fd18f"));
      }

      this.detailGroup.add(label);
      y += 26;
    });
  }

  useItem(itemId) {
    const entry = this.selected;
    const item = ITEMS[itemId];
    if (!item || !item.heal) return;

    this.gameState = this.game.registry.get("gameState") || this.gameState;
    this.gameState.items ||= { ...STARTING_ITEMS };

    const count = this.gameState.items[itemId] || 0;
    if (count <= 0) return;

    const { hp, maxHp } = this.getMemberHp(entry);
    if (hp >= maxHp) return;

    const newHp = Math.min(maxHp, hp + item.heal);

    if (entry === "captain") {
      this.gameState.hp = newHp;
    } else {
      this.gameState.crewDetails ||= {};
      this.gameState.crewDetails[entry] ||= {};
      this.gameState.crewDetails[entry].hp = newHp;
    }

    this.gameState.items[itemId] = count - 1;

    this.game.registry.set("gameState", this.gameState);
    saveGame(this.gameState);

    this.refreshCrewDisplay();
  }

  moveEntry(from, to) {
    this.gameState = this.game.registry.get("gameState") || this.gameState;

  const order = this.gameState.teamOrder;
  const [moved] = order.splice(from, 1);
  order.splice(to, 0, moved);

  this.game.registry.set("gameState", this.gameState);
  saveGame(this.gameState);

  this.refreshCrewDisplay();
}


  resumeWorld() {
    this.scene.stop();
    this.scene.resume("World");
  }
}
