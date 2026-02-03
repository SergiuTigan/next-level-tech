import {Route} from "@angular/router";

export const routes: Route[] = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {
    path: 'home',
    loadComponent: () => import('./core/components/home/home.component').then(m => m.HomeComponent),
    data: {animation: 'HomePage'}
  },
  {
    path: 'projects',
    loadComponent: () => import('./core/components/projects/projects.component').then(m => m.ProjectsComponent),
    data: {animation: 'ProjectsPage'},
    children: [
      {
        path: '',
        loadComponent: () => import('./core/components/projects/projects-grid/projects-grid.component').then(m => m.ProjectsGridComponent)
      },
      {
        path: 'details/:id',
        loadComponent: () => import('./core/components/projects/projects-details/projects-details.component').then(m => m.ProjectsDetailsComponent)
      }
    ]
  },
  {
    path: 'about',
    loadComponent: () => import('./core/components/about/about.component').then(m => m.AboutComponent),
    data: {animation: 'AboutPage'}
  },
  {
    path: 'contact',
    loadComponent: () => import('./core/components/contact/contact.component').then(m => m.ContactComponent),
    data: {animation: 'ContactPage'}
  },
  {path: '**', redirectTo: 'home'}
];
