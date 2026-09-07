# Grand Line Tactics

Jeu perso d'exploration et de combat au tour par tour, dans l'esprit Pokémon (vue du dessus, carte en tuiles) mais sur l'univers **One Piece**. Pas de capture : les personnages rencontrés sont défiés en combat, et une fois vaincus, ils rejoignent votre équipage.

> Projet à usage strictement personnel, comme convenu.

## Stack

- **Next.js 14** (App Router) — hébergement et API
- **Phaser 3** — moteur de jeu 2D, exécuté côté client
- **Prisma + Neon (Postgres)** — sauvegarde de partie persistante (optionnelle : sans Neon configuré, le jeu sauvegarde automatiquement dans le navigateur via `localStorage`)

## Démarrer en local

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

**Contrôles** : flèches directionnelles ou ZQSD/WASD pour se déplacer. Marcher sur un PNJ coloré déclenche un combat de recrutement. Les tuiles dorées sont des passages vers une autre île.

## Activer la sauvegarde Neon (optionnel)

1. Créez une base sur [neon.tech](https://neon.tech) (gratuit).
2. Copiez `.env.example` vers `.env` et collez l'URL de connexion dans `DATABASE_URL`.
3. Générez le client et poussez le schéma :
   ```bash
   npm run db:generate
   npm run db:push
   ```
4. Relancez `npm run dev`. Le jeu sauvegarde automatiquement à chaque déplacement.

Sans étape 2-3, le jeu fonctionne quand même : il utilise `localStorage` comme sauvegarde locale.

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
2. Si vous utilisez Neon : dans les paramètres du projet Vercel, ajoutez la variable d'environnement `DATABASE_URL` (même valeur que dans `.env`).
3. Déployez. Vercel détecte Next.js automatiquement.

## Architecture

```
src/
  app/
    page.js              → point d'entrée, charge le canvas Phaser (sans SSR)
    api/save/route.js    → API de sauvegarde/chargement (Neon)
  components/
    GameCanvas.js         → pont React <-> Phaser
  game/
    main.js               → configuration Phaser (liste des scènes)
    scenes/
      BootScene.js         → génère les textures (aucun asset externe requis)
      WorldScene.js         → carte, déplacement, passages, rencontres
      BattleScene.js        → combat au tour par tour, recrutement
    data/
      islands.js            → grilles de tuiles, PNJ, zones de rencontre
      characters.js         → stats des personnages recrutables et ennemis
      moves.js               → attaques (dégâts, précision)
    systems/
      BattleSystem.js         → calculs de dégâts, ordre des tours
      SaveManager.js           → sauvegarde (Neon avec repli localStorage)
```

Tous les graphismes sont générés par code (formes colorées) — aucune image sous licence n'est utilisée. Vous pouvez remplacer les textures dans `BootScene.js` par vos propres sprites (spritesheets PNG) sans toucher au reste du code.

## Contenu actuel

- 3 îles reliées entre elles (Île de Cocorico → Île de la Brume → Île d'Hiver)
- 5 personnages recrutables, chacun avec ses propres attaques
- Rencontres aléatoires avec des ennemis (Marine / pirates rivaux) qui rapportent des berrys
- Le capitaine gagne en puissance à chaque recrutement (bonus d'attaque et de PV cumulatif)

## Pistes d'extension

- **Échanger de personnage actif** : actuellement le capitaine combat toujours seul ; on pourrait faire combattre le membre d'équipage de son choix (façon changement de créature Pokémon).
- **Vrais sprites** : remplacer les jetons colorés par des spritesheets animés (marche 4 directions).
- **Plus d'îles / boss** : `islands.js` est conçu pour être étendu facilement (copier un bloc, ajuster la grille et les `warps`).
- **Fruits du démon** : ajouter un système de types/faiblesses sur les attaques (`type` est déjà présent dans `moves.js`, prêt à être exploité).
- **Menu d'équipage** : écran listant les membres recrutés avec leurs stats.
