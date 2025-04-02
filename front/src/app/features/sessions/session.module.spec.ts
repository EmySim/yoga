import { TestBed } from '@angular/core/testing';
import { SessionsModule } from './sessions.module';
import { RouterTestingModule } from '@angular/router/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './components/form/form.component';
import { TeacherService } from '../../services/teacher.service';
import { SessionApiService } from './services/session-api.service';
import { expect } from '@jest/globals';
import { of } from 'rxjs';

// Mock du service TeacherService
class MockTeacherService {
    // Ajouter la méthode all() comme dans la vraie implémentation
    all() {
      return of([]); // Retourne un observable avec une liste vide d'enseignants
    }
  }

// Mock du service SessionApiService
class MockSessionApiService {
  getSessions() {
    return of([]); // Retourne une liste vide de sessions
  }

  createSession(session: any) {
    return of(session); // Simule la création d'une session
  }
}

describe('SessionsModule', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SessionsModule,
        RouterTestingModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatSnackBarModule,
        FlexLayoutModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: SessionApiService, useClass: MockSessionApiService },
        { provide: TeacherService, useClass: MockTeacherService } // Mock du service TeacherService
      ]
    }).compileComponents();
  });

  it('devrait déclarer FormComponent', () => {
    const formComponent = TestBed.createComponent(FormComponent);
    expect(formComponent).toBeTruthy();
  });
});
