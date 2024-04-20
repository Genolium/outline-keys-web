import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxQRCodeModule, NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { filter, map, switchMap } from 'rxjs/operators';
import { CountryService } from '../country-service.service';
import { CountryList } from '../country-list-component/country-list-component.component';

@Component({
  selector: 'app-key',
  standalone: true,
  imports: [CommonModule, CountryList, NgxQRCodeModule],
  templateUrl: './key.component.html',
  styleUrls: ['./key.component.css']
})
export class KeyComponent {  
  key: any[] = [];

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

  copyToClipboard() {
    const accessKey = document.getElementById('accessKey') as HTMLTextAreaElement;
    accessKey.select();
    document.execCommand('copy');
    const selection = document.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }
  }

  getTime(a: Date): string {
    const input = new Date(a);
    const now = new Date();
    const timeDiffMinutes = Math.floor((now.getTime() - input.getTime()) / 60000);
    const timeDiffHours = Math.floor(timeDiffMinutes / 60);
    const timeDiffDays = Math.floor(timeDiffHours / 24);
    const timeDiffMonths = Math.floor(timeDiffDays / 30);

    if (timeDiffMinutes < 60) {
      return `${timeDiffMinutes} мин. назад`;
    } else if (timeDiffHours < 24) {
      return `${timeDiffHours} ч. назад`;
    } else if (timeDiffDays < 30) {
      return `${timeDiffDays} дней назад`;
    } else{
      return `${timeDiffMonths} мес. назад`;
    }
  }
}