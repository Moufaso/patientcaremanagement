import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QueryService } from '../services/query.service';
import { BehaviorSubject, forkJoin, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-department-lab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './department-lab.component.html',
  styleUrls: ['./department-lab.component.css'],
})
export class DepartmentLabComponent {
  /** bound to the input box */
  deptName = '';

  /** template consumes this with `async` */
  readonly labs$ = new BehaviorSubject<any[]>([]);

  loading = false;
  error = '';
  searchPerformed = false;

  constructor(private queryService: QueryService) {}

  fetchLabs(): void {
    const dept = this.deptName.trim();
    if (!dept) {
      this.error = 'Enter a department name.';
      this.labs$.next([]);
      return;
    }

    this.searchPerformed = true; // <—— mark that a search happened
    this.loading = true;
    this.error = '';
    this.labs$.next([]);

    this.queryService
      .getLabsByDepartment(dept)
      .pipe(
        switchMap((rawLabs: any[]) => {
          if (!rawLabs || rawLabs.length === 0) {
            return of([]); // nothing to enrich
          }

          const enrich$ = rawLabs.map((lab) =>
            forkJoin({
              patient: this.queryService.getPatientName(lab.patientId).pipe(
                map((p) => p?.name ?? 'Unknown'),
                catchError(() => of('Unknown'))
              ),
              nurse: this.queryService.getNurseName(lab.nurseId).pipe(
                map((n) => n?.name ?? 'Unknown'),
                catchError(() => of('Unknown'))
              ),
            }).pipe(
              map(({ patient, nurse }) => ({
                ...lab,
                patientName: patient,
                nurseName: nurse,
              }))
            )
          );

          return forkJoin(enrich$);
        })
      )
      .subscribe({
        next: (enriched) => {
          this.labs$.next(enriched); // triggers template refresh
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.error = 'Could not load labs.';
          this.loading = false;
        },
      });
  }
}
