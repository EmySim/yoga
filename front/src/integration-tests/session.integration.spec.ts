import { render, screen, fireEvent } from '@testing-library/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { ListComponent } from '../app/features/sessions/components/list/list.component';
import { SessionApiService } from '../app/features/sessions/services/session-api.service';
import { SessionService } from '../app/services/session.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { of } from 'rxjs';
import '@testing-library/jest-dom';
import { Location } from '@angular/common';
import { Component } from '@angular/core';

// Composant factice pour simuler la page de détail
@Component({
  template: '<p>Detail Page</p>',
})
class FakeDetailComponent {}

describe('Session Feature Integration Test', () => {
  const mockSessions = [
    {
      id: 1,
      name: 'Yoga Session',
      description: 'Relaxing yoga session',
      date: new Date('2025-04-15'),
      teacher_id: 101,
      users: [1, 2],
    },
    {
      id: 2,
      name: 'Pilates Session',
      description: 'Intense pilates session',
      date: new Date('2025-04-20'),
      teacher_id: 102,
      users: [3],
    },
  ];

  const mockSessionApiService = {
    all: jest.fn().mockReturnValue(of(mockSessions)),
  };

  const mockSessionService = {
    sessionInformation: { admin: true },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display the list of sessions', async () => {
    await render(ListComponent, {
      imports: [
        MatCardModule,
        MatIconModule,
        RouterTestingModule.withRoutes([]), // Pas de redirection ici
      ],
      providers: [
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: SessionService, useValue: mockSessionService },
      ],
    });

    // Vérification de l'affichage des sessions dans la liste
    expect(screen.getByText('Yoga Session')).toBeInTheDocument();
    expect(screen.getByText('Relaxing yoga session')).toBeInTheDocument();
    expect(screen.getByText('Pilates Session')).toBeInTheDocument();
    expect(screen.getByText('Intense pilates session')).toBeInTheDocument();
  });

  it('should navigate to the detail page when the "Detail" button is clicked', async () => {
    const { fixture } = await render(ListComponent, {
      imports: [
        MatCardModule,
        MatIconModule,
        RouterTestingModule.withRoutes([
          { path: '', redirectTo: '/sessions', pathMatch: 'full' },
          { path: 'sessions/detail/:id', component: FakeDetailComponent },
        ]),
      ],
      providers: [
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: SessionService, useValue: mockSessionService },
      ],
    });
  
    const location = fixture.debugElement.injector.get(Location);
  
    // Attendre que le bouton "Detail" soit rendu
    const detailButton = await screen.findByTestId('detail-button-1');
    expect(detailButton).toBeInTheDocument();
  
    // Simuler un clic sur le bouton "Detail"
    fireEvent.click(detailButton);
  
    // Déclencher la détection des changements
    fixture.detectChanges();
    await fixture.whenStable();
  
    // Vérifier que l'URL est correcte
    expect(location.path()).toBe('/sessions/detail/1');
  });

  it('should display the "Create" button for an admin', async () => {
    await render(ListComponent, {
      imports: [
        MatCardModule,
        MatIconModule,
        RouterTestingModule, // Le module Router est toujours inclus
      ],
      providers: [
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: SessionService, useValue: mockSessionService },
      ],
    });

    // Vérification que le bouton "Create" est présent pour un admin
    const createButton = screen.getByText('Create');
    expect(createButton).toBeInTheDocument();
  });
});
