export const interceptTeachers = (teachers: any[]) => {
  cy.intercept('GET', '/api/teacher', { body: teachers }).as('getTeachers');
};

export const interceptSessionGet = (session: { id: string }) => {
  cy.intercept('GET', `/api/session/${session.id}`, { body: session }).as('getSessionDetail');
};

export const interceptSessionList = (sessionList: any) => {
  cy.intercept('GET', '/api/session', sessionList).as('getSessions');
};

export const interceptSessionCreate = (session: { [key: string]: any }) => {
  cy.intercept('POST', '/api/session', { body: session }).as('createSession');
};

export const interceptSessionUpdate = (sessionId: string) => {
  cy.intercept('PUT', `/api/session/${sessionId}`, {}).as('updateSession');
};

export const interceptSessionDelete = (sessionId: string) => {
  cy.intercept('DELETE', `/api/session/${sessionId}`, {}).as('deleteSession');
};
