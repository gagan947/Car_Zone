import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputOtpComponent } from 'ng-zorro-antd/input';
import { SubmitButtonComponent } from '../shared/submit-button/submit-button.component';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-otp-verification',
  imports: [CommonModule, NzInputOtpComponent, FormsModule, ReactiveFormsModule, SubmitButtonComponent],
  templateUrl: './otp-verification.component.html',
  styleUrl: './otp-verification.component.css'
})
export class OtpVerificationComponent {
  private destroy$ = new Subject<void>();
  isResendDisabled: boolean = false;
  countdown: number = 60;
  interval: any;
  email: string | undefined
  otp: string = '';
  loading: boolean = false
  isForgotPassword: string | undefined

  constructor(private router: Router, private toster: NzMessageService, private commonService: CommonService) {
    this.email = sessionStorage.getItem('email') || ''
    this.isForgotPassword = sessionStorage.getItem('isForgotPassword') || ''
  }

  ngOnInit(): void {
    this.startCountdown()
  }

  startCountdown() {
    this.isResendDisabled = true;
    this.countdown = 60;

    this.interval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--
      } else {
        this.isResendDisabled = false;
        clearInterval(this.interval);
      }
    }, 1000);
  }

  restrictToNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
  resendOtp() {
    this.commonService.post('user/resendOtp', { email: this.email }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.toster.success(res.message)
        this.startCountdown()
      },
      error: (error) => {
        this.toster.error(error)
      }
    })
  }

  verifyOtp() {
    this.loading = true
    let formData = {
      email: this.email,
      otp: this.otp,
      isForgotPasswordPage: Number(this.isForgotPassword)
    }
    this.commonService.post('user/otpVerified', formData).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.loading = false
        this.toster.success(res.message)
        this.router.navigate(['/login'])
      },
      error: (error) => {
        this.loading = false
        this.toster.error(error)
      }
    })
  }
}
