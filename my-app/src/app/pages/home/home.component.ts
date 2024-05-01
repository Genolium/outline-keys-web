import { Component } from '@angular/core';
import {RouterModule} from '@angular/router';
import { KeysList } from '../../components/keys-list-component/keys-list-component.component';
import { CountryList } from '../../components/country-list-component/country-list-component.component';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from "../../components/header/header.component"; // Import the HttpClientModule
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    imports: [RouterModule, KeysList, HttpClientModule, CountryList, HeaderComponent]
})
export class HomeComponent {
    public Editor = ClassicEditor;
}
