# SmartHomeMind — V1

Application web d'évaluation de sécurité domestique. Zéro framework, zéro
bundler — HTML, CSS et JavaScript natifs (modules ES6).

## ⚠️ Important : comment tester en local

Les modules ES6 (`import`/`export`) sont bloqués par les navigateurs si
vous ouvrez `index.html` directement en double-cliquant dessus (protocole
`file://`). Il faut servir les fichiers via un petit serveur local. Deux
options simples :

**Option A — VS Code (le plus simple si tu codes déjà dans VS Code)**
1. Installe l'extension "Live Server".
2. Clic droit sur `index.html` → "Open with Live Server".

**Option B — Python (déjà installé sur la plupart des systèmes)**
```bash
cd SmartHomeMind
python3 -m http.server 8000
```
Puis ouvre `http://localhost:8000` dans ton navigateur.

Une fois déployé sur GitHub Pages (voir plus bas), ce problème disparaît —
GitHub Pages sert les fichiers via `https://`, pas `file://`, donc les
modules fonctionnent normalement sans configuration supplémentaire.

## Déployer sur GitHub Pages

1. Crée un nouveau dépôt GitHub (public).
2. Mets-y tous les fichiers de ce dossier (`index.html`, `css/`, `js/`,
   `assets/`) — via l'interface web GitHub ("Add file" → "Upload files"),
   comme pour tes autres projets.
3. Dans le dépôt : **Settings → Pages → Source → Deploy from a branch →
   main / (root)** → Save.
4. Après une à deux minutes, ton app est en ligne à l'adresse indiquée par
   GitHub Pages.

## Lancer les tests du moteur de risque

Nécessite Node.js (déjà utilisé pour d'autres de tes projets) :
```bash
node tests/scoring.test.mjs
```
Si tout est correct, tu verras `ALL TESTS PASSED (9/9)`.

## Structure du projet

```
index.html                       Squelette de la page
manifest.json                    Fiche d'identité PWA (nom, icônes, couleurs)
service-worker.js                Mise en cache hors-ligne de l'app
css/style.css                    Tous les styles
js/main.js                       Contrôleur d'application (routeur d'écrans)
js/data/categories.js            Catégories et poids de calcul
js/data/questions.js             Banque de questions
js/data/recommendations.js       Contenu des recommandations
js/core/DynamicRiskEngine.js     Moteur de calcul du score (pur, testé)
js/core/RecommendationEngine.js  Priorisation des recommandations (DAP)
js/storage/StorageAdapter.js     Interface de stockage (contrat)
js/storage/LocalStorageAdapter.js Implémentation V1 (localStorage)
js/ui/AssessmentUI.js            Écran du questionnaire
js/ui/ResultsUI.js               Écran des résultats
js/ui/HistoryUI.js               Écran de l'historique
assets/icons/                    Icônes PWA (192px, 512px, iOS)
tests/scoring.test.mjs           Tests unitaires du moteur de risque
```

## PWA — installation et mode hors-ligne

L'app est maintenant une vraie PWA (Progressive Web App) :

- **Installable** : sur Android/Chrome, une fois déployée en HTTPS (GitHub
  Pages), le navigateur propose "Ajouter à l'écran d'accueil". Sur iOS
  Safari : bouton Partager → "Sur l'écran d'accueil".
- **Fonctionne hors-ligne** : après une première visite en ligne,
  `service-worker.js` garde une copie de toute l'app en cache — elle
  s'ouvre et fonctionne normalement même sans connexion internet.

⚠️ **Le service worker ne fonctionne QUE sur une vraie adresse
`https://`** (comme GitHub Pages) — il reste inactif quand tu testes en
local avec un simple serveur `http://localhost`. C'est normal, tester la
PWA (installation + mode hors-ligne) se fait après déploiement.

**Si tu modifies un fichier de l'app après le premier déploiement** :
ouvre `service-worker.js` et change `CACHE_VERSION` (ex. `"v1"` →
`"v2"`). Sans ça, les utilisateurs qui ont déjà visité le site
continueront de voir l'ancienne version en cache.

## Modifier les questions ou les poids

- Ajouter/modifier une question → `js/data/questions.js`
- Changer le poids d'une catégorie → `js/data/categories.js` (les poids
  doivent toujours totaliser 1.0 — un avertissement s'affiche dans la
  console du navigateur si ce n'est pas le cas)
- Modifier le texte d'une recommandation → `js/data/recommendations.js`

Aucune de ces modifications ne nécessite de toucher au code de calcul
(`DynamicRiskEngine.js`) ni à l'interface — c'est tout l'intérêt du
modèle "data-driven".
