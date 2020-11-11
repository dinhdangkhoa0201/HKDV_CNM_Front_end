import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {Message} from '../_interfaces/message';
import {TokenStorageService} from './token-storage.service';
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  webSocketEndPoint = 'http://localhost:8090/websocket';
  stompClient: any;
  newMessage: Message[];
  user: any;
  constructor(private tokenStorage: TokenStorageService) { }

  connect(): void{
    this.newMessage = [];
    console.log('Initialize WebSocket connection');
    const ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);

    this.stompClient.connect({}, (frame) => {
      const message = this.stompClient.subscribe('/chat/' + this.tokenStorage.getUser().userId,
        response => {
          console.log('response :: ', response.body);
          this.newMessage.push(response.body);
        });

      console.log('message : ', message);
    }, (err) => {
      this.errorCallBack(err);
    });
  }

  errorCallBack(error): void {
    console.log('errorCallBack -> ', error);
    setTimeout(() => {
      this.connect();
    }, 5000);
  }

  disconnect(): void {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }

    console.log('Disconnected');
  }

  sendMessage(friend, message): void {
    console.log('friend Id', friend.userId);
    if (message.trim().length > 0 && friend !== null) {
      const temp = {
        sender: this.tokenStorage.getUser().userName,
        content: message,
        type: 1
      };
      this.stompClient.send('/app/chat/' + friend.userId + '/sendMessage', {}, JSON.stringify(temp));
    }
  }

  get lisMessage(): any{
    return this.newMessage;
  }
}
