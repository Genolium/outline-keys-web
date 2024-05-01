import { Component } from '@angular/core';
import { CountryService } from '../../services/country-service.service';
import { NgForOf, NgIf } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    TranslateModule,
    HeaderComponent,
    NgForOf,
    NgIf
  ],
  selector: 'app-keys-list-component',
  templateUrl: './keys-list-component.component.html',
  styleUrls: ['./keys-list-component.component.scss']
})
export class KeysList {
  
  keys: any[] = [];

  constructor(private countryService: CountryService) { }

  pageSize = 5;
  totalPages = 1;
  currentPage = 1;
  
  changePage(page: number) {
    this.currentPage = page;
  }

  getTime(a: Date): any[] {
    const input = new Date(a);
    const now = new Date();
    const timeDiffMinutes = Math.floor(
      (now.getTime() - input.getTime()) / 60000
    );
    const timeDiffHours = Math.floor(timeDiffMinutes / 60);
    const timeDiffDays = Math.floor(timeDiffHours / 24);
    const timeDiffMonths = Math.floor(timeDiffDays / 30);

    let timeTranslationKey;
    if (timeDiffMinutes < 60) {
      timeTranslationKey = 'time.minutes';
      return [timeDiffMinutes, timeTranslationKey];
    } else if (timeDiffHours < 24) {
      timeTranslationKey = 'time.hours';
      return [timeDiffHours,timeTranslationKey];
    } else if (timeDiffDays < 30) {
      timeTranslationKey = 'time.days';
      return [timeDiffDays,timeTranslationKey];
    } else {
      timeTranslationKey = 'time.months';
      return [timeDiffMonths,timeTranslationKey];
    };    
  }

  getPageNumbers(): number[] {
    const pageNumbers: number[] = [];
    this.totalPages = Math.ceil(this.keys.length / this.pageSize);
    for (let i = 1; i <= this.totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  }

  getStartIndex(): number {
    return Math.max(0, this.currentPage - 2);
  }
  
  getEndIndex(): number {
    return Math.min(this.currentPage+2, this.keys.length);
  }

  ngOnInit() {
    this.countryService.getKeys().subscribe((keys: any[]) => {
      this.keys = keys;
    });
  }
}
