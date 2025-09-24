import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject, takeUntil } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { ValidationErrorService } from '../../services/validation-error.service';
import { SubmitButtonComponent } from '../shared/submit-button/submit-button.component';
import { passwordMismatchValidator, strongPasswordValidator } from '../../helper/validators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, ReactiveFormsModule, SubmitButtonComponent, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  private destroy$ = new Subject<void>()
  Form: FormGroup;
  loading: boolean = false
  isShowNewPassword: boolean = false;
  isShowConfPassword: boolean = false;
  email: string | undefined
  constructor(private router: Router, private commonService: CommonService, private fb: FormBuilder, public validationErrorService: ValidationErrorService, private toastr: NzMessageService) {

    this.email = sessionStorage.getItem('email') || ''

    this.Form = new FormGroup({
      newPassword: new FormControl('', [Validators.required, strongPasswordValidator]),
      confirmPassword: new FormControl('', Validators.required),
    }, {
      validators: [
        passwordMismatchValidator()
      ]
    });
  }

  onSubmit() {
    if (this.Form.invalid) {
      this.Form.markAllAsTouched();
      return;
    }

    this.loading = true
    let formData = {
      email: this.email,
      new_password: this.Form.value.newPassword,
      confirm_password: this.Form.value.confirmPassword
    }

    this.commonService.post('user/resetPassword', formData).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.loading = false
        this.toastr.success(res.message)
        this.router.navigate(['/login'])
      },
      error: (error) => {
        this.loading = false
        this.toastr.error(error)
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
