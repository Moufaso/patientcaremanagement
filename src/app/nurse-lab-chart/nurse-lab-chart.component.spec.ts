import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NurseLabChartComponent } from './nurse-lab-chart.component';

describe('NurseLabChartComponent', () => {
  let component: NurseLabChartComponent;
  let fixture: ComponentFixture<NurseLabChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NurseLabChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NurseLabChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
