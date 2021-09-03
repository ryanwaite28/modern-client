import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HttpClientModule, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { CommonAppModule } from 'projects/_common/src/app/app.module';
import { HotspotAppModule } from 'projects/hotspot/src/app/app.module';
import { DeliverMeAppModule } from 'projects/deliverme/src/app/app.module';
import { TravellrsAppModule } from 'projects/travellrs/src/app/app.module';
import { ClientService } from 'projects/_common/src/app/services/client.service';
import { UserService } from 'projects/_common/src/app/services/user.service';
import { CommonModule } from '@angular/common';
import { XsrfTokenInterceptor } from 'projects/_common/src/app/http-interceptors/xsrf-token.http-interceptor';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    
    /* apps */
    
    CommonAppModule,
    DeliverMeAppModule,
    TravellrsAppModule,
    // HotspotAppModule,

    
    AppRoutingModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: XsrfTokenInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [
        UserService,
        ClientService,
      ],
      useFactory: (userService: UserService, clientService: ClientService) => {
        return () => {
          const getUserPromise = new Promise((resolve, reject) => {
            userService.checkUserSession().subscribe({
              next: (user) => {
                console.log('APP_INITIALIZER (user) - admit one', { user });
                return resolve(true);
              },
              error: (error: HttpErrorResponse) => {
                console.log('APP_INITIALIZER (user) - error', error);
                return resolve(true);
              }
            });
          });

          const getXsrfTokenPromise = new Promise((resolve, reject) => {
            clientService.sendRequest(`/common/utils/get-xsrf-token`, `GET`).subscribe({
              next: (response) => {
                console.log('APP_INITIALIZER (xsrf token) - admit one', response);
                return resolve(true);
              },
              error: (error: HttpErrorResponse) => {
                console.log('APP_INITIALIZER (xsrf token) - error', error);
                return resolve(true);
              }
            });
          });

          return Promise.all([
            getUserPromise,
            getXsrfTokenPromise,
          ]);
        }
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
