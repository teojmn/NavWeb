# Configuration Alfred pour NavWeb

## Workflow pour Alfred

Si vous utilisez Alfred au lieu de Raycast, voici comment configurer NavWeb :

### Création d'un workflow simple

1. Ouvrir Alfred Preferences
2. Aller dans l'onglet "Workflows"
3. Cliquer sur "+" et sélectionner "Blank Workflow"
4. Nommer le workflow "NavWeb"

### Ajouter un déclencheur

1. Cliquer sur "+" dans le workflow
2. Sélectionner "Inputs" > "Keyword"
3. Configurer :
   - **Keyword** : `nav` (ou autre mot de votre choix)
   - **Argument** : Required
   - **Title** : Open in NavWeb

### Ajouter l'action

1. Cliquer sur "+" 
2. Sélectionner "Actions" > "Open URL"
3. Connecter le keyword à cette action
4. Dans le champ URL, mettre : `navweb://{query}`

### Utilisation

Une fois configuré :
- Ouvrir Alfred (`cmd + space`)
- Taper `nav instagram.com`
- Appuyer sur Entrée

## Exemples d'URLs

- `nav instagram.com` → Ouvre Instagram
- `nav youtube.com` → Ouvre YouTube  
- `nav github.com` → Ouvre GitHub
- `nav google.com` → Ouvre Google

## Workflow avancé

Pour un workflow plus avancé, vous pouvez :
1. Ajouter des suggestions automatiques
2. Créer des raccourcis pour des sites fréquents
3. Intégrer une validation d'URL
