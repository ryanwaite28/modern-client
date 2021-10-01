import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAuthGuard } from 'projects/_common/src/app/guards/auth.guard';
import { UserResolver } from 'projects/_common/src/app/resolvers/user.resolver';
import { AppComponent } from './app.component';
import { TravellrsUserHomePageComponent } from './components/pages/user-page/user-home-page/user-home-page.component';
import { TravellrsUserPageComponent } from './components/pages/user-page/user-page.component';
import { TravellrsUserSettingsPageComponent } from './components/pages/user-page/user-settings-page/user-settings-page.component';
import { TravellrsUserTravelsPageComponent } from './components/pages/user-page/user-travels-page/user-travels-page.component';
import { TravellrsWelcomePageComponent } from './components/pages/welcome-page/welcome-page.component';

const routes: Routes = [
  {
    path: 'modern/apps/travellrs',
    component: AppComponent,
    // redirectTo: `modern/apps/travellrs/welcome`,
    children: [
      {
        path: '',
        component: TravellrsWelcomePageComponent,
      },
      {
        path: 'users/:user_id',
        component: TravellrsUserPageComponent,
        resolve: {
          user: UserResolver,
        },
        data: { authParamsProp: 'user_id' },
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'home' },
          { path: 'home', component: TravellrsUserHomePageComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
          { path: 'travels', component: TravellrsUserTravelsPageComponent, canActivate: [], data: { authParamsProp: 'user_id' } },
          // { path: 'settings', component: TravellrsUserSettingsPageComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
        ]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class TravellrsAppRoutingModule { }
