import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NotifyErrorComponent} from '../notify/notify-error/notify-error.component';
import {NotifySuccessComponent} from '../notify/notify-success/notify-success.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from '../_services/auth.service';
import {UserService} from '../_services/user.service';
import {User} from '../_interfaces/user';
import {RequestLogin} from '../_request/request-login';
import {TokenStorageService} from '../_services/token-storage.service';
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
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit, AfterViewInit {
  responseOTP = {
    userId: '',
    state: false
  };

  user: any;

  passwordForm: FormGroup;
  emailForm: FormGroup;
  otpForm: FormGroup;

  isSentOTP: boolean;
  isLoading: boolean;
  sendOTPSuccess: boolean;
  verifyOTPSuccess: boolean;
  hide: any;

  changePassword: boolean;

  /*---*/
  phoneForm: FormGroup;

  windowRef: any;

  isSentOtp: boolean;

  constructor(private snackbar: MatSnackBar, private authService: AuthService, private userService: UserService,
              private tokenStorage: TokenStorageService, private win: WindowService, private fireAuthService: AngularFireAuth) {
    this.windowRef = this.win.windowRef;
  }


  ngAfterViewInit(): void {
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    this.windowRef.recaptchaVerifier.render();
  }

  ngOnInit(): void {
    this.emailForm = new FormGroup({
      email: new FormControl('', [])
    });

    this.otpForm = new FormGroup({
      otp: new FormControl('', [])
    });

    this.passwordForm = new FormGroup({
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required])
    });

    this.phoneForm = new FormGroup({
      phone: new FormControl('', [])
    });

    this.changePassword = false;
    this.isSentOTP = false;
    this.isLoading = false;
    this.sendOTPSuccess = false;
    this.verifyOTPSuccess = false;

    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }

    this.isSentOTP = false;
    this.isSentOtp = false;
  }

  get email(): any {
    return this.emailForm.get('email').value;
  }

  get otp(): any {
    return this.otpForm.get('otp').value;
  }

  get password(): any {
    return this.passwordForm.get('password').value;
  }

  get confirmPassword(): any {
    return this.passwordForm.get('confirmPassword').value;
  }

  get phone(): any {
    return this.phoneForm.get('phone').value;
  }

  onSubmitChangePassword(): void {
    if (this.password.trim().length === 0) {
      this.snackbarError('Chưa nhập Mật khẩu mới');
    } else if (this.confirmPassword.trim().length === 0) {
      this.snackbarError('Chưa nhập Xác nhận mật khẩu');
    } else if (this.password !== this.confirmPassword) {
      this.snackbarError('Xác nhận mật khẩu không chính xác');
    } else {
      this.userService.resetPassword(this.responseOTP.userId, this.password).subscribe(
        data => {
          console.log('onSubmitChangePassword resetPassword', data);
          if (data !== null) {
            this.responseOTP = data;
            this.changePassword = true;
            this.user = data;
            console.log('onSubmitChangePassword resetPassword user', this.user);
            this.snackbarSuccess('Đổi mật khẩu thành công!');
          } else {
            this.snackbarError('Đổi mật khẩu không thành công!');
          }
        }
      );
    }
  }

  sendOTPWithEmail(): void {
    if (this.email.trim().length === 0) {
      this.snackbarError('Chưa nhập email');
    } else {
      this.authService.isExistedEmail(this.email).subscribe(
        data => {
          if (data === false) {
            this.snackbarError('Không có tài khoảng nào được đăng ký bằng Email này!');
          } else {
            this.isSentOTP = true;
            this.isLoading = true;
            this.sendOTPEmail();
          }
        }, error => {
          console.log('error sendOTPWithEmail', error);
        }
      );
    }
  }

  sendOTPEmail(): void {
    this.authService.sendOTPWithEmail(this.email).subscribe(
      data => {
        this.isLoading = false;
        console.log('sendOTPWithEmail isExistedEmail', data);
        if (data !== null) {
          this.responseOTP.userId = data.userId;
          this.sendOTPSuccess = true;
        } else {
          this.snackbarError('Loi');
        }
      }, error => {
        console.log('sendOTPWithEmail isExistedEmail ', error);
      }
    );
  }

  snackbarError(message): void {
    this.snackbar.openFromComponent(NotifyErrorComponent, {
      data: {
        content: message
      },
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  snackbarSuccess(message): void {
    this.snackbar.openFromComponent(NotifySuccessComponent, {
      data: {
        content: message
      },
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  verifyOTP(): void {
    if (this.otp.trim().length === 0) {
      this.snackbarError('Chưa nhập Mã OTP');
    } else {
      this.authService.verifyOTPCode(this.responseOTP.userId, this.email, this.otp).subscribe(
        data => {
          if (data === true) {
            this.verifyOTPSuccess = true;
            this.snackbarSuccess('Mã OTP chính xác');
          } else {
            this.snackbarError('Mã OTP không chính xác');
          }
        }, error => {
          console.log('verifyOTP verifyOTPCode', error);
        }
      );
    }
  }

  signInByEmail(): void {
    const temp: RequestLogin = {
      phoneEmail: this.email,
      password: this.password
    };

    this.authService.signIn(temp).subscribe(
      (data) => {
        if (data !== null) {
          this.tokenStorage.saveUser(data);
          this.reloadPage();
          sessionStorage.setItem('isLoggedIn', String(true));
        } else {
          this.snackbarError('Đăng nhập không thành công!');
        }
      },
      (err) => {
        console.log('err : ', err);
      }
    );
  }

  reloadPage(): void {
    window.location.reload();
    window.location.href = '/profile';
  }

  /*-------------------*/


  sendOTPWithPhone(): void {
    if (this.phone.trim().length === 0) {
      this.snackbarError('Chưa nhập Số điện thoại');
    } else {
      this.authService.sendOTPWithPhone(this.phone).subscribe(
        data => {
          console.log('sendOTPWithPhone sendOTPWithPhone ', data);
          if (data !== null) {
            this.user = data;
            this.sendOTP();
          } else {
            this.snackbarError('Không có tài khoảng nào được đăng ký bằng Số điện thoại này!');
          }
        }, error => {

        }
      );
    }
  }

  sendOTP(): void {
    firebase.auth()
      .signInWithPhoneNumber(this.modifyPhone(this.phone), this.windowRef.recaptchaVerifier)
      .then(result => {
        this.windowRef.confirmationResult = result;
        this.snackbarSuccess('Mã OTP sẽ được gửi tới Số điện thoại của bạn, hãy kiểm tra tin nhắn');
        this.isSentOtp = true;
      })
      .catch(error => {
        console.log('error', error);
      });
  }

  checkOTP(): void {
    this.windowRef.confirmationResult
      .confirm(this.otp)
      .then(result => {
        console.log('result : ', result);
        this.snackbarSuccess('Mã OTP chính xác!');
        this.verifyOTPSuccess = true;
      })
      .catch(error => {
        console.log(error, 'Incorrect code entered?');
        /*        this.checkOTPn = true;*/
        this.snackbarError('Mã OTP không chính xác!');
      });
  }

  onSubmitChangePasswordByPhone(): void {
    if (this.password.trim().length === 0) {
      this.snackbarError('Chưa nhập Mật khẩu mới');
    } else if (this.confirmPassword.trim().length === 0) {
      this.snackbarError('Chưa nhập Xác nhận mật khẩu');
    } else if (this.password !== this.confirmPassword) {
      this.snackbarError('Xác nhận mật khẩu không chính xác');
    } else {
      this.userService.resetPassword(this.user.userId, this.password).subscribe(
        data => {
          console.log('onSubmitChangePassword resetPassword', data);
          if (data !== null) {
            this.responseOTP = data;
            this.changePassword = true;
            this.user = data;
            console.log('onSubmitChangePassword resetPassword user', this.user);
            this.snackbarSuccess('Đổi mật khẩu thành công!');
          } else {
            this.snackbarError('Đổi mật khẩu không thành công!');
          }
        }
      );
    }
  }

  signInByPhone(): void {
    const temp: RequestLogin = {
      phoneEmail: this.phone,
      password: this.password
    };

    this.authService.signIn(temp).subscribe(
      (data) => {
        if (data !== null) {
          this.tokenStorage.saveUser(data);
          this.reloadPage();
          sessionStorage.setItem('isLoggedIn', String(true));
        } else {
          this.snackbarError('Đăng nhập không thành công!');
        }
      },
      (err) => {
        console.log('err : ', err);
      }
    );
  }

  modifyPhone(phone): any {
    return '+84' + phone.substring(1);
  }
}
