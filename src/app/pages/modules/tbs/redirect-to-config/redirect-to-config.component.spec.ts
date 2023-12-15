import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectToConfigComponent } from './redirect-to-config.component';

describe('RedirectToConfigComponent', () => {
  let component: RedirectToConfigComponent;
  let fixture: ComponentFixture<RedirectToConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedirectToConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedirectToConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
