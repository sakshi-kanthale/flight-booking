import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightManagementComponent } from './flight-management.component';

describe('FlightManagementComponent', () => {
  let component: FlightManagementComponent;
  let fixture: ComponentFixture<FlightManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FlightManagementComponent]
    });
    fixture = TestBed.createComponent(FlightManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
