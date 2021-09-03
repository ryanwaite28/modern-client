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
