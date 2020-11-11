import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifyAcceptedAddFriendComponent } from './notify-accepted-add-friend.component';

describe('NotifyAcceptedAddFriendComponent', () => {
  let component: NotifyAcceptedAddFriendComponent;
  let fixture: ComponentFixture<NotifyAcceptedAddFriendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotifyAcceptedAddFriendComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifyAcceptedAddFriendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
