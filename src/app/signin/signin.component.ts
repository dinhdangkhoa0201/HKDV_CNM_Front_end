import {SseService} from './../_services/sse.service';
import {RequestLogin} from './../_request/request-login';
import {TokenStorageService} from './../_services/token-storage.service';
import {AuthService} from './../_services/auth.service';
import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NotifyErrorComponent} from '../notify/notify-error/notify-error.component';
import {ToastrService} from 'ngx-toastr';

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
      this.sseService.changeAvatarSource(this.tokenStorage.getUser().url !== '' ? this.tokenStorage.getUser().url : null);
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

    this.authService.signIn(temp).subscribe(
      (data) => {
        if (data === null) {
          const phoneEmail = temp.phoneEmail;
          // tslint:disable-next-line:radix
          if (!/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(phoneEmail) && !phoneEmail.includes('@') && Number.isInteger(Number.parseInt(phoneEmail.charAt(0)))) {
            this.toastError('Sai số điện thoại', 'Lỗi');
          } else if (!phoneEmail.match('^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$') && phoneEmail.includes('@')) {
            this.toastError('Sai email', 'Lỗi');
          } else if (phoneEmail.includes('@')) {
            this.authService.isExistEmailAsync(phoneEmail).subscribe(res => {
              if (res) {
                this.toastError('Sai mật khẩu', 'Lỗi');
              } else {
                this.toastError('Email không tồn tại', 'Lỗi');
              }
            });
          } else {
            this.authService.isExistPhoneAsync(phoneEmail).subscribe(res => {
              if (res) {
                this.toastError('Sai mật khẩu', 'Lỗi');
              } else {
                this.toastError('Phone không tồn tại', 'Lỗi');
              }
            });
          }
        } else {
          if (data.enable) {
            this.tokenStorage.saveUser(data);
            this.isLoginFailed = false;
            this.isLoggedIn = true;
            this.roles = this.tokenStorage.getUser().roles;
            sessionStorage.setItem('isLoggedIn', String(this.isLoggedIn));
            this.reloadPage();
          } else {
            this.toastError('Tài khoản của bạn đã bị khoá', 'Lỗi');
          }
        }
        // if (data.enable) {
        //   if (data !== null) {
        //     this.tokenStorage.saveUser(data);
        //     this.isLoginFailed = false;
        //     this.isLoggedIn = true;
        //     this.roles = this.tokenStorage.getUser().roles;
        //     sessionStorage.setItem('isLoggedIn', String(this.isLoggedIn));
        //     this.reloadPage();
        //   } else {
        //     this.toastError('Phone / Email hoặc Password sai!', 'Lỗi');
        //   }
        // } else {
        //   this.toastError('Tài khoản của bạn đã bị khoá', 'Lỗi');
        // }
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
