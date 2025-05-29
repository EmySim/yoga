import {
  regularUser,
} from '../support/testData';
import {
  interceptRegister,
  interceptLogin,
  interceptSessionList,
  interceptUserGet,
} from '../support/intercepts';
import '../support/commands';

describe('User End‑to‑End – compte utilisateur', () => {
  beforeEach(() => {
    // Intercepts communs pour tous les tests connectés
    interceptSessionList([]);
    interceptLogin(regularUser);
    cy.loginByUi(regularUser);
  });
  
  /* ================================== */
  /*  IT 1 : Inscription                */
  /* ================================== */
  it('enregistre un nouvel utilisateur', () => {
    interceptRegister(regularUser);
    cy.visit('/register');
    cy.get('[data-testid="input-first-name"]').type(regularUser.firstName);
    cy.get('[data-testid="input-last-name"]').type(regularUser.lastName);
    cy.get('[data-testid="input-email"]').type(regularUser.email);
    cy.get('[data-testid="input-password"]').type(regularUser.password);
    cy.get('[data-testid="submit-button"]').click();

    cy.wait('@registerRequest');
    cy.url().should('include', '/login');
  });

  /* ================================== */
  /*  IT 2 : Connexion                  */
  /* ================================== */
  it('se connecte via le formulaire', () => {
    cy.loginByUi(regularUser); // ← commande custom + intercepts internes
  });

  /* ================================== */
  /*  IT 3 : Consultation du profil     */
  /* ================================== */
  it('affiche la page /me et les infos utilisateur', () => {
  
    interceptUserGet(regularUser);

    cy.get('[data-testid="nav-account"]').click();
    cy.wait('@getUser');
    cy.url().should('include', '/me');

    cy.contains('User information');
    cy.contains(regularUser.firstName);
    cy.contains(regularUser.lastName.toUpperCase());
    cy.contains(regularUser.email);
  });

  /* ================================== */
  /*  IT 4 : Bouton retour              */
  /* ================================== */
  it('revient à la liste via la flèche retour', () => {
    
    interceptUserGet(regularUser);

    cy.get('[data-testid="nav-account"]').click();
    cy.wait('@getUser');
    cy.get('[data-testid="back-button"]').click();
    cy.url().should('not.include', '/me');
  });

  /* ================================== */
  /*  IT 5 : Suppression du compte      */
  /* ================================== */
  it('supprime le compte utilisateur', () => {
  
    interceptUserGet(regularUser);
    cy.intercept('DELETE', '**/api/user/**', { statusCode: 200 }).as('deleteUser');

    cy.get('[data-testid="nav-account"]').click();
    cy.wait('@getUser');
    cy.get('[data-testid="delete-button"]').click();

    cy.wait('@deleteUser');
    cy.contains('Your account has been deleted');
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
  });
});
