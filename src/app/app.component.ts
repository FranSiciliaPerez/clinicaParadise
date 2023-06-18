import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FirebaseService } from './core/services/firebase/firebase-service';
import { LocaleService } from './core/services/locale.service';
import { UserService } from './core/services/user.service';
import { IonSplitPane, MenuController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements AfterViewInit{
  
  public appPages = [
    { title: 'Home', url: '/folder/Home', icon: 'home', /*otra manera de darle color al icono -> [style.color]="p.color" esto iria en el ion icon html y esto en est linea -> color: '#0f0'*/},
    { title: 'Residents', url: '/folder/Residents', icon: 'person' },
    { title: 'Carers', url: '/folder/Carers', icon: 'people' },
    { title: 'ResidentManage', url: '/folder/Managements', icon: 'folder' },
    { title: 'AboutMe', url: '/folder/aboutme', icon: 'heart' },
  ];
  public labels = [];
  constructor(
    private firebase:FirebaseService,
    private translate: TranslateService,
    private locale:LocaleService,
    public user:UserService,
    private router:Router,
    private menuController: MenuController,//creo q es esto
    private loadingCtrl: LoadingController
  ) {
    this.init();
    
  }
  private async init(){
    this.translate.setDefaultLang('en');
  }
  ngAfterViewInit(): void {
  
  }
  onLanguage(language:string){
    this.translate.setDefaultLang(language)
  }

  signOut(){
    this.user.signOut();
    this.router.navigate(['login']);
  }
  closeMenuToggle() {
    this.menuController.toggle(); //y esto
  }
  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      duration: 500,
    });

    loading.present();
  }

}
