import { render, screen, fireEvent } from '@testing-library/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { ListComponent } from '../app/features/sessions/components/list/list.component';
import { SessionApiService } from '../app/features/sessions/services/session-api.service';
import { SessionService } from '../app/services/session.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { of } from 'rxjs';
import '@testing-library/jest-dom';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import userEvent from '@testing-library/user-event';

@Component({ template: '<p>Detail Page</p>' })
class FakeDetailComponent {}

@Component({ template: '<p>Fake Create Page</p>' })
class FakeCreateComponent {}

@Component({ template: '<p>Fake Edit Page</p>' })
class FakeEditComponent {}

@Component({
  selector: 'app-test-wrapper',
  template: '<router-outlet></router-outlet><app-list></app-list>',
})
class TestWrapperComponent {}

describe('Session Feature Integration Test', () => {
  const mockSessions = [
    {
      id: 1,
      name: 'Yoga Session',
      description: 'Relaxing yoga session',
      date: new Date('2025-04-15'),
      teacher_id: 101,
      users: [1, 2],
    },
    {
      id: 2,
      name: 'Pilates Session',
      description: 'Intense pilates session',
      date: new Date('2025-04-20'),
      teacher_id: 102,
      users: [3],
    },
  ];

  const mockSessionApiService = {
    all: jest.fn().mockReturnValue(of(mockSessions)),
  };

  const renderWithProviders = async ({
    isAdmin = false,
    component = ListComponent,
    wrapper = false,
    routes = [],
  }: {
    isAdmin?: boolean;
    component?: any;
    wrapper?: boolean;
    routes?: any[];
  }) => {
    const declarations = wrapper ? [TestWrapperComponent] : [component];

    return await render(wrapper ? TestWrapperComponent : component, {
      declarations,
      imports: [
        MatCardModule,
        MatIconModule,
        RouterTestingModule.withRoutes(routes),
      ],
      providers: [
        { provide: SessionApiService, useValue: mockSessionApiService },
        {
          provide: SessionService,
          useValue: { sessionInformation: { admin: isAdmin } },
        },
      ],
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('USER Tests', () => {
    it('should display the list of sessions for a user', async () => {
      await renderWithProviders({ isAdmin: false });

      expect(screen.getByText('Yoga Session')).toBeInTheDocument();
      expect(screen.getByText('Relaxing yoga session')).toBeInTheDocument();
      expect(screen.getByText('Pilates Session')).toBeInTheDocument();
      expect(screen.getByText('Intense pilates session')).toBeInTheDocument();
    });

    it('should navigate to the detail page when the "Detail" button is clicked by a user', async () => {
      const { fixture } = await renderWithProviders({
        isAdmin: false,
        wrapper: true,
        routes: [
          { path: '', redirectTo: '/sessions', pathMatch: 'full' },
          { path: 'sessions/detail/:id', component: FakeDetailComponent },
        ],
      });

      const location = TestBed.inject(Location);
      const detailButtons = screen.getAllByTestId('detail-button');

      expect(detailButtons[0]).toBeInTheDocument();

      await userEvent.click(detailButtons[0]);
      await fixture.whenStable();

      expect(location.path()).toBe('/sessions/detail/1');
    });

    it('should not display the "Create" button for a non-admin user', async () => {
      await renderWithProviders({ isAdmin: false });

      const createButton = screen.queryByText('Create');
      expect(createButton).not.toBeInTheDocument();
    });
  });

  describe('ADMIN Tests', () => {
    it('should display the "Create" button for an admin', async () => {
      const { fixture } = await renderWithProviders({
        isAdmin: true,
        wrapper: true,
        routes: [
          { path: 'sessions/create', component: FakeCreateComponent },
        ],
      });

      const createButton = screen.getByText('Create');
      expect(createButton).toBeInTheDocument();

      const location = TestBed.inject(Location);
      fireEvent.click(createButton);
      await fixture.whenStable();

      expect(location.path()).toBe('/sessions/create');
    });

    it('should navigate to the detail page when the "Detail" button is clicked by an admin', async () => {
      const { fixture } = await renderWithProviders({
        isAdmin: true,
        wrapper: true,
        routes: [
          { path: 'sessions/detail/:id', component: FakeDetailComponent },
        ],
      });

      const location = TestBed.inject(Location);
      const detailButtons = screen.getAllByTestId('detail-button');
      fireEvent.click(detailButtons[0]);
      await fixture.whenStable();

      expect(location.path()).toBe('/sessions/detail/1');
    });

    it('should display the "Edit" button for an admin', async () => {
      await renderWithProviders({ isAdmin: true });

      const editButtons = await screen.findAllByTestId('edit-button');
      expect(editButtons.length).toBe(2);
    });

    it('should navigate to the edit page when "Edit" button is clicked by an admin', async () => {
      const { fixture } = await renderWithProviders({
        isAdmin: true,
        wrapper: true,
        routes: [
          { path: 'sessions/update/:id', component: FakeEditComponent },
        ],
      });

      const location = TestBed.inject(Location);
      const editButtons = screen.getAllByTestId('edit-button');
      fireEvent.click(editButtons[0]);
      await fixture.whenStable();

      expect(location.path()).toBe('/sessions/update/1');
    });
  });
});