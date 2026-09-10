import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAirportsComponent } from './manage-airports.component';

describe('ManageAirportsComponent', () => {
  let component: ManageAirportsComponent;
  let fixture: ComponentFixture<ManageAirportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageAirportsComponent]
    });
    fixture = TestBed.createComponent(ManageAirportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
