import {TokenStorageService} from './../_services/token-storage.service';
import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../_services/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NotifyErrorComponent} from '../notify/notify-error/notify-error.component';
import {NotifySuccessComponent} from '../notify/notify-success/notify-success.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  informationUser: FormGroup;
  editable: boolean;
  isLoggedIn: boolean;
  changePassword: FormGroup;
  hideCurrentPassword: boolean;
  hideNewPassword: boolean;
  hideConfirmPassword: boolean;
  timeSnackbar = 5000;


  constructor(private token: TokenStorageService, private userService: UserService, private snackbar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.informationUser = new FormGroup({
      userId: new FormControl(''),
      userName: new FormControl(''),
      gender: new FormControl(''),
      birthday: new FormControl(''),
      phone: new FormControl(''),
      email: new FormControl(''),
    });
    this.changePassword = new FormGroup({
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required]),
      confirmNewPassword: new FormControl('', [Validators.required]),
    });
    this.currentUser = this.token.getUser();
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }

    if (this.currentUser !== null) {
      this.informationUser.setValue({
        userId: this.currentUser.userId,
        userName: this.currentUser.userName,
        gender: this.currentUser.gender,
        birthday: this.currentUser.birthday,
        phone: this.currentUser.phone,
        email: this.currentUser.email
      });
    }

    this.editable = false;

    this.hideCurrentPassword = true;
    this.hideNewPassword = true;
    this.hideConfirmPassword = true;
  }

  get userId(): any {
    return this.informationUser.get('userId');
  }

  get email(): any {
    return this.informationUser.get('email');
  }

  get phone(): any {
    return this.informationUser.get('phone');
  }

  hasError(controlName, errorName, form): boolean {
    return form.controls[controlName].hasError(errorName);
  }


  updateInformation(): void {
    if (confirm('Bạn có muốn lưu?')) {
      this.userService.updateInformationUser(this.userId.value, this.informationUser.getRawValue()).subscribe(
        data => {
          this.snackbarSuccess('Thông tin cá nhân cập nhật thành công');
          this.token.saveUser(data);
          this.reloadPage();
        },
        error => {
          console.log('err ', error);
          this.snackbarError('Thông tin cá nhân cập nhật không thành công');
        }
      );
    }
    this.editable = false;
  }

  reloadPage(): void {
    window.location.reload();
  }

  get currentPassword(): any {
    return this.changePassword.get('currentPassword').value;
  }

  get newPassword(): any {
    return this.changePassword.get('newPassword').value;
  }

  get confirmNewPassword(): any {
    return this.changePassword.get('confirmNewPassword').value;
  }

  submitChangePassword(): void {
    if (!this.currentPassword) {
      this.snackbar.openFromComponent(NotifyErrorComponent, {
        data: {
          content: 'Chưa nhập Mật khẩu hiệu tại'
        },
        duration: this.timeSnackbar,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['mat-toolbar', 'mat-primary']
      });
    } else if (!this.newPassword) {
      this.snackbar.openFromComponent(NotifyErrorComponent, {
        data: {
          content: 'Chưa nhập Mật khẩu mới'
        },
        duration: this.timeSnackbar,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['mat-toolbar', 'mat-primary']
      });
    } else if (!this.confirmNewPassword) {
      this.snackbar.openFromComponent(NotifyErrorComponent, {
        data: {
          content: 'Chưa nhập Xác nhận mật khẩu mới'
        },
        duration: this.timeSnackbar,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['mat-toolbar', 'mat-primary']
      });
    } else {
      this.userService.updatePassword(this.currentUser.userId, this.changePassword.get('currentPassword').value, this.changePassword.get('newPassword').value)
        .subscribe(res => {
          console.log('res : ', res);
        });
    }
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
