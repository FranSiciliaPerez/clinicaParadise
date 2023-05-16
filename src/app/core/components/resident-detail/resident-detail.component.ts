import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Resident } from 'src/app/core/models/residents.model';
import { PhotoItem, PhotoService } from '../../services/photo.service';
import { PlatformService } from '../../services/platform.service';

@Component({
  selector: 'app-resident-detail',
  templateUrl: './resident-detail.component.html',
  styleUrls: ['./resident-detail.component.scss'],
})
export class ResidentDetailComponent implements OnInit {
  form: FormGroup;
  mode: 'New' | 'Edit' = 'New';
  currentImage = new BehaviorSubject<string>('');
  currentImage$ = this.currentImage.asObservable();
  @Input('resident') set resident(resident: Resident) {
    if (resident) {
      this.form.controls.id.setValue(resident.id);
      this.form.controls.docId.setValue(resident.docId);
      this.form.controls.first_name.setValue(resident.first_name);
      this.form.controls.last_name.setValue(resident.last_name);
      this.form.controls.nickname.setValue(resident.nickname);
      this.form.controls.picture.setValue(resident.picture);
      
      if (resident.picture) this.currentImage.next(resident.picture);
      this.form.controls.pictureFile.setValue(null);
      this.mode = 'Edit';
    }
  }

  constructor(
    public platform: PlatformService,
    private photoSvc: PhotoService,
    private fb: FormBuilder,
    private modal: ModalController,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      id: [null],
      docId: [''],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      nickname: ['', [Validators.required]],
      picture: [''],
      pictureFile: [null],
    });
  }

  ngOnInit() {}

  onSubmit() {
    this.modal.dismiss({ resident: this.form.value, mode: this.mode }, 'ok');
  }

  onDismiss(result) {
    this.modal.dismiss(null, 'cancel');
  }

  async changePic(
    fileLoader: HTMLInputElement,
    mode: 'library' | 'camera' | 'file'
  ) {
    var item: PhotoItem = await this.photoSvc.getPicture(mode, fileLoader);
    this.currentImage.next(item.base64);
    this.cdr.detectChanges();
    this.form.controls.pictureFile.setValue(item.blob);
  }
}
