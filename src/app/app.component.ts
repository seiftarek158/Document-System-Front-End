import { Component, OnInit } from '@angular/core';
// import { Route, RouterOutlet } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { BreadcrumbItem } from './services/BreadcrumbItem';
import { filter, map } from 'rxjs/operators';
import { MenuItem } from 'primeng/api';
import { NavigationEnd, Router } from '@angular/router';
import { BreadcrumbService } from './services/breadcrumb.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  // standalone: true,
  // imports: [RouterOutlet]
})
export class AppComponent {
  title = 'DMSFrontend';
  // breadcrumbs$: Observable<MenuItem[]> | undefined;
  // home: MenuItem = { label: 'Home', url: '/' };
  
  // constructor(private router: Router, private breadcrumbService: BreadcrumbService) {
  //   this.breadcrumbs$ = this.breadcrumbService.breadcrumbs$;
  // }

  // ngOnInit() {
  //   this.router.events.pipe(
  //     filter(event => event instanceof NavigationEnd)
  //   ).subscribe(() => {
  //     const breadcrumbs = this.createBreadcrumbs(this.router.url);
  //     this.breadcrumbService.setBreadcrumbs(breadcrumbs);
  //   });
  // }

  // createBreadcrumbs(url: string): MenuItem[] {
  //   const segments = url.split('/').filter(segment => segment);
  //   const breadcrumbs: MenuItem[] = segments.map((segment, index) => {
  //     const url = '/' + segments.slice(0, index + 1).join('/');
  //     return { label: segment, url, command: () => this.navigateWithState(url, { data: segment }) };
  //   });
  //   return breadcrumbs;
  // }

  // navigateWithState(url: string, state: any) {
  //   this.router.navigateByUrl(url, { state }).then(() => {
  //     const breadcrumb: MenuItem = { label: state.data, url, command: () => this.navigateWithState(url, state) };
  //     this.breadcrumbService.addBreadcrumb(breadcrumb);
  //   });
  // }



  }
