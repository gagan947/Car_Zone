import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RoleDirective } from '../../directives/role.directive';
import { CommonService } from '../../services/common.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { carData } from '../../helper/carData';
import { LoaderService } from '../../services/loader.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ChfFormatPipe } from '../../pipes/chf-format.pipe';
import { ModalService } from '../../services/modal.service';
import { AuthService } from '../../services/auth.service';
declare var Swiper: any;
@Component({
  selector: 'app-car-detail',
  imports: [RouterLink, RoleDirective, CommonModule, ChfFormatPipe],
  templateUrl: './car-detail.component.html',
  styleUrl: './car-detail.component.css'
})
export class CarDetailComponent {
  private destroy$ = new Subject<void>();
  carData: any
  carId: any
  token: any
  conditions = carData.conditions
  constructor(private service: CommonService, private route: ActivatedRoute, private loader: LoaderService, private router: Router, private message: NzMessageService, private modalService: ModalService, private authService: AuthService) {
    this.route.queryParamMap.subscribe(params => {
      this.carId = params.get('id')
    })
  }

  ngOnInit(): void {
    this.getCarDetail()
    this.token = this.authService.getToken();
  }

  getCarDetail() {
    this.loader.show();

    const endpoint = this.token
      ? `user/getCar/${this.carId}`
      : `user/asGuestUserGetCar/${this.carId}`;

    this.service.get(endpoint)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.carData = res.data;
          this.loader.hide();
        },
        error: (err) => {
          console.error('Failed to fetch car details:', err);
          this.loader.hide();
        }
      });
  }


  mainImage(imags: any[]): string {
    return imags[0];
  }

  sideImages(imags: any[]): string[] {
    return imags.slice(1, 5);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const swiper = new Swiper('.mySwiper', {
        direction: 'horizontal',
        slidesPerView: 1,
        loop: true,
        mousewheel: false,

        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }
      });

      new Swiper('.otherSwiper', {
        direction: 'horizontal',
        slidesPerView: 1,
        spaceBetween: 15,
        loop: true,
        mousewheel: false,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        },
      });
    }, 1000);
  }

  timeAgo(dateString: string): string {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
    if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'just now';
  }

  getFeaturesArray(features: any) {
    return features?.split(',')
  }

  getCarCondition(condition: any) {
    return this.conditions.find((c: any) => c.key === condition)?.title
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

  deleteListing(item: any) {
    this.service.delete('user/deleteCar/' + item.id + '?user_id=' + item.user_id + '').pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.router.navigate(['my-listings'])
      this.message.success('Car deleted successfully')
    })
  }

  contactSeller(item: any) {
    if (this.token) {
      let sellerData = {
        id: item.user_id,
        name: item.fullName,
        email: item.email,
        profileImage: item.profileImage,
        // carId: item.id,
        // carImage: item.carImages[0],
        // carName: item.brandName + ' ' + item.carModel + ' ' + item.selectYear
      }

      this.service.sellerData.set(sellerData)
      sessionStorage.setItem('sellerData', JSON.stringify(sellerData))
      this.router.navigate(['/chats'])
    } else {
      this.modalService.openLoginModal();
    }
  }
}
