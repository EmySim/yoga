import { Session } from './intercepts';

// === Utils ===
export const getFutureDateISO = (daysAhead: number, extraHours: number = 0) =>
  new Date(Date.now() + (daysAhead * 24 + extraHours) * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

export const formatDateForDisplay = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

// === Utilisateurs ===
export const adminUser = {
  id: 1,
  username: 'adminUser',
  email: 'admin@yoga.com',
  firstName: 'Admin',
  lastName: 'User',
  admin: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const regularUser = {
  id: 2,
  username: 'regularUser',
  email: 'user@yoga.com',
  firstName: 'Regular',
  lastName: 'User',
  admin: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const generateFakeUsers = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 3, // évite les conflits avec adminUser (1) et regularUser (2)
    username: `fakeUser${i + 1}`,
    email: `fake${i + 1}@yoga.com`,
    firstName: `Fake${i + 1}`,
    lastName: `User`,
    admin: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

export const fakeUsers = generateFakeUsers(12);


// === Enseignants ===
export const teacherVictoria = {
  id: 1,
  firstName: 'Victoria',
  lastName: 'Alden',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const teacherAlice = {
  id: 2,
  firstName: 'Alice',
  lastName: 'Smith',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// === Sessions ===
export const createSession = (date: string): Session => ({
  id: 92,
  name: 'Yoga Session',
  description: 'A relaxing yoga session',
  date,
  teacher: { ...teacherVictoria },
  users: [],
  attendees: [],
  imageUrl: 'https://example.com/default-image.jpg', // Ajout d'une URL par défaut
  startDate: date, // Ajout de startDate
  endDate: getFutureDateISO(1, 2), // Ajout de endDate (+2 heures)
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const updatedSession = {
  id: 92,
  name: 'Updated Yoga Session',
  startDate: getFutureDateISO(7), // dans 7 jours
  endDate: getFutureDateISO(7, 2), // +2h
  date: getFutureDateISO(7), // ← ajouté pour compatibilité avec affichage
  teacher: { ...teacherAlice},
  description: 'An updated relaxing yoga session',
};

export const sessionDetails = {
  id: 92,
  name: 'Updated Yoga Session',
  teacher_id: 2,
  imageUrl: 'https://example.com/image.jpg',
  users: fakeUsers, // Liste des objets utilisateurs
  attendees: fakeUsers.map(user => user.id), // Liste des IDs
  startDate: updatedSession.startDate,
  endDate: updatedSession.endDate,
  date: updatedSession.startDate,
  description: 'An updated relaxing yoga session',
  createdAt: '2025-05-10T08:00:00.000Z',
  updatedAt: '2025-05-16T10:00:00.000Z',
};

