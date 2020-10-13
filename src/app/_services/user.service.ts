import { environment } from './../../environments/environment.prod';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';

const API_URL = environment.API_URL + '/api/test';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {
  }

  getPublicContent(): Observable<any> {
    return this.http.get(API_URL + 'all', {responseType: 'text'});
  }

  getUserBoard(): Observable<any> {
    return this.http.get(API_URL + 'user', {responseType: 'text'});
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(API_URL + 'admin', {responseType: 'text'});
  }
}
