import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxQRCodeModule, NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { filter, map, switchMap } from 'rxjs/operators';
import { CountryService } from '../../services/country-service.service';
import { CountryList } from '../../components/country-list-component/country-list-component.component';
import { HeaderComponent } from "../../components/header/header.component";
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-key',
    standalone: true,
    templateUrl: './key.component.html',
    styleUrls: ['./key.component.css'],
    imports: [TranslateModule, CommonModule, CountryList, NgxQRCodeModule, HeaderComponent]
})
export class KeyComponent {  
  key: any[] = [];
  link: any = "";


  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value = '';

  constructor(private route: ActivatedRoute, private countryService: CountryService) {
    this.route.params.pipe(
      map(params => params['id']),
      filter(id => !!id),
      map(id => parseInt(id, 10)),
      switchMap(id => this.countryService.getKeysById(id))
    ).subscribe(key => {
      this.key = key;
      this.value = key[4];
    });
  }

  ngOnInit() {
    this.countryService.getLink().subscribe((key: any) => {
      this.link = key;
    });
  }

  copyToClipboard() {
    const accessKey = document.getElementById('accessKey') as HTMLTextAreaElement;
    accessKey.select();
    document.execCommand('copy');
    const selection = document.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }
  }

  getTime(a: Date): any[] {
    const input = new Date(a);
    const now = new Date();
    const timeDiffMinutes = Math.floor(
      (now.getTime() - input.getTime()) / 60000
    );
    const timeDiffHours = Math.floor(timeDiffMinutes / 60);
    const timeDiffDays = Math.floor(timeDiffHours / 24);
    const timeDiffMonths = Math.floor(timeDiffDays / 30);

    let timeTranslationKey;
    if (timeDiffMinutes < 60) {
      timeTranslationKey = 'time.minutes';
      return [timeDiffMinutes, timeTranslationKey];
    } else if (timeDiffHours < 24) {
      timeTranslationKey = 'time.hours';
      return [timeDiffHours,timeTranslationKey];
    } else if (timeDiffDays < 30) {
      timeTranslationKey = 'time.days';
      return [timeDiffDays,timeTranslationKey];
    } else {
      timeTranslationKey = 'time.months';
      return [timeDiffMonths,timeTranslationKey];
    };    
  }
}