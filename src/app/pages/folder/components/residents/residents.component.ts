import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ManageService } from 'src/app/core/services/manage.service';
import { ResidentDetailComponent} from 'src/app/core/components/resident-detail/resident-detail.component';
import { ResidentService} from 'src/app/core/services/resident.service';
import { Resident } from 'src/app/core/models/residents.model';

@Component({
  selector: 'app-residents',
  templateUrl: './residents.component.html',
  styleUrls: ['./residents.component.scss'],
})
export class ResidentsComponent implements OnInit {
  constructor(
    private residentsSvc:ResidentService,
    private manageSvc:ManageService,
    private modal:ModalController,
    private alert:AlertController,
  ) { }

  ngOnInit() {}

  getResidents(){
    return this.residentsSvc.resident$;
  }

  async presentResidentForm(resident:Resident){
    const modal = await this.modal.create({
      component:ResidentDetailComponent,
      componentProps:{
        resident:resident
      },
    });
    modal.present();
    modal.onDidDismiss().then(result=>{
      if(result && result.data){
        switch(result.data.mode){
          case 'New':
            this.residentsSvc.addResident(result.data.resident);
            break;
          case 'Edit':
            this.residentsSvc.updateResident(result.data.resident);
            break;
          default:
        }
      }
    });
  }

  onEditResident(resident){
    this.presentResidentForm(resident);
  }

  async onDeleteAlert(resident){
    const alert = await this.alert.create({
      header:'Atención',
      message: '¿Está seguro de que desear borrar al residente?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log("Operacion cancelada");
          },
        },
        {
          text: 'Borrar',
          role: 'confirm',
          handler: () => {
            this.residentsSvc.deleteResident(resident);
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

  async onResidentExistsAlert(resident){
    const alert = await this.alert.create({
      header: 'Error',
      message: 'No es posible borrar el residente porque está asignado a un cuidador',
      buttons: [
        {
          text: 'Cerrar',
          role: 'close',
          handler: () => {
          
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

  async onDeleteResident(resident){
      if((await this.manageSvc.getManagesByResidentId(resident.id)).length==0)
      this.onDeleteAlert(resident);
    else
      this.onResidentExistsAlert(resident);
  }
  async onExport(){
    this.residentsSvc.writeToFile();
  }
}
