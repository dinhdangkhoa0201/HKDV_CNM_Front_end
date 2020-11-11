import { Component, OnInit } from '@angular/core';
import { onSideNavChange, animateText } from '../_interfaces/animation';

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.css'],
  animations: [onSideNavChange, animateText]
})
export class LeftMenuComponent implements OnInit {

  sideNavState: boolean;
  linkText: boolean;
  constructor() { }

  ngOnInit(): void {
    this.sideNavState = false;
    this.linkText = false;
  }

  onSidenavToggle(): void {
    this.sideNavState = !this.sideNavState;

    setTimeout(() => {
      this.linkText = this.sideNavState;
    }, 200);

  }

}
