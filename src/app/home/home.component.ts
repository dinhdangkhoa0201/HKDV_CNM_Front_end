import { TokenStorageService } from './../_services/token-storage.service';
import {UserService} from './../_services/user.service';
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  content: string;
  userName: string;

  constructor(private userService: UserService, private tokenStore: TokenStorageService) {
  }

  ngOnInit(): void {
    this.userName = '';
    this.userService.getPublicContent().subscribe(
      (data) => {
        this.content = data;
      },
      (err) => {
        this.content = JSON.parse(err.error.message);
      }
    );
    const user = this.tokenStore.getUser();
    if(user instanceof undefined){
      this.userName = '';
    }
    this.userName = user.userName;
  }
}
