#!/bin/bash

echo "🚀 Installation NavWeb - Version corrigée"
echo "=========================================="

# Déterminer l'architecture du processeur
ARCH=$(uname -m)
if [[ "$ARCH" == "arm64" ]]; then
    DMG_FILE="release/NavWeb-1.0.1-arm64.dmg"
    ARCH_NAME="Apple Silicon (M1/M2/M3)"
else
    DMG_FILE="release/NavWeb-1.0.1.dmg"
    ARCH_NAME="Intel (x64)"
fi

echo "🔍 Architecture détectée: $ARCH_NAME"
echo "📦 Fichier DMG: $DMG_FILE"

# Vérifier que le DMG existe
if [ ! -f "$DMG_FILE" ]; then
    echo "❌ Erreur: DMG non trouvé ($DMG_FILE)"
    echo "   Assurez-vous d'avoir exécuté: npm run dist"
    exit 1
fi

echo "✅ DMG trouvé ($(du -h "$DMG_FILE" | cut -f1))"

# Fermer NavWeb s'il est ouvert
echo "🔄 Fermeture de NavWeb si ouvert..."
pkill -f "NavWeb" 2>/dev/null || true
sleep 2

# Supprimer l'ancienne version si elle existe
if [ -d "/Applications/NavWeb.app" ]; then
    echo "🗑️  Suppression de l'ancienne version..."
    rm -rf "/Applications/NavWeb.app"
fi

# Monter le DMG
echo "📂 Montage du DMG..."
MOUNT_POINT=$(hdiutil attach "$DMG_FILE" | grep "/Volumes" | cut -f3)

if [ -z "$MOUNT_POINT" ]; then
    echo "❌ Erreur lors du montage du DMG"
    exit 1
fi

echo "✅ DMG monté sur: $MOUNT_POINT"

# Copier l'application
echo "📋 Installation de NavWeb.app..."
cp -R "$MOUNT_POINT/NavWeb.app" "/Applications/"

if [ $? -eq 0 ]; then
    echo "✅ NavWeb.app installé avec succès !"
else
    echo "❌ Erreur lors de l'installation"
    hdiutil detach "$MOUNT_POINT" -quiet
    exit 1
fi

# Démonter le DMG
echo "📤 Démontage du DMG..."
hdiutil detach "$MOUNT_POINT" -quiet

echo ""
echo "🎉 Installation terminée avec succès !"
echo ""
echo "📋 Fonctionnalités incluses:"
echo "  ✅ Correction du timing (pas d'erreur 'BrowserWindow before app ready')"
echo "  ✅ Support du protocole navweb://"
echo "  ✅ Ouverture de liens depuis Raycast/Alfred"
echo "  ✅ Logs de débogage détaillés"
echo ""
echo "🚀 Test rapide:"
echo "   open \"navweb://instagram.com\""
echo ""
echo "💡 Configuration Raycast:"
echo "   URL: navweb://instagram.com"
echo "   (PAS https://www.instagram.com)"
echo ""
echo "🔧 Pour voir les logs de débogage:"
echo "   Menu NavWeb > View > Toggle Developer Tools > Console"
