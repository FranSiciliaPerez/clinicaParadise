import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { isLowResolution as lowres} from 'src/app/utils/screen.utils';
import { IonItemSliding } from '@ionic/angular';
import {  Carer } from 'src/app/core/models/carers.model';

@Component({
  selector: 'app-carer',
  templateUrl: './carer.component.html',
  styleUrls: ['./carer.component.scss'],
})
export class CarerComponent implements OnInit {

  @Output() onEdit = new EventEmitter;
  @Output() onDelete = new EventEmitter;
  @Input() _carer:Carer;
  isLowResolution = lowres;
  constructor() { }

  ngOnInit() {}

  onEditClick(slide:IonItemSliding){
    slide.close();
    this.onEdit.emit(this._carer);
  }

  onDeleteClick(slide:IonItemSliding){
    slide.close();
    this.onDelete.emit(this._carer);
  }
}
