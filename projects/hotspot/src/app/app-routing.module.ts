import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAuthGuard } from 'projects/_common/src/app/guards/auth.guard';
import { UserResolver } from 'projects/_common/src/app/resolvers/user.resolver';
import { AppComponent } from './app.component';
import { HotSpotUserPageComponent } from './components/pages/user/user.component';
import { HotSpotUserHomePageComponent } from './components/pages/user/home/home.component';
import { HotSpotWelcomePageComponent } from './components/pages/welcome/welcome.component';
import { HotSpotUserSettingsPageComponent } from './components/pages/user/settings/settings.component';



const routes: Routes = [
  {
    path: 'modern/apps/hotspot',
    component: AppComponent,
    // redirectTo: `modern/apps/hotspot/welcome`,
    children: [
      {
        path: '',
        component: HotSpotWelcomePageComponent,
      },

      // {
      //   path: 'deliveries/:delivery_id',
      //   component: HotSpotDeliveryContainerPageComponent,
      //   resolve: {
      //     delivery: DeliveryResolver,
      //   },
      //   children: [
      //     { path: '', pathMatch: 'full', component: HotSpotDeliveryPageComponent },
      //     { path: 'payment-success', component: DeliveryPaymentSuccessPageComponent },
      //     { path: 'payment-cancel', component: DeliveryPaymentCancelPageComponent },
      //   ]
      // },
      
      {
        path: 'users/:user_id',
        component: HotSpotUserPageComponent,
        resolve: {
          user: UserResolver,
        },
        data: { authParamsProp: 'user_id' },
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'home' },
      
          { path: 'home', component: HotSpotUserHomePageComponent },
          { path: 'settings', component: HotSpotUserSettingsPageComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
        ]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class HotspotAppRoutingModule { }
