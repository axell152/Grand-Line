import { MOVES } from "@/game/data/moves";

// Crée une instance de combat à partir des données statiques d'un personnage
export function createBattler(charData) {
  return {
    ...charData,
    hp: charData.maxHp,
  };
}

// Détermine qui joue en premier selon la vitesse (avec une marge d'aléatoire)
export function getTurnOrder(a, b) {
  const scoreA = a.spd + Math.random() * 4;
  const scoreB = b.spd + Math.random() * 4;
  return scoreA >= scoreB ? [a, b] : [b, a];
}

// Applique une attaque de `attacker` sur `defender`. Retourne le résultat pour l'affichage.
export function applyMove(attacker, defender, moveKey) {
  const move = MOVES[moveKey];
  if (!move) return { text: `${attacker.name} hésite...`, missed: true };

  if (move.heal) {
    defender.hp = Math.min(defender.maxHp, defender.hp + move.heal);
    return {
      text: `${attacker.name} utilise ${move.name} et récupère ${move.heal} PV !`,
      heal: move.heal,
    };
  }

  const hit = Math.random() <= move.accuracy;
  if (!hit) {
    return { text: `${attacker.name} utilise ${move.name}... et rate !`, missed: true };
  }

  const variance = 0.85 + Math.random() * 0.3; // 85% à 115%
  const raw = (move.power * (attacker.atk / Math.max(defender.def, 1))) * variance;
  const damage = Math.max(1, Math.round(raw / 2));

  defender.hp = Math.max(0, defender.hp - damage);

  return {
    text: `${attacker.name} utilise ${move.name} ! ${defender.name} perd ${damage} PV.`,
    damage,
  };
}

export function isDefeated(battler) {
  return battler.hp <= 0;
}
