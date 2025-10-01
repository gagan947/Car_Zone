import { Component, effect } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RoleDirective } from '../../directives/role.directive';
import { CommonService } from '../../services/common.service';
declare var Swiper: any;
@Component({
  selector: 'app-home',
  imports: [RouterLink, RoleDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [],
})
export class HomeComponent {
  userData: any
  constructor(private commonService: CommonService, private router: Router) {
    effect(() => {
      this.userData = this.commonService.userData
    })
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
      slidesPerView: 2,
      spaceBetween: 10,
      loop: true,
      mousewheel: false,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }
    });

    new Swiper('.reelSwiper', {
      direction: 'horizontal',
      slidesPerView: 3,
      spaceBetween: 10,
      loop: true,
      mousewheel: false,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }
    });

  }
}
