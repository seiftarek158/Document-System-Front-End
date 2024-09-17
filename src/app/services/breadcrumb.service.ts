import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MenuItem } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private breadcrumbsSubject: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>([]);
  breadcrumbs$: Observable<MenuItem[]> = this.breadcrumbsSubject.asObservable();

  setBreadcrumbs(breadcrumbs: MenuItem[]) {
    this.breadcrumbsSubject.next(breadcrumbs);
  }

  addBreadcrumb(breadcrumb: MenuItem) {
    const currentBreadcrumbs = this.breadcrumbsSubject.value;
    this.breadcrumbsSubject.next([...currentBreadcrumbs, breadcrumb]);
  }
}