import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { QueryService } from '../services/query.service';

@Component({
  selector: 'app-appointment-department-chart',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './appointment-department-chart.component.html',
})
export class AppointmentDepartmentChartComponent implements OnInit {
  data: any[] = [];
  view: [number, number] = [700, 400];

  // Optional settings
  showLegend = true;
  showLabels = true;
  isDoughnut = false;
  legendPosition: 'right' | 'below' = 'right';
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  constructor(private query: QueryService) {}

  ngOnInit(): void {
    this.query.getAppointmentCountsByDepartment().subscribe({
      next: (res) => {
        console.log('Raw response from backend:', res);

        // Use directly if backend format is good
        this.data = res;

        console.log('Validated chart data:', this.data);
      },
      error: (err) => {
        console.error('Error loading chart data', err);
      },
    });
  }
}
