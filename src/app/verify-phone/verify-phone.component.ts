import {AfterViewInit, Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {WindowService} from '../_services/window.service';
import * as firebase from 'firebase';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../environments/environment.prod';
import {AngularFireAuth} from '@angular/fire/auth';
import {AuthService} from '../_services/auth.service';

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

@Component({
  selector: 'app-verify-phone',
  templateUrl: './verify-phone.component.html',
  styleUrls: ['./verify-phone.component.css']
})
export class VerifyPhoneComponent implements OnInit {
    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }
/*  public verifyPhoneForm: FormGroup;
  public verifyEmailForm: FormGroup;

  @Input() isRegister: boolean;

  @Output() isVerify = new EventEmitter<boolean>();

  isVerifyPhoneSuccess: boolean;
  isVerifyEmailSuccess: boolean;

  isExistedPhone: boolean;
  isExistedEmail: boolean;

  errMessage: string;



  PHONE_REGEXP = /^[0-9]{10}$/i;
  EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;


  constructor(private win: WindowService, public fireAuthService: AngularFireAuth, private authService: AuthService) {
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
    this.isExistedPhone = false;
    this.isExistedEmail = false;
    this.errMessage = '';
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

    console.log('phone : ' + this.phone);
    console.log('phone : ' + this.modifyPhone(this.phone));

    this.authService.isExistedPhone(this.phone).subscribe(
      data => {
        this.isExistedPhone = data;
        console.log(('exist phone before : ' + this.isExistedPhone));
        this.sendCode();
      }, err => {
        this.errMessage = err.error.message;
      }
    );
  }

  sendCode(): void {
    const appVerifier = this.windowRef.recaptchaVerifier;
    if (this.isExistedPhone === false) {
      firebase.auth()
        .signInWithPhoneNumber(this.modifyPhone(this.phone), appVerifier)
        .then(result => {
          this.windowRef.confirmationResult = result;
        })
        .catch(error => console.log('error', error));
    }
  }


  verifyLoginCode(): void {
    this.windowRef.confirmationResult
      .confirm(this.verificationCode)
      .then(result => {
        console.log(result);
        sessionStorage.setItem('phone', this.phone);
        this.isVerifyEmailSuccess = true;
        this.isVerifyPhoneSuccess = true;

        this.isVerify.emit(this.isVerifyPhoneSuccess);
        this.isVerify.emit(this.isVerifyEmailSuccess);
      })
      .catch(error => console.log(error, 'Incorrect code entered?'));
  }*/

}
