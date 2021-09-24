import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserAuthGuard } from 'projects/_common/src/app/guards/auth.guard';
import { UserResolver } from 'projects/_common/src/app/resolvers/user.resolver';

import { AppComponent } from './app.component';
import { ContenderUserHomePageComponent } from './components/pages/user/home/home.component';
import { ContenderUserPageComponent } from './components/pages/user/user.component';
import { ContenderWelcomePageComponent } from './components/pages/welcome/welcome.component';

const routes: Routes = [
  {
    path: 'modern/apps/contender',
    component: AppComponent,
    // redirectTo: `modern/apps/contender/welcome`,
    children: [
      {
        path: '',
        component: ContenderWelcomePageComponent,
      },

      // {
      //   path: 'deliveries/:delivery_id',
      //   component: ContenderDeliveryContainerPageComponent,
      //   resolve: {
      //     delivery: DeliveryResolver,
      //   },
      //   children: [
      //     { path: '', pathMatch: 'full', component: ContenderDeliveryPageComponent },
      //     { path: 'payment-success', component: DeliveryPaymentSuccessPageComponent },
      //     { path: 'payment-cancel', component: DeliveryPaymentCancelPageComponent },
      //   ]
      // },
      
      {
        path: 'users/:user_id',
        component: ContenderUserPageComponent,
        resolve: {
          user: UserResolver,
        },
        data: { authParamsProp: 'user_id' },
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'home' },
      
          { path: 'home', component: ContenderUserHomePageComponent },
          // { path: 'settings', component: ContenderUserSettingsFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
          // { path: 'create-delivery', component: ContenderUserCreateDeliveryFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
          // { path: 'deliveries', component: ContenderUserDeliveriesFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
          // { path: 'delivering', component: ContenderUserDeliveringFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
          // { path: 'search', component: ContenderUserDeliverySearchFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
        ]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class ContenderAppRoutingModule { }
