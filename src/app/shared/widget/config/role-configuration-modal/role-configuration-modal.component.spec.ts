import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleConfigurationModalComponent } from './role-configuration-modal.component';

describe('ProfileConfigurationModalComponent', () => {
  let component: RoleConfigurationModalComponent;
  let fixture: ComponentFixture<RoleConfigurationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleConfigurationModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleConfigurationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
