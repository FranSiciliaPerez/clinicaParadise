import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonAccordionGroup } from '@ionic/angular';
import { Resident, Carer } from '../../models';
import { CarersService } from '../../services';


export const TASK_PROFILE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CarerSelectableComponent),
  multi: true
};


@Component({
  selector: 'app-carer-selectable',
  templateUrl: './carer-selectable.component.html',
  styleUrls: ['./carer-selectable.component.scss'],
  providers:[TASK_PROFILE_VALUE_ACCESSOR]
})
export class CarerSelectableComponent implements OnInit, ControlValueAccessor {

  selectedCarer:Carer=null;
  propagateChange = (_: any) => { }
  isDisabled:boolean = false;

  constructor(
    private tasksSvc:CarersService
  ) { }


  async writeValue(obj: any) {
    try {
      if(obj!='')
        this.selectedCarer = await this.tasksSvc.getCarerById(obj);
    } catch (error) {
      console.log("No se han podido recuperar los datos: "+ error);
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

  getCarers(){
    return this.tasksSvc.getCarers();
  } 

  onCarerClicked(carerdata:Carer, accordion:IonAccordionGroup){
    this.selectedCarer = carerdata;
    accordion.value='';
    this.propagateChange(this.selectedCarer.docId);
  }

}
