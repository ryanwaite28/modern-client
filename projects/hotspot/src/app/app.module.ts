import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonAppModule } from 'projects/_common/src/app/app.module';

import { HotspotAppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonAppModule,
    HotspotAppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class HotspotAppModule { }
