#!/bin/bash

echo "🔧 Test de correction des fenêtres doubles"
echo "=========================================="

# Fermer toutes les instances de NavWeb
echo "🔄 Fermeture de toutes les instances NavWeb..."
pkill -f "NavWeb" 2>/dev/null || true
pkill -f "Electron" 2>/dev/null || true
sleep 3

echo "✅ Toutes les instances fermées"
echo ""

# Test 1: Lancement avec URL depuis app fermée
echo "🧪 Test 1: Lancement avec navweb:// depuis app fermée"
echo "   Résultat attendu: UNE SEULE fenêtre avec Instagram"
echo ""

# Démarrer en mode dev en arrière-plan
echo "🚀 Démarrage de NavWeb en mode dev..."
npm run start &
APP_PID=$!

# Attendre que l'app soit prête
echo "⏳ Attente du démarrage de l'app..."
sleep 5

# Tester le protocole
echo "📱 Test du protocole: open \"navweb://instagram.com\""
open "navweb://instagram.com"

echo ""
echo "⏳ Vérifiez le résultat:"
echo "  ✅ CORRECT: Une seule fenêtre avec Instagram"
echo "  ❌ INCORRECT: Deux fenêtres (accueil + Instagram)"
echo ""

read -p "🔍 Appuyez sur Entrée pour tester depuis app déjà ouverte..."

# Test 2: Deuxième URL avec app déjà ouverte
echo ""
echo "🧪 Test 2: Deuxième URL avec app ouverte"
echo "   Résultat attendu: Nouvelle fenêtre avec YouTube"
echo ""

open "navweb://youtube.com"

echo ""
echo "⏳ Vérifiez le résultat:"
echo "  ✅ CORRECT: Nouvelle fenêtre YouTube (sans fenêtre d'accueil)"
echo "  ❌ INCORRECT: Fenêtre d'accueil en plus"
echo ""

read -p "🔍 Appuyez sur Entrée pour nettoyer..."

# Nettoyer
echo ""
echo "🧹 Nettoyage..."
kill $APP_PID 2>/dev/null || true
pkill -f "NavWeb" 2>/dev/null || true
pkill -f "Electron" 2>/dev/null || true

echo "✅ Test terminé"
