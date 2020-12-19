import { Component, HostListener, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AuthService } from '../../_services/auth.service';
import { debounceTime, map } from 'rxjs/operators';
import { User } from '../../_interfaces/user';
import { AdminService } from '../../_services/admin.service';

import { ToastrService } from 'ngx-toastr';
import { uniquePhoneValidator } from '../../_services/unique-phone-validator.directive';
import { uniqueEmailValidator } from '../../_services/unique-email-validator.directive';

@Component({
  selector: 'app-dialog-add-user',
  templateUrl: './dialog-add-user.component.html',
  styleUrls: ['./dialog-add-user.component.css']
})
export class DialogAddUserComponent implements OnInit {

  roleUser: boolean;
  roleAdmin: boolean;
  addUserForm: FormGroup;
  hide: boolean;
  hide_1: boolean;

  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<any>, private authService: AuthService, private adminService: AdminService, private toast: ToastrService) {
  }


  ngOnInit(): void {
    this.hide = false;
    this.hide_1 = false;
    this.dialogRef.updateSize('40%', '65%');

    this.addUserForm = this.formBuilder.group({
      userName: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      birthday: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required], [uniquePhoneValidator(this.authService)]),
      email: new FormControl('', [Validators.required], [uniqueEmailValidator(this.authService)]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
      roles: new FormControl(Array<string>(), [Validators.required]),
    });

    this.addUserForm.get('roles').value.push('ROLE_USER');
    this.roleUser = true;
    this.roleAdmin = false;
  }

  get userName(): any {
    return this.addUserForm.get('userName').value;
  }

  get gender(): any {
    return this.addUserForm.get('gender').value;
  }

  get birthday(): any {
    return this.addUserForm.get('birthday').value;
  }

  get phone(): any {
    return this.addUserForm.get('phone').value;
  }

  get email(): any {
    return this.addUserForm.get('email').value;
  }

  get password(): any {
    return this.addUserForm.get('password').value;
  }

  get confirmPassword(): any {
    return this.addUserForm.get('confirmPassword').value;
  }

  hasError(controlName, errorName): boolean {
    return this.addUserForm.controls[controlName].hasError(errorName);
  }

  closeDialog(): void {
    console.log('close');
    if (this.addUserForm.get('userName') || this.addUserForm.get('gender') || this.addUserForm.get('birthday') || this.addUserForm.get('phone') || this.addUserForm.get('email') || this.addUserForm.get('password') || this.addUserForm.get('confirmPassword')) {
      if (window.confirm('Bạn có muốn Huỷ?')) {
        this.dialogRef.close();
      }
    } else {
      this.dialogRef.close();
    }
  }

  onSubmit(): void {
    if (this.userName.length === 0) {
      this.toast.error('Chưa nhập Họ và tên');
      return;
    }
    if (this.gender.length === 0) {
      this.toast.error('Chưa chọn giới tính');
      return;
    }
    if (this.birthday.length === 0) {
      this.toast.error('Chưa nhập Ngày sinh');
      return;
    }
    if (this.phone.length === 0) {
      this.toast.error('Chưa nhập Số điện thoại');
      return;
    }
    if (this.email.length === 0) {
      this.toast.error('Chưa nhập Email');
      return;
    }
    if (this.password.length === 0) {
      this.toast.error('Chưa nhập Mật khẩu');
      return;
    }
    if (this.confirmPassword.length === 0) {
      this.toast.error('Chưa nhập Xác nhận Mật khẩu');
      return;
    }
    const user: User = {
      userId: 0,
      userName: this.addUserForm.get('userName').value,
      gender: this.addUserForm.get('gender').value,
      birthday: this.addUserForm.get('birthday').value,
      phone: this.addUserForm.get('phone').value,
      email: this.addUserForm.get('email').value,
      password: this.addUserForm.get('password').value,
      roles: this.addUserForm.get('roles').value,
      enable: true,
      url: ''
    };
    console.log('user', user);

    this.adminService.addUser(user).subscribe(
        data => {
          if (data !== null) {
            this.dialogRef.close();
            this.toast.success('Thêm người dùng thành công');
          }
        },
        err => {
          this.toast.error('err', err);
        }
    );
  }

  addRole(target): void {
    switch (target.value) {
      case 'ROLE_USER': {
        this.roleUser = !this.roleUser;
        if (!this.roleUser) {
          const roles = this.addUserForm.get('roles').value;
          roles.forEach((item, index) => {
            if (item === target.value) {
              this.addUserForm.get('roles').value.splice(index, 1);
            }
          });
        } else {
          this.addUserForm.get('roles').value.push(target.value);
        }
        break;
      }
      case 'ROLE_ADMIN': {
        this.roleAdmin = !this.roleAdmin;
        if (!this.roleAdmin) {
          const roles = this.addUserForm.get('roles').value;
          roles.forEach((item, index) => {
            if (item === target.value) {
              this.addUserForm.get('roles').value.splice(index, 1);
            }
          });
        } else {
          this.addUserForm.get('roles').value.push(target.value);
        }
      }
    }
    console.log('role : ' + JSON.stringify(this.addUserForm.get('roles').value));
  }
}
