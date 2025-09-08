import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RoleDirective } from '../../directives/role.directive';

@Component({
  selector: 'app-car-detail',
  imports: [RouterLink, RoleDirective],
  templateUrl: './car-detail.component.html',
  styleUrl: './car-detail.component.css'
})
export class CarDetailComponent {

}
