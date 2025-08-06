import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, forkJoin, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { QueryService } from '../services/query.service';

type PrescriptionRow = {
  prescriptionName: string;
  doctorName: string;
  prescriptionDate: string;
  reasonForVisit: string;
  /** optional debug info for the template */
  _debug?: {
    apptId: number | string | undefined;
    doctorId: number | string | undefined;
  };
};

@Component({
  selector: 'app-patient-prescription',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-prescription.component.html',
  styleUrls: ['./patient-prescription.component.css'],
})
export class PatientPrescriptionComponent {
  /** bound to the input */
  patientName = '';

  /** <-- THIS is the flag the checkbox binds to */
  showDebug = false;

  /** data stream the template reads with | async */
  readonly data$ = new BehaviorSubject<PrescriptionRow[]>([]);
  loading = false;
  error = '';
  searchPerformed = false;

  constructor(private query: QueryService) {}

  fetch(): void {
    const name = this.patientName.trim();
    if (!name) {
      this.error = 'Enter a patient name.';
      this.data$.next([]);
      this.searchPerformed = false;
      return;
    }

    this.searchPerformed = true;
    this.loading = true;
    this.error = '';
    this.data$.next([]);

    this.query
      .getPrescriptionsByPatient(name)
      .pipe(
        switchMap((rows: any[]) => {
          if (!rows || rows.length === 0) {
            return of<PrescriptionRow[]>([]);
          }

          // 1) unique appointment ids from prescriptions
          const apptIds: Array<number | string> = Array.from(
            new Set(
              rows
                .map((r) => r.appointment_id ?? r.appointmentId)
                .filter((id) => id != null)
            )
          );

          if (apptIds.length === 0) {
            // No appointments to enrich; return minimal rows
            const minimal = rows.map((r) => ({
              prescriptionName:
                r.medication ?? r.prescriptionName ?? r.name ?? 'Unknown',
              doctorName: 'Unknown',
              prescriptionDate: '',
              reasonForVisit: '',
              _debug: { apptId: undefined, doctorId: undefined },
            }));
            return of(minimal);
          }

          // 2) fetch all appointments, build a map {id -> appointment}
          const apptCalls = apptIds.map((id) =>
            this.query.getAppointmentById(id).pipe(catchError(() => of(null)))
          );

          return forkJoin(apptCalls).pipe(
            switchMap((appts: Array<any | null>) => {
              const apptMap = new Map<number | string, any>();
              appts.forEach((a, idx) => {
                const id = apptIds[idx];
                if (a) apptMap.set(id, a);
              });

              // 3) unique doctor ids from those appointments
              const doctorIds: Array<number | string> = Array.from(
                new Set(
                  Array.from(apptMap.values())
                    .map((a: any) => a?.doctor_id ?? a?.doctorId)
                    .filter((id) => id != null)
                )
              );

              if (doctorIds.length === 0) {
                // No doctor lookups; still return date/reason from appt
                const result: PrescriptionRow[] = rows.map((r) => {
                  const apptId = r.appointment_id ?? r.appointmentId;
                  const appt = apptId != null ? apptMap.get(apptId) : null;

                  return {
                    prescriptionName:
                      r.medication ?? r.prescriptionName ?? r.name ?? 'Unknown',
                    doctorName: 'Unknown',
                    prescriptionDate: appt?.date ?? appt?.appointmentDate ?? '',
                    reasonForVisit: appt?.reason ?? appt?.visitReason ?? '',
                    _debug: { apptId, doctorId: undefined },
                  };
                });
                return of(result);
              }

              // 4) fetch all doctor names, build a map {id -> name}
              const doctorCalls = doctorIds.map((id) =>
                this.query.getDoctorName(id).pipe(
                  map((res) => res?.name ?? 'Unknown'),
                  catchError(() => of('Unknown'))
                )
              );

              return forkJoin(doctorCalls).pipe(
                map((names: string[]) => {
                  const doctorMap = new Map<number | string, string>();
                  names.forEach((n, idx) => {
                    const id = doctorIds[idx];
                    doctorMap.set(id, n);
                  });

                  // 5) final projection per prescription
                  const result: PrescriptionRow[] = rows.map((r) => {
                    const prescriptionName =
                      r.medication ?? r.prescriptionName ?? r.name ?? 'Unknown';

                    const apptId = r.appointment_id ?? r.appointmentId;
                    const appt = apptId != null ? apptMap.get(apptId) : null;

                    const date = appt?.date ?? appt?.appointmentDate ?? '';
                    const reason = appt?.reason ?? appt?.visitReason ?? '';

                    const docId = appt?.doctor_id ?? appt?.doctorId;
                    const doctorName =
                      docId != null
                        ? doctorMap.get(docId) ?? 'Unknown'
                        : 'Unknown';

                    return {
                      prescriptionName,
                      doctorName,
                      prescriptionDate: date,
                      reasonForVisit: reason,
                      _debug: { apptId, doctorId: docId },
                    };
                  });

                  return result;
                })
              );
            })
          );
        }),
        catchError((err) => {
          console.error(err);
          this.error = 'Could not load prescriptions.';
          this.loading = false;
          return of<PrescriptionRow[]>([]);
        })
      )
      .subscribe((rows) => {
        this.data$.next(rows);
        this.loading = false;
      });
  }
}
