import { environment } from './../../environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

const AUTH_API = environment.API_URL + '/api/auth/';

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
      AUTH_API + 'sign-in',
      {
        phone: credentials.phone,
        password: credentials.password,
      },
      httpOptions
    );
  }

  register(user): Observable<any> {
    return this.http.post(AUTH_API + 'sign-up', {
      userName: user.userName,
      phone: user.phone,
      password: user.password,
    });
  }
}
