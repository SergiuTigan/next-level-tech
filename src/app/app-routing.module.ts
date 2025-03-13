import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./core/components/home/home.module').then(m => m.HomeModule), data: { animation: 'HomePage' }},
  { path: 'blog', loadChildren: () => import('./core/components/blog/blog.module').then(m => m.BlogModule),data: { animation: 'BlogPage' }},
  { path: 'projects', loadChildren: () => import('./core/components/projects/projects.module').then(m => m.ProjectsModule), data: { animation: 'ProjectsPage' }},
  { path: 'about', loadChildren: () => import('./core/components/about/about.module').then(m => m.AboutModule), data: { animation: 'AboutPage' }},
  { path: 'contact', loadChildren: () => import('./core/components/contact/contact.module').then(m => m.ContactModule), data: { animation: 'ContactPage' }},
  { path: 'profile', loadChildren: () => import('./core/components/profile/profile.module').then(m => m.ProfileModule), data: { animation: 'ProfilePage' }},
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
