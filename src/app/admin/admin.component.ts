import { User } from './../_interfaces/user';

import { AdminService } from './../_services/admin.service';
import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['UserId', 'UserName', 'Birthday', 'Phone', 'Email', 'Enable', 'Delete'];
  dataSource: MatTableDataSource<User>;
  isLoadingResults: boolean;

  temps = Array.from<User>(
    [
      {
        'userId': 1,
        'userName': 'DDK',
        'birthday': '1999-10-02',
        'phone': '0398122553',
        'email': 'dinhdangkhoa@gmail.com',
        'enable': false
      }
    ]
  );

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private adminService: AdminService, private dialog: MatDialog) {
  }
  ngAfterViewInit(): void {
  }
  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.dataSource = new MatTableDataSource();
    this.dataSource = new MatTableDataSource<User>(this.temps);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // this.adminService.findAllUsers().subscribe(
    //   data => {
    //     const users = Array.from<User>(data);
    //     this.isLoadingResults = false;
    //     this.dataSource = new MatTableDataSource<User>(users);
    //     this.dataSource.paginator = this.paginator;
    //     this.dataSource.sort = this.sort;
    //   },
    //   err => {}
    // );
    this.isLoadingResults = true;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  confirmSetEnable(): void {
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
  }

}

