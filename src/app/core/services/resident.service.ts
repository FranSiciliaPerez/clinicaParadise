import { Injectable, OnDestroy } from '@angular/core';
import { DocumentData } from 'firebase/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Resident } from '../models/residents.model';
import { FileUploaded, FirebaseService } from './firebase/firebase-service';
import { HttpClientProvider } from './http-client.provider';

@Injectable({
  providedIn: 'root'
})
export class ResidentService{

  private _residentSubject:BehaviorSubject<Resident[]> = new BehaviorSubject([]);
  public resident$ = this._residentSubject.asObservable();
  
  unsubscr;
  constructor(
    private firebase:FirebaseService
  ) {
    this.unsubscr = this.firebase.subscribeToCollection('resident',this._residentSubject, this.mapResident);
  }

  ngOnDestroy(): void {
    this.unsubscr();
  }

  private mapResident(doc:DocumentData){
    return {
      id:0,
      docId:doc.id,
      first_name:doc.data().first_name,
      last_name:doc.data().last_name,
      nickname:doc.data().nickname,
      picture:doc.data().picture,
    };
  }

  getResidents(){
    return this._residentSubject.value;

  }

  getResidentById(id:string):Promise<Resident>{
    return new Promise<Resident>(async (resolve, reject)=>{
      try {
        var resident = (await this.firebase.getDocument('resident', id));
        resolve({
          id:0,
          docId:resident.id,
          first_name:resident.data.first_name,
          last_name:resident.data.last_name,
          nickname:resident.data.nickname,
          picture:resident.data.picture, 
        });  
      } catch (error) {
        reject(error);
      }
    });
  }

  async deleteResident(resident:Resident){
    try {
      await this.firebase.deleteDocument('resident', resident.docId);  
    } catch (error) {
      console.log(error);
    }
  }

  async addResident(resident:Resident){
    var _resident = {
      docId:resident.id,
      first_name:resident.first_name,
      last_name:resident.last_name,
      nickname:resident.nickname,
    };
    if(resident['pictureFile']){
      var response = await this.uploadImage(resident['pictureFile']);
      _resident['picture'] = response.image;
    }
    try {
      await this.firebase.createDocument('resident', _resident);  
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

  async updateResident(resident:Resident){
    var _resident = {
      docId:resident.docId,
      first_name:resident.first_name,
      last_name:resident.last_name,
      nickname:resident.nickname,
    };
    if(resident['pictureFile']){
      var response:FileUploaded = await this.uploadImage(resident['pictureFile']);
      _resident['picture'] = response.file;
    }
    try {
      await this.firebase.updateDocument('resident', resident.docId, _resident);  
    } catch (error) {
      console.log(error);
    }
      
  }
}
