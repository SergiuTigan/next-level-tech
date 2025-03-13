import { Component, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { Article } from '../../../shared/models/article.interface';

@Component({
  selector: 'app-blog',
  imports: [
    RouterOutlet
  ],
  standalone: true,
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnDestroy {

  constructor(private blogService: BlogService) {
  }

  ngOnDestroy(): void {
    this.blogService.savePreviewArticle({} as Article);
  }
}
