#!/bin/bash

# Script de création de package installer (.pkg) professionnel pour NavWeb
# Offre une expérience d'installation native macOS sans problèmes de sécurité

set -e

VERSION="1.0.2"
APP_NAME="NavWeb"
PKG_DIR="pkg-build"

echo "📦 Création du package installer professionnel pour $APP_NAME v$VERSION..."

# Nettoyer et créer la structure
rm -rf "$PKG_DIR"
mkdir -p "$PKG_DIR/root/Applications"
mkdir -p "$PKG_DIR/scripts"

# Copier l'application (essayer les différents emplacements possibles)
APP_FOUND=false
for app_path in "release/mac-arm64/$APP_NAME.app" "release/mac/$APP_NAME.app" "dist/mac/$APP_NAME.app"; do
    if [ -d "$app_path" ]; then
        echo "📱 Application trouvée : $app_path"
        cp -R "$app_path" "$PKG_DIR/root/Applications/"
        APP_FOUND=true
        break
    fi
done

if [ "$APP_FOUND" = false ]; then
    echo "❌ Application non trouvée. Veuillez d'abord exécuter : npm run dist"
    exit 1
fi

# Script pre-installation (vérifications système)
cat > "$PKG_DIR/scripts/preinstall" << 'EOF'
#!/bin/bash

echo "🔍 Vérification de la compatibilité du système..."

# Vérifier macOS version minimum (10.12+)
MACOS_VERSION=$(sw_vers -productVersion)
MAJOR_VERSION=$(echo $MACOS_VERSION | cut -d. -f1)
MINOR_VERSION=$(echo $MACOS_VERSION | cut -d. -f2)

if [[ $MAJOR_VERSION -lt 10 ]] || [[ $MAJOR_VERSION -eq 10 && $MINOR_VERSION -lt 12 ]]; then
    echo "❌ NavWeb nécessite macOS 10.12 (Sierra) ou plus récent"
    echo "   Votre version : $MACOS_VERSION"
    exit 1
fi

# Vérifier l'espace disque disponible (au moins 200 MB)
AVAILABLE_SPACE=$(df -m /Applications | tail -1 | awk '{print $4}')
if [[ $AVAILABLE_SPACE -lt 200 ]]; then
    echo "❌ Espace disque insuffisant dans /Applications"
    echo "   Requis : 200 MB, Disponible : ${AVAILABLE_SPACE} MB"
    exit 1
fi

echo "✅ Système compatible - macOS $MACOS_VERSION"
echo "✅ Espace disque suffisant - ${AVAILABLE_SPACE} MB disponibles"

exit 0
EOF

# Script post-installation (signature et optimisations)
cat > "$PKG_DIR/scripts/postinstall" << 'EOF'
#!/bin/bash

APP_PATH="/Applications/NavWeb.app"
LOG_FILE="/tmp/navweb-install.log"

echo "🚀 Finalisation de l'installation de NavWeb..." | tee -a "$LOG_FILE"

# Vérifier que l'application a été copiée
if [ ! -d "$APP_PATH" ]; then
    echo "❌ Erreur : Application non trouvée après copie" | tee -a "$LOG_FILE"
    exit 1
fi

# Supprimer les attributs de quarantaine
echo "🔐 Suppression des attributs de quarantaine..." | tee -a "$LOG_FILE"
xattr -rd com.apple.quarantine "$APP_PATH" 2>/dev/null || true

# Signature ad-hoc pour éviter les problèmes de sécurité
echo "✍️ Signature de l'application..." | tee -a "$LOG_FILE"
if command -v codesign &> /dev/null; then
    codesign --force --deep --sign - "$APP_PATH" 2>/dev/null || true
    
    # Vérifier la signature
    if codesign --verify --verbose "$APP_PATH" 2>/dev/null; then
        echo "✅ Signature réussie" | tee -a "$LOG_FILE"
    else
        echo "⚠️ Signature échouée mais l'installation continue" | tee -a "$LOG_FILE"
    fi
else
    echo "⚠️ codesign non disponible, signature ignorée" | tee -a "$LOG_FILE"
fi

# Définir les permissions correctes
echo "🔧 Configuration des permissions..." | tee -a "$LOG_FILE"
chmod -R 755 "$APP_PATH"
chown -R root:admin "$APP_PATH" 2>/dev/null || true

# Créer un raccourci dans le Dock pour l'utilisateur actuel (optionnel)
CURRENT_USER=$(who | awk '/console/ {print $1}' | head -1)
if [ -n "$CURRENT_USER" ]; then
    echo "🎯 Configuration pour l'utilisateur : $CURRENT_USER" | tee -a "$LOG_FILE"
    # Note: Nous ne modifions pas automatiquement le Dock pour respecter les préférences utilisateur
fi

# Notification de succès
echo "✅ NavWeb installé avec succès !" | tee -a "$LOG_FILE"
echo "🎉 Vous pouvez maintenant lancer NavWeb depuis :" | tee -a "$LOG_FILE"
echo "   • Applications" | tee -a "$LOG_FILE"
echo "   • Spotlight (Cmd+Space puis tapez 'NavWeb')" | tee -a "$LOG_FILE"
echo "   • Launchpad" | tee -a "$LOG_FILE"

# Notification système (s'exécute en arrière-plan)
(
    sleep 2
    sudo -u "$CURRENT_USER" osascript -e '
        display notification "NavWeb a été installé avec succès ! Vous pouvez maintenant le lancer depuis Applications." with title "Installation terminée" subtitle "NavWeb v1.0.2" sound name "Glass"
    ' 2>/dev/null || true
) &

echo "📝 Log d'installation sauvegardé : $LOG_FILE" | tee -a "$LOG_FILE"

exit 0
EOF

# Rendre les scripts exécutables
chmod +x "$PKG_DIR/scripts/preinstall"
chmod +x "$PKG_DIR/scripts/postinstall"

# Créer le package avec toutes les métadonnées
echo "🔨 Génération du package installer..."

# Créer des packages séparés pour chaque architecture
for arch in "arm64" "x64"; do
    PKG_NAME="NavWeb-$VERSION-$arch.pkg"
    
    # Copier la bonne version de l'app selon l'architecture
    rm -rf "$PKG_DIR/root/Applications/$APP_NAME.app"
    
    if [ "$arch" = "arm64" ] && [ -d "release/mac-arm64/$APP_NAME.app" ]; then
        cp -R "release/mac-arm64/$APP_NAME.app" "$PKG_DIR/root/Applications/"
        echo "📱 Création du package ARM64..."
    elif [ "$arch" = "x64" ] && [ -d "release/mac/$APP_NAME.app" ]; then
        cp -R "release/mac/$APP_NAME.app" "$PKG_DIR/root/Applications/"
        echo "💻 Création du package x64..."
    else
        echo "⚠️ Architecture $arch non trouvée, ignorée"
        continue
    fi
    
    # Créer le package
    pkgbuild \
        --root "$PKG_DIR/root" \
        --scripts "$PKG_DIR/scripts" \
        --identifier "com.navweb.app.$arch" \
        --version "$VERSION" \
        --install-location "/" \
        --ownership preserve \
        "release/$PKG_NAME"
    
    if [ $? -eq 0 ]; then
        PKG_SIZE=$(du -h "release/$PKG_NAME" | cut -f1)
        echo "✅ Package $arch créé : release/$PKG_NAME ($PKG_SIZE)"
    else
        echo "❌ Erreur lors de la création du package $arch"
    fi
done

# Nettoyer les fichiers temporaires
rm -rf "$PKG_DIR"

echo "🎉 Packages installers créés avec succès !"
echo ""
echo "📋 Instructions pour les utilisateurs :"
echo "   1. Télécharger le fichier .pkg approprié (ARM64 pour Apple Silicon, x64 pour Intel)"
echo "   2. Double-cliquer sur le fichier .pkg"
echo "   3. Suivre l'assistant d'installation macOS"
echo "   4. L'application sera installée automatiquement dans Applications"
echo ""
echo "✨ Expérience utilisateur : Double-clic → Installation native → Terminé !"
