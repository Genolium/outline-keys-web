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

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideAnimations(),
    CommonModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, 
    NoopAnimationsModule,
    HttpClientModule, 
    provideHttpClient()]
};