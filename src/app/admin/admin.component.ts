import { User } from './../_interfaces/user';

import { AdminService } from './../_services/admin.service';
import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import {DialogAddUserComponent} from '../dialog/dialog-add-user/dialog-add-user.component';
import {UserService} from '../_services/user.service';
import {TokenStorageService} from '../_services/token-storage.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['UserId', 'UserName', 'Gender', 'Birthday', 'Phone', 'Email', 'Enable', 'Delete'];
  dataSource: MatTableDataSource<User>;
  isLoadingResults: boolean;
  dialogRef: MatDialogRef<any>;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private adminService: AdminService, private dialog: MatDialog, private userService: UserService, private token: TokenStorageService) {
  }
  ngAfterViewInit(): void {
  }
  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.dataSource = new MatTableDataSource();
/*    this.dataSource = new MatTableDataSource<User>(this.temps);*/
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.isLoadingResults = true;
    this.adminService.findAllUsers().subscribe(
      data => {
        const users = Array.from<User>(data);
        users.forEach((item, index) => {
          if (item.userId === this.token.getUser().userId){
            users.splice(index, 1);
          }
        });
        this.isLoadingResults = false;
        this.dataSource = new MatTableDataSource<User>(users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      err => {
        console.log('err', err);
      }
    );

  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  confirmSetEnable(userId, enable): void {
    console.log('enable : ', enable);
    this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Set Enable User',
        message: enable === false ? 'Do you want to set Enable for this user?' : 'Do you want to set Disable for this user?',
      }
    });

    this.dialogRef.afterClosed().subscribe(
      rs => {
        if (rs){
          this.adminService.setEnableUser(userId, enable).subscribe(
            data => {
              console.log('data ', data);
            },
            err => {
              console.log('err ', err);
            }
          );
        }
        console.log('rs : ' + rs);
      }
    );
  }

  onChange(value, userId): void {
    if (value.checked === true) {
      console.log({ checked: true, userId });
    } else {
      console.log({ checked: false, userId });
    }
  }

  removeUser(userId): void {
    console.log('userId : ' + userId);
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Remove Employee',
        message: 'Are you sure, you want to remove an employee: ' + userId
      }
    });

    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.adminService.deleteUser(userId);
      }
    });
  }

  addUser(): void {
    this.dialogRef = this.dialog.open(DialogAddUserComponent, {
      disableClose: true
    });
  }
}

