import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {User} from '../_interfaces/user';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {UserService} from '../_services/user.service';
import {DialogFriendInformationComponent} from '../dialog/dialog-friend-information/dialog-friend-information.component';
import {TokenStorageService} from '../_services/token-storage.service';
import {SseService} from '../_services/sse.service';
import {MatSnackBar, MatSnackBarRef} from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit, AfterViewInit {

  listItems = [
    {
      title: 'Bạn bè',
      icon: 'people',
      badge: false,
    },
    {
      title: 'Lời mời kết bạn',
      icon: 'add_ic_call',
      badge: false,
    },
    {
      title: 'Lời mời đã gửi',
      icon: 'settings_phone',
      badge: false
    }
  ];

  displayedColumns: string[] = ['Select', 'Avatar', 'Name', 'Email', 'Phone', 'Action'];
  dataSource: MatTableDataSource<User>;
  isLoadingResults: boolean;
  dialogRef: MatDialogRef<any>;
  snackBarRef: MatSnackBarRef<any>;

  selection = new SelectionModel<User>(true, []);
  chooses: string[] = ['Bạn bè', 'Lời mời kết bạn', 'Lời mời đã gửi'];
  listContact: any;
  listFindings: User[];

  listFriend: User[];
  listOfReceivedInvites: User[];
  listOfSentInvitation: User[];

  buttonStyle: number;

  notifyStyleFriend: boolean;
  notifyStyleReceivedInvitation: boolean;
  notifyStyleSentInvitation: boolean;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isFinding: boolean;
  resultOfFinding: boolean;


  constructor(private userService: UserService, private dialog: MatDialog, private tokenStorage: TokenStorageService, private sse: SseService, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<User>();
    const tempData: User[] = [
      {
        userId: 1,
        userName: 'Dinh Dang Khoa',
        birthday: '0398122553',
        gender: 'Name',
        phone: '0398122553',
        email: 'dinhdangkhoa0201@gmail.com',
        password: '',
        enable: true,
        roles: [],
      }, {
        userId: 2,
        userName: 'Dinh Dang Khoa',
        birthday: '0398122553',
        gender: 'Name',
        phone: '0398122553',
        email: 'dinhdangkhoa0201@gmail.com',
        password: '',
        enable: true,
        roles: [],
      },
    ];
    this.getListFriend();
    this.notify();
    this.buttonStyle = 0;

    this.notifyStyleFriend = false;
    this.notifyStyleReceivedInvitation = false;
    this.notifyStyleSentInvitation = false;
  }

  isAllSelected(): any {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkbox(row?: User): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.userId + 1}`;
  }

  filterContact(list): void {
/*    const value = list.selectedOptions.selected[0]?.value;*/
/*    console.log('value ', list.selectedOptions.selected[0]?.value);*/
    const temp =  list.selectedOptions.selected[0]?.value;
    switch (temp) {
      case 'Bạn bè': {
        this.getListFriend();
        this.buttonStyle = 0;
        break;
      }
      case 'Lời mời kết bạn': {
        this.getListInvites();
        this.buttonStyle = 1;
        break;
      }
      case 'Lời mời đã gửi': {
        this.getListRequests();
        this.buttonStyle = 2;
        break;
      }
    }

  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isFindingFriend(target): void {
    if (target.value.trim().length > 0) {
      this.isFinding = true;
      this.userService.findFriend(target.value).subscribe(
        data => {
          console.log('data list finding : ', data);
          this.listFindings = data;
          this.resultOfFinding = false;
          console.log('list finding : ', this.listFindings);
        },
        err => {
          console.log('err isFindingFriend ', err);
        }
      );
    } else {
      this.isFinding = false;
    }
  }

  showInformation(user: User): void {
    console.log('user : ', user);
    this.dialogRef = this.dialog.open(DialogFriendInformationComponent, {
      data: {
        user,
        ownerId: this.tokenStorage.getUser().userId,
      }
    });
  }

  notify(): void {
    console.log('hello');
    this.sse.subscribe().subscribe(
      data => {
        data = JSON.parse(data.data);
        console.log('data : ', data);
        if (data.title === '1') {
          this.listItems[0].badge = true;
        } else if (data.title === '2') {
          this.listItems[1].badge = true;
        }
        this.snackBar.open(data.message, 'Close', {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });

      }, error => {
        console.log('err subscribe : ', error);
      }
    );
  }

  getListFriend(): void {
    this.resultOfFinding = true;
    this.userService.getListFriends(this.tokenStorage.getUser().userId).subscribe(
      data => {
        console.log('data friend : ', data);
        this.listFriend = data;
        this.dataSource = new MatTableDataSource<User>(this.listFriend);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isFinding = false;
        this.listItems[0].badge = false;
      },
      err => {
        console.log('err getlistfriend : ', err);
      }
    );
  }

  getListRequests(): void {
    this.resultOfFinding = true;
    this.userService.getListOfSentInvitation(this.tokenStorage.getUser().userId).subscribe(
      data => {
        console.log('data request : ', data);
        this.listOfSentInvitation = data;
        this.dataSource = new MatTableDataSource<User>(this.listOfSentInvitation);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isFinding = false;
      },
      err => {
        console.log('err getlistinvites : ', err);
      }
    );
  }

  getListInvites(): void {
    this.resultOfFinding = true;
    this.userService.getListInvites(this.tokenStorage.getUser().userId).subscribe(
      data => {
        console.log('data invites : ', data);
        this.listOfReceivedInvites = data;
        this.dataSource = new MatTableDataSource<User>(this.listOfReceivedInvites);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isFinding = false;
        this.listItems[1].badge = false;
      },
      err => {
        console.log('err getlistinvites : ', err);
      }
    );
  }

  ngAfterViewInit(): void {

  }

  acceptRequestAddFriend(friendId): void {
    console.log('friend Id : ', friendId);
    this.userService.acceptRequestAddFriend(this.tokenStorage.getUser().userId, friendId).subscribe(
      data => {
        console.log('data acceptRequestAddFriend : ', data);
        if (data === true) {

        }
      }, error => {
        console.log('err acceptRequestAddFriend : ', error);
      }
    );
  }
}