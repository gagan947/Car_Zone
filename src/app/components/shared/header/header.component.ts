import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { RoleService, UserRole } from '../../../services/role.service';
import { RoleDirective } from '../../../directives/role.directive';
import { AuthService } from '../../../services/auth.service';
import { CommonService } from '../../../services/common.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, RoleDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private roleService = inject(RoleService);
  role = this.roleService.currentRole;
  @ViewChild('close') close: ElementRef | undefined;
  userData: any
  destroy$ = new Subject<void>();
  constructor(private router: Router, public authService: AuthService, private commonService: CommonService) {
    if (this.authService.isLogedIn()) {
      this.commonService.get('user/getUserProfile').pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        this.userData = res.data
      })
    }
  }
  switchRole(role: string) {
    const newRole: UserRole = role as UserRole;
    this.roleService.setRole(newRole);
    if (!this.authService.isLogedIn()) {
      this.router.navigate(['/login']);
      return
    }
    const existingScript = document.querySelector('script[src="js/main.js"]');
    if (existingScript) {
      existingScript.remove();
    }
    const scriptElement = document.createElement('script');
    scriptElement.src = 'js/main.js';
    scriptElement.async = true;
    document.body.appendChild(scriptElement);
  }

  logout() {
    this.close?.nativeElement.click();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
