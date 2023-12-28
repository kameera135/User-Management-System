import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemTokensComponent } from './system-tokens.component';

describe('SystemTokensComponent', () => {
  let component: SystemTokensComponent;
  let fixture: ComponentFixture<SystemTokensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemTokensComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemTokensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
