import { TestBed } from '@angular/core/testing';
// Ensure Jest matchers are properly imported
import 'jest-preset-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../services/auth.service';
import { RegisterComponent } from './register.component';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// Création manuelle du mock d'AuthService
const mockAuthService = {
  register: jest.fn(),
};

// Création manuelle du mock de Router
const mockRouter = {
  navigate: jest.fn(),
};

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let authService: jest.Mocked<AuthService>;
  let router: jest.Mocked<Router>;

  beforeEach(async () => {
    // Création manuelle des mocks
    const mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    const mockRouter = {
      navigate: jest.fn().mockResolvedValue(true),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
  });

  it('devrait créer le composant', () => {
    expect(!!component).toBe(true);
  });

  it('devrait avoir un formulaire invalide initialement', () => {
    expect(component.form.valid).toEqual(false);
  });

  it('devrait valider le formulaire avec des valeurs correctes', () => {
    component.form.setValue({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123',
    });
    expect(component.form.valid).toBe(true);
  });

  it('devrait soumettre le formulaire et naviguer vers /login', () => {
    authService.register.mockReturnValue(of(void 0));

    component.form.setValue({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123',
    });
    component.submit();

    expect(authService.register).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('devrait afficher une erreur si l\'inscription échoue', () => {
    authService.register.mockReturnValue(throwError(() => new Error('Erreur')));

    component.form.setValue({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123',
    });

    component.submit();

    expect(authService.register).toHaveBeenCalled();
    expect(component.onError).toBeTruthy();
  });
});