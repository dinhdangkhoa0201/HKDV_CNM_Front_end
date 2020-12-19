<<<<<<< HEAD
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {environment} from '../../environments/environment.prod';
import {TokenStorageService} from './token-storage.service';
import {HttpClient} from '@angular/common/http';
=======
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { TokenStorageService } from './token-storage.service';
>>>>>>> 927f459a086855f1692623bcddae48da400b5cf8

const API_URL = environment.API_URL + '/api/user';

@Injectable({
  providedIn: 'root'
})
export class SseService {
  eventSource: EventSource;

  private avatarSource = new BehaviorSubject('./assets/image/user.png');
  currentAvatar = this.avatarSource.asObservable();

<<<<<<< HEAD
  constructor(private tokenStorageService: TokenStorageService, private http: HttpClient) {
  }

  subscribe(): Subject<any> {

=======
  private avatarSource = new BehaviorSubject('./assets/image/user.png');
  currentAvatar = this.avatarSource.asObservable();

  constructor(private tokenStorageService: TokenStorageService) { }

  subscribe(): Subject<any> {
>>>>>>> 927f459a086855f1692623bcddae48da400b5cf8
    const eventSource = new EventSource(`${API_URL + '/subscribe/' + this.tokenStorageService.getUser().userId}`);
    const subscription = new Subject();

    eventSource.addEventListener('message', (event) => {
      subscription.next(event);
    });

    return subscription;
  }

<<<<<<< HEAD
  disconnect(): Observable<any> {
    return this.http.post(`${API_URL + '/disconnect/' + this.tokenStorageService.getUser().userId}`, {});
  }

  changeAvatarSource(avatar: string): void {
=======
  changeAvatarSource(avatar: string) {
>>>>>>> 927f459a086855f1692623bcddae48da400b5cf8
    this.avatarSource.next(avatar);
  }
}
