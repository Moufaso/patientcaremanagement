import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PatientPrescripton } from "./patient-prescripton/patient-prescripton";
import { PatientLabResult } from "./patient-lab-result/patient-lab-result";
import { DepartmentAppointment } from "./department-appointment/department-appointment";
import { DepartmentLab } from "./department-lab/department-lab";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PatientPrescripton, PatientLabResult, DepartmentAppointment, DepartmentLab],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('patientcaremanagement');
}
