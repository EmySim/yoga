describe('Admin End-to-End Flow', () => {
  beforeEach(() => {
    // Intercept login
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'adminUser',
        firstName: 'Admin',
        lastName: 'User',
        admin: true,
        token: 'fake-jwt-token'
      },
    }).as('login');

    // Intercept session list (empty or not)
    cy.intercept('GET', '/api/session', []).as('getSessions');

    // Go to login and simulate login form interaction
    cy.visit('/login');
    cy.get('input[formControlName=email]').type('admin@yoga.com');
    cy.get('input[formControlName=password]').type('admin123{enter}');
    cy.wait('@login');
    cy.url().should('include', '/sessions');
  });

  it('should complete the admin flow', () => {
    // === STEP 1: Create a session ===
    cy.intercept('GET', '/api/teacher', {
      body: [{ id: 1, firstName: 'John', lastName: 'Doe' }]
    }).as('getTeachers');

    cy.intercept('POST', '/api/session', {
      body: {
        id: 92,
        name: 'Yoga Session',
        description: 'A relaxing yoga session',
        date: '2025-04-30',
        teacher_id: 1,
        users: []
      },
    }).as('createSession');

    cy.visit('/sessions/create');
    cy.wait('@getTeachers');
    cy.get('input[data-testid="name-input"]').type('Yoga Session');
    cy.get('input[data-testid="date-input"]').type('2025-04-30');
    cy.get('mat-select[data-testid="teacher-select"]').click();
    cy.get('mat-option').first().click();
    cy.get('textarea[data-testid="description-input"]').type('A relaxing yoga session');
    cy.get('button[data-testid="submit-button"]').click();
    cy.wait('@createSession');
    cy.url().should('include', '/sessions');
    cy.contains('Yoga Session');

    // === STEP 2: Update the session ===
    cy.intercept('GET', '/api/session/92', {
      body: {
        id: 92,
        name: 'Yoga Session',
        description: 'A relaxing yoga session',
        date: '2025-04-30',
        teacher_id: 1,
        users: []
      },
    }).as('getSessionDetail');

    cy.intercept('PUT', '/api/session/92', {
      body: {
        id: 92,
        name: 'Updated Yoga Session',
        description: 'An updated relaxing yoga session',
        date: '2025-05-01',
        teacher_id: 1,
        users: []
      },
    }).as('updateSession');

    cy.visit('/sessions/update/92');
    cy.wait('@getSessionDetail');
    cy.get('input[data-testid="name-input"]').clear().type('Updated Yoga Session');
    cy.get('input[data-testid="date-input"]').clear().type('2025-05-01');
    cy.get('textarea[data-testid="description-input"]').clear().type('An updated relaxing yoga session');
    cy.get('button[data-testid="submit-button"]').click();
    cy.wait('@updateSession');
    cy.url().should('include', '/sessions');
    cy.contains('Updated Yoga Session');

    // === STEP 3: View and delete the session ===
    cy.intercept('GET', '/api/session/93', {
      body: {
        id: 93,
        name: 'Updated Yoga Session',
        description: 'An updated relaxing yoga session',
        date: '2025-05-01',
        teacher_id: 1,
        users: []
      },
    }).as('getSessionDetail93');

    cy.intercept('DELETE', '/api/session/93', {}).as('deleteSession');

    cy.visit('/sessions/detail/93');
    cy.wait('@getSessionDetail93');
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