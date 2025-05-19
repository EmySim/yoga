import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import { ListComponent } from '../features/sessions/components/list/list.component';
import { FormComponent } from '../features/sessions/components/form/form.component';
import { DetailComponent } from '../features/sessions/components/detail/detail.component';
import { SessionApiService } from '../features/sessions/services/session-api.service';
import { SessionService } from '../services/session.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
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
  delete: jest.fn(() => of(true)),
  detail: jest.fn(() => of(mockSessions[0])),
  getTeachers: jest.fn(() =>
    of([{ id: 101, firstName: 'Professeur', lastName: 'Zen' }])
  ),
};

const mockRouter = {
  navigate: jest.fn(),
  url: '/sessions/create',
};

const renderList = async () =>
  render(ListComponent, {
    imports: [MatCardModule, MatIconModule, HttpClientModule],
    providers: [
      { provide: SessionApiService, useValue: mockSessionApiService },
      { provide: Router, useValue: mockRouter },
      {
        provide: SessionService,
        useValue: {
          sessionInformation: { admin: true, id: 1, token: '' },
          isLogged: true,
          $isLogged: of(true),
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
      ReactiveFormsModule,
    ],
    providers: [
      { provide: SessionApiService, useValue: mockSessionApiService },
      { provide: Router, useValue: mockRouter },
      {
        provide: SessionService,
        useValue: {
          sessionInformation: { admin: true },
          isLogged: true,
          $isLogged: of(true),
        },
      },
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
      { provide: FormBuilder, useFactory: () => new FormBuilder() },
    ],
  });
};

const renderDetail = async () =>
  render(DetailComponent, {
    imports: [
      MatCardModule,
      MatIconModule,
      MatSnackBarModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      HttpClientModule,
      MatSelectModule,
      ReactiveFormsModule,
    ],
    providers: [
      { provide: SessionApiService, useValue: mockSessionApiService },
      { provide: Router, useValue: mockRouter },
      {
        provide: SessionService,
        useValue: {
          sessionInformation: { admin: true, id: 1, token: '' },
          isLogged: true,
          $isLogged: of(true),
        },
      },
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: { paramMap: { get: () => '1' } },
        },
      },
      { provide: FormBuilder, useFactory: () => new FormBuilder() },
    ],
  });

describe('ADMIN - Intégration SessionComponent (List, Form, Detail)', () => {
  beforeAll(() => {
    if (typeof window.fetch !== 'function') {
      window.fetch = () => Promise.reject(new Error('fetch is disabled in tests')) as any;
    }
    jest.spyOn(window, 'fetch').mockImplementation(() =>
      Promise.reject(new Error('fetch is disabled in tests'))
    );

    jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('affiche les boutons admin', async () => {
    await renderList();

    expect(await screen.findByTestId('create-button')).toBeInTheDocument();
    expect(await screen.findAllByTestId('edit-button')).toHaveLength(mockSessions.length);
  });

  it('peut créer une session', async () => {
    await renderForm(false);

    await fireEvent.change(await screen.findByTestId('name-input'), {
      target: { value: 'New Session' },
    });
    await fireEvent.change(await screen.findByTestId('date-input'), {
      target: { value: '2025-05-20' },
    });
    await fireEvent.change(await screen.findByTestId('description-input'), {
      target: { value: 'Séance de test' },
    });

    const teacherSelect = await screen.findByTestId('teacher-select');
    await fireEvent.mouseDown(teacherSelect);

    const teacherOption = await screen.findByText('Professeur Zen');


    await fireEvent.click(teacherOption);

    const saveButton = await screen.findByTestId('submit-button');
    await fireEvent.click(saveButton);

    await waitFor(() => expect(mockSessionApiService.create).toHaveBeenCalled());
  });

  it('peut mettre à jour une session', async () => {
    await renderForm(true);

    await fireEvent.change(await screen.findByTestId('name-input'), {
      target: { value: 'Updated Session' },
    });

    const saveButton = await screen.findByTestId('submit-button');
    await fireEvent.click(saveButton);

    await waitFor(() => expect(mockSessionApiService.update).toHaveBeenCalled());
  });

  it('peut supprimer une session', async () => {
    await renderDetail();

    const deleteBtn = await screen.findByTestId('delete-button');
    await fireEvent.click(deleteBtn);

    await waitFor(() => expect(mockSessionApiService.delete).toHaveBeenCalled());
  });
});
