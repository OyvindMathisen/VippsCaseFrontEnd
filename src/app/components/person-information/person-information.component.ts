import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StripeCharge } from 'src/app/shared/models/stripe-charge.model';
import { StripeService } from '../../services/stripe.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-person-information',
  templateUrl: './person-information.component.html',
  styleUrls: ['./person-information.component.scss']
})
export class PersonInformationComponent implements OnInit {
  // Inputs
  @Input() card: any;
  @Input() stripe: stripe.Stripe;
  @Input() totalCost: number;

  // Outputs
  @Output() purchaseConfirmed: EventEmitter<any>;
  @Output() purchaseFailed: EventEmitter<any>;

  // Equivalent of using document.getElement()
  @ViewChild('cardErrors', { static: false }) cardErrors: ElementRef;

  // Local Variables
  personDetails: FormGroup;
  stripeError: string;
  disablePurchaseButton: boolean;

  constructor(private stripeService: StripeService, private cartService: CartService) {
    this.purchaseConfirmed = new EventEmitter();
    this.purchaseFailed = new EventEmitter();
  }

  ngOnInit() {
    // Initializing the FormGroup for input and validation.
    this.initForm();

    // Initializing the Stripe card element
    this.initStripe();

    // Initializing user details in the form if we're signed in
    const userId: number = parseInt(localStorage.getItem('user_id'), 10);
    const token: string = localStorage.getItem('id_token');

    if (isFinite(userId)) {
      this.initUserDetails(token);
    }
  }

  async onPurchaseClicked() {
    // Disable button to prevent multiple inputs
    this.disablePurchaseButton = true;
    this.purchaseFailed.emit('');

    // Check if the stripe component has been filled out fully!
    const { paymentMethod } = await this.stripe.createPaymentMethod('card', this.card);
    const userId = parseInt(localStorage.getItem('user_id'), 10);
    const cartId = parseInt(localStorage.getItem('order_id'), 10);

    // Check for an empty cart
    if (this.totalCost <= 0) {
      // Creating our own 'empty cart' error.
      const error = new Error();
      error.message = 'Unable to make a purchase with an empty cart. Please add items to your cart.';

      // Creating a charge to store the cartId
      const tempCharge = {} as StripeCharge;
      tempCharge.cartId = cartId;

      // Handling the error message.
      this.handleErrorResponse(error, 0, tempCharge);
      this.disablePurchaseButton = false;
      return;
    }

    // NOTE: Multiply the sum with 100, as Stripe calculates from the lowest denominator, which is "øre" in nok.
    const cost = this.totalCost * 100;

    const charge = {} as StripeCharge;
    try {
      // Set up the stripe charge that will be sent to our backend.
      charge.paymentMethodId = paymentMethod.id;
      charge.totalCost = cost;
      charge.userId = isNaN(userId) ? -1 : userId;
      charge.cartId = isNaN(cartId) ? -1 : cartId;
      charge.customerDetails = this.personDetails.value;
    } catch (error) {
      // Logging the error for debugging.
      console.error(error.message);

      // The stripe element is missing one or more details.
      // The component will display it's own error.
      this.disablePurchaseButton = false;
      return;
    }

    // Form and stripe has been validated. Time to call our server!
    try {
      const response = await this.stripeService.addCharge(charge);
      this.handleServerResponse(response, charge);
    } catch (error) {
      // Logging the error into our console.
      console.error(error);
      // Replacing the error from the HttpClient with a human readable message.
      error.message = 'We were unable to contact our server to make the transaction. Please try again later.';
      this.handleErrorResponse(error, 0, charge);
    }
  }

  // Initialization
  initForm() {
    this.personDetails = new FormGroup({
      fullName: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-ZÆØÅæøå ]*$')]),
      addressLineOne: new FormControl('', [Validators.required]),
      addressLineTwo: new FormControl(''),
      county: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
      postalCode: new FormControl('', [Validators.required, Validators.pattern('\\d{4}')]),
      city: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
      country: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern('(?:\\d{2} ?){4}|\\d{3} ?\\d{2} ?\\d{3}')]),
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  initStripe() {
    // Display error handling to the user
    this.card.on('change', (event: any) => {
      // Remember to use nativeElement to get the DOM element
      const displayError = this.cardErrors.nativeElement;

      // Error check!
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });

    // Add the card to the component
    this.card.mount('#card-element');
  }

  initUserDetails(token: string) {
    console.log(atob(token.split('.')[1]));
    const userInfo: any = JSON.parse(atob(token.split('.')[1]));

    // Set values of person-information form
    this.personDetails.controls.fullName.setValue(userInfo.Name);
    this.personDetails.controls.addressLineOne.setValue(userInfo.AddressLineOne);
    this.personDetails.controls.addressLineTwo.setValue(userInfo.AddressLineTwo);
    this.personDetails.controls.county.setValue(userInfo.County);
    this.personDetails.controls.postalCode.setValue(userInfo.PostalCode);
    this.personDetails.controls.city.setValue(userInfo.City);
    this.personDetails.controls.country.setValue(userInfo.Country);
    this.personDetails.controls.phoneNumber.setValue(userInfo.PhoneNumber);
    this.personDetails.controls.email.setValue(userInfo.Email);
  }

  // Backend communication
  async handleServerResponse(response: any, charge: StripeCharge) {
    if (response.error) {
      // Show error from server on payment form
      this.handleErrorResponse(response, 2, charge);
    } else if (response.data != null && response.data.requires_action) {
      // 3D secure is required by the bank. Let's handle that!
      await this.handleAction(response.data, charge);
    } else {
      // 3D secure has already been handled, or the bank did not request it.
      this.cartService.changeOrderStatus(charge.cartId, 1).subscribe();

      // Let's tell our parent to navigate us to the next page!
      this.purchaseConfirmed.emit();
    }
  }

  async handleAction(input: any, charge: StripeCharge) {
    const { error: errorAction, paymentIntent } = await this.stripe.handleCardAction(input.payment_intent_client_secret);
    // User is verifying the purchase through their 3D security. We'll send this to our backend to update!
    try {
      charge.paymentIntentId = paymentIntent.id;
      charge.paymentMethodId = null;
    } catch (error) {
      // Debug message to display error.
      // This will most likely be a missing paymentIntent from failing the authentification through 3D secure.
      console.error(error.message);
    }

    if (errorAction) {
      // Show error from Stripe.js in payment
      // Updating the idempotency token in cases where the front-end fails the transaction.
      try {
        await this.stripeService.chargeFailed(charge);
      } catch (error) {
        console.error(error);
      }
      // Update the cart-state.
      this.handleErrorResponse(errorAction, 2, charge);
    } else {
      // Attempting the charge again, now that the user has been verified through their 3D security.
      try {
        const response = await this.stripeService.addCharge(charge);
        this.handleServerResponse(response, charge);
      } catch (error) {
        this.handleErrorResponse(error, 0, charge);
      }
    }
  }

  // Error Handling
  handleErrorResponse(error: any, cartState: number, charge: StripeCharge) {
    // Change the state of our cart as the order did not go through.
    this.cartService.changeOrderStatus(charge.cartId, cartState).subscribe();
    // Display error to the user.
    this.purchaseFailed.emit(error);
    // Re-enable the button.
    this.disablePurchaseButton = false;
  }

  // FormGroup validation methods.
  getFullName() {
    return this.personDetails.controls.fullName;
  }

  getAddressLineOne() {
    return this.personDetails.controls.addressLineOne;
  }

  getAddressLineTwo() {
    return this.personDetails.controls.addressLineTwo;
  }

  getCounty() {
    return this.personDetails.controls.county;
  }

  getPostalCode() {
    return this.personDetails.controls.postalCode;
  }

  getCity() {
    return this.personDetails.controls.city;
  }

  getCountry() {
    return this.personDetails.controls.country;
  }

  getPhoneNumber() {
    return this.personDetails.controls.phoneNumber;
  }

  getEmail() {
    return this.personDetails.controls.email;
  }
}
