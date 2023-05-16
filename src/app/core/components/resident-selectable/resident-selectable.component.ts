import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonAccordionGroup } from '@ionic/angular';
import { Resident } from '../../models';
import { ResidentService} from '../../services';


export const USER_PROFILE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ResidentSelectableComponent),
  multi: true
};


@Component({
  selector: 'app-resident-selectable',
  templateUrl: './resident-selectable.component.html',
  styleUrls: ['./resident-selectable.component.scss'],
  providers:[USER_PROFILE_VALUE_ACCESSOR]
})
export class ResidentSelectableComponent implements OnInit, ControlValueAccessor {

  selectedResident:Resident=null;
  propagateChange = (_: any) => { }
  isDisabled:boolean = false;

  constructor(
    private residentSvc:ResidentService
  ) { }


  async writeValue(obj: any) {
    try {
      this.selectedResident = await this.residentSvc.getResidentById(obj);  
    } catch (error) {
      console.log("No se ha podido recupera los datos: "+error);
    }
    
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  ngOnInit() {}

  getResidents(){
    return this.residentSvc.getResidents();
  } 

  onResidentClicked(r:Resident, accordion:IonAccordionGroup){
    this.selectedResident = r;
    accordion.value='';
    this.propagateChange(this.selectedResident.docId);
  }

}
