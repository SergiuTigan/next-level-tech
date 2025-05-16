import {Component, inject, OnInit} from '@angular/core';
import {Article} from '../../../../shared/models/article.interface';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {BlogService} from '../../../services/blog.service';
import {BlogCreateComponent} from '../blog-create/blog-create.component';
import {UsersService} from '../../../services/users.service';
import {AsyncPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {
  ConfirmationModalComponent
} from '../../../../shared/components/modals/delete-confirmation-modal/confirmation-modal.component';
import {SnackbarService} from '../../../../shared/services/snackbar.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {SkeletonLoaderComponent} from '../../../../shared/helpers/skeleton-loader';
import {User} from "../../../../shared/models/user.interface";

@Component({
  selector: 'app-blog-grid',
  animations: [
    trigger('cardHover', [
      state('normal', style({
        transform: 'translateY(0) scale(1)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      })),
      state('hovered', style({
        transform: 'translateY(-10px) scale(1.02)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      })),
      transition('normal <=> hovered', animate('200ms ease-in-out'))
    ])
  ],
  imports: [
    RouterLink,
    AsyncPipe,
    DatePipe,
    SkeletonLoaderComponent
  ],
  providers: [MatDialog],
  standalone: true,
  templateUrl: './blog-grid.component.html',
  styleUrl: './blog-grid.component.scss'
})
export class BlogGridComponent implements OnInit {
  readonly blogService = inject(BlogService);
  readonly userService = inject(UsersService);
  readonly matDialog = inject(MatDialog);
  readonly snackbarService = inject(SnackbarService);
  readonly router = inject(Router);
  readonly activatedRoute = inject(ActivatedRoute);

  articles: Article[] = [];
  isAuth = this.userService.isAuthenticatedCurrent;
  isNotReader = this.userService.isNotReaderCurrent$;
  user = JSON.parse(sessionStorage.getItem('user') || '{}');
  cardStates: { [key: string]: 'normal' | 'hovered' } = {};
  loading = true;

  get isAdmin(): boolean {
    return this.user.role === 'admin';
  }

  ngOnInit(): void {
    this.blogService.savePreviewArticle({} as Article);
    const tag: string = this.activatedRoute.snapshot.params['tag'];
    if (!tag) {
      this.blogService.getAllArticles().subscribe((articles: Article[]) => {
        this.articles = articles;
        this.loading = false;
      });
    } else {
      this.blogService.getAllArticlesByTag(tag).subscribe((articles: Article[]) => {
        this.articles = articles;
        this.loading = false;
      });
    }
  }

  isAuthor(user: User): boolean {
    return this.user._id === user._id;
  }

  isWithinFirstDay(createDate: string): boolean {
    const articleDate = new Date(createDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - articleDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 1;
  }

  canEditArticle(article: Article): boolean {
    if (this.isAdmin) return true;
    return this.isAuthor(article.author) && this.isWithinFirstDay(article.createDate);
  }

  toggleHover(articleId: string): void {
    this.cardStates[articleId] = this.cardStates[articleId] === 'hovered' ? 'normal' : 'hovered';
  }

  togglePublishStatus(event: any, article: Article): void {
    event.stopPropagation();

    const dialogRef = this.matDialog.open(ConfirmationModalComponent, {
      width: '400px',
      data: {
        title: article.published ? 'Unpublish Article' : 'Publish Article',
        message: `Are you sure you want to ${article.published ? 'unpublish' : 'publish'} this article?`,
        confirmText: article.published ? 'Unpublish' : 'Publish',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      const formData = new FormData();
      formData.append('published', String(!article.published));
      if (result && article._id) {
        this.blogService.updateArticle(article._id, formData).subscribe(
          (updatedArticle) => {
            const index = this.articles.findIndex(a => a._id === article._id);
            if (index !== -1) {
              this.articles[index] = updatedArticle;
            }
            this.snackbarService.success(`Article ${updatedArticle.published ? 'published' : 'unpublished'} successfully`);
          },
          error => {
            this.snackbarService.error(`Failed to ${article.published ? 'unpublish' : 'publish'} article`);
          }
        );
      }
    });
  }

  deleteArticle(event: any, id?: string): void {
    event.stopPropagation();

    const dialogRef = this.matDialog.open(ConfirmationModalComponent, {
      width: '400px',
      data: {
        title: 'Delete Article',
        message: 'Are you sure you want to delete this article? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result && id) {
        this.blogService.deletePost(id).subscribe(() => {
          this.articles = this.articles.filter(article => article._id !== id);
          this.snackbarService.success('Article deleted successfully');
        }, error => {
          this.snackbarService.error('Failed to delete article');
        });
      }
    });
  }

  editArticle(event: any, id?: string): void {
    event.stopPropagation();

    const dialogRef = this.matDialog.open(ConfirmationModalComponent, {
      width: '400px',
      data: {
        title: 'Edit Article',
        message: 'Do you want to edit this article?',
        confirmText: 'Edit',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result && id) {
        this.router.navigate(['/blog/edit', id]);
      }
    });
  }

  timeRange(date: string): boolean {
    const articleDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - articleDate.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    return diffHours <= 24;
  }
}
