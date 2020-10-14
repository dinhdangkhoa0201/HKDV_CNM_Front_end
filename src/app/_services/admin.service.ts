import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
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
    return this.http.put(`${ADMIN_API + '/users'}/${userId}`, enable);
  }

  findAll(sort, order, page): Observable<any>{
    return this.http.get(`${ADMIN_API + '/users/page'}?sort=${sort}&order=${order}&page=${page}`);
  }

  deleteUser(userId): Observable<any>{
    return this.http.delete(`${ADMIN_API + '/users'}/${userId}`);
  }
}
