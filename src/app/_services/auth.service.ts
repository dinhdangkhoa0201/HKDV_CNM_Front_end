import { environment } from './../../environments/environment.prod';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

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
    body = body.set('phone', email);
    return this.http.post(`${ AUTH_API + '/isExistedPhone' }`, body);
  }
}
