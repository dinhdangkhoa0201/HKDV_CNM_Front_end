import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifyRequestAddFriendComponent } from './notify-request-add-friend.component';

describe('NotifyRequestAddFriendComponent', () => {
  let component: NotifyRequestAddFriendComponent;
  let fixture: ComponentFixture<NotifyRequestAddFriendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotifyRequestAddFriendComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifyRequestAddFriendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
