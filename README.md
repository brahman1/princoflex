# PRINCOFLEX

Maquette de site vitrine B2B réalisée par Brainfor pour SARL PRINCOFLEX.

## Consulter en local

Depuis la racine du dépôt :

```sh
python -m http.server 8000 --bind 127.0.0.1 --directory site
```

Ouvrir http://127.0.0.1:8000/.

## Déployer sur Render

Créer un **Static Site** à partir de ce dépôt, avec les paramètres suivants :

- Branche : `main`
- Root Directory : vide
- Build Command : `echo Static site ready`
- Publish Directory : `site`

Le site fonctionne sans serveur, installation npm ou secret. Les mises à jour concernent les fichiers de `site/`.

## Fonctionnement

- Page responsive, navigation par sections et sélection de produit dans le devis.
- Logos partenaires en deux rubans défilants, bouton pause et respect de la réduction des animations.
- Contacts regroupés au format international et liens téléphone / WhatsApp.
- Le formulaire prépare un email après relecture. Le visiteur l’envoie depuis sa messagerie ; aucun email automatique ni stockage côté serveur n’est installé.
- Manrope et DM Sans sont chargées depuis Google Fonts, avec Arial en secours.

## Contenu et identité

Les photos, logos et noms de partenaires sont ceux fournis pour le projet. Leur réutilisation hors de ce projet doit être autorisée par leurs titulaires.

Le site reste une maquette à valider. L’indexation est désactivée par `noindex, nofollow` ; cela ne protège pas l’accès à son URL publique. Les coordonnées et le contenu définitif restent à confirmer avant une publication de production.

Les fichiers nécessaires au site sont dans `site/`. Les archives de travail, captures et flyers sources ne sont pas nécessaires au déploiement et ne sont pas inclus dans ce dépôt.
