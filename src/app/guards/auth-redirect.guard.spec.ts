import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authRedirectGuard } from './auth-redirect.guard';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';

describe('authRedirectGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      currentUser$: of(null)
    });
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(authRedirectGuard).toBeTruthy();
  });
});
