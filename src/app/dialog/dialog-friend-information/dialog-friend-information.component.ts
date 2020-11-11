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
  user: User;
  ownerId: number;
  sentInvitation: boolean;
  relationType: number; // 0: none, 1: sent invitation, 2: received invitation

  friendInformation: FormGroup;
  readonly: boolean;
  constructor(public dialogRef: MatDialogRef<DialogFriendInformationComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private userService: UserService, private tokenStorage: TokenStorageService) {
    console.log('data ', data);
    this.user = data.user;
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
      userId: this.user.userId,
      userName: this.user.userName,
      gender: this.user.gender,
      birthday: this.user.birthday,
      phone: this.user.phone,
      email: this.user.email
    });
    this.relationType = 0;
    this.checkSentInvitation(this.user.userId);
    this.checkReceivedInvitation(this.user.userId);
  }

  ngAfterViewInit(): void {
  }

  sendRequestAddFriend(): void {
    console.log('userId : ', this.user.userId);
    this.userService.addFriend(this.tokenStorage.getUser().userId, this.user.userId).subscribe(
      data => {
        console.log('data sendRequestAddFriend : ', data);
        if (data === true){
          this.relationType = 1;
        }
      }, error => {
        console.log('error sendRequestAddFriend : ', error);
      }
    );

  }

  checkSentInvitation(friendId): void{
    this.userService.checkSentInvitation(this.tokenStorage.getUser().userId, friendId).subscribe(
      data => {
        console.log('data checkfriend : ', data.length);
        if (data.length > 0){
          this.relationType = 1;
        }
      }, error => {
        console.log('err checkfriend : ', error);
      }
    );
  }

  checkReceivedInvitation(friendId): void{
    this.userService.checkReceivedInvitation(this.tokenStorage.getUser().userId, friendId).subscribe(
      data => {
        console.log('data checkfriend : ', data.length);
        if (data.length > 0){
          this.relationType = 2;
        }
      }, error => {
        console.log('err checkfriend : ', error);
      }
    );
  }
}
