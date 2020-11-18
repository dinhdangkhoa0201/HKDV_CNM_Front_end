import {Component, Inject, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';

@Component({
  selector: 'app-notify-success',
  templateUrl: './notify-success.component.html',
  styleUrls: ['./notify-success.component.css']
})
export class NotifySuccessComponent implements OnInit {
  content: '';
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    this.content = data.content;
  }

  ngOnInit(): void {
  }

}
