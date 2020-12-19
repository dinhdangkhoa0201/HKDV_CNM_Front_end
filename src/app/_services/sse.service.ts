import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {environment} from '../../environments/environment.prod';
import {TokenStorageService} from './token-storage.service';
import {HttpClient} from '@angular/common/http';

const API_URL = environment.API_URL + '/api/user';

@Injectable({
  providedIn: 'root'
})
export class SseService {
  eventSource: EventSource;

  private avatarSource = new BehaviorSubject('./assets/image/user.png');
  currentAvatar = this.avatarSource.asObservable();

  constructor(private tokenStorageService: TokenStorageService, private http: HttpClient) {
  }

  subscribe(): Subject<any> {

    const eventSource = new EventSource(`${API_URL + '/subscribe/' + this.tokenStorageService.getUser().userId}`);
    const subscription = new Subject();

    eventSource.addEventListener('message', (event) => {
      subscription.next(event);
    });

    return subscription;
  }

  disconnect(): Observable<any> {
    return this.http.post(`${API_URL + '/disconnect/' + this.tokenStorageService.getUser().userId}`, {});
  }

  changeAvatarSource(avatar: string): void {
    this.avatarSource.next(avatar);
  }
}
