import { Component, OnInit } from '@angular/core';
import { onSideNavChange, animateText } from '../_interfaces/animation';
import {TokenStorageService} from '../_services/token-storage.service';

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.css'],
  animations: [onSideNavChange, animateText]
})
export class LeftMenuComponent implements OnInit {

  sideNavState: boolean;
  linkText: boolean;
  user: any;
  constructor(private token: TokenStorageService) { }


  ngOnInit(): void {
    this.sideNavState = false;
    this.linkText = false;
    this.user = this.token.getUser();
  }

  onSidenavToggle(): void {
    this.sideNavState = !this.sideNavState;

    setTimeout(() => {
      this.linkText = this.sideNavState;
    }, 200);

  }

}
