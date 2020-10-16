import { TokenStorageService } from './../_services/token-storage.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  currentUser: any;

  isLoggedIn: boolean;

  constructor(private token: TokenStorageService) {}

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    if (sessionStorage.getItem('isLoggedIn') === 'true'){
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }
}
