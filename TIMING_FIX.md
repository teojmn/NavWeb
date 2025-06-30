# 🛠️ Correction du problème de timing NavWeb

## ❌ Erreur corrigée

```
Error: Cannot create BrowserWindow before app is ready
```

## 🔧 Corrections apportées

### 1. **File d'attente des URLs**
- Les URLs reçues avant que l'app soit prête sont mises en file d'attente
- Elles sont traitées une fois l'app entièrement initialisée

### 2. **Vérification de l'état de l'app**
- Ajout d'un flag `isAppReady` pour suivre l'état de l'application
- Vérifications dans tous les handlers d'événements

### 3. **Gestion des événements `open-url`**
- L'événement `open-url` peut être déclenché très tôt par macOS
- Les URLs sont maintenant mises en attente si nécessaire

## 🚀 Installation de la correction

1. **Installer la nouvelle version :**
   ```bash
   ./test-timing-fix.sh
   ```

2. **Ou manuellement :**
   - Ouvrir `release/NavWeb-1.0.1-arm64.dmg`
   - Glisser NavWeb.app vers Applications (remplacer l'ancienne version)

## ✅ Vérification

Testez avec :
```bash
open "navweb://instagram.com"
```

**Résultat attendu :**
- ✅ NavWeb s'ouvre sans erreur
- ✅ Instagram se charge dans une nouvelle fenêtre
- ✅ Aucun message d'erreur dans la console

## 🔍 Débogage avancé

Si vous voulez voir les logs de débogage :

1. **Ouvrir la Console système :**
   - Applications > Utilities > Console
   - Filtrer par "NavWeb"

2. **Ou dans l'app :**
   - Menu NavWeb > View > Toggle Developer Tools
   - Onglet Console

**Logs attendus :**
```
🌐 Événement open-url reçu: navweb://instagram.com
🧹 Nettoyage de l'URL: navweb://instagram.com
🔗 URL extraite: instagram.com
🔧 URL finale avec https:// https://instagram.com
🚀 Ouverture de fenêtre navigateur avec: https://instagram.com
🖥️ Création fenêtre navigateur pour URL: https://instagram.com
✅ Fenêtre navigateur prête à être affichée
📤 Envoi navigate-to avec URL: https://instagram.com
```

## 📱 Configuration Raycast

**Rappel :** Votre quicklink Raycast doit utiliser :
```
navweb://instagram.com
```

**Et NON :**
```
https://www.instagram.com
```
