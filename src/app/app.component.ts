import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FirebaseService } from './core/services/firebase/firebase-service';
import { LocaleService } from './core/services/locale.service';
import { UserService } from './core/services/user.service';
import { IonSplitPane, MenuController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';//simbolo circular de carga
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements AfterViewInit {

  public appPages = [
    { title: 'Home', url: '/folder/Home', icon: 'home', /*otra manera de darle color al icono -> [style.color]="p.color" esto iria en el ion icon html y esto en est linea -> color: '#0f0'*/ },
    { title: 'Residents', url: '/folder/Residents', icon: 'person' },
    { title: 'Carers', url: '/folder/Carers', icon: 'people' },
    { title: 'ResidentManage', url: '/folder/Managements', icon: 'folder' },
    { title: 'AboutMe', url: '/folder/aboutme', icon: 'heart' },
  ];
  public labels = [];
  constructor(
    private firebase: FirebaseService,
    private translate: TranslateService,
    private locale: LocaleService,
    public user: UserService,
    private router: Router,
    private menuController: MenuController,
    private loadingCtrl: LoadingController,//simbolo circular de carga
    private alert:AlertController,
  ) {
    this.init();
  }

  private async init() {
    this.translate.setDefaultLang('en');
  }
  ngAfterViewInit(): void {

  }
  onLanguage(language: string) {
    this.translate.setDefaultLang(language)
  }


  async logOut(){//ventana de alerta cuando pulse el boton de cerrar sesion
    const alert = await this.alert.create({
      header: '¿Are you sure you want to close the sesion?',
      buttons: [
        {
          text: 'Yes',
          role: 'confirm',
          handler: async () => {
            console.log()
            this.user.signOut();
            this.router.navigate(['login']);
            const loading = await this.loadingCtrl.create({
              message: 'Loading...',
              duration: 500,
            });
        
            loading.present();
          },
        },
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log("Operation canceled");
          },
        },
        
      ],
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();
  }
  closeMenuToggle() {
    this.menuController.toggle();
  }
  async showLoading() {//simbolo circular de carga
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      duration: 500,
    });

    loading.present();
  }
}
