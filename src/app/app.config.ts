import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { LucideAngularModule, User, Book, BarChart3, List, Plus, CheckCircle } from 'lucide-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    // ✅ Corrigido: configuração global dos ícones de forma compatível
    importProvidersFrom(
      LucideAngularModule.pick({ User, Book, BarChart3, List, Plus, CheckCircle })
    ),
  ],
};
