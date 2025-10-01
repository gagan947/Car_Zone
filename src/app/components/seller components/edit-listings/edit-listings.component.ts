import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Subject, takeUntil } from 'rxjs';
import { carData } from '../../../helper/carData';
import { NoWhitespaceDirective } from '../../../helper/validators';
import { CommonService } from '../../../services/common.service';
import { ValidationErrorService } from '../../../services/validation-error.service';
import { SubmitButtonComponent } from '../../shared/submit-button/submit-button.component';

@Component({
  selector: 'app-edit-listings',
  imports: [FormsModule, NzSelectModule, ReactiveFormsModule, CommonModule, SubmitButtonComponent],
  templateUrl: './edit-listings.component.html',
  styleUrl: './edit-listings.component.css'
})
export class EditListingsComponent {
  @ViewChild('featureInput') featureInput!: ElementRef<HTMLButtonElement>
  private destroy$ = new Subject<void>();
  brandList: any[] = []
  modalList: any[] = []
  years: number[] = [];
  carFormOne!: FormGroup;
  selectedFeatures: string[] = [];
  carImages: File[] = [];
  previewCarImages: any[] = [];
  submitted: boolean = false;
  selectedVideo: File | null = null;
  videoPreview: string | null = null;
  fuelTypes = carData.fuelTypes
  transmissions = carData.transmissions
  conditions = carData.conditions
  loading: boolean = false;
  carId: any
  constructor(private service: CommonService, private message: NzMessageService, private fb: FormBuilder, public validationErrorService: ValidationErrorService, private http: HttpClient, private router: Router, private route: ActivatedRoute) {
    this.route.queryParamMap.subscribe(params => {
      this.carId = params.get('id')
    })
    this.initForm()
  }

  ngOnInit(): void {
    this.getBrands()
    const currentYear = new Date().getFullYear();
    for (let i = 0; i <= 30; i++) {
      this.years.push(currentYear - i);
    }
    this.carFormOne.get('brandName')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.getModalList(res)
    })
  }

  initForm() {
    this.carFormOne = this.fb.group({
      carModel: ['', [Validators.required, NoWhitespaceDirective.validate]],
      brandName: ['', [Validators.required, NoWhitespaceDirective.validate]],
      sittingCapacity: [null, [Validators.required, Validators.min(1)]],
      selectYear: ['', [Validators.required]],
      carMileage: [null, [Validators.required, Validators.min(1)]],
      fuelType: ['', Validators.required],
      transmission: ['', Validators.required],
      engineType: [''],
      co2Emission: [''],
      powerOutput: [''],
      carCondition: ['', Validators.required],
      first_registration_date: ['', Validators.required],
      carColor: ['', Validators.required],
      carFeatures: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(1000), NoWhitespaceDirective.validate]],
      totalPrice: ['', [Validators.required, Validators.min(1)]],
      location: ['', [Validators.required, NoWhitespaceDirective.validate, Validators.maxLength(100)]],
    })
  }

  getCarDetail() {
    this.service.get('user/getCar/' + this.carId + '').pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      const carData = res.data
      carData.selectYear = Number(carData.selectYear)
      this.carFormOne.patchValue(carData)
      const formattedDate = new Date(carData.first_registration_date).toISOString().split('T')[0];

      this.carFormOne.patchValue({
        first_registration_date: formattedDate
      });
      this.selectedFeatures = carData.carFeatures.split(',')
      this.featureInput.nativeElement.value = '';
      this.previewCarImages = carData.carImages;
      this.videoPreview = carData.carReel
    })
  }

  getBrands() {
    this.service.get('user/brand').pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.brandList = res.data.Results;
      this.getCarDetail()
    })
  }

  getModalList(brand: any) {
    const brandId = this.brandList.find((item: any) => item.MakeName.toLowerCase() == brand.toLowerCase())?.MakeId
    this.service.get('user/getModel/' + brandId).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.modalList = res.data.models
    })
  }

  fetchCarDetailByVIN() {

    if (this.carFormOne.get('vrn')?.invalid) {
      this.carFormOne.get('vrn')?.markAllAsTouched();
      return;
    }

    const vin = this.carFormOne.get('vrn')?.value;
    this.loading = true;

    this.http
      .get(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${vin}?format=json`)
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res?.Results?.length > 0) {
            const result = res.Results[0];
            this.carFormOne.patchValue({
              brandName: result.Make,
              carModel: result.Model,
              selectYear: Number(result.ModelYear),
            })
          }
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  addFeature(benifit: string) {
    if (!this.selectedFeatures.includes(benifit)) {
      if (benifit.trim() != '') {
        this.selectedFeatures.push(benifit.trim());
        this.featureInput.nativeElement.value = '';
      }
    } else {
      this.message.error('Benifit already added');
    }
  }

  removeFeature(index: number) {
    this.selectedFeatures.splice(index, 1);
  }

  onCarImage(event: any) {
    const files = event.target.files;
    Array.from(files).forEach((file: any) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewCarImages.push(e.target.result);
      };
      reader.readAsDataURL(file);
      this.carImages.push(file);
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'video/mp4') {
        alert('Only MP4 videos are allowed');
        return;
      }
      this.selectedVideo = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.videoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeFile() {
    this.selectedVideo = null;
    this.videoPreview = null;
  }

  removeCarImage(index: number, imgUrl: string) {
    this.previewCarImages.splice(index, 1);
    this.carImages.splice(index, 1);
    this.service.delete('user/deleteCar-image', { imageUrl: imgUrl }).pipe(takeUntil(this.destroy$)).subscribe((res: any) => { })
  }

  onSubmit() {

    if (this.previewCarImages.length == 0) {
      this.submitted = true
      return
    }

    this.loading = true;
    const formData = new FormData();
    formData.append('carModel', this.carFormOne.get('carModel')?.value);
    formData.append('brandName', this.carFormOne.get('brandName')?.value);
    formData.append('sittingCapacity', this.carFormOne.get('sittingCapacity')?.value);
    formData.append('selectYear', this.carFormOne.get('selectYear')?.value);
    formData.append('carMileage', this.carFormOne.get('carMileage')?.value);
    formData.append('fuelType', this.carFormOne.get('fuelType')?.value);
    formData.append('transmission', this.carFormOne.get('transmission')?.value);
    formData.append('engineType', this.carFormOne.get('engineType')?.value);
    formData.append('co2Emission', this.carFormOne.get('co2Emission')?.value);
    formData.append('powerOutput', this.carFormOne.get('powerOutput')?.value);
    formData.append('carCondition', this.carFormOne.get('carCondition')?.value);
    formData.append('first_registration_date', this.carFormOne.get('first_registration_date')?.value);
    formData.append('carFeatures', this.selectedFeatures.join(','));
    formData.append('vrn', this.carFormOne.get('vrn')?.value);
    formData.append('carColor', this.carFormOne.get('carColor')?.value);
    formData.append('description', this.carFormOne.get('description')?.value);
    formData.append('totalPrice', this.carFormOne.get('totalPrice')?.value);
    formData.append('location', this.carFormOne.get('location')?.value);

    if (this.carImages.length > 0) {
      for (let i = 0; i < this.carImages.length; i++) {
        formData.append('carImages', this.carImages[i]);
      }
    }
    if (this.selectedVideo) {
      formData.append('carReel', this.selectedVideo);
    }

    this.service.update('user/updateCar' + '/' + this.carId, formData).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.message.success(res.message);
        this.router.navigate(['/my-listings']);
      },
      error: (error) => {
        this.loading = false;
        this.message.error(error.error.message);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
