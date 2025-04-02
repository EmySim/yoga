import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { SessionApiService } from './session-api.service';
import { Session } from '../interfaces/session.interface';

describe('SessionApiService', () => {
  let service: SessionApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SessionApiService]
    });

    service = TestBed.inject(SessionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Vérifie qu'il n'y a pas de requêtes HTTP non gérées
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all sessions', () => {
    const mockSessions: Session[] = [
      { id: 1, name: 'Session 1', description: 'Desc 1', date: new Date('2025-04-01'), teacher_id: 101, users: [1, 2] },
      { id: 2, name: 'Session 2', description: 'Desc 2', date: new Date('2025-04-02'), teacher_id: 102, users: [3] }
    ];

    service.all().subscribe((sessions) => {
      expect(sessions.length).toBe(2);
      expect(sessions).toEqual(mockSessions);
    });

    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('GET');
    req.flush(mockSessions);
  });

  it('should retrieve session details', () => {
    const mockSession: Session = { id: 1, name: 'Session 1', description: 'Desc 1', date: new Date('2025-04-01'), teacher_id: 101, users: [1, 2] };

    service.detail('1').subscribe((session) => {
      expect(session).toEqual(mockSession);
    });

    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockSession);
  });

  it('should create a session', () => {
    const newSession: Session = { id: 3, name: 'Session 3', description: 'Desc 3', date: new Date('2025-04-03'), teacher_id: 103, users: [4] };

    service.create(newSession).subscribe((session) => {
      expect(session).toEqual(newSession);
    });

    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newSession);
    req.flush(newSession);
  });

  it('should update a session', () => {
    const updatedSession: Session = { id: 1, name: 'Updated Session', description: 'Updated Desc', date: new Date('2025-04-01'), teacher_id: 101, users: [1, 2] };

    service.update('1', updatedSession).subscribe((session) => {
      expect(session).toEqual(updatedSession);
    });

    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedSession);
    req.flush(updatedSession);
  });

  it('should delete a session', () => {
    service.delete('1').subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should participate in a session', () => {
    service.participate('1', 'user123').subscribe();

    const req = httpMock.expectOne('api/session/1/participate/user123');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBeNull();
    req.flush(null);
  });

  it('should unparticipate from a session', () => {
    service.unParticipate('1', 'user123').subscribe();

    const req = httpMock.expectOne('api/session/1/participate/user123');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});