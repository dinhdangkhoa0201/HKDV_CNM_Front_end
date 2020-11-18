import {Component, Inject, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-notify-new-message',
  templateUrl: './notify-new-message.component.html',
  styleUrls: ['./notify-new-message.component.css']
})
export class NotifyNewMessageComponent implements OnInit {
  senderName: '';
  content: '';
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any, private snackBar: MatSnackBar) {
    this.senderName = data.senderName;
    this.content = data.content;

    console.log('sender name ::', this.senderName);
    console.log('content ::', this.content);
  }

  ngOnInit(): void {
  }

}
