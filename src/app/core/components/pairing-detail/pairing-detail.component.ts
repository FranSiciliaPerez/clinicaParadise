import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ManageService } from 'src/app/core/services/manage.service';
import { CarersService } from 'src/app/core/services/carers.service';
import { ResidentService } from 'src/app/core/services/resident.service';
import { Resident, Manage} from '../../models';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-manage-detail',
  templateUrl: './pairing-detail.component.html',
  styleUrls: ['./pairing-detail.component.scss'],
})
export class ManageDetailComponent implements OnInit {

  form:FormGroup;
  mode:"New" | "Edit" = "New";

  @Input('manage') set manage(manage:Manage){
    console.log(manage)
    if(manage){
      this.form.controls.id.setValue(manage.id);
      this.form.controls.docId.setValue(manage.docId);
      this.form.controls.carerId.setValue(manage.carerId);
      this.form.controls.residentId.setValue(manage.residentId);
      this.mode = "Edit";
    }
  }
  

  
  constructor(
    private carerSvc:CarersService,
    private residentSvc:ResidentService,
    private managesSvc:ManageService,
    private fb:FormBuilder,
    private modal:ModalController,
    private translate:TranslateService
  ) { 
    this.form = this.fb.group({
      id:[0],
      docId:[0],
      carerId:['-1', [Validators.min(1)]],
      residentId:['-1', [Validators.min(1)]],
    });
  }

  async ngOnInit() {

  }

  onSubmit(){
    
    this.modal.dismiss({manage: this.form.value, mode:this.mode}, 'ok');
  }

  onDismiss(result){
    this.modal.dismiss(null, 'cancel');
  }


}
