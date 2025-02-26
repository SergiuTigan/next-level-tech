import { Component, OnInit } from '@angular/core';
import { Article } from '../../../../shared/models/article.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BlogService } from '../../../services/blog.service';

@Component({
  selector: 'app-blog-grid',
  imports: [
    RouterLink
  ],
  providers: [BlogService],
  standalone: true,
  templateUrl: './blog-grid.component.html',
  styleUrl: './blog-grid.component.scss'
})
export class BlogGridComponent implements OnInit {
  articles: Article[] = [];

  constructor(private blogService: BlogService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.blogService.getAllArticles().subscribe((articles) => {
      this.articles = articles;
    });
  }

}
