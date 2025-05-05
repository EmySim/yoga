
# 🧘 Yoga App - Backend

**The best backend for a Yoga app!**  
Une application Spring Boot moderne pour gérer les cours, les utilisateurs, et l’authentification dans une application de yoga.

---

## 🚀 Fonctionnalités

- API REST sécurisée avec Spring Security & JWT
- Gestion des utilisateurs, des rôles et des cours
- Base de données relationnelle (MySQL ou H2 pour les tests)
- Validation des données avec Hibernate Validator
- Tests unitaires et d'intégration avec JaCoCo, Surefire & Failsafe
- Génération de rapports de couverture de code
- Utilisation de Lombok & MapStruct pour simplifier le code

---

## ⚙️ Prérequis

- Java 17+
- Maven 3.8+
- MySQL (pour l’environnement de prod/dev)

---

## 🛠️ Installation

```bash
# Clone du projet
git clone https://github.com/EmySim/yoga.git
cd yoga-app

# Compilation et tests
mvn clean install
```

---

## 🗃️ Configuration de la base de données

Modifie le fichier `application.properties` ou `application.yml` pour configurer l'accès à ta base de données MySQL :

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/yoga_db
spring.datasource.username=root
spring.datasource.password=yourpassword
```

---

## 🧪 Exécution des tests

### ✅ Tests unitaires

```bash
mvn test -Punit-tests
```

### 🔁 Tests d’intégration

```bash
mvn verify -Pintegration-tests
```

---

### 🔁 Tests unitaires + d’intégration

```bash
mvn clean verify -P "unit-tests,integration-tests"
```

lancer le rapport  
mvn surefire-report:report


## 📊 Rapports JaCoCo

Les rapports de couverture sont générés dans les dossiers suivants :

- `target/jacoco-merged/`
- `target/jacoco-unit/`
- `target/jacoco-integration/`

---

## 📦 Plugins Maven

Ce projet utilise :

- **JaCoCo** – Couverture de code
- **Surefire** – Tests unitaires
- **Failsafe** – Tests d'intégration
- **Spring Boot DevTools** – Rechargement automatique
- **JWT (jjwt)** – Authentification sécurisée

---

## 💡 Bonnes pratiques

- Les DTO sont exclus des rapports de couverture
- Les tests sont séparés par type (unitaires vs. intégration)
- Profils Maven pour chaque type de test

---

## 🔐 Authentification

L’application utilise **JWT** pour sécuriser les endpoints. Les tokens sont générés à l'authentification et transmis dans les headers :

```
Authorization: Bearer <token>
```

---

## 📚 Technologies utilisées

- Spring Boot 3.1.4
- Java 17
- Spring Security
- Spring Data JPA (Hibernate)
- JWT (jjwt)
- MySQL / H2
- MapStruct
- Lombok
- JUnit / Mockito

---

## 🤝 Contribution

Les contributions sont les bienvenues !  
Forke le repo, crée une branche, propose une PR ✅

---

## 📝 Licence

Ce projet est sous licence **MIT**.
