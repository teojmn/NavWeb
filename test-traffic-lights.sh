#!/bin/bash
# Script de test rapide pour valider le positionnement des traffic lights

echo "🎯 Test de positionnement des Traffic Lights - NavWeb"
echo "================================================="
echo ""

# Vérifier que l'application est compilée
if [ ! -d "dist" ]; then
    echo "❌ Application non compilée. Exécution de npm run build..."
    npm run build
fi

echo "✅ Lancement de NavWeb pour test visuel..."
echo ""
echo "🔍 Points à vérifier :"
echo "  1. Traffic lights centrés verticalement dans la barre de titre"
echo "  2. Hauteur de barre de titre = 40px"
echo "  3. Position des traffic lights = x: 20, y: 15"
echo "  4. Contenu web non masqué par la barre de titre"
echo ""
echo "💡 Pour tester avec un lien externe :"
echo "   open 'navweb://https://github.com'"
echo ""

# Lancer l'application
npm start
