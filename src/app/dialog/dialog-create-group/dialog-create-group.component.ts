import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {User} from '../../_interfaces/user';
import {UserService} from '../../_services/user.service';
import {TokenStorageService} from '../../_services/token-storage.service';
import {FormControl} from '@angular/forms';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatChipInputEvent} from '@angular/material/chips';
import {ChatService} from '../../_services/chat.service';
import {ToastrService} from 'ngx-toastr';
import {CreateRoomChatRequest} from '../../_interfaces/create-room-chat-request';

@Component({
  selector: 'app-dialog-create-group',
  templateUrl: './dialog-create-group.component.html',
  styleUrls: ['./dialog-create-group.component.css']
})
export class DialogCreateGroupComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  chooseFriend: User[];
  listFriend: User[];

  friendControl = new FormControl();

  filterFriend: Observable<User[]>;

  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('friendInput') friendInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  roomChatName = new FormControl();

  constructor(private userService: UserService, private tokenService: TokenStorageService, private dialogRef: MatDialogRef<any>, private chatService: ChatService, private toasty: ToastrService) {


  }

  ngOnInit(): void {
    this.dialogRef.updateSize('30%', '40%');
    this.listFriend = [];
    this.chooseFriend = [];
    this.getListFriends();

    this.filterFriend = this.friendControl.valueChanges.pipe(
      startWith(null),
      map((friend: string | null) => friend ? this.filter(friend) : this.listFriend.slice())
    );

  }

  getListFriends(): void {
    this.userService.getListFriends(this.tokenService.getUser().userId).subscribe(
      data => {
        this.listFriend = data;
        console.log('list friend ', this.listFriend);
      }, error => {
        console.log('error ', error);
      }
    );
  }

  remove(friend: User): void {
    const index = this.chooseFriend.indexOf(friend);
    if (index > -1) {
      this.listFriend.push(this.chooseFriend.splice(index, 1).shift());
    }
  }

  removeListFriend(friend: User): void {
    const index = this.listFriend.indexOf(friend);
    if (index > -1) {
      this.listFriend.splice(index, 1);
    }
  }

  filter(friendName): User[] {
    let filterValue = '';
    if (typeof friendName === 'string') {
      filterValue = friendName.toLowerCase();
    } else if (typeof friendName === 'object') {
      filterValue = friendName.userName;
    }

    console.log('friend name ', friendName);

    return this.listFriend.filter(friend => friend.userName.toLowerCase().indexOf(filterValue) === 0);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log('event ', event.option.value);
    this.chooseFriend.push(event.option.value);
    this.removeListFriend(event.option.value);
    this.friendControl.setValue(null);
  }

  add(event: MatChipInputEvent): void {
    console.log('event add', event);
    const input = event.input;
    const value = event.value;

    console.log('input ', input);
    console.log('value ', value);


    /*    if ((value || '').trim()) {
          this.chooseFriend.push();
        }

        // Reset the input value
        if (input) {
          input.value = '';
        }*/

    this.friendControl.setValue(null);
  }

  closeDialog(): void {
    if (confirm('Bạn muốn huỷ việc tạo group?')) {
      this.dialogRef.close();
    }
  }

  createRoomChat(): void {
    if (this.chooseFriend.length === 0) {
      this.toasty.error('Danh sách người tham gia trống!');
    } else {
      if (confirm('Bạn có muốn tạo nhóm chat này?')) {
        const temp: CreateRoomChatRequest = {
          roomName: this.roomChatName.value,
          members: [],
          userId: this.tokenService.getUser().userId,
          userName: this.tokenService.getUser().userName,
        };

        this.chooseFriend.forEach(friend => {
          temp.members.push(friend.userId);
        });
        temp.members.push(this.tokenService.getUser().userId);
        console.log('temp ', temp);

        this.chatService.createRoomChat(temp).subscribe(
          data => {
            if (data === true) {
              console.log('data ', data);
              this.dialogRef.close();
              this.toasty.success('Bạn đã tạo nhóm thành công');
            }
          }, error => {
            console.log('error ', error);
          }
        );
      }
    }
  }
}
