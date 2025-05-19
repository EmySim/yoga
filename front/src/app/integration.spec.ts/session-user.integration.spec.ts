import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import { ListComponent } from '../features/sessions/components/list/list.component';
import { DetailComponent } from '../features/sessions/components/detail/detail.component';
import { SessionApiService } from '../features/sessions/services/session-api.service';
import { SessionService } from '../services/session.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import '@testing-library/jest-dom';

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
  all: jest.fn(() => of(mockSessions)),
  detail: jest.fn(() => of(mockSessions[0])),
  participate: jest.fn(() => of({})),
  unParticipate: jest.fn(() => of({})),
};

const mockRouter = {
  navigate: jest.fn(),
  get url() {
    return '/sessions';
  },
};

const renderList = async () => {
  return render(ListComponent, {
    imports: [MatCardModule, MatIconModule, HttpClientModule],
    providers: [
      { provide: SessionApiService, useValue: mockSessionApiService },
      { provide: Router, useValue: mockRouter },
      {
        provide: SessionService,
        useValue: {
          sessionInformation: { admin: false, id: 1, token: '' },
          isLogged: true,
          $isLogged: () => of(true),
        },
      },
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: { paramMap: { get: () => null } },
        },
      },
    ],
  });
};

const renderDetail = async () => {
  return render(DetailComponent, {
    imports: [
      MatCardModule,
      MatIconModule,
      MatSnackBarModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      HttpClientModule,
    ],
    providers: [
      { provide: SessionApiService, useValue: mockSessionApiService },
      { provide: Router, useValue: mockRouter },
      {
        provide: SessionService,
        useValue: {
          sessionInformation: { admin: false, id: 1, token: '' },
          isLogged: true,
          $isLogged: () => of(true),
        },
      },
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            paramMap: {
              get: () => '1',
            },
          },
        },
      },
      FormBuilder,
    ],
  });
};

describe('USER Session Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('ne montre pas les boutons admin pour un user', async () => {
    await renderList();
    expect(screen.queryByTestId('create-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('edit-button')).not.toBeInTheDocument();
    expect(await screen.findAllByTestId('detail-button')).toHaveLength(mockSessions.length);
  });

  it('peut participer à une session', async () => {
    mockSessionApiService.detail.mockReturnValueOnce(of({ ...mockSessions[0], users: [] }));
    await renderDetail();
    const participateButton = screen.getByTestId('participate-button');
    fireEvent.click(participateButton);
    await waitFor(() => expect(mockSessionApiService.participate).toHaveBeenCalled());
  });

  it('affiche un bouton "Do not participate" si déjà inscrit', async () => {
    await renderDetail();
    expect(screen.getByTestId('unparticipate-button')).toBeInTheDocument();
  });

  it('peut se désinscrire d\'une session', async () => {
    await renderDetail();
    fireEvent.click(screen.getByTestId('unparticipate-button'));
    await waitFor(() => expect(mockSessionApiService.unParticipate).toHaveBeenCalled());
  });
});
