import BootScene from "@/game/scenes/BootScene";
import WorldScene from "@/game/scenes/WorldScene";
import BattleScene from "@/game/scenes/BattleScene";

export function createGameConfig(Phaser, parentId) {
  return {
    type: Phaser.AUTO,
    parent: parentId,
    width: 512,
    height: 384,
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
    scene: [BootScene, WorldScene, BattleScene],
  };
}
