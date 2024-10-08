import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/user/session/session.service';

export const authGuard: CanActivateFn = (route, state) => {
  const sessionService = inject(SessionService);
  const router = inject(Router);
  if (sessionService.getTokenSession()) {
    // console.log(
    //   'sessionService.getTokenSession() > ',
    //   sessionService.getTokenSession(),
    // );
    return true;
  } else {
    router.navigate(['/auth/login']);
  }
  return false;
};
