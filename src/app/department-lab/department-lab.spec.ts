import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentLab } from './department-lab';

describe('DepartmentLab', () => {
  let component: DepartmentLab;
  let fixture: ComponentFixture<DepartmentLab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentLab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentLab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
