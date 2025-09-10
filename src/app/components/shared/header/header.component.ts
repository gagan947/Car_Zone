import { Component, effect, ElementRef, inject, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { RoleService, UserRole } from '../../../services/role.service';
import { RoleDirective } from '../../../directives/role.directive';
import { AuthService } from '../../../services/auth.service';
import { CommonService } from '../../../services/common.service';
import { Subject, takeUntil } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';

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
  constructor(private router: Router, public authService: AuthService, private commonService: CommonService, private toster: NzMessageService) {
    if (this.authService.isLogedIn()) {
      this.commonService.getProfile()
    }
    effect(() => {
      this.userData = this.commonService.userData
    })
  }
  switchRole(role: string) {
    if (!this.authService.isLogedIn()) {
      const newRole: UserRole = role as UserRole;
      this.roleService.setRole(newRole);
      this.router.navigate(['/login']);
      return
    } else {
      this.commonService.post('user/changeMode', { isSeller: role == 'seller' ? 1 : 0 }).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        if (res.success) {
          const newRole: UserRole = role as UserRole;
          this.roleService.setRole(newRole);
          const existingScript = document.querySelector('script[src="js/main.js"]');
          if (existingScript) {
            existingScript.remove();
          }
          const scriptElement = document.createElement('script');
          scriptElement.src = 'js/main.js';
          scriptElement.async = true;
          document.body.appendChild(scriptElement);
          this.toster.success(res.message);
        }
      })
    }
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
