#!/bin/bash

# Script d'installation NavWeb - Résout automatiquement les problèmes de sécurité macOS
# Usage: curl -s https://raw.githubusercontent.com/teojmn/NavWeb/main/install-navweb.sh | bash

set -e

echo "🚀 Installation de NavWeb v1.0.2..."
echo "===================================="

# Détecter l'architecture
ARCH=$(uname -m)
if [[ "$ARCH" == "arm64" ]]; then
    DMG_NAME="NavWeb-1.0.2-arm64.dmg"
    echo "📱 Détection: Apple Silicon (M1/M2/M3)"
elif [[ "$ARCH" == "x86_64" ]]; then
    DMG_NAME="NavWeb-1.0.2-x64.dmg"
    echo "💻 Détection: Intel x64"
else
    echo "❌ Architecture non supportée: $ARCH"
    exit 1
fi

# Télécharger le DMG
echo "⬇️  Téléchargement de $DMG_NAME..."
DOWNLOAD_URL="https://github.com/teojmn/NavWeb/releases/download/v1.0.2/$DMG_NAME"
curl -L -o "/tmp/$DMG_NAME" "$DOWNLOAD_URL"

# Supprimer les attributs de quarantaine du DMG
echo "🔧 Suppression des attributs de quarantaine..."
xattr -d com.apple.quarantine "/tmp/$DMG_NAME" 2>/dev/null || true

# Monter le DMG
echo "💽 Montage du DMG..."
hdiutil attach "/tmp/$DMG_NAME" -quiet

# Copier l'application
echo "📦 Installation dans Applications..."
cp -R "/Volumes/NavWeb 1.0.2/NavWeb.app" "/Applications/"

# Supprimer les attributs de quarantaine de l'application
echo "🔐 Configuration de la sécurité..."
xattr -rd com.apple.quarantine "/Applications/NavWeb.app" 2>/dev/null || true

# Signature ad-hoc pour éviter les problèmes
if command -v codesign &> /dev/null; then
    echo "🔑 Signature de l'application..."
    codesign --force --deep --sign - "/Applications/NavWeb.app" 2>/dev/null || true
fi

# Démonter et nettoyer
echo "🧹 Nettoyage..."
hdiutil detach "/Volumes/NavWeb 1.0.2" -quiet
rm "/tmp/$DMG_NAME"

echo "✅ NavWeb installé avec succès!"
echo "🎉 Vous pouvez maintenant lancer NavWeb depuis le dossier Applications"
echo ""
echo "💡 Pour lancer depuis le Terminal: open -a NavWeb"
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
echo "  ✅ Mode Picture-in-Picture pour les vidéos 📺"
echo "  ✅ Barre de titre macOS native pour toutes les pages web"
echo "  ✅ Détection automatique des vidéos avec boutons PiP"
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
