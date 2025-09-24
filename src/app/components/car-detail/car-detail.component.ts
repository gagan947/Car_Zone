import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RoleDirective } from '../../directives/role.directive';
import { CommonService } from '../../services/common.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
declare var $: any;
@Component({
  selector: 'app-car-detail',
  imports: [RouterLink, RoleDirective, CommonModule],
  templateUrl: './car-detail.component.html',
  styleUrl: './car-detail.component.css'
})
export class CarDetailComponent {
  private destroy$ = new Subject<void>();
  carData: any
  carId: any
  constructor(private service: CommonService, private route: ActivatedRoute) {
    this.route.queryParamMap.subscribe(params => {
      this.carId = params.get('id')
    })
  }

  ngOnInit(): void {
    this.getCarDetail()
  }

  getCarDetail() {
    this.service.get('user/getCar/' + this.carId + '').pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.carData = res.data
    })
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
    $(".ct_product_gallary_slider").owlCarousel({
      loop: true,
      margin: 10,
      nav: true,
      responsive: {
        0: {
          items: 1,
        },
        600: {
          items: 1,
        },
        1000: {
          items: 1,
        },
      },
    });
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
}
