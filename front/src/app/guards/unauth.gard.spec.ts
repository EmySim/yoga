import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { UnauthGuard } from './unauth.guard';
import { expect } from '@jest/globals';

describe('UnauthGuard', () => {
  let guard: UnauthGuard;
  let sessionService: SessionService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'sessions', redirectTo: '' } // 📌 Ajoute la route pour éviter les erreurs de redirection
        ])
      ],
      providers: [
        UnauthGuard,
        {
          provide: SessionService,
          useValue: {
            get isLogged() { return false; } // 📌 Utilise un getter pour simuler un service réactif
          }
        }
      ]
    });

    guard = TestBed.inject(UnauthGuard);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
  });

  it('should allow navigation if user is not logged in', () => {
    jest.spyOn(sessionService, 'isLogged', 'get').mockReturnValue(false); // ✅ Mock l'état "non connecté"

    const result = guard.canActivate();

    expect(result).toBe(true);  // ✅ L'utilisateur peut naviguer s'il n'est pas connecté
  });

  it('should redirect to rentals if user is logged in', () => {
    jest.spyOn(sessionService, 'isLogged', 'get').mockReturnValue(true); // ✅ Mock l'état "connecté"
    jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true)); // ✅ Mock `navigate`

    const result = guard.canActivate();

    expect(result).toBe(false);  // ❌ L'utilisateur connecté ne peut pas naviguer
    expect(router.navigate).toHaveBeenCalledWith(['sessions']); // ✅ Vérifie la redirection
  });
});
