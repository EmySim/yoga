import { render, screen, fireEvent } from '@testing-library/angular';
import { MeComponent } from '../components/me/me.component';
import { SessionService } from '../services/session.service';
import { UserService } from '../services/user.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card'; // Import MatCardModule
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import '@testing-library/jest-dom';

describe('MeComponent Integration Test', () => {
  const mockUser = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    admin: false, // Par défaut, un utilisateur standard
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-02')
  };

  const mockSessionService = {
    sessionInformation: {
      id: 1,
      admin: false
    },
    logOut: jest.fn()
  };

  const mockUserService = {
    getById: jest.fn().mockReturnValue(of(mockUser)),
    delete: jest.fn().mockReturnValue(of(null))
  };

  const mockRouter = {
    navigate: jest.fn()
  };

  const setup = async () => {
    await render(MeComponent, {
      imports: [
        MatSnackBarModule,
        MatCardModule, 
        MatIconModule  
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter }
      ]
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display "You are admin" for admin users and hide delete button', async () => {
    // Modifier l'utilisateur pour simuler un admin
    mockUser.admin = true;
    mockSessionService.sessionInformation.admin = true;

    await setup();

    // Vérifier que le texte "You are admin" est affiché
    expect(await screen.findByText(/You are admin/i)).toBeInTheDocument();

    // Vérifier que le bouton de suppression n'est pas visible
    const deleteButton = screen.queryByTestId('delete-button');
    expect(deleteButton).toBeNull();  // Le bouton de suppression ne doit pas être présent
  });

  it('should display delete button for regular users and hide "You are admin" text', async () => {
    // Modifier l'utilisateur pour simuler un utilisateur standard (non admin)
    mockUser.admin = false;
    mockSessionService.sessionInformation.admin = false;

    await setup();

    // Vérifier que le texte "You are admin" n'est pas affiché
    const adminText = screen.queryByText(/You are admin/i);
    expect(adminText).toBeNull();  // Le texte "You are admin" ne doit pas être présent

    // Vérifier que le bouton de suppression est visible
    const deleteButton = screen.getByTestId('delete-button');
    expect(deleteButton).toBeInTheDocument();  // Le bouton de suppression doit être visible
  });
});
