import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogChangeInformationComponent } from './dialog-change-information.component';

describe('DialogChangeInformationComponent', () => {
  let component: DialogChangeInformationComponent;
  let fixture: ComponentFixture<DialogChangeInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogChangeInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogChangeInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
