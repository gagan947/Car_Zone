import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationErrorService } from '../../services/validation-error.service';
import { CommonModule } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router, RouterLink } from '@angular/router';
import { SubmitButtonComponent } from '../shared/submit-button/submit-button.component';
import { CommonService } from '../../services/common.service';
import { Subject, takeUntil } from 'rxjs';
import { RoleService, UserRole } from '../../services/role.service';
import { AuthService } from '../../services/auth.service';
import { Auth } from '@angular/fire/auth';
import { browserPopupRedirectResolver, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-log-in',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterLink, SubmitButtonComponent, TranslateModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent {
  Form: FormGroup;
  isShowPassword: boolean = false
  loading: boolean = false
  private destroy$ = new Subject<void>();
  private roleService = inject(RoleService);
  role = this.roleService.currentRole;
  constructor(private auth: Auth, private fb: FormBuilder, public validationErrorService: ValidationErrorService, private toastr: NzMessageService, private commonService: CommonService, private authService: AuthService, private router: Router, private translate: TranslateService) {
    this.translate.use(localStorage.getItem('lang') || 'en');
    this.Form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    // if (!this.role()) {
    //   const modalElement = document.getElementById('ct_login_modal_1');
    //   if (modalElement) {
    //     const modal = new bootstrap.Modal(modalElement, {
    //       backdrop: 'static',
    //       keyboard: false
    //     });
    //     modal.show();
    //   }
    // }
  }

  onSubmit() {
    if (this.Form.invalid) {
      this.Form.markAllAsTouched();
      return;
    }

    let formData = {
      email: this.Form.value.email,
      password: this.Form.value.password,
      fcmToken: localStorage.getItem('fcm_token') || '',
      isSeller: this.role() === 'seller' ? 1 : 0
    }

    this.loading = true
    this.commonService.post('user/signIn', formData).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.loading = false
        this.toastr.success(res.message)
        this.authService.setValues(res.data.jwt_token, res.data.userId)
        if (this.role() == 'buyer') {
          this.router.navigate(['/'])
        } else {
          this.router.navigate(['/home'])
        }
      },
      error: (error) => {
        this.loading = false
        this.toastr.error(error)
      }
    })
  }

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

  switchRole1(role: string) {
    const newRole: UserRole = role as UserRole;
    this.roleService.setRole(newRole);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider, browserPopupRedirectResolver);
      console.log('User signed in:', result.user);
      this.googleLogin(result.user);
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  }

  googleLogin(userDet: any) {
    this.loading = true;

    const fullName = userDet.displayName;

    let formData = {
      email: this.Form.value.email,
      fullName: fullName,
      isSeller: this.role() == 'seller' ? 1 : 0
    }
    this.commonService.post('user/socialLogin', formData).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.toastr.success(res.message);
        this.authService.setValues(res.token, res.user.id);
        if (this.role() == 'buyer') {
          this.router.navigate(['/']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        this.loading = false;
        this.toastr.error(error);
      }
    });
  }
}

