import { Component, OnInit, Input } from '@angular/core';
import { CountryService } from '../country-service.service';
import { NgForOf } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    NgForOf
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

  getTime(a: Date): string {
    const input = new Date(a);
    const now = new Date();
    const timeDiffMinutes = Math.floor((now.getTime() - input.getTime()) / 60000);
    const timeDiffHours = Math.floor(timeDiffMinutes / 60);
    const timeDiffDays = Math.floor(timeDiffHours / 24);
    const timeDiffMonths = Math.floor(timeDiffDays / 30);

    if (timeDiffMinutes < 60) {
      return `${timeDiffMinutes} мин. назад`;
    } else if (timeDiffHours < 24) {
      return `${timeDiffHours} ч. назад`;
    } else if (timeDiffDays < 30) {
      return `${timeDiffDays} дней назад`;
    } else{
      return `${timeDiffMonths} мес. назад`;
    }
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
