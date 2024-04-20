import { Component, OnInit } from '@angular/core';
import { CountryService } from '../country-service.service';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  selector: 'app-country-list-component',
  templateUrl: './country-list-component.component.html',
  styleUrls: ['./country-list-component.component.scss']
})


export class CountryList implements OnInit {

  countries: any[] = [];

  constructor(private countryService: CountryService) { }

  ngOnInit() {
    this.countryService.getCountries().subscribe((countries: any[]) => {
      this.countries = countries;
    });
  }

}