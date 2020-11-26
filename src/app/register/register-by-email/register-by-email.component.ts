import {Component, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../_services/auth.service';
import {User} from '../../_interfaces/user';
import {ResponseOTP} from '../../_interfaces/responseOTP';
import {uniqueEmailValidator} from '../../_services/unique-email-validator.directive';
import {ResponseAfterRegister} from '../../_interfaces/response-after-register';
import {RequestLogin} from '../../_request/request-login';
import {TokenStorageService} from '../../_services/token-storage.service';
import {Router} from '@angular/router';
import {AppRoutingModule} from '../../app-routing.module';
import {EventEmitter} from 'events';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NotifyErrorComponent} from '../../notify/notify-error/notify-error.component';
import {NotifySuccessComponent} from '../../notify/notify-success/notify-success.component';

@Component({
  selector: 'app-register-by-email',
  templateUrl: './register-by-email.component.html',
  styleUrls: ['./register-by-email.component.css']
})
export class RegisterByEmailComponent implements OnInit {
  checkEmail: FormGroup;
  informationUser: FormGroup;
  checkOTP: FormGroup;
  editable: boolean;
  isChecking: boolean;
  isSentOTP: boolean;
  isLoading: boolean;
  sendOTPSuccess: boolean;

  responseOTP: ResponseOTP;
  verifyOTPSuccess: boolean;
  sendOTPToVerify: boolean;
  beVerifyingOTP: boolean;
  registerSuccess: boolean;


  hidePassword: boolean;
  hideConfirmPassword: boolean;

  @Output() loginin: EventEmitter<boolean> = new EventEmitter();

  responseAfterRegister: ResponseAfterRegister;


  constructor(private formBuilder: FormBuilder, private authService: AuthService, private tokenStorage: TokenStorageService, private router: Router, private snackbar: MatSnackBar) {
    this.checkEmail = this.formBuilder.group({
      email: new FormControl('', [])
    });
  }

  ngOnInit(): void {
    this.checkOTP = this.formBuilder.group({
      otp: new FormControl('', [Validators.required])
    });
    this.informationUser = this.formBuilder.group({
      userName: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      birthday: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required])
    });
    this.isLoading = false;
    this.isChecking = false;
    this.editable = false;

    this.isSentOTP = false;
    this.sendOTPSuccess = false;

    this.beVerifyingOTP = false;
    this.verifyOTPSuccess = false;
    this.sendOTPToVerify = false;

    this.registerSuccess = false;


    this.hidePassword = true;
    this.hideConfirmPassword = true;

    this.informationUser.setValue({
      userName: 'Đinh Đăng Khoa',
      gender: 'Nam',
      birthday: '1999-10-02',
      password: '123456789',
      confirmPassword: '123456789'
    });
  }

  hasError(controlName, errorName, form): boolean {
    return form.controls[controlName].hasError(errorName);
  }

  noWhitespaceValidator(control: FormControl): any {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : {whitespace: true};
  }

  get currentUser(): any {
    return this.tokenStorage.getUser();
  }

  get email(): any {
    return this.checkEmail.get('email').value;
  }

  get otp(): any {
    return this.checkOTP.get('otp').value;
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

  checkIsEmail(): void {
    if (this.email.trim().length === 0) {
      this.snackbarError('Chưa nhập Email');
    } else {
      this.authService.isExistedEmail(this.email)
        .subscribe(
          data => {
            console.log('data isExistedEmail :', data);
            if (data === false) {
              this.snackbarSuccess('Email hợp lệ!');
              this.sendOTP();
              this.isSentOTP = true;
              this.isLoading = true;
            } else {
              this.snackbarError('Email đã được sử dụng, vui lòng nhập Email khác!');
            }
          }, error => {
            console.log('error isExistedEmail before sendOTPEmail ', error);
          }
        );
    }
  }

  sendOTP(): void {
    this.authService.sendOTPToEmail(this.email)
      .subscribe(
        data => {
          this.responseOTP = data;
          console.log('data sendOTPToEmail : ', this.responseOTP);
          this.isLoading = false;
          this.sendOTPSuccess = true;
          this.snackbarSuccess('Mã OTP đã được gửi tới Email cửa bạn, vui lòng kiểm tra Email!');
        },
        error => {
          console.log('err: ', error);
          this.snackbarError('Lỗi, không gửi được mã OTP');
        }
      );
  }


  onSubmit(): void {
    if (this.informationUser.invalid) {
      this.snackbarError('Bạn phải nhập đầy đủ thông tin!');

    } else {
      const user: User = {
        userId: this.responseOTP.userId,
        userName: this.informationUser.get('userName').value,
        gender: this.informationUser.get('gender').value,
        birthday: this.informationUser.get('birthday').value,
        phone: '',
        email: this.checkEmail.get('email').value,
        password: this.informationUser.get('password').value,
        roles: ['user'],
        enable: true,
      };
      this.authService.registerByEmail(user).subscribe(
        data => {
          if (data === true) {
            this.responseAfterRegister = data;
            this.registerSuccess = true;
            console.log('data register After register : ', this.responseAfterRegister);
            this.snackbarSuccess('Đăng ký thành công!');
          }
        },
        error => {
          console.log('error : ', error);
          this.snackbarError('Đăng ký không thành công!');
        }
      );
    }
  }

  verifyOTP(): void {
    if (this.otp.trim().length === 0) {
      this.snackbarError('Chưa nhập mã OTP');
    } else {
      this.authService.verifyOTPCode(this.responseOTP.userId, this.email, this.otp).subscribe(
        data => {
          console.log('data verify : ', data);
          this.beVerifyingOTP = true;
          this.verifyOTPSuccess = data;
        },
        error => {
          console.log('error : ', error);
        }
      );
    }
  }

  signIn(): void {
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
}

export class FormFieldPrefixSuffixExample {
  hide = true;
}
