import { Component, effect, ElementRef, inject, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { RoleService, UserRole } from '../../../services/role.service';
import { RoleDirective } from '../../../directives/role.directive';
import { AuthService } from '../../../services/auth.service';
import { CommonService } from '../../../services/common.service';
import { Subject, takeUntil } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, RoleDirective, TranslateModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private roleService = inject(RoleService);
  role = this.roleService.currentRole;
  @ViewChild('close') close: ElementRef | undefined;
  userData: any
  destroy$ = new Subject<void>();
  selectedLang: string = 'en'
  userRole: any;
  token: any
  constructor(private router: Router, public authService: AuthService, private commonService: CommonService, private toster: NzMessageService, private translate: TranslateService, private modalService: ModalService) {
    this.translate.setDefaultLang('en');
    this.token = this.authService.getToken();
    this.translate.use(localStorage.getItem('lang') || 'en');
    this.selectedLang = localStorage.getItem('lang') || 'en';
    this.userRole = localStorage.getItem('app_role');

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
          this.router.navigate(['/']);
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

  onCustomLangChange(lang: string) {
    this.selectedLang = lang;
    // this.translate.use(lang);
    // localStorage.setItem('lang', lang);
  }

  getLanguage(langCode: string) {
    switch (langCode) {
      case 'de':
        return 'German';
      case 'en':
        return 'English';
      case 'it':
        return 'Italian';
      case 'fr':
        return 'French';
      default:
        return 'English';
    }
  }

  getImage(langCode: string) {
    switch (langCode) {
      case 'de':
        return 'img/german.png';
      case 'en':
        return 'img/USA.png';
      case 'it':
        return 'img/itli.png';
      case 'fr':
        return 'img/french.png';
      default:
        return 'img/USA.png';
    }
  }

  notifications() {
    if (this.token) {
      this.router.navigateByUrl('/notifications');
    } else {
      this.modalService.openLoginModal();
    }
  }

  openLogin(): void {
    this.modalService.openLoginModal();
  }

}
