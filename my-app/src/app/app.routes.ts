import { Routes } from '@angular/router';
import { KeyComponent } from './key/key.component';
import { HomeComponent } from './home/home.component';
import { CountryComponent } from './country/country.component';
import { AdminComponent } from './admin-panel/admin-panel.component';

export const routes: Routes = [
    { path: 'admin', component: AdminComponent },
    { path: 'key/:id', component: KeyComponent },
    { path: 'country/:id', component: CountryComponent },
    { path: '', component: HomeComponent },  // Default route
    { path: '**', component: HomeComponent },  // Wildcard route for a 404 page
];
