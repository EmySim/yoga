/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

const mockAuthService = {
  login: jest.fn(),
};

const mockRouter = {
  navigate: jest.fn(),
};

describe('LoginComponent', () => {
  it('effectue une connexion réussie avec des informations valides', async () => {
    await render(LoginComponent, {
      imports: [
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    mockAuthService.login.mockReturnValue(of({ token: 'fake-token' }));

    // Interagir avec les champs de formulaire
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i, { selector: 'input' }), { target: { value: 'correctpassword' } });

    // Soumettre le formulaire
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Vérifier les appels et la navigation
    await waitFor(() => {
      expect(mockAuthService.login).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'correctpassword',
      });
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
    });
  });

  it('affiche une erreur si la connexion échoue', async () => {
    await render(LoginComponent, {
      imports: [
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    mockAuthService.login.mockReturnValue(throwError(() => new Error('Erreur de connexion')));

    // Interagir avec les champs de formulaire
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i, { selector: 'input' }), { target: { value: 'wrongpassword' } });

    // Soumettre le formulaire
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Vérifier que le message d'erreur s'affiche
    expect(await screen.findByText(/an error occurred/i)).toBeInTheDocument();
  });

  it('désactive le bouton de soumission si les champs sont vides', async () => {
    await render(LoginComponent, {
      imports: [
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeDisabled();
  });

  it('affiche une erreur si un champ obligatoire est manquant', async () => {
    await render(LoginComponent, {
      imports: [
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    // Laisser le champ email vide et essayer de soumettre
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/password/i, { selector: 'input' }), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Vérifier que le message d'erreur s'affiche
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
  });
});