import { environment } from './../environments/environment';
import {TokenStorageService} from './_services/token-storage.service';
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'user-manager-system-frontend';

  private roles: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  userName: string;

  constructor(private token: TokenStorageService) {
  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.token.getToken();

    if (this.isLoggedIn) {
      const user = this.token.getUser();

      console.log('username : ' + user.userName);
      console.log('user : ' + user);

      this.roles = user.roles;
      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.userName = user.userName;
    }
  }

  logout(): void {
    this.token.signOut();
    window.location.reload();
  }
}
