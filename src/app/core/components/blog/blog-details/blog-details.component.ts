import {CommonModule} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BlogService} from '../../../services/blog.service';
import {Article} from '../../../../shared/models/article.interface';
import {SafeHtmlPipe} from '../../../../shared/pipes/safe-html.pipe';
import {User} from "../../../../shared/models/user.interface";
import {SnackbarService} from "../../../../shared/services/snackbar.service";

@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss'] // Fixed stylesheet reference
})
export class BlogDetailsComponent implements OnInit {
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly blogService = inject(BlogService);
  readonly snackbarService = inject(SnackbarService);

  user = JSON.parse(sessionStorage.getItem('user') || '{}') as User;
  article!: Article;
  isPreviewMode: boolean = false;
  isSignedIn!: boolean;


  ngOnInit(): void {
    this.isPreviewMode = this.router.url.includes('preview');
    this.isSignedIn = sessionStorage.getItem('token') !== null;
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
    if (JSON.stringify(this.article) === '{}') {
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
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (this.article._id && user._id) {
      this.blogService.likePost(this.article._id, {userId: user._id}).subscribe((article: Article) => {
        this.article = article;
      });
    }
  };

  submitComment(comment: string): void {
    if (!comment) {
      this.snackbarService.error('Please enter a comment');
      return;
    }
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (this.article._id && user._id) {
      const commentData = {
        userName: `${user.firstName} ${user.lastName}`,
        userId: user._id,
        comment: comment,
        timestamp: new Date().toISOString()
      };
      this.blogService.commentPost(this.article._id, commentData).subscribe((article: Article) => {
        this.article = article;
        this.snackbarService.success('Comment submitted successfully');
      });
    }
  }

  sharePost(): void {
    // Implement share functionality
  }

  goBack(): void {
    if (this.isPreviewMode) {
      this.router.navigate(['/blog/create']);
    } else {
      this.router.navigate(['/blog']);
    }
  }
}
