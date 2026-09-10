import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAirlinesComponent } from './manage-airlines.component';

describe('ManageAirlinesComponent', () => {
  let component: ManageAirlinesComponent;
  let fixture: ComponentFixture<ManageAirlinesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageAirlinesComponent]
    });
    fixture = TestBed.createComponent(ManageAirlinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
