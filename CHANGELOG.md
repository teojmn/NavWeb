# Changelog

## [1.0.2] - 2025-07-07

### ✨ Nouvelles fonctionnalités
- **Interface Glassmorphism** : Design moderne avec effets de transparence et de flou
- **Fond d'écran macOS** : Utilisation automatique du fond d'écran de l'utilisateur comme background
- **Préchargement intelligent** : Le fond d'écran est préchargé au démarrage pour une meilleure performance

### 🚀 Optimisations de performance
- **Cache intelligent** : Mise en cache du fond d'écran pendant 10 minutes avec vérification des changements
- **Compression d'images** : Optimisation de la qualité (résolution 1600x900, qualité JPEG 60%)
- **Chargement asynchrone** : Chargement non-bloquant avec délai de 100ms pour l'interface
- **Amélioration ~50-70%** du temps de chargement du fond d'écran

### 🎨 Améliorations visuelles
- **Transitions fluides** : Transitions CSS de 0.3s pour éviter les changements brusques
- **Design cohérent** : Tous les éléments (search bar, suggestions, boutons) en style glassmorphism
- **Police Inter** : Intégration de la police Google Fonts Inter pour une typographie moderne
- **Masquage intelligent** : Les boutons de raccourcis se masquent automatiquement lors de l'affichage des suggestions

### 🔧 Améliorations techniques
- **Gestion d'erreurs robuste** : Fallback gracieux en cas d'erreur de chargement du fond d'écran
- **Métriques de performance** : Mesure et affichage des temps de chargement en console
- **Méthodes de rafraîchissement** : Possibilité de forcer le rechargement du fond d'écran
- **Prévention des appels multiples** : Protection contre les appels concurrents

### 🐛 Corrections
- **Stabilité** : Amélioration de la stabilité lors du chargement des fonds d'écran
- **Gestion mémoire** : Libération appropriée des ressources après utilisation
- **Compatibilité** : Meilleure compatibilité avec différents formats d'images de fond d'écran macOS

## [1.0.1] - 2025-07-06

### ✨ Nouvelles fonctionnalités
- Ajout de la licence MIT
- Chargement des sites populaires depuis un fichier JSON
- Amélioration de la logique de génération des suggestions

### 🔧 Améliorations techniques
- Refactorisation du code pour une meilleure lisibilité et maintenabilité
- Suppression des fichiers de test pour Picture-in-Picture

## [1.0.0] - 2025-07-05

### 🎉 Version initiale
- Navigateur web minimaliste pour macOS
- Page d'accueil avec barre de recherche
- Suggestions de sites populaires
- Support Picture-in-Picture
- Raccourcis clavier globaux
- Gestion des protocoles personnalisés
