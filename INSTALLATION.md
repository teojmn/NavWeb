# 🚀 Guide d'installation NavWeb

## Installation rapide

1. **Choisir votre version :**
   - **Apple Silicon (M1/M2/M3)** : `NavWeb-1.0.1-arm64.dmg`
   - **Intel** : `NavWeb-1.0.1.dmg`

2. **Installer :**
   - Double-cliquer sur le fichier DMG
   - Glisser NavWeb.app vers Applications
   - Fermer le DMG

3. **Premier lancement :**
   - Ouvrir Applications
   - Lancer NavWeb
   - Accepter les autorisations si demandées

## Configuration Raycast (Recommandé)

### Instagram
- **Nom** : "Open Instagram in NavWeb"
- **URL** : `navweb://instagram.com`
- **Raccourci** : `⌘⇧I`

### YouTube
- **Nom** : "Open YouTube in NavWeb"  
- **URL** : `navweb://youtube.com`
- **Raccourci** : `⌘⇧Y`

### GitHub
- **Nom** : "Open GitHub in NavWeb"
- **URL** : `navweb://github.com`
- **Raccourci** : `⌘⇧G`

## Test rapide

Depuis le terminal :
```bash
# Test Instagram
open "navweb://instagram.com"

# Test YouTube
open "navweb://youtube.com"

# Test Google
open "navweb://google.com"
```

Ou utilisez le script de test fourni :
```bash
./test-production.sh
```

## Dépannage

### L'app ne s'ouvre pas
- Aller dans Préférences Système > Sécurité et confidentialité
- Autoriser NavWeb.app
- Ou faire clic droit > Ouvrir sur l'app

### Le protocole navweb:// ne fonctionne pas
- Redémarrer l'app une fois
- Le protocole sera enregistré automatiquement

### Problème avec Raycast
- Vérifier que l'URL commence bien par `navweb://`
- Tester d'abord depuis le terminal
