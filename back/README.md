
# 🧘 Yoga App - Backend

**The best backend for a Yoga app!**  
Une application Spring Boot moderne pour gérer les cours, les utilisateurs, et l’authentification dans une application de yoga.

---

## 🚀 Fonctionnalités

- ✅ API REST sécurisée avec Spring Security & JWT
- 🧑‍🎓 Gestion des utilisateurs, des rôles et des cours
- 🗄️ Base de données relationnelle (MySQL en prod / H2 pour les tests)
- 🧼 Validation des données avec Hibernate Validator
- 🧪 Tests unitaires & d'intégration (Surefire + Failsafe)
- 📊 Rapports de couverture avec JaCoCo
- 🪶 Code simplifié grâce à Lombok & MapStruct

---

## ⚙️ Prérequis

| Outil       | Version minimum |
|-------------|------------------|
| Java        | 17+              |
| Maven       | 3.8+             |
| MySQL       | recommandé       |

---

## 🛠️ Installation & Build

```bash
# Clone du projet
git clone https://github.com/EmySim/yoga.git
cd yoga-app

# Compilation et exécution des tests unitaires + intégration
mvn clean install
```

---

## 🗃️ Configuration de la base de données

Edite le fichier `src/main/resources/application.properties` ou `application.yml` :

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/yoga_db
spring.datasource.username=root
spring.datasource.password=yourpassword
```

---

## 🧪 Exécution des tests

### ✅ Tests unitaires
pour l'exécution des tests unitaires et les rapports d'exécution et de couverture.
```bash
mvn verify -Punit-tests
```

### 🔁 Tests d’intégration
pour l'exécution des tests d'intégration et les rapports d'exécution et de couverture.
```bash
mvn verify site -P integration-tests
```

---

## 📊 Rapports de couverture JaCoCo

Les rapports HTML de couverture se trouvent ici :

| Type de test       | Emplacement du rapport                  |
|--------------------|------------------------------------------|
| Tests unitaires     | `target/jacoco-unit/index.html`         |
| Tests d’intégration | `target/jacoco-integration/index.html`  |

## 📊 Rapports d'exécution

Les rapports HTML d'exécution se trouvent ici :

| Type de test       | Emplacement du rapport                      |
|--------------------|----------------------------------------------|
| Tests unitaires     | `target/reports/surefire.html`              |
| Tests d’intégration | `target/site/failsafe-report.html`          |


> Les DTO sont volontairement exclus de ces rapports.

---

## 📦 Plugins Maven utilisés

| Plugin                   | Usage                            |
|--------------------------|----------------------------------|
| **JaCoCo**               | Couverture de code               |
| **Surefire**             | Exécution des tests unitaires    |
| **Failsafe**             | Exécution des tests d’intégration |
| **DevTools**             | Rechargement à chaud en dev      |
| **jjwt (JWT)**           | Authentification sécurisée       |

---

## 🔐 Authentification

L’authentification se fait via JWT.  
Après login, un token est retourné et doit être ajouté dans l’en-tête des requêtes protégées :

```
Authorization: Bearer <votre_token>
```

---

## 📚 Technologies

- 🎯 Spring Boot 3.1.4
- 🔐 Spring Security
- 🧬 Spring Data JPA (Hibernate)
- 🛡️ JWT (jjwt)
- 🗃️ MySQL / H2
- 🛠️ Lombok & MapStruct
- 🧪 JUnit 5 / Mockito

---

## 💡 Bonnes pratiques

- Séparation stricte entre tests unitaires et tests d’intégration
- Couverture exigée ≥ 80 % (30 % min via tests d’intégration)
- Profils Maven dédiés pour chaque type de test (`unit-tests`, `integration-tests`)
- Tests d’intégration dans `src/integration/` avec suffixe `*IT.java`

---

## 🤝 Contribution

Les contributions sont bienvenues !  
Forkez ce repo, créez votre branche (`feature/ma-fonctionnalité`), puis proposez une PR 💪

---

## 📝 Licence

Distribué sous licence **MIT**.  
Utilisable, modifiable, partageable sans modération 🧘‍♀️
