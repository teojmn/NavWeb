# 🚀 NavWeb v1.0.1 - Nouvelle version avec barre de titre ajustée

## ✨ Nouveautés de cette version

### 🎨 **Amélioration visuelle majeure**
- **Hauteur de barre de titre** : 30px → **40px**
- **Traffic lights parfaitement centrés** avec position `{ x: 20, y: 15 }`
- **Interface plus moderne** et équilibrée visuellement

### 🔧 **Modifications techniques**
```css
/* Barre de titre */
.title-bar { height: 40px; }

/* Contenu web ajusté */
#webview {
    height: calc(100vh - 40px);
    margin-top: 40px;
}
```

## 📦 **Fichiers générés**

### 🍎 **macOS (Apple Silicon)**
- **Fichier :** `NavWeb-1.0.1-arm64.dmg`
- **Taille :** 89 MB
- **Architecture :** ARM64 (M1/M2/M3 Mac)

### 🍎 **macOS (Intel)**
- **Fichier :** `NavWeb-1.0.1.dmg`
- **Taille :** 94 MB
- **Architecture :** x64 (Intel Mac)

## 🎯 **Fonctionnalités**

✅ **Protocole personnalisé** `navweb://` pour ouvrir des liens externes  
✅ **Traffic lights centrés** dans une barre de titre moderne  
✅ **Interface minimaliste** avec barre d'adresse flottante  
✅ **Gestion des URLs** avant que l'app soit prête  
✅ **Pas de double fenêtre** à l'ouverture via lien externe  

## 🔗 **Installation et utilisation**

### Installation
```bash
# Télécharger le bon fichier selon votre Mac :
# - NavWeb-1.0.1-arm64.dmg (Apple Silicon)
# - NavWeb-1.0.1.dmg (Intel)

# Ou utiliser le script d'installation
./install-navweb.sh
```

### Utilisation
```bash
# Via terminal
open "navweb://https://github.com"

# Via Raycast/Alfred
navweb://google.com

# Double-clic sur l'app pour la fenêtre d'accueil
```

## 📋 **Configuration Raycast**

```javascript
// Raycast Script Command
import { runAppleScript } from "@raycast/utils";
export default async function main() {
  const url = arguments[0] || "https://google.com";
  await runAppleScript(`open "navweb://${url}"`);
}
```

## 🛠️ **Développement**

```bash
# Lancer en mode développement
npm start

# Compiler
npm run build

# Générer l'exécutable
npm run dist

# Tester le positionnement des traffic lights
./test-traffic-lights.sh
```

## 📚 **Documentation**

- `TRAFFIC_LIGHTS_GUIDE.md` - Guide de positionnement des traffic lights
- `TITLE_BAR_HEIGHT_FIX.md` - Détails de l'ajustement de la barre de titre
- `TIMING_FIX.md` - Correction des problèmes de timing
- `DOUBLE_WINDOWS_FIX.md` - Correction du bug de double fenêtre

## 🎨 **Personnalisation**

Le style CSS peut être modifié dans `src/renderer/styles.css` :
- Couleurs de la barre de titre
- Position des traffic lights dans `src/main.ts`
- Effets visuels (blur, transparence)
- Taille et position de la barre d'adresse

---

**🎉 Cette version offre une expérience utilisateur considérablement améliorée avec un design plus professionnel et moderne !**
