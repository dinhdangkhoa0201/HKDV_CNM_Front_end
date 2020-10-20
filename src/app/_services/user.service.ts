import { environment } from './../../environments/environment.prod';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {User} from '../_interfaces/user';

const API_URL = environment.API_URL + '/api/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {
  }

  updatePassword(userId, oldPassword, newPassword): Observable<any>{
    console.log(userId);
    return this.http.post(`${ API_URL + '/changePassword'}/${userId}`, {}, {
      params: {
        oldPassword,
        newPassword
      }
    });
  }

  updateInformationUser(userId, user): Observable<any>{
    return this.http.post(`${API_URL + '/update'}/${userId}`, {
      userName: user.userName,
      gender: user.gender,
      birthday: user.birthday,
      phone: user.phone,
      email: user.email,
      password: user.password
    });
  }

  getPublicContent(): Observable<any> {
    return this.http.get(API_URL + 'all', {responseType: 'text'});
  }
}
