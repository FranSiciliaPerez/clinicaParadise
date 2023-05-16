import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { isLowResolution as lowres} from 'src/app/utils/screen.utils';
import { IonItemSliding } from '@ionic/angular';
import { Resident, ResidentService} from 'src/app/core';

@Component({
  selector: 'app-resident',
  templateUrl: './resident.component.html',
  styleUrls: ['./resident.component.scss'],
})
export class ResidentComponent implements OnInit {


  @Output() onEdit = new EventEmitter;
  @Output() onDelete = new EventEmitter;
  @Input() _resident:Resident;
  isLowResolution:()=>boolean = lowres;
  
  constructor(
  ){}

  ngOnInit(
  ) {

  }

  onEditClick(slide:IonItemSliding){
    slide.close();
    this.onEdit.emit(this._resident);
  }

  onDeleteClick(slide:IonItemSliding){
    slide.close();
    this.onDelete.emit(this._resident);
  }

}
