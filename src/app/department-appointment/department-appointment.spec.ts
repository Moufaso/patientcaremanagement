import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentAppointment } from './department-appointment';

describe('DepartmentAppointment', () => {
  let component: DepartmentAppointment;
  let fixture: ComponentFixture<DepartmentAppointment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentAppointment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentAppointment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
