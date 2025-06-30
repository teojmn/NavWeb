#!/bin/bash

echo "🚀 Test du protocole NavWeb"
echo "=========================="

# Vérifier si NavWeb est installé
if [ -d "/Applications/NavWeb.app" ]; then
    echo "✅ NavWeb trouvé dans Applications"
    APP_PATH="/Applications/NavWeb.app"
elif [ -d "/Users/teo.jmn/GITHUB/NavWeb/release/mac-arm64/NavWeb.app" ]; then
    echo "✅ NavWeb trouvé dans release (ARM64)"
    APP_PATH="/Users/teo.jmn/GITHUB/NavWeb/release/mac-arm64/NavWeb.app"
elif [ -d "/Users/teo.jmn/GITHUB/NavWeb/release/mac/NavWeb.app" ]; then
    echo "✅ NavWeb trouvé dans release (Intel)"
    APP_PATH="/Users/teo.jmn/GITHUB/NavWeb/release/mac/NavWeb.app"
else
    echo "❌ NavWeb non trouvé. Installez-le d'abord."
    exit 1
fi

echo "📍 Chemin: $APP_PATH"
echo ""

# Test 1: Ouvrir Instagram
echo "🧪 Test 1: Ouverture d'Instagram..."
open "navweb://instagram.com"
sleep 2

# Test 2: Ouvrir YouTube  
echo "🧪 Test 2: Ouverture de YouTube..."
open "navweb://youtube.com"
sleep 2

# Test 3: Ouvrir Google
echo "🧪 Test 3: Ouverture de Google..."
open "navweb://google.com"

echo ""
echo "✨ Tests terminés ! NavWeb devrait s'être ouvert avec les sites demandés."
echo ""
echo "💡 Pour configurer Raycast :"
echo "   1. Créer un quicklink avec l'URL: navweb://instagram.com"
echo "   2. Assigner un raccourci clavier"
echo "   3. Profiter ! 🎉"
