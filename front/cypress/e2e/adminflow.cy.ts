describe('Admin End-to-End Flow', () => {
  it('should login and complete the admin flow', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split('T')[0];

    // Stub global pour observer toutes les requêtes vers /api/session
    cy.intercept('GET', '/api/session').as('anySessionGet');

    cy.log('👉 Intercept login request');
    cy.intercept('POST', '**/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
      },
    }).as('loginRequest');

    cy.log('👉 Intercept initial session list (empty)');
    cy.intercept('GET', '/api/session', []).as('getSessions');

    cy.visit('/login');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234');
    cy.get('button[type="submit"]').click();
    cy.wait('@loginRequest');
    cy.wait('@getSessions');
    cy.url().should('include', '/sessions');

    cy.log('👉 Intercept teacher list');
    cy.intercept('GET', '/api/teacher', {
      body: [{
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }],
    }).as('getTeachers');

    cy.log('👉 Intercept session creation');
    cy.intercept('POST', '/api/session', {
      body: {
        id: 92,
        name: 'Yoga Session',
        description: 'A relaxing yoga session',
        date: formattedDate,
        teacher_id: 1,
        users: [],
      },
    }).as('createSession');

    cy.get('[data-testid="create-button"]').click();
    cy.url().should('include', '/sessions/create');
    cy.wait('@getTeachers');

    cy.log('👉 Intercept refreshed session list AFTER creation');
    cy.intercept('GET', '/api/session', [
      {
        id: 92,
        name: 'Yoga Session',
        description: 'A relaxing yoga session',
        date: formattedDate,
        teacher: { id: 1, firstName: 'John', lastName: 'Doe' },
        users: [],
      },
    ]).as('getSessionsAfterCreate');

    // Remplir le formulaire
    cy.get('input[data-testid="name-input"]').type('Yoga Session');
    cy.get('input[data-testid="date-input"]').type(formattedDate);
    cy.get('mat-select[data-testid="teacher-select"]').click();
    cy.get('mat-option').first().click();
    cy.get('textarea[data-testid="description-input"]').type('A relaxing yoga session');

    cy.get('button[data-testid="submit-button"]').click();

    cy.wait('@createSession');
    cy.wait('@getSessionsAfterCreate');

    cy.url().should('include', '/sessions');
    cy.contains('Yoga Session');
    cy.log('✅ Test completed successfully');
  });
});
