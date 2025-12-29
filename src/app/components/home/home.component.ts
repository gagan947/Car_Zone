import { Component, effect, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RoleDirective } from '../../directives/role.directive';
import { CommonService } from '../../services/common.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoaderService } from '../../services/loader.service';
import { AuthService } from '../../services/auth.service';
import { ChfFormatPipe } from '../../pipes/chf-format.pipe';
import { RoleService } from '../../services/role.service';
declare var Swiper: any;
@Component({
  selector: 'app-home',
  imports: [RouterLink, RoleDirective, CommonModule, TranslateModule, ChfFormatPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [],
})
export class HomeComponent {
  userData: any
  private destroy$ = new Subject<void>();
  carReels: any = [];
  carsList: any[] = []
  myCarsList: any[] = []
  token: any;
  constructor(private commonService: CommonService, private router: Router, private translate: TranslateService, private loader: LoaderService, private authService: AuthService, private roleService: RoleService) {
    this.translate.use(localStorage.getItem('lang') || 'en');
    effect(() => {
      this.userData = this.commonService.userData
    })
  }

  ngOnInit(): void {
    this.token = this.authService.getToken();
    this.getReels();
    if (this.roleService.currentRole() === 'seller') {
      this.getMyCars();
    } else {
      this.getCars();
    }
  }

  listCar() {
    if (this.userData().slotAvailable) {
      this.router.navigate(['/list-your-car'])
    } else {
      this.router.navigate(['/choose-listing-plan'])
    }
  }

  loadSwipers(): void {
    new Swiper('.carSwiper', {
      direction: 'horizontal',
      slidesPerView: 1,
      animation: true,
      animateIn: 'fadeIn',
      animateOut: 'fadeOut',
      MouseEvents: false,
      loop: true,
      freeMode: true,
      centeredSlides: true,
      autoplay: {
        delay: 2000,
        disableOnInteraction: false
      },
      speed: 400
    });

    new Swiper('.mySwiper', {
      direction: 'horizontal',
      slidesPerView: 1,
      spaceBetween: 10,
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
          slidesPerView: 2,
        },
      },
    });

    new Swiper('.reelSwiper', {
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
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 4,
        },
      },
    });

  }

  getReels() {
    this.isLoading = true;
    this.commonService.get('user/asGuestUsersfetchAllCarReels?page=' + 1 + '').pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.carReels = res.data.data;
      this.isLoading = false;
    })
  }

  openReel(item: any) {
    this.router.navigate(['reel-player'], { queryParams: { id: item.id } });
  }

  isLoading = false;

  saveReel(item: any) {
    item.isSavedReel = !item.isSavedReel
    this.commonService.post('user/saveCarReels', { carId: item.id }).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
    })
  }

  removeFromSaved(item: any) {
    item.isSavedReel = !item.isSavedReel
    this.commonService.delete('user/removeSavedCarsReel', { carId: item.id }).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
    })
  }

  getCars() {
    this.loader.show()
    this.commonService.get(this.token ? 'user/fetchOtherSellerCarsList' : 'user/asGuestUserFetchSellerCarsList').pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.carsList = res.data
      this.loadSwipers()
      this.loader.hide()
    }, err => {
      this.loader.hide()
    })
  }

  getMyCars() {
    this.loader.show()
    this.commonService.get('user/getMyCar').pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.myCarsList = res.data
      setTimeout(() => {
        this.loadSwipers()
      }, 100);
      this.loader.hide()
    }, err => {
      this.loader.hide()
    })
  }

  get activeCars() {
    return this.myCarsList.filter((c: { is_active: any; }) => c.is_active);
  }

  get expiredCars() {
    return this.myCarsList.filter((c: { is_active: any; }) => !c.is_active);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
