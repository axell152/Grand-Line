// Le héros de départ
export const PLAYER_CHARACTER = {
  id: "hero",
  name: "Toi",
  color: 0xd4a24c,
  type: "tranchant",
  maxHp: 90,
  atk: 9999,
  def: 10,
  spd: 9999,
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
    title: "Chasseur de primes",
    color: 0x3f7f4f,
    type: "tranchant",
    maxHp: 110, atk: 22, def: 12, spd: 12,
    moves: ["taillade", "hachoirDeSabre"],
    learnset: [
      { level: 3, move: "vagueDeChoc" },
      { level: 5, move: "cravacheDeJambe" },
      { level: 8, move: "coupDeMarteau" },
    ],
    recruitLine: "Bien joué. Une équipe qui se bat comme ça... ça me plaît. Je monte à bord.",
  },
  navigatrice: {
    id: "navigatrice",
    name: "Nami",
    title: "Navigatrice et chapardeuse",
    color: 0xe07a3f,
    type: "choc",
    maxHp: 90, atk: 14, def: 10, spd: 18,
    moves: ["coupTonnerre", "tirDePrecision"],
    learnset: [
      { level: 3, move: "vagueDeChoc" },
      { level: 5, move: "soinDeFortune" },
      { level: 8, move: "fouilleEclair" },
    ],
    recruitLine: "D'accord, d'accord ! Vous savez naviguer un combat, ça compte pour moi. J'embarque.",
  },
  tireur: {
    id: "tireur",
    name: "Usopp",
    title: "Le plus froussard des tireurs d'élite",
    color: 0xc9b23c,
    type: "distance",
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
    title: "Médecin de l'île d'hiver",
    color: 0x4fa3c7,
    type: "mental",
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
    title: "Cuisto à la jambe noire",
    color: 0xb23c54,
    type: "choc",
    maxHp: 115, atk: 20, def: 13, spd: 15,
    moves: ["cravacheDeJambe", "boulePeuFeu"],
    learnset: [
      { level: 3, move: "taillade" },
      { level: 5, move: "coupDeMarteau" },
      { level: 8, move: "hakiArmement" },
    ],
    recruitLine: "Personne ne cuisine pour un capitaine sans force. Vous avez ma marmite et mon bras.",
  },
  charpentier: {
    id: "charpentier",
    name: "Franky",
    title: "Charpentier robotique",
    color: 0x8a5a2b,
    type: "choc",
    maxHp: 150, atk: 18, def: 22, spd: 8,
    moves: ["coupDeMarteau", "hachoirDeSabre"],
    learnset: [
      { level: 3, move: "vagueDeChoc" },
      { level: 5, move: "cravacheDeJambe" },
      { level: 8, move: "hakiArmement" },
    ],
    recruitLine: "Du solide, du costaud... voilà un équipage digne de ce nom. Je répare le navire dès demain.",
  },
  musicien: {
    id: "musicien",
    name: "Brook",
    title: "Stare squelettique",
    color: 0x9c4fc7,
    type: "mental",
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
    title: "Chercheuse de ruines oubliée",
    color: 0xc7a23c,
    type: "distance",
    maxHp: 110, atk: 19, def: 13, spd: 17,
    moves: ["fouilleEclair", "vagueDeChoc"],
    learnset: [
      { level: 3, move: "chantEnivrant" },
      { level: 5, move: "coupTonnerre" },
      { level: 8, move: "hakiArmement" },
    ],
    recruitLine: "Vous avez la force qu'il faut pour percer les secrets de Grand Line. J'embarque avec mes cartes.",
  },
};

export const ENEMY_CHARACTERS = {

  // =========================
  // MARINES - SHELL TOWN
  // =========================
  
  marineRecrue: {
    id: "marineRecrue",
    name: "Recrue de la Marine",
    title: "Ennemi",
    color: 0x6f7a8c,
    type: "choc",
    maxHp: 45,
    atk: 9,
    def: 7,
    spd: 9,
    moves: ["coupTonnerre", "griffureSauvage"],
  },

  officierMarine: {
    id: "officierMarine",
    name: "Officier de la Marine",
    title: "Ennemi",
    color: 0x2c3e78,
    type: "choc",
    maxHp: 70,
    atk: 13,
    def: 11,
    spd: 9,
    moves: ["coupTonnerre", "coupDeMarteau"],
  },

marineFusilier: {
  id: "marineFusilier",
  name: "Fusilier de la Marine",
  title: "Ennemi de Shells Town",
  color: 0x58789c,
  maxHp: 55,
  atk: 12,
  def: 8,
  spd: 10,
  moves: ["tirDePrecision", "coupTonnerre"],
},  
  
  pirateRival: {
    id: "pirateRival",
    name: "Pirate Rival",
    title: "Ennemi",
    color: 0x7c3c3c,
    type: "tranchant",
    maxHp: 50,
    atk: 11,
    def: 6,
    spd: 11,
    moves: ["taillade", "vagueDeChoc"],
  },

  chasseurDePrimes: {
    id: "chasseurDePrimes",
    name: "Chasseur de Primes",
    title: "Ennemi",
    color: 0x4a4a4a,
    type: "tranchant",
    maxHp: 85,
    atk: 18,
    def: 10,
    spd: 14,
    moves: ["hachoirDeSabre", "vagueDeChoc"],
  },



  // =========================
  // HOMMES-POISSONS - COCOYASI
  // =========================

  fishmanPirate: {
    id: "fishmanPirate",
    name: "Pirate Homme-Poisson",
    title: "Ennemi de Cocoyasi",
    color: 0x4f91a8,
    type: "tranchant",
    maxHp: 60,
    atk: 13,
    def: 8,
    spd: 11,
    moves: ["taillade", "vagueDeChoc"],
  },

  fishmanLancer: {
    id: "fishmanLancer",
    name: "Lancier Homme-Poisson",
    title: "Ennemi de Cocoyasi",
    color: 0x3d8f91,
    type: "tranchant",
    maxHp: 65,
    atk: 14,
    def: 9,
    spd: 10,
    moves: ["taillade", "cravacheDeJambe"],
  },

  fishmanSwordsman: {
    id: "fishmanSwordsman",
    name: "Épéiste Homme-Poisson",
    title: "Ennemi de Cocoyasi",
    color: 0x477f9e,
    type: "tranchant",
    maxHp: 68,
    atk: 16,
    def: 9,
    spd: 13,
    moves: ["taillade", "hachoirDeSabre"],
  },

  fishmanBountyHunter: {
    id: "fishmanBountyHunter",
    name: "Chasseur de Primes Homme-Poisson",
    title: "Ennemi de Cocoyasi",
    color: 0x365e68,
    type: "distance",
    maxHp: 82,
    atk: 18,
    def: 11,
    spd: 14,
    moves: ["tirDePrecision", "hachoirDeSabre"],
  },

  fishmanBrute: {
    id: "fishmanBrute",
    name: "Brute Homme-Poisson",
    title: "Ennemi de Cocoyasi",
    color: 0x3d806d,
    type: "choc",
    maxHp: 105,
    atk: 21,
    def: 14,
    spd: 7,
    moves: ["coupDeMarteau", "taillade"],
  },

  fishmanCaptain: {
    id: "fishmanCaptain",
    name: "Capitaine Homme-Poisson",
    title: "Ennemi de Cocoyasi",
    color: 0x245d63,
    type: "tranchant",
    maxHp: 120,
    atk: 24,
    def: 16,
    spd: 15,
    moves: ["hachoirDeSabre", "vagueDeChoc"],
  },

  // =========================
  // CHAT NOIR - SYRUP VILLAGE
  // =========================

  pirateChatNoirSabreur: {
    id: "pirateChatNoirSabreur",
    name: "Pirate du Chat Noir",
    title: "Sabreur",
    color: 0x5c4b6b,
    type: "tranchant",
    maxHp: 65,
    atk: 15,
    def: 9,
    spd: 13,
    moves: ["taillade", "hachoirDeSabre"],
  },

  pirateChatNoirPistolet: {
    id: "pirateChatNoirPistolet",
    name: "Pirate du Chat Noir",
    title: "Tireur",
    color: 0x4b5c6b,
    type: "distance",
    maxHp: 58,
    atk: 14,
    def: 8,
    spd: 14,
    moves: ["tirDePrecision", "vagueDeChoc"],
  },

  // =========================
  // BARATIE
  // =========================

  pirateBaratie: {
    id: "pirateBaratie",
    name: "Pirate du Baratie",
    title: "Ennemi",
    color: 0x6b4a3a,
    type: "tranchant",
    maxHp: 72,
    atk: 16,
    def: 9,
    spd: 12,
    moves: ["taillade", "vagueDeChoc"],
  },

  pirateBaratieSabreur: {
    id: "pirateBaratieSabreur",
    name: "Pirate du Baratie",
    title: "Sabreur",
    color: 0x523d35,
    type: "tranchant",
    maxHp: 80,
    atk: 18,
    def: 10,
    spd: 14,
    moves: ["taillade", "hachoirDeSabre"],
  },

  pirateBaratiePistolet: {
    id: "pirateBaratiePistolet",
    name: "Pirate du Baratie",
    title: "Tireur",
    color: 0x3f5260,
    type: "distance",
    maxHp: 68,
    atk: 17,
    def: 9,
    spd: 15,
    moves: ["tirDePrecision", "vagueDeChoc"],
  },

  kriegPirate: {
    id: "kriegPirate",
    name: "Pirate de Krieg",
    title: "Ennemi",
    color: 0x4d5560,
    type: "tranchant",
    maxHp: 88,
    atk: 20,
    def: 12,
    spd: 11,
    moves: ["taillade", "coupDeMarteau"],
  },

  kriegSabreur: {
    id: "kriegSabreur",
    name: "Sabreur de Krieg",
    title: "Ennemi",
    color: 0x5b4040,
    type: "tranchant",
    maxHp: 98,
    atk: 22,
    def: 13,
    spd: 13,
    moves: ["hachoirDeSabre", "taillade"],
  },

  kriegPistolet: {
    id: "kriegPistolet",
    name: "Tireur de Krieg",
    title: "Ennemi",
    color: 0x465867,
    type: "distance",
    maxHp: 82,
    atk: 21,
    def: 11,
    spd: 15,
    moves: ["tirDePrecision", "coupTonnerre"],
  },

  kriegLourd: {
    id: "kriegLourd",
    name: "Soldat lourd de Krieg",
    title: "Ennemi",
    color: 0x46464b,
    type: "choc",
    maxHp: 125,
    atk: 25,
    def: 18,
    spd: 7,
    moves: ["coupDeMarteau", "vagueDeChoc"],
  },

  pearl: {
    id: "pearl",
    name: "Pearl",
    title: "Armure de feu",
    color: 0x8c6f48,
    type: "choc",
    maxHp: 155,
    atk: 29,
    def: 21,
    spd: 9,
    moves: ["coupDeMarteau", "boulePeuFeu"],
  },

  gin: {
    id: "gin",
    name: "Gin",
    title: "Le pied de fer",
    color: 0x59606d,
    type: "choc",
    maxHp: 170,
    atk: 31,
    def: 19,
    spd: 18,
    moves: ["coupDeMarteau", "hachoirDeSabre"],
  },

  donKrieg: {
    id: "donKrieg",
    name: "Don Krieg",
    title: "Amiral de la flotte de Krieg",
    color: 0x8a6b42,
    type: "choc",
    maxHp: 230,
    atk: 38,
    def: 27,
    spd: 12,
    moves: ["coupDeMarteau", "tirDePrecision", "vagueDeChoc"],
  },

  // =========================
  // BOSS - SYRUP VILLAGE
  // =========================

  kuro: {
    id: "kuro",
    name: "Kuro",
    title: "Capitaine du Chat Noir",
    color: 0x29252f,
    type: "tranchant",
    maxHp: 190,
    atk: 34,
    def: 22,
    spd: 24,
    moves: ["hachoirDeSabre", "taillade"],
  },

  jango: {
    id: "jango",
    name: "Jango",
    title: "Hypnotiseur",
    color: 0x6d4c8c,
    type: "mental",
    maxHp: 120,
    atk: 20,
    def: 13,
    spd: 18,
    moves: ["chantEnivrant", "vagueDeChoc"],
  },

  freresNyaban: {
    id: "freresNyaban",
    name: "Frères Nyaban",
    title: "Combat en duo",
    color: 0x7a5038,
    type: "tranchant",
    maxHp: 150,
    atk: 27,
    def: 17,
    spd: 20,
    moves: ["taillade", "hachoirDeSabre"],
  },
  
  // =========================
  // BOSS
  // =========================

  arlong: {
    id: "arlong",
    name: "Arlong",
    type: "tranchant",
    maxHp: 180,
    atk: 32,
    def: 24,
    spd: 18,
    moves: ["taillade"],
  },

colonelMorgan: {
  id: "colonelMorgan",
  name: "Colonel Morgan",
  type: "tranchant",
  maxHp: 180,
  atk: 32,
  def: 24,
  spd: 18,
  moves: ["taillade"],
},   
};
