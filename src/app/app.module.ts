import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot({
      name: 'testCoordinateStorageDb',
      storeName: 'testCoordinateStorage',
      driverOrder: [Drivers.SecureStorage, Drivers.IndexedDB, Drivers.LocalStorage]
  }),
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
