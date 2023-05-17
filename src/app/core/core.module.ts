import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { ResidentComponent,  ManageComponent,  ManageDetailComponent, CarerComponent, CarerDetailComponent } from '.'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, Platform } from '@ionic/angular';
import { ResidentDetailComponent, } from '.';
import { ResidentSelectableComponent } from './components/resident-selectable/resident-selectable.component';
import {  CarerSelectableComponent } from './components/carer-selectable/carer-selectable.component';
import es from '@angular/common/locales/es';
import en from '@angular/common/locales/en';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { createTranslateLoader } from './utils/translate';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';

registerLocaleData(en);
registerLocaleData(es);

@NgModule({
  declarations: [
    ResidentComponent,
    ResidentDetailComponent,
    CarerComponent,
    CarerDetailComponent,
    ResidentSelectableComponent,
    CarerSelectableComponent,
    ManageComponent,
    ManageDetailComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule.forRoot(),
    HttpClientModule,
    TranslateModule.forChild({
      loader: {
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [HttpClient]
      }
      }),
    ReactiveFormsModule
  ],
  exports:[
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ResidentComponent,
    ResidentDetailComponent,
    CarerComponent,
    CarerDetailComponent,
    ResidentSelectableComponent,
    CarerSelectableComponent,
    HttpClientModule,
    ManageComponent,
    ManageDetailComponent,


  ],
  providers:[
    {
      provide: LOCALE_ID,
      useValue: 'es'
    },
    Camera,
    File
  ]
})
export class CoreModule { }
