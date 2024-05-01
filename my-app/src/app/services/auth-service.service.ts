import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public apiUrl = 'http://'+window.location.hostname+':5000/api';

  constructor(private http: HttpClient, public jwtHelper: JwtHelperService) {  }

  login(username: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, { username, password }).subscribe(
      (res: any) => {
        localStorage.setItem("access_token", res.access_token);
      }
    );
  }

  logout() {
    this.http.post(`${this.apiUrl}/logout`, this.getHeaders(), { headers: this.getHeaders() }).subscribe(
      () => {
        localStorage.removeItem('access_token');
        console.log('Logout successful');
      },
      error => {
        console.error('Logout failed', error);
      }
    );
  }

  getAccessToken() {
    return localStorage.getItem("access_token");
  }

  getHeaders(){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAccessToken()}`,
      'Content-Type': 'application/json'
    });
    return headers;
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    return !this.jwtHelper.isTokenExpired(token);
  }
}