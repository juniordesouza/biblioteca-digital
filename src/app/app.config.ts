import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideBrowserGlobalErrorListeners } from '@angular/core';

import { LucideAngularModule, User, Book, BarChart3, List, Plus, CheckCircle } from 'lucide-angular';
import { AuthInterceptor } from './auth.interceptor';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),

    provideRouter(routes),

    // ✅ Agora com withInterceptors IMPORTADO corretamente
    provideHttpClient(
      withInterceptors([
        AuthInterceptor
      ])
    ),

    importProvidersFrom(
      LucideAngularModule.pick({
        User,
        Book,
        BarChart3,
        List,
        Plus,
        CheckCircle
      })
    ),
  ],
};
