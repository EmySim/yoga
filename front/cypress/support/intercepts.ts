export const interceptTeachers = (teachers: { id: number; firstName: string; lastName: string; }[]) => {
  cy.intercept('GET', '/api/teacher', { body: teachers }).as('getTeachers');
};

export const interceptSessionGet = (session: { id: number; }) => {
  cy.intercept('GET', `/api/session/${session.id}`, { body: session }).as('getSessionDetail');
};

export const interceptSessionList = (sessionList: { id: number; }[]) => {
  cy.intercept('GET', '/api/session', sessionList).as('getSessions');
};

export const interceptSessionCreate = (session: { [key: string]: any }) => {
  cy.intercept('POST', '/api/session', { body: session }).as('createSession');
};

export const interceptSessionUpdate = (sessionId: number) => {
  cy.intercept('PUT', `/api/session/${sessionId}`, {}).as('updateSession');
};

export const interceptSessionDelete = (sessionId: number) => {
  cy.intercept('DELETE', `/api/session/${sessionId}`, {}).as('deleteSession');
};
