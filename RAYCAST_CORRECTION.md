# 🔧 CORRECTION - Configuration Raycast pour NavWeb

## ❌ ERREUR COURANTE

**INCORRECT :**
```
https://www.instagram.com
```

## ✅ CONFIGURATION CORRECTE

**CORRECT :**
```
navweb://instagram.com
```

## 📋 Quicklinks corrigés pour Raycast

### Instagram
- **Nom** : Open Instagram in NavWeb
- **URL** : `navweb://instagram.com` ⚠️ **PAS** `https://www.instagram.com`
- **Raccourci** : `⌘⇧I`

### YouTube
- **Nom** : Open YouTube in NavWeb  
- **URL** : `navweb://youtube.com` ⚠️ **PAS** `https://www.youtube.com`
- **Raccourci** : `⌘⇧Y`

### GitHub
- **Nom** : Open GitHub in NavWeb
- **URL** : `navweb://github.com` ⚠️ **PAS** `https://www.github.com`
- **Raccourci** : `⌘⇧G`

### Twitter/X
- **Nom** : Open Twitter in NavWeb
- **URL** : `navweb://twitter.com` ⚠️ **PAS** `https://www.twitter.com`
- **Raccourci** : `⌘⇧T`

## 🔍 Comment vérifier

1. **Tester depuis le terminal :**
   ```bash
   # ✅ CORRECT - Ouvre dans NavWeb
   open "navweb://instagram.com"
   
   # ❌ INCORRECT - Ouvre dans Safari/Chrome
   open "https://www.instagram.com"
   ```

2. **Script de test :**
   ```bash
   ./debug-quicklink.sh
   ```

## 🚨 Points importants

- **Le protocole `navweb://` est OBLIGATOIRE** pour que l'URL soit capturée par NavWeb
- **Sans `navweb://`**, l'URL s'ouvre dans votre navigateur par défaut
- **Pas de `www.`** nécessaire : `navweb://instagram.com` suffit
- **NavWeb ajoute automatiquement `https://`** si nécessaire

## 🛠️ Débogage

Si ça ne fonctionne toujours pas :

1. **Vérifiez votre quicklink Raycast** qu'il utilise bien `navweb://`
2. **Testez depuis le terminal** avec `open "navweb://instagram.com"`  
3. **Regardez les logs** : Ouvrez DevTools dans NavWeb (Menu > View > Toggle Developer Tools)
4. **Rebuilder l'app** si vous avez fait des modifications : `npm run dist`
