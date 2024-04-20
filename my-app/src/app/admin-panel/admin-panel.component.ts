import { Component, OnInit } from '@angular/core';
import { CountryService } from '../country-service.service';
import { CommonModule, NgForOf } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-admin-panel',
  imports: [
    CommonModule,
    NgForOf,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatCardModule,
  ],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
})
export class AdminComponent implements OnInit {
  isLoggedIn = false;

  keyForm!: FormGroup;
  countryForm!: FormGroup;
  editCountryForm!: FormGroup;
  editKeyForm!: FormGroup;
  loginForm!: FormGroup;

  newCountryCode = 'flag-icon-ru';
  ECode = '';

  countries: any[] = [];
  keys: any[] = [];

  constructor(
    private countryService: CountryService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    const cookieValue = this.getCookie('admin_session');
    if (cookieValue) {
      this.isLoggedIn = true;
    }

    this.loginForm = this.fb.group({
      login: '',
      password: ''
    })

    this.keyForm = this.fb.group({
      key: '',
      country: '',
    });
    this.countryForm = this.fb.group({
      name: '',
      code: 'ru',
    });
    this.editKeyForm = this.fb.group({
      id: '',
      key: '',
      country: '',
    });
    this.editCountryForm = this.fb.group({
      id: '',
      name: '',
      code: '',
    });
    
    this.countryForm.get('code')?.valueChanges.subscribe((val) => {
      this.newCountryCode = 'flag-icon-' + val;
    });

    this.editCountryForm.get("code")?.valueChanges.subscribe((value) => {
      this.ECode = 'flag-icon-' + value;
    });

    this.getCountries();
    this.getKeys();
  }

  logout() {
    this.isLoggedIn = false;
    this.setCookie('admin_session', '', -1);
  }


  onLoginSubmit() {
    const login = this.loginForm.get('login')?.value;
    const password = this.loginForm.get('password')?.value;

    if (login === 'admin' && password === 'admin') {
      this.isLoggedIn = true;
      this.setCookie('admin_session', 'admin', 1);
    }
  }

  private setCookie(name: string, value: string, days: number) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  }

  private getCookie(name: string) {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1, cookie.length);
      }
      if (cookie.indexOf(nameEQ) === 0) {
        return cookie.substring(nameEQ.length, cookie.length);
      }
    }
    return null;
  }

  changeSelectedCountry(countryData: any) {
    this.editCountryForm = this.fb.group({
      id: countryData[0],
      name: countryData[1],
      code: countryData[2],
    });
    this.ECode = 'flag-icon-' + countryData[2];
  }
  changeSelectedKey(keyData: any) {  
    this.editKeyForm = this.fb.group({
      id: keyData[0],
      key: keyData[4],
      country: keyData[0],
    });
  }

  getCountries() {
    this.countryService.getCountries().subscribe({
      next: (data: any[]) => {
        this.countries = data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getKeys() {
    this.countryService.getKeys().subscribe({
      next: (data: any[]) => {
        this.keys = data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  createCountry() {
    const countryData = this.countryForm.value;
    if (!countryData.code || countryData.code.trim() === '') {
      return;
    } else {
      this.countryService.createCountry(countryData).subscribe(
        (response) => {
          // Handle success response
          console.log('Country created successfully');
          this.getCountries(); // Refresh the countries list
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  updateCountry() {
    const countryData = this.editCountryForm.value;
    console.log(countryData);
    this.countryService.updateCountry(Number(countryData.id), countryData).subscribe(
      (response) => {
        // Handle success response
        console.log('Country updated successfully');
        this.getCountries(); // Refresh the countries list
      },
      (error) => {
        console.log(error);
      }
    );
  }

  deleteCountry(countryId: number) {
    this.countryService.deleteCountry(countryId).subscribe(
      (response) => {
        // Handle success response
        console.log('Country deleted successfully');
        this.getCountries(); // Refresh the countries list
      },
      (error) => {
        console.log(error);
      }
    );
  }

  createKey() {
    const keyData = this.keyForm.value;
    this.countryService.createKey(keyData).subscribe(
      (response) => {
        // Handle success response
        console.log('Key created successfully');
        this.getKeys(); // Refresh the keys list
      },
      (error) => {
        console.log(error);
      }
    );
  }

  updateKey() {
    const keyData = this.editKeyForm.value;
    console.log(keyData);
    this.countryService.updateKey(Number(keyData.id), keyData).subscribe(
      (response) => {
        // Handle success response
        console.log('Key updated successfully');
        this.getKeys(); // Refresh the keys list
      },
      (error) => {
        console.log(error);
      }
    );
  }

  deleteKey(keyId: number) {
    this.countryService.deleteKey(keyId).subscribe(
      (response) => {
        // Handle success response
        console.log('Key deleted successfully');
        this.getKeys(); // Refresh the keys list
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
