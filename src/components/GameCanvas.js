"use client";

import { useEffect, useRef } from "react";

export default function GameCanvas() {
  const containerRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    let destroyed = false;

    async function boot() {
      const Phaser = (await import("phaser")).default;
      const { createGameConfig } = await import("@/game/main");

      if (destroyed) return;

      const config = createGameConfig(Phaser, "game-container");
      gameRef.current = new Phaser.Game(config);
    }

    boot();

    return () => {
      destroyed = true;
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return <div id="game-container" ref={containerRef} />;
}
