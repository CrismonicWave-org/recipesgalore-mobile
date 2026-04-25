import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

/**
 * Auth Guard - Protects routes from unauthorized access
 * 
 * Usage: Add to route definition
 * { path: 'profile', component: ProfilePage, canActivate: [authGuard] }
 */
export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      if (user) {
        // User is authenticated, allow access
        return true;
      } else {
        // User is not authenticated, redirect to login
        console.log('Auth Guard: User not authenticated, redirecting to /login');
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
