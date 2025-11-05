import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { QuillModule } from 'ngx-quill';
import { NoWhitespaceDirective, strongPasswordValidator, passwordMatchValidator, passwordMismatchValidator } from '../../helper/validators';
import { ValidationErrorService } from '../../services/validation-error.service';
import { CountryISO, NgxIntlTelInputModule, SearchCountryField } from 'ngx-intl-tel-input-gg';
import { SubmitButtonComponent } from '../shared/submit-button/submit-button.component';
import { CommonService } from '../../services/common.service';
import { Subject, takeUntil } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  imports: [ReactiveFormsModule, CommonModule, NzSelectModule, QuillModule, FormsModule, RouterLink, NgxIntlTelInputModule, SubmitButtonComponent, TranslateModule],
  templateUrl: './seller-sign-up.component.html',
  styleUrl: './seller-sign-up.component.css'
})
export class SellerSignUpComponent {
  private destroy$ = new Subject<void>();
  Form: FormGroup;
  formStep: number = 1;
  atValues: any;
  htmlText: string = '';
  SearchCountryField = SearchCountryField
  CountryISO = CountryISO;
  selectedCountry = CountryISO.Sweden;
  lat: number | null = null;
  lng: number | null = null;
  loading: boolean = false
  isShowPassword: boolean = false
  isShowConfirmPassword: boolean = false
  constructor(private fb: FormBuilder, public validationErrorService: ValidationErrorService, private toastr: NzMessageService, private commonService: CommonService, private router: Router, private translate: TranslateService) {
    this.translate.use(localStorage.getItem('lang') || 'en');
    this.Form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), NoWhitespaceDirective.validate]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      typeOfSeller: ['personal', [Validators.required]],
      password: ['', [Validators.required, strongPasswordValidator]],
      confirmPassword: ['', [Validators.required]],
      address: [''],
      legalForm: ['Sole Proprietorship'],
      companyName: [''],
      companyAddress: [''],
      city: [''],
      pincode: [''],
      vat: [''],
    }, {
      validators: [
        passwordMatchValidator(),
        passwordMismatchValidator()
      ]
    });

  }

  ngOnInit(): void {
    this.getLocation();
    this.Form.get('typeOfSeller')?.valueChanges.subscribe((value) => {
      if (value === 'business') {
        this.Form.get('companyName')?.setValidators([Validators.required]);
        this.Form.get('companyAddress')?.setValidators([Validators.required]);
        this.Form.get('city')?.setValidators([Validators.required]);
        this.Form.get('pincode')?.setValidators([Validators.required]);
        this.Form.get('companyName')?.updateValueAndValidity();
        this.Form.get('companyAddress')?.updateValueAndValidity();
        this.Form.get('city')?.updateValueAndValidity();
        this.Form.get('pincode')?.updateValueAndValidity();
      } else {
        this.Form.get('companyName')?.clearValidators();
        this.Form.get('companyAddress')?.clearValidators();
        this.Form.get('city')?.clearValidators();
        this.Form.get('pincode')?.clearValidators();
        this.Form.get('companyName')?.updateValueAndValidity();
        this.Form.get('companyAddress')?.updateValueAndValidity();
        this.Form.get('city')?.updateValueAndValidity();
        this.Form.get('pincode')?.updateValueAndValidity();
      }
    })

  }

  nextStep() {
    if (this.Form.get('fullName')?.invalid || this.Form.get('email')?.invalid || this.Form.get('phoneNumber')?.invalid || this.Form.get('password')?.invalid || this.Form.get('confirmPassword')?.invalid) {
      this.Form.get('fullName')?.markAsTouched();
      this.Form.get('email')?.markAsTouched();
      this.Form.get('phoneNumber')?.markAsTouched();
      this.Form.get('password')?.markAsTouched();
      this.Form.get('confirmPassword')?.markAsTouched();
      return
    }
    this.formStep = this.formStep + 1
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
        },
        (error) => {
          // this.toastr.warning("Unable to retrieve location. Please enable GPS or location permissions.");
        }
      );
    } else {
      // this.toastr.warning("Geolocation is not supported by this browser.");
    }
  }

  onSubmit() {
    if (this.Form.invalid) {
      this.Form.markAllAsTouched();
      return;
    }
    this.loading = true

    let formData = {
      fullName: this.Form.value.fullName,
      email: this.Form.value.email,
      phoneNumber: this.Form.value.phoneNumber.number,
      typeOfSeller: this.Form.value.typeOfSeller,
      password: this.Form.value.password,
      address: this.Form.value.address,
      legalForm: this.Form.value.legalForm,
      companyName: this.Form.value.companyName,
      companyAddress: this.Form.value.companyAddress,
      city: this.Form.value.city,
      pincode: this.Form.value.pincode,
      vat: this.Form.value.vat,
      latitude: this.lat,
      longitude: this.lng,
      countryCode: this.Form.value.phoneNumber.dialCode,
      language: 'en',
      isSeller: 1
    }

    this.commonService.post('user/signUp', formData).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.loading = false
        this.toastr.success(res.message)
        sessionStorage.setItem('email', this.Form.value.email)
        sessionStorage.setItem('isForgotPassword', '0')
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
