import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-payment-failed',
  imports: [TranslateModule],
  templateUrl: './payment-failed.component.html',
  styleUrl: './payment-failed.component.css'
})
export class PaymentFailedComponent {
  constructor(private translate: TranslateService) {
    this.translate.use(localStorage.getItem('lang') || 'en');
    } 
  }
