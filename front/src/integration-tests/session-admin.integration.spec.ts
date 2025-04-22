import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import { ListComponent } from '../app/features/sessions/components/list/list.component';
import { FormComponent } from '../app/features/sessions/components/form/form.component';
import { DetailComponent } from '../app/features/sessions/components/detail/detail.component';
import { SessionApiService } from '../app/features/sessions/services/session-api.service';
import { SessionService } from '../app/services/session.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
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
];

const mockSessionApiService = {
  all: jest.fn(() => of(mockSessions)),
  create: jest.fn(() => of(mockSessions[0])),
  update: jest.fn(() => of(mockSessions[0])),
  delete: jest.fn(() => of({})),
  detail: jest.fn(() => of(mockSessions[0])),
  getTeachers: jest.fn(() => of([{ id: 101, name: 'Professeur Zen' }])),
};

const mockRouter = {
  navigate: jest.fn(),
  url: '/sessions/create',
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
          sessionInformation: { admin: true, id: 1, token: '' },
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

const renderForm = async (isUpdate = false) => {
  mockRouter.url = isUpdate ? '/sessions/update/1' : '/sessions/create';
  return render(FormComponent, {
    imports: [
      MatCardModule,
      MatIconModule,
      MatSnackBarModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatButtonModule,
      HttpClientModule,
    ],
    providers: [
      { provide: SessionApiService, useValue: mockSessionApiService },
      { provide: Router, useValue: mockRouter },
      { provide: SessionService, useValue: { sessionInformation: { admin: true } } },
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            paramMap: {
              get: () => (isUpdate ? '1' : null),
            },
          },
        },
      },
      FormBuilder,
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
          sessionInformation: { admin: true, id: 1, token: '' },
          isLogged: true,
          $isLogged: () => of(true),
        },
      },
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: { paramMap: { get: () => '1' } },
        },
      },
      FormBuilder,
    ],
  });
};

describe('ADMIN Session Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('affiche les boutons admin', async () => {
    await renderList();
    expect(screen.getByTestId('create-button')).toBeInTheDocument();
    expect(await screen.findAllByTestId('edit-button')).toHaveLength(mockSessions.length);
  });

  it('peut créer une session', async () => {
    await renderForm(false);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'New Session' } });
    fireEvent.click(screen.getByText('Save'));
    await waitFor(() => expect(mockSessionApiService.create).toHaveBeenCalled());
  });

  it('peut mettre à jour une session', async () => {
    await renderForm(true);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Updated Session' } });
    fireEvent.click(screen.getByText('Save'));
    await waitFor(() => expect(mockSessionApiService.update).toHaveBeenCalled());
  });

  it('peut supprimer une session', async () => {
    await renderDetail();
    fireEvent.click(screen.getByTestId('delete-button'));
    await waitFor(() => expect(mockSessionApiService.delete).toHaveBeenCalled());
  });
});
