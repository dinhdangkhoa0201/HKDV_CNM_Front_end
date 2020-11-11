import {TokenStorageService} from './../_services/token-storage.service';
import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../_services/user.service';

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


  constructor(private token: TokenStorageService, private userService: UserService) {
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
          this.token.saveToken(data.accessToken);
          this.token.saveUser(data);
          this.reloadPage();
        },
        error => {
          console.log('err ', error);
        }
      );
    }
    this.editable = false;
  }

  reloadPage(): void {
    window.location.reload();
  }

  submitChangePassword(): void {
    this.userService.updatePassword(this.currentUser.userId, this.changePassword.get('currentPassword').value, this.changePassword.get('newPassword').value)
      .subscribe(res => {
        console.log('res : ', res);
      });
  }
}
