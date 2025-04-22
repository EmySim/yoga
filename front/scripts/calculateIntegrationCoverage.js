const fs = require('fs');
const path = require('path');

// Chemin vers le fichier de couverture généré par Jest
const coverageFilePath = path.join(__dirname, '..', 'coverage', 'jest', 'coverage-final.json');

// Fonction pour lire et analyser le fichier de couverture JSON
const readCoverage = (filePath) => {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Le fichier ${filePath} n'existe pas !`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) {
    console.error(`❌ Erreur de parsing du fichier JSON : ${e.message}`);
    return null;
  }
};

// Filtrage des fichiers d'intégration dans la couverture
const filterIntegrationCoverage = (coverage) => {
  return Object.keys(coverage).filter(file => file.includes('src/integration-tests/'));
};

// Fonction pour additionner toutes les valeurs d'un objet
const sum = (obj) => Object.values(obj).reduce((acc, v) => acc + v, 0);

// Calcul du ratio de couverture des tests d'intégration
const calculateIntegrationCoverage = (globalCoverage) => {
  const integrationFiles = filterIntegrationCoverage(globalCoverage);

  const globalStatements = sum(
    Object.values(globalCoverage).flatMap(f => Object.values(f.s || {}))
  );

  const integrationStatements = sum(
    integrationFiles.flatMap(file => Object.values(globalCoverage[file]?.s || {}))
  );

  if (globalStatements === 0) {
    console.warn("⚠️ Aucun statement trouvé dans la couverture globale. Impossible de calculer le ratio.");
    return '0.00';
  }

  const ratio = (integrationStatements / globalStatements) * 100;
  return ratio.toFixed(2);
};

// Lecture du fichier de couverture
const globalCoverage = readCoverage(coverageFilePath);

// Calcul et affichage
if (globalCoverage) {
  const integrationCoverageRatio = calculateIntegrationCoverage(globalCoverage);
  console.log(`📊 La couverture des tests d'intégration représente ${integrationCoverageRatio}% de la couverture totale.`);
} else {
  console.error("❌ Erreur lors de la lecture du fichier de couverture.");
}
