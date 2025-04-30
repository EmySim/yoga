describe('Register User', () => {
  it('should register a new user successfully', () => {
    // Interception de la requête d’enregistrement
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 201,
      body: {
        id: 123,
        firstName: 'Donald',
        lastName: 'Kornegay',
        email: 'DonaldVKornegay@dayrep.com'
      }
    }).as('registerUser');

    // Aller à la page d'enregistrement
    cy.visit('/register');

    // Remplir le formulaire
    cy.get('[data-testid="input-first-name"]').type('Donald');
    cy.get('[data-testid="input-last-name"]').type('Kornegay');
    cy.get('[data-testid="input-email"]').type('DonaldVKornegay@dayrep.com');
    cy.get('[data-testid="input-password"]').type('naing2Ebu');

    // Soumettre le formulaire
    cy.get('[data-testid="submit-button"]').click();

    // Attendre l’interception
    cy.wait('@registerUser');

    // Vérifier la redirection vers login
    cy.url().should('include', '/login');

    // Vérifier qu’aucune erreur n’est affichée
    cy.get('[data-testid="error-message"]').should('not.exist');
  });
});
