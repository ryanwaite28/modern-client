import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { DeliverMeAppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonAppModule } from 'projects/_common/src/app/app.module';
import { DeliverMeWelcomeComponent } from './components/pages/welcome/welcome.component';
import { DeliverMeUserHomeComponent } from './components/pages/user/home/home.component';
import { DeliverMeUserSettingsFragmentComponent } from './components/pages/user/settings/settings.component';
import { AboutComponent } from './components/pages/about/about.component';
import { DeliverMeUserPageComponent } from './components/pages/user/user-page.component';
import { DeliverMeUserDeliveriesFragmentComponent } from './components/pages/user/deliveries/deliveries.component';
import { DeliverMeUserDeliveringFragmentComponent } from './components/pages/user/delivering/delivering.component';
import { DeliveryFormComponent } from './components/fragments/delivery-form/delivery-form.component';
import { DeliveryCardComponent } from './components/fragments/delivery-card/delivery-card.component';
import { DeliverMeUserCreateDeliveryFragmentComponent } from './components/pages/user/create-delivery/create-delivery.component';
import { DeliverMeUserDeliverySearchFragmentComponent } from './components/pages/user/delivery-search/delivery-search.component';
import { DeliverMeDeliveryContainerPageComponent } from './components/pages/delivery-container-page/delivery-container-page.component';
import { DeliverMeDeliveryPageComponent } from './components/pages/delivery-container-page/delivery-page/delivery-page.component';
import { DeliveryPaymentSuccessPageComponent } from './components/pages/delivery-container-page/delivery-payment-success-page/delivery-payment-success-page.component';
import { DeliveryPaymentCancelPageComponent } from './components/pages/delivery-container-page/delivery-payment-cancel-page/delivery-payment-cancel-page.component';




@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    DeliverMeWelcomeComponent,
    DeliverMeUserPageComponent,
    DeliverMeUserHomeComponent,
    DeliverMeUserSettingsFragmentComponent,
    DeliverMeUserDeliveriesFragmentComponent,
    DeliverMeUserDeliveringFragmentComponent,
    DeliveryFormComponent,
    DeliveryCardComponent,
    DeliverMeUserCreateDeliveryFragmentComponent,
    DeliverMeUserDeliverySearchFragmentComponent,
    DeliverMeDeliveryContainerPageComponent,
    DeliverMeDeliveryPageComponent,
    DeliveryPaymentSuccessPageComponent,
    DeliveryPaymentCancelPageComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    CommonAppModule,
    DeliverMeAppRoutingModule,
  ],
  exports: [
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class DeliverMeAppModule { }
