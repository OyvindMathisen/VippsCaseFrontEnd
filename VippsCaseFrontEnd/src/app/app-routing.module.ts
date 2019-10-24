import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { LoginFormComponent } from './views/login-form/login-form.component';
import { PurchasePageComponent } from './views/purchase-page/purchase-page.component';
import { PurchaseHistoryComponent } from './views/purchase-history/purchase-history.component';
import { PurchaseConfirmedComponent } from './views/purchase-confirmed/purchase-confirmed.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import { AuthGuardService as AuthGuard } from './services/auth-guard.service';
import { RoleGuardService as RoleGuard } from './services/role-guard.service';


const routes: Routes = [
  { path: '', component: LoginFormComponent  },
  { path: 'purchase', component: PurchasePageComponent, canActivate: [AuthGuard] },
  { path: 'confirmation', component: PurchaseConfirmedComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: PurchaseHistoryComponent, canActivate: [AuthGuard, RoleGuard], 
    data: { 
      expectedRole: 'user'
    }
  },
  // 404 - Page not found
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
