import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { CommonAppModule } from 'projects/_common/src/app/app.module';

import { TravellrsAppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutPageComponent } from './components/pages/about-page/about-page.component';
import { InfoPageComponent } from './components/pages/info-page/info-page.component';
import { TravellrsWelcomePageComponent } from './components/pages/welcome-page/welcome-page.component';
import { TravellrsUserPageComponent } from './components/pages/user-page/user-page.component';
import { TravellrsUserHomePageComponent } from './components/pages/user-page/user-home-page/user-home-page.component';
import { TravellrsUserSettingsPageComponent } from './components/pages/user-page/user-settings-page/user-settings-page.component';
import { TravellrsUserTravelsPageComponent } from './components/pages/user-page/user-travels-page/user-travels-page.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutPageComponent,
    InfoPageComponent,
    TravellrsWelcomePageComponent,
    TravellrsUserPageComponent,
    TravellrsUserHomePageComponent,
    TravellrsUserSettingsPageComponent,
    TravellrsUserTravelsPageComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    CommonAppModule,
    TravellrsAppRoutingModule
  ],
  exports: [
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class TravellrsAppModule { }
