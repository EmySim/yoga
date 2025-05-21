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
  it('should login and complete the admin flow', () => {
    const sessionDateISO = getFutureDateISO(1);
    const updatedDateISO = getFutureDateISO(2); // rendue dynamique
    const updatedDateDisplay = formatDateForDisplay(updatedDateISO);
    const updatedAtDisplay = formatDateForDisplay(getFutureDateISO(2, 2));

    // === STEP 0: Login ===
    interceptSessionList([]);
    interceptLogin();

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
    interceptTeacherGet(teacherVictoria);
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
      ...sessionDetails,
      startDate: updatedDateISO,
      date: updatedDateISO,
      updatedAt: getFutureDateISO(2, 2), // rendue dynamique
      teacher: teacherAlice, // Add the missing teacher property
    };
    interceptTeachers([teacherAlice]);
    interceptTeacherGet(teacherAlice);
    interceptSessionGet(session);
    interceptSessionUpdate(updated.id);
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
    cy.contains(updated.name).should('exist');
    cy.contains(updated.description).should('exist');
    cy.contains(updatedDateDisplay).should('exist');

    interceptSessionDelete(updated.id);
    interceptSessionList([]);
    interceptSessionGet({ ...updated, teacher: teacherAlice });
    interceptTeachers([teacherAlice]);
    interceptTeacherGet(teacherAlice);
    cy.intercept('GET', '/api/teacher/*').as('getTeacher');
    cy.intercept('GET', '/api/teacher/*').as('getTeacher');

    cy.get('button[data-testid="detail-button"]').should('exist').click();

    cy.wait('@getSessionDetail');
    cy.wait('@getTeacher');

    cy.contains(updated.name).should('exist');

    const expectedTeacherName = `${
      teacherAlice.firstName
    } ${teacherAlice.lastName.toUpperCase()}`;
    cy.get('[data-testid="teacher-name"]', { timeout: 10000 })
      .should('exist')
      .should('be.visible')
      .should('have.text', expectedTeacherName);

    cy.contains(updated.description).should('exist');
    cy.contains(`${updated.attendees.length} attendees`).should('exist');
    cy.contains('Create at:').should('exist');
    cy.contains('Last update:').should('exist');
    cy.contains(updatedAtDisplay).should('exist');

    // === STEP 4: Delete the Session ===
    cy.log('🗑 Suppression de la session');
    // 👇 Suppression directe sans revisite
    cy.get('[data-testid=delete-button]').click();
    cy.wait('@deleteSession');
    cy.url().should('include', '/sessions');
    cy.contains(updated.name).should('not.exist');

  });
});
