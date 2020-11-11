import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFriendInformationComponent } from './dialog-friend-information.component';

describe('DialogFriendInformationComponent', () => {
  let component: DialogFriendInformationComponent;
  let fixture: ComponentFixture<DialogFriendInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogFriendInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogFriendInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
