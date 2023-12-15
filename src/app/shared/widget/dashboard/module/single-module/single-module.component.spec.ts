import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleModuleComponent } from './single-module.component';

describe('SingleModuleComponent', () => {
  let component: SingleModuleComponent;
  let fixture: ComponentFixture<SingleModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleModuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
