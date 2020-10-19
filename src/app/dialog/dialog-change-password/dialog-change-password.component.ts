import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {UserService} from '../../_services/user.service';
import {TokenStorageService} from '../../_services/token-storage.service';

@Component({
  selector: 'app-dialog-change-password',
  templateUrl: './dialog-change-password.component.html',
  styleUrls: ['./dialog-change-password.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogChangePasswordComponent implements OnInit {
  user: any;
  passwordForm: FormGroup;
  updatePasswordRequest: any = {
    oldPassword: '',
    newPassword: '',
  };
  hide = true;
  hide1 = true;
  hide2 = true;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DialogChangePasswordComponent>,
    private userService: UserService,
    private token: TokenStorageService,
  ) {}

  ngOnInit(): void {
    this.user = this.token.getUser();
    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  get controls() {
    return this.passwordForm.controls;
  }
  onSubmit(): void {
    console.log(this.user);
    this.dialogRef.afterClosed().subscribe((result) => {
      this.updatePasswordRequest.oldPassword = result.currentPassword;
      this.updatePasswordRequest.newPassword = result.newPassword;
      this.userService.updatePassword(this.user.userID, this.updatePasswordRequest).subscribe(res => {
        console.log(res);
      });
    });
  }
}
