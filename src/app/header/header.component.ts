import {Component, Input, OnInit} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {TokenStorageService} from '../_services/token-storage.service';
import {DialogUserInformationComponent} from '../dialog/dialog-user-information/dialog-user-information.component';
import {DialogChangePasswordComponent} from '../dialog/dialog-change-password/dialog-change-password.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser: any;
  @Input() sidenav: MatSidenav;
  isLoggedIn: boolean;
  dialogRef: MatDialogRef<any>;
  userName: '';
  roles: string[];
  isAdmin: boolean;
  showAdminBoard = false;

  constructor(private tokenStorageService: TokenStorageService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.isLoggedIn = false;

    this.currentUser =  this.tokenStorageService.getUser();
    this.isLoggedIn = !!this.tokenStorageService.getUser();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      if (this.roles.length > 0){
        if (this.roles.indexOf('ROLE_ADMIN') > 0){
          this.isAdmin = true;
        } else {
          this.isAdmin = false;
        }
      }
      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.userName = user.userName;
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }

  openProfile(): void {
    this.dialogRef = this.dialog.open(DialogUserInformationComponent, {
      disableClose: true
    });
  }

  changePassword(): void {
    this.dialogRef = this.dialog.open(DialogChangePasswordComponent, {
      disableClose: true
    });
  }

}
