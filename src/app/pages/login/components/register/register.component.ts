import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { PasswordValidation } from 'src/app/core/utils/password-validator';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  form:FormGroup;
  constructor(
    private formBuilder:FormBuilder,
    private modalCtrl:ModalController,
    private modal:ModalController,
    private loadingCtrl: LoadingController
  ) {
    this.form = this.formBuilder.group({
      first_name:["", Validators.required],
      last_name:["", Validators.required],
      email:["", [Validators.required, Validators.email]],
      password:["", Validators.required],
      confirmPassword:["", Validators.required],
      checkbox: ["false", Validators.requiredTrue]
    },{validator:[PasswordValidation.passwordMatch, PasswordValidation.passwordProto]});
  }

  ngOnInit() {}

  onRegister(){
    this.modalCtrl.dismiss({
      email:this.form.value.email,
      username:this.form.value.email,
      password:this.form.value.password,
      first_name:this.form.value.first_name,
      last_name:this.form.value.last_name
    }, 'ok');
  }

  hasFormError(error){
    return this.form?.errors && Object.keys(this.form.errors).filter(e=>e==error).length==1;
  }
  
  errorsToArray(errors){
  
    if(errors && !('required' in errors))
      return [Object.keys(errors)[0]];
    else
      return [];
  }
  onDismiss(result) {
    this.modal.dismiss(null, 'cancel');
  } 
  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      duration: 500,
    });

    loading.present();
  }
}
