import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { HeaderComponent } from "../header/header.component";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CountryService } from 'src/app/services/country-service.service';

@Component({
    standalone: true,
    selector: 'app-blog-editor',
    templateUrl: './blog-editor.component.html',
    styleUrls: ['./blog-editor.component.scss'],
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        HttpClientModule,
        AngularEditorModule,
        HeaderComponent
    ]
})
export class BlogEditorComponent {
  constructor(private countryService: CountryService) {}

  onHtmlChange() {
    this.htmlContent1 = this.htmlContent1.replace('<img src', '<img style="max-height: 700px" class="img img-fluid" src');
  }

  createPost(){

    if (this.postTitle && this.postTitle.trim() !== '') {
      if (this.htmlContent1 && this.htmlContent1.trim() !== '') {
        if (this.imageBase64) {
          this.countryService.createPost({
            title: this.postTitle,
            text: this.htmlContent1,
            cover: this.imageBase64
          }).subscribe(
            (response) => {
              // Handle success response
              console.log('Post created successfully');
              this.postTitle="";
              this.htmlContent1="";
              this.imageBase64=null;
              location.reload();  // reload page
            },
            (error) => {
              console.log(error);
            }
          );
        }
      }
    }
  }

  postTitle: any;
  htmlContent1: any;

  imageBase64: string | ArrayBuffer | null = null;

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
        'bold'
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
}
