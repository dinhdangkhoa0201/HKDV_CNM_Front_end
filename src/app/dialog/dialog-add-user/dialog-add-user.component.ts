import {Component, HostListener, OnInit} from '@angular/core';
import {AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {AuthService} from '../../_services/auth.service';
import {debounceTime, map} from 'rxjs/operators';
import {User} from '../../_interfaces/user';
import {AdminService} from '../../_services/admin.service';
import {strict} from 'assert';

@Component({
  selector: 'app-dialog-add-user',
  templateUrl: './dialog-add-user.component.html',
  styleUrls: ['./dialog-add-user.component.css']
})
export class DialogAddUserComponent implements OnInit {

  roleUser: boolean;
  roleAdmin: boolean;
  addUserForm: FormGroup;
  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<any>, private authService: AuthService, private adminService: AdminService) { }


  ngOnInit(): void {
    this.dialogRef.updateSize('40%', '65%');

    this.addUserForm = this.formBuilder.group({
      userName: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      birthday: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required], this.authService.checkPhoneExistAsyn()),
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
      roles: new FormControl(Array<string>(), [Validators.required]),
    });

    this.addUserForm.get('roles').value.push('ROLE_USER');
    this.roleUser = true;
    this.roleAdmin = false;
  }

  hasError(controlName, errorName): boolean {
    return this.addUserForm.controls[controlName].hasError(errorName);
  }

  closeDialog(): void {
    console.log('close');
    if (this.addUserForm.get('userName') || this.addUserForm.get('gender') || this.addUserForm.get('birthday') || this.addUserForm.get('phone') || this.addUserForm.get('email') || this.addUserForm.get('password') || this.addUserForm.get('confirmPassword')){
      if (window.confirm('Bạn có muốn Huỷ?')){
        this.dialogRef.close();
      }
    } else {
      this.dialogRef.close();
    }
  }

  onSubmit(): void{
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
      };
      console.log('user', user);

      this.adminService.addUser(user).subscribe(
        data => {
          console.log('rs', data);
        },
        err => {}
      );
  }

  addRole(target): void {
    switch (target.value){
      case 'ROLE_USER': {
        this.roleUser = !this.roleUser;
        if (!this.roleUser){
          const roles = this.addUserForm.get('roles').value;
          roles.forEach((item, index) => {
            if (item === target.value){
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
        if (!this.roleAdmin){
          const roles = this.addUserForm.get('roles').value;
          roles.forEach((item, index) => {
            if (item === target.value){
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
