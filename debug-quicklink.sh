#!/bin/bash

echo "🔧 Test de débogage NavWeb"
echo "=========================="

# Recompiler le code avec les logs de débogage
echo "📦 Compilation..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erreur de compilation"
    exit 1
fi

echo "✅ Compilation réussie"
echo ""

# Test 1: Protocole navweb:// correct
echo "🧪 Test 1: Protocole navweb:// (CORRECT)"
echo "open \"navweb://instagram.com\""
open "navweb://instagram.com"

echo ""
echo "⏳ Attendez 3 secondes, puis regardez les logs dans la console de l'app..."
sleep 3

# Test 2: URL HTTPS directe (ce que vous utilisez actuellement)
echo ""
echo "🧪 Test 2: URL HTTPS directe (votre configuration actuelle - INCORRECT pour NavWeb)"
echo "open \"https://www.instagram.com\""
open "https://www.instagram.com"

echo ""
echo "📋 Résultats attendus:"
echo "  - Test 1: Devrait ouvrir Instagram dans NavWeb"
echo "  - Test 2: Devrait ouvrir Instagram dans votre navigateur par défaut (Safari/Chrome)"
echo ""
echo "💡 Pour corriger votre quicklink Raycast:"
echo "   Remplacez: https://www.instagram.com"
echo "   Par:       navweb://instagram.com"
echo ""
echo "🔍 Pour voir les logs de débogage:"
echo "   1. Ouvrez NavWeb"
echo "   2. Menu > View > Toggle Developer Tools"
echo "   3. Onglet Console"
