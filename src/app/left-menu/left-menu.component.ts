<<<<<<< HEAD
import {Component, OnInit} from '@angular/core';
import {onSideNavChange, animateText} from '../_interfaces/animation';
import {TokenStorageService} from '../_services/token-storage.service';
import {SseService} from '../_services/sse.service';
=======
import { SseService } from './../_services/sse.service';
import { FileService } from './../_services/file.service';
import { Component, OnInit } from '@angular/core';
import { onSideNavChange, animateText } from '../_interfaces/animation';
import { TokenStorageService } from '../_services/token-storage.service';
>>>>>>> 927f459a086855f1692623bcddae48da400b5cf8

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
  admin: boolean;
<<<<<<< HEAD
  newMessage: boolean;
  avatarSrc: any;

  constructor(private token: TokenStorageService, private sse: SseService) {
=======
  avatarSrc: any;

  constructor(private token: TokenStorageService, private sseService: SseService) {
>>>>>>> 927f459a086855f1692623bcddae48da400b5cf8
  }


  ngOnInit(): void {
    this.newMessage = false;
    this.admin = false;
    this.sideNavState = false;
    this.linkText = false;
    this.user = this.token.getUser();
<<<<<<< HEAD
    this.sse.currentAvatar.subscribe(avatarSrc => this.avatarSrc = avatarSrc);
=======
    this.sseService.currentAvatar.subscribe(avatarSrc => this.avatarSrc = avatarSrc);
>>>>>>> 927f459a086855f1692623bcddae48da400b5cf8
    this.isAdmin();
  }

  isAdmin(): any {
    this.user.roles.forEach(role => {
      if (role.roleName === 'ROLE_ADMIN') {
        this.admin = true;
        return true;
      }
      return false;
    });
  }

  onSidenavToggle(): void {
    this.sideNavState = !this.sideNavState;

    setTimeout(() => {
      this.linkText = this.sideNavState;
    }, 200);

  }

  notify(): void {

  }

}
