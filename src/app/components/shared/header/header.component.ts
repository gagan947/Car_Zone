import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { RoleService, UserRole } from '../../../services/role.service';
import { RoleDirective } from '../../../directives/role.directive';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, RoleDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private roleService = inject(RoleService);
  role = this.roleService.currentRole;

  constructor(private router: Router) { }
  switchRole() {
    const newRole: UserRole = this.role() === 'buyer' ? 'seller' : 'buyer';
    this.roleService.setRole(newRole);
    const existingScript = document.querySelector('script[src="js/main.js"]');
    if (existingScript) {
      existingScript.remove();
    }
    const scriptElement = document.createElement('script');
    scriptElement.src = 'js/main.js';
    scriptElement.async = true;
    document.body.appendChild(scriptElement);
    this.router.navigate(['/']);
  }
}
