import {Component, Inject, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBar, MatSnackBarRef} from '@angular/material/snack-bar';

@Component({
  selector: 'app-notify-request-add-friend',
  templateUrl: './notify-request-add-friend.component.html',
  styleUrls: ['./notify-request-add-friend.component.css']
})
export class NotifyRequestAddFriendComponent implements OnInit {
  name: string;
  message: string;
  action: string;
  snackBar: MatSnackBar;
  constructor(public snackbarRef: MatSnackBarRef<NotifyRequestAddFriendComponent>,
              @Inject(MAT_SNACK_BAR_DATA) public data: any) {
    this.name = data.name;
    this.message = data.message;
  }

  ngOnInit(): void {
    this.openSnackBar();
  }

  openSnackBar(): void {
    this.snackBar.open(this.message, this.action, {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

}
