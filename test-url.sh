#!/bin/bash

# Test simple pour vérifier que NavWeb peut recevoir des URLs
echo "Test d'ouverture d'URL dans NavWeb..."

# Compiler d'abord
npm run build

# Puis lancer avec une URL de test
echo "Lancement de NavWeb avec instagram.com..."
electron . "navweb://instagram.com"
