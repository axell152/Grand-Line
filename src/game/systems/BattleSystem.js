import { MOVES } from "@/game/data/moves";

const TYPE_EFFECTIVENESS = {
  tranchant: { choc: 1.1, feu: 1, mental: 0.9 },
  choc: { distance: 1.1, haki: 1, tranchant: 0.9 },
  feu: { tranchant: 1.1, mental: 1, choc: 0.9 },
  distance: { mental: 1.1, choc: 0.9 },
  mental: { haki: 1.1, feu: 0.9 },
  haki: { mental: 1.1, choc: 0.9 },
};

export function createBattler(charData) {
  return {
    ...charData,
    hp: charData.maxHp,
    defending: false,
  };
}

export function scaleEnemyForLevel(baseEnemy, level) {
  const lvl = Math.max(1, level || 1);
  return {
    ...baseEnemy,
    level: lvl,
    maxHp: baseEnemy.maxHp + (lvl - 1) * 6,
    atk: baseEnemy.atk + (lvl - 1) * 2,
    def: baseEnemy.def + (lvl - 1) * 1,
    spd: baseEnemy.spd + (lvl - 1) * 1,
  };
}

export function getTurnOrder(a, b) {
  const scoreA = a.spd + Math.random() * 4;
  const scoreB = b.spd + Math.random() * 4;
  return scoreA >= scoreB ? [a, b] : [b, a];
}

export function applyMove(attacker, defender, moveKey) {
  const move = MOVES[moveKey];
  if (!move) return { text: `${attacker.name} hésite...`, missed: true };

  if (move.heal) {
    const before = attacker.hp;
    attacker.hp = Math.min(attacker.maxHp, attacker.hp + move.heal);
    const healed = attacker.hp - before;
    return {
      text: `${attacker.name} utilise ${move.name} et récupère ${healed} PV !`,
      heal: healed,
    };
  }

  const hit = Math.random() <= move.accuracy;
  if (!hit) {
    return { text: `${attacker.name} utilise ${move.name}... et rate !`, missed: true };
  }

  const variance = 0.85 + Math.random() * 0.3;
  const effectiveness = TYPE_EFFECTIVENESS[move.type]?.[defender.type] || 1;
  const critical = Math.random() < 0.08;
  const criticalMultiplier = critical ? 1.5 : 1;
  const defenseMultiplier = defender.defending ? 0.5 : 1;
  const raw = move.power * (attacker.atk / Math.max(defender.def, 1)) * variance;
  const damage = Math.max(1, Math.round((raw / 2) * effectiveness * criticalMultiplier * defenseMultiplier));

  defender.hp = Math.max(0, defender.hp - damage);

  let suffix = "";
  if (critical) suffix += " COUP CRITIQUE !";
  if (effectiveness >= 1.1) suffix += " C'est super efficace !";
  if (effectiveness <= 0.9) suffix += " Ce n'est pas très efficace...";
  if (defender.defending) suffix += " La défense réduit les dégâts.";

  return {
    text: `${attacker.name} utilise ${move.name} ! ${defender.name} perd ${damage} PV.${suffix}`,
    damage,
    critical,
    effectiveness,
  };
}

export function isDefeated(battler) {
  return battler.hp <= 0;
}
