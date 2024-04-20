import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';

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

  createCountry(data: any) {
    return this.http.post('http://localhost:5000/api/countries', data);
  }

  updateCountry(id: number, data: any) {    
    const url = `http://localhost:5000/api/countries/${id}`;
    return this.http.put(url, data);
  }

  deleteCountry(id: number) {
    const url = `http://localhost:5000/api/countries/${id}`;
    return this.http.delete(url);
  }

  createKey(data: any) {
    return this.http.post('http://localhost:5000/api/keys', data);
  }

  updateKey(id: number, data: any) {
    const url = `http://localhost:5000/api/keys/${id}`;
    return this.http.put(url, data);
  }

  deleteKey(id: number) {
    const url = `http://localhost:5000/api/keys/${id}`;
    return this.http.delete(url);
  }
}