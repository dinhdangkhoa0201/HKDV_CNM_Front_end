import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {TokenStorageService} from '../_services/token-storage.service';
import {SidenavService} from '../_services/sidenav.service';
import {DialogUserInformationComponent} from '../dialog/dialog-user-information/dialog-user-information.component';
import {DialogChangePasswordComponent} from '../dialog/dialog-change-password/dialog-change-password.component';
import {onMainContentChange} from '../_interfaces/animation';

@Component({
  selector: 'app-board-user',
  templateUrl: './board-user.component.html',
  styleUrls: ['./board-user.component.css'],
  animations: [ onMainContentChange ],
})
export class BoardUserComponent implements OnInit {
  title = 'user-manager-system-frontend';
  private dialogRef: MatDialogRef<any>;
  private roles: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  userName: string;
  isAdmin: boolean;

  onSideNavChange: boolean;

  constructor(private token: TokenStorageService, private dialog: MatDialog, private sidenavService: SidenavService) {
    this.sidenavService.sideNavState$.subscribe(res => {
      this.onSideNavChange = res;
    });
  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.token.getUser();

    console.log('is Logged in : ' + this.isLoggedIn);

    if (this.isLoggedIn) {
      const user = this.token.getUser();
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
    this.token.signOut();
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
