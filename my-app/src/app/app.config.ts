import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { ApplicationConfig } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), HttpClientModule, provideHttpClient()]
};