import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../_services/auth.service';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment.prod';
import { WindowService } from '../../_services/window.service';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { User } from '../../_interfaces/user';
import { ResponseAfterRegister } from '../../_interfaces/response-after-register';
import { RequestLogin } from '../../_request/request-login';
import { TokenStorageService } from '../../_services/token-storage.service';
import { uniquePhoneValidator } from '../../_services/unique-phone-validator.directive';
import { NotifyErrorComponent } from '../../notify/notify-error/notify-error.component';
import { NotifySuccessComponent } from '../../notify/notify-success/notify-success.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { ToastrService } from 'ngx-toastr';

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

  @ViewChild('stepper') private stepper: MatStepper;


  constructor(private authService: AuthService, private win: WindowService, private fireAuthService: AngularFireAuth, private tokenStorage: TokenStorageService, private snackbar: MatSnackBar, private toast: ToastrService) {
    this.windowRef = this.win.windowRef;
  }


  ngOnInit(): void {
    this.checkPhone = new FormGroup({
      phone: new FormControl('', [])
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

  get phone(): any {
    return this.checkPhone.get('phone').value;
  }

  get otp(): any {
    return this.verifyOTP.get('otp').value;
  }

  get userName(): any {
    return this.informationUser.get('userName').value;
  }

  get gender(): any {
    return this.informationUser.get('gender').value;
  }

  get birthday(): any {
    return this.informationUser.get('birthday').value;
  }

  get password(): any {
    return this.informationUser.get('password').value;
  }

  get confirmPassword(): any {
    return this.informationUser.get('confirmPassword').value;
  }

  ngAfterViewInit(): void {
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container-phone');
    this.windowRef.recaptchaVerifier.render();
  }

  hasError(controlName, errorName, form): boolean {
    return form.controls[controlName].hasError(errorName);
  }

  checkExistingPhone(): void {
    if (this.phone.length !== 10) {
      this.checkPhone.controls.phone.setErrors({
        required: true
      });
      this.checkPhone.markAllAsTouched();
      this.toastError('Số điện thoại không hợp lệ');
    } /*else if (typeof this.windowRef.confirmationResult === 'undefined') {
      this.snackbarError('Hãy xác nhận reCAPTCHA');
    }*/ else {
      console.log('this.windowRef.recaptchaVerifier : ', this.windowRef.recaptchaVerifier);
      this.authService.isExistedPhone(this.phone).subscribe(
        data => {
          console.log('data isExistedPhone: ', data);
          if (data === true) {
            this.toastError('Số điện thoại đã tồn tại, vui lòng nhập số khác!');
          } else {
            this.isSentOtp = true;
            this.isExistingPhone = false;
            this.sendCodeToPhone();
          }
        },
        error => {
          console.log('error : ', error);
        }
      );
    }
  }

  sendCodeToPhone(): void {
    firebase.auth()
      .signInWithPhoneNumber(this.modifyPhone(this.phone), this.windowRef.recaptchaVerifier)
      .then(result => {
        this.windowRef.confirmationResult = result;
        console.log('result signInWithPhoneNumber ', result);
        this.toastSuccess('Mã OTP sẽ được gửi tới Số điện thoại của bạn, hãy kiểm tra tin nhắn');
      })
      .catch(error => {
        console.log('error', error);
      });
  }

  modifyPhone(phone): any {
    return '+84' + phone.substring(1);
  }

  checkOTP(): void {
    if (this.otp.length === 0) {
      this.verifyOTP.controls.otp.setErrors({
        required: true
      });
      this.verifyOTP.markAllAsTouched();
      this.toastError('Chưa nhập Mã OTP');
    } else {
      this.windowRef.confirmationResult
        .confirm(this.verifyOTP.get('otp').value)
        .then(result => {
          if (result) {
            console.log('result : ', result);
            this.haveCheckedOTP = true;
            this.verifyOTPSuccess = true;
            this.goNext();
          }
        })
        .catch(error => {
          console.log(error, 'Incorrect code entered?');
          this.checkOTPn = true;
          this.toastError('Mã OTP không chính xác');
        });
    }
  }

  onSubmit(): void {
    if (this.informationUser.invalid) {
      this.informationUser.markAllAsTouched();
      this.toastError('Bạn phải nhập đầy đủ thông tin!');
    } else {
      const user: User = {
        userId: 0,
        userName: this.userName,
        gender: this.gender,
        birthday: this.birthday,
        phone: this.phone,
        email: '',
        password: this.password,
        roles: 'user',
        enable: true,
        url: ''
      };

      this.authService.registerByPhone(user).subscribe(
        data => {
          if (data !== null) {
            console.log('data registerByPhone : ', data);
            this.responseAfterRegister = data;
            this.registerSuccess = true;
            this.toastSuccess('Đăng ký thành công');
            this.goNext();
          }
        },
        error => {
          console.log('error : ', error);
        }
      );
    }
  }

  signIn(): void {
    const temp: RequestLogin = {
      phoneEmail: this.phone,
      password: this.password
    };
    this.authService.signIn(temp).subscribe(
      data => {
        console.log('data sign in ', data);
        if (typeof data !== 'boolean') {
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

  toastError(message): void {
    this.toast.error(message);
  }

  toastSuccess(message): void {
    this.toast.success(message);
  }

  reloadPage(): void {
    window.location.reload();
    window.location.href = '/profile';
  }

  goBack(): void {
    this.stepper.previous();
  }

  goNext(): void {
    this.stepper.next();
  }
}
