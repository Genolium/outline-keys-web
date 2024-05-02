import { Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CountryService } from '../services/country-service.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslateModule],
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  lang: any = '';
  constructor(
    private countryService: CountryService,
    private translate: TranslateService
  ) {
    const cookieLang = document.cookie
      .split('; ')
      .find((cookie) => cookie.startsWith('lang='))
      ?.split('=')[1];
    this.lang = cookieLang;
  }
  changeLanguage(newLang: any) {
    this.lang = newLang;
    document.cookie = `lang=${this.lang}; path=/; Max-Age=31536000;`;
    window.location.reload();
  }
}
