"use client";

import dynamic from "next/dynamic";

const GameCanvas = dynamic(() => import("@/components/GameCanvas"), {
  ssr: false,
  loading: () => <div id="game-root">Chargement de la Grand Line…</div>,
});

export default function Home() {
  return (
    <div id="game-root">
      <GameCanvas />
    </div>
  );
}
