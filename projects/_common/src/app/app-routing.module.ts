import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CommonAppComponent } from './app.component';
import { CommonAboutComponent } from './components/pages/about/about.component';
import { CommonAppsComponent } from './components/pages/apps/apps.component';
import { CommonContactComponent } from './components/pages/contact/contact.component';
import { CommonUserSigninComponent } from './components/pages/signin/signin.component';
import { CommonUserSignupComponent } from './components/pages/signup/signup.component';
import { CommonUserHomeFragmentComponent } from './components/pages/user/home/home.component';
import { CommonMessagesFragmentComponent } from './components/pages/user/messages/messages.component';
import { CommonUserNotificationsFragmentComponent } from './components/pages/user/notifications/notifications.component';
import { CommonUserSettingsFragmentComponent } from './components/pages/user/settings/settings.component';
import { CommonUserPageComponent } from './components/pages/user/user-page.component';
import { CommonVerifyEmailComponent } from './components/pages/verify-email/verify-email.component';
import { CommonWelcomeComponent } from './components/pages/welcome/welcome.component';
import { UserAuthGuard } from './guards/auth.guard';
import { SignedOutGuard } from './guards/signed-out.guard';
import { UserResolver } from './resolvers/user.resolver';

const routes: Routes = [
  {
    path: 'modern', component: CommonAppComponent,
    children: [
      { path: '', pathMatch: 'full', component: CommonWelcomeComponent },
      { path: 'welcome', pathMatch: 'full', component: CommonWelcomeComponent },
      { path: 'signup', pathMatch: 'full', component: CommonUserSignupComponent, canActivate: [SignedOutGuard] },
      { path: 'signin', pathMatch: 'full', component: CommonUserSigninComponent, canActivate: [SignedOutGuard] },
      { path: 'about', pathMatch: 'full', component: CommonAboutComponent },
      { path: 'contact', pathMatch: 'full', component: CommonContactComponent },
      { path: 'apps', pathMatch: 'full', component: CommonAppsComponent },
      { path: 'verify-email/:uuid', pathMatch: 'full', component: CommonVerifyEmailComponent },

      {
        path: 'users/:user_id',
        component: CommonUserPageComponent,
        resolve: {
          user: UserResolver,
        },
        data: { authParamsProp: 'user_id' },
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'home' },
          
          { path: 'home', component: CommonUserHomeFragmentComponent },
          { path: 'settings', component: CommonUserSettingsFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
          { path: 'notifications', component: CommonUserNotificationsFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
          { path: 'messages', component: CommonMessagesFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
          // { path: 'conversations', component: ConversationsFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
          
          // { path: 'info', component: InfoFragmentComponent },
          // { path: 'posts', component: UserPostsFragmentComponent },
          // { path: 'teams', component: TeamsFragmentComponent },
          // { path: 'team-interests', component: TeamInterestsFragmentComponent },
          // { path: 'team-memberships', component: MemberFragmentComponent },
          // { path: 'connections', component: ConnectionsFragmentComponent },
          // { path: 'businesses', component: BusinessesFragmentComponent },
          // { path: 'business-plans', component: UserBusinessPlansFragmentComponent },
          // { path: 'business-interests', component: BusinessInterestsFragmentComponent },
          // { path: 'business-plan-interests', component: BusinessPlanInterestsFragmentComponent },
          // { path: 'resources', component: ResourcesFragmentComponent },
          // { path: 'resource-interests', component: ResourceInterestsFragmentComponent },
          // { path: 'following', component: FollowingsFragmentComponent },
          // { path: 'followers', component: FollowersFragmentComponent },
          // { path: 'browse', component: BrowseFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
          // { path: 'feedback', component: FeedbackFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  // imports: [RouterModule],
  exports: [RouterModule]
})
export class CommonAppRoutingModule { }
