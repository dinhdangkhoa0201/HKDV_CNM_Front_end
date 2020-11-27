import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {User} from '../../_interfaces/user';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {UserService} from '../../_services/user.service';
import {TokenStorageService} from '../../_services/token-storage.service';

@Component({
  selector: 'app-dialog-friend-information',
  templateUrl: './dialog-friend-information.component.html',
  styleUrls: ['./dialog-friend-information.component.css']
})
export class DialogFriendInformationComponent implements OnInit, AfterViewInit {
  friend: User;
  ownerId: number;
  sentInvitation: boolean;
  relationType: number; // 0: none, 1: sent invitation, 2: received invitation

  friendInformation: FormGroup;
  readonly: boolean;

  constructor(public dialogRef: MatDialogRef<DialogFriendInformationComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private userService: UserService, private tokenStorage: TokenStorageService) {
    console.log('data ', data);
    this.friend = data.user;
    this.ownerId = data.ownerId;
  }

  ngOnInit(): void {
    this.dialogRef.updateSize('25%', '78%');
    this.friendInformation = new FormGroup({
      userId: new FormControl('', []),
      userName: new FormControl('', []),
      gender: new FormControl('', []),
      birthday: new FormControl('', []),
      phone: new FormControl('', []),
      email: new FormControl('', [])
    });
    this.readonly = true;
    this.friendInformation.setValue({
      userId: this.friend.userId,
      userName: this.friend.userName,
      gender: this.friend.gender,
      birthday: this.friend.birthday,
      phone: this.friend.phone,
      email: this.friend.email
    });
    this.relationType = 0;

    this.checkSentInvitation(this.friend.userId);
    this.checkReceivedInvitation(this.friend.userId);
    this.checkStatusIsFriend(this.friend.userId);
  }

  ngAfterViewInit(): void {
  }

  sendRequestAddFriend(): void {
    console.log('userId : ', this.friend.userId);
    this.userService.addFriend(this.tokenStorage.getUser().userId, this.friend.userId).subscribe(
      data => {
        console.log('data sendRequestAddFriend : ', data);
        if (data === true) {
          this.relationType = 1;
        }
      }, error => {
        console.log('error sendRequestAddFriend : ', error);
      }
    );

  }

  checkSentInvitation(friendId): void {
    this.userService.checkSentInvitation(this.tokenStorage.getUser().userId, friendId).subscribe(
      data => {
        console.log('data checkSentInvitation : ', data.length);
        if (data.length > 0) {
          this.relationType = 1;
        }
      }, error => {
        console.log('err checkfriend : ', error);
      }
    );
  }

  checkReceivedInvitation(friendId): void {
    this.userService.checkReceivedInvitation(this.tokenStorage.getUser().userId, friendId).subscribe(
      data => {
        console.log('data checkReceivedInvitation : ', data.length);
        if (data.length > 0) {
          this.relationType = 2;
        }
      }, error => {
        console.log('err checkReceivedInvitation : ', error);
      }
    );
  }

  checkStatusIsFriend(friendId): void {
    this.userService.checkStatusIsFriend(this.tokenStorage.getUser().userId, friendId).subscribe(
      data => {
        console.log('data checkStatusIsFriend : ', data.length);
        if (data.length > 0) {
          this.relationType = 3;
        } else {
          this.relationType = 0;
        }
      }, error => {
        console.log('error checkStatusIsFriend : ', error);
      }
    );
  }

  unFriend(): void {
    if (confirm('Bạn có muốn huỷ kết bạn với ' + this.friend.userName)) {
      this.userService.unFriend(this.tokenStorage.getUser().userId, this.friend.userId).subscribe(
        data => {
          console.log('data unFriend : ', data);
          window.location.reload();
        }, error => {
          console.log('error checkStatusIsFriend : ', error);
        }
      );
    }
  }
}
