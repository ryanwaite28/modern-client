import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ContenderAppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContenderWelcomePageComponent } from './components/pages/welcome/welcome.component';
import { ContenderUserPageComponent } from './components/pages/user/user.component';
import { CommonAppModule } from 'projects/_common/src/app/app.module';
import { ContenderUserHomePageComponent } from './components/pages/user/home/home.component';
import { ContenderUserSettingsPageComponent } from './components/pages/user/settings/settings.component';
import { ContenderUserInterviewsPageComponent } from './components/pages/user/interviews/interviews.component';
import { ContenderUserInterviewQuestionsPageComponent } from './components/pages/user/interview-questions/interview-questions.component';
import { ContenderUserInterviewAnswersPageComponent } from './components/pages/user/interview-answers/interview-answers.component';
import { ContenderUserSeminarsPageComponent } from './components/pages/user/seminars/seminars.component';
import { SeminarComponent } from './components/pages/seminar/seminar.component';
import { InterviewComponent } from './components/pages/interview/interview.component';
import { InterviewQuestionComponent } from './components/pages/interview-question/interview-question.component';
import { InterviewAnswerComponent } from './components/pages/interview-answer/interview-answer.component';

@NgModule({
  declarations: [
    AppComponent,
    ContenderWelcomePageComponent,
    ContenderUserPageComponent,
    ContenderUserHomePageComponent,
    ContenderUserSettingsPageComponent,
    ContenderUserInterviewsPageComponent,
    ContenderUserInterviewQuestionsPageComponent,
    ContenderUserInterviewAnswersPageComponent,
    ContenderUserSeminarsPageComponent,
    SeminarComponent,
    InterviewComponent,
    InterviewQuestionComponent,
    InterviewAnswerComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    CommonAppModule,
    ContenderAppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class ContenderAppModule { }
