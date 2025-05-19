// Types explicites
export interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
}

export interface Session {
  id: number;
  name: string;
  teacher: Teacher;
  imageUrl: string;
  users: { id: number }[];
  attendees: number[];
  startDate: string;
  endDate: string;
  date: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Interceptions Cypress

// Liste des enseignants (GET /api/teacher)
export const interceptTeachers = (teachers: Teacher[]) => {
  cy.intercept('GET', '/api/teacher', { body: teachers }).as('getTeachers');
};

// Enseignant individuel (GET /api/teacher/:id)
export const interceptTeacherGet = (teacher: Teacher) => {
  cy.intercept('GET', `/api/teacher/${teacher.id}`, { body: teacher }).as(`getTeacher-${teacher.id}`);
};

// Détail d’une session (GET /api/session/:id)
export const interceptSessionGet = (session: Session) => {
  cy.intercept('GET', `/api/session/${session.id}`, { body: session }).as('getSessionDetail');
};

// Liste des sessions (GET /api/session)
export const interceptSessionList = (sessionList: Pick<Session, 'id'>[]) => {
  cy.intercept('GET', '/api/session', { body: sessionList }).as('getSessions');
};

// Création de session (POST /api/session)
export const interceptSessionCreate = (session: Session) => {
  cy.intercept('POST', '/api/session', { body: session }).as('createSession');
};

// Mise à jour de session (PUT /api/session/:id)
export const interceptSessionUpdate = (sessionId: number) => {
  cy.intercept('PUT', `/api/session/${sessionId}`, {}).as('updateSession');
};

// Suppression de session (DELETE /api/session/:id)
export const interceptSessionDelete = (sessionId: number) => {
  cy.intercept('DELETE', `/api/session/${sessionId}`, {}).as('deleteSession');
};
