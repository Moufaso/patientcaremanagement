import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { DepartmentLabComponent } from './department-lab/department-lab.component';
import { PatientLabResultComponent } from './patient-lab-result/patient-lab-result.component';
import { PatientPrescriptionComponent } from './patient-prescription/patient-prescription.component';
import { DepartmentAppointmentComponent } from './department-appointment/department-appointment.component';
import { NurseLabChartComponent } from './nurse-lab-chart/nurse-lab-chart.component';
import { AppointmentDepartmentChartComponent } from './appointment-department-chart/appointment-department-chart.component';
//import { provideHttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [
    //RouterOutlet,
    // add child components here
    DepartmentLabComponent,
    PatientPrescriptionComponent,
    PatientLabResultComponent,
    DepartmentAppointmentComponent,
    NurseLabChartComponent,
    AppointmentDepartmentChartComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('patientcaremanagement');
}
