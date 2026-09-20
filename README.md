# Grand Line Tactics

Jeu perso d'exploration et de combat au tour par tour, dans l'esprit Pokémon (vue du dessus, carte en tuiles) mais sur l'univers **One Piece**. Pas de capture : les personnages rencontrés sont défiés en combat, et une fois vaincus, ils rejoignent votre équipage.

> Projet à usage strictement personnel, comme convenu.

## Stack

- **Next.js 14** (App Router) — hébergement, aucune API serveur nécessaire
- **Phaser 3** — moteur de jeu 2D, exécuté côté client

## Démarrer en local

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

**Contrôles** : flèches directionnelles ou ZQSD/WASD pour se déplacer. Marcher sur un PNJ coloré déclenche un combat de recrutement. Les tuiles dorées sont des passages vers une autre île.

## Sauvegarde

La sauvegarde est **100% locale**, aucun serveur n'est nécessaire :

- **Automatique** : à chaque déplacement / événement important, la partie est sauvegardée dans `localStorage` du navigateur.
- **Fichier JSON** : dans le monde, clique sur « SAUVEGARDER » ou appuie sur `F` pour télécharger un fichier `grand-line-sauvegarde-....json`. Ce fichier est autonome (ne dépend ni du navigateur ni d'un serveur) et peut être restauré via « CHARGER LA SAUVEGARDE » depuis l'écran-titre.

## Déployer sur GitHub + Vercel

```bash
git init
git add .
git commit -m "Grand Line Tactics - version initiale"
gh repo create grand-line-tactics --private --source=. --push
# ou manuellement : créez le repo sur GitHub puis git remote add origin ... && git push
```

Puis sur [vercel.com](https://vercel.com) :
1. "Add New Project" → importez le repo GitHub.
2. Déployez. Vercel détecte Next.js automatiquement. Aucune variable d'environnement n'est nécessaire (pas de base de données).

## Architecture

```
src/
  app/
    page.js              → point d'entrée, charge le canvas Phaser (sans SSR)
  components/
    GameCanvas.js         → pont React <-> Phaser
  game/
    main.js               → configuration Phaser (liste des scènes)
    scenes/
      BootScene.js         → génère les textures (aucun asset externe requis)
      TitleScene.js         → écran-titre, nouvelle partie, chargement de fichier
      WorldScene.js         → carte, déplacement, passages, rencontres
      BattleScene.js        → combat au tour par tour, recrutement
      CrewScene.js           → gestion de l'équipage
      MapScene.js            → carte de la Grand Line
      SailingScene.js        → transition entre îles
    data/
      islands.js            → grilles de tuiles, PNJ, zones de rencontre
      characters.js         → stats et types des personnages recrutables et ennemis
      moves.js               → attaques (dégâts, précision, type)
      items.js                → objets consommables
    systems/
      BattleSystem.js         → calculs de dégâts, types, ordre des tours
      SaveManager.js           → sauvegarde locale (localStorage) + fichier JSON
```

Tous les graphismes sont générés par code (formes colorées) — aucune image sous licence n'est utilisée. Vous pouvez remplacer les textures dans `BootScene.js` par vos propres sprites (spritesheets PNG) sans toucher au reste du code.

## Contenu actuel

- 9 îles reliées entre elles, chacune avec son boss
- 8 personnages recrutables, chacun avec ses propres attaques et un type de combat
- Système de types/faiblesses sur les attaques (tranchant, choc, feu, distance, mental, haki)
- Rencontres aléatoires avec des ennemis qui rapportent des berrys
- Coffres, PNJ de dialogue, tavernes (point de sauvegarde/soin)

## Pistes d'extension

- **Vrais sprites** : remplacer les jetons colorés par des spritesheets animés (marche 4 directions).
- **Plus d'îles / boss** : `islands.js` est conçu pour être étendu facilement (copier un bloc, ajuster la grille et les `warps`).
- **Menu d'objets élargi** : `items.js` ne contient pour l'instant que deux potions de soin.
