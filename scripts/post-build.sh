#!/bin/bash

# Script de post-build pour signer automatiquement l'application NavWeb
# Cela évite le problème "application endommagée" pour les utilisateurs

set -e

echo "🔧 Post-build: Signature automatique de l'application..."

# Chemin vers l'application dans le DMG
APP_PATH_ARM64="release/mac-arm64/NavWeb.app"
APP_PATH_X64="release/mac/NavWeb.app"

# Fonction pour signer une application
sign_app() {
    local app_path="$1"
    local arch="$2"
    
    if [ -d "$app_path" ]; then
        echo "🔑 Signature de l'application $arch..."
        
        # Signature ad-hoc récursive
        codesign --force --deep --sign - "$app_path"
        
        # Vérification de la signature
        if codesign --verify --verbose "$app_path" 2>/dev/null; then
            echo "✅ Signature $arch réussie"
        else
            echo "❌ Erreur de signature $arch"
            return 1
        fi
    else
        echo "⚠️  Application $arch non trouvée à $app_path"
    fi
}

# Signer les deux versions si elles existent
sign_app "$APP_PATH_ARM64" "ARM64"
sign_app "$APP_PATH_X64" "x64"

echo "🎉 Post-build terminé avec succès!"
