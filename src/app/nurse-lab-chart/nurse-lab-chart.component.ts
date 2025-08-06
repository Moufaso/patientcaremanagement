import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { QueryService } from '../services/query.service';

@Component({
  selector: 'app-nurse-lab-chart',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './nurse-lab-chart.component.html',
  styleUrls: ['./nurse-lab-chart.component.css'],
})
export class NurseLabChartComponent implements OnInit {
  chartData: any[] = [];

  constructor(private query: QueryService) {}

  ngOnInit(): void {
    this.query.getNurseLabCounts().subscribe((res) => {
      this.chartData = res.map((item: any) => ({
        name: item.name,
        value: item.count,
      }));
    });
  }

  ngAfterViewInit(): void {
    // Give ngx-charts a kick to recalculate layout
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }
}
