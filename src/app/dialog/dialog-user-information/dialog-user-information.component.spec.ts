import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUserInformationComponent } from './dialog-user-information.component';

describe('DialogUserInformationComponent', () => {
  let component: DialogUserInformationComponent;
  let fixture: ComponentFixture<DialogUserInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogUserInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUserInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
