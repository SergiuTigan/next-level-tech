import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { BlogGridComponent } from './blog-grid/blog-grid.component';
import { BlogComponent } from './blog.component';

const blogRoutes: Routes = [
  {
    path: '', component: BlogComponent,
    children: [
      {path: '', component: BlogGridComponent},
      { path: ':id', component: BlogDetailsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(blogRoutes)],
  exports: [RouterModule]
})
export class BlogRoutingModule {
}
