import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientLabResult } from './patient-lab-result';

describe('PatientLabResult', () => {
  let component: PatientLabResult;
  let fixture: ComponentFixture<PatientLabResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientLabResult]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientLabResult);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
