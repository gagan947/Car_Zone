import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SubmitButtonComponent } from '../shared/submit-button/submit-button.component';

@Component({
  selector: 'app-contact-us',
  imports: [CommonModule, FormsModule, TranslateModule, SubmitButtonComponent],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {
  loading: boolean = false;
    constructor(private translate: TranslateService) {
      this.translate.use(localStorage.getItem('lang') || 'en');
    }
}
