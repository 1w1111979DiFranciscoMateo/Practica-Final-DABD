import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

export const loginGuard: CanActivateFn = (route, state) => {
  //Injects
  const loginService = inject(LoginService);
  const router = inject(Router);

  if(loginService.user?.id == null || loginService.user?.id == ''){
    alert("Necesario Logearse!");
    return router.parseUrl('');
  }

  return true;
};
