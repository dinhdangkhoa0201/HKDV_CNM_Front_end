import {AfterViewInit, Component, OnInit} from '@angular/core';
import {WindowService} from '../_services/window.service';
import * as firebase from 'firebase';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../environments/environment.prod';
import {AngularFireAuth} from '@angular/fire/auth';

const config = {
  apiKey: environment.configFirebase.apiKey,
  authDomain: environment.configFirebase.authDomain,
  databaseURL: environment.configFirebase.databaseURL,
  projectId: environment.configFirebase.projectId,
  storageBucket: environment.configFirebase.storageBucket,
  messagingSenderId: environment.configFirebase.messagingSenderId,
  appId: environment.configFirebase.appId,
  measurementId: environment.configFirebase.messagingSenderId,
};

export class PhoneNumber {
  country: string;
  area: string;
  prefix: string;
  line: string;
  // format phone numbers as E.164
  get e164(): any {
    const num = this.country + this.area + this.prefix + this.line;
    return `+${num}`;
  }
}

@Component({
  selector: 'app-verify-phone',
  templateUrl: './verify-phone.component.html',
  styleUrls: ['./verify-phone.component.css']
})
export class VerifyPhoneComponent implements OnInit, AfterViewInit {
  windowRef: any;
  phone: string;
  phoneNumber = new PhoneNumber();
  verificationCode: string;

  isVerifyPhoneSuccess: boolean;
  isVerifyEmailSuccess: boolean;

  verifyPhoneForm: FormGroup;
  verifyEmailForm: FormGroup;
  PHONE_REGEXP = /^[0-9]{10}$/i;
  EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;


  constructor(private win: WindowService, public fireAuthService: AngularFireAuth) {
    this.windowRef = this.win.windowRef;
  }

  ngOnInit(): void {
    this.verifyPhoneForm = new FormGroup({
      phone: new FormControl('', [Validators.required, Validators.pattern(this.PHONE_REGEXP)])
    });
    this.verifyEmailForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(this.EMAIL_REGEXP)])
    });
    firebase.initializeApp(config);
    this.isVerifyEmailSuccess = false;
    this.isVerifyPhoneSuccess = false;
  }


  ngAfterViewInit(): void {
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    this.windowRef.recaptchaVerifier.render().then((widgetId) => {
      this.windowRef.recapchaWidgetId = widgetId;
    });
  }

  hasError(controlName, errorName): boolean {
    return this.verifyPhoneForm.controls[controlName].hasError(errorName);
  }

  sendLoginCode(): void {
    const appVerifier = this.windowRef.recaptchaVerifier;
    console.log('phone : ' + this.phone);
    console.log('phone : ' + this.modifyPhone(this.phone));

    firebase.auth()
      .signInWithPhoneNumber(this.modifyPhone(this.phone), appVerifier)
      .then(result => {
        this.windowRef.confirmationResult = result;
      })
      .catch(error => console.log('error', error));
  }

  modifyPhone(phone): any{
    return '+84' + phone.substring(1);
  }

  verifyLoginCode(): void {
    this.windowRef.confirmationResult
      .confirm(this.verificationCode)
      .then( result => {

        console.log(result);
        sessionStorage.setItem('phone', this.phone);
        
        this.isVerifyPhoneSuccess = true;
        this.isVerifyEmailSuccess = true;
      })
      .catch( error => console.log(error, 'Incorrect code entered?'));

  }

}
