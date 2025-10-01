import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ValidationErrorService } from '../../services/validation-error.service';
import { SubmitButtonComponent } from '../shared/submit-button/submit-button.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  imports: [RouterLink, FormsModule, ReactiveFormsModule, SubmitButtonComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  private destroy$ = new Subject<void>()
  Form: FormGroup;
  loading: boolean = false

  constructor(private router: Router, private commonService: CommonService, private fb: FormBuilder, public validationErrorService: ValidationErrorService, private toastr: NzMessageService) {
    this.Form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    })
  }

  onSubmit() {
    if (this.Form.invalid) {
      this.Form.markAllAsTouched();
      return;
    }

    this.loading = true
    let formData = {
      email: this.Form.value.email,
    }

    this.commonService.post('user/forgotPassword', formData).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.loading = false
        this.toastr.success(res.message)
        sessionStorage.setItem('email', this.Form.value.email)
        sessionStorage.setItem('isForgotPassword', '1')
        this.router.navigate(['/otp-verification'])
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
