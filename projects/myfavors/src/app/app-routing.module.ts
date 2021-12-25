import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAuthGuard } from 'projects/_common/src/app/guards/auth.guard';
import { UserResolver } from 'projects/_common/src/app/resolvers/user.resolver';
import { AppComponent } from './app.component';
import { MyfavorsFavorContainerPageComponent } from './components/pages/favor-container-page/favor-container-page.component';
import { MyfavorsFavorPageComponent } from './components/pages/favor-container-page/favor-page/favor-page.component';
import { FavorPaymentCancelPageComponent } from './components/pages/favor-container-page/favor-payment-cancel-page/favor-payment-cancel-page.component';
import { FavorPaymentSuccessPageComponent } from './components/pages/favor-container-page/favor-payment-success-page/favor-payment-success-page.component';
import { MyfavorsUserCreateFavorFragmentComponent } from './components/pages/user/create-favor/create-favor.component';
import { MyfavorsUserFavorHelpingsFragmentComponent } from './components/pages/user/favor-helpings/favor-helpings.component';
import { MyfavorsUserFavorSearchFragmentComponent } from './components/pages/user/favor-search/favor-search.component';
import { MyfavorsUserFavorsFragmentComponent } from './components/pages/user/favors/favors.component';
import { MyfavorsUserHomeComponent } from './components/pages/user/home/home.component';
import { MyfavorsUserPageComponent } from './components/pages/user/user-page.component';
import { MyfavorsWelcomeComponent } from './components/pages/welcome/welcome.component';
import { FavorResolver } from './resolvers/favor.resolver';

const routes: Routes = [
  {
    path: 'modern/apps/myfavors',
    component: AppComponent,
    // redirectTo: `modern/apps/myfavors/welcome`,
    children: [
      {
        path: '',
        component: MyfavorsWelcomeComponent,
      },

      {
        path: 'favors/:favor_id',
        component: MyfavorsFavorContainerPageComponent,
        resolve: {
          favor: FavorResolver,
        },
        children: [
          { path: '', pathMatch: 'full', component: MyfavorsFavorPageComponent },
          { path: 'payment-success', component: FavorPaymentSuccessPageComponent },
          { path: 'payment-cancel', component: FavorPaymentCancelPageComponent },
        ]
      },
      
      {
        path: 'users/:user_id',
        component: MyfavorsUserPageComponent,
        resolve: {
          user: UserResolver,
        },
        data: { authParamsProp: 'user_id' },
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'home' },
      
          { path: 'home', component: MyfavorsUserHomeComponent },
          // { path: 'settings', component: MyfavorsUserSettingsFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
          { path: 'create-favor', component: MyfavorsUserCreateFavorFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
          { path: 'favors', component: MyfavorsUserFavorsFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
          { path: 'favor-helpings', component: MyfavorsUserFavorHelpingsFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
          { path: 'search', component: MyfavorsUserFavorSearchFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
        ]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class MyfavorsAppRoutingModule { }
