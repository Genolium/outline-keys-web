import { TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterOutlet, RouterModule } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { FooterComponent } from "./footer/footer.component";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private translate: TranslateService) {
  }

  title = 'app';
}

@NgModule({
    declarations: [AppComponent],
    providers: [HttpClient, RouterModule,
        { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
        JwtHelperService,
        provideRouter(routes),
        provideAnimations(),
        CommonModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        NoopAnimationsModule,
        HttpClientModule,
        BrowserModule,
        provideHttpClient(),
    ],
    bootstrap: [AppComponent],
    imports: [HttpClientModule, RouterModule, RouterOutlet, BrowserModule,
        RouterModule, TranslateModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            }
        }), FooterComponent]
})
export class AppModule {
  constructor(private translate: TranslateService) {
    translate.store.langs=["en", "ru"];
    translate.setDefaultLang("en");
    const cookieLang = document.cookie
      .split('; ')
      .find((cookie) => cookie.startsWith('lang='))
      ?.split('=')[1];
    if (cookieLang && translate.store.langs.includes(cookieLang)) {
      translate.use(cookieLang);
    }
  }

  title = 'app';
}
