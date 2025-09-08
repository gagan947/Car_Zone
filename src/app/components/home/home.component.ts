import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RoleDirective } from '../../directives/role.directive';

@Component({
  selector: 'app-home',
  imports: [RouterLink, RoleDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [],
})
export class HomeComponent {
  constructor() { }
}
