import {
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component, Input,
  OnInit,
  Pipe,
  PipeTransform,
  ViewChild
} from '@angular/core';
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
import {DatePipe, KeyValue} from '@angular/common';
import {ResponseFriendOnline} from '../_interfaces/response-friend-online';
import {SendMessage} from '../_interfaces/send-message';
import {ChatService} from '../_services/chat.service';
import {RoomChat} from '../_interfaces/room-chat';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {RouterModule} from '@angular/router';
import {SseService} from '../_services/sse.service';
import {isElementScrolledOutsideView} from '@angular/cdk/overlay/position/scroll-clip';
import {FileAvatar} from '../_interfaces/file-avatar';
import {HttpEventType, HttpResponse} from '@angular/common/http';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DialogCreateGroupComponent} from '../dialog/dialog-create-group/dialog-create-group.component';
import {AdminService} from '../_services/admin.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],

})

export class ChatComponent implements OnInit, AfterViewInit {

  @ViewChild('viewport') viewport: CdkVirtualScrollViewport;
  @ViewChild('sendImage') sendImage;
  @Input() listMessages: Message[];

  image: File | null = null;

  userId: number;

  webSocketEndPoint = 'http://localhost:8090/ws';
  stompClient: any;
  newMessage: ResponseMessage[];

  friend: User;
  notificationNewMessage: ResponseMessage;
  listFriendOnline: number[];
  listFriendAndStatus: number[];
  listRoomChatAndOnline: Array<RoomChat>;
  listRoomChats: RoomChat[];
  listRoomChatsWithLastMessage: Map<RoomChat, Message>;
  listRoomChatWithAvatar: Map<RoomChat, User[]>;
  listMembers: Map<number, User>;

  formMessage: FormGroup;
  chooseRoomChat: RoomChat;
  message: '';

  loadingListRoomChat: boolean;
  private dialogRef: MatDialogRef<DialogCreateGroupComponent, any>;

  constructor(private adminService: AdminService, private tokenStorage: TokenStorageService, private dialog: MatDialog, private userService: UserService, private snackBar: MatSnackBar, public datePipe: DatePipe, private chatService: ChatService, private cdRef: ChangeDetectorRef, private sse: SseService) {

  }

  ngOnInit(): void {
    this.userId = this.tokenStorage.getUser().userId;
    this.listFriendOnline = [];
    this.listFriendAndStatus = [];
    this.listRoomChats = [];
    this.listRoomChatsWithLastMessage = new Map<RoomChat, Message>();
    this.listRoomChatWithAvatar = new Map<RoomChat, User[]>();
    this.listMessages = [];

    this.listMembers = new Map<number, User>();

    this.loadingListRoomChat = true;


    this.formMessage = new FormGroup({
      message: new FormControl('', [])
    });
    this.getAllRoomChats();
    this._connect();
    this.notify();
  }

  ngAfterViewInit(): void {

  }

  notify(): void {
    this.sse.subscribe().subscribe(
      data => {
        data = JSON.parse(data.data);
        console.log('data ', data.status);
        if (data.status === 3) {
          const index = this.listFriendOnline.indexOf(data.userId);
          if (index === -1) {
            this.listFriendOnline.push(data.userId);
          }
          console.log('listFriendOnline ', this.listFriendOnline);
        } else if (data.status === 4) {
          const index = this.listFriendOnline.indexOf(data.status);
          if (index > 1) {
            this.listFriendOnline.splice(index, 1);
            console.log('listFriendOnline ', this.listFriendOnline);
          }
        }
      }, error => {
        console.log('error ', error);
      }
    );
  }


  getAllRoomChats(): void {
    this.chatService.getAllChatRoomByMemberIdLimitMessage(this.tokenStorage.getUser().userId).subscribe(
      data => {
        this.loadingListRoomChat = false;
        // console.log('data', data);
        this.listRoomChatsWithLastMessage = new Map<RoomChat, Message>();
        this.listRoomChats = [];
        data.forEach((roomChat, i) => {
          this.listRoomChatsWithLastMessage.set(roomChat, roomChat.messages.pop());
          this.listRoomChats.push(roomChat);
          this.listRoomChatWithAvatar.set(roomChat, []);
        });

      },
      error => {
        console.log('err getListFriend :: ', error);
      }
    );
  }

  getListRoomChatWithAvatar(): void {
    for (const key of Array.from(this.listRoomChatWithAvatar.keys())) {
      console.log('key ', key);
      key.members.forEach(member => {
        if (member !== this.tokenStorage.getUser().userId) {
          this.adminService.findUserById(member).subscribe(
            data => {
              console.log('getListRoomChatWithAvatar data ', data);
              this.listRoomChatWithAvatar.get(key).push(data);
            }, error => {
              console.log('error ', error);
            }
          );
        }
      });
    }
  }

  getInformationMember(members: number[]): void {
    members.forEach(member => {
      if (member !== this.tokenStorage.getUser().userId) {

        this.adminService.findUserById(member).subscribe(
          data => {
            const temp: User = data;
            this.listMembers.set(temp.userId, temp);
            console.log('listMembers ', this.listMembers);
          }, error => {
            console.log('error ', error);
          }
        );

      }
    });
  }

  getAvatarOfRoomChat(): any {
    if (this.chooseRoomChat.members.length < 3) {
      this.chooseRoomChat.members.forEach(member => {
        if (member !== this.tokenStorage.getUser().userId) {
          this.adminService.findUserById(member).subscribe(
            data => {
              this.friend =  data;
            }, error => {
              console.log('error');
            }
          );
        }
      });
    }
  }

  onLoadingMessages(id): void {
    this.chatService.getAllMessageByRoomChatId(id).subscribe(
      data => {
        this.listMessages = [];
        data.forEach(i => {
          this.listMessages.push(i);
        });
      },
      error => {
        console.log('error ', error);
      }
    );
  }

  onChooseRoomChat(roomChat): void {
    this.chooseRoomChat = roomChat;
    this.onLoadingMessages(roomChat.id);
    console.log('members ', this.chooseRoomChat.members);
    this.getInformationMember(this.chooseRoomChat.members);
    this.getAvatarOfRoomChat();
  }

  scrollToLastIndex(list): void {
    this.viewport.scrollTo({bottom: -1});
  }

  _connect(): void {
    this.listFriendOnline = [];
    this.newMessage = [];
    console.log('Initialize WebSocket connection');
    const ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);

    this.stompClient.connect({}, (frame) => {
      if (this.listRoomChats.length > 0) {

        this.listRoomChats.forEach(room => {

          this.stompClient.subscribe('/user/' + room.id + '/queue/messages',
            response => {
              console.log('response message ', response.body);
              this.listMessages.push(JSON.parse(response.body));
              this.scrollToLastIndex(this.listMessages);
            });

        });

      }

    }, (err) => {
      this._errorCallBack(err);
    });

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

  _sendMessage(message): void {
    if (message.trim().length > 0) {

      const temp: SendMessage = {
        roomId: this.chooseRoomChat.id,
        senderId: this.tokenStorage.getUser().userId,
        senderName: this.tokenStorage.getUser().userName,
        senderImage: this.tokenStorage.getUser().url,
        message,
        type: 'text',
      };
      this.stompClient.send('/app/chat', {}, JSON.stringify(temp));
      this.message = '';
    }
  }

  getKeys(map: Map<RoomChat, Message>): RoomChat[] {
    return Array.from(map.keys());
  }

  getValue(roomChat: RoomChat): Message {
    return this.listRoomChatsWithLastMessage.get(roomChat);
  }


  get listMessagesWithRoomChat(): Message[] {
    return this.listMessages;
  }

  checkRoomOnline(member, members: Array<number>): any {
    members.forEach((i) => {
      if (this.tokenStorage.getUser().userId !== i) {
        if (this.listFriendOnline.indexOf(i) > -1) {
          return true;
        }
      }
    });
    return false;
  }

  onChangeFileInput(): void {
    const files: { [key: string]: File } = this.sendImage.nativeElement.files;
    this.image = files[0];
    console.log('image ', this.image);

    this.userService.uploadFile(this.image).subscribe(
      data => {
        if (data.type === HttpEventType.UploadProgress) {
          console.log('', Math.round(100 * data.loaded / data.total));
        } else if (data instanceof HttpResponse) {
          console.log('data uploadFile', data.body);
          const tempImage: FileAvatar = data.body;
          const temp: SendMessage = {
            roomId: this.chooseRoomChat.id,
            senderId: this.tokenStorage.getUser().userId,
            senderName: this.tokenStorage.getUser().userName,
            senderImage: this.tokenStorage.getUser().url,
            message: tempImage.url,
            type: 'image'
          };
          this.stompClient.send('/app/chat', {}, JSON.stringify(temp));
        }
      }, error => {
        console.log('error ', error);
      }
    );

  }

  onClickFileInputButton(): void {
    this.sendImage.nativeElement.click();
  }

  createGroup(): void {
    this.dialogRef = this.dialog.open(DialogCreateGroupComponent, {
      disableClose: true
    });

    this.dialogRef.afterClosed().subscribe(
      data => {
        this.getAllRoomChats();
      }, error => {
        console.log('error ', error);
      }
    );
  }

  get user(): User {
    return this.tokenStorage.getUser();
  }

  getMember(id): User {
    return this.listMembers.get(id);
  }
}

