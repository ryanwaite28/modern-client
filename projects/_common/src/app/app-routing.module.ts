import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonAboutComponent } from './components/pages/about/about.component';
import { CommonAppsComponent } from './components/pages/apps/apps.component';
import { CommonContactComponent } from './components/pages/contact/contact.component';
import { CommonUserSigninComponent } from './components/pages/signin/signin.component';
import { CommonUserSignupComponent } from './components/pages/signup/signup.component';
import { CommonUserHomeFragmentComponent } from './components/pages/user/home/home.component';
import { CommonUserNotificationsFragmentComponent } from './components/pages/user/notifications/notifications.component';
import { CommonUserSettingsFragmentComponent } from './components/pages/user/settings/settings.component';
import { CommonUserPageComponent } from './components/pages/user/user-page.component';
import { CommonWelcomeComponent } from './components/pages/welcome/welcome.component';
import { UserAuthGuard } from './guards/auth.guard';
import { SignedOutGuard } from './guards/signed-out.guard';
import { UserResolver } from './resolvers/user.resolver';

const routes: Routes = [
  { path: 'modern', pathMatch: 'full', component: CommonWelcomeComponent },
  { path: 'modern/welcome', pathMatch: 'full', component: CommonWelcomeComponent },
  { path: 'modern/signup', pathMatch: 'full', component: CommonUserSignupComponent, canActivate: [SignedOutGuard] },
  { path: 'modern/signin', pathMatch: 'full', component: CommonUserSigninComponent, canActivate: [SignedOutGuard] },
  { path: 'modern/about', pathMatch: 'full', component: CommonAboutComponent },
  { path: 'modern/contact', pathMatch: 'full', component: CommonContactComponent },
  { path: 'modern/apps', pathMatch: 'full', component: CommonAppsComponent },

  {
    path: 'modern/users/:user_id',
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
      // { path: 'messages', component: MessagesFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
      // { path: 'conversations', component: ConversationsFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
      // { path: 'notifications', component: NotificationsFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
      // { path: 'feedback', component: FeedbackFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  // imports: [RouterModule],
  exports: [RouterModule]
})
export class CommonAppRoutingModule { }
