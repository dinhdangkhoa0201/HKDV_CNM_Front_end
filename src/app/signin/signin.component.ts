import { RequestLogin } from './../_request/request-login';
import { TokenStorageService } from './../_services/token-storage.service';
import { AuthService } from './../_services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';

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
  ) {}

  ngOnInit(): void {
    this.requestLoginForm = new FormGroup({
      phoneEmail: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });

    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  hasError(controlName, errorName): boolean {
    return this.requestLoginForm.controls[controlName].hasError(errorName);
  }

  createUser(userForm): any {
    if (this.requestLoginForm.valid) {
      this.executeUserCreation(userForm);
    }
  }

  executeUserCreation(requestLoginForm): void {
    const temp: RequestLogin = {
      phoneEmail: requestLoginForm.phoneEmail,
      password: requestLoginForm.password
    };

    console.log('temp : ' + temp);

    this.authService.signIn(temp).subscribe(
      (data) => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.reloadPage();

        sessionStorage.setItem('isLoggedIn', String(this.isLoggedIn));
      },
      (err) => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }

  reloadPage(): void {
    if (this.isLoggedIn){
      this.router.navigate(['profile']);
    }
  }
}
