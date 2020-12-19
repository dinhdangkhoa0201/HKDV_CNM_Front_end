import {Message} from './message';

export class RoomChat {
  id: string;
  roomName: string;
  members: Array<number>;
  messages: Message [] = [];
  lastTime: number;
}
