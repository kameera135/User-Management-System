import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonExportComponent } from './common-export.component';

describe('CommonExportComponent', () => {
  let component: CommonExportComponent;
  let fixture: ComponentFixture<CommonExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonExportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
