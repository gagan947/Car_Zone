import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject, takeUntil } from 'rxjs';
import { CommonService } from '../../../services/common.service';
import { RouterLink } from '@angular/router';
import { LoaderService } from '../../../services/loader.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-listing-slot-plan',
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './listing-slot-plan.component.html',
  styleUrl: './listing-slot-plan.component.css'
})
export class ListingSlotPlanComponent {
  private destroy$ = new Subject<void>();
  planList: any
  selectedPlan: any = null;

  constructor(private service: CommonService, private loader: LoaderService, private translate: TranslateService) {
    this.translate.use(localStorage.getItem('lang') || 'en');
  }

  ngOnInit(): void {
    this.loader.show()
    this.getPlans()
  }

  getPlans() {
    this.service.get('user/getMyPlan').pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.planList = res.planData
      this.loader.hide()
    },
      err => {
        this.loader.hide()
      }
    )
  }

  convert(val: string, type: 'used' | 'total'): number {
    if (!val) return 0;
    const [used, total] = val.replace(/\s/g, '').split('/').map(Number);
    return type === 'used' ? used : total;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
