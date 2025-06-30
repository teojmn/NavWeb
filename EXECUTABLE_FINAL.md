# 📦 NavWeb - Exécutable Final

## 🎯 Version livrée
**NavWeb v1.0.1** - Build final avec toutes les corrections

## 📁 Fichiers disponibles

### DMG (Recommandé)
- **Apple Silicon (M1/M2/M3)** : `release/NavWeb-1.0.1-arm64.dmg` (89 MB)
- **Intel (x64)** : `release/NavWeb-1.0.1.dmg` (94 MB)

### Applications directes
- **Apple Silicon** : `release/mac-arm64/NavWeb.app`
- **Intel** : `release/mac/NavWeb.app`

## 🚀 Installation rapide

```bash
./install-navweb.sh
```

**Ou manuellement :**
1. Double-cliquer sur le bon DMG pour votre processeur
2. Glisser NavWeb.app vers Applications
3. Fermer le DMG

## ✅ Corrections incluses

### 🛠️ Problèmes résolus
- ✅ **Erreur de timing** : "Cannot create BrowserWindow before app is ready"
- ✅ **Protocole navweb://** : Fonctionne correctement
- ✅ **Intégration Raycast** : Support complet
- ✅ **Gestion multi-instances** : Empêche les doublons

### 🆕 Fonctionnalités ajoutées
- ✅ **Ouverture de liens externes** via `navweb://`
- ✅ **File d'attente des URLs** pour éviter les erreurs de timing
- ✅ **Logs de débogage** détaillés
- ✅ **Scripts de test** et documentation

## 🔧 Configuration Raycast

**URL correcte à utiliser :**
```
navweb://instagram.com
```

**❌ Ne PAS utiliser :**
```
https://www.instagram.com
```

## 🧪 Test de fonctionnement

```bash
# Test Instagram
open "navweb://instagram.com"

# Test YouTube
open "navweb://youtube.com"

# Test GitHub
open "navweb://github.com"
```

## 📋 Résultats attendus
- NavWeb s'ouvre sans erreur
- Chaque URL ouvre une nouvelle fenêtre de navigateur
- Le site se charge automatiquement dans le webview

## 🔍 Débogage

**Console système :**
- Applications > Utilities > Console
- Filtrer par "NavWeb"

**Dans l'app :**
- Menu NavWeb > View > Toggle Developer Tools > Console

## 📝 Notes importantes

1. **Cette version est finale** et corrige tous les problèmes identifiés
2. **Les anciens builds ont été supprimés** pour éviter la confusion
3. **Le dossier `release/` est ignoré par Git** (reste local)
4. **L'app est non-signée** mais fonctionnelle (alerte de sécurité possible au premier lancement)

## 🎉 Prêt à utiliser !

Votre navigateur web minimaliste NavWeb est maintenant prêt avec :
- Interface épurée style macOS
- Support des liens externes
- Intégration Raycast/Alfred
- Navigation fluide
- Gestion multi-fenêtres
