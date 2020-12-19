import {TokenStorageService} from './_services/token-storage.service';
import {AfterViewInit, Component, HostListener, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DialogUserInformationComponent} from './dialog/dialog-user-information/dialog-user-information.component';
import {DialogChangePasswordComponent} from './dialog/dialog-change-password/dialog-change-password.component';
import {onMainContentChange} from './_interfaces/animation';
import {SidenavService} from './_services/sidenav.service';
import {SseService} from './_services/sse.service';
import {ToastrService} from 'ngx-toastr';
import {environment} from '../environments/environment.prod';
import {Subject} from 'rxjs';

const API_URL = environment.API_URL + '/api/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [onMainContentChange],

})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'user-manager-system-frontend';
  private dialogRef: MatDialogRef<any>;
  private roles: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  userName: string;
  isAdmin: boolean;
  onSideNavChange: boolean;

  constructor(private token: TokenStorageService, private dialog: MatDialog, private sidenavService: SidenavService, private toasty: ToastrService, private sse: SseService) {
    this.sidenavService.sideNavState$.subscribe(res => {
      this.onSideNavChange = res;
    });
  }


  ngOnInit(): void {
    this.isLoggedIn = !!this.token.getUser();
    if (this.isLoggedIn) {
      const user = this.token.getUser();
      this.roles = user.roles;
      if (this.roles.length > 0) {
        if (this.roles.indexOf('ROLE_ADMIN') > 0) {
          this.isAdmin = true;
        } else {
          this.isAdmin = false;
        }
      }
      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.userName = user.userName;
    }
  }

  ngAfterViewInit(): void {
    this.connectToSSE();
  }

  logout(): void {
    /*    if (confirm('Bạn có muốn đăng xuất?')) {
          this.sse.disconnect(this.token.getUser().userId).subscribe(
            data => {
              console.log('data sign out ', data);
            }, error => {
              console.log('error', error);
            }
          );
        }*/
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

  connectToSSE(): void {
    if (this.isLoggedIn) {
      this.sse.subscribe().subscribe(data => {
        data = JSON.parse(data.data);

        console.log('new message : ', data);
        if (data.status === 0 || data.status === 1) {
          this.toasty.success(data.message);
        }
        if (data.status === 2) {
          if (data.senderId !== this.token.getUser().userId) {
            this.toasty.success(data.message);
          }
        }

      }, error => {
        console.log('error ', error);
      });
    }
  }


}
