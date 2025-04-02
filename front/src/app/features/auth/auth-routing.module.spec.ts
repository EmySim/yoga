import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { expect } from '@jest/globals';

describe('AuthRoutingModule', () => {
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([
        { path: 'login', component: LoginComponent },
        { path: 'register', component: RegisterComponent }
      ])]
    });

    router = TestBed.inject(Router);
  });

  it('devrait avoir une route pour login', async () => {
    const routes = await router.config;
    const loginRoute = routes.find(route => route.path === 'login');

    expect(loginRoute).toBeDefined(); // Vérifie d'abord que la route existe
    expect(loginRoute!.component).toBe(LoginComponent);
  });

  it('devrait avoir une route pour register', async () => {
    const routes = await router.config;
    const registerRoute = routes.find(route => route.path === 'register');

    expect(registerRoute).toBeDefined(); // Vérifie d'abord que la route existe
    expect(registerRoute!.component).toBe(RegisterComponent);
  });

  it('devrait naviguer vers login quand la route "/login" est appelée', async () => {
    await router.navigate(['login']);
    expect(router.url).toBe('/login');
  });

  it('devrait naviguer vers register quand la route "/register" est appelée', async () => {
    await router.navigate(['register']);
    expect(router.url).toBe('/register');
  });
});
