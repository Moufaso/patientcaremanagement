import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentDepartmentChartComponent } from './appointment-department-chart.component';

describe('AppointmentDepartmentChartComponent', () => {
  let component: AppointmentDepartmentChartComponent;
  let fixture: ComponentFixture<AppointmentDepartmentChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentDepartmentChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentDepartmentChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
