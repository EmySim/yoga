// === Utils ===
export const getFutureDateISO = (daysAhead: number) =>
  new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

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
export const createSession = (date: string) => ({
  id: 92,
  name: 'Yoga Session',
  description: 'A relaxing yoga session',
  date,
  teacher: { ...teacherVictoria },
  users: [],
});

export const updatedSession = (updatedDate: string) => ({
  id: 92,
  name: 'Updated Yoga Session',
  description: 'An updated relaxing yoga session',
  date: updatedDate,
  teacher: { ...teacherAlice },
  users: [],
});
