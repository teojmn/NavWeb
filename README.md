# NavWeb - Navigateur Web Minimaliste

Un navigateur web ultra-minimaliste développé avec Electron pour macOS.

## Fonctionnalités

- Interface utilisateur minimaliste et épurée
- Navigation web complète avec WebView
- Gestion multi-fenêtres
- Raccourcis clavier intuitifs
- Style macOS natif avec barre de titre masquée
- **Ouverture de liens depuis l'extérieur** via protocole personnalisé `navweb://`

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

## Ouverture de liens externes

NavWeb peut être utilisé pour ouvrir des liens depuis d'autres applications :

### Protocole personnalisé

Une fois l'application installée, vous pouvez ouvrir des URLs avec le protocole `navweb://` :

```bash
# Ouvrir Instagram
open "navweb://instagram.com"

# Ouvrir une URL complète
open "navweb://https://www.google.com"
```

### Avec Raycast

Pour créer un quicklink dans Raycast :
1. Ouvrir Raycast
2. Créer un nouveau "Quicklink"
3. Utiliser l'URL : `navweb://instagram.com` (ou le site de votre choix)
4. L'assigner à un raccourci clavier

**Voir le fichier [RAYCAST_SETUP.md](RAYCAST_SETUP.md) pour des exemples de configuration détaillés.**

### Avec Alfred

Si vous utilisez Alfred, consultez le fichier [ALFRED_SETUP.md](ALFRED_SETUP.md) pour configurer un workflow personnalisé.

### Script de test

Un script `open-url.sh` est fourni pour tester la fonctionnalité :

```bash
# Tester avec Instagram
./open-url.sh instagram.com

# Tester avec Google
./open-url.sh google.com
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
