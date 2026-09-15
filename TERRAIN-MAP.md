# Nouveau système de carte

Pour Shells Town, la carte visuelle et la collision sont maintenant pilotées par `src/game/data/islands.js`, dans `terrain`.

Une case = un caractère :
- `t` = terre
- `c` = chemin
- `p` = sol intérieur de la prison
- `w` = mur de prison (bloquant)
- `b` = entrée de prison (bloquée avant Morgan, ouverte après Morgan)
- `d` = quai
- `s` = mer (bloquante)

Les `wildZones` restent indépendantes : elles ne changent pas le rendu des cases.

Pour créer une nouvelle forme de terrain, il suffit de modifier les lignes de `terrain` en gardant exactement la même largeur et le même nombre de lignes que la carte.
