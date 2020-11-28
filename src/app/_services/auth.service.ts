import { environment } from './../../environments/environment.prod';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, timer} from 'rxjs';
import { Injectable } from '@angular/core';
import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {map, switchMap} from 'rxjs/operators';

const AUTH_API = environment.API_URL + '/api/auth';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  signIn(credentials): Observable<any> {
    console.log('credential : ' + JSON.stringify(credentials));
    return this.http.post(
      AUTH_API + '/login',
      {
        phoneEmail: credentials.phoneEmail,
        password: credentials.password,
      },
      httpOptions
    );
  }

  registerByPhone(user): Observable<any> {
    console.log('register user : ' + JSON.stringify(user));
    return this.http.post(AUTH_API + '/register/by-phone', {
      userId: user.userId,
      userName: user.userName,
      gender: user.gender,
      birthday: user.birthday,
      phone: user.phone,
      email: user.email,
      password: user.password,
      enable: user.enable,
      roles: user.roles
    });
  }

  registerByEmail(user): Observable<any> {
    console.log('register user : ' + JSON.stringify(user));
    return this.http.post(AUTH_API + '/register/by-email', {
      userId: user.userId,
      userName: user.userName,
      gender: user.gender,
      birthday: user.birthday,
      phone: user.phone,
      email: user.email,
      password: user.password,
      enable: user.enable,
      roles: user.roles
    });
  }

  isExistedPhone(phone): Observable<any> {
    let body = new HttpParams();
    body = body.set('phone', phone);
    return this.http.post(`${ AUTH_API + '/isExistedPhone' }`, body);
  }

  isExistedEmail(email): Observable<any> {
    return this.http.post(`${ AUTH_API + '/isExistedEmail' }`, {}, {
      params: {
        email
      }
    });
  }

  checkPhoneExistAsyn(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      console.log('control : ' + control.value);
      return this.isExistPhoneAsync(control.value)
        .pipe(
          map(res => {
            console.log('res : ' + res);
            if (res.length){
              return {state: true};
            }
          })
        );
    };
  }

  isExistPhoneAsync(phone): Observable<any> {
    return timer(1000)
      .pipe(
        switchMap(() => {
          let body = new HttpParams();
          body = body.set('phone', phone);
          return this.http.post(`${ AUTH_API + '/isExistedPhone' }`, body);
        })
      );
  }

  sendOTPToEmail(email): Observable<any> {
    return this.http.post(`${ AUTH_API + '/isExistedEmail/sendEmail' }`, {}, {
      params: {
        email
      }
    });
  }

  sendOTPWithEmail(email): Observable<any> {
    return this.http.post(`${AUTH_API + '/sendOTPWithEmail'}`, {}, {
      params: {
        email
      }
    });
  }

  sendOTPWithPhone(phone): Observable<any> {
    return this.http.post(`${AUTH_API + '/isExistedPhoneAndReturnObject'}`, {}, {
      params: {
        phone
      }
    });
  }

  verifyOTPCode(email, otp): Observable<any>{
    console.log('email: ' + email + ', otp : ' + otp);
    return this.http.post(`${AUTH_API + '/verifyOTPEmail'}`, {}, {
      params: {
        email,
        otp
      }
    });
  }
}
