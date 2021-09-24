import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { CommonAppModule } from 'projects/_common/src/app/app.module';

import { HotspotAppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HotSpotWelcomePageComponent } from './components/pages/welcome/welcome.component';
import { HotSpotUserPageComponent } from './components/pages/user/user.component';
import { HotSpotUserHomePageComponent } from './components/pages/user/home/home.component';
import { HotSpotUserSettingsPageComponent } from './components/pages/user/settings/settings.component';
import { HotSpotUserPostsPageComponent } from './components/pages/user/posts/posts.component';
import { HotSpotUserCliquesPageComponent } from './components/pages/user/cliques/cliques.component';
import { PostComponent } from './components/fragments/post/post.component';
import { CommentComponent } from './components/fragments/comment/comment.component';
import { ReplyComponent } from './components/fragments/reply/reply.component';
import { PostFormComponent } from './components/fragments/post-form/post-form.component';
import { CommentFormComponent } from './components/fragments/comment-form/comment-form.component';
import { ReplyFormComponent } from './components/fragments/reply-form/reply-form.component';
import { CliqueComponent } from './components/fragments/clique/clique.component';
import { CliqueFormComponent } from './components/fragments/clique-form/clique-form.component';

@NgModule({
  declarations: [
    AppComponent,
    HotSpotWelcomePageComponent,
    HotSpotUserPageComponent,
    HotSpotUserHomePageComponent,
    HotSpotUserSettingsPageComponent,
    HotSpotUserPostsPageComponent,
    HotSpotUserCliquesPageComponent,
    PostComponent,
    CommentComponent,
    ReplyComponent,
    PostFormComponent,
    CommentFormComponent,
    ReplyFormComponent,
    CliqueComponent,
    CliqueFormComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    CommonAppModule,
    HotspotAppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class HotspotAppModule { }
