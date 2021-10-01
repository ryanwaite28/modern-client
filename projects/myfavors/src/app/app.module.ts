import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AboutComponent } from 'projects/myfavors/src/app/components/pages/about/about.component';
import { CommonAppModule } from 'projects/_common/src/app/app.module';
import { MyfavorsAppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FavorFormComponent } from './components/fragments/favor-form/favor-form.component';
import { FavorCardComponent } from './components/fragments/favor-card/favor-card.component';
import { MyfavorsFavorContainerPageComponent } from './components/pages/favor-container-page/favor-container-page.component';
import { MyfavorsFavorPageComponent } from './components/pages/favor-container-page/favor-page/favor-page.component';
import { FavorPaymentCancelPageComponent } from './components/pages/favor-container-page/favor-payment-cancel-page/favor-payment-cancel-page.component';
import { FavorPaymentSuccessPageComponent } from './components/pages/favor-container-page/favor-payment-success-page/favor-payment-success-page.component';
import { MyfavorsUserCreateFavorFragmentComponent } from './components/pages/user/create-favor/create-favor.component';
import { MyfavorsUserFavorHelpingsFragmentComponent } from './components/pages/user/favor-helpings/favor-helpings.component';
import { MyfavorsUserFavorSearchFragmentComponent } from './components/pages/user/favor-search/favor-search.component';
import { MyfavorsUserFavorsFragmentComponent } from './components/pages/user/favors/favors.component';
import { MyfavorsUserHomeComponent } from './components/pages/user/home/home.component';
import { MyfavorsUserSettingsFragmentComponent } from './components/pages/user/settings/settings.component';
import { MyfavorsUserPageComponent } from './components/pages/user/user-page.component';
import { MyfavorsWelcomeComponent } from './components/pages/welcome/welcome.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    MyfavorsWelcomeComponent,
    MyfavorsUserPageComponent,
    MyfavorsUserHomeComponent,
    MyfavorsUserSettingsFragmentComponent,
    MyfavorsUserFavorsFragmentComponent,
    MyfavorsUserFavorHelpingsFragmentComponent,
    FavorFormComponent,
    FavorCardComponent,
    MyfavorsUserCreateFavorFragmentComponent,
    MyfavorsUserFavorSearchFragmentComponent,
    MyfavorsFavorContainerPageComponent,
    MyfavorsFavorPageComponent,
    FavorPaymentSuccessPageComponent,
    FavorPaymentCancelPageComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    CommonAppModule,
    MyfavorsAppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class MyfavorsAppModule { }
