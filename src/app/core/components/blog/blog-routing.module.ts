import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogComponent } from './blog.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';

const blogRoutes: Routes = [
  { path: '', component: BlogComponent,
    children: [
      {path: ':id', component: BlogDetailsComponent}
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(blogRoutes)],
  exports: [RouterModule]
})
export class BlogRoutingModule {
}
