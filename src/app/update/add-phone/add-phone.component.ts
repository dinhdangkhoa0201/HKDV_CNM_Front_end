import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {WindowService} from '../../_services/window.service';
import * as firebase from 'firebase';
import {environment} from '../../../environments/environment.prod';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../../_services/auth.service';
import {MatStepper} from '@angular/material/stepper';
import {UserService} from '../../_services/user.service';
import {TokenStorageService} from '../../_services/token-storage.service';

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
  selector: 'app-add-phone',
  templateUrl: './add-phone.component.html',
  styleUrls: ['./add-phone.component.css']
})
export class AddPhoneComponent implements OnInit, AfterViewInit {
  editable: boolean;
  windowRef: any;
  /*---*/
  phoneForm: FormGroup;

  /*---*/
  @ViewChild('stepper') private stepper: MatStepper;
  otpForm: FormGroup;

  constructor(private win: WindowService, private toast: ToastrService, private authService: AuthService, private userService: UserService, private token: TokenStorageService) {
    this.windowRef = this.win.windowRef;
  }

  ngOnInit(): void {
    this.editable = true;
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }

    this.phoneForm = new FormGroup({
      phone: new FormControl('', [])
    });
    this.otpForm = new FormGroup({
      otp: new FormControl('', [])
    });

  }

  get phone(): any {
    return this.phoneForm.get('phone').value;
  }

  get otp(): any {
    return this.otpForm.get('otp').value;
  }

  ngAfterViewInit(): void {
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    this.windowRef.recaptchaVerifier.render();
  }

  hasError(controlName, errorName, form): boolean {
    return form.controls[controlName].hasError(errorName);
  }

  sendOTPToPhone(): void {
    if (this.phone.length === 0) {
      this.phoneForm.get('phone').setErrors([Validators.required]);
      this.phoneForm.markAllAsTouched();
      this.toastError('Chưa nhập Số điện thoại');
    } else {
      this.authService.sendOTPWithPhone(this.phone).subscribe(
        data => {
          console.log('sendOTPWithPhone sendOTPWithPhone ', data);
          if (data !== null) {
            this.toastError('Số điện thoại đã được sử dụng!');
          } else {
            this.sendOTP();
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
        this.toastSuccess('Mã OTP sẽ được gửi tới Số điện thoại của bạn, hãy kiểm tra tin nhắn');
        this.goNextStepper();
      })
      .catch(error => {
        console.log('error', error);
      });
  }

  verifyOTP(): void {
    if (this.otp.length === 0) {
      this.otpForm.get('otp').setErrors([Validators.required]);
      this.otpForm.markAllAsTouched();
      this.toastError('Chưa nhập Mã OTP');
    } else {
      this.checkOTP();
    }
  }

  checkOTP(): void {
    this.windowRef.confirmationResult
      .confirm(this.otp)
      .then(result => {
        console.log('result : ', result);
        this.toastSuccess('Mã OTP chính xác');
        this.updatePhone();
      })
      .catch(error => {
        console.log(error, 'Incorrect code entered?');
        /*        this.checkOTPn = true;*/
        this.toastError('Mã OTP không chính xác!');
      });
  }

  updatePhone(): void {
    this.userService.updatePhone(this.token.getUser().userId, this.phone).subscribe(
      data => {
        if (data !== null) {
          this.toastSuccess('Thêm Số điện thoại thành công');
          this.token.saveUser(data);
          this.goNextStepper();
        } else {
          this.toastError('Thêm Số điện thoại không thành công');
        }
      }, error => {
        console.log('error updatePhone', error);
      }
    );
  }

  modifyPhone(phone): any {
    return '+84' + phone.substring(1);
  }

  toastError(message): void {
    this.toast.error(message);
  }

  toastSuccess(message): void {
    this.toast.success(message);
  }

  goNextStepper(): void {
    this.stepper.next();
  }


}
