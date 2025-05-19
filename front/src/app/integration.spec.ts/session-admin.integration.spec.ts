import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import { ListComponent } from '../features/sessions/components/list/list.component';
import { FormComponent } from '../features/sessions/components/form/form.component';
import { DetailComponent } from '../features/sessions/components/detail/detail.component';
import { SessionApiService } from '../features/sessions/services/session-api.service';
import { SessionService } from '../services/session.service';
import { TeacherService } from '../services/teacher.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import '@testing-library/jest-dom';

// --- MOCKS GLOBAUX POUR SERVICES DEPENDANT DE HTTPCLIENT ---

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

const mockTeachers = [{ id: 101, firstName: 'Professeur', lastName: 'Zen' }];

// Mock complet de SessionApiService
const mockSessionApiService = {
  all: jest.fn(() => of(mockSessions)),
  create: jest.fn(() => of(mockSessions[0])),
  update: jest.fn(() => of(mockSessions[0])),
  delete: jest.fn(() => of(true)),
  detail: jest.fn(() => of(mockSessions[0])),
  getTeachers: jest.fn(() => of(mockTeachers)),
} as any;

// Mock TeacherService 
class MockTeacherService {
  getTeachers = jest.fn(() => of(mockTeachers));
  all = jest.fn(() => of(mockTeachers));
}

// Mock Router
const mockRouter = {
  navigate: jest.fn(),
  url: '/sessions/create',
};

// Mock SessionService
const mockSessionService: Partial<SessionService> = {
  sessionInformation: {
    admin: true,
    id: 1,
    token: '',
    type: 'admin',
    username: 'admin',
    firstName: 'Admin',
    lastName: 'User',
  },
  isLogged: true,
  $isLogged: () => of(true),
};

// ---------------------- FONCTIONS RENDER ----------------------

const renderList = async () =>
  render(ListComponent, {
    imports: [MatCardModule, MatIconModule, NoopAnimationsModule],
    providers: [
      { provide: SessionApiService, useValue: mockSessionApiService },
      { provide: SessionService, useValue: mockSessionService },
      { provide: Router, useValue: mockRouter },
      { provide: TeacherService, useClass: MockTeacherService },
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
      ReactiveFormsModule,
      NoopAnimationsModule,
    ],
    providers: [
      { provide: SessionApiService, useValue: mockSessionApiService },
      { provide: SessionService, useValue: mockSessionService },
      { provide: Router, useValue: mockRouter },
      { provide: TeacherService, useClass: MockTeacherService },
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
      MatSelectModule,
      ReactiveFormsModule,
      NoopAnimationsModule,
    ],
    providers: [
      { provide: SessionApiService, useValue: mockSessionApiService },
      { provide: SessionService, useValue: mockSessionService },
      { provide: Router, useValue: mockRouter },
      { provide: TeacherService, useClass: MockTeacherService },
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: { paramMap: { get: () => '1' } },
        },
      },
      { provide: FormBuilder, useFactory: () => new FormBuilder() },
    ],
  });

// ---------------------- TESTS ----------------------

describe('ADMIN - Intégration SessionComponent (List, Form, Detail)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('affiche les boutons admin', async () => {
    await renderList();
    expect(await screen.findByTestId('create-button')).toBeInTheDocument();
    expect(await screen.findAllByTestId('edit-button')).toHaveLength(mockSessions.length);
  });

  it('peut créer une session', async () => {
    const { fixture } = await renderForm(false);

    // Patch tous les champs requis directement
    fixture.componentInstance.sessionForm?.patchValue({
      name: 'New Session',
      date: '2025-05-20',
      description: 'Séance de test',
      teacher_id: mockTeachers[0].id,
    });
    fixture.componentInstance.sessionForm?.updateValueAndValidity();
    fixture.detectChanges();

    // Log pour debug
    console.log('Form valid:', fixture.componentInstance.sessionForm?.valid);
    console.log('Form value:', fixture.componentInstance.sessionForm?.value);

    const submitButton = await screen.findByTestId('submit-button');
    await fireEvent.click(submitButton);

    await waitFor(() => expect(mockSessionApiService.create).toHaveBeenCalled());
  });

  it('peut mettre à jour une session', async () => {
    const { fixture } = await renderForm(true);

    await fireEvent.change(await screen.findByTestId('name-input'), {
      target: { value: 'Updated Session' },
    });

    fixture.detectChanges();

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
