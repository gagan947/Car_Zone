import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-browse-cars',
  imports: [RouterLink, CommonModule],
  templateUrl: './browse-cars.component.html',
  styleUrl: './browse-cars.component.css'
})
export class BrowseCarsComponent {
  private destroy$ = new Subject<void>();
  carsList: any[] = []
  constructor(private service: CommonService) { }

  ngOnInit(): void {
    this.getCars()
  }

  getCars() {
    this.service.get('user/fetchOtherSellerCarsList').pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.carsList = res.data
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
