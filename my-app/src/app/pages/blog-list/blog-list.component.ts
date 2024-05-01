import { Component } from '@angular/core';
import { CountryService } from 'src/app/services/country-service.service';
import { HeaderComponent } from "../../components/header/header.component";
import { CommonModule, NgForOf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    standalone: true,
    selector: 'app-blog-list',
    templateUrl: './blog-list.component.html',
    styleUrls: ['./blog-list.component.scss'],
    imports: [CommonModule, HeaderComponent, NgForOf, TranslateModule]
})
export class BlogListComponent {
  posts: any[] = [];

  constructor(private countryService: CountryService) {}

  convertToPlain(html:any){
    // Create a new div element
    var tempDivElement = document.createElement("div");

    // Set the HTML content with the given value
    tempDivElement.innerHTML = html.replace('><','>. <');

    // Retrieve the text property of the element 
    return tempDivElement.textContent || tempDivElement.innerText || "";
}

  ngOnInit() {
    this.countryService.getAllPosts().subscribe((posts:any[]) => {
      this.posts = posts;
      this.posts.forEach((post) => {        
        post.text = this.convertToPlain(post.text);
        post.text = post.text.substring(0, 200) + '...';
      })
      console.log (this.posts);
    });
  }
}
