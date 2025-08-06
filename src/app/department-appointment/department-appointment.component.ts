import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, forkJoin, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { QueryService } from '../services/query.service';

type AppointmentRow = {
  doctorName: string;
  patientName: string;
  reason: string;
  date: string;
  time: string;
  _debug?: { patientId: number | undefined; doctorId: number | undefined };
};

@Component({
  selector: 'app-department-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './department-appointment.component.html',
  styleUrls: ['./department-appointment.component.css'],
})
export class DepartmentAppointmentComponent {
  deptName = '';
  showDebug = false;

  readonly data$ = new BehaviorSubject<AppointmentRow[]>([]);
  loading = false;
  error = '';
  searchPerformed = false;

  constructor(private query: QueryService) {}

  fetch(): void {
    const dept = this.deptName.trim();
    if (!dept) {
      this.error = 'Enter a department name.';
      this.data$.next([]);
      this.searchPerformed = false;
      return;
    }

    this.searchPerformed = true;
    this.loading = true;
    this.error = '';
    this.data$.next([]);

    this.query
      .getAppointmentsByDepartment(dept)
      .pipe(
        switchMap((appts: any[]) => {
          if (!appts || appts.length === 0) {
            return of<AppointmentRow[]>([]);
          }

          // Normalize IDs to numbers to satisfy service signatures
          const toNum = (v: any): number | undefined => {
            if (v === null || v === undefined) return undefined;
            const n = Number(v);
            return Number.isFinite(n) ? n : undefined;
          };

          const patientIds: number[] = Array.from(
            new Set(
              appts
                .map((a) => toNum(a.patient_id ?? a.patientId))
                .filter((id): id is number => id !== undefined)
            )
          );

          const doctorIds: number[] = Array.from(
            new Set(
              appts
                .map((a) => toNum(a.doctor_id ?? a.doctorId))
                .filter((id): id is number => id !== undefined)
            )
          );

          // Parallel lookups
          const patientCalls =
            patientIds.length > 0
              ? forkJoin(
                  patientIds.map((id) =>
                    this.query.getPatientName(id).pipe(
                      map((res) => res?.name ?? 'Unknown'),
                      catchError(() => of('Unknown'))
                    )
                  )
                )
              : of<string[]>([]);

          const doctorCalls =
            doctorIds.length > 0
              ? forkJoin(
                  doctorIds.map((id) =>
                    this.query.getDoctorName(id).pipe(
                      map((res) => res?.name ?? 'Unknown'),
                      catchError(() => of('Unknown'))
                    )
                  )
                )
              : of<string[]>([]);

          return forkJoin([patientCalls, doctorCalls]).pipe(
            map(([patientNames, doctorNames]) => {
              const patientMap = new Map<number, string>();
              patientNames.forEach((name, i) =>
                patientMap.set(patientIds[i], name)
              );

              const doctorMap = new Map<number, string>();
              doctorNames.forEach((name, i) =>
                doctorMap.set(doctorIds[i], name)
              );

              const rows: AppointmentRow[] = appts.map((a) => {
                const pid = toNum(a.patient_id ?? a.patientId);
                const did = toNum(a.doctor_id ?? a.doctorId);

                return {
                  doctorName:
                    did !== undefined
                      ? doctorMap.get(did) ?? 'Unknown'
                      : 'Unknown',
                  patientName:
                    pid !== undefined
                      ? patientMap.get(pid) ?? 'Unknown'
                      : 'Unknown',
                  reason: a.reason ?? a.visitReason ?? '',
                  date: a.date ?? a.appointmentDate ?? '',
                  time: a.time ?? '',
                  _debug: { patientId: pid, doctorId: did },
                };
              });

              return rows;
            })
          );
        }),
        catchError((err) => {
          console.error(err);
          this.error = 'Could not load appointments.';
          this.loading = false;
          return of<AppointmentRow[]>([]);
        })
      )
      .subscribe((rows: AppointmentRow[]) => {
        this.data$.next(rows);
        this.loading = false;
      });
  }
}
