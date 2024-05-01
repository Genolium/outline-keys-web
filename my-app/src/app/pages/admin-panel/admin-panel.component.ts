import { Component, OnInit } from '@angular/core';
import { CountryService } from '../../services/country-service.service';
import { CommonModule, NgForOf } from '@angular/common';
import { AuthService } from '../../services/auth-service.service';
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
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from '../../components/header/header.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { BlogEditorComponent } from '../../components/blog-editor/blog-editor.component';
import {
  AngularEditorConfig,
  AngularEditorModule,
} from '@kolkov/angular-editor';

@Component({
  standalone: true,
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    AngularEditorModule,
    HeaderComponent,
    TranslateModule,
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
    HeaderComponent,
    BlogEditorComponent,
  ],
})
export class AdminComponent implements OnInit {

  isLoggedIn = false;

  keyForm!: FormGroup;
  countryForm!: FormGroup;
  editCountryForm!: FormGroup;
  editKeyForm!: FormGroup;
  loginForm!: FormGroup;

  linkForm!: FormGroup;

  newCountryCode = 'flag-icon-ru';
  ECode = '';

  countries: any[] = [];
  keys: any[] = [];
  posts: any[] = [];

  postTitle: any;
  htmlContent1: any;
  id:number=0;

  imageBase64: string | ArrayBuffer | null = null;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Место для замечательной статьи',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [],
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [
        'justifyLeft',
        'justifyCenter',
        'justifyRight',
        'justifyFull',
        'fontName',
        'italic',
        'bold',
      ],
      [
        'fontSize',
        'textColor',
        'backgroundColor',
        'customClasses',
        'toggleEditorMode',
      ],
    ],
  };

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private countryService: CountryService,
    private fb: FormBuilder,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.linkForm = this.fb.group({
      link: '',
    });

    this.loginForm = this.fb.group({
      login: '',
      password: '',
    });

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

    this.editCountryForm.get('code')?.valueChanges.subscribe((value) => {
      this.ECode = 'flag-icon-' + value;
    });

    this.countryService.getLink().subscribe((key: any) => {
      this.linkForm = this.fb.group({
        link: key[1],
      });
    });

    this.getCountries();
    this.getKeys();
    this.getPosts();
  }

  logout() {
    this.authService.logout();
  }

  onLoginSubmit() {
    const login = this.loginForm.get('login')?.value;
    const password = this.loginForm.get('password')?.value;

    this.authService.login(login, password);
  }

  editLink() {
    const keyData = this.linkForm.value;
    this.countryService.changeLink(keyData).subscribe(
      (response) => {
        // Handle success response
        console.log('Link updated successfully');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  changeSelectedPost(post:any){
    this.postTitle = post.title;
    this.htmlContent1 = post.text;
    this.id = post.id;
    this.imageBase64 = post.cover;
  }

  editPost() {
    this.countryService.updatePost(this.id, {
      title: this.postTitle,
      text: this.htmlContent1,
      cover: this.imageBase64
    }).subscribe({
      next: (data: any[]) => {
        location.reload();  },
      error: (error) => {
        console.log(error);
      },
    })
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

  onHtmlChange() {
    this.htmlContent1 = this.htmlContent1.replace(
      '<img src',
      '<img style="max-height: 700px" class="img img-fluid" src'
    );
  }

  getPosts() {
    this.countryService.getAllPosts().subscribe({
      next: (data: any[]) => {
        this.posts = data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  deletePost(id: any) {
    this.countryService.deletePost(id).subscribe({
      next: (data: any[]) => {
        this.getPosts();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }  

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);
    }
  }

  handleReaderLoaded(event: any) {
    this.imageBase64 = event.target.result;
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
    this.countryService
      .updateCountry(Number(countryData.id), countryData)
      .subscribe(
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
