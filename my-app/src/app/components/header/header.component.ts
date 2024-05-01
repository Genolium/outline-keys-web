import { Component } from '@angular/core';
import { CountryService } from '../../services/country-service.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgForOf } from '@angular/common';
@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
})
export class HeaderComponent {
  key: any = '';
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

  ngOnInit() {
    this.countryService.getLink().subscribe((key: any) => {
      this.key = key;
    });
  }
}