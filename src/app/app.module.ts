import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginFormComponent } from './views/login-form/login-form.component';
import { PurchasePageComponent } from './views/purchase-page/purchase-page.component';
import { PurchaseHistoryComponent } from './views/purchase-history/purchase-history.component';
import { PurchaseConfirmedComponent } from './views/purchase-confirmed/purchase-confirmed.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { ItemComponent } from './components/item/item.component';
import { LoginModuleComponent } from './components/login-module/login-module.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProfileDetailsComponent } from './components/profile-details/profile-details.component';
import { ErrorComponent } from './components/error/error.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import { PersonInformationComponent } from './components/person-information/person-information.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

import { CookieService } from 'ngx-cookie-service';
import { RoleGuardService } from './services/role-guard.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    LoginModuleComponent,
    PurchasePageComponent,
    PurchaseHistoryComponent,
    PurchaseConfirmedComponent,
    ItemListComponent,
    ItemComponent,
    NavBarComponent,
    FooterComponent,
    ProfileDetailsComponent,
    ErrorComponent,
    PageNotFoundComponent,
    PersonInformationComponent,
    OrderListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    CookieService,
    AuthService,
    AuthGuardService,
    RoleGuardService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
