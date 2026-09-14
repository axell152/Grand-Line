import BootScene from "@/game/scenes/BootScene";
import TitleScene from "@/game/scenes/TitleScene";
import WorldScene from "@/game/scenes/WorldScene";
import SailingScene from "@/game/scenes/SailingScene";
import BattleScene from "@/game/scenes/BattleScene";
import CrewScene from "@/game/scenes/CrewScene";

export function createGameConfig(Phaser, parentId) {
  return {
    type: Phaser.AUTO,
    parent: parentId,
    width: 1024,
    height: 768,
    pixelArt: true,
    backgroundColor: "#0b2545",
    physics: {
      default: "arcade",
      arcade: { debug: false },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [BootScene, TitleScene, WorldScene, SailingScene, BattleScene, CrewScene],
  };
}
