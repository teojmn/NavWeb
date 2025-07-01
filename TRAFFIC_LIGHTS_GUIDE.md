# 🎯 Guide de positionnement des Traffic Lights - NavWeb

## 🎨 Approche hybride (actuelle)

**NavWeb utilise maintenant une approche hybride :**

### 🏠 Page d'accueil
- **Barre de titre personnalisée** (`hiddenInset`)
- **Position traffic lights** : `{ x: 20, y: 15 }`
- **Design moderne** avec transparence et effet blur

### 🌐 Pages web
- **Barre de titre native macOS** (`default`)
- **Position traffic lights** : Par défaut macOS
- **Intégration native** avec le système

> ✨ **Avantage :** Le meilleur des deux mondes - design personnalisé pour l'accueil et intégration native pour la navigation web.

## 📍 Position actuelle modifiée

**Nouvelle position :**
```typescript
trafficLightPosition: { x: 20, y: 15 }
```

**Hauteur de barre de titre ajustée :**
```css
.title-bar { height: 40px; }
```
> ✨ **Note :** La hauteur de la barre de titre a été augmentée de 30px à 40px pour mieux centrer verticalement les traffic lights avec la position y: 15.

**Ancienne position :**
- Fenêtre d'accueil : `{ x: 15, y: 9 }`
- Fenêtre navigateur : `{ x: 15, y: 12 }`

## 🎛️ Options de positionnement

### Position par défaut macOS
```typescript
trafficLightPosition: { x: 15, y: 9 }
```

### Position plus espacée (actuelle)
```typescript
trafficLightPosition: { x: 20, y: 15 }
```

### Position centrée verticalement
```typescript
trafficLightPosition: { x: 15, y: 15 }
```

### Position plus à droite
```typescript
trafficLightPosition: { x: 25, y: 12 }
```

### Position classique Safari-like
```typescript
trafficLightPosition: { x: 12, y: 12 }
```

## 🔧 Comment modifier

### 1. **Fichier principal :** `src/main.ts`

**Lignes à modifier :**
```typescript
// Fenêtre d'accueil (ligne ~195)
trafficLightPosition: { x: 20, y: 15 },

// Fenêtre navigateur (ligne ~265) 
trafficLightPosition: { x: 20, y: 15 },
```

### 2. **Ajuster le CSS :** `src/renderer/styles.css`

**Si vous déplacez vers la droite :**
```css
.title-bar-content {
    padding-left: 80px; /* Augmenter pour plus d'espace */
}
```

**Si vous déplacez vers la gauche :**
```css
.title-bar-content {
    padding-left: 60px; /* Diminuer pour moins d'espace */
}
```

## 🎨 Synchronisation Barre de titre & Traffic Lights

### Règle importante
**La hauteur de la barre de titre doit être ajustée selon la position Y des traffic lights :**

```css
/* Pour y: 9-12 */
.title-bar { height: 30px; }

/* Pour y: 15 (actuel) */
.title-bar { height: 40px; }

/* Pour y: 18+ */
.title-bar { height: 45px; }
```

### Calcul recommandé
```
Hauteur barre = (Position Y × 2) + 10px
Exemple : y: 15 → (15 × 2) + 10 = 40px ✅
```

### Ajustements CSS associés
```css
#webview {
    height: calc(100vh - [hauteur_barre]px);
    margin-top: [hauteur_barre]px;
}
```

## 🧪 Test des modifications

1. **Compiler :**
   ```bash
   npm run build
   ```

2. **Tester en dev :**
   ```bash
   npm start
   ```

3. **Créer un nouvel exécutable :**
   ```bash
   rm -rf release/ && npm run dist
   ```

## 📐 Références de position

**Axe X (horizontal) :**
- `x: 10` = Très proche du bord
- `x: 15` = Position standard
- `x: 20` = Plus espacé (actuel)
- `x: 25` = Beaucoup d'espace

**Axe Y (vertical) :**
- `y: 9` = Plus haut
- `y: 12` = Centré
- `y: 15` = Plus bas (actuel)
- `y: 18` = Très bas

## 💡 Recommandations

**Pour un look moderne :**
```typescript
{ x: 20, y: 15 } // Position actuelle
```

**Pour un look classique :**
```typescript
{ x: 15, y: 12 }
```

**Pour plus d'espace :**
```typescript
{ x: 25, y: 15 }
```

Quelle position préférez-vous ? Je peux ajuster selon vos goûts ! 🎨
