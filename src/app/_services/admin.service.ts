import { Observable } from 'rxjs';
import {HttpHeaders, HttpClient, HttpParams} from '@angular/common/http';
import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';

const ADMIN_API = environment.API_URL + '/api/admin';

const httpOptions = {
  header: new HttpHeaders({'Content-Type' : 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  findAllUsers(): Observable<any>{
    return this.http.get(`${ADMIN_API + '/users'}`);
  }

  addUser(user): Observable<any>{
    return this.http.post(`${ADMIN_API + '/users/addUser'}`, {
      userName: user.userName,
      gender: user.gender,
      birthday: user.birthday,
      phone: user.phone,
      email: user.email,
      roles: user.roles,
      password: user.password,
    });
  }

  findUserById(userId): Observable<any>{
    return this.http.get(`${ADMIN_API + '/users'}/${userId}`);
  }

  findUserByPhone(phone): Observable<any>{
    return this.http.get(`${ADMIN_API + '/users'}/${phone}`);
  }

  findUserByEmail(email): Observable<any>{
    return this.http.get(`${ADMIN_API + '/users'}/${email}`);
  }

  setEnableUser(userId, enable): Observable<any>{
    const body = new HttpParams();
    body.set('enable', enable);
    return this.http.post(`${ADMIN_API + '/users'}/${userId}`, {}, {
      params : {
        enable,
      }
    });
  }

  findAll(sort, order, page): Observable<any>{
    return this.http.get(`${ADMIN_API + '/users/page'}?sort=${sort}&order=${order}&page=${page}`);
  }

  deleteUser(userId): Observable<any>{
    return this.http.delete(`${ADMIN_API + '/users'}/${userId}`);
  }
}
