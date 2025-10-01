import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject, takeUntil } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wishlist',
  imports: [RouterLink, CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent {
  private destroy$ = new Subject<void>();
  wishList: any
  constructor(private service: CommonService, private message: NzMessageService) { }

  ngOnInit(): void {
    this.getWishList()
  }

  getWishList() {
    this.service.get('user/fetchUserWishlist').pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.wishList = res.data
    })
  }

  removeFromWishlist(item: any) {
    item.isWishlist = !item.isWishlist
    this.service.delete('user/removeCarFromWishlist', { carId: item.carId }).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.wishList.splice(this.wishList.indexOf(item), 1)
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
