#!/bin/bash
# Script de test pour vérifier la suppression de la barre de titre

echo "🎨 Test page d'accueil sans barre de titre - NavWeb"
echo "=================================================="
echo ""

echo "📋 Points à vérifier sur la page d'accueil :"
echo "  ✅ PAS de barre de titre visible"
echo "  ✅ Traffic lights en haut à gauche uniquement"
echo "  ✅ Dégradé couvrant toute la fenêtre"
echo "  ✅ Logo NavWeb centré verticalement"
echo "  ✅ Barre de recherche fonctionnelle"
echo ""

echo "🌐 Comparaison avec page web :"
echo "  → Ouverture d'une page web pour comparer..."
sleep 2
open "navweb://https://github.com"

echo ""
echo "🔍 Vous devriez voir :"
echo "  📱 Page d'accueil : SEULEMENT dégradé + traffic lights"
echo "  🌐 Page web : Barre de titre native macOS"
echo ""

echo "✨ Si vous voyez encore une barre sur l'accueil, il faut :"
echo "  1. Fermer toutes les fenêtres NavWeb"
echo "  2. Relancer l'application"
echo "  3. Vérifier que c'est bien la fenêtre d'ACCUEIL (pas de navigation)"
