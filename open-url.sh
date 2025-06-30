#!/bin/bash

# Script pour tester l'ouverture d'URLs dans NavWeb
# Usage: ./open-url.sh [URL]
# Exemple: ./open-url.sh instagram.com

URL=${1:-"google.com"}

# Si l'app est en développement
if [ -d "node_modules" ]; then
    echo "Ouverture de $URL dans NavWeb (mode dev)..."
    npm run start -- "navweb://$URL" &
else
    # Si l'app est installée
    echo "Ouverture de $URL dans NavWeb..."
    open "navweb://$URL"
fi
