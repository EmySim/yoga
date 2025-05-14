/// <reference types="cypress" />

import {
  adminUser,
  teacherVictoria,
  teacherAlice,
  createSession,
  updatedSession,
  getFutureDateISO,
  formatDateForDisplay,
  sessionDetails,
} from '../support/testData';

import {
  interceptTeachers,
  interceptSessionCreate,
  interceptSessionDelete,
  interceptSessionGet,
  interceptSessionList,
  interceptSessionUpdate,
} from '../support/intercepts';

describe('Admin End-to-End Flow', () => {
  it('should login and complete the admin flow', () => {
    const sessionDateISO = getFutureDateISO(1); // ex: 2025-05-14
    const updatedDateISO = getFutureDateISO(2); // ex: 2025-05-15
    const updatedDateDisplay = formatDateForDisplay(updatedDateISO); // ex: May 15, 2025

    cy.log('📅 Date initiale ISO : ' + sessionDateISO);
    cy.log('📅 Date mise à jour ISO : ' + updatedDateISO);
    cy.log('📅 Format affiché attendu : ' + updatedDateDisplay);

    // === STEP 0: Login ===
    interceptSessionList([]);
    cy.intercept('POST', '**/api/auth/login', {
      body: adminUser,
    }).as('loginRequest');

    cy.visit('/login');
    cy.get('input[formControlName=email]').type(adminUser.email);
    cy.get('input[formControlName=password]').type('test!1234');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');
    cy.wait('@getSessions');
    cy.url().should('include', '/sessions');

    // === STEP 1: Create a session ===
    const session = createSession(sessionDateISO);
    interceptTeachers([teacherVictoria]);
    interceptSessionCreate(session);
    interceptSessionList([session]);

    cy.get('[data-testid="create-button"]').click();
    cy.url().should('include', '/sessions/create');
    cy.wait('@getTeachers');

    cy.get('input[data-testid="name-input"]').type(session.name);
    cy.get('input[data-testid="date-input"]').type(sessionDateISO);
    cy.get('mat-select[data-testid="teacher-select"]').click();
    cy.get('mat-option')
      .contains(`${teacherVictoria.firstName} ${teacherVictoria.lastName}`)
      .click();
    cy.get('textarea[data-testid="description-input"]').type(
      session.description
    );
    cy.get('button[data-testid="submit-button"]').click();

    cy.wait('@createSession');
    cy.wait('@getSessions');
    cy.url().should('include', '/sessions');
    cy.contains(session.name, { timeout: 10000 }).should('exist');

    // === STEP 2: Session Update ===
    const updated = {
      ...updatedSession,
      startDate: updatedDateISO,
      date: updatedDateISO,
    };
    interceptTeachers([teacherAlice]);
    interceptSessionGet({ ...session }); // ✅ id reste en number
    interceptSessionUpdate(session.id); // ✅ id en number
    interceptSessionList([updated]);

    cy.window().scrollTo('bottom');

    cy.get('mat-card')
      .contains('mat-card-title', session.name)
      .closest('mat-card')
      .find('[data-testid="edit-button"]')
      .should('be.visible')
      .click();

    cy.wait('@getSessionDetail');
    cy.url().should('include', `/sessions/update/${session.id}`);

    cy.get('input[data-testid="name-input"]').clear().type(updated.name);
    cy.get('input[data-testid="date-input"]').clear().type(updatedDateISO);
    cy.get('mat-select[data-testid="teacher-select"]').click();
    cy.get('mat-option')
      .contains(`${teacherAlice.firstName} ${teacherAlice.lastName}`)
      .click();
    cy.get('textarea[data-testid="description-input"]')
      .clear()
      .type(updated.description);

    cy.get('button[data-testid="submit-button"]').click();
    cy.wait('@updateSession');
    cy.wait('@getSessions');

    cy.url().should('include', '/sessions');
    cy.contains(updatedDateDisplay).should('exist');
    cy.window().scrollTo('bottom');
    cy.contains(updated.name).should('exist');
    cy.contains(updated.description).should('exist');
    cy.contains(updatedDateDisplay).should('exist');

    // === STEP 3: session details ===

    cy.log('📦 Interceptions pour le détail de la session');

    // 👇 On n’utilise PAS une version incomplète de `updated`
    interceptSessionDelete(updated.id);
    interceptSessionList([]);

    // ✅ On utilise uniquement l’objet complet avec le prof inclus
    interceptSessionGet(sessionDetails);

    cy.log('👀 Ouverture des détails de la session');
    cy.get('button[data-testid="detail-button"]').should('exist').click();

    cy.log('✅ Vérification des éléments affichés');
    cy.contains(sessionDetails.name).should('exist');
    cy.contains(`${teacherAlice.firstName} ${teacherAlice.lastName.toUpperCase()}`).should('exist');
    cy.contains(sessionDetails.name).should('exist');
    cy.contains(sessionDetails.description).should('exist');

    // Tu peux ici remplacer "Expected attendees value" par la valeur réelle attendue si besoin
    const attendees = sessionDetails.attendees.length.toString();
    cy.contains(attendees).should('exist');

    cy.contains('Create at:').should('exist');
    cy.contains('Last update:').should('exist');

    cy.window().scrollTo('bottom');
    cy.contains(updatedDateDisplay).should('exist');
    cy.contains(sessionDetails.description).should('exist');

    cy.log('🗑 Suppression de la session');
    cy.visit(`/sessions/detail/${updated.id}`);
    cy.wait('@getSessionDetail');
    cy.get('[data-testid=delete-button]').click();
    cy.wait('@deleteSession');

    cy.url().should('include', '/sessions');
    cy.contains(updated.name).should('not.exist');

    // === STEP 4: Profile and Logout ===
    cy.visit('/me');
    cy.contains('My Profile');
    cy.visit('/');
    cy.contains('Login');
  });
});
