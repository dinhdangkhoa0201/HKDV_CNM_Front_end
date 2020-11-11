import {Component, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../_services/auth.service';
import {User} from '../../_interfaces/user';
import {ResponseOTP} from '../../_interfaces/responseOTP';
import {uniqueEmailValidator} from '../../_services/unique-email-validator.directive';
import {ResponseAfterRegister} from '../../_interfaces/response-after-register';
import {RequestLogin} from '../../_request/request-login';
import {TokenStorageService} from '../../_services/token-storage.service';
import {Router} from '@angular/router';
import {AppRoutingModule} from '../../app-routing.module';
import {EventEmitter} from 'events';

@Component({
  selector: 'app-register-by-email',
  templateUrl: './register-by-email.component.html',
  styleUrls: ['./register-by-email.component.css']
})
export class RegisterByEmailComponent implements OnInit {
  checkEmail: FormGroup;
  informationUser: FormGroup;
  checkOTP: FormGroup;
  editable: boolean;
  isChecking: boolean;
  isSentOTP: boolean;
  isLoading: boolean;
  sendOTPSuccess: boolean;
  responseOTP: ResponseOTP;
  verifyOTPSuccess: boolean;
  sendOTPToVerify: boolean;
  beVerifyingOTP: boolean;
  registerSuccess: boolean;


  hidePassword: boolean;
  hideConfirmPassword: boolean;

  @Output() loginin: EventEmitter<boolean> = new EventEmitter();

  responseAfterRegister: ResponseAfterRegister;


  constructor(private formBuilder: FormBuilder, private authService: AuthService, private tokenStorage: TokenStorageService, private router: Router) {
    this.checkEmail = this.formBuilder.group({
      email: new FormControl('', [Validators.email], [uniqueEmailValidator(this.authService)])
    });
  }

  ngOnInit(): void {
    this.checkOTP = this.formBuilder.group({
      otp: new FormControl('', [Validators.required])
    });
    this.informationUser = this.formBuilder.group({
      userName: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      birthday: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required])
    });
    this.isLoading = false;
    this.isChecking = false;
    this.editable = false;

    this.isSentOTP = false;
    this.sendOTPSuccess = false;

    this.beVerifyingOTP = false;
    this.verifyOTPSuccess = false;
    this.sendOTPToVerify = false;

    this.registerSuccess = false;


    this.hidePassword = true;
    this.hideConfirmPassword = true;

    this.informationUser.setValue({
      userName: 'Đinh Đăng Khoa',
      gender: 'Nam',
      birthday: '1999-10-02',
      password: '123456789',
      confirmPassword: '123456789'
    });
  }

  noWhitespaceValidator(control: FormControl): any {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  get currentUser(): any {
    return this.tokenStorage.getUser();
  }

  get email(): any {
    return this.checkEmail.get('email');
  }

  hasError(controlName, errorName, form): boolean {
    return form.controls[controlName].hasError(errorName);
  }

  sendOTPEmail(): void {
    this.isSentOTP = true;
    this.isLoading = true;
    this.authService.sendOTPToEmail(this.checkEmail.get('email').value)
      .subscribe(
        data => {
          this.responseOTP = data;
          console.log('data sendOTPToEmail : ', this.responseOTP);
          this.isLoading = false;
          this.sendOTPSuccess = true;
        },
        error => {
          console.log('err: ', error);
        }
      );
  }

  onSubmit(): void {
    const user: User = {
      userId: this.responseOTP.userId,
      userName: this.informationUser.get('userName').value,
      gender: this.informationUser.get('gender').value,
      birthday: this.informationUser.get('birthday').value,
      phone: '',
      email: this.checkEmail.get('email').value,
      password: this.informationUser.get('password').value,
      roles: ['user'],
      enable: true,
    };
    this.authService.registerByEmail(user).subscribe(
      data => {
        if (data !== null){
          this.responseAfterRegister = data;
          this.registerSuccess = true;
          console.log('data register After register : ', this.responseAfterRegister);
        }
      },
      error => {
        console.log('error : ', error);
      }
    );
  }

  verifyOTP(): void {
    this.authService.verifyOTPCode(this.responseOTP.userId, this.email.value, this.checkOTP.get('otp').value).subscribe(
      data => {
        console.log('data verify : ', data);
        this.beVerifyingOTP = true;
        this.verifyOTPSuccess = data;
      },
      error => {
        console.log('error : ', error);
      }
    );
  }

  signIn(): void {
    const temp: RequestLogin = {
      phoneEmail: this.responseAfterRegister.email,
      password: this.informationUser.get('password').value
    };

    this.authService.signIn(temp).subscribe(
      (data) => {
        console.log('sigin data : ' + data);
        if (typeof data !== 'boolean'){
          this.tokenStorage.saveToken(data.accessToken);
          this.tokenStorage.saveUser(data);
          this.reloadPage();
          sessionStorage.setItem('isLoggedIn', String(true));
        }
      },
      (err) => {
        console.log('err : ', err);
      }
    );
  }

  reloadPage(): void {
    window.location.reload();
    window.location.href = '/profile';
  }
}

export class FormFieldPrefixSuffixExample {
  hide = true;
}
