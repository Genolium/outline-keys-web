import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(private http: HttpClient) { }

  getCountries() {
    return this.http.get<any[]>('http://localhost:5000/api/countries');
  }
  
  getKeys() {
    return this.http.get<any[]>('http://localhost:5000/api/keys');
  }

  getKeysById(key: number) {
    const url = `http://localhost:5000/api/key/${key}`;
    return this.http.get<any[]>(url);
  }

  getCountriesById(country: number) {
    const url = `http://localhost:5000/api/country/${country}`;
    return this.http.get<any[]>(url);
  }
}
