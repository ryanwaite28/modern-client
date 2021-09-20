import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {
  NgbModule,
  NgbTooltipModule,
  NgbCarouselModule
} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
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
import { CommonUserPageCardComponent } from './components/user-page-card/user-page-card.component';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { CommonUserNotificationsFragmentComponent } from './components/pages/user/notifications/notifications.component';
import { CommonMessagesFragmentComponent } from './components/pages/user/messages/messages.component';
import { CommonConversationsComponent } from './components/pages/user/conversations/conversations.component';
import { CommonFollowersComponent } from './components/pages/user/followers/followers.component';
import { CommonFollowingsComponent } from './components/pages/user/followings/followings.component';
import { CommonUserFieldsComponent } from './components/pages/user/user-fields/user-fields.component';
import { CommonVerifyEmailComponent } from './components/pages/verify-email/verify-email.component';
import { CommonUserVerifyStripeAccountFragmentComponent } from './components/pages/user/verify-stripe-account-fragment/verify-stripe-account-fragment.component';

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
    CommonUserPageCardComponent,
    TimeAgoPipe,
    CommonUserNotificationsFragmentComponent,
    CommonMessagesFragmentComponent,
    CommonConversationsComponent,
    CommonFollowersComponent,
    CommonFollowingsComponent,
    CommonUserFieldsComponent,
    CommonVerifyEmailComponent,
    CommonUserVerifyStripeAccountFragmentComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbTooltipModule,
    NgbCarouselModule,
    NgSelectModule,

    CommonAppRoutingModule,
  ],
  exports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbTooltipModule,
    NgbCarouselModule,
    NgSelectModule,

    CommonAppRoutingModule,
    
    CommonNavbarPartialComponent,
    CommonNavbarComponent,
    CommonFooterComponent,
    CommonAlertsFragmentComponent,
    CommonUserPageCardComponent,

    TimeAgoPipe,
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
