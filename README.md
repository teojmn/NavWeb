# NavWeb - Navigateur Web Minimaliste

Un navigateur web ultra-minimaliste développé avec Electron pour macOS.

## Fonctionnalités

- Interface utilisateur minimaliste et épurée
- Navigation web complète avec WebView
- Gestion multi-fenêtres
- Raccourcis clavier intuitifs
- Style macOS natif avec barre de titre masquée

## Raccourcis clavier

- `Cmd+T` : Nouvelle fenêtre
- `Cmd+W` : Fermer la fenêtre
- `Cmd+L` : Focus sur la barre d'adresse
- `Cmd+R` : Recharger la page
- `Cmd+←` : Page précédente
- `Cmd+→` : Page suivante

## Installation

1. Cloner le repository
```bash
git clone https://github.com/teojmn/NavWeb.git
cd NavWeb
```

2. Installer les dépendances
```bash
npm install
```

3. Lancer en mode développement
```bash
npm start
```

## Build

Pour créer une version de production :
```bash
npm run dist
```

## Technologies utilisées

- **Electron** : Framework pour applications desktop
- **TypeScript** : Langage de programmation
- **HTML/CSS** : Interface utilisateur
- **WebView** : Moteur de rendu web

## Structure du projet

```
src/
├── main.ts              # Processus principal Electron
├── preload.ts           # Script de preload
├── renderer/
│   ├── home.html        # Page d'accueil
│   ├── index.html       # Interface du navigateur
│   ├── renderer.ts      # Logique du renderer
│   └── styles.css       # Styles CSS
└── types/
    └── electron.d.ts    # Types TypeScript
```

## Licence

MIT
