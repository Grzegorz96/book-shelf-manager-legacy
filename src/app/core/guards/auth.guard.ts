import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '@core/services';
import { take, map } from 'rxjs/operators';

/**
 * Guard that protects routes requiring authentication.
 * Redirects to /auth if user is not authenticated.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    take(1),
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return true;
      }
      return router.createUrlTree(['/auth']);
    })
  );
  // if (authService.isAuthenticated()) {
  //   return true;
  // }

  // return router.createUrlTree(['/auth']);
};
