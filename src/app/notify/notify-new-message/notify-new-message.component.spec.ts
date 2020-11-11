import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifyNewMessageComponent } from './notify-new-message.component';

describe('NotifyNewMessageComponent', () => {
  let component: NotifyNewMessageComponent;
  let fixture: ComponentFixture<NotifyNewMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotifyNewMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifyNewMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
