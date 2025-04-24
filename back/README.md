# Yoga App !
## Generating Test Coverage Report for Back-end

To generate a test coverage report for the back-end using Jacoco, follow these steps:

1. Open a terminal and navigate to the `back` directory of your project.
2. Run the following command to clean the project and run tests:
   ```
   mvn clean test
   ```
3. After the tests have completed, Jacoco will generate a code coverage report. You can find the report in the `target/site/jacoco` directory.


For launch and generate the jacoco code coverage:
> mvn clean test


Exécuter les tests unitaires
mvn clean verify -Punit-tests
Le rapport sera généré dans target/site/jacoco/index.html.

Exécuter les tests d'intégration
mvn clean verify -Pintegration-tests
Le rapport sera également généré dans target/site/jacoco/index.html.

