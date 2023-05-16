import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Manage } from 'src/app/core/models/manage.model';
import { ManageService } from 'src/app/core/services/manage.service';
import { isLowResolution as lowres} from 'src/app/utils/screen.utils';
import { IonItemSliding } from '@ionic/angular';
import { ResidentService, } from 'src/app/core/services/resident.service';
import { CarersService } from 'src/app/core/services/carers.service';
import { Resident } from 'src/app/core/models/residents.model';
import { Carer } from 'src/app/core/models/carers.model';
import { LocaleService } from '../../services/locale.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-manage',
  templateUrl: './pairing.component.html',
  styleUrls: ['./pairing.component.scss'],
})
export class ManageComponent implements OnInit {

  @Output() onEdit = new EventEmitter;
  @Output() onDelete = new EventEmitter;
  @Input('Manage') set Manage(manage:Manage){
    this._manage = manage;
    this.loadCarerAndResident(manage);
  
  }
  private async loadCarerAndResident(manage:Manage){
    this._carer.next(await this.carersSvc.getCarerById(manage.carerId));
    this._resident.next(await this.residentSvc.getResidentById(manage.residentId));
  }
  getManage():Manage{
    return this._manage;
  }

  isLowResolution = lowres;
  private _manage:Manage;

  private _carer:BehaviorSubject<Carer> = new BehaviorSubject<Carer>(null);
  private _resident:BehaviorSubject<Resident> = new BehaviorSubject<Resident>(null);
  carer$:Observable<Carer> = this._carer.asObservable();
  resident$:Observable<Resident> = this._resident.asObservable();
  constructor(
    private residentSvc:ResidentService,
    private carersSvc:CarersService,
    public locale:LocaleService
  ){
    
  }

  ngOnInit(
  ) {

  }

  onEditClick(slide:IonItemSliding){
    slide.close();
    this.onEdit.emit(this._manage);
  }

  onDeleteClick(slide:IonItemSliding){
    slide.close();
    this.onDelete.emit(this._manage);
  }

  

}
