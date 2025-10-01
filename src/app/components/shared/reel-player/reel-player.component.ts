import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject, takeUntil } from 'rxjs';
import { CommonService } from '../../../services/common.service';
import { ActivatedRoute } from '@angular/router';
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
  swiper: any;
  reelId: any
  currentIndex: number = 0
  constructor(private service: CommonService, private message: NzMessageService, private route: ActivatedRoute) {
    this.route.queryParamMap.subscribe(params => {
      this.reelId = params.get('id')
    })
  }

  ngOnInit(): void {
    this.getReels()
  }

  getReels() {
    this.service.get('user/fetchAllCarReel')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.carReels = res.data.data;
        this.currentIndex = res.data.data.findIndex((item: any) => item.id == this.reelId);
        setTimeout(() => {
          this.initSwiper();
        }, 100);
      });
  }


  initSwiper() {
    if (this.swiper) {
      this.swiper.destroy(true, true);
    }

    setTimeout(() => {
      this.swiper = new Swiper('.mySwiper', {
        direction: 'vertical',
        loop: false,
        currrentIndex: 4,
        mousewheel: {
          forceToAxis: true,
          sensitivity: 1,
          releaseOnEdges: true,
        },
        touchReleaseOnEdges: true,
        slidesPerView: 1,
        spaceBetween: 30,
        initialSlide: this.currentIndex,
        resistance: true,
        resistanceRatio: 0.85,
        speed: 300,
        on: {
          init: () => {
            console.log('Swiper initialized');
            setTimeout(() => this.handleVideoPlay(), 100);
          },
          slideChangeTransitionStart: () => {
            console.log('Slide change started');
          },
          slideChangeTransitionEnd: () => {
            console.log('Slide change ended');
            this.handleVideoPlay();
          },
        },
      });
    }, 100);
  }

  handleVideoPlay() {
    const allVideos = document.querySelectorAll<HTMLVideoElement>('.swiper-slide video');

    console.log('Total videos found:', allVideos.length);

    // Pause and reset all videos
    allVideos.forEach((vid, index) => {
      vid.pause();
      vid.currentTime = 0;
      // Ensure all videos are muted
      vid.muted = true;
      vid.volume = 0;
      console.log(`Video ${index} paused and reset, muted: ${vid.muted}`);
    });

    const activeSlide = document.querySelector('.swiper-slide-active');
    if (!activeSlide) {
      console.log('No active slide found');
      return;
    }

    const activeVideo = activeSlide.querySelector<HTMLVideoElement>('video');
    if (!activeVideo) {
      console.log('No video found in active slide');
      return;
    }

    console.log('Active video found:', activeVideo);
    console.log('Video src:', activeVideo.src);
    console.log('Video readyState:', activeVideo.readyState);
    console.log('Video muted before fix:', activeVideo.muted);

    // Force mute the active video
    activeVideo.muted = true;
    activeVideo.volume = 0;

    console.log('Video muted after fix:', activeVideo.muted);

    this.playActiveVideo(activeVideo);
  }

  private playActiveVideo(video: HTMLVideoElement) {
    video.muted = true;
    video.volume = 0;

    // Add these attributes to prevent power-saving pause
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('disableremoteplayback', '');

    // Add these styles to ensure video is considered "visible"
    video.style.objectFit = 'cover';
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.display = 'block';

    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('Video playing successfully');
          console.log('Video muted status:', video.muted);
          console.log('Video paused status:', video.paused);

          // Sometimes Chrome still pauses for power saving, so we need to monitor
          this.monitorVideoPlayback(video);
        })
        .catch((error) => {
          console.warn('Autoplay failed:', error);
          console.log('Video muted status on error:', video.muted);

          // If still failing, try with user gesture
          // this.addVideoPlayButton(video);
        });
    }
  }

  private monitorVideoPlayback(video: HTMLVideoElement) {
    let playAttempts = 0;
    const maxPlayAttempts = 3;

    const checkAndRestart = () => {
      if (video.paused && playAttempts < maxPlayAttempts) {
        console.log('Video was paused, attempting to restart...');
        playAttempts++;

        video.play()
          .then(() => {
            console.log(`Video restarted successfully (attempt ${playAttempts})`);
          })
          .catch((error) => {
            console.warn(`Restart attempt ${playAttempts} failed:`, error);
          });
      }
    };

    const interval = setInterval(() => {
      if (video.paused) {
        checkAndRestart();
      }

      if (playAttempts >= maxPlayAttempts) {
        clearInterval(interval);
      }
    }, 1000);

    // Also listen for pause events
    video.addEventListener('pause', () => {
      console.log('Video was paused by browser');
      checkAndRestart();
    });
  }

  // private addVideoPlayButton(video: HTMLVideoElement) {
  //   // Remove existing play buttons
  //   const existingButton = video.parentElement?.querySelector('.play-overlay');
  //   if (existingButton) {
  //     existingButton.remove();
  //   }

  //   // Add play button overlay
  //   const playButton = document.createElement('div');
  //   playButton.className = 'play-overlay';
  //   playButton.innerHTML = '▶';
  //   playButton.style.cssText = `
  //     position: absolute;
  //     top: 50%;
  //     left: 50%;
  //     transform: translate(-50%, -50%);
  //     width: 60px;
  //     height: 60px;
  //     background: rgba(0,0,0,0.7);
  //     border-radius: 50%;
  //     display: flex;
  //     align-items: center;
  //     justify-content: center;
  //     color: white;
  //     font-size: 24px;
  //     cursor: pointer;
  //     z-index: 10;
  //   `;

  //   playButton.addEventListener('click', () => {
  //     video.play().then(() => {
  //       playButton.style.display = 'none';
  //     });
  //   });

  //   video.parentElement?.style.setProperty('position', 'relative');
  //   video.parentElement?.appendChild(playButton);
  // }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
