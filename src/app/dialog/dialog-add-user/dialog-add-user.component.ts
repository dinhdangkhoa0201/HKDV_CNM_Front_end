import {Component, HostListener, OnInit} from '@angular/core';
import {AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {AuthService} from '../../_services/auth.service';
import {debounceTime, map} from 'rxjs/operators';

@Component({
  selector: 'app-dialog-add-user',
  templateUrl: './dialog-add-user.component.html',
  styleUrls: ['./dialog-add-user.component.css']
})
export class DialogAddUserComponent implements OnInit {
  userName: string;
  gender: string;
  birthday: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  addUserForm: FormGroup;
  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<any>, private authService: AuthService) { }


  ngOnInit(): void {
    this.dialogRef.updateSize('40%', '60%');

    this.addUserForm = this.formBuilder.group({
      userName: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      birthday: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required], this.authService.checkPhoneExistAsyn()),
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
      roles: new FormControl('', [Validators.required]),
    });
  }

  hasError(controlName, errorName): boolean {
    return this.addUserForm.controls[controlName].hasError(errorName);
  }

  closeDialog(): void {
    console.log('close');
    if (this.userName || this.gender || this.birthday || this.phone || this.email || this.password || this.confirmPassword){
      if (window.confirm('Bạn có muốn Huỷ?')){
        this.dialogRef.close();
      }
    } else {
      this.dialogRef.close();
    }
  }
}
