import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemTokenModalComponent } from './system-token-modal.component';

describe('SystemTokenModalComponent', () => {
  let component: SystemTokenModalComponent;
  let fixture: ComponentFixture<SystemTokenModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemTokenModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemTokenModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
