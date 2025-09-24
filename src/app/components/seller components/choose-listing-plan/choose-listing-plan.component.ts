import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CommonService } from '../../../services/common.service';
import { CommonModule } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-choose-listing-plan',
  imports: [RouterLink, CommonModule],
  templateUrl: './choose-listing-plan.component.html',
  styleUrl: './choose-listing-plan.component.css'
})
export class ChooseListingPlanComponent {
  private destroy$ = new Subject<void>();
  planList: any[] = []
  selectedPlan: any = null;

  constructor(private service: CommonService, private message: NzMessageService) { }

  ngOnInit(): void {
    this.getPlans()
  }

  getPlans() {
    this.service.get('user/getAllPlan').pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.planList = res.plans
    })
  }

  selectPlan(plan: any) {
    this.selectedPlan = plan;
  }

  purchasePlan() {
    let formData = {
      plan_id: this.selectedPlan.id,
      success_url: window.location.origin + '/payment-success',
      cancel_url: window.location.origin + '/payment-failed',
    }
    this.service.post('user/purchaseSlotPlan', formData).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        window.location.href = res.url
      },
      error: (error) => {
        this.message.error(error)
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
