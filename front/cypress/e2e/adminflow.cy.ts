/// <reference types="cypress" />

import {
  adminUser,
  teacherVictoria,
  teacherAlice,
  createSession,
  getFutureDateISO,
  formatDateForDisplay,
  sessionDetails,
} from '../support/testData';

import {
  interceptTeachers,
  interceptTeacherGet,
  interceptSessionCreate,
  interceptSessionDelete,
  interceptSessionGet,
  interceptSessionList,
  interceptSessionUpdate,
} from '../support/intercepts';

const interceptLogin = (user = adminUser) => {
  cy.intercept('POST', '**/api/auth/login', { body: user }).as('loginRequest');
};

describe('Admin End-to-End Flow', () => {
  /* ================================================================= */
  /*  IT 1 : LOGIN                                                     */
  /* ================================================================= */
  it('se connecte en tant qu’admin', () => {
    interceptSessionList([]);
    interceptLogin();

    cy.visit('/login');
    cy.get('input[formControlName=email]').type(adminUser.email);
    cy.get('input[formControlName=password]').type(adminUser.password);
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');
    cy.wait('@getSessions');
    cy.url().should('include', '/sessions');
  });

  /* ================================================================= */
  /*  IT 2 : CRÉATION DE SESSION                                       */
  /* ================================================================= */
  it('crée une nouvelle session', () => {
    const sessionDateISO = getFutureDateISO(1);
    const session = createSession(sessionDateISO);

    interceptTeachers([teacherVictoria]);
    interceptTeacherGet(teacherVictoria);
    interceptSessionCreate(session);
    interceptSessionList([session]);

    cy.get('[data-testid="create-button"]').click();
    cy.url().should('include', '/sessions/create');
    cy.wait('@getTeachers');

    cy.get('input[data-testid="name-input"]').type(session.name);
    cy.get('input[data-testid="date-input"]').type(sessionDateISO);
    cy.get('mat-select[data-testid="teacher-select"]').click();
    cy.get('mat-option').contains(`${teacherVictoria.firstName} ${teacherVictoria.lastName}`).click();
    cy.get('textarea[data-testid="description-input"]').type(session.description);
    cy.get('button[data-testid="submit-button"]').click();

    cy.wait('@createSession');
    cy.wait('@getSessions');
    cy.url().should('include', '/sessions');
    cy.contains(session.name).should('exist');
  });

  /* ================================================================= */
  /*  IT 3 : MISE À JOUR DE SESSION                                    */
  /* ================================================================= */
  it('met à jour la session existante', () => {
    const updatedDateISO = getFutureDateISO(2);
    const updatedDateDisplay = formatDateForDisplay(updatedDateISO);

    // session initiale créée lors de l’IT précédent
    const session = createSession(getFutureDateISO(1));
    interceptSessionList([session]);

    const updated = {
      ...sessionDetails,
      id: session.id,
      name: 'Updated Yoga Session',
      startDate: updatedDateISO,
      date: updatedDateISO,
      updatedAt: getFutureDateISO(2, 2),
      teacher: teacherAlice,
    };

    interceptTeachers([teacherAlice]);
    interceptTeacherGet(teacherAlice);
    interceptSessionGet(session);
    interceptSessionUpdate(updated.id);
    interceptSessionList([updated]);

    cy.get('mat-card').contains('mat-card-title', session.name)
      .closest('mat-card')
      .find('[data-testid="edit-button"]').click();

    cy.wait('@getSessionDetail');
    cy.url().should('include', `/sessions/update/${session.id}`);

    cy.get('input[data-testid="name-input"]').clear().type(updated.name);
    cy.get('input[data-testid="date-input"]').clear().type(updatedDateISO);
    cy.get('mat-select[data-testid="teacher-select"]').click();
    cy.get('mat-option').contains(`${teacherAlice.firstName} ${teacherAlice.lastName}`).click();
    cy.get('textarea[data-testid="description-input"]').clear().type(updated.description);
    cy.get('button[data-testid="submit-button"]').click();

    cy.wait('@updateSession');
    cy.wait('@getSessions');

    cy.contains(updated.name).should('exist');
    cy.contains(updated.description).should('exist');
    cy.contains(updatedDateDisplay).should('exist');
  });

  /* ================================================================= */
  /*  IT 4 : CONSULTATION DU DÉTAIL                                    */
  /* ================================================================= */
  it('consulte le détail de la session mise à jour', () => {
    const sessionISO = getFutureDateISO(2);
    const session = {
      ...sessionDetails,
      date: sessionISO,
      startDate: sessionISO,
      teacher: teacherAlice,
    };

    interceptSessionList([session]);
    interceptSessionGet(session);
    interceptTeachers([teacherAlice]);
    interceptTeacherGet(teacherAlice);

    cy.get('mat-card').contains('mat-card-title', session.name)
      .closest('mat-card')
      .find('[data-testid="detail-button"]').click();

    cy.wait('@getSessionDetail');
    cy.url().should('include', `/sessions/detail/${session.id}`);

    const expectedTeacherName = `${teacherAlice.firstName} ${teacherAlice.lastName.toUpperCase()}`;
    cy.contains(expectedTeacherName).should('exist');
  });

  /* ================================================================= */
  /*  IT 5 : SUPPRESSION DE SESSION                                    */
  /* ================================================================= */
  it('supprime la session', () => {
    const sessionISO = getFutureDateISO(2);
    const session = createSession(sessionISO);

    interceptSessionList([session]);
    interceptSessionDelete(session.id);
    interceptSessionList([]);

    cy.get('mat-card').contains('mat-card-title', session.name)
      .closest('mat-card')
      .find('[data-testid="delete-button"]').click();

    cy.wait('@deleteSession');
    cy.url().should('include', '/sessions');
    cy.contains(session.name).should('not.exist');
  });
});