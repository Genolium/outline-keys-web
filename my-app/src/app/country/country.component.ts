import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, switchMap } from 'rxjs/operators';
import { CountryService } from '../country-service.service';
import { NgForOf, NgIf } from '@angular/common';

import { CountryList } from '../country-list-component/country-list-component.component';

@Component({
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent {
  key: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private countryService: CountryService
  ) {
    this.route.params
      .pipe(
        map((params) => params['id']),
        filter((id) => !!id),
        map((id) => parseInt(id, 10)),
        switchMap((id) => this.countryService.getCountriesById(id))
      )
      .subscribe((key: any[]) => {
        this.key = key;
      });
  }

  getTime(a: Date): string {
    const input = new Date(a);
    const now = new Date();
    const timeDiffMinutes = Math.floor(
      (now.getTime() - input.getTime()) / 60000
    );
    const timeDiffHours = Math.floor(timeDiffMinutes / 60);
    const timeDiffDays = Math.floor(timeDiffHours / 24);
    const timeDiffMonths = Math.floor(timeDiffDays / 30);

    if (timeDiffMinutes < 60) {
      return `${timeDiffMinutes} мин. назад`;
    } else if (timeDiffHours < 24) {
      return `${timeDiffHours} ч. назад`;
    } else if (timeDiffDays < 30) {
      return `${timeDiffDays} д. назад`;
    } else {
      return `${timeDiffMonths} мес. назад`;
    }
  }
}
