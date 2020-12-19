import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment.prod';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {parse} from 'ts-node';
import {CreateRoomChatRequest} from '../_interfaces/create-room-chat-request';

const CHAT_API = environment.API_URL + '/api/chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  loadMessageByRoomChatId(roomId): Observable<any>{
    return this.http.post(`${CHAT_API + '/getRoomChatById'}`, {}, {
      params: {
        roomId
      }
    });
  }

  getAllRoomChats(userId): Observable<any>{
    console.log('userId ', userId);
    return this.http.post(`${CHAT_API + '/getAllRoomChats/' + userId}`, {});
  }

  getAllChatRoomByMemberIdLimitMessage(userId): Observable<any> {
    console.log('userId ', userId);
    return this.http.post(`${CHAT_API + '/getAllChatRoomByMemberIdLimitMessage/' + userId}`, {});
  }

  getAllMessageByRoomChatId(userId): Observable<any> {
    console.log('userId ', userId);
    return this.http.post(`${CHAT_API + '/getAllMessageByRoomChatId/' + userId}`, {});
  }

  createRoomChat(roomChatRequest: CreateRoomChatRequest): Observable<any> {
    return this.http.post(`${CHAT_API + '/createRoomChat'}`, {
      roomName: roomChatRequest.roomName,
      members: roomChatRequest.members,
      userId: roomChatRequest.userId,
      userName: roomChatRequest.userName
    });
  }
}
