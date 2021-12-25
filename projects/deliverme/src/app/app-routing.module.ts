import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserAuthGuard } from 'projects/_common/src/app/guards/auth.guard';
import { SignedInGuard } from 'projects/_common/src/app/guards/signed-in.guard';
import { UserResolver } from 'projects/_common/src/app/resolvers/user.resolver';
import { AppComponent } from './app.component';
import { DeliverMeDeliveryBrowseFeaturedPageComponent } from './components/pages/delivery-browse-featured/delivery-browse-featured.component';
import { DeliverMeDeliveryBrowseMapPageComponent } from './components/pages/delivery-browse-map/delivery-browse-map.component';
import { DeliverMeDeliveryBrowseRecentPageComponent } from './components/pages/delivery-browse-recent/delivery-browse-recent.component';
import { DeliverMeDeliveryContainerPageComponent } from './components/pages/delivery-container-page/delivery-container-page.component';
import { DeliverMeDeliveryPageComponent } from './components/pages/delivery-container-page/delivery-page/delivery-page.component';
import { DeliveryPaymentCancelPageComponent } from './components/pages/delivery-container-page/delivery-payment-cancel-page/delivery-payment-cancel-page.component';
import { DeliveryPaymentSuccessPageComponent } from './components/pages/delivery-container-page/delivery-payment-success-page/delivery-payment-success-page.component';
import { DeliverMeUserCreateDeliveryFragmentComponent } from './components/pages/user/create-delivery/create-delivery.component';
import { DeliverMeUserDeliveriesFragmentComponent } from './components/pages/user/deliveries/deliveries.component';
import { DeliverMeUserDeliveringFragmentComponent } from './components/pages/user/delivering/delivering.component';
import { DeliverMeUserDeliverySearchFragmentComponent } from './components/pages/user/delivery-search/delivery-search.component';
import { DeliverMeUserHomeComponent } from './components/pages/user/home/home.component';
import { DeliverMeUserSettingsFragmentComponent } from './components/pages/user/settings/settings.component';
import { DeliverMeUserPageComponent } from './components/pages/user/user-page.component';
import { DeliverMeWelcomeComponent } from './components/pages/welcome/welcome.component';
import { DeliveryResolver } from './resolvers/delivery.resolver';

const routes: Routes = [
  {
    path: 'modern/apps/deliverme',
    component: AppComponent,
    // redirectTo: `modern/apps/deliverme/welcome`,
    children: [
      {
        path: '',
        component: DeliverMeWelcomeComponent,
      },

      // {
      //   path: 'deliveries/browse-featured',
      //   component: DeliverMeDeliveryBrowseFeaturedPageComponent,
      //   canActivate: [UserAuthGuard],
      //   data: { authParamsProp: 'user_id' }
      // },
      {
        path: 'deliveries/browse-recent',
        component: DeliverMeDeliveryBrowseRecentPageComponent,
        canActivate: [],
        data: { authParamsProp: 'user_id' }
      },
      {
        path: 'deliveries/browse-map',
        component: DeliverMeDeliveryBrowseMapPageComponent,
        canActivate: [],
        data: { authParamsProp: 'user_id' }
      },

      {
        path: 'deliveries/:delivery_id',
        component: DeliverMeDeliveryContainerPageComponent,
        resolve: {
          delivery: DeliveryResolver,
        },
        children: [
          { path: '', pathMatch: 'full', component: DeliverMeDeliveryPageComponent },
          { path: 'payment-success', component: DeliveryPaymentSuccessPageComponent },
          { path: 'payment-cancel', component: DeliveryPaymentCancelPageComponent },
        ]
      },
      
      {
        path: 'users/:user_id',
        component: DeliverMeUserPageComponent,
        resolve: {
          user: UserResolver,
        },
        data: { authParamsProp: 'user_id' },
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'home' },
      
          { path: 'home', component: DeliverMeUserHomeComponent },
          // { path: 'settings', component: DeliverMeUserSettingsFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
          { path: 'create-delivery', component: DeliverMeUserCreateDeliveryFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
          { path: 'deliveries', component: DeliverMeUserDeliveriesFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
          { path: 'delivering', component: DeliverMeUserDeliveringFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
          { path: 'search', component: DeliverMeUserDeliverySearchFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
        ]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class DeliverMeAppRoutingModule { }
