import { Injectable } from '@angular/core';
import { DocumentData } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import { Carer } from 'src/app/core/models/carers.model';
import { environment } from 'src/environments/environment';
import { HttpClientProvider } from './http-client.provider';

import { FileUploaded, FirebaseService } from './firebase/firebase-service';
import { File } from '@awesome-cordova-plugins/file/ngx'
import { Platform } from '@ionic/angular';
import { blobToBase64, dataURLtoBlob } from '../utils/blobs';

@Injectable({
  providedIn: 'root'
})
export class CarersService {

  private _carersSubject:BehaviorSubject<Carer[]> = new BehaviorSubject([]);
  public carers$ = this._carersSubject.asObservable();

  unsubscr;
  constructor(
    private platform:Platform,
    private firebase:FirebaseService,
    private file:File
  ) {
    this.unsubscr = this.firebase.subscribeToCollection('carers',this._carersSubject, this.mapCarer);
  }

  ngOnDestroy(): void {
    this.unsubscr();
  }

  private mapCarer(doc:DocumentData){
    return {
      id:0,
      docId:doc.id,
      name:doc.data().name,
      description:doc.data().description,
      picture:doc.data().picture,
    };
  }

  getCarers(){
    return this._carersSubject.value;
  }

  getCarerById(id:string):Promise<Carer>{
    return new Promise<Carer>(async (resolve, reject)=>{
      try {
        var carer = (await this.firebase.getDocument('carers', id));
        resolve({
          id:0,
          docId:carer.id,
          name:carer.data.name,
          description:carer.data.description,
          picture:carer.data.picture,
        });  
      } catch (error) {
        reject(error);
      }
    });
  }

  async deleteCarer(carer:Carer){
    await this.firebase.deleteDocument('carers', carer.docId);
  } catch (error) {
    console.log(error);
  }

  async addCarer(carerdata:Carer){
    var _carer = {
      id:0,
      docId:carerdata.docId,
      name:carerdata.name,
      description:carerdata.description,
    };
    if(carerdata['pictureFile']){
      var response = await this.uploadImage(carerdata['pictureFile']);
      _carer['picture'] = response.image;
    }
    try {
      await this.firebase.createDocument('carers', _carer);  
    } catch (error) {
      console.log(error);
    }
  }

  uploadImage(file):Promise<any>{  
    return new Promise(async (resolve, reject)=>{
      try {
        const data = await this.firebase.imageUpload(file);  
        resolve(data);
      } catch (error) {
        resolve(error);
      }
    });
  }

  async updatecarer(carerdata:Carer){
    var _carer = {
      id:0,
      docId:carerdata.docId,
      name:carerdata.name,
      description:carerdata.description,
    };
    if(carerdata['pictureFile']){
      var response:FileUploaded = await this.uploadImage(carerdata['pictureFile']);
      _carer['picture'] = response.file;
    }
    try {
      await this.firebase.updateDocument('carers', _carer.docId, _carer);  
    } catch (error) {
      console.log(error);
    }
  }

  async writeToFile(){
    var dataToText = JSON.stringify(this._carersSubject.value);
    var data = new Blob([dataToText], {type: 'text/plain'});
    this.firebase.fileUpload(data, 'text/plain', 'carers', '.txt');
  }
}
