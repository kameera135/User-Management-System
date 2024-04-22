import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformUserModalComponent } from './platform-user-modal.component';

describe('PlatformUserModalComponent', () => {
  let component: PlatformUserModalComponent;
  let fixture: ComponentFixture<PlatformUserModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlatformUserModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlatformUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
