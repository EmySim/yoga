import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { SessionService } from './session.service';
import { SessionInformation } from '../interfaces/sessionInformation.interface';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy(); // ✅ Vérifie l'instanciation correcte du service
  });

  it('should initialize with isLogged as false', () => {
    expect(service.isLogged).toBe(false); // ✅ Vérifie l'état initial (non connecté)
  });

  it('should log in a user and update state', () => {
    const mockUser: SessionInformation = {
      token: 'some-token',
      type: 'bearer',
      id: 123,
      username: 'john_doe',
      firstName: 'John',
      lastName: 'Doe',
      admin: false
    };

    service.logIn(mockUser); // ✅ Simule la connexion d'un utilisateur

    expect(service.sessionInformation).toEqual(mockUser); // ✅ Vérifie que l'utilisateur est stocké correctement
    expect(service.isLogged).toBe(true); // ✅ Vérifie que l'état de connexion est bien mis à jour
  });

  it('should log out a user and reset state', () => {
    service.logOut(); // ✅ Simule une déconnexion

    expect(service.sessionInformation).toBeUndefined(); // ✅ Vérifie que l'information de session est bien supprimée
    expect(service.isLogged).toBe(false); // ✅ Vérifie que l'utilisateur est bien marqué comme déconnecté
  });

  it('should emit values correctly when logging in and out (async)', (done) => {
    const mockUser: SessionInformation = {
      token: 'some-token',
      type: 'bearer',
      id: 123,
      username: 'john_doe',
      firstName: 'John',
      lastName: 'Doe',
      admin: false
    };
  
    const emittedValues: boolean[] = [];
  
    service.$isLogged().subscribe(value => {
      emittedValues.push(value);
      // Appeler done une seule fois après avoir collecté toutes les valeurs
      if (emittedValues.length === 3) {
        expect(emittedValues).toEqual([false, true, false]); // ✅ Vérifie les valeurs successives émises
        done();
      }
    });
  
    service.logIn(mockUser);
    service.logOut();
  });
  
  it('should not allow duplicate login without logout', () => {
    const mockUser: SessionInformation = {
      token: 'some-token',
      type: 'bearer',
      id: 123,
      username: 'john_doe',
      firstName: 'John',
      lastName: 'Doe',
      admin: false
    };

    service.logIn(mockUser);
    service.logIn(mockUser); // ✅ On tente une deuxième connexion sans déconnexion

    expect(service.sessionInformation).toEqual(mockUser); // ✅ Vérifie que l'information reste correcte
    expect(service.isLogged).toBe(true); // ✅ Vérifie que l'état de connexion ne change pas de manière inattendue
  });

  it('should emit values correctly when logging in and out (async)', (done) => {
    const mockUser: SessionInformation = {
      token: 'some-token',
      type: 'bearer',
      id: 123,
      username: 'john_doe',
      firstName: 'John',
      lastName: 'Doe',
      admin: false
    };

    const emittedValues: boolean[] = [];

    service.$isLogged().subscribe(value => {
      emittedValues.push(value);
    });

    service.logIn(mockUser);
    service.logOut();

    setTimeout(() => {
      expect(emittedValues).toEqual([false, true, false]); // ✅ Vérifie les valeurs successives émises
      done();
    }, 100);
  });
});
describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with isLogged as false', () => {
    expect(service.isLogged).toBe(false);
  });

  it('should log in a user and update state', () => {
    const mockUser: SessionInformation = {
      token: 'some-token',
      type: 'bearer',
      id: 123,
      username: 'john_doe',
      firstName: 'John',
      lastName: 'Doe',
      admin: false
    };

    service.logIn(mockUser);

    expect(service.sessionInformation).toEqual(mockUser);
    expect(service.isLogged).toBe(true);
  });

  it('should log out a user and reset state', () => {
    service.logOut();

    expect(service.sessionInformation).toBeUndefined();
    expect(service.isLogged).toBe(false);
  });

  it('should emit values correctly when logging in and out', (done) => {
    const mockUser: SessionInformation = {
      token: 'some-token',
      type: 'bearer',
      id: 123,
      username: 'john_doe',
      firstName: 'John',
      lastName: 'Doe',
      admin: false
    };

    const emittedValues: boolean[] = [];

    service.$isLogged().subscribe(value => {
      emittedValues.push(value);
      if (emittedValues.length === 3) {
        expect(emittedValues).toEqual([false, true, false]);
        done();
      }
    });

    service.logIn(mockUser);
    service.logOut();
  });

  it('should not allow duplicate login without logout', () => {
    const mockUser: SessionInformation = {
      token: 'some-token',
      type: 'bearer',
      id: 123,
      username: 'john_doe',
      firstName: 'John',
      lastName: 'Doe',
      admin: false
    };

    service.logIn(mockUser);
    service.logIn(mockUser);

    expect(service.sessionInformation).toEqual(mockUser);
    expect(service.isLogged).toBe(true);
  });

  it('should handle multiple state changes correctly', (done) => {
    const mockUser: SessionInformation = {
      token: 'some-token',
      type: 'bearer',
      id: 123,
      username: 'john_doe',
      firstName: 'John',
      lastName: 'Doe',
      admin: false
    };

    const emittedValues: boolean[] = [];

    service.$isLogged().subscribe(value => {
      emittedValues.push(value);
      if (emittedValues.length === 5) {
        expect(emittedValues).toEqual([false, true, false, true, false]);
        done();
      }
    });

    service.logIn(mockUser);
    service.logOut();
    service.logIn(mockUser);
    service.logOut();
  });

  it('should handle undefined sessionInformation gracefully', () => {
    service.logOut();

    expect(service.sessionInformation).toBeUndefined();
    expect(service.isLogged).toBe(false);
  });

  it('should emit correct values when toggling login state multiple times', (done) => {
    const mockUser: SessionInformation = {
      token: 'some-token',
      type: 'bearer',
      id: 123,
      username: 'john_doe',
      firstName: 'John',
      lastName: 'Doe',
      admin: false
    };

    const emittedValues: boolean[] = [];

    service.$isLogged().subscribe(value => {
      emittedValues.push(value);
      if (emittedValues.length === 4) {
        expect(emittedValues).toEqual([false, true, false, true]);
        done();
      }
    });

    service.logIn(mockUser);
    service.logOut();
    service.logIn(mockUser);
  });
});
