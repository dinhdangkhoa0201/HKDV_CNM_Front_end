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
import {NotifyErrorComponent} from '../notify/notify-error/notify-error.component';
import {NotifySuccessComponent} from '../notify/notify-success/notify-success.component';
import {ToastrService} from 'ngx-toastr';

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
      selected: true
    },
    {
      title: 'Lời mời kết bạn',
      icon: 'add_ic_call',
      badge: false,
      selected: false
    },
    {
      title: 'Lời mời đã gửi',
      icon: 'settings_phone',
      badge: false,
      selected: false
    }
  ];

  displayedColumns: string[] = ['Avatar', 'Name', 'Email', 'Phone'];
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
  selectedRowIndex: -1;

  selected: string;


  constructor(private userService: UserService, private dialog: MatDialog, private tokenStorage: TokenStorageService, private sse: SseService, private snackBar: MatSnackBar, private snackbar: MatSnackBar, private  toast: ToastrService) {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<User>();
    this.getListFriend();
    this.notify();
    this.buttonStyle = 0;
    this.notifyStyleFriend = false;
    this.notifyStyleReceivedInvitation = false;
    this.notifyStyleSentInvitation = false;
    this.isFinding = false;
    this.selected = '';
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
    this.selected = list.selectedOptions.selected[0]?.value;
    console.log('filterContact : ', this.selected);
    switch (this.selected) {
      case 'Bạn bè': {
        this.getListFriend();
        this.buttonStyle = 0;
        this.isFinding = false;
        break;
      }
      case 'Lời mời kết bạn': {
        this.getListInvites();
        this.buttonStyle = 1;
        this.isFinding = false;
        break;
      }
      case 'Lời mời đã gửi': {
        this.getListRequests();
        this.buttonStyle = 2;
        this.isFinding = false;
        break;
      }
    }
  }

  filterContactChips(item): void {
    /*    const value = list.selectedOptions.selected[0]?.value;*/
    /*    console.log('value ', list.selectedOptions.selected[0]?.value);*/
    this.selected = item.title;
    console.log('filterContactChips temp : ', this.selected );
    this.listItems[0].selected = false;
    this.listItems[1].selected = false;
    this.listItems[2].selected = false;

    switch (item.title) {
      case 'Bạn bè': {
        this.getListFriend();
        this.listItems[0].selected = true;
        this.buttonStyle = 0;
        break;
      }
      case 'Lời mời kết bạn': {
        this.getListInvites();
        this.listItems[1].selected = true;
        this.buttonStyle = 1;
        break;
      }
      case 'Lời mời đã gửi': {
        this.getListRequests();
        this.listItems[2].selected = true;
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

          this.toast.success(data.message, '');

          // this.snackBar.open(data.message, 'Close', {
          //   duration: 5000,
          //   horizontalPosition: 'right',
          //   verticalPosition: 'top'
          // });

        } else if (data.title === '2') {
          this.listItems[1].badge = true;
          this.toast.success(data.message, '');

          // this.snackBar.open(data.message, 'Close', {
          //   duration: 5000,
          //   horizontalPosition: 'right',
          //   verticalPosition: 'top'
          // });
        }


        if (data.status === 'DELETE_INVITATION') {
/*          console.log('DELETE_INVITATION');*/
          this.listItems[2].badge = false;
          this.getListInvites();
        }


      }, error => {
/*        console.log('err subscribe : ', error);*/
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
          window.location.reload();
        }
      }, error => {
        console.log('err acceptRequestAddFriend : ', error);
      }
    );
  }

  deleteInvitationSent(friendId): void {
    if (confirm('Bạn có muốn xoá lời mời này?')) {
      this.userService.deleteInvitationSent(this.tokenStorage.getUser().userId, friendId).subscribe(
        data => {
          console.log('data deleteInvitation', data);
          if (data === true) {
            this.toastSuccess('Xoá lời kết bạn thành công');
            this.getListRequests();
          }
        }, error => {
          console.log('deleteInvitation deleteInvitation ', error);
        }
      );
    }
  }

  deleteInvitationReceived(friendId): void {
    if (confirm('Bạn có muốn xoá lời mời này?')) {
      this.userService.deleteInvitationReceived(this.tokenStorage.getUser().userId, friendId).subscribe(
        data => {
          console.log('data deleteInvitation', data);
          if (data === true) {
            this.toastSuccess('Xoá lời kết bạn thành công');
            this.getListInvites();
          }
        }, error => {
          console.log('deleteInvitation deleteInvitation ', error);
        }
      );
    }
  }

  delete(userId): void {
    console.log('selected : ', this.selected);
    if (this.selected === 'Lời mời kết bạn') {
      this.deleteInvitationReceived(userId);
    } else if (this.selected === 'Lời mời đã gửi') {
      this.deleteInvitationSent(userId);
    }
  }

  clickOnRow(row): void {
    console.log('click on row', row);
    this.dialogRef = this.dialog.open(DialogFriendInformationComponent, {
      data: {
        user: row,
        ownerId: this.tokenStorage.getUser().userId,
      }
    });
  }

  toastError(message): void {
    this.toast.error(message, 'Error');
  }

  toastSuccess(message): void {
    this.toast.success(message, 'Success');
  }


}
