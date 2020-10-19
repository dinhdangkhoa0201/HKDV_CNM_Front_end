import { User } from './../_interfaces/user';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Component, Input, OnInit, NgModule } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { UserService } from '../_services/user.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { DialogUserInformationComponent } from '../dialog/dialog-user-information/dialog-user-information.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  user: any;
  isLoggedIn: boolean;
  datePipe: DatePipe = new DatePipe('en');

  passwordForm = this.formBuilder.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required]],
    rewritePassWord: ['', [Validators.required]],
  });

  userForm = this.formBuilder.group({
    userNameInfo: ['', [Validators.required, Validators.minLength(3)]],
    userPhoneNumberInfo: [
      {
        value: '',
        disabled: true,
      },
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern('0[1-9][0-9]{8}'),
      ],
    ],
    userBirthdayInfo: ['', [Validators.required]],
    userEmailInfo: [{ value: '', disabled: true }, [Validators.required]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private token: TokenStorageService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.user = this.token.getUser();

    if (this.user) {
      this.userForm.setValue({
        userNameInfo: this.user.userName,
        userPhoneNumberInfo: this.user.phone,
        userBirthdayInfo: this.user.birthday,
        userEmailInfo: this.user.email,
      });
    } else {
    /*none */
      this.user = {
        userId: 123,
        userName: 'Trần Thế Duy',
        birthday: '20/08/1999',
        phone: '0798455595',
        email: 'trantheduyk13@gmail.com',
        enable: true,
      };
    }

    this.userForm.controls.userNameInfo.valueChanges.subscribe((value) => {
      this.user.userName = value;
      console.log(this.user);
    });
    this.userForm.controls.userPhoneNumberInfo.valueChanges.subscribe(
      (value) => {
        this.user.phone = value;
      }
    );
    this.userForm.controls.userBirthdayInfo.valueChanges.subscribe((value) => {
      this.user.birthday = value;
    });
    this.userForm.controls.userEmailInfo.valueChanges.subscribe((value) => {
      this.user.email = value;
    });
  }

  /* Dialog */
  openProfile(): void {
    this.dialog.open(DialogUserInformationComponent, {
      disableClose: true,
      autoFocus: false,
      panelClass: 'user-information-dialog',
      width: '70vh',
      data: this.user,
    });
  }
}
