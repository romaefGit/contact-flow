import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withViewTransitions,
} from '@angular/router';

import { routes } from './app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { ErrorResponseInterceptor } from './core/interceptors/error-response.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';

// https://webcode.tools/css-generator/keyframe-animation
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideHttpClient(withFetch(), withInterceptors([ErrorResponseInterceptor])),
    provideAnimations(),
    provideStore()
],
};
