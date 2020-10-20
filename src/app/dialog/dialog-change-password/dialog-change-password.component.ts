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
    this.dialogRef.updateSize('30%', '50%');
    this.user = this.token.getUser();
    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });

    console.log('user : ', this.user);
  }

  get controls(): any {
    return this.passwordForm.controls;
  }

  hasError(controlName, errorName): boolean {
    return this.passwordForm.controls[controlName].hasError(errorName);
  }

  onSubmit(): void {
    console.log(this.user.userId);
    this.dialogRef.afterClosed().subscribe((result) => {
      this.userService.updatePassword(this.user.userId, this.passwordForm.get('currentPassword').value, this.passwordForm.get('newPassword').value)
        .subscribe(res => {
        console.log('res : ', res);
      });
    });
  }

}
