import { render, screen, fireEvent } from '@testing-library/angular';
import { LoginComponent } from '../app/features/auth/components/login/login.component';
import { AuthService } from '../app/features/auth/services/auth.service';
import { SessionService } from '../app/services/session.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AppRoutingModule } from '../app/app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgZone } from '@angular/core';
import '@testing-library/jest-dom';

describe('LoginComponent Integration Test (avec mocks)', () => {
  const mockLoginSuccess = jest.fn();
  const mockLoginFail = jest.fn();
  const mockSessionService = { logIn: jest.fn() };
  let mockRouter = { navigate: jest.fn() };
  let ngZone: NgZone;

  const setup = async (loginReturnValue: any) => {
    await render(LoginComponent, {
      imports: [
        AppRoutingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: loginReturnValue
          }
        },
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter }
      ]
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockRouter = { navigate: jest.fn() };
    ngZone = new NgZone({ enableLongStackTrace: false });
  });

  it('doit afficher le formulaire de login', async () => {
    await setup(jest.fn());

    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('doit se connecter avec les bonnes informations et rediriger', async () => {
    const fakeSessionInfo = {
      token: 'token-fake',
      user: { id: '1', email: 'SusanneLejeune@armyspy.com' }
    };

    await setup(jest.fn().mockReturnValue(of(fakeSessionInfo)));

    fireEvent.input(screen.getByTestId('email-input'), {
      target: { value: 'SusanneLejeune@armyspy.com' }
    });
    fireEvent.input(screen.getByTestId('password-input'), {
      target: { value: 'xee9aiRoh' }
    });
    fireEvent.submit(screen.getByTestId('login-form'));

    expect(mockSessionService.logIn).toHaveBeenCalledWith(fakeSessionInfo);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  it('doit afficher une erreur si le login échoue', async () => {
    await setup(jest.fn().mockReturnValue(throwError(() => new Error('bad credentials'))));

    fireEvent.input(screen.getByTestId('email-input'), {
      target: { value: 'wrong@example.com' }
    });
    fireEvent.input(screen.getByTestId('password-input'), {
      target: { value: 'wrongpass' }
    });
    fireEvent.submit(screen.getByTestId('login-form'));

    const errorMessage = await screen.findByText(/An error occurred/i);
    expect(errorMessage).toBeInTheDocument();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(mockSessionService.logIn).not.toHaveBeenCalled();
  });
});