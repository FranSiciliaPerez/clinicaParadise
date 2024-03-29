import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ManageDetailComponent, ManageService } from 'src/app/core';
import { Manage } from 'src/app/core/models/manage.model';


@Component({
  selector: 'app-managements',
  templateUrl: './pairings.component.html',
  styleUrls: ['./pairings.component.scss'],
})
export class ManagementsComponent implements OnInit {

  constructor(
    private manageSvc:ManageService,
    private modal:ModalController,
    private alert:AlertController
  ) { }

  ngOnInit() {}

  getManages(){
    return this.manageSvc.manages$;
  }

  async presentManageForm(manage:Manage){
    const modal = await this.modal.create({
      component:ManageDetailComponent,
      componentProps:{
        manage:manage
      },
    });
    modal.present();
    modal.onDidDismiss().then(result=>{
      if(result && result.data){
        switch(result.data.mode){
          case 'New':
            this.manageSvc.addManage(result.data.manage);
            break;
          case 'Edit':
            this.manageSvc.updateManage(result.data.manage);
            break;
          default:
        }
      }
    });
  }

  onEditManage(manage){
    this.presentManageForm(manage);
  }

  async onDeleteAlert(manage){
    const alert = await this.alert.create({
      header: '¿Are you sure you want to erase the selected assignation?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log("Operation canceled");
          },
        },
        {
          text: 'Erase',
          role: 'confirm',
          handler: () => {
            console.log(manage)
            this.manageSvc.deleteManageById(manage.docId);
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

  onDeleteManage(manage){
    this.onDeleteAlert(manage);
  }

}
