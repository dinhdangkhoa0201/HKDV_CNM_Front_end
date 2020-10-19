import { User } from './../../_interfaces/user';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { DialogChangePasswordComponent } from '../dialog-change-password/dialog-change-password.component';
import { DialogChangeInformationComponent } from '../dialog-change-information/dialog-change-information.component';

@Component({
  selector: 'app-dialog-user-information',
  templateUrl: './dialog-user-information.component.html',
  styleUrls: ['./dialog-user-information.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogUserInformationComponent implements OnInit {
  user: User;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<DialogUserInformationComponent>,
    private dialog: MatDialog
  ) {
    if (data) {
      this.user = data;
    }
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

  ngOnInit(): void {}
}
