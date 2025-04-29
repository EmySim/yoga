# 🧘 Yoga App - Backend

Ce projet est le backend d'une application de gestion de séances de yoga, développé avec **Spring Boot**, **JWT**, **JPA/Hibernate**, et testé avec **JUnit 5**, **Mockito**, **Testcontainers** et **JaCoCo**.

---

## 🚀 Fonctionnalités principales

- Authentification sécurisée avec JWT
- Gestion des comptes utilisateurs (admin et user)
- CRUD sur les séances de yoga
- Système de rôles pour l’accès aux fonctionnalités
- Couverture de test unitaires et d’intégration séparées

---

## 🛠️ Technologies

- Java 17
- Spring Boot 3.1
- Spring Security
- JPA (Hibernate)
- MySQL / H2 (runtime/test)
- JWT (jjwt)
- MapStruct
- Lombok
- Maven
- Testcontainers
- JUnit 5
- Mockito
- JaCoCo

---

## 🔧 Configuration

### Base de données

Configurer votre base MySQL dans `application.properties` :

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/yoga_db
spring.datasource.username=root
spring.datasource.password=secret
```

---

## 📦 Construction

### Compiler le projet

```bash
mvn clean install
```

---

## ✅ Tests

### Lancer tous les tests (unitaires + intégration)

```bash
mvn clean verify
```
```bash
mvn jacoco:merge jacoco:report
```
### Lancer uniquement les tests **unitaires**

```bash
mvn clean verify -Punit-tests
```

➡️ Rapport JaCoCo : `target/jacoco-unit/index.html`

### Lancer uniquement les tests **d'intégration**

```bash
mvn clean verify -Pintegration-tests
```

➡️ Rapport JaCoCo : `target/jacoco-integration/index.html`

### Convention de nommage

| Type de test         | Nom de classe attendu        | Plugin Maven utilisé     |
|----------------------|------------------------------|--------------------------|
| Test unitaire        | `*Test.java`                 | `maven-surefire-plugin`  |
| Test d'intégration   | `*IT.java`                   | `maven-failsafe-plugin`  |

---

## 📊 Couverture de test

Le projet utilise **JaCoCo** pour mesurer la couverture de code.

- Les rapports sont générés automatiquement avec les profils Maven.
- Les exclusions sont configurées dans le `pom.xml` (ex : `dto/**` ou classes de démarrage).

---

## 📂 Structure du projet

```
src/
├── main/
│   ├── java/com/openclassrooms/starterjwt/
│   └── resources/
├── test/
│   ├── java/com/openclassrooms/starterjwt/
│       ├── SomeServiceTest.java     # Unitaire
│       ├── SomeControllerIT.java    # Intégration
```

---

## 🤝 Contributions

Les contributions sont les bienvenues !  
N’hésitez pas à forker le repo, proposer une PR ou ouvrir une issue.

---

## 📝 Licence

Ce projet est proposé dans le cadre de l’OpenClassrooms P5 - "Testez une application full-stack".

---
