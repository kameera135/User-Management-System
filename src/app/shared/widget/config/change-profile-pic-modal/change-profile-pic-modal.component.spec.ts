import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeProfilePicModalComponent } from './change-profile-pic-modal.component';

describe('ChangeProfilePicModalComponent', () => {
  let component: ChangeProfilePicModalComponent;
  let fixture: ComponentFixture<ChangeProfilePicModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangeProfilePicModalComponent]
    });
    fixture = TestBed.createComponent(ChangeProfilePicModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
