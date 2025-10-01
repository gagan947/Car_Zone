import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject, takeUntil } from 'rxjs';
import { CommonService } from '../../../services/common.service';
declare var Swiper: any

@Component({
  selector: 'app-reel-player',
  imports: [CommonModule],
  templateUrl: './reel-player.component.html',
  styleUrl: './reel-player.component.css',
})
export class ReelPlayerComponent {

  private destroy$ = new Subject<void>();
  carReels: any = []

  constructor(private service: CommonService, private message: NzMessageService) {

  }

  ngOnInit(): void {
    this.getReels()
  }

  getReels() {
    this.service.get('user/fetchAllCarReels').pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.carReels = res.data.data
    })
  }

  ngAfterViewInit(): void {
    const swiper = new Swiper('.mySwiper', {
      direction: 'vertical',
      loop: false,
      mousewheel: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      on: {
        init: function () {
          const firstVideo = document.querySelector<HTMLVideoElement>(
            '.swiper-slide-active video'
          );
          if (firstVideo) {
            firstVideo.muted = true;
            firstVideo.play().catch(() => { });
          }
        },
        slideChange: function () {
          const allVideos = document.querySelectorAll<HTMLVideoElement>(
            '.swiper-slide video'
          );
          allVideos.forEach((vid) => {
            vid.pause();
            vid.currentTime = 0;
          });

          const activeVideo = document.querySelector<HTMLVideoElement>(
            '.swiper-slide-active video'
          );
          if (activeVideo) {
            activeVideo.muted = true;
            activeVideo.play()
              .then(() => {
                console.log('Video is playing');
              })
              .catch((err) => {
                console.error('Autoplay failed:', err);
              });
          }
        },
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
