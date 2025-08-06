import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, forkJoin, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { QueryService } from '../services/query.service';

type LabResultRow = {
  nurseName: string;
  date: string;
  time: string;
  test: string;
  result: string;
  _debug?: { labId: number | undefined; nurseId: number | undefined };
};

@Component({
  selector: 'app-patient-lab-result',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-lab-result.component.html',
  styleUrls: ['./patient-lab-result.component.css'],
})
export class PatientLabResultComponent {
  patientName = '';
  showDebug = false;

  readonly data$ = new BehaviorSubject<LabResultRow[]>([]);
  loading = false;
  error = '';
  searchPerformed = false;

  constructor(private query: QueryService) {}

  private toNum(v: any): number | undefined {
    if (v === null || v === undefined) return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  }

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
      .getLabResultsByPatient(name) // GET /result/{name}
      .pipe(
        switchMap((results: any[]) => {
          if (!results || results.length === 0) {
            return of<LabResultRow[]>([]);
          }

          // 1) unique lab ids from results
          const labIds: number[] = Array.from(
            new Set(
              results
                .map((r) => this.toNum(r.lab_id ?? r.labId))
                .filter((id): id is number => id !== undefined)
            )
          );

          if (labIds.length === 0) {
            // If no lab ids, at least show the plain result strings
            const minimal = results.map<LabResultRow>((r) => ({
              nurseName: 'Unknown',
              date: '',
              time: '',
              test: '',
              result: r.result ?? '',
              _debug: { labId: undefined, nurseId: undefined },
            }));
            return of(minimal);
          }

          // 2) fetch all labs, build {id -> lab}
          const labCalls = labIds.map((id) =>
            this.query.getLabById(id).pipe(catchError(() => of(null)))
          );

          return forkJoin(labCalls).pipe(
            switchMap((labs: Array<any | null>) => {
              const labMap = new Map<number, any>();
              labs.forEach((lab, idx) => {
                const id = labIds[idx];
                if (lab) labMap.set(id, lab);
              });

              // 3) collect nurse ids from labs
              const nurseIds: number[] = Array.from(
                new Set(
                  Array.from(labMap.values())
                    .map((l) => this.toNum(l?.nurse_id ?? l?.nurseId))
                    .filter((id): id is number => id !== undefined)
                )
              );

              // 4) fetch nurse names
              const nurseCalls =
                nurseIds.length > 0
                  ? forkJoin(
                      nurseIds.map((id) =>
                        this.query.getNurseName(id).pipe(
                          map((res) => res?.name ?? 'Unknown'),
                          catchError(() => of('Unknown'))
                        )
                      )
                    )
                  : of<string[]>([]);

              return forkJoin([of(labMap), nurseCalls]).pipe(
                map(([labMap2, nurseNames]) => {
                  const nurseMap = new Map<number, string>();
                  nurseNames.forEach((name, i) =>
                    nurseMap.set(nurseIds[i], name)
                  );

                  // 5) final rows per result
                  const rows: LabResultRow[] = results.map((r) => {
                    const labId = this.toNum(r.lab_id ?? r.labId);
                    const lab = labId !== undefined ? labMap2.get(labId) : null;

                    const nurseId = lab
                      ? this.toNum(lab.nurse_id ?? lab.nurseId)
                      : undefined;
                    const nurseName =
                      nurseId !== undefined
                        ? nurseMap.get(nurseId) ?? 'Unknown'
                        : 'Unknown';

                    return {
                      nurseName,
                      date: lab?.date ?? '',
                      time: lab?.time ?? '',
                      test: lab?.test ?? '',
                      result: r.result ?? '',
                      _debug: { labId, nurseId },
                    };
                  });

                  return rows;
                })
              );
            })
          );
        }),
        catchError((err) => {
          console.error(err);
          this.error = 'Could not load lab results.';
          this.loading = false;
          return of<LabResultRow[]>([]);
        })
      )
      .subscribe((rows: LabResultRow[]) => {
        this.data$.next(rows);
        this.loading = false;
      });
  }
}
