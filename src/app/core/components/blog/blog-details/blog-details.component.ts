import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../../services/blog.service';
import { Article } from '../../../../shared/models/article.interface';
import { SafeHtmlPipe } from '../../../../shared/pipes/safe-html.pipe';

@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss'] // Fixed stylesheet reference
})
export class BlogDetailsComponent implements OnInit {
  article!: Article;
  isPreviewMode: boolean = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private blogService: BlogService) {
  }

  ngOnInit(): void {
    this.isPreviewMode = this.router.url.includes('preview');
    if (!this.isPreviewMode) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.blogService.getArticleById(id).subscribe((article: Article) => {
          this.article = article;

          if (typeof this.article.tags[0] === 'string') {
            this.article.tags = this.article.tags[0].split(',');
            this.article.tags = this.article.tags.map(tag => tag.trim().charAt(0).toUpperCase() + tag.trim().slice(1));
          }
        });
      }
    } else {
      this.blogService.currentPreviewArticle$.subscribe((article: Article) => {
        this.article = article;
      });
    }
    if(JSON.stringify(this.article) === '{}'){
      this.router.navigate(['/blog'], {relativeTo: this.route});
    }
  }

  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }

  likePost(): void {
    this.article.likes++;
  }

  sharePost(): void {
    // Implement share functionality
  }

  goBack(): void {
    if (this.isPreviewMode) {
      this.router.navigate(['/blog/create']);
    } else{
      this.router.navigate(['/blog']);
    }
  }
}
