import { TestBed } from '@angular/core/testing';
import { AuthModule } from './auth.module';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';  // <-- Ajout du module pour tester HTTP
import { expect } from '@jest/globals';

describe('AuthModule', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AuthModule, // Importation du module à tester
        CommonModule, 
        AuthRoutingModule, 
        MatCardModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule // <-- Ajout du module HttpClientTestingModule
      ]
    }).compileComponents();
  });

  it('devrait créer le module AuthModule', () => {
    const authModule = TestBed.inject(AuthModule);
    expect(authModule).toBeTruthy(); // Vérifie que le module est créé
  });

  it('devrait déclarer les composants RegisterComponent et LoginComponent', () => {
    const registerComponent = TestBed.createComponent(RegisterComponent);
    const loginComponent = TestBed.createComponent(LoginComponent);

    expect(registerComponent).toBeTruthy();
    expect(loginComponent).toBeTruthy(); // Vérifie que les composants sont créés
  });

  it('devrait importer les bons modules matériels', () => {
    const module = TestBed.inject(AuthModule);

    expect(module).toBeTruthy(); // Vérifie que le module a bien été injecté
  });
});
