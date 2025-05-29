/// <reference types="cypress" />

// ---------------------------------------------------------------------------
// Imports utiles (facultatif : ajuste les chemins si besoin)
// ---------------------------------------------------------------------------
import { interceptSessionList, interceptLogin } from '../support/intercepts';
import { User } from '../../src/app/interfaces/user.interface';

/* ---------------------------------------------------------------------------
   Extension des types Cypress – ajoute nos commandes custom dans Chainable
--------------------------------------------------------------------------- */
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Se logue via l’API REST et stocke le JWT dans le storage / cookie pour les tests.
       * @example cy.loginByApi('john@doe.dev', 's3cret')
       */
      loginByApi(email: string, password: string): Chainable<void>;

      /**
       * Parcourt le formulaire /login en UI. Nécessite un objet user (voir testData).
       * @example cy.loginByUi(user)
       */
      loginByUi(user: User): Chainable<void>;
    }
  }
}

// Obligatoire : transforme ce fichier en module TS et évite les collisions d’espace global
export {};

/* ---------------------------------------------------------------------------
   Implémentation de la commande loginByApi
--------------------------------------------------------------------------- */
Cypress.Commands.add('loginByApi', (email: string, password: string) => {
  cy.request('POST', '/api/auth/login', { email, password }).then(({ body }) => {
    // La réponse backend contient { token, type, ... }
    const { token } = body as { token: string };

    // 1) Stockage dans localStorage (si ton AuthService le lit ici)
    window.localStorage.setItem('token', token);

    // 2) Stockage aussi dans un cookie (utile si tu passes en HTTP‑Only)
    cy.setCookie('token', token, { path: '/' });
  });
});

/* ---------------------------------------------------------------------------
   Implémentation de la commande loginByUi
--------------------------------------------------------------------------- */
Cypress.Commands.add('loginByUi', (user: User) => {

  interceptSessionList([]);
  interceptLogin(user);

  cy.visit('/login');
  cy.get('input[formControlName="email"]').type(user.email);
  cy.get('input[formControlName="password"]').type(user.password);
  cy.get('button[type="submit"]').click();

  cy.wait('@loginRequest');
  cy.wait('@getSessions');
  cy.url().should('include', '/sessions');
});
