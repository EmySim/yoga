describe('Session Management', () => {
  beforeEach(() => {
    // Simuler l’état d’un utilisateur déjà connecté
    window.localStorage.setItem('user', JSON.stringify({
      id: 1,
      username: 'adminUser',
      firstName: 'Admin',
      lastName: 'User',
      admin: true,
      token: 'fake-jwt-token'
    }));

    // Intercepter l’appel à GET /api/session avec un faux tableau
    cy.intercept('GET', '/api/session', {
      body: [
        {
          id: 1,
          name: 'Yoga Session',
          description: 'A relaxing yoga session',
          date: '2025-04-30',
          teacher_id: 1,
          users: []
        }
      ]
    }).as('getSessions');

    // Aller sur la page /sessions
    cy.visit('/sessions');
    cy.wait('@getSessions');
    cy.contains('Sessions'); // Vérifie que la page a bien chargé
  });

  it('should create a new session', () => {
    cy.intercept('POST', '/api/session', {
      body: {
        id: 1,
        name: 'Yoga Session',
        description: 'A relaxing yoga session',
        date: '2025-04-30',
        teacher_id: 1,
        users: []
      },
    }).as('createSession');

    cy.visit('/sessions/create');
    cy.get('input[formControlName=name]').type('Yoga Session');
    cy.get('input[formControlName=date]').type('2025-04-30');
    cy.get('mat-select[formControlName=teacher_id]').click().get('mat-option').first().click();
    cy.get('textarea[formControlName=description]').type('A relaxing yoga session');
    cy.get('button[type=submit]').click();

    cy.wait('@createSession');
    cy.url().should('include', '/sessions');
    cy.contains('Yoga Session');
  });

  it('should update an existing session', () => {
    cy.intercept('GET', '/api/session/1', {
      body: {
        id: 1,
        name: 'Yoga Session',
        description: 'A relaxing yoga session',
        date: '2025-04-30',
        teacher_id: 1,
        users: []
      },
    }).as('getSessionDetail');

    cy.intercept('PUT', '/api/session/1', {
      body: {
        id: 1,
        name: 'Updated Yoga Session',
        description: 'An updated relaxing yoga session',
        date: '2025-05-01',
        teacher_id: 1,
        users: []
      },
    }).as('updateSession');

    cy.visit('/sessions/update/1');
    cy.wait('@getSessionDetail');

    cy.get('input[formControlName=name]').clear().type('Updated Yoga Session');
    cy.get('input[formControlName=date]').clear().type('2025-05-01');
    cy.get('textarea[formControlName=description]').clear().type('An updated relaxing yoga session');
    cy.get('button[type=submit]').click();

    cy.wait('@updateSession');
    cy.url().should('include', '/sessions');
    cy.contains('Updated Yoga Session');
  });

  it('should delete a session', () => {
    cy.intercept('DELETE', '/api/session/1', {}).as('deleteSession');

    cy.contains('Yoga Session').parent().find('button.delete').click();
    cy.wait('@deleteSession');

    cy.contains('Yoga Session').should('not.exist');
  });

  it('should allow a user to participate in a session', () => {
    cy.intercept('POST', '/api/session/1/participate/1', {}).as('participateSession');

    cy.visit('/sessions/detail/1');
    cy.get('button.participate').click();
    cy.wait('@participateSession');

    cy.contains('You are participating');
  });

  it('should allow a user to un-participate from a session', () => {
    cy.intercept('DELETE', '/api/session/1/participate/1', {}).as('unParticipateSession');

    cy.visit('/sessions/detail/1');
    cy.get('button.unparticipate').click();
    cy.wait('@unParticipateSession');

    cy.contains('You are not participating');
  });
});
