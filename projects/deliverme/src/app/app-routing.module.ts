import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserAuthGuard } from 'projects/_common/src/app/guards/auth.guard';
import { UserResolver } from 'projects/_common/src/app/resolvers/user.resolver';
import { AppComponent } from './app.component';
import { DeliverMeUserCreateDeliveryFragmentComponent } from './components/pages/user/create-delivery/create-delivery.component';
import { DeliverMeUserDeliveriesFragmentComponent } from './components/pages/user/deliveries/deliveries.component';
import { DeliverMeUserDeliveringFragmentComponent } from './components/pages/user/delivering/delivering.component';
import { DeliverMeUserHomeComponent } from './components/pages/user/home/home.component';
import { DeliverMeUserSettingsFragmentComponent } from './components/pages/user/settings/settings.component';
import { DeliverMeUserPageComponent } from './components/pages/user/user-page.component';
import { DeliverMeWelcomeComponent } from './components/pages/welcome/welcome.component';

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
          { path: 'settings', component: DeliverMeUserSettingsFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
          { path: 'create-delivery', component: DeliverMeUserCreateDeliveryFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
          { path: 'deliveries', component: DeliverMeUserDeliveriesFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
          { path: 'delivering', component: DeliverMeUserDeliveringFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
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
