import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

/**
 * Auth Redirect Guard - Routes users based on authentication state
 * 
 * - Authenticated users → /tabs/recipes
 * - Unauthenticated users → /login
 * 
 * Usage: Add to root route
 * { path: '', canActivate: [authRedirectGuard] }
 */
export const authRedirectGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      if (user) {
        // User is authenticated, go to main app
        console.log('Auth Redirect: User authenticated, redirecting to /tabs/recipes');
        router.navigate(['/tabs/recipes']);
        return false;
      } else {
        // User is not authenticated, go to login
        console.log('Auth Redirect: User not authenticated, redirecting to /login');
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
