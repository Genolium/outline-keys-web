import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import {NoopAnimationsModule } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { ApplicationConfig } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { JwtHelperService, JWT_OPTIONS  } from '@auth0/angular-jwt';

export function jwtOptionsFactory() {
  return {
    tokenGetter: () => localStorage.getItem('access_token'),
    allowedDomains: [window.location.hostname],
    disallowedRoutes: []
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    provideRouter(routes),    
    provideAnimations(),
    CommonModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, 
    NoopAnimationsModule,
    HttpClientModule, 
    provideHttpClient()]
};