import { FormGroup } from '@angular/forms';
import { AuthService } from './../_services/auth.service';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {VerifyPhoneComponent} from '../verify-phone/verify-phone.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, AfterViewInit {

  requestRegisterForm: FormGroup;
  @ViewChild(VerifyPhoneComponent) verifyPhone;
  isVerifyPhoneSuccess: boolean;
  isVerifyEmailSuccess: boolean;

  form: any = {};
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  verifyPhoneForm: FormGroup;

  constructor(private auServive: AuthService) {}
  ngAfterViewInit(): void {
    this.isVerifyEmailSuccess = this.verifyPhone.isVerifyEmailSuccess;
    this.isVerifyPhoneSuccess = this.verifyPhone.isVerifyPhoneSuccess;
    console.log('- After : isVerifyEmailSuccess : ' + this.isVerifyEmailSuccess + ', isVerifyEmailSuccess : ' + this.isVerifyPhoneSuccess);
  }
  ngOnInit(): void {
    this.isVerifyEmailSuccess = false;
    this.isVerifyPhoneSuccess = false;
    console.log('- onInit : isVerifyEmailSuccess : ' + this.isVerifyEmailSuccess + ', isVerifyEmailSuccess : ' + this.isVerifyPhoneSuccess);
  }

  onSubmit(): void {
    console.log('Form : ' + JSON.stringify(this.form));
    this.auServive.register(this.form).subscribe(
      (data) => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      (err) => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );
  }

  hasError(controlName, errorName): boolean {
    return this.verifyPhoneForm.controls[controlName].hasError(errorName);
  }
}
