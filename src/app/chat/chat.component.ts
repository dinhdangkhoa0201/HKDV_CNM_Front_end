import {Component, OnInit} from '@angular/core';
import {UserService} from '../_services/user.service';
import {TokenStorageService} from '../_services/token-storage.service';
import {User} from '../_interfaces/user';
import {FormControl, FormGroup} from '@angular/forms';
import {WebsocketService} from '../_services/websocket.service';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {Message} from '../_interfaces/message';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NotifyNewMessageComponent} from '../notify/notify-new-message/notify-new-message.component';
import {ResponseMessage} from '../_interfaces/response-message';
import {DatePipe} from '@angular/common';
import {ResponseFriendOnline} from '../_interfaces/response-friend-online';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  webSocketEndPoint = 'http://localhost:8090/websocket';
  stompClient: any;
  newMessage: ResponseMessage[];
  listFriendOnline: ResponseFriendOnline[];

  notificationNewMessage: ResponseMessage;

  listFriendAndStatus: number[];

  listFriend: User[];
  formMessage: FormGroup;
  chooseFriend: User;
  message: '';

  constructor(private tokenStorage: TokenStorageService, private userService: UserService, private snackBar: MatSnackBar, public datePipe: DatePipe) {
  }

  ngOnInit(): void {
    this.listFriendAndStatus = [];
    this.listFriend = [];

    this._connect();
    this.getListFriend();
    this.formMessage = new FormGroup({
      message: new FormControl('', [])
    });

  }

  getListFriend(): void {
    this.userService.getListFriends(this.tokenStorage.getUser().userId).subscribe(
      data => {
        this.listFriend = data;
        // console.log('choose friend :: ', this.chooseFriend);
        this.chooseFriend = this.listFriend[0];
      },
      error => {
        console.log('err getListFriend :: ', error);
      }
    );
  }

  sendMessage(message): void {
    if (message.trim().length > 0) {
      this._sendMessage(this.chooseFriend, message);
      this.formMessage.setValue({
        message: ''
      });
    }
  }

  chooseMessage(listFriend): void {
    this.chooseFriend = listFriend.selectedOptions.selected[0]?.value;
  }

  _connect(): void {
    this.listFriendOnline = [];
    this.newMessage = [];
    console.log('Initialize WebSocket connection');
    const ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);

/*    this.stompClient.connect({}, (frame) => {
      this.stompClient.subscribe('/user/' + this.tokenStorage.getUser().userId + '/queue/notifies',
        response => {
          const friendOnline: ResponseFriendOnline = JSON.parse(response.body);
          const indexOfFriend = this.listFriendOnline.map((friend) => {
            return friend.friendId;
          }).indexOf(friendOnline.friendId);
          if (indexOfFriend < 0) {
            this.listFriendOnline.push(friendOnline);
            if (this.listFriendAndStatus.indexOf(friendOnline.friendId) < 0) {
              this.listFriendAndStatus.push(friendOnline.friendId);
            }
          }
        });

      this.stompClient.subscribe('/user/' + this.tokenStorage.getUser().userId + '/queue/messages',
        response => {
          this.notificationNewMessage = response.body;
          if (this.notificationNewMessage !== null) {
            this.snackBar.openFromComponent(NotifyNewMessageComponent, {
              data: JSON.parse(response.body),
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });
          }
          this.newMessage.push(JSON.parse(response.body));
        });
      this.notifyAboutMyAccountOnline();
    }, (err) => {
      this._errorCallBack(err);
    });*/
  }

  _errorCallBack(error): void {
/*    console.log('errorCallBack -> ', error);
    setTimeout(() => {
      this._connect();
    }, 5000);*/
  }

  _disconnect(): void {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }

    console.log('Disconnected');
  }

  _sendMessage(friend, message): void {
    console.log('friendId :: ', friend.userId);
    if (message.trim().length > 0) {
      if (typeof friend !== 'undefined') {
        const temp: Message = {
          senderId: this.tokenStorage.getUser().userId,
          senderName: this.tokenStorage.getUser().userName,
          roomId: friend.userId,
          content: message,
          type: '1'
        };
        this.stompClient.send('/app/chat', {}, JSON.stringify(temp));

        const responseMessage: ResponseMessage = {
          senderId: this.tokenStorage.getUser().userId,
          senderName: this.tokenStorage.getUser().userName,
          content: message,
          create: this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm'),
        };
        this.newMessage.push(responseMessage);
      }
    }
  }


  notifyAboutMyAccountOnline(): void {
    this.listFriend.forEach(friend => {
      const temp = {
        userId: this.tokenStorage.getUser().userId,
        userName: this.tokenStorage.getUser().userName,
        type: 'ONLINE',
        recipientId: friend.userId,
      };
      this.stompClient.send('/app/notify', {}, JSON.stringify(temp));
    });
  }

  get lisMessage(): any {
    return this.newMessage;
  }

  get userId(): any {
    console.log('userId : ', this.tokenStorage.getUser().userId);
    return this.tokenStorage.getUser().userId;
  }
}
