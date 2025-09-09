import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { integerValidator, NoWhitespaceDirective, passwordMatchValidator, passwordMismatchValidator, strongPasswordValidator } from '../../helper/validators';
import { ValidationErrorService } from '../../services/validation-error.service';
import { CommonModule } from '@angular/common';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';
import { QuillModule } from 'ngx-quill';
import { Router, RouterLink } from '@angular/router';
import { SubmitButtonComponent } from '../shared/submit-button/submit-button.component';
import { CommonService } from '../../services/common.service';
import { Subject, takeUntil } from 'rxjs';
import { RoleService, UserRole } from '../../services/role.service';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-log-in',
  imports: [ReactiveFormsModule, CommonModule, NzSelectModule, QuillModule, FormsModule, RouterLink, SubmitButtonComponent],
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
  constructor(private fb: FormBuilder, public validationErrorService: ValidationErrorService, private toastr: NzMessageService, private commonService: CommonService, private authService: AuthService, private router: Router) {
    this.Form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {

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
        this.router.navigate(['/'])
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}