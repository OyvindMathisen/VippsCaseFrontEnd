import { Component, OnInit } from '@angular/core';
import { Profile } from 'src/app/models/profile.model';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent implements OnInit {

  profile = {} as Profile;

  constructor() { }

  ngOnInit() {
    this.profile.userId = parseInt(localStorage.getItem('user_id'), 10);
    const token: string = localStorage.getItem('id_token');

    if (isFinite(this.profile.userId)) {
      const userInfo: any = JSON.parse(atob(token.split('.')[1]));

      this.profile.fullName = userInfo.Name ? userInfo.Name : 'No name provided';
      this.profile.addressOne = userInfo.AddressLineOne ? userInfo.AddressLineOne : 'No primary address provided';
      this.profile.addressTwo = userInfo.AddressLineTwo ? userInfo.AddressLineTwo : 'No secondary address-line provided';
      this.profile.country = userInfo.Country ? userInfo.Country : 'No country provided';
      this.profile.county = userInfo.County ? userInfo.County : 'No county provided';
      this.profile.postalCode = userInfo.PostalCode ? userInfo.PostalCode : 'No postal code provided';
      this.profile.city = userInfo.City ? userInfo.City : 'No city provided';
      this.profile.phoneNumber = userInfo.PhoneNumber ? userInfo.PhoneNumber : 'No phone number provided';
      this.profile.email = userInfo.Email ? userInfo.Email : 'No e-mail provided';
    }
  }
}
