# 🧘‍♀️ Yoga App – Full Stack Testing Project

Ce projet a été généré avec [Angular CLI](https://github.com/angular/angular-cli) version 14.1.0.

---

## 🚀 Démarrage rapide

### Cloner, installer et démarrer

```bash
# 1. Cloner le dépôt
git clone https://github.com/OpenClassrooms-Student-Center/P5-Full-Stack-testing
cd yoga

# 2. Installer les dépendances
npm install

# 3. Lancer le front-end (Angular)
npm run start
```

---

## 🧪 Tests

### ✅ Lancer **uniquement les tests unitaires** :

```bash
npm run test:unit
```

### 🔁 Lancer **uniquement les tests d’intégration** :

```bash
npm run test:integration
```

### 🧩 Rapport de couverture combinée :

```bash
npm run test:coverage
```

Pour nettoyer les anciens rapports :
```bash
npm run clean:coverage
```

### 📂 Emplacements des rapports Jest

| Type de test          | Rapport d’exécution               | Rapport de couverture                      |
|-----------------------|------------------------------------|--------------------------------------------|
| Tests unitaires       | `coverage/unit/test-report.html`  | `coverage/unit/lcov-report/index.html`     |
| Tests d’intégration   | `coverage/integration/test-report.html` | `coverage/integration/lcov-report/index.html` |

---

### ⚙️ Options utiles avec Jest

| Commande | Description |
|----------|-------------|
| `npx jest` | Lance tous les tests (unitaires + intégration) |
| `npx jest path/to/your/test.spec.ts` | Lance un test spécifique |
| `npx jest --verbose` | Affiche un rapport détaillé |
| `npx jest --watch` | Surveille les fichiers et relance les tests à chaque modification |
| `npx jest --coverage` | Génère un rapport de couverture |

---

### 🧭 Tests de bout en bout (Cypress)

#### Lancer les tests E2E

```bash
npm run cypress:run
```

#### Procédure complète pour la couverture avec Cypress

1. 🧹 Nettoyer les anciens fichiers de couverture :
```bash
npm run clean:coverage
```

2. 🚀 Lancer le serveur Angular instrumenté :
```bash
ng run yoga:serve-coverage
```

3. 🧪 Dans un autre terminal, lancer Cypress :
```bash
npm run cypress:run
```

4. 📂 Vérifier que le dossier `.nyc_output/` contient des fichiers.

5. 🧾 Générer le rapport final de couverture :
```bash
npm run e2e:coverage
```

> Le rapport final est disponible ici : `front/coverage/lcov-report/index.html`

---

## 🛠️ Ressources Backend

### 🔌 Environnement Mockoon

Un environnement Mockoon est disponible pour simuler l'API.

### 📬 Collection Postman

Importe la collection Postman depuis :

> `ressources/postman/yoga.postman_collection.json`

Documentation officielle :  
👉 [Importer des données dans Postman](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman)

---

### 🐬 Base de données MySQL

Le script SQL pour créer le schéma est disponible ici :

> `ressources/sql/script.sql`

#### Compte administrateur par défaut

- **Email**: `yoga@studio.com`
- **Mot de passe**: `test!1234`

---

## 🎓 À propos

Ce projet fait partie du parcours OpenClassrooms "Testez une application Full Stack" (P5).  
Il couvre :

- ✅ Les tests unitaires avec Jest  
- 🧪 Les tests de bout en bout avec Cypress  
- 🔐 Les tests d’intégration d’API  
- 📈 L’analyse de la couverture de code

---

Bon courage et bons tests ! 💪🧘‍♂️
