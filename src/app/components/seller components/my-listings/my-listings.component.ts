import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject, takeUntil } from 'rxjs';
import { CommonService } from '../../../services/common.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-listings',
  imports: [RouterLink, CommonModule],
  templateUrl: './my-listings.component.html',
  styleUrl: './my-listings.component.css'
})
export class MyListingsComponent {
  private destroy$ = new Subject<void>();
  carList: any[] = []

  constructor(private service: CommonService, private message: NzMessageService) { }

  ngOnInit(): void {
    this.getMyCars()
  }

  getMyCars() {
    this.service.get('user/getMyCar').pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.carList = res.data
    })
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
