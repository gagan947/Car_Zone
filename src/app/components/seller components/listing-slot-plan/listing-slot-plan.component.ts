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
  planList: any[] = []
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
