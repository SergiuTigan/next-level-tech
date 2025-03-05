import { Component, OnInit } from '@angular/core';
import { Article } from '../../../../shared/models/article.interface';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../../services/blog.service';
import { BlogCreateComponent } from '../blog-create/blog-create.component';
import { UsersService } from '../../../services/users.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-blog-grid',
  imports: [
    RouterLink,
    BlogCreateComponent,
    AsyncPipe
  ],
  providers: [],
  standalone: true,
  templateUrl: './blog-grid.component.html',
  styleUrl: './blog-grid.component.scss'
})
export class BlogGridComponent implements OnInit {
  articles: Article[] = [];
  showCreateModal = this.blogService.showCreateModalCurrent$;
  isAuth = this.userService.isAuthenticatedCurrent;
  isNotReader = this.userService.isNotReaderCurrent$;

  constructor(private blogService: BlogService,
              private userService: UsersService) {
  }

  ngOnInit(): void {
    this.blogService.getAllArticles().subscribe((articles: Article[]) => {
      this.articles = articles;
    });
  }
}
