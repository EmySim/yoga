import { render, screen, fireEvent } from '@testing-library/angular';
import { RegisterComponent } from '../app/features/auth/components/register/register.component';
import { AuthService } from '../app/features/auth/services/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import '@testing-library/jest-dom';

describe('RegisterComponent Integration Test', () => {
  const mockRouter = {
    navigate: jest.fn()
  };

  const setup = async (registerFn: jest.Mock) => {
    await render(RegisterComponent, {
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: { register: registerFn } },
        { provide: Router, useValue: mockRouter }
      ]
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('doit créer un compte avec succès et rediriger vers la page de login', async () => {
    const registerMock = jest.fn().mockReturnValue(of(null));
    await setup(registerMock);

    fireEvent.input(screen.getByTestId('input-first-name'), {
      target: { value: 'John' }
    });
    fireEvent.input(screen.getByTestId('input-last-name'), {
      target: { value: 'Doe' }
    });
    fireEvent.input(screen.getByTestId('input-email'), {
      target: { value: 'john.doe@example.com' }
    });
    fireEvent.input(screen.getByTestId('input-password'), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByTestId('submit-button'));

    expect(registerMock).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123'
    });

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('ne doit pas appeler le service si un champ obligatoire est vide', async () => {
    const registerMock = jest.fn();
    await setup(registerMock);

    fireEvent.input(screen.getByTestId('input-first-name'), {
      target: { value: '' } // Vide
    });
    fireEvent.input(screen.getByTestId('input-last-name'), {
      target: { value: 'Doe' }
    });
    fireEvent.input(screen.getByTestId('input-email'), {
      target: { value: 'john.doe@example.com' }
    });
    fireEvent.input(screen.getByTestId('input-password'), {
      target: { value: 'password123' }
    });

    const submitButton = screen.getByTestId('submit-button');
    expect(submitButton).toBeDisabled(); // le bouton est désactivé si le formulaire est invalide

    fireEvent.click(submitButton);

    expect(registerMock).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('doit afficher un message d\'erreur si le backend échoue', async () => {
    const registerMock = jest.fn().mockReturnValue(throwError(() => new Error('Erreur réseau')));
    await setup(registerMock);

    fireEvent.input(screen.getByTestId('input-first-name'), {
      target: { value: 'John' }
    });
    fireEvent.input(screen.getByTestId('input-last-name'), {
      target: { value: 'Doe' }
    });
    fireEvent.input(screen.getByTestId('input-email'), {
      target: { value: 'john.doe@example.com' }
    });
    fireEvent.input(screen.getByTestId('input-password'), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByTestId('submit-button'));

    const errorMessage = await screen.findByTestId('error-message');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent(/error/i); // ou /an error occurred/i selon ton texte réel
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});