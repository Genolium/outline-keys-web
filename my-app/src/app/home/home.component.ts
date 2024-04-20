import { Component } from '@angular/core';
import {RouterModule} from '@angular/router';
import { KeysList } from '../keys-list-component/keys-list-component.component';
import { CountryList } from '../country-list-component/country-list-component.component';
import { HttpClientModule } from '@angular/common/http'; // Import the HttpClientModule

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    imports: [RouterModule, KeysList, HttpClientModule, CountryList]
})
export class HomeComponent {

}
