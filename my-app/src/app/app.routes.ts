import { Routes } from '@angular/router';
import { KeyComponent } from './pages/key/key.component';
import { HomeComponent } from './pages/home/home.component';
import { CountryComponent } from './pages/country/country.component';
import { AdminComponent } from './pages/admin-panel/admin-panel.component';
import { BlogListComponent } from './pages/blog-list/blog-list.component';
import { BlogPageComponent } from './pages/blog-page/blog-page.component';

export const routes: Routes = [
    { path: 'admin', component: AdminComponent },
    { path: 'blog', component: BlogListComponent },
    { path: 'blog/:id', component: BlogPageComponent },
    { path: 'key/:id', component: KeyComponent },
    { path: 'country/:id', component: CountryComponent },
    { path: '', component: HomeComponent },  // Default route
    { path: '**', component: HomeComponent },  // Wildcard route for a 404 page
];
