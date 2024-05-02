import { Component } from '@angular/core';
import { CountryService } from '../../services/country-service.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CommonModule, NgForOf } from '@angular/common';
@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [TranslateModule, CommonModule],
})
export class HeaderComponent {
  key: any = '';

  constructor(
    private countryService: CountryService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.countryService.getLink().subscribe((key: any) => {
      this.key = key;
    });
  }
}
