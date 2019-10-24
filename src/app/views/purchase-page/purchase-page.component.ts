import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-purchase-page',
  templateUrl: './purchase-page.component.html',
  styleUrls: ['./purchase-page.component.scss']
})
export class PurchasePageComponent implements OnInit {
  // Local Variables
  stripe: stripe.Stripe;
  stripeError: string;
  card: any;
  items: any;
  total: number;

  constructor(private router: Router, private cartService: CartService) {
    this.initStripeElements();
  }

  ngOnInit() {
    // Get items here.
    this.cartService.getItem().subscribe((data) => {
      this.items = data;
    });
  }

  initStripeElements() {
    // Stripe Init
    this.stripe = Stripe(environment.stripeKey);

    // Stripe Elements Init
    const elements = this.stripe.elements();

    // Stripe Card Style Init
    const style = {
      base: {
        color: '#000000',
        fontFamily: '"Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande", "Lucida Sans", Arial, sans-serif',
        fontSmoothing: 'antialiased',
        iconColor: '#000000',
        fontSize: '16px', '::placeholder': {
          color: '#c4c4c4'
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };

    // Stripe Card Init
    this.card = elements.create('card', { style, hidePostalCode: true });
  }

  onPurchaseSuccess(event: any) {
    this.router.navigate(['/confirmation']);
  }

  onPurchaseFailed(event: any) {
    this.stripeError = event.message ? event.message : event.error;
  }

  getCart() {
    // Get new cart:
    let userId = parseInt(localStorage.getItem('user_id'), 10);

    // Ensure we have a userId, if not we set it to 0 (anonymous)
    if (isNaN(userId)) {
      userId = 0;
    }

    // Get a whole new cart and fill out item-list wit hit.
    this.cartService.newCart(userId).subscribe((data) => {
      localStorage.setItem('order_id', data.orderId);
      this.items = data.items;
      this.total = 0;
      this.items.forEach((item: any) => {
        this.total += item.price;
      });
    });
  }
}
