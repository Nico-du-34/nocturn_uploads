# Nocturn rp – Galerie d'images

Site statique en **HTML/CSS/JS** pour afficher automatiquement les images placées dans le dossier `images/` du dépôt. Chaque visuel s'ouvre dans un nouvel onglet au clic.

## Utilisation

1. Renseignez votre compte GitHub dans `script.js` si la détection automatique ne suffit pas :
   ```js
   const config = {
     owner: "VOTRE_UTILISATEUR_GITHUB",
     repo: "nocturn_uploads", // ou le nom réel du dépôt
     branch: "main",
     folderPath: "images",
   };
   ```
2. Ajoutez vos fichiers `.jpg`, `.png`, `.gif` ou `.webp` directement dans le dossier `images/`.
3. Déployez sur GitHub Pages. Le site appellera l'API GitHub publique pour lister les fichiers du dossier et les afficher.

## Structure

- `index.html` : page principale.
- `style.css` : mise en forme de la galerie.
- `script.js` : chargement dynamique via l'API GitHub.
- `images/` : dossier où déposer les visuels (un `.gitkeep` est présent pour suivre le dossier).
