import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RoleDirective } from '../../../directives/role.directive';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, RoleDirective],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

}
