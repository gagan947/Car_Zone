import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RoleDirective } from '../../../directives/role.directive';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, RoleDirective, TranslateModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  constructor(private translate: TranslateService) {
    this.translate.use(localStorage.getItem('lang') || 'en');
  }
}
