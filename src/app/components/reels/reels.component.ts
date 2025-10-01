import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject, takeUntil } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reels',
  imports: [CommonModule],
  templateUrl: './reels.component.html',
  styleUrl: './reels.component.css'
})
export class ReelsComponent {
  private destroy$ = new Subject<void>();
  carReels: any = [];
  private observer!: IntersectionObserver;
  @ViewChild('anchor', { static: false }) anchor!: ElementRef;
  page: number = 1
  constructor(private service: CommonService, private message: NzMessageService, private router: Router) { }

  ngOnInit(): void {
    this.getReels()
  }

  getReels() {
    this.isLoading = true;
    this.service.get('user/fetchAllCarReels?page=' + this.page + '').pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.carReels = [...this.carReels, ...res.data.data];
      this.isLoading = false;
      this.hasMore = res.data.currentPage < res.data.totalPages
      this.page++
    })
  }

  openReel(item: any) {
    this.router.navigate(['reel-player'], { queryParams: { id: item.id } });
  }

  isLoading = false;
  hasMore = true;

  @HostListener('window:scroll', [])
  onScroll(): void {
    const threshold = 300; // px from bottom
    const pos = window.innerHeight + window.scrollY;
    const max = document.body.offsetHeight;

    if (!this.isLoading && this.hasMore && pos >= max - threshold) {
      this.getReels();
    }
  }

  saveReel(item: any) {
    item.isSavedReel = !item.isSavedReel
    this.service.post('user/saveCarReels', { carId: item.id }).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
    })
  }

  removeFromSaved(item: any) {
    item.isSavedReel = !item.isSavedReel
    this.service.delete('user/removeSavedCarsReel', { carId: item.id }).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
