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
import { UsersService } from 'projects/_common/src/app/services/users.service';
import { CommonModule } from '@angular/common';
import { GoogleMapsService } from 'projects/_common/src/app/services/google-maps.service';
import { catchError, flatMap, map, retry, take } from 'rxjs/operators';
import { of } from 'rxjs';
import { ContenderAppModule } from 'projects/contender/src/app/app.module';
import { MyfavorsAppModule } from 'projects/myfavors/src/app/app.module';
import { StripeService } from 'projects/_common/src/app/services/stripe.service';

function APP_INITIALIZER_FACTORY(
  clientService: ClientService,
  userService: UsersService,
  googleMapsService: GoogleMapsService,
  stripeService: StripeService,
) {
  // function APP_INITIALIZER_FN(
  //   resolve: (value: unknown) => void,
  //   reject: (reasom?: any) => any
  // ) {
  //   clientService.getXsrfToken()
  //     .pipe(flatMap((token, index) => {
  //       // console.log('APP_INITIALIZER (xsrf token) - admit one', clientService);
  //       return userService.checkUserSession().pipe(take(1));
  //     }))
  //     .pipe(flatMap((user, index) => {
  //       // console.log('APP_INITIALIZER (user) - admit one', { user });
  //       return googleMapsService.loadGoogleMaps();
  //     }))
  //     .pipe(flatMap((user, index) => {
  //       // console.log('APP_INITIALIZER (user) - admit one', { user });
  //       return stripeService.loadStripe();
  //     }))
  //     .pipe(flatMap((stripe_loaded, index) => {
  //       // console.log('APP_INITIALIZER (google maps) - admit one', googleMapsService);
  //       resolve(stripe_loaded);
  //       return of();
  //     }))
  //     .pipe(
  //       map(() => {
  //         console.log(`done APP_INITIALIZERS`);
  //       }),
  //       catchError((error: any) => {
  //         console.log(error);
  //         resolve(false);
  //         throw error;
  //       })
  //     )
  //     .toPromise();
  // }

  function APP_INITIALIZER_FN(
    resolve: (value: unknown) => void,
    reject: (reasom?: any) => any
  ) {
    clientService.getXsrfToken()
      .pipe(
        flatMap((token, index) => {
          // console.log('APP_INITIALIZER (xsrf token) - admit one', clientService);
          return userService.checkUserSession().pipe(take(1));
        }),
        flatMap((user, index) => {
          // console.log('APP_INITIALIZER (user) - admit one', { user });
          return googleMapsService.loadGoogleMaps();
        }),
        flatMap((user, index) => {
          // console.log('APP_INITIALIZER (user) - admit one', { user });
          return stripeService.loadStripe();
        }),
        flatMap((stripe_loaded, index) => {
          // console.log('APP_INITIALIZER (google maps) - admit one', googleMapsService);
          resolve(stripe_loaded);
          return of(undefined);
        }),
        flatMap((value, index) => {
          console.log(`\n\nDone App Initializations\n\n\n`);
          return of();
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
    // MyfavorsAppModule,
    // TravellrsAppModule,
    // ContenderAppModule,
    // HotspotAppModule,

    
    AppRoutingModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [
        ClientService,
        UsersService,
        GoogleMapsService,
        StripeService,
      ],
      useFactory: APP_INITIALIZER_FACTORY
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
