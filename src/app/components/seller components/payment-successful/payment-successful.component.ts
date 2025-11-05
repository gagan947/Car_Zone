import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-payment-successful',
  imports: [RouterLink, TranslateModule],
  templateUrl: './payment-successful.component.html',
  styleUrl: './payment-successful.component.css'
})
export class PaymentSuccessfulComponent {
  constructor(private translate: TranslateService) {
    this.translate.use(localStorage.getItem('lang') || 'en');
  } 
}
