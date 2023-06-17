import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ManageService } from 'src/app/core/services/manage.service';
import { CarerDetailComponent } from '../../../../core/components/carer-detail/carer-detail.component';
import { CarersService } from 'src/app/core/services/carers.service';
import { Carer } from 'src/app/core/models/carers.model';

@Component({
  selector: 'app-carers',
  templateUrl: './carers.component.html',
  styleUrls: ['./carers.component.scss'],
})
export class CarersComponent implements OnInit {

  constructor(
    private alert:AlertController,
    private modal:ModalController,
    private CarersSvc:CarersService,
    private manageSvc:ManageService
  ) { }

  ngOnInit() {}
  
  getCarers(){
    return this.CarersSvc.carers$;
  }

  async presentCarerForm(carerdata:Carer){
    const modal = await this.modal.create({
      component:CarerDetailComponent,
      componentProps:{
        carer:carerdata
      },
    });
    modal.present();
    modal.onDidDismiss().then(result=>{
      if(result && result.data){
        switch(result.data.mode){
          case 'New':
            this.CarersSvc.addCarer(result.data.carer);
            break;
          case 'Edit':
            this.CarersSvc.updatecarer(result.data.carer);
            break;
          default:
        }
      }
    });
  }

  onEditCarer(carerdata){
    this.presentCarerForm(carerdata);
  }

  async onDeleteAlert(carerdata){

    const alert = await this.alert.create({
      header: 'Atention',
      message: '¿Are you sure you want to erase the selected carer?',
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
            this.CarersSvc.deleteCarer(carerdata);
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

  async onCarerExistsAlert(carerdata){
    const alert = await this.alert.create({
      header: 'Error',
      message: 'Is not posible to erase it because is asigned to a resident',
      buttons: [
        {
          text: 'Close',
          role: 'close',
          handler: () => {
          
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }
  
  async onDeleteCarer(carerdata){
    
    if((await this.manageSvc.getManagesByCarerId(carerdata.docId)).length==0)
      this.onDeleteAlert(carerdata);
    else
      this.onCarerExistsAlert(carerdata);
  }

  async onExport(){
    this.CarersSvc.writeToFile();
  }

}
