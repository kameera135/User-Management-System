import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureConfigurationModalComponent } from './permission-configuration-modal.component';

describe('FeatureConfigurationModalComponent', () => {
  let component: FeatureConfigurationModalComponent;
  let fixture: ComponentFixture<FeatureConfigurationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeatureConfigurationModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeatureConfigurationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
