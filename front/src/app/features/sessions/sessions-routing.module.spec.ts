import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SessionsRoutingModule } from './sessions-routing.module';
import { ListComponent } from './components/list/list.component';
import { FormComponent } from './components/form/form.component';
import { DetailComponent } from './components/detail/detail.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { expect } from '@jest/globals';

describe('SessionsRoutingModule', () => {
  let router: Router;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: '', title: 'Sessions', component: ListComponent },
          {
            path: 'detail/:id',
            title: 'Sessions - detail',
            component: DetailComponent,
          },
          {
            path: 'create',
            title: 'Sessions - create',
            component: FormComponent,
          },
          {
            path: 'update/:id',
            title: 'Sessions - update',
            component: FormComponent,
          },
        ]),
        SessionsRoutingModule,
      ],
      declarations: [ListComponent, FormComponent, DetailComponent],
    });

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('devrait naviguer vers "detail/:id"', async () => {
    await router.navigate(['/detail/1']);
    expect(location.path()).toBe('/detail/1');
  });

  it('devrait naviguer vers "create"', async () => {
    await router.navigate(['/create']);
    expect(location.path()).toBe('/create');
  });

  it('devrait naviguer vers "update/:id"', async () => {
    await router.navigate(['/update/1']);
    expect(location.path()).toBe('/update/1');
  });

  it('devrait naviguer vers la route par défaut "/"', async () => {
    await router.navigate(['']);
    expect(location.path()).toBe('/');
  });
});
