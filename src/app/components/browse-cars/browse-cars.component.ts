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
  priceRange: any = [1000, 2000000]
  constructor(private service: CommonService, private loader: LoaderService) { }

  ngOnInit(): void {
    this.getCars()
    this.getBrands()
  }

  getCars() {
    this.loader.show()
    this.service.get('user/fetchOtherSellerCarsList').pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.carsList = res.data
      this.loader.hide()
    }, err => {
      this.loader.hide()
    })
  }

  addToWishlist(item: any) {
    item.isWishlist = !item.isWishlist
    this.service.post('user/addToWishlist', { carId: item.id }).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
    })
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
        sittingCapacity: this.selectedSittingCapacity,
        sellerType: this.selectedSellerType,
        priceRange: this.priceRange ? this.priceRange?.join(',') : null
      })
        .filter(([key, value]) => value !== null)
    );

    this.service.get('user/fetchOtherSellerCarsList', params).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
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

    this.service.get('user/fetchOtherSellerCarsList').pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.carsList = res.data
    })
  }

  private searchTimeout: any;

  search(event: any) {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.service.get('user/fetchOtherSellerCarsList', { search: event.target.value.trim() })
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
