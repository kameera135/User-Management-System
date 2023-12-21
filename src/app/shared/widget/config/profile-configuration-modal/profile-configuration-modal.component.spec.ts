import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileConfigurationModalComponent } from './profile-configuration-modal.component';

describe('ProfileConfigurationModalComponent', () => {
  let component: ProfileConfigurationModalComponent;
  let fixture: ComponentFixture<ProfileConfigurationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileConfigurationModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileConfigurationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
