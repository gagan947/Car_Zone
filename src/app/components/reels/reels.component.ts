import { Component } from '@angular/core';
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
  carReels: any

  constructor(private service: CommonService, private message: NzMessageService, private router: Router) { }

  ngOnInit(): void {
    this.getReels()
  }

  getReels() {
    this.service.get('user/fetchAllCarReels').pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.carReels = res.data.data
    })
  }

  openReel(item: any) {
    this.router.navigate(['reel-player'])
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
