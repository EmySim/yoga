import { render, screen, fireEvent } from '@testing-library/angular';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../../../services/session.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import '@testing-library/jest-dom';
import { AppRoutingModule } from '../../../../app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgZone } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

describe('LoginComponent Integration Test', () => {
  let ngZone: NgZone;
  let router: Router;

  beforeEach(async () => {
    await render(LoginComponent, {
      imports: [
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        RouterTestingModule // Adding RouterTestingModule
      ],
      providers: [AuthService, SessionService], // Removing NgZone from providers
    });

    ngZone = TestBed.inject(NgZone);
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate');
  });

  it('should display login form', async () => {
    // Run interaction within Angular zone
    ngZone.run(() => {
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('submit-button');

      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
    });
  });

  it('should login successfully with correct credentials', async () => {
    // Run interaction within Angular zone
    ngZone.run(() => {
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const form = screen.getByTestId('login-form');

      fireEvent.input(emailInput, { target: { value: 'SusanneLejeune@armyspy.com' } });
      fireEvent.input(passwordInput, { target: { value: 'xee9aiRoh' } });

      fireEvent.submit(form);
    });

    // Wait for the navigation to complete
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Verify the router navigation to /sessions
    expect(router.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  it('should fail login with incorrect credentials', async () => {
    // Run interaction within Angular zone
    ngZone.run(() => {
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const form = screen.getByTestId('login-form');

      fireEvent.input(emailInput, { target: { value: 'wronguser@example.com' } });
      fireEvent.input(passwordInput, { target: { value: 'wrongpassword' } });

      fireEvent.submit(form);
    });

    // Verify the error message is displayed
    const errorMessage = await screen.findByText(/An error occurred/i);
    expect(errorMessage).toBeInTheDocument();
  });
});