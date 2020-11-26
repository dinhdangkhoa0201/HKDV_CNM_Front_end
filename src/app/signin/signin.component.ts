import {RequestLogin} from './../_request/request-login';
import {TokenStorageService} from './../_services/token-storage.service';
import {AuthService} from './../_services/auth.service';
import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NotifyErrorComponent} from '../notify/notify-error/notify-error.component';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SignInComponent implements OnInit {
  requestLoginForm: FormGroup;
  regexPhone: string;
  regexEmail: string;

  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.requestLoginForm = new FormGroup({
      phoneEmail: new FormControl('', []),
      password: new FormControl('', [])
    });

    if (this.tokenStorage.getUser()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  get phoneEmail(): any {
    return this.requestLoginForm.get('phoneEmail').value;
  }

  get password(): any {
    return this.requestLoginForm.get('password').value;
  }

  createUser(): any {
    if (!this.phoneEmail) {
      this.snackBarError('Chưa nhập Phone / Email');
    } else if (!this.password) {
      this.snackBarError('Chưa nhập Mật khẩu');
    } else {
      this.executeUserCreation();
    }

  }

  executeUserCreation(): void {
    const temp: RequestLogin = {
      phoneEmail: this.phoneEmail,
      password: this.password
    };

    console.log('temp : ' + temp);

    this.authService.signIn(temp).subscribe(
      (data) => {
        if (data !== null) {
          this.tokenStorage.saveUser(data);
          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.roles = this.tokenStorage.getUser().roles;
          sessionStorage.setItem('isLoggedIn', String(this.isLoggedIn));
          this.reloadPage();
        } else {
          this.snackBarError('Phone / Email hoặc Password sai!');
        }
      },
      (err) => {
        console.log('err : ', err);
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
        this.snackBarError('Đăng nhập không thành công');
      }
    );
  }

  reloadPage(): void {
    window.location.reload();
  }

  snackBarError(message): void {
    this.snackbar.openFromComponent(NotifyErrorComponent, {
      data: {
        content: message,
      },
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
