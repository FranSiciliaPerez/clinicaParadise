import * as moment from 'moment-timezone';

import { Injectable } from '@angular/core';
import { Manage } from '../models/manage.model';
import { BehaviorSubject, from, lastValueFrom, map, of, tap } from 'rxjs';
import { HttpClientProvider } from './http-client.provider';

import { FirebaseService } from './firebase/firebase-service';
import { DocumentData } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ManageService {

  

  private _ManagesSubject:BehaviorSubject<Manage[]> = new BehaviorSubject([]);
  public Manages$ = this._ManagesSubject.asObservable();


  unsubscr;
  constructor(
    private firebase:FirebaseService
  ) {
    this.unsubscr = this.firebase.subscribeToCollection('residentManage',this._ManagesSubject, this.mapManage);
  }

  ngOnDestroy(): void {
    this.unsubscr();
  }

  private mapManage(doc:DocumentData){
    return {
      id:0,
      docId:doc.id,
      residentId:doc.data().residentId,
      carerId:doc.data().carerId,
    };
  }


  getManages(){
    
    return this._ManagesSubject.value;
  }

  getManageById(id:string){
    return new Promise<Manage>(async (resolve, reject)=>{
      try {
        var response = (await this.firebase.getDocument('residentManage', id));
        resolve({
          id:0,
          docId:response.id,
          residentId:response.data.residentId,
          carerId:response.data.carerId,
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  getManagesBy(field, value){
    return new Promise<Manage[]>(async (resolve, reject)=>{
      try {
        var _Manage = (await this.firebase.getDocumentsBy('residentManage', field, value)).map<Manage>(doc=>{
          return {
            id:0,
            docId:doc.id,
            residentId:doc.data.residentId,
            carerId:doc.data.carerId,
          }
        });
        resolve(_Manage);  
      } catch (error) {
        reject(error);
      }
    });
  }

  getManagesByCarerId(carerId:string):Promise<Manage[]>{
    return this.getManagesBy('carerId', carerId);
  }

  
  getManagesByResidentId(residentId:string):Promise<Manage[]>{   
    return this.getManagesBy('residentId', residentId);
  }

  async deleteManageById(id:string){
    try {
      await this.firebase.deleteDocument('residentManage', id);
    } catch (error) {
      console.log(error);
    }
  }

  async addManage(Manage:Manage){
    try {
      await this.firebase.createDocument('residentManage', Manage);  
    } catch (error) {
      console.log(error);
    }
  }

  async updateManage(Manage:Manage){
    try {
      await this.firebase.updateDocument('residentManage', Manage.docId, Manage);
    } catch (error) {
      console.log(error);
    }
  }
}
