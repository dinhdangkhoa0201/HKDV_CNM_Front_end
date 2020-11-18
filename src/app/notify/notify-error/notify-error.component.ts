import {Component, Inject, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';

@Component({
  selector: 'app-notify-error',
  templateUrl: './notify-error.component.html',
  styleUrls: ['./notify-error.component.css']
})
export class NotifyErrorComponent implements OnInit {
  content: '';
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    this.content = data.content;
  }

  ngOnInit(): void {
  }

}
