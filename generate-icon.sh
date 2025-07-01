#!/bin/bash
# Script pour générer l'icône NavWeb

echo "🎨 Génération de l'icône NavWeb"
echo "==============================="
echo ""

# Vérifier si ImageMagick est installé
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick n'est pas installé."
    echo "📦 Installation via Homebrew:"
    echo "   brew install imagemagick"
    echo ""
    echo "🔄 Ou utiliser la méthode alternative..."
    
    # Méthode alternative avec sips (intégré à macOS)
    if command -v sips &> /dev/null; then
        echo "✅ Utilisation de sips (macOS) pour la conversion..."
        
        # Créer un PNG temporaire de haute résolution
        echo "📝 Créer d'abord un PNG avec un outil comme Sketch, Figma ou en ligne:"
        echo "   1. Ouvrir assets/icon.svg dans un éditeur"
        echo "   2. Exporter en PNG 1024x1024"
        echo "   3. Sauvegarder comme assets/icon.png"
        echo ""
        echo "🔄 Puis relancer ce script"
        exit 1
    fi
else
    echo "✅ ImageMagick détecté"
    
    # Convertir SVG en PNG haute résolution
    echo "🔄 Conversion SVG → PNG (1024x1024)..."
    convert assets/icon.svg -resize 1024x1024 assets/icon.png
    
    if [ $? -eq 0 ]; then
        echo "✅ PNG créé avec succès"
    else
        echo "❌ Erreur lors de la conversion SVG → PNG"
        exit 1
    fi
fi

# Vérifier si le PNG existe
if [ ! -f "assets/icon.png" ]; then
    echo "❌ Fichier assets/icon.png introuvable"
    echo "📝 Créez d'abord un PNG 1024x1024 à partir du SVG"
    exit 1
fi

echo "🔄 Génération du fichier ICNS pour macOS..."

# Créer le dossier temporaire pour l'iconset
mkdir -p assets/icon.iconset

# Générer toutes les tailles requises pour macOS
echo "📏 Génération des différentes tailles..."

sips -z 16 16     assets/icon.png --out assets/icon.iconset/icon_16x16.png
sips -z 32 32     assets/icon.png --out assets/icon.iconset/icon_16x16@2x.png
sips -z 32 32     assets/icon.png --out assets/icon.iconset/icon_32x32.png
sips -z 64 64     assets/icon.png --out assets/icon.iconset/icon_32x32@2x.png
sips -z 128 128   assets/icon.png --out assets/icon.iconset/icon_128x128.png
sips -z 256 256   assets/icon.png --out assets/icon.iconset/icon_128x128@2x.png
sips -z 256 256   assets/icon.png --out assets/icon.iconset/icon_256x256.png
sips -z 512 512   assets/icon.png --out assets/icon.iconset/icon_256x256@2x.png
sips -z 512 512   assets/icon.png --out assets/icon.iconset/icon_512x512.png
sips -z 1024 1024 assets/icon.png --out assets/icon.iconset/icon_512x512@2x.png

# Créer le fichier ICNS
echo "🔧 Création du fichier ICNS..."
iconutil -c icns assets/icon.iconset -o assets/icon.icns

if [ $? -eq 0 ]; then
    echo "✅ Icône ICNS créée avec succès: assets/icon.icns"
    
    # Nettoyer les fichiers temporaires
    rm -rf assets/icon.iconset
    
    echo ""
    echo "📦 Fichiers générés:"
    ls -lh assets/icon.*
    echo ""
    echo "🚀 L'icône est prête pour le build Electron!"
    echo "   → Lancer: npm run dist"
else
    echo "❌ Erreur lors de la création du fichier ICNS"
    exit 1
fi
