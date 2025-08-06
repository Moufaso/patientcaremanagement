import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentLabComponent } from './department-lab.component';

describe('DepartmentLabComponent', () => {
  let component: DepartmentLabComponent;
  let fixture: ComponentFixture<DepartmentLabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentLabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
