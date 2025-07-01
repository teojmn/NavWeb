#!/bin/bash

echo "🧪 Test de la barre de titre native - NavWeb"
echo "============================================"

echo ""
echo "📋 Ce que vous devriez voir :"
echo ""
echo "✅ Page d'accueil (home.html) :"
echo "   - Pas de barre de titre"
echo "   - Traffic lights flottants uniquement"
echo "   - Fond dégradé complet"
echo ""
echo "✅ Pages web (Google, Instagram, etc.) :"
echo "   - Barre de titre native macOS"
echo "   - Traffic lights intégrés à la barre"
echo "   - Titre de la page affiché"
echo ""

echo "🚀 Tests en cours..."
echo ""

# Test 1: Page d'accueil
echo "1️⃣ Ouverture page d'accueil..."
open -a NavWeb
sleep 3

# Test 2: Page web avec barre de titre
echo "2️⃣ Ouverture Google (avec barre de titre)..."
open "navweb://google.com"
sleep 2

# Test 3: Autre page web
echo "3️⃣ Ouverture GitHub (avec barre de titre)..."
open "navweb://github.com"
sleep 2

echo ""
echo "✅ Tests lancés !"
echo ""
echo "🔍 Vérifiez visuellement :"
echo "   - Page d'accueil : PAS de barre de titre"
echo "   - Pages web : barre de titre native macOS"
echo ""
echo "❌ Si problème persiste :"
echo "   - Vérifiez que titleBarStyle: 'default' est configuré"
echo "   - Assurez-vous qu'aucun CSS ne masque la barre"
