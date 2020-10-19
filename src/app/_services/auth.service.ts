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
      AUTH_API + '/sign-in',
      {
        phoneEmail: credentials.phoneEmail,
        password: credentials.password,
      },
      httpOptions
    );
  }

  register(user): Observable<any> {
    console.log('register user : ' + JSON.stringify(user));
    return this.http.post(AUTH_API + '/sign-up', {
      phone: user.phone,
      email: user.email,
      userName: user.userName,
      birthday: user.birthday,
      password: user.password,
    });
  }

  isExistedPhone(phone): Observable<any> {
    let body = new HttpParams();
    body = body.set('phone', phone);
    return this.http.post(`${ AUTH_API + '/isExistedPhone' }`, body);
  }
  isExistedEmail(email): Observable<any> {
    let body = new HttpParams();
    body = body.set('email', email);
    return this.http.post(`${ AUTH_API + '/isExistedEmail' }`, body);
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
}
