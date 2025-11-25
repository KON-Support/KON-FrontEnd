import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service'; 

export const RoleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const allowedRoles = route.data?.['roles'] as string[];
  
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  const hasAccess = authService.hasAnyRole(allowedRoles);

  if (!hasAccess) {
    authService.redirectBasedOnRole();
    return false;
  }

  return true;
};