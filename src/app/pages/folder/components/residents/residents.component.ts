import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ManageService } from 'src/app/core/services/manage.service';
import { ResidentDetailComponent } from 'src/app/core/components/resident-detail/resident-detail.component';
import { ResidentService } from 'src/app/core/services/resident.service';
import { Resident } from 'src/app/core/models/residents.model';

@Component({
  selector: 'app-residents',
  templateUrl: './residents.component.html',
  styleUrls: ['./residents.component.scss'],
})
export class ResidentsComponent implements OnInit {
  constructor(
    private residentsSvc: ResidentService,
    private manageSvc: ManageService,
    private modal: ModalController,
    private alert: AlertController,
  ) { }

  ngOnInit() { }

  getResidents() {
    return this.residentsSvc.resident$;
  }

  async presentResidentForm(residentData: Resident) {
    const modal = await this.modal.create({
      component: ResidentDetailComponent,
      componentProps: {
        resident: residentData
      },
    });
    modal.present();
    modal.onDidDismiss().then(result => {
      if (result && result.data) {
        switch (result.data.mode) {
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

  onEditResident(residentData) {
    this.presentResidentForm(residentData);
  }

  async onDeleteAlert(residentData) {
    const alert = await this.alert.create({
      header: 'Atention',
      message: '¿Are you sure you want to erase the selected resident?',
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
            this.residentsSvc.deleteResident(residentData);
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

  async onResidentExistsAlert(residentData) {
    const alert = await this.alert.create({
      header: 'Error',
      message: 'Is not posible to erase it because is asigned to a carer',
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

  async onDeleteResident(residentData) {
    if ((await this.manageSvc.getManagesByResidentId(residentData.docId)).length == 0)
      this.onDeleteAlert(residentData);
    else
      this.onResidentExistsAlert(residentData);
  }
  async onExport() {
    this.residentsSvc.writeToFile();
  }
}
