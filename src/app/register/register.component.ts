import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from './../_services/auth.service';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {RequestRegister} from '../_request/request-register';
import {Router} from '@angular/router';
import {WindowService} from '../_services/window.service';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase';
import {environment} from '../../environments/environment.prod';

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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, AfterViewInit {
  isRegister = true;
  /* Form nhập SĐT - Email */
  verifyPhoneForm: FormGroup;
  verifyEmailForm: FormGroup;

  /* Form nhập code OTP */
  verifyPhoneCodeForm: FormGroup;
  verifyEmailCodeForm: FormGroup;

  /* Form nhập thông tin bổ sung */
  informUserForm: FormGroup;

  /* Xác nhận có tồn tại SĐT hay Email */
  isExistedPhone: boolean;
  isExistedEmail: boolean;

  /* Trạng thái đã gửi code hay chưa */
  isSentCode: boolean;

  /* Trạng thái có xác nhận mã OTP thành công hay không */
  isVerifiedCode: boolean;

  /* Trạng tháo xuất hiện lỗi */
  isErrorCode: boolean;

  /* Message lỗi */
  messageErrorCode: string;

  /* Trạng thái đăng ký thành công */
  registerSuccess: boolean;

  /* Trạng thái đang thực hiện đăng ký */
  isLoadingResults: boolean;

  /* Các thông tin để cho Firebase thực hiện việc gửi mã OTP */
  windowRefPhone: any;
  windowRefEmail: any;
  verificationCodePhone: string;
  verificationCodeEmail: string;
  phone: string;
  email: string;

  /* captchaPhone */
  /*  captchaPhone: any;
    captchaEmail: any;*/

  /* Regex */
  REGEX_USERNAME = '^[a-zA-Z0-9_ ]{3,}$';
  REGEX_PASSWORD = '^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z]).{6,}$';
  REGEX_EMAIL = '^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$';

  constructor(private authService: AuthService, private router: Router, private win: WindowService, public fireAuthService: AngularFireAuth, private formBuilder: FormBuilder) {
    this.windowRefPhone = this.win.windowRef;
    this.windowRefEmail = this.win.windowRef;
  }

  ngOnInit(): void {
    this.verifyPhoneForm = this.formBuilder.group({
      phone: new FormControl('', [Validators.required]),
    });

    this.verifyEmailForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.pattern(this.REGEX_EMAIL)]),
    });

    this.verifyPhoneCodeForm = this.formBuilder.group({
      verificationCodePhone: new FormControl('', [Validators.required, Validators.maxLength(6)]),
    });

    this.verifyEmailCodeForm = this.formBuilder.group({
      verificationCodeEmail: new FormControl('', [Validators.required]),
    });

    this.informUserForm = this.formBuilder.group({
      userName: new FormControl('', [Validators.required, Validators.pattern(this.REGEX_USERNAME)]),
      birthday: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required])
    });

    this.isExistedPhone = false;
    this.isExistedEmail = false;
    this.isSentCode = false;
    this.isErrorCode = true;
    this.isVerifiedCode = false;
    this.messageErrorCode = '';
    this.isLoadingResults = false;
    this.registerSuccess = false;


    firebase.initializeApp(config);

    this.phone = '';
    this.email = '';

  }

  /* Display reCaptCha */
  ngAfterViewInit(): void {
    this.windowRefPhone.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container-phone');
    this.windowRefPhone.recaptchaVerifier.render().then((widgetId) => {
      this.windowRefPhone = widgetId;
    });

    /*this.windowRefEmail.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container-email');

    this.captchaEmail = this.windowRefEmail.recaptchaVerifier;
    this.captchaEmail.render().then((widgetId) => {
      this.captchaEmail = widgetId;
    });
    */
  }

  hasError(controlName, errorName, form): boolean {
    return form.controls[controlName].hasError(errorName);
  }

  registerUser(user): void {

    console.log('user ' + user);
    if (this.informUserForm.valid) {
      const temp: RequestRegister = {
        userName: user.userName,
        birthday: user.birthday,
        phone: this.phone,
        email: this.email,
        password: user.password
      };

      console.log('register user : ' + JSON.stringify(temp));
      this.authService.register(temp).subscribe(
        data => {
          if (data.value === true) {
            this.registerSuccess = true;
          } else {
            this.registerSuccess = false;
          }
          console.log('data : ' + data);
          console.log('registerSuccess : ' + this.registerSuccess);
        },
        error => {
          console.log('error : ' + error.erros.message);
        }
      );
    }
  }

  checkExistEmail(): void {
    this.authService.isExistedEmail(this.email).subscribe(
      data => {
        this.isExistedEmail = data;
        this.isSentCode = true;
        console.log('exist email : ' + this.isExistedEmail);

        if (!this.isExistedEmail) {
          this.sendCodeToEmail();
        }
      },
      err => {
      }
    );
  }

  checkExistPhone(): void {
    this.authService.isExistedPhone(this.phone).subscribe(
      data => {
        this.isExistedPhone = data;
        this.isSentCode = true;

        /* Khi không tồn tại SĐT, sẽ kích hoạt firebase gửi tin nhắn OTP */
        if (!this.isExistedPhone) {
          this.sendCodeToPhone();
        }
        console.log('exist phone : ' + this.isExistedPhone);
      }, err => {
      }
    );
  }

  modifyPhone(phone): any {
    return '+84' + phone.substring(1);
  }

  sendCodeToEmail(): void {

    this.fireAuthService.createUserWithEmailAndPassword(this.email, this.email)
      .then((res) => {
        console.log(res);
        res.user.sendEmailVerification();
      })
      .catch((err) => {
        window.alert(err.message);
      });
  }

  checkEmailVerified(): void{
    this.fireAuthService.currentUser
      .then((res) => {
        console.log(res);
        console.log('email verified : ' + res.emailVerified);
        // this.isVerifiedCode = res
      })
      .then((err) => {});
  }

  sendCodeToPhone(): void {
    const appVerifier = this.windowRefPhone.recaptchaVerifier;
    if (this.isExistedPhone === false) {
      firebase.auth()
        .signInWithPhoneNumber(this.modifyPhone(this.phone), appVerifier)
        .then(result => {
          this.windowRefPhone.confirmationResult = result;
        })
        .catch(error => console.log('error', error));
    }
  }

  verifyLoginCode(): void {
    this.windowRefPhone.confirmationResult
      .confirm(this.verificationCodePhone)
      .then(result => {
        this.isLoadingResults = true;
        this.isErrorCode = true;
        this.isVerifiedCode = true;
        this.messageErrorCode = 'Mã xác nhận chính xác. Bạn hãy nhấn Next để chuyển sang bước tiếp theo';
        this.isLoadingResults = false;
      })
      .catch(error => {
        this.isErrorCode = false;
        this.messageErrorCode = 'Mã xác nhận không hợp lệ';
        console.log(error, 'Incorrect code entered?');
      });
  }

}
