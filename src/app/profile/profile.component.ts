import { SseService } from './../_services/sse.service';
import { EventEmitter } from 'events';
import { FileService } from './../_services/file.service';
import { TokenStorageService } from './../_services/token-storage.service';
import { Component, OnInit, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../_services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifyErrorComponent } from '../notify/notify-error/notify-error.component';
import { NotifySuccessComponent } from '../notify/notify-success/notify-success.component';
import validate = WebAssembly.validate;
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  avatarSrc: string;
  currentUser: any;
  informationUser: FormGroup;
  editable: boolean;
  isLoggedIn: boolean;
  changePassword: FormGroup;
  hideCurrentPassword: boolean;
  file: any;
  hideNewPassword: boolean;
  hideConfirmPassword: boolean;
  timeSnackbar = 2000;


  constructor(private token: TokenStorageService, private userService: UserService, private snackbar: MatSnackBar, private toast: ToastrService, private fileService: FileService, private sseService: SseService) {
  }

  ngOnInit(): void {
    this.informationUser = new FormGroup({
      userName: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      birthday: new FormControl('', [Validators.required]),
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
        userName: this.currentUser.userName,
        gender: this.currentUser.gender,
        birthday: this.currentUser.birthday,
      });
      this.sseService.changeAvatarSource(this.currentUser.url !== "" ? this.currentUser.url : null);
      this.sseService.currentAvatar.subscribe(avatarSrc => this.avatarSrc = avatarSrc);
    }

    this.editable = false;

    this.hideCurrentPassword = true;
    this.hideNewPassword = true;
    this.hideConfirmPassword = true;
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
    if (this.informationUser.invalid) {
      this.toastError('Chưa nhập đủ thông tin cần thiết');
      this.informationUser.markAllAsTouched();
    } else {
      if (confirm('Bạn có muốn lưu?')) {
        this.userService.updateInformationUser(this.currentUser.userId, this.informationUser.getRawValue()).subscribe(
          data => {
            this.toastSuccess('Thông tin cá nhân cập nhật thành công');
            this.token.saveUser(data);
            this.reloadPage();
          },
          error => {
            console.log('err ', error);
            this.toastError('Thông tin cá nhân cập nhật không thành công');
          }
        );
      }
      this.editable = false;
    }
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
      this.toastError('Chưa nhập Mật khẩu hiệu tại');
    } else if (!this.newPassword) {
      this.toastError('Chưa nhập Mật khẩu mới');
    } else if (!this.confirmNewPassword) {
      this.toastError('Chưa nhập Xác nhận mật khẩu mới');
    } else if (this.confirmNewPassword !== this.newPassword) {
      this.toastError('Mật khẩu xác nhận không chính xác');
    } else {
      if (confirm('Bạn có muốn đổi mật khẩu?')) {
        this.userService.updatePassword(this.currentUser.userId, this.changePassword.get('currentPassword').value, this.changePassword.get('newPassword').value)
          .subscribe(data => {
            console.log('updatePassword data : ', data);
            if (data) {
              this.toastSuccess('Đổi mật khẩu thành công');
              window.location.reload();
            } else {
              this.toastError('Sai mật khẩu');
            }
          }, error => {
            console.log('submitChangePassword err ', error);
          });
      }
    }
  }

  toastError(message): void {
    this.toast.error(message);
  }

  toastSuccess(message): void {
    this.toast.success(message);
  }

  onFileChange(event): void {
    this.file = event.target.files[0];
    this.userService.uploadAvatar(this.file, this.currentUser.userId).subscribe(res => {
      this.currentUser = res;
      this.avatarSrc = res.url;
      this.sseService.changeAvatarSource(this.avatarSrc);
    })
  }
}
