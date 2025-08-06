import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QueryService {
  private baseUrl = 'http://localhost:8080'; // Adjust if your Spring Boot backend runs on a different port

  constructor(private http: HttpClient) {}
  // Complex 1
  getLabsByDepartment(deptName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/labs/department/${deptName}`);
  }
  getPatientName(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/patients/${id}`);
  }
  getNurseName(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/nurses/${id}`);
  }

  // Complex 2
  getPrescriptionsByPatient(name: string) {
    return this.http.get<any[]>(
      `${this.baseUrl}/prescription/${encodeURIComponent(name)}`
    );
  }
  getDoctorName(id: number | string) {
    return this.http.get<{ name: string }>(`${this.baseUrl}/doctors/${id}`);
  }
  getAppointmentById(id: number | string) {
    return this.http.get<any>(`${this.baseUrl}/appointments/${id}`);
  }

  // Complex 3
  getAppointmentsByDepartment(deptName: string) {
    return this.http.get<any[]>(
      `${this.baseUrl}/appointments/department/${encodeURIComponent(deptName)}`
    );
  }

  // Complex 4

  getLabResultsByPatient(patientName: string) {
    return this.http.get<any[]>(
      `${this.baseUrl}/result/${encodeURIComponent(patientName)}`
    );
  }
  getLabById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/labs/${id}`);
  }

  // Visualizations
  getNurseLabCounts(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/labs/count-by-nurse');
  }

  getAppointmentCountsByDepartment(): Observable<any[]> {
    return this.http.get<any[]>(
      'http://localhost:8080/appointments/count-by-department'
    );
  }
}
