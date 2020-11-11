import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {environment} from '../../environments/environment.prod';
import {TokenStorageService} from './token-storage.service';

const API_URL = environment.API_URL + '/api/user';
@Injectable({
  providedIn: 'root'
})
export class SseService {

  constructor(private tokenStorageService: TokenStorageService) { }

  subscribe(): Subject<any>{
    const eventSource = new EventSource(`${API_URL + '/subscribe/' + this.tokenStorageService.getUser().userId}`);
    const subscription = new Subject();
    eventSource.addEventListener('notify', (event) => {
      subscription.next(event);
    });
    return subscription;
  }
}
