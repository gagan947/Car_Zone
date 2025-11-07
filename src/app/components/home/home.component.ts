import { Component, effect, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RoleDirective } from '../../directives/role.directive';
import { CommonService } from '../../services/common.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
declare var Swiper: any;
@Component({
  selector: 'app-home',
  imports: [RouterLink, RoleDirective, CommonModule, TranslateModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [],
})
export class HomeComponent {
  userData: any
  private destroy$ = new Subject<void>();
  carReels: any = [];
  constructor(private commonService: CommonService, private router: Router, private translate: TranslateService) {
    this.translate.use(localStorage.getItem('lang') || 'en');
    effect(() => {
      this.userData = this.commonService.userData
    })
  }

  ngOnInit(): void {
    this.getReels()
  }

  listCar() {
    if (this.userData().slotAvailable) {
      this.router.navigate(['/list-your-car'])
    } else {
      this.router.navigate(['/choose-listing-plan'])
    }
  }

  ngAfterViewInit(): void {
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

    const swiper = new Swiper('.mySwiper', {
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
