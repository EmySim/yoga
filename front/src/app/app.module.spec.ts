import { TestBed } from '@angular/core/testing';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { MeComponent } from './components/me/me.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect, describe, it } from '@jest/globals';

describe('AppModule', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule],
    }).compileComponents();
  });

  it('devrait créer le module sans erreur', () => {
    expect(AppModule).toBeDefined();
  });

  it('devrait déclarer les composants nécessaires', () => {
    const app = TestBed.createComponent(AppComponent).componentInstance;
    expect(app).toBeTruthy();

    const notFound = TestBed.createComponent(NotFoundComponent).componentInstance;
    expect(notFound).toBeTruthy();

    const me = TestBed.createComponent(MeComponent).componentInstance;
    expect(me).toBeTruthy();
  });

  it('devrait fournir JwtInterceptor', () => {
    const interceptors = TestBed.inject(HTTP_INTERCEPTORS);
    expect(interceptors.some(interceptor => interceptor instanceof JwtInterceptor)).toBeTruthy();
  });

  it('devrait inclure BrowserAnimationsModule', () => {
    const animations = TestBed.inject(BrowserAnimationsModule);
    expect(animations).toBeTruthy();
  });
});
