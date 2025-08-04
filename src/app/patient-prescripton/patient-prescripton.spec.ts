import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientPrescripton } from './patient-prescripton';

describe('PatientPrescripton', () => {
  let component: PatientPrescripton;
  let fixture: ComponentFixture<PatientPrescripton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientPrescripton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientPrescripton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
