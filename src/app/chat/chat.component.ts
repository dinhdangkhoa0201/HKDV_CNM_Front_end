import {Component, OnInit} from '@angular/core';
import {UserService} from '../_services/user.service';
import {TokenStorageService} from '../_services/token-storage.service';
import {User} from '../_interfaces/user';
import {FormControl, FormGroup} from '@angular/forms';
import {WebsocketService} from '../_services/websocket.service';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {Message} from '../_interfaces/message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  webSocketEndPoint = 'http://localhost:8090/websocket';
  stompClient: any;
  newMessage: Message[];

  listFriend: User[];
  formMessage: FormGroup;
  chooseFriend: any;

  constructor(private tokenStorage: TokenStorageService, private userService: UserService) {
  }

  ngOnInit(): void {
    this._connect();
    this.formMessage = new FormGroup({
      message: new FormControl('', [])
    });
    this.getListFriend();

    console.log('new message :: ', this.newMessage);
  }

  getListFriend(): void {
    this.userService.getListFriends(this.tokenStorage.getUser().userId).subscribe(
      data => {
        this.listFriend = data;
      },
      error => {
        console.log('err getListFriend :: ', error);
      }
    );
  }

  getListMessage(friend): void{
    
  }

  get message(): any {
    return this.formMessage.get('message').value;
  }

  sendMessage(): void {
    if (this.message.trim().length > 0) {
      this._sendMessage(this.chooseFriend, this.message);
      this.formMessage.setValue({
        message: ''
      });
    }
  }

  chooseMessage(listFriend): void {
    this.chooseFriend = listFriend.selectedOptions.selected[0]?.value;
  }

  _connect(): void{
    this.newMessage = [];
    console.log('Initialize WebSocket connection');
    const ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);

    this.stompClient.connect({}, (frame) => {
      const message = this.stompClient.subscribe('/chat/' + this.tokenStorage.getUser().userId,
        response => {
          console.log('response :: ', response.body);
          this.newMessage.push(JSON.parse(response.body));
        });
    }, (err) => {
      this._errorCallBack(err);
    });
  }

  _errorCallBack(error): void {
    console.log('errorCallBack -> ', error);
    setTimeout(() => {
      this._connect();
    }, 5000);
  }

  _disconnect(): void {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }

    console.log('Disconnected');
  }

  _sendMessage(friend, message): void {
    console.log('friendId :: ', friend.userId);
    if (message.trim().length > 0 && friend !== null) {
      const temp: Message = {
        sender: this.tokenStorage.getUser().userName,
        content: message,
        type: '1'
      };
      this.stompClient.send('/app/chat/' + friend.userId + '/sendMessage', {}, JSON.stringify(temp));
      this.newMessage.push(temp);
    }
  }

  get lisMessage(): any{
    return this.newMessage;
  }
}
