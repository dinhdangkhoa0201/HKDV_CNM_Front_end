import { environment } from './../../environments/environment.prod';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {User} from '../_interfaces/user';
import {A} from '@angular/cdk/keycodes';

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

  findFriend(friendId): Observable<any> {
    return this.http.get(`${API_URL + '/findFriend?strFind=' + friendId}`);
  }

  addFriend(userId, friendId): Observable<any> {
    console.log('add friend: ownerId ', userId + ', friendId : ', friendId);
    return this.http.get(`${API_URL + '/addFriend/' + userId + '?friendId=' + friendId}`);
  }

  getListInvites(userId): Observable<any> {
    return this.http.get(`${API_URL + '/invites/' + userId}`);
  }

  getListFriends(userId): Observable<any> {
    return this.http.get(`${API_URL + '/friends/' + userId}`);
  }

  getListOfSentInvitation(userId): Observable<any> {
    return this.http.get(`${API_URL + '/requests/' + userId}`);
  }

  checkSentInvitation(userId, friendId): Observable<any> {
    return this.http.get(`${API_URL + '/checkSentInvitation/' + userId + '?friendId=' + friendId}`);
  }

  checkReceivedInvitation(userId, friendId): Observable<any> {
    return this.http.get(`${API_URL + '/checkReceivedInvitation/' + userId + '?friendId=' + friendId}`);
  }

  acceptRequestAddFriend(userId, friendId): Observable<any>{
    return this.http.get(`${API_URL + '/acceptRequestAddFriend/' + userId + '?friendId=' + friendId}`);
  }
}
