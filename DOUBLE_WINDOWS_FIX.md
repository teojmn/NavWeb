# 🔧 Correction des fenêtres doubles - NavWeb

## ❌ Problème corrigé

**Symptôme :** Quand on lance `navweb://instagram.com` depuis Raycast avec l'app fermée :
- ✅ L'app s'ouvre
- ✅ Instagram se charge
- ❌ **MAIS** une fenêtre d'accueil apparaît par-dessus

## 🛠️ Corrections apportées

### 1. **Logique de création de fenêtres repensée**
```typescript
// AVANT: Créait toujours une fenêtre d'accueil puis traitait les URLs
// APRÈS: Traite les URLs en premier, puis crée l'accueil seulement si nécessaire
```

### 2. **Ordre d'exécution modifié**
- ✅ Traitement des URLs en attente en **PREMIER**
- ✅ Création de fenêtre d'accueil **SEULEMENT** si aucune fenêtre existe

### 3. **Conditions strictes**
- Fenêtre d'accueil créée uniquement si :
  - Aucune URL au démarrage **ET**
  - Aucune URL en attente **ET** 
  - Aucune fenêtre existante

## 🚀 Nouveau build disponible

**Fichiers mis à jour :**
- `release/NavWeb-1.0.1-arm64.dmg` (Apple Silicon)
- `release/NavWeb-1.0.1.dmg` (Intel)

## ✅ Comportement attendu maintenant

### Scenario 1: Lancement depuis Raycast
```bash
# App fermée + clic Raycast avec navweb://instagram.com
# Résultat: UNE SEULE fenêtre avec Instagram
```

### Scenario 2: URLs multiples
```bash
# App ouverte + open "navweb://youtube.com"
# Résultat: Nouvelle fenêtre YouTube (pas d'accueil)
```

### Scenario 3: Lancement normal
```bash
# App fermée + lancement normal (sans URL)
# Résultat: Fenêtre d'accueil uniquement
```

## 🧪 Test de vérification

```bash
./test-no-double-windows.sh
```

**Ou manuellement :**
1. Fermer NavWeb complètement
2. Lancer : `open "navweb://instagram.com"`
3. **Vérifier :** Une seule fenêtre avec Instagram

## 📦 Installation

```bash
./install-navweb.sh
```

## 🎯 Résultats

- ✅ **Problème de timing résolu** (plus d'erreur BrowserWindow)
- ✅ **Problème de fenêtres doubles résolu**
- ✅ **Protocole navweb:// fonctionnel**
- ✅ **Intégration Raycast parfaite**

Votre navigateur NavWeb est maintenant **parfaitement fonctionnel** ! 🎉
