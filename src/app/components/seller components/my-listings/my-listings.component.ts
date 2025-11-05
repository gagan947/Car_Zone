import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject, takeUntil } from 'rxjs';
import { CommonService } from '../../../services/common.service';
import { CommonModule } from '@angular/common';
import { ChfFormatPipe } from '../../../pipes/chf-format.pipe';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-my-listings',
  imports: [RouterLink, CommonModule, ChfFormatPipe, TranslateModule],
  templateUrl: './my-listings.component.html',
  styleUrl: './my-listings.component.css'
})
export class MyListingsComponent {
  private destroy$ = new Subject<void>();
  carList: any[] = []

  constructor(private service: CommonService, private message: NzMessageService, private translate: TranslateService) {
    this.translate.use(localStorage.getItem('lang') || 'en');
  }

  ngOnInit(): void {
    this.getMyCars()
  }

  getMyCars() {
    this.service.get('user/getMyCar').pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.carList = res.data
    })
  }

  get activeCars() {
    return this.carList.filter(c => c.is_active);
  }

  get expiredCars() {
    return this.carList.filter(c => !c.is_active);
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
