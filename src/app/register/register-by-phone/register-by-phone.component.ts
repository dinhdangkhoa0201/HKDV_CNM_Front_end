import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../_services/auth.service';
import {of} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../../environments/environment.prod';
import {WindowService} from '../../_services/window.service';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase';
import {User} from '../../_interfaces/user';
import {ResponseAfterRegister} from '../../_interfaces/response-after-register';
import {RequestLogin} from '../../_request/request-login';
import {TokenStorageService} from '../../_services/token-storage.service';
import {uniquePhoneValidator} from '../../_services/unique-phone-validator.directive';

const existingPhoneValidator = (authService: AuthService) => (c: FormControl) => {
  console.log('c : ', c.value);
  if (!c || String(c.value).length === 0) {
    return of(null);
  }

  return authService.isExistedPhone(c.value)
    .pipe(
      map((rs) => {
        console.log('rs : ', rs);
        return rs;
      })
    );
};

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
  selector: 'app-register-by-phone',
  templateUrl: './register-by-phone.component.html',
  styleUrls: ['./register-by-phone.component.css']
})
export class RegisterByPhoneComponent implements OnInit, AfterViewInit {
  checkPhone: FormGroup;
  verifyOTP: FormGroup;
  informationUser: FormGroup;
  editable: boolean;
  windowRef: any;
  isExistingPhone: boolean;
  isSentOtp: boolean;
  messageErrorCode: string;
  verifyOTPSuccess: boolean;
  haveCheckedOTP: boolean;
  responseAfterRegister: ResponseAfterRegister;
  registerSuccess: boolean;
  checkOTPn: boolean;
  hidePassword: boolean;
  hideConfirmPassword: boolean;

  ngOnInit(): void {
    this.checkPhone = new FormGroup({
      phone: new FormControl('', [], [uniquePhoneValidator(this.authService)])
    });
    this.verifyOTP = new FormGroup({
      otp: new FormControl('', [Validators.required])
    });
    this.informationUser = new FormGroup({
      userName: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      birthday: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required])
    });
    this.informationUser.setValue({
      userName: 'Đinh Đăng Khoa',
      gender: 'Nam',
      birthday: '1999-10-02',
      password: '123456789',
      confirmPassword: '123456789'
    });
    this.editable = true;
    this.isExistingPhone = true;
    this.isSentOtp = false;
    this.messageErrorCode = '';
    this.verifyOTPSuccess = false;
    this.haveCheckedOTP = false;
    this.registerSuccess = false;
    this.checkOTPn = false;

    this.hidePassword = true;
    this.hideConfirmPassword = true;
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
  }

  constructor(private authService: AuthService, private win: WindowService, private fireAuthService: AngularFireAuth, private tokenStorage: TokenStorageService) {
    this.windowRef = this.win.windowRef;
  }

  ngAfterViewInit(): void {
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container-phone');
    this.windowRef.recaptchaVerifier.render();
  }

  hasError(controlName, errorName, form): boolean {
    return form.controls[controlName].hasError(errorName);
  }

  checkExistingPhone(): void {
    this.authService.isExistedPhone(this.checkPhone.get('phone')).subscribe(
      data => {
        this.isExistingPhone = data;
        this.isSentOtp = true;
        if (this.isExistingPhone === false) {
          this.sendCodeToPhone();
        }
      },
      error => {
        console.log('error : ', error);
      }
    );
  }

  get phone(): any {
    return this.checkPhone.get('phone');
  }

  sendCodeToPhone(): void {
    firebase.auth()
      .signInWithPhoneNumber(this.modifyPhone(this.checkPhone.get('phone').value), this.windowRef.recaptchaVerifier)
      .then(result => {
        this.windowRef.confirmationResult = result;
      })
      .catch(error => {
        console.log('error', error.errors.message);
      });
  }

  modifyPhone(phone): any {
    return '+84' + phone.substring(1);
  }

  checkOTP(): void {
    this.windowRef.confirmationResult
      .confirm(this.verifyOTP.get('otp').value)
      .then(result => {
        if (result){
          console.log('result : ', result);
          this.haveCheckedOTP = true;
          this.verifyOTPSuccess = true;
        }
      })
      .catch(error => {
        console.log(error, 'Incorrect code entered?');
        this.checkOTPn = true;
      });
  }

  onSubmit(): void {
    const user: User = {
      userId: 0,
      userName: this.informationUser.get('userName').value,
      gender: this.informationUser.get('gender').value,
      birthday: this.informationUser.get('birthday').value,
      phone: this.checkPhone.get('phone').value,
      email: '',
      password: this.informationUser.get('password').value,
      roles: ['user'],
      enable: true,
    };

    this.authService.registerByPhone(user).subscribe(
      data => {
        if (data !== null){
          this.responseAfterRegister = data;
          this.registerSuccess = true;
        }
      },
      error => {
        console.log('error : ', error);
      }
    );
  }

  signIn(): void {
    const temp: RequestLogin = {
      phoneEmail: this.checkPhone.get('phone').value,
      password: this.informationUser.get('password').value
    };
    this.authService.signIn(temp).subscribe(
      data => {
        console.log('data sign in ', data);
        if (typeof data !== 'boolean'){
          this.tokenStorage.saveToken(data.accessToken);
          this.tokenStorage.saveUser(data);
          this.reloadPage();
          sessionStorage.setItem('isLoggedIn', String(true));
        }
      },
      error => {
        console.log('error : ', error);
      }
    );
  }

  reloadPage(): void {
    window.location.reload();
    window.location.href = '/profile';
  }
}
