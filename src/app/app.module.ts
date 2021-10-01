import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HttpClientModule, HttpClientXsrfModule, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { GoogleMapsService } from 'projects/_common/src/app/services/google-maps.service';
import { catchError, flatMap, map, retry, take } from 'rxjs/operators';
import { of } from 'rxjs';
import { ContenderAppModule } from 'projects/contender/src/app/app.module';
import { MyfavorsAppModule } from 'projects/myfavors/src/app/app.module';

function APP_INITIALIZER_FACTORY(
  clientService: ClientService,
  userService: UserService,
  googleMapsService: GoogleMapsService,
) {
  function APP_INITIALIZER_FN(
    resolve: (value: unknown) => void,
    reject: (reasom?: any) => any
  ) {
    clientService.getXsrfToken()
      .pipe(flatMap((token, index) => {
        // console.log('APP_INITIALIZER (xsrf token) - admit one', clientService);
        return userService.checkUserSession().pipe(take(1));
      }))
      .pipe(flatMap((user, index) => {
        // console.log('APP_INITIALIZER (user) - admit one', { user });
        return googleMapsService.loadGoogleMaps();
      }))
      .pipe(flatMap((value, index) => {
        // console.log('APP_INITIALIZER (google maps) - admit one', googleMapsService);
        resolve(true);
        return of();
      }))
      .pipe(
        map(() => {
          console.log(`done APP_INITIALIZERS`);
        }),
        catchError((error: any) => {
          console.log(error);
          resolve(false);
          throw error;
        })
      )
      .toPromise();
  }

  function returnFactoryFn() {
    return new Promise(APP_INITIALIZER_FN);
  }

  return returnFactoryFn;
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: `xsrf-token`,
      headerName: `x-xsrf-token`,
    }),
    
    /* apps */
    
    CommonAppModule,

    DeliverMeAppModule,
    TravellrsAppModule,
    ContenderAppModule,
    HotspotAppModule,
    MyfavorsAppModule,

    
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
        ClientService,
        UserService,
        GoogleMapsService,
      ],
      useFactory: APP_INITIALIZER_FACTORY
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
