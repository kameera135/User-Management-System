import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightTreeNodeComponent } from './right-tree-node.component';

describe('RightTreeNodeComponent', () => {
  let component: RightTreeNodeComponent;
  let fixture: ComponentFixture<RightTreeNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RightTreeNodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RightTreeNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
