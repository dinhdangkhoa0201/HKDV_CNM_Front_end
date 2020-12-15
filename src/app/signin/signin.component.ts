import { SseService } from './../_services/sse.service';
import { RequestLogin } from './../_request/request-login';
import { TokenStorageService } from './../_services/token-storage.service';
import { AuthService } from './../_services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifyErrorComponent } from '../notify/notify-error/notify-error.component';
import { ToastrService } from 'ngx-toastr';

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
    private snackbar: MatSnackBar,
    private toast: ToastrService,
    private sseService: SseService
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
      this.sseService.changeAvatarSource(this.tokenStorage.getUser().url !== "" ? this.tokenStorage.getUser().url : null);
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
      this.toastError('Chưa nhập Phone / Email', 'Lỗi');
    } else if (!this.password) {
      this.toastError('Chưa nhập Mật khẩu', 'Lỗi');
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
        /*        console.log('data Sign in', data);*/
        if (data.enable) {
          if (data !== null) {
            this.tokenStorage.saveUser(data);
            this.isLoginFailed = false;
            this.isLoggedIn = true;
            this.roles = this.tokenStorage.getUser().roles;
            sessionStorage.setItem('isLoggedIn', String(this.isLoggedIn));
            this.reloadPage();
          } else {
            this.toastError('Phone / Email hoặc Password sai!', 'Lỗi');
          }
        } else {
          this.toastError('Tài khoản của bạn đã bị khoá', 'Lỗi');
        }

      },
      (err) => {
        /*        console.log('err : ', err);*/
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
        this.toastError('Đăng nhập không thành công', 'Lỗi');
      }
    );
  }

  reloadPage(): void {
    window.location.reload();
  }

  toastError(message, title): void {
    this.toast.error(message, title);
  }
}
