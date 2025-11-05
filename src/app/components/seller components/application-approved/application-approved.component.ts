import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-application-approved',
  imports: [TranslateModule],
  templateUrl: './application-approved.component.html',
  styleUrl: './application-approved.component.css'
})
export class ApplicationApprovedComponent {
  constructor(private translate: TranslateService) {
    this.translate.use(localStorage.getItem('lang') || 'en');
  }
}
