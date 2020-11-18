import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifySuccessComponent } from './notify-success.component';

describe('NotifySuccessComponent', () => {
  let component: NotifySuccessComponent;
  let fixture: ComponentFixture<NotifySuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotifySuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifySuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
