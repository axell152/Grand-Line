// Chaque attaque : nom, puissance de base, type (pour de futurs bonus/malus), précision
export const MOVES = {
  taillade: { name: "Taillade", power: 35, type: "tranchant", accuracy: 0.95 },
  coupTonnerre: { name: "Coup de Tonnerre", power: 45, type: "choc", accuracy: 0.85 },
  hachoirDeSabre: { name: "Hachoir de Sabre", power: 60, type: "tranchant", accuracy: 0.75 },
  boulePeuFeu: { name: "Boule de Feu", power: 50, type: "feu", accuracy: 0.9 },
  cravacheDeJambe: { name: "Cravache de Jambe", power: 40, type: "choc", accuracy: 0.9 },
  hakiArmement: { name: "Haki de l'Armement", power: 55, type: "haki", accuracy: 0.85 },
  tirDePrecision: { name: "Tir de Précision", power: 30, type: "distance", accuracy: 0.97 },
  vagueDeChoc: { name: "Vague de Choc", power: 65, type: "choc", accuracy: 0.7 },
  griffureSauvage: { name: "Griffure Sauvage", power: 38, type: "tranchant", accuracy: 0.9 },
  soinDeFortune: { name: "Soin de Fortune", power: 0, heal: 30, type: "soin", accuracy: 1 },
  coupDeMarteau: { name: "Coup de Marteau", power: 58, type: "choc", accuracy: 0.82 },
  chantEnivrant: { name: "Chant Enivrant", power: 42, type: "mental", accuracy: 0.88 },
  fouilleEclair: { name: "Fouille Éclair", power: 33, type: "distance", accuracy: 0.95 },
};
