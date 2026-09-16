// Le héros de départ
export const PLAYER_CHARACTER = {
  id: "hero",
  name: "Toi",
  color: 0xd4a24c,
  maxHp: 90,
  atk: 14,
  def: 10,
  spd: 12,
  moves: ["taillade", "cravacheDeJambe", "hakiArmement"],
  // Nouvelles attaques disponibles au fil des niveaux.
  learnset: [
    { level: 3, move: "hachoirDeSabre" },
    { level: 5, move: "vagueDeChoc" },
    { level: 8, move: "coupTonnerre" },
  ],
};

export const CHARACTERS = {
  bretteur: {
    id: "bretteur",
    name: "Roronoa Zoro",
    title: "Chasseur de pirates",
    color: 0x3f7f4f,
    maxHp: 110, atk: 22, def: 12, spd: 12,
    moves: ["taillade", "hachoirDeSabre"],
    learnset: [
      { level: 3, move: "vagueDeChoc" },
      { level: 5, move: "cravacheDeJambe" },
      { level: 8, move: "coupDeMarteau" },
    ],
    recruitLine: "Bien joué. De toute façon j'ai rien d'autres à faire. Je monte à bord.",
  },
  navigatrice: {
    id: "navigatrice",
    name: "Nami",
    title: "Petite chapardeuse",
    color: 0xe07a3f,
    maxHp: 90, atk: 14, def: 10, spd: 18,
    moves: ["coupTonnerre", "tirDePrecision"],
    learnset: [
      { level: 3, move: "vagueDeChoc" },
      { level: 5, move: "soinDeFortune" },
      { level: 8, move: "fouilleEclair" },
    ],
    recruitLine: "D'accord, d'accord ! On va voler pleins de trésors !! J'embarque.",
  },
  tireur: {
    id: "tireur",
    name: "Usopp",
    title: "Tireur d'élite",
    color: 0xc9b23c,
    maxHp: 95, atk: 16, def: 11, spd: 14,
    moves: ["tirDePrecision", "vagueDeChoc"],
    learnset: [
      { level: 3, move: "fouilleEclair" },
      { level: 5, move: "hachoirDeSabre" },
      { level: 8, move: "coupTonnerre" },
    ],
    recruitLine: "Un tir pareil... Capitaine, j'ai des histoires de mon village à raconter à bord.",
  },
  medecin: {
    id: "medecin",
    name: "Chopper",
    title: "Médecin de bord",
    color: 0x4fa3c7,
    maxHp: 100, atk: 13, def: 15, spd: 10,
    moves: ["griffureSauvage", "soinDeFortune"],
    learnset: [
      { level: 3, move: "chantEnivrant" },
      { level: 5, move: "boulePeuFeu" },
      { level: 8, move: "vagueDeChoc" },
    ],
    recruitLine: "Un équipage qui tient debout après un combat pareil a besoin d'un médecin. J'accepte.",
  },
  cuisinier: {
    id: "cuisinier",
    name: "Sanji",
    title: "Cuisinier des mers",
    color: 0xb23c54,
    maxHp: 115, atk: 20, def: 13, spd: 15,
    moves: ["cravacheDeJambe", "boulePeuFeu"],
    learnset: [
      { level: 3, move: "taillade" },
      { level: 5, move: "coupDeMarteau" },
      { level: 8, move: "hakiArmement" },
    ],
    recruitLine: "Personne ne cuisine pour un capitaine sans force. Je vais faire des petits plats pour ma Nami chérie.",
  },
  charpentier: {
    id: "charpentier",
    name: "Franky",
    title: "Charpentier cyborg",
    color: 0x8a5a2b,
    maxHp: 150, atk: 18, def: 22, spd: 8,
    moves: ["coupDeMarteau", "hachoirDeSabre"],
    learnset: [
      { level: 3, move: "vagueDeChoc" },
      { level: 5, move: "cravacheDeJambe" },
      { level: 8, move: "hakiArmement" },
    ],
    recruitLine: "Du solide, du costaud... voilà un équipage digne de ce nom. Suuuuuupeeeeeer.",
  },
  musicien: {
    id: "musicien",
    name: "Brook",
    title: "Squelette musicien",
    color: 0x9c4fc7,
    maxHp: 95, atk: 15, def: 10, spd: 20,
    moves: ["chantEnivrant", "soinDeFortune"],
    learnset: [
      { level: 3, move: "tirDePrecision" },
      { level: 5, move: "vagueDeChoc" },
      { level: 8, move: "fouilleEclair" },
    ],
    recruitLine: "Une mélodie pareille mérite d'être jouée sur votre pont. J'apporte mon violon.",
  },
  archeologue: {
    id: "archeologue",
    name: "Robin",
    title: "Chercheuse de ruines oubliées",
    color: 0xc7a23c,
    maxHp: 110, atk: 19, def: 13, spd: 17,
    moves: ["fouilleEclair", "vagueDeChoc"],
    learnset: [
      { level: 3, move: "chantEnivrant" },
      { level: 5, move: "coupTonnerre" },
      { level: 8, move: "hakiArmement" },
    ],
    recruitLine: "Vous avez la force qu'il faut pour percer les secrets de la Grand Line. J'embarque avec mes cartes.",
  },
};

export const ENEMY_CHARACTERS = {
  marineRecrue: {
    id: "marineRecrue", name: "Recrue de la Marine", title: "Ennemi", color: 0x6f7a8c,
    maxHp: 45, atk: 9, def: 7, spd: 9, moves: ["coupTonnerre", "griffureSauvage"],
  },
  pirateRival: {
    id: "pirateRival", name: "Pirate Rival", title: "Ennemi", color: 0x7c3c3c,
    maxHp: 50, atk: 11, def: 6, spd: 11, moves: ["taillade", "vagueDeChoc"],
  },
  chasseurDePrimes: {
    id: "chasseurDePrimes", name: "Chasseur de Primes", title: "Ennemi", color: 0x4a4a4a,
    maxHp: 85, atk: 18, def: 10, spd: 14, moves: ["hachoirDeSabre", "vagueDeChoc"],
  },
  officierMarine: {
    id: "officierMarine", name: "Officier de la Marine", title: "Ennemi", color: 0x2c3e78,
    maxHp: 100, atk: 16, def: 16, spd: 9, moves: ["coupTonnerre", "coupDeMarteau"],
  },
 arlong: {
   id: "arlong", name: "Arlong", type: "tranchant", maxHp: 180, atk: 32, def: 24, spd: 18, moves: ["taillade"],
  }, 
};
