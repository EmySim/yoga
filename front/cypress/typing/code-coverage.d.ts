declare module '@cypress/code-coverage/task' {
    const register: (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => Cypress.PluginConfigOptions;
    export = register;
  }
  