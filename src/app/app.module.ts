import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonSplitPane, IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { createTranslateLoader } from './core/utils/translate';
import { CoreModule } from './core/core.module';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { FirebaseService } from './core/services/firebase/firebase-service';
import { FirebaseWebService } from './core/services/firebase/web/firebase-web.service';

export function firebaseServiceFactory() {
  return  new FirebaseWebService();
}


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    CoreModule,
    TranslateModule.forRoot({
      loader: {
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [HttpClient]
      }
      }),
    AppRoutingModule,
    
    ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    HTTP,
    
    {
      provide: FirebaseService,
      deps: [],
      useFactory: firebaseServiceFactory
    },
  ],
    
  bootstrap: [AppComponent],
})
export class AppModule {}
