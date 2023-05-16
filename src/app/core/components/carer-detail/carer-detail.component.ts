import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Carer } from 'src/app/core/models/carers.model';
import { PhotoItem, PhotoService } from '../../services/photo.service';
import { PlatformService } from '../../services/platform.service';

@Component({
  selector: 'app-carer-detail',
  templateUrl: './carer-detail.component.html',
  styleUrls: ['./carer-detail.component.scss'],
})
export class CarerDetailComponent implements OnInit {

  form:FormGroup;
  mode:"New" | "Edit" = "New";
  currentImage = new BehaviorSubject<string>("");
  currentImage$ = this.currentImage.asObservable();
  @Input('carerdata') set carer(carer:Carer){
    if(carer){
      this.form.controls.id.setValue(carer.id);
      this.form.controls.docId.setValue(carer.docId);
      this.form.controls.name.setValue(carer.name);
      this.form.controls.picture.setValue(carer.picture);
      this.form.controls.description.setValue(carer.description);
      this.form.controls.picture.setValue(carer.picture);
      if(carer.picture)
        this.currentImage.next(carer.picture);
      this.mode = "Edit";
    }
  }
  

  constructor(
    public platform:PlatformService,
    private photoSvc:PhotoService,
    private cdr:ChangeDetectorRef,
    private fb:FormBuilder,
    private modal:ModalController
  ) { 
    this.form = this.fb.group({
      id:[null],
      docId:[''],
      name:['', [Validators.required]],
      picture:[''],
      description:['', [Validators.required]],
      pictureFile:[null]
    });
  }

  ngOnInit() {

  }

  onSubmit(){
    
    this.modal.dismiss({carer: this.form.value, mode:this.mode}, 'ok');
  }

  onDismiss(result){
    this.modal.dismiss(null, 'cancel');
  }

  async changePic(fileLoader:HTMLInputElement, mode:'library' | 'camera' | 'file'){
    var item:PhotoItem = await this.photoSvc.getPicture(mode, fileLoader);
    this.currentImage.next(item.base64);
    this.cdr.detectChanges();
    this.form.controls.pictureFile.setValue(item.blob);
  }
}

