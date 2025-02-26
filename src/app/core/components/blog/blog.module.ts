import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogRoutingModule } from './blog-routing.module';
import { BaseService } from '../../services/base.service';
import { HttpClientModule } from '@angular/common/http';
import { BlogService } from '../../services/blog.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BlogRoutingModule,
    HttpClientModule
  ],
  providers: [BaseService, BlogService]
})
export class BlogModule {
}
