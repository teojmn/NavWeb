#!/bin/bash
# Script de test pour la barre de titre hybride

echo "🎨 Test de la barre de titre hybride - NavWeb"
echo "============================================"
echo ""

echo "📱 Test 1: Page d'accueil (barre personnalisée)"
echo "  → Ouverture de l'application..."
echo "  → Attendu: Barre de titre personnalisée avec traffic lights à (20, 15)"
echo ""

# Attendre un peu pour que l'app se lance
sleep 2

echo "🌐 Test 2: Page web (barre native macOS)"
echo "  → Ouverture de GitHub..."
echo "  → Attendu: Barre de titre native macOS avec titre 'GitHub'"
echo ""

open "navweb://https://github.com"

sleep 2

echo "🔍 Points à vérifier :"
echo ""
echo "✅ Page d'accueil :"
echo "   • Barre de titre personnalisée (40px)"
echo "   • Traffic lights à position (20, 15)"
echo "   • Effet blur et transparence"
echo "   • Titre 'NavWeb - Accueil'"
echo ""
echo "✅ Page web :"
echo "   • Barre de titre native macOS"
echo "   • Titre de la page affiché"
echo "   • Traffic lights position par défaut"
echo "   • Utilisation complète de l'espace"
echo ""

echo "🎯 Test supplémentaire avec Google..."
sleep 2
open "navweb://https://google.com"

echo ""
echo "💡 Avantages de cette approche :"
echo "   • Design moderne pour l'accueil"
echo "   • Intégration native pour les pages web"
echo "   • Meilleure expérience utilisateur globale"
echo ""
echo "✨ Test terminé ! Comparez les deux styles de barre de titre."
