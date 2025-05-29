import {
  regularUser,
  getFutureDateISO,
  formatDateForDisplay,
} from '../support/testData';
import {
  interceptRegister,
  interceptLogin,
  interceptSessionList,
  interceptUserGet,
} from '../support/intercepts';
// <-- Les commandes custom (loginByUi) sont ajoutées dans support/commands
import '../support/commands';

/**
 * Suite E2E : cycle complet utilisateur
 * - Inscription
 * - Connexion
 * - Accès au profil (/me) sans rechargement
 * - Bouton retour
 * - Suppression de compte
 */
describe('User End-to-End flow', () => {
  /* ------------------------------------------------------------------ */
  /* TEST 1 : register → login → /me                                    */
  /* ------------------------------------------------------------------ */
  it('inscription puis accès à "/me" sans reload', () => {
    /* REGISTER */
    interceptRegister(regularUser);

    cy.visit('/register');
    cy.get('[data-testid="input-first-name"]').type(regularUser.firstName);
    cy.get('[data-testid="input-last-name"]').type(regularUser.lastName);
    cy.get('[data-testid="input-email"]').type(regularUser.email);
    cy.get('[data-testid="input-password"]').type(regularUser.password);
    cy.get('[data-testid="submit-button"]').click();

    cy.wait('@registerRequest');
    cy.url().should('include', '/login');

    /* LOGIN (via commande custom) */
    cy.loginByUi(regularUser); // gère interceptSessionList + interceptLogin

    /* /ME (navigation SPA) */
    interceptUserGet(regularUser); // single stub
    cy.get('[data-testid="nav-profile"]').click();

    cy.wait('@getUser');
    cy.url().should('include', '/me');

    // Vérifications UI
    cy.contains('User information');
    cy.contains(regularUser.firstName);
    cy.contains(regularUser.lastName.toUpperCase());
    cy.contains(regularUser.email);
  });

  /* ------------------------------------------------------------------ */
  /* TEST 2 : bouton retour                                             */
  /* ------------------------------------------------------------------ */
  it('revient en arrière grâce au bouton retour', () => {
    cy.loginByUi(regularUser);
    interceptUserGet(regularUser);

    cy.get('[data-testid="nav-profile"]').click();
    cy.wait('@getUser');

    cy.get('[data-testid="back-button"]').click();
    cy.url().should('not.include', '/me');
  });

  /* ------------------------------------------------------------------ */
  /* TEST 3 : suppression du compte                                     */
  /* ------------------------------------------------------------------ */
  it('supprime le compte et redirige vers /', () => {
    cy.loginByUi(regularUser);
    interceptUserGet(regularUser);

    cy.intercept('DELETE', '**/api/user/**', { statusCode: 200 }).as('deleteUser');

    cy.get('[data-testid="nav-profile"]').click();
    cy.wait('@getUser');

    cy.get('[data-testid="delete-button"]').click();

    cy.wait('@deleteUser');
    cy.contains('Your account has been deleted');
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
  });
});