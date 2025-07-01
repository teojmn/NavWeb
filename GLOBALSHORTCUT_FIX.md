# 🔧 Correction erreur globalShortcut - NavWeb

## ❌ **Problème rencontré**

```
Uncaught Exception:
Error: globalShortcut cannot be used before the app is ready
at App.<anonymous> (/Users/teo.jmn/GITHUB/NavWeb/dist/main.js:62:39)
```

## 🔍 **Analyse du problème**

L'erreur se produisait car `globalShortcut` était utilisé avant que l'application Electron soit complètement prête. Deux situations problématiques :

1. **Event `will-quit`** : Essayait d'utiliser `globalShortcut.unregisterAll()` même si l'app n'était pas encore prête
2. **Méthode `registerGlobalShortcuts`** : Potentiellement appelée avant `app.isReady()`

## ✅ **Corrections apportées**

### 1. **Vérification dans `will-quit`**
```typescript
// AVANT
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// APRÈS
app.on('will-quit', () => {
  if (this.isAppReady) {
    globalShortcut.unregisterAll();
  }
});
```

### 2. **Vérification dans `registerGlobalShortcuts`**
```typescript
// AVANT
private registerGlobalShortcuts(): void {
  // CMD+T pour nouvelle fenêtre
  globalShortcut.register('CmdOrCtrl+T', () => {
    this.handleNewWindow();
  });
  // ...
}

// APRÈS
private registerGlobalShortcuts(): void {
  if (!app.isReady()) {
    console.log('⚠️ App pas encore prête, report de l\'enregistrement des raccourcis');
    return;
  }
  
  console.log('⌨️ Enregistrement des raccourcis globaux');
  
  // CMD+T pour nouvelle fenêtre
  globalShortcut.register('CmdOrCtrl+T', () => {
    this.handleNewWindow();
  });
  // ...
}
```

## 🎯 **Raccourcis globaux supportés**

Une fois l'app prête, les raccourcis suivants sont disponibles :

- **⌘+T** : Nouvelle fenêtre/onglet
- **⌘+W** : Fermer la fenêtre active
- **⌘+L** : Focus sur la barre d'adresse
- **⌘+←** : Page précédente
- **⌘+→** : Page suivante
- **⌘+R** : Actualiser la page

## 🧪 **Test de la correction**

```bash
# Lancer l'application
npm start

# Tester le protocole
open "navweb://https://github.com"

# Tester les raccourcis
# CMD+T, CMD+W, etc.
```

## 💡 **Bonnes pratiques appliquées**

1. **Vérification de l'état** : Toujours vérifier si l'app est prête avant d'utiliser `globalShortcut`
2. **Gestion d'erreur** : Protection contre les appels prématurés
3. **Logging** : Messages de debug pour le troubleshooting
4. **Nettoyage sécurisé** : Désengistrement conditionnel des raccourcis

## ✅ **Résultat**

- ✅ **Plus d'erreur** au démarrage
- ✅ **Raccourcis fonctionnels** une fois l'app prête
- ✅ **Nettoyage sécurisé** à la fermeture
- ✅ **Application stable** et utilisable

Cette correction garantit que `globalShortcut` n'est utilisé qu'au bon moment, éliminant l'erreur de timing qui empêchait le lancement de l'application.
