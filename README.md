<div align="center">

# 🌐 NavWeb

### Navigateur Web Ultra-Minimaliste pour macOS

*Un navigateur épuré qui va à l'essentiel*

[![Version](https://img.shields.io/badge/version-1.0.1-blue.svg)](https://github.com/teojmn/NavWeb/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-macOS-lightgrey.svg)](https://www.apple.com/macos/)
[![Built with Electron](https://img.shields.io/badge/built%20with-Electron-9feaf9.svg)](https://www.electronjs.org/)

---

</div>

## ✨ Fonctionnalités

- 🎨 **Interface minimaliste** : Design épuré qui se concentre sur l'essentiel
- 🖥️ **Navigation complète** : WebView intégré pour une expérience web native
- 🪟 **Multi-fenêtres** : Gestion intelligente de plusieurs fenêtres
- ⌨️ **Raccourcis intuitifs** : Navigation rapide au clavier
- 🍎 **Style macOS natif** : Intégration parfaite avec l'écosystème Apple
- 🔗 **Protocole personnalisé** : Ouverture depuis d'autres applications via `navweb://`
- ⚡ **Performances optimisées** : Léger et rapide

## ⌨️ Raccourcis clavier

| Raccourci | Action |
|-----------|--------|
| `⌘ + T` | Ouvrir une nouvelle fenêtre |
| `⌘ + W` | Fermer la fenêtre courante |
| `⌘ + L` | Focus sur la barre d'adresse |
| `⌘ + R` | Recharger la page |
| `⌘ + ←` | Page précédente |
| `⌘ + →` | Page suivante |

## 🚀 Installation rapide

### Prérequis

- macOS 10.14 ou plus récent
- Node.js 16.0 ou plus récent
- npm ou yarn

### Installation depuis les sources

1. **Cloner le repository**
   ```bash
   git clone https://github.com/teojmn/NavWeb.git
   cd NavWeb
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer en mode développement**
   ```bash
   npm start
   ```

### Installation du binaire

Téléchargez la dernière version depuis les [releases GitHub](https://github.com/teojmn/NavWeb/releases) :

- `NavWeb-1.0.1-arm64.dmg` (Apple Silicon)
- `NavWeb-1.0.1.dmg` (Intel)

## 🔧 Développement

### Scripts disponibles

```bash
# Développement avec rechargement automatique
npm run dev

# Build du projet
npm run build

# Création d'un package de distribution
npm run dist

# Nettoyage des fichiers de build
npm run clean
```

## 🔗 Ouverture de liens externes

NavWeb peut être utilisé comme navigateur par défaut pour certains liens ou depuis d'autres applications.

### 🛠️ Protocole personnalisé `navweb://`

Une fois l'application installée et configurée, vous pouvez ouvrir des URLs directement :

```bash
# Ouvrir Instagram
open "navweb://instagram.com"

# Ouvrir une URL complète avec protocole
open "navweb://https://www.google.com"

# Ouvrir un site local
open "navweb://localhost:3000"
```

## 🛠️ Technologies utilisées

| Technologie | Usage | Version |
|-------------|-------|---------|
| **Electron** | Framework pour applications desktop | ^28.0.0 |
| **TypeScript** | Langage de programmation typé | ^5.0.0 |
| **HTML/CSS** | Interface utilisateur | - |
| **WebView** | Moteur de rendu web intégré | - |
| **Electron Builder** | Packaging et distribution | ^24.0.0 |

## 📁 Structure du projet

```
NavWeb/
├── 📁 src/                     # Code source principal
│   ├── main.ts                 # Processus principal Electron
│   ├── preload.ts              # Script de preload sécurisé
│   ├── 📁 renderer/            # Interface utilisateur
│   │   ├── home.html           # Page d'accueil
│   │   ├── index.html          # Interface du navigateur
│   │   ├── renderer.ts         # Logique côté renderer
│   │   └── styles.css          # Styles CSS
│   └── 📁 types/               # Définitions TypeScript
│       └── electron.d.ts       # Types Electron personnalisés
├── 📁 assets/                  # Ressources statiques
│   └── icon.icns              # Icône de l'application
├── 📁 release/                 # Builds de production
├── package.json               # Configuration npm
├── tsconfig.json              # Configuration TypeScript
└── README.md                  # Ce fichier
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment participer :

1. **Fork** le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. **Commit** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une **Pull Request**

### 📋 Guidelines

- Respecter le style de code existant
- Ajouter des tests si nécessaire
- Mettre à jour la documentation
- Utiliser des commits descriptifs

## 🐛 Signaler un bug

Trouvé un problème ? [Créez une issue](https://github.com/teojmn/NavWeb/issues/new) avec :

- Description détaillée du problème
- Étapes pour reproduire le bug
- Version de macOS utilisée
- Version de NavWeb

## 📄 Licence

Ce projet est sous licence **MIT** - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

<div align="center">

**Fait avec ❤️ par [Teo](https://github.com/teojmn)**

⭐ **N'hésitez pas à mettre une étoile si ce projet vous plaît !**

</div>
