import { TestBed } from '@angular/core/testing';
import { AppModule } from './src/app/app.module';
import { AppComponent } from './src/app/app.component';  // Import d'un composant pour tester le module
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'; // Pour tester sans animations
import { expect } from '@jest/globals';

describe('AppModule', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppModule,  // Import du module principal de l'application
        RouterTestingModule,  // Pour simuler les routes dans les tests
        NoopAnimationsModule  // Pour les tests sans animations
      ],
      declarations: [AppComponent],  // Déclare un composant pour tester l'injection
    }).compileComponents();
  });

  it('devrait créer le module et le composant principal', () => {
    const app = TestBed.createComponent(AppComponent);
    expect(app).toBeTruthy();
  });

  it('devrait créer le module', () => {
    const appModule = TestBed.inject(AppModule);
    expect(appModule).toBeTruthy();
  });
});
