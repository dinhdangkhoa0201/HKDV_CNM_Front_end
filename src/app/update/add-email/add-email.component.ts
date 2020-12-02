import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NotifyErrorComponent} from '../../notify/notify-error/notify-error.component';
import {NotifySuccessComponent} from '../../notify/notify-success/notify-success.component';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../../_services/auth.service';
import {MatStepper} from '@angular/material/stepper';
import {UserService} from '../../_services/user.service';
import {TokenStorageService} from '../../_services/token-storage.service';

@Component({
  selector: 'app-add-email',
  templateUrl: './add-email.component.html',
  styleUrls: ['./add-email.component.css']
})
export class AddEmailComponent implements OnInit {
  emailForm: FormGroup;
  otpForm: FormGroup;

  /*---*/
  @ViewChild('stepper') private stepper: MatStepper;
  isLoading: boolean;

  constructor(private toast: ToastrService, private authService: AuthService, private userService: UserService, private token: TokenStorageService) {
  }

  ngOnInit(): void {
    this.isLoading = false;

    this.emailForm = new FormGroup({
      email: new FormControl('')
    });
    this.otpForm = new FormGroup({
      otp: new FormControl('')
    });
  }

  get email(): any {
    return this.emailForm.get('email').value;
  }

  get otp(): any {
    return this.otpForm.get('otp').value;
  }

  hasError(controlName, errorName, form): boolean {
    return form.controls[controlName].hasError(errorName);
  }

  sendOTPWithEmail(): void {
    if (this.email.trim().length === 0) {
      this.toastError('Chưa nhập email');
    } else {
      this.authService.isExistedEmail(this.email).subscribe(
        data => {
          if (data === false) {
            this.sendOTPEmail();
          } else {
            this.toastError('Email đã được sử dụng!');
          }
        }, error => {
          console.log('error sendOTPWithEmail', error);
        }
      );
    }
  }

  sendOTPEmail(): void {
    this.isLoading = true;
    this.authService.sendOTPToEmail(this.email).subscribe(
      data => {
        console.log('sendOTPWithEmail isExistedEmail', data);
        if (data !== null) {
          this.isLoading = false;
          this.goNextStepper();
          this.toastSuccess('Mã đã được gửi tới Email');
        } else {
          this.toastError('Loi');
        }
      }, error => {
        console.log('sendOTPWithEmail isExistedEmail ', error);
      }
    );
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

  verifyOTP(): void {
    if (this.otp.length === 0) {
      this.otpForm.get('otp').setErrors([Validators.required]);
      this.otpForm.markAllAsTouched();
    } else {
      this.authService.verifyOTPCode(this.email, this.otp).subscribe(
        data => {
          if (data === true) {
            this.toastSuccess('Mã OTP chính xác');
            this.updateEmail();
          } else {
            this.toastError('Mã OTP không chính xác');
          }
        }, error => {
          console.log('verifyOTP verifyOTPCode', error);
        }
      );
    }
  }

  updateEmail(): void{
    this.userService.updateEmail(this.token.getUser().userId, this.email).subscribe(
      data => {
        if (data !== null) {
          this.toastSuccess('Cập nhật Email thành công');
          this.token.saveUser(data);
          this.goNextStepper();
        } else {
          this.toastError('Cập nhật Email không thành công');
        }
      }, error => {
        console.log('error updatePhone', error);
      }
    );
  }
}
