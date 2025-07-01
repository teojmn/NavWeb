#!/bin/bash
# Script de test pour la page d'accueil sans barre de titre

echo "🎨 Test de la page d'accueil sans barre de titre - NavWeb"
echo "======================================================="
echo ""

echo "📱 Test: Page d'accueil (sans barre de titre)"
echo "  → Ouverture de l'application..."
echo "  → Attendu: Dégradé sur toute la fenêtre + traffic lights uniquement"
echo ""

# Attendre un peu pour que l'app se lance
sleep 2

echo "🌐 Test: Page web (barre native macOS inchangée)"
echo "  → Ouverture de GitHub..."
echo "  → Attendu: Barre de titre native macOS normale"
echo ""

open "navweb://https://github.com"

sleep 2

echo "🔍 Points à vérifier :"
echo ""
echo "✅ Page d'accueil :"
echo "   • PAS de barre de titre visible"
echo "   • Traffic lights en haut à gauche uniquement"
echo "   • Dégradé couvre TOUTE la fenêtre"
echo "   • Fenêtre déplaçable depuis n'importe où"
echo "   • Champ de recherche toujours interactif"
echo ""
echo "✅ Page web :"
echo "   • Barre de titre native macOS (inchangée)"
echo "   • Titre de la page affiché"
echo "   • Traffic lights position par défaut"
echo ""

echo "🎯 Test supplémentaire avec Google..."
sleep 2
open "navweb://https://google.com"

echo ""
echo "🎨 Résultat attendu :"
echo "   • Page d'accueil : Immersion totale dans le dégradé"
echo "   • Pages web : Intégration native macOS"
echo "   • Traffic lights : Toujours visibles et fonctionnels"
echo ""
echo "✨ Test terminé ! La page d'accueil devrait être magnifique sans barre !"
