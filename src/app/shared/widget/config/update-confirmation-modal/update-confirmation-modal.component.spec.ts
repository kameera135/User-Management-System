import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateConfirmationModalComponent } from './update-confirmation-modal.component';

describe('UpdateConfirmationModalComponent', () => {
  let component: UpdateConfirmationModalComponent;
  let fixture: ComponentFixture<UpdateConfirmationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateConfirmationModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
