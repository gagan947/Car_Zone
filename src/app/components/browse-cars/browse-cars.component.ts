import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { carData } from '../../helper/carData';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { LoaderService } from '../../services/loader.service';
import { ChfFormatPipe } from '../../pipes/chf-format.pipe';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-browse-cars',
  imports: [RouterLink, CommonModule, NzSelectModule, FormsModule, NzSliderModule, ChfFormatPipe],
  templateUrl: './browse-cars.component.html',
  styleUrl: './browse-cars.component.css'
})
export class BrowseCarsComponent {
  private destroy$ = new Subject<void>();
  carsList: any[] = []
  fuelTypes = carData.fuelTypes
  transmissions = carData.transmissions
  conditions = carData.conditions
  loading: boolean = false
  brandList: any[] = []
  modalList: any[] = []
  sittingCapacity = [1, 2, 3, 4, 5, 6, 7]
  sellerTypes = carData.sellerTypes

  selectedBrand: any = null
  selectedModal: any = null
  selectedSittingCapacity: any = null
  selectedSellerType: any = null
  selectedFuels: string[] = [];
  selectedTransmissions: string[] = [];
  priceRange: any = [1000, 2000000];
  yearRange: any = [2000, 2025];
  milageRange: any = [20, 60];
  token: any;

  years: number[] = [];

  constructor(private service: CommonService, private loader: LoaderService, private authService: AuthService, private modalService: ModalService) { }

  ngOnInit(): void {
    this.token = this.authService.getToken();
    this.getCars()
    this.getBrands()
    const currentYear = new Date().getFullYear();
    for (let i = 0; i <= 30; i++) {
      this.years.push(currentYear - i);
    }
  }

  // Disable all years before the selected start year
  isYearDisabled(year: number): boolean {
    if (!this.yearRange[0]) return false;
    return year < this.yearRange[0];
  }

  getCars() {
    this.loader.show()
    this.service.get(this.token ? 'user/fetchOtherSellerCarsList' : 'user/asGuestUserFetchSellerCarsList').pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.carsList = res.data
      this.loader.hide()
    }, err => {
      this.loader.hide()
    })
  }

  // addToWishlist(item: any) {
  //   item.isWishlist = !item.isWishlist
  //   this.service.post('user/addToWishlist', { carId: item.id }).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
  //   })
  // }
  addToWishlist(item: any) {
    item.isWishlist = !item.isWishlist;

    this.service.post('user/addToWishlist', { carId: item.id })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          // success response
        },
        error: (err) => {
          console.error('Wishlist API failed:', err);

          item.isWishlist = !item.isWishlist;

          this.modalService.openLoginModal();
        }
      });
  }


  removeFromWishlist(item: any) {
    item.isWishlist = !item.isWishlist
    this.service.delete('user/removeCarFromWishlist', { carId: item.id }).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
    })
  }

  getBrands() {
    this.service.get('user/brand').pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.brandList = res.data
    })
  }

  getModalList(brand: any) {
    const brandId = this.brandList.find((item: any) => item.make_display.toLowerCase() == brand.toLowerCase())?.make_id
    this.service.get('user/getModel/' + brandId).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.modalList = res.data
    })
  }

  getFilteredData(event: any) {
    this.priceRange = event
  }

  onFuelChange(event: any) {
    if (event.target.checked) {
      this.selectedFuels.push(event.target.value);
    } else {
      this.selectedFuels = this.selectedFuels.filter(f => f !== event.target.value);
    }
  }
  onTransmissionChange(event: any) {
    if (event.target.checked) {
      this.selectedTransmissions.push(event.target.value);
    } else {
      this.selectedTransmissions = this.selectedTransmissions.filter(f => f !== event.target.value);
    }
  }

  onFilterApply() {
    const params = Object.fromEntries(
      Object.entries({
        brandName: this.selectedBrand,
        carModel: this.selectedModal,
        fuelType: this.selectedFuels.length > 0 ? this.selectedFuels.join(',') : null,
        transmission: this.selectedTransmissions.length > 0 ? this.selectedTransmissions.join(',') : null,
        //sittingCapacity: this.selectedSittingCapacity,
        //sellerType: this.selectedSellerType,
        priceRange: this?.priceRange ? this.priceRange?.join(',') : null,
        min_year: this?.yearRange[0],
        max_year: this?.yearRange[1],
        min_mileage: this?.milageRange[0],
        max_mileage: this?.milageRange[1]
      })
        .filter(([key, value]) => value !== null)
    );

    this.service.get(this.token ? 'user/fetchOtherSellerCarsList' : 'user/asGuestUserFetchSellerCarsList', params).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.carsList = res.data
    })
  }

  onFilterClear() {
    this.selectedBrand = null;
    this.selectedModal = null;
    this.selectedFuels = [];
    this.selectedTransmissions = [];
    this.selectedSittingCapacity = null;
    this.selectedSellerType = null;
    this.priceRange = [1000, 2000000];

    this.service.get(this.token ? 'user/fetchOtherSellerCarsList' : 'user/asGuestUserFetchSellerCarsList').pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.carsList = res.data
    })
  }

  private searchTimeout: any;

  search(event: any) {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.service.get(this.token ? 'user/fetchOtherSellerCarsList' : 'user/asGuestUserFetchSellerCarsList', { search: event.target.value.trim() })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: any) => {
          this.carsList = res.data;
        });
    }, 400);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
