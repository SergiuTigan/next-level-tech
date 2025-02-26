import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./core/components/home/home.module').then(m => m.HomeModule) },
  { path: 'blog', loadChildren: () => import('./core/components/blog/blog.module').then(m => m.BlogModule) },
  { path: 'team', loadChildren: () => import('./core/components/team/team.module').then(m => m.TeamModule) },
  { path: 'projects', loadChildren: () => import('./core/components/projects/projects.module').then(m => m.ProjectsModule) },
  { path: 'about', loadChildren: () => import('./core/components/about/about.module').then(m => m.AboutModule) },
  { path: 'contact', loadChildren: () => import('./core/components/contact/contact.module').then(m => m.ContactModule) },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
