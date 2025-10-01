import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject, takeUntil } from 'rxjs';
import { CommonService } from '../../../services/common.service';


@Component({
  selector: 'app-listing-slot-plan',
  imports: [CommonModule],
  templateUrl: './listing-slot-plan.component.html',
  styleUrl: './listing-slot-plan.component.css'
})
export class ListingSlotPlanComponent {
  private destroy$ = new Subject<void>();
  planList: any
  selectedPlan: any = null;

  constructor(private service: CommonService, private message: NzMessageService) { }

  ngOnInit(): void {
    this.getPlans()
  }

  getPlans() {
    this.service.get('user/getMyPlan').pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.planList = res.planData
    })
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
