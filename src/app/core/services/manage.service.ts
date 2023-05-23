import * as moment from 'moment-timezone';

import { Injectable } from '@angular/core';
import { Manage } from '../models/manage.model';
import { BehaviorSubject, from, lastValueFrom, map, of, tap } from 'rxjs';
import { FirebaseService } from './firebase/firebase-service';
import { DocumentData } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ManageService {

  

  private _managesSubject:BehaviorSubject<Manage[]> = new BehaviorSubject([]);
  public manages$ = this._managesSubject.asObservable();


  unsubscr;
  constructor(
    private firebase:FirebaseService
  ) {
    this.unsubscr = this.firebase.subscribeToCollection('residentManages',this._managesSubject, this.mapManage);
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
    
    return this._managesSubject.value;
  }

  getManageById(id:string){
    return new Promise<Manage>(async (resolve, reject)=>{
      try {
        var response = (await this.firebase.getDocument('residentManages', id));
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
        var _manage = (await this.firebase.getDocumentsBy('residentManages', field, value)).map<Manage>(doc=>{
          return {
            id:0,
            docId:doc.id,
            residentId:doc.data.residentId,
            carerId:doc.data.carerId,
          }
        });
        resolve(_manage);  
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
      await this.firebase.deleteDocument('residentManages', id);
    } catch (error) {
      console.log(error);
    }
  }

  async addManage(manage:Manage){
    try {
      await this.firebase.createDocument('residentManages', manage);  
    } catch (error) {
      console.log(error);
    }
  }

  async updateManage(manage:Manage){
    try {
      await this.firebase.updateDocument('residentManages', manage.docId, manage);
    } catch (error) {
      console.log(error);
    }
  }
}
