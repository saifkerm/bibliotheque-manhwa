---
name: design-check
description: Vérifie si le projet Claude Design "Bibliothèque de manhwas personnelle" a changé depuis le dernier sync, résume ce qui a changé, et propose de porter les changements dans ce codebase React. Utiliser quand l'utilisateur demande de checker/vérifier/sync le design, ou mentionne des modifications faites dans Claude Design.
---

# Vérifier les changements du design Claude Design

Ce skill évite de redemander l'URL du projet et de relire tout le fichier à l'aveugle à chaque fois : il retient le `project_id` et le dernier `etag` connu du fichier suivi, et ne fait le travail de lecture/diff que si quelque chose a réellement changé.

## État local

Le fichier `.claude/skills/design-check/state.json` (à la racine du dépôt, chemin complet : `.claude/skills/design-check/state.json`) contient :

```json
{
  "projectId": "...",
  "projectName": "...",
  "trackedFile": "...",
  "lastEtag": "...",
  "lastSyncedAt": "..."
}
```

`lastEtag` représente l'état **effectivement porté dans le code**, pas juste "vu". Ne le mets à jour que lorsque les changements ont été appliqués au code (ou explicitement écartés par l'utilisateur) — sinon un `/design-check` ultérieur ne re-signalerait plus un changement resté en attente.

## Déroulé

1. Lire `state.json`. S'il n'existe pas, demander l'URL du projet Claude Design à l'utilisateur, extraire le `project_id`, et créer le fichier avec `lastEtag: null`.
2. Charger les outils MCP si besoin : `ToolSearch(query: "select:mcp__claude-design__list_files,mcp__claude-design__read_file,mcp__claude-design__get_project")`.
3. `list_files(project_id)` et récupérer l'entrée correspondant à `trackedFile` (le `.dc.html`, pas `support.js` ni `.thumbnail` qui changent pour d'autres raisons).
4. Comparer son `etag` à `lastEtag` :
   - **Identique** → dire simplement qu'il n'y a rien de nouveau depuis le dernier sync (mentionner `lastSyncedAt`). Ne rien lire d'autre. Fin.
   - **Différent (ou `lastEtag` était `null`)** → continuer.
5. `read_file` sur le fichier suivi (il dépasse souvent la limite de tokens : lire le fichier sauvegardé sur disque par chunks jusqu'à 100% comme indiqué dans l'erreur de troncature).
6. Résumer pour l'utilisateur ce qui a changé, en comparant à ce qui est déjà implémenté dans `src/` (composants, hooks, utils) — pas juste un diff textuel brut, une description fonctionnelle ("nouvel écran X", "prop Y ajoutée", "logique Z modifiée").
7. Demander si l'utilisateur veut que les changements soient portés maintenant.
8. Implémenter dans les fichiers React concernés si oui — en respectant les conventions déjà en place (styles inline, `var(--acc)` pour les couleurs d'accent, hooks `useLibrary`/`useSettings`, etc.), en gardant les décisions déjà prises précédemment (voir `.claude/skills/design-check/NOTES.md` si présent) plutôt qu'en les écrasant aveuglément.
9. Une fois les changements appliqués (ou explicitement écartés par l'utilisateur, qui a le droit de dire "pas maintenant"), mettre à jour `state.json` avec le nouvel `etag` et `lastSyncedAt` (date du jour).
10. Si une divergence assumée existe entre le design et le code (comme déjà noté une fois pour la logique `plusOne`), la documenter dans `.claude/skills/design-check/NOTES.md` plutôt que de la re-découvrir à chaque fois.

## Ce que ce skill ne fait PAS

- Il ne poll pas en tâche de fond ni ne surveille automatiquement — il faut l'invoquer (`/design-check`) pour déclencher la vérification.
- Il ne fait jamais un rebuild/npm run build automatique sans lien avec la question — seulement si des changements ont réellement été portés dans le code.
