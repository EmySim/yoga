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
    const updatedDateISO = getFutureDateISO(2);
    const updatedDateDisplay = formatDateForDisplay(updatedDateISO);

    cy.log('📅 Date initiale ISO : ' + sessionDateISO);
    cy.log('📅 Date mise à jour ISO : ' + updatedDateISO);
    cy.log('📅 Format affiché attendu : ' + updatedDateDisplay);

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
      ...session,
      ...updatedSession,
      startDate: updatedDateISO,
      date: updatedDateISO,
      teacher: teacherAlice,
      teacher_id: teacherAlice.id,
      users: [adminUser.id],
    };
    interceptTeachers([teacherAlice]);
    interceptTeacherGet(teacherAlice);
    interceptSessionGet(session);
    interceptSessionUpdate(session.id);
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

    // === STEP 3: Session Details ===
    cy.log('📦 Interceptions pour le détail de la session');
    interceptSessionDelete(updated.id);
    interceptSessionList([]);
    interceptSessionGet(updated);
    interceptTeachers([teacherAlice]);
    interceptTeacherGet(teacherAlice);

    // 🔧 Correction ici : interception générique pour les détails profs
    cy.intercept('GET', '/api/teacher/*').as('getTeacher');

    cy.log('👀 Ouverture des détails de la session');
    cy.get('button[data-testid="detail-button"]').should('exist').click();

    cy.wait('@getSessionDetail');
    cy.wait('@getTeacher');

    cy.log('✅ Vérification des éléments affichés');

    // Vérification du nom de la session
    cy.contains(updated.name).should('exist');

    // Vérification du nom du professeur (Alice SMITH)
    const expectedTeacherName = `${
      teacherAlice.firstName
    } ${teacherAlice.lastName.toUpperCase()}`;
    cy.get('[data-testid="teacher-name"]', { timeout: 10000 })
      .should('exist')
      .should('be.visible')
      .should('have.text', expectedTeacherName);

    // Vérification de la description
    cy.contains(updated.description).should('exist');

    // Vérification des participants
    cy.contains(sessionDetails.attendees.length.toString()).should('exist');

    cy.contains('Create at:').should('exist');
    cy.contains('Last update:').should('exist');
    cy.contains(updatedDateDisplay).should('exist');

    // === STEP 4: Delete the Session ===
    cy.log('🗑 Suppression de la session');
    cy.visit(`/sessions/detail/${updated.id}`);
    cy.wait('@getSessionDetail');
    cy.get('[data-testid=delete-button]').click();
    cy.wait('@deleteSession');
    cy.url().should('include', '/sessions');
    cy.contains(updated.name).should('not.exist');

    // === STEP 5: Profile and Logout ===
    cy.visit('/me');
    cy.contains('My Profile');
    cy.visit('/');
    cy.contains('Login');
  });
});
