import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule, } from '@angular/router/testing';
import { expect } from '@jest/globals'; 
import { SessionService } from '../../../../services/session.service';
import { of } from 'rxjs';
import { DetailComponent } from './detail.component';
import { SessionApiService } from '../../services/session-api.service';
import { TeacherService } from '../../../../services/teacher.service';
import { Session } from '../../interfaces/session.interface';
import { Teacher } from '../../../../interfaces/teacher.interface';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>; 
  let sessionService: SessionService;
  let sessionApiService: SessionApiService;
  let teacherService: TeacherService;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    }
  }

  const mockSessionApiService = {
    detail: jest.fn().mockReturnValue(of({
      id: 1,
      name: 'Test Session',
      date: new Date(),
      teacher_id: 1,
      description: 'Test Description',
      users: [1, 2, 3]
    } as Session)),
    participate: jest.fn().mockReturnValue(of(void 0)),
    unParticipate: jest.fn().mockReturnValue(of(void 0)),
    delete: jest.fn().mockReturnValue(of(void 0))
  }

  const mockTeacherService = {
    detail: jest.fn().mockReturnValue(of({
      id: 1,
      firstName: 'John',
      lastName: 'Doe'
    } as Teacher))
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule
      ],
      declarations: [DetailComponent], 
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService }
      ],
    })
      .compileComponents();
      sessionService = TestBed.inject(SessionService);
      sessionApiService = TestBed.inject(SessionApiService);
      teacherService = TestBed.inject(TeacherService);
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component and fetch session data', () => {
    component.ngOnInit();
    expect(sessionApiService.detail).toHaveBeenCalledWith('1');
    expect(teacherService.detail).toHaveBeenCalledWith('1');
    expect(component.session).toEqual({
      id: 1,
      name: 'Test Session',
      date: new Date(),
      teacher_id: 1,
      description: 'Test Description',
      users: [1, 2, 3]
    } as Session);
    expect(component.teacher).toEqual({
      id: 1,
      firstName: 'John',
      lastName: 'Doe'
    } as Teacher);
  });

  it('should handle user participation', () => {
    component.participate();
    expect(sessionApiService.participate).toHaveBeenCalledWith('1', '1');
    component.unParticipate();
    expect(sessionApiService.unParticipate).toHaveBeenCalledWith('1', '1');
  });

  it('should handle session deletion', () => {
    const navigateSpy = jest.spyOn(component['router'], 'navigate');
    component.sessionId = '1'; // Ensure sessionId is set
    component.delete();
    expect(sessionApiService.delete).toHaveBeenCalledWith('1');
    expect(navigateSpy).toHaveBeenCalledWith(['sessions']);
  });

  it('should display a snackbar message on session deletion', () => {
    const snackBarSpy = jest.spyOn(component['matSnackBar'], 'open');
    component.sessionId = '1'; // Ensure sessionId is set
    component.delete();
    expect(snackBarSpy).toHaveBeenCalledWith('Session deleted !', 'Close', { duration: 3000 });
  });

  it('should navigate back when back() is called', () => {
    const historySpy = jest.spyOn(window.history, 'back');
    component.back();
    expect(historySpy).toHaveBeenCalled();
  });

  it('should set isParticipate to true if user is participating', () => {
    component.session = {
      id: 1,
      name: 'Test Session',
      date: new Date(),
      teacher_id: 1,
      description: 'Test Description',
      users: [1, 2, 3]
    } as Session;
    component.fetchSession();
    expect(component.isParticipate).toBeTruthy();
  });

  it('should set isParticipate to false if user is not participating', () => {
    component.session = {
      id: 1,
      name: 'Test Session',
      date: new Date(),
      teacher_id: 1,
      description: 'Test Description',
      users: [2, 3]
    } as Session;
    component.fetchSession();
    expect(component.isParticipate).toBeFalsy();
  });
});