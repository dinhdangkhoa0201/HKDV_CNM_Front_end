import {User} from './../../_interfaces/user';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import {Component, OnInit, ViewEncapsulation, Inject} from '@angular/core';
import {DialogChangePasswordComponent} from '../dialog-change-password/dialog-change-password.component';
import {DialogChangeInformationComponent} from '../dialog-change-information/dialog-change-information.component';
import {TokenStorageService} from '../../_services/token-storage.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {UserService} from '../../_services/user.service';

@Component({
  selector: 'app-dialog-user-information',
  templateUrl: './dialog-user-information.component.html',
  styleUrls: ['./dialog-user-information.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogUserInformationComponent implements OnInit {
  user: User;
  userInformForm: FormGroup;
  readonly: boolean;

  ngOnInit(): void {
    this.dialogRef.updateSize('40%', '60%');
    this.userInformForm = this.formBuilder.group({
      userId: new FormControl(''),
      userName: new FormControl('', []),
      gender: new FormControl('', []),
      birthday: new FormControl('', []),
      phone: new FormControl('', []),
      email: new FormControl('', []),
      password: new FormControl('', []),
    });
    this.user = this.token.getUser();

    this.userInformForm.setValue({
      userId: this.user.userId,
      userName: this.user.userName,
      gender: this.user.gender,
      birthday: this.user.birthday,
      phone: this.user.phone,
      email: this.user.email,
      password: this.user.password
    });

    this.readonly = true;

    console.log('userInform : ', this.userInformForm);
  }

  constructor(
    private dialogRef: MatDialogRef<any>,
    private dialog: MatDialog,
    private token: TokenStorageService,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {
  }

  openChangePassword(): void {
    this.dialog.open(DialogChangePasswordComponent, {
      disableClose: true,
      autoFocus: false,
      panelClass: 'change-password-dialog',
      width: '70vh',
    });
  }

  openUserUpdate(): void {
    this.dialog.open(DialogChangeInformationComponent, {
      disableClose: true,
      autoFocus: false,
      panelClass: 'change-password-dialog',
      width: '70vh',
    });
  }

  save(userId): void {
    if (confirm('Bạn có muốn lưu?')) {
      this.userService.updateInformationUser(userId.value, this.userInformForm.getRawValue()).subscribe(
        data => {
          this.token.saveUser(data);
          this.reloadPage();
        },
        error => {
          console.log('err ', error);
        }
      );
    }
    this.readonly = !this.readonly;

  }

  removeReadonly(): void {
    this.readonly = !this.readonly;
  }

  closeDialog(): void {
    if (confirm('Bạn có muốn huỷ?')) {
      this.dialogRef.close();
    }
  }

  reloadPage(): void {
    window.location.reload();
  }
}
