import { Component, inject } from '@angular/core';
import { RoleService, UserRole } from '../../../services/role.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-modal',
  imports: [],
  templateUrl: './role-modal.component.html',
  styleUrl: './role-modal.component.css'
})
export class RoleModalComponent {

  private roleService = inject(RoleService);
  role = this.roleService.currentRole;

  constructor(private router: Router) { }

  switchRole(role: string) {
    const newRole: UserRole = role as UserRole;
    this.roleService.setRole(newRole);
    if (role === 'buyer') {
      this.router.navigate(['/signup']);
      return
    } else {
      this.router.navigate(['/seller-signup']);
      return
    }
  }


}
