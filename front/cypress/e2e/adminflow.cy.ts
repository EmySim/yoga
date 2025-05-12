describe('Admin End-to-End Flow', () => {
  it('should login and complete the admin flow', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split('T')[0];

    cy.log('📅 Date utilisée pour les tests : ' + formattedDate);

    // === STEP 0: Login ===
    cy.intercept('GET', '/api/session').as('getSessions');
    cy.intercept('POST', '**/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
      },
    }).as('loginRequest');

    cy.visit('/login');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');
    cy.wait('@getSessions');
    cy.url().should('include', '/sessions');

    // === STEP 1: Create a session ===
    cy.intercept('GET', '/api/teacher', {
      body: [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    }).as('getTeachers');

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

    cy.get('input[data-testid="name-input"]').type('Yoga Session');
    cy.get('input[data-testid="date-input"]').type(formattedDate);
    cy.get('mat-select[data-testid="teacher-select"]').click();
    cy.get('mat-option').first().click();
    cy.get('textarea[data-testid="description-input"]').type('A relaxing yoga session');
    cy.get('button[data-testid="submit-button"]').click();

    cy.wait('@createSession');
    cy.wait('@getSessionsAfterCreate');
    cy.url().should('include', '/sessions');
    cy.contains('Yoga Session', { timeout: 10000 }).should('exist');

    // === STEP 2: Update the session ===
cy.intercept('GET', '/api/session/92', {
  body: {
    id: 92,
    name: 'Yoga Session',
    description: 'A relaxing yoga session',
    date: formattedDate,
    teacher_id: 1,
    users: [],
  },
}).as('getSessionDetail');

cy.log('🖱️ Scroll et click sur le bouton d\'édition pour la session 92');
cy.window().scrollTo('bottom');
cy.wait(500);

cy.get('mat-card') // Sélectionner toutes les cartes
  .contains('mat-card-title', 'Yoga Session') // Cherche le titre de la session
  .closest('mat-card') // Trouve le mat-card parent contenant ce titre
  .find('[data-testid="edit-button"]') // Cherche le bouton d'édition dans cette mat-card
  .should('be.visible') // Vérifie qu'il est visible
  .click(); // Clique sur le bouton

cy.wait('@getSessionDetail');
cy.url().should('include', '/sessions/update/92');


    cy.get('input[data-testid="name-input"]').should('be.visible').clear().type('Updated Yoga Session');
    cy.get('input[data-testid="date-input"]').clear().type('2025-05-01');
    cy.get('textarea[data-testid="description-input"]').clear().type('An updated relaxing yoga session');

    cy.intercept('PUT', '/api/session/92', {}).as('updateSession');
    cy.get('button[data-testid="submit-button"]').click();

    cy.wait('@updateSession');
    cy.url().should('include', '/sessions');
    cy.contains('Updated Yoga Session');

    // === STEP 3: View and delete the session ===
    cy.intercept('GET', '/api/session/92', {
      body: {
        id: 92,
        name: 'Updated Yoga Session',
        description: 'An updated relaxing yoga session',
        date: '2025-05-01',
        teacher_id: 1,
        users: [],
      },
    }).as('getSessionDetail92');

    cy.intercept('DELETE', '/api/session/92', {}).as('deleteSession');

    cy.visit('/sessions/detail/92');
    cy.wait('@getSessionDetail92');
    cy.get('[data-testid=delete-button]').click();
    cy.wait('@deleteSession');

    cy.url().should('include', '/sessions');
    cy.contains('Updated Yoga Session').should('not.exist');

    // === STEP 4: Profile and Logout ===
    cy.visit('/me');
    cy.contains('My Profile');
    cy.visit('/');
    cy.contains('Login');
  });
});
