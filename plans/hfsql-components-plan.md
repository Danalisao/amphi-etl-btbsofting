<!-- markdownlint-disable -->
---
plan_id: hfsql-components
total_phases: 3
complexity: STANDARD
parallel_batches:
  batch1: ['1A', '1B']
  batch2: ['2']
  batch3: ['3']
---

# Plan: HFSQL Components

Le plus petit changement cohérent consiste à ajouter des composants HFSQL dédiés côté entrée et sortie, tout en réutilisant le pattern ODBC déjà présent dans Amphi. La décision autonome retenue est de cibler d’abord HFSQL Classic et HFSQL Client/Server via pyodbc, sans inventer de driver natif ni modifier la couche serveur tant qu’un test local ne montre pas une incompatibilité de syntaxe ou de découverte de schéma.

### Parallel Execution Map

1. [P] Créer le composant d’entrée HFSQL sur le pattern des composants base existants, avec génération de chaîne de connexion ODBC HFSQL pour les modes Classic et Client/Server.

2. [P] Créer le composant de sortie HFSQL sur le même pattern, avec écriture via la stratégie déjà employée par les sorties SQL existantes.

3. Raccorder les deux composants au registre, aux sélecteurs de base de données et aux icônes partagées, puis ajuster le comportement si un point commun de configuration l’exige.

4. Valider le lot par un contrôle ciblé sur les fichiers touchés, puis faire relire l’implémentation pour vérifier la cohérence de génération de code et l’absence de régression évidente.

### Phase 1A

Objectif: créer un composant HFSQL Input minimal et cohérent avec les composants SQL existants. Le travail doit partir du composant SQL ou ODBC le plus proche, reprendre la structure de formulaire dynamique existante, et générer une connexion pyodbc adaptée à HFSQL Classic et Client/Server. Le cycle Red → Green → Refactor doit commencer par le contrôle le plus étroit disponible sur le package pipeline-components-core ou sur la compilation TypeScript des fichiers touchés.

Fichiers et surfaces visés: les composants d’entrée base de données du package pipeline-components-core, en particulier le pattern utilisé pour ODBC et les entrées SQL nommées. Le code devra expliciter les champs minimums nécessaires: type de connexion, serveur, port, base, utilisateur, mot de passe, analyse WDD et répertoire de données selon le mode choisi.

Tests et validation: un contrôle ciblé doit invalider rapidement l’hypothèse suivante si elle est fausse: la génération de code HFSQL peut réutiliser pyodbc et pandas.read_sql sans adaptation supplémentaire de la couche manager.

### Phase 1B

Objectif: créer un composant HFSQL Output aligné sur les sorties SQL existantes, avec la même convention de configuration et une génération de connexion cohérente avec celle de l’entrée. Le composant doit rester dans le périmètre ODBC/pyodbc, sans introduire de dialecte SQLAlchemy non vérifié.

Fichiers et surfaces visés: les sorties base de données du package pipeline-components-core, en reprenant le composant le plus proche côté SQL pour la forme du formulaire et la génération d’écriture.

Tests et validation: le contrôle ciblé doit vérifier que la génération TypeScript reste cohérente et que le composant exporte ses dépendances Python de manière compatible avec l’existant.

### Phase 2

Objectif: raccorder HFSQL dans l’UI existante avec le moins de points de contact possible. Cette phase couvre l’enregistrement dans l’index du package, les agrégateurs de type DatabaseInput et DatabaseOutput, et l’icône si le registre des composants l’exige.

Fichiers et surfaces visés: l’index du package pipeline-components-core, les agrégateurs de composants base de données, et la surface d’icônes partagée. Cette phase ne doit pas ouvrir de nouveau périmètre fonctionnel: elle ne fait qu’intégrer les deux nouveaux composants dans le flux de sélection et d’enregistrement déjà utilisé.

Tests et validation: un contrôle de build ou de typecheck ciblé du package doit falsifier rapidement l’hypothèse qu’aucune autre couche du monorepo n’a besoin d’être modifiée pour enregistrer HFSQL.

### Phase 3

Objectif: exécuter une validation ciblée puis une revue de code. La validation doit d’abord être l’exécutable le plus étroit disponible sur le package touché. Ensuite, une revue formelle doit confirmer la cohérence des nouveaux composants avec les patterns existants et signaler toute lacune de test ou de robustesse.

Fichiers et surfaces visés: uniquement les fichiers modifiés par les phases précédentes.

Tests et validation: priorité à un test ou build ciblé; à défaut, à un contrôle de types ou lint du package concerné. La revue doit citer les fichiers concernés et vérifier en particulier la construction des chaînes ODBC HFSQL, les dépendances Python générées et la non-régression des sélecteurs de base de données.

### Open Questions

Décision autonome prise: l’intégration initiale sera basée sur ODBC/pyodbc, car la recherche documentaire ne confirme aucun driver Python natif HFSQL exploitable. Si un contrôle ciblé invalide cette hypothèse, le repli pragmatique sera d’étendre le composant ODBC existant avec un preset HFSQL plutôt que d’inventer une couche d’accès spécifique.
