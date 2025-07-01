#!/bin/bash
# Script de test du protocole navweb:// avec le nouvel exécutable

echo "🧪 Test du nouvel exécutable NavWeb v1.0.1"
echo "=========================================="
echo ""

echo "✅ Fichiers générés :"
ls -lh release/*.dmg
echo ""

echo "🎯 Test d'ouverture avec protocole personnalisé :"
echo "   1. Test avec Google..."
sleep 2
open "navweb://https://google.com"

sleep 3
echo "   2. Test avec GitHub..."
sleep 2
open "navweb://https://github.com"

echo ""
echo "🔍 Points à vérifier visuellement :"
echo "   ✅ Traffic lights centrés verticalement"
echo "   ✅ Barre de titre de 40px"
echo "   ✅ Pas de contenu masqué"
echo "   ✅ Interface moderne et équilibrée"
echo "   ✅ Protocole navweb:// fonctionnel"
echo ""
echo "💡 Les exécutables sont prêts dans le dossier 'release/' !"
