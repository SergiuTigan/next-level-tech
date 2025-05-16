import {Route} from "@angular/router";

export const routes: Route[] = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {
    path: 'home',
    loadComponent: () => import('./core/components/home/home.component').then(m => m.HomeComponent),
    data: {animation: 'HomePage'}
  },
  {
    path: 'blog',
    loadComponent: () => import('./core/components/blog/blog.component').then(m => m.BlogComponent),
    data: {animation: 'BlogPage'},
    children: [
      {
        path: '',
        loadComponent: () => import('./core/components/blog/blog-grid/blog-grid.component').then(m => m.BlogGridComponent)
      },
      {
        path: 'details/:id',
        loadComponent: () => import('./core/components/blog/blog-details/blog-details.component').then(m => m.BlogDetailsComponent)
      },
      {
        path: 'create',
        loadComponent: () => import('./core/components/blog/blog-create/blog-create.component').then(m => m.BlogCreateComponent)
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./core/components/blog/blog-create/blog-create.component').then(m => m.BlogCreateComponent)
      },
      {
        path: 'tags/:tag',
        loadComponent: () => import('./core/components/blog/blog-grid/blog-grid.component').then(m => m.BlogGridComponent)
      }
    ],
  },
  {
    path: 'projects',
    loadComponent: () => import('./core/components/projects/projects.component').then(m => m.ProjectsComponent),
    data: {animation: 'ProjectsPage'},
    children: [
      {
        path: '',
        loadComponent: () => import('./core/components/projects/projects-grid/projects-grid.component').then(m => m.ProjectsGridComponent)
      }, {
        path: 'details/:id',
        loadComponent: () => import('./core/components/projects/projects-details/projects-details.component').then(m => m.ProjectsDetailsComponent)
      },
      {
        path: 'create',
        loadComponent: () => import('./core/components/projects/projects-create/projects-create.component').then(m => m.ProjectsCreateComponent)
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./core/components/projects/projects-create/projects-create.component').then(m => m.ProjectsCreateComponent)
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
  {
    path: 'profile',
    loadComponent: () => import('./core/components/profile/profile.component').then(m => m.ProfileComponent),
    data: {animation: 'ProfilePage'}
  },
  {path: '**', redirectTo: 'home'}
];
