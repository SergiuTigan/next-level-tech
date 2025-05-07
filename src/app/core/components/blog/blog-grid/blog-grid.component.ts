import {Component, inject, OnInit} from '@angular/core';
import {Article} from '../../../../shared/models/article.interface';
import {Router, RouterLink} from '@angular/router';
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
    BlogCreateComponent,
    AsyncPipe,
    NgIf,
    DatePipe,
    NgForOf,
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

    this.blogService.getAllArticles().subscribe((articles: Article[]) => {
      this.articles = articles;
      this.loading = false;
    });
  }

  isAuthor(user: User): boolean {
    return this.user._id === user._id;
  }

  toggleHover(articleId: string): void {
    this.cardStates[articleId] = this.cardStates[articleId] === 'hovered' ? 'normal' : 'hovered';
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
        // User confirmed, proceed with deletion
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
        // Navigate to edit page or open edit form
        this.router.navigate(['/blog/edit', id]);
      }
    });
  }
}
