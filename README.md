# Dépôt du projet de l'équipe Vieux Poulet

## Liste des membres

 - MANGIN / Adrien / DACS
 - CHAILAN / Cyprian / RA-IL 1
 - HAUTION / Ilan / RA-IL 2
 - LOUNICI / Ilyès / RA-IL 1 
 - THIRIET / Esteban / RA-IL 2
 - DEFOLIE / Julien / RA-DWM 2
 - NOEL / Julien / RA-DWM 1

## URL

- Dépôts git : https://github.com/Pegland64/CCD_polet/tree/main
- Application finale : [Lien vers l'application déployée]

## Partie application Web

### Liste des numéros de fonctionnalités implantées

**Côté Client (Abonnés) :**
- **F6 - Inscription d'un abonné :** Saisie des informations de l'abonné, de la tranche d'âge de l'enfant et de l'ordre de ses préférences pour les catégories de jouets. *(Géré via le composant `SubscriberForm.tsx`)*
- **F13 - Consultation de sa box :** Un abonné peut consulter la composition de la box qui lui a été attribuée grâce à son email. *(Géré via l'API `boxes/subscriber/[email]`)*

**Côté Back-office (Gestionnaires / Admin) :**
- **F1 - Ajout d'un article :** Formulaire de saisie complet (désignation, catégorie, âge, état, prix, poids) pour ajouter des jouets uniques issus de dons. *(Géré via `ArticleForm.tsx`)*
- **F2 - Affichage du catalogue :** Visualisation de la liste des articles disponibles en base. *(Page `/admin/catalogue` et `ArticleCard.tsx`)*
- **F7 - Affichage de la liste des abonnés :** Interface présentant tous les abonnés inscrits avec les caractéristiques de leur enfant et leurs préférences. *(Page `/admin/abonnes`)*
- **F9 - Paramétrage d'une campagne :** Création d'une nouvelle campagne en définissant le poids maximum (wmax). *(Page `/admin/campagnes`)*
- **F10 - Lancement de la composition :** Envoi des données vers le conteneur d'optimisation et génération des compositions de box. *(Route API `/campaigns/[id]/compose`)*
- **F11 - Affichage des box composées :** Visualisation des résultats de l'algorithme (liste des articles par box, score, poids total). *(Composant `CompositionView.tsx`)*
- **F17 - Tableau de bord (Fonctionnalité avancée) :** Page d'accueil admin présentant des statistiques globales sur la base de données (total articles, total abonnés, statistiques des campagnes, etc.). *(Page `/admin/page.tsx` et route API `/stats`)*

**Fonctionnalités additionnelles hors cahier des charges strict :**
- **Export CSV des box :** Implémentation d'une route spécifique (`/campaigns/[id]/export/route.ts`) permettant au gestionnaire de récupérer le résultat brut de l'optimisation.

### Commentaires additionnels (Journal de bord technique)

Pour le développement de l'application Web, nous sommes partis sur une architecture moderne avec **Next.js (version 15.1)** utilisant l'App Router.
- **Frontend :** Interface développée avec React 19 et stylisée à l'aide de **Tailwind CSS** (v4) pour un design responsive et rapide à mettre en place.
- **Backend & BDD :** Nous utilisons **Prisma ORM** couplé à une base de données **PostgreSQL**.
- **Outils :** Nous avons mis en place des scripts de seeding (`prisma db seed`) pour peupler facilement la base lors de nos tests de développement.

**Données utiles au test :**
- URL d'accès local : `http://localhost:3000`
- *[Indiquez ici les comptes administrateurs ou mots de passe de test]*

## Partie Optimisation

Pour cette partie, nous avons modélisé le problème de composition des "Toy Boxes" en nous concentrant sur la satisfaction client et les contraintes physiques. Nous avons suivi l'approche suivante :

- **Le système de Scoring (`scoring.ts`) :**
  Nous avons traduit les règles métier en un système de points précis.

- **Les Algorithmes d'attribution :**
  Nous avons testé plusieurs approches algorithmiques distinctes :
  1. **Approche Gloutonne (`glouton.ts`) :** L'algorithme itère sur les articles restants et calcule le meilleur "mouvement" possible (le gain de score le plus élevé) en l'attribuant à l'abonné adéquat tout en respectant le poids maximum (`wmax`).
  2. **Approche Bin Packing (`binPacking.ts`) :** Une variante où nous trions d'abord les articles par ordre décroissant de poids. Nous évaluons ensuite le gain marginal réel généré sur le score global de tous les abonnés avant de placer l'article.
  3. **Approche Métaheuristique - Recuit Simulé (`recuit.ts`) :** Nous avons implémenté un algorithme de recuit simulé permettant d'explorer plus largement l'espace des solutions. En acceptant de temps en temps des compositions légèrement moins bonnes (selon une loi de probabilité et une température décroissante), l'algorithme évite de rester bloqué dans un optimum local.
  4. **Approche Évolutionniste (`evolutionniste.ts`) :** Nous avons également modélisé le problème via un algorithme génétique. Cette approche fait évoluer une "population" de compositions (mutations, croisements) sur plusieurs générations pour faire converger le score global vers un optimum de satisfaction.
  
- **Architecture et Conception (Patron Stratégie) :**
Pour structurer proprement le code du moteur d'optimisation, nous avons mis en place un **patron de conception Stratégie (Strategy Pattern)**. Cette architecture orientée objet nous permet d'encapsuler chaque algorithme (Glouton, Bin Packing, Recuit Simulé, Évolutionniste) de manière isolée et de les interchanger dynamiquement sans avoir à modifier le code principal (le contexte appelant). Cela rend notre solution extrêmement modulaire, maintenable, et facilite grandement les tests comparatifs (benchmarks) entre les différentes heuristiques.

- **Tests, Validation et Jeux de données :**
  - **Tests unitaires :** Pour garantir la fiabilité absolue de notre moteur de règles, nous avons développé des tests automatisés (`scoring.test.ts`, `validator.test.ts`) validant le calcul des points (malus, bonus) et le respect des contraintes physiques (poids max des box).
  - **Génération de problèmes :** Afin d'éprouver la robustesse de nos algorithmes face à une montée en charge, nous avons développé un script Python (`generate_pb.py`) capable de générer des datasets de problèmes complexes sur-mesure.

## Déploiement

Pour cette partie, nous avons suivi l'approche de la conteneurisation totale pour garantir une mise en production fiable et isolée.

- **Architecture Docker (`docker-compose.yaml`) :**
  Nous avons mis en place 3 services distincts connectés sur un réseau interne (`crazy-charly.net`) :
  1. **`db`** : Un conteneur PostgreSQL 15 (version Alpine pour optimiser le poids de l'image). Un *healthcheck* (`pg_isready`) est configuré pour garantir que la base est prête avant de lancer l'application.
  2. **`crazy-charly-web`** : Notre application Web Next.js exposée sur le port 3000. Elle dépend de la bonne santé du conteneur de base de données.
  3. **`app`** : Un conteneur d'optimisation en TypeScript. Il utilise des volumes montés (`/input_csv` et `/output_csv`) pour ingérer les données et exporter les résultats des compositions.

- **Sécurité et Optimisation :**
  - Nous avons géré les variables sensibles (identifiants de BDD) via les **Docker secrets** (`/run/secrets/db_user`, etc.) plutôt que via des variables d'environnement en clair.
  - Utilisation de volumes Docker pour persister efficacement les données du cache de compilation (`crazy-charly-next`) et les `node_modules`.
