import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth-service.service';
import { catchError, tap, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

const API_URL = 'http://'+(window as any).location.hostname+':5000';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor( public authService: AuthService, private http: HttpClient, private translate: TranslateService) { }

  getCountries() {
    console.log(this.translate);
    const url = `${API_URL}/api_open/countries?lng=${this.translate.store.currentLang}`;
    return this.http.get<any[]>(url);
  }

  getLink() {
    const url = `${API_URL}/api_open/link`;
    return this.http.get<any>(url);
  }

  changeLink(data: any) {
    const url = `${API_URL}/api/link`;
    const headers = this.authService.getHeaders();
    return this.http.put(url, data, { headers });
  }
  
  getKeys() {
    const url = `${API_URL}/api_open/keys?lng=${this.translate.store.currentLang}`;
    return this.http.get<any[]>(url);
  }

  getKeysById(key: number) {
    const url = `${API_URL}/api_open/key/${key}?lng=${this.translate.store.currentLang}`;
    return this.http.get<any[]>(url);
  }

  getCountriesById(country: number) {
    const url = `${API_URL}/api_open/country/${country}?lng=${this.translate.store.currentLang}`;
    return this.http.get<any[]>(url);
  }
  

  createCountry(data: any) {
    const url = `${API_URL}/api/countries`;
    const headers = this.authService.getHeaders();
    return this.http.post(url, data, { headers });
  }

  updateCountry(id: number, data: any) {    
    const url = `${API_URL}/api/countries/${id}`;
    const headers = this.authService.getHeaders();
    return this.http.put(url, data, { headers });
  }

  deleteCountry(id: number) {
    const url = `${API_URL}/api/countries/${id}`;
    const headers = this.authService.getHeaders();
    return this.http.delete(url, { headers });
  }

  createKey(data: any) {
    const url = `${API_URL}/api/keys`;
    const headers = this.authService.getHeaders();
    return this.http.post(url, data, { headers });
  }

  updateKey(id: number, data: any) {
    const url = `${API_URL}/api/keys/${id}`;
    const headers = this.authService.getHeaders();
    return this.http.put(url, data, { headers });
  }

  deleteKey(id: number) {
    const url = `${API_URL}/api/keys/${id}`;
    const headers = this.authService.getHeaders();
    return this.http.delete(url, { headers });
  }

  getAllPosts(){
    return this.http.get<any[]>(`${API_URL}/api_open/posts`);
  }

  createPost(post: any) {
    const headers = this.authService.getHeaders();
    return this.http.post<any>(`${API_URL}/api/posts`, post, { headers });
  }

  getPost(postId: number) {
    return this.http.get<any>(`${API_URL}/api_open/posts/${postId}`);
  }

  updatePost(postId: number, post: any) {
    const headers = this.authService.getHeaders();
    return this.http.put<any>(`${API_URL}/api/posts/${postId}`, post, { headers });
  }

  deletePost(postId: number) {
    const headers = this.authService.getHeaders();
    return this.http.delete<any>(`${API_URL}/api/posts/${postId}`, { headers });
  }
}
