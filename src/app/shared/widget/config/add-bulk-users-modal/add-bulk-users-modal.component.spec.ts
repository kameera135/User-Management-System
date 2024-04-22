import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBulkUsersModalComponent } from './add-bulk-users-modal.component';

describe('AddBulkUsersModalComponent', () => {
  let component: AddBulkUsersModalComponent;
  let fixture: ComponentFixture<AddBulkUsersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBulkUsersModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBulkUsersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
