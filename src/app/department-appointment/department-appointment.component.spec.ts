import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentAppointmentComponent } from './department-appointment.component';

describe('DepartmentAppointmentComponent', () => {
  let component: DepartmentAppointmentComponent;
  let fixture: ComponentFixture<DepartmentAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentAppointmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
