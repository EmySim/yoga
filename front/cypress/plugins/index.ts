import codeCoverageTask from '@cypress/code-coverage/task';

const pluginConfig = (
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
) => {
  // Ajoute la tâche de couverture de code
  codeCoverageTask(on, config);

  // Retourne la configuration Cypress
  return config;
};

export default pluginConfig;