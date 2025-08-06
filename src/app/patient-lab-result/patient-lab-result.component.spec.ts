import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientLabResultComponent } from './patient-lab-result.component';

describe('PatientLabResultComponent', () => {
  let component: PatientLabResultComponent;
  let fixture: ComponentFixture<PatientLabResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientLabResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientLabResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
