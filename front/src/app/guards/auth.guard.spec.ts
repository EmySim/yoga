import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { LoginComponent } from '../features/auth/components/login/login.component';
import { expect } from '@jest/globals';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let sessionService: SessionService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'login', component: LoginComponent } // 📌 Ajoute la route login
        ])
      ],
      providers: [
        AuthGuard,
        {
          provide: SessionService,
          useValue: {
            get isLogged() { return false; } // Utilisation d'un getter pour simuler un service réactif
          }
        }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
  });

  it('should allow navigation if user is logged in', () => {
    jest.spyOn(sessionService, 'isLogged', 'get').mockReturnValue(true);

    const result = guard.canActivate();

    expect(result).toBe(true);  // ✅ L'utilisateur connecté peut naviguer
  });

  it('should redirect to login if user is not logged in', () => {
    jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true)); // ✅ Mock `navigate`

    const result = guard.canActivate();

    expect(result).toBe(false);  // ❌ L'utilisateur non connecté ne peut pas naviguer
    expect(router.navigate).toHaveBeenCalledWith(['login']);  // ✅ Vérifie la redirection
  });
});
