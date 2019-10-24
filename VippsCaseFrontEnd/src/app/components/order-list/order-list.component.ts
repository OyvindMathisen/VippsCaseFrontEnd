import { Component, OnInit, Input } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';


@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {

  @Input() orders: any;

  constructor(private cartService: CartService) {
  }

  ngOnInit() {
    if (!this.orders) {
      this.orders = [];
    }
    this.cartService.getOrdersByUserId(parseInt(localStorage.getItem('user_id'), 10)).subscribe((data) => {
      this.orders = data.map((order: any) => {
        order.visible = false;
        return order;
      });
    });
  }

  onShowOrderClicked(id: number) {
    this.orders.forEach((order: any, index: number) => {
      order.visible = index === id;
    });

    /*
    // Allows multiple orders to be open at once, and only close when clicked again.
    this.orders[id].visible = !this.orders[id].visible;
    */
  }
}
