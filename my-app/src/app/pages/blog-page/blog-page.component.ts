import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { CountryService } from 'src/app/services/country-service.service';
import { HeaderComponent } from "../../components/header/header.component";

@Component({
  standalone: true,
  selector: 'app-blog-page',
  templateUrl: './blog-page.component.html',
  styleUrls: ['./blog-page.component.scss'],
  imports:[ HeaderComponent]
})
export class BlogPageComponent {
  post: any;
  constructor(private route: ActivatedRoute, private countryService: CountryService) {
    this.route.params.pipe(
      map(params => params['id']),
      filter(id => !!id),
      map(id => parseInt(id, 10)),
      switchMap(id => this.countryService.getPost(id))
    ).subscribe(post => {
      this.post = post;
    });
  }
}
