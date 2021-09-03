import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CommonAppRoutingModule } from './app-routing.module';
import { CommonAppComponent } from './app.component';
import { CommonNavbarPartialComponent } from './components/navbar-partial/navbar-partial.component';
import { CommonNavbarComponent } from './components/navbar/navbar.component';
import { CommonFooterComponent } from './components/footer/footer.component';
import { ClientService } from './services/client.service';
import { UserService } from './services/user.service';
import { CommonWelcomeComponent } from './components/pages/welcome/welcome.component';
import { CommonUserSigninComponent } from './components/pages/signin/signin.component';
import { CommonUserSignupComponent } from './components/pages/signup/signup.component';
import { CommonUserHomeFragmentComponent } from './components/pages/user/home/home.component';
import { CommonUserSettingsFragmentComponent } from './components/pages/user/settings/settings.component';
import { CommonContactComponent } from './components/pages/contact/contact.component';
import { CommonAboutComponent } from './components/pages/about/about.component';
import { CommonAppsComponent } from './components/pages/apps/apps.component';
import { CommonUserPageComponent } from './components/pages/user/user-page.component';
import { CommonAlertsFragmentComponent } from './components/alerts-fragment/alerts-fragment.component';
import { AlertService } from './services/alert.service';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    CommonAppComponent,
    CommonNavbarPartialComponent,
    CommonNavbarComponent,
    CommonFooterComponent,
    CommonWelcomeComponent,
    CommonUserSigninComponent,
    CommonUserSignupComponent,
    CommonUserPageComponent,
    CommonUserHomeFragmentComponent,
    CommonUserSettingsFragmentComponent,
    CommonContactComponent,
    CommonAboutComponent,
    CommonAppsComponent,
    CommonAlertsFragmentComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    CommonAppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonAppRoutingModule,
    
    CommonNavbarPartialComponent,
    CommonNavbarComponent,
    CommonFooterComponent,
    CommonAlertsFragmentComponent,
  ],
  providers: [
    HttpClientModule,
    ClientService,
    UserService,
    AlertService,
  ],
  bootstrap: [CommonAppComponent]
})
export class CommonAppModule { }
