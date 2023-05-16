import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { UserService } from 'src/app/core/services/user.service';
import { environment } from 'src/environments/environment';

import { ManageDetailComponent } from '../../core/components/pairing-detail/pairing-detail.component';
import { ResidentDetailComponent } from '../../core/components/resident-detail/resident-detail.component';
import { CarerDetailComponent } from '../../core/components/carer-detail/carer-detail.component';
import { ManageService } from '../../core/services/manage.service';
import { ResidentService } from '../../core/services/resident.service';
import { CarersService } from '../../core/services/carers.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;

  

  constructor(
    public user:UserService,
    private residentsSvc:ResidentService,
    private carersSvc:CarersService,
    private manageSvc:ManageService,
    private modal:ModalController,
    private activatedRoute: ActivatedRoute,
    private router:Router) { }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }

  async presentForm(_class, onDismiss:(any)=>void){
    const modal = await this.modal.create({
      component:_class,
      cssClass:"modal-full-right-side"
    });
    modal.present();
    modal.onDidDismiss().then(result=>{
      if(result && result.data){
        onDismiss(result.data);
      }
    });
  }

  onNewItem(){
    switch(this.folder){
      
      case 'Home':
        break;
      case 'Residents':
        this.presentForm(ResidentDetailComponent, (data)=>{
          this.residentsSvc.addResident(data.resident);
        });
        break;
      case 'Carers':
        
        this.presentForm(CarerDetailComponent, (data)=>{
          this.carersSvc.addCarer(data.carer);
        });
        break;
      case 'Managements':
        
        this.presentForm(ManageDetailComponent, (data)=>{
          this.manageSvc.addManage(data.manage);
        });
        break;
      default:
    }
  }
  
}
