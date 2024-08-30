import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { SessionService } from '../services/user/session/session.service';

export const authGuard: CanActivateFn = (route, state) => {
  const sessionService = inject(SessionService);
  if (sessionService.getTokenSession()) {
    console.log(
      'sessionService.getTokenSession() > ',
      sessionService.getTokenSession(),
    );

    return true;
  }
  return false;
};
