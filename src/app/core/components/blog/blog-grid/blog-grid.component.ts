import { Component, OnInit } from '@angular/core';
import { Article } from '../../../../shared/models/article.interface';
import { Router, RouterLink } from '@angular/router';
import { BlogService } from '../../../services/blog.service';
import { BlogCreateComponent } from '../blog-create/blog-create.component';
import { UsersService } from '../../../services/users.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from '../../../../shared/components/modals/delete-confirmation-modal/confirmation-modal.component';
import { SnackbarService } from '../../../../shared/services/snackbar.service';

@Component({
  selector: 'app-blog-grid',
  imports: [
    RouterLink,
    BlogCreateComponent,
    AsyncPipe,
    NgIf
  ],
  providers: [MatDialog],
  standalone: true,
  templateUrl: './blog-grid.component.html',
  styleUrl: './blog-grid.component.scss'
})
export class BlogGridComponent implements OnInit {
  articles: Article[] = [];
  isAuth = this.userService.isAuthenticatedCurrent;
  isNotReader = this.userService.isNotReaderCurrent$;
  isAdmin!: boolean;

  constructor(private blogService: BlogService,
              private userService: UsersService,
              private matDialog: MatDialog,
              private snackbarService: SnackbarService,
              private router: Router) {
  }

  ngOnInit(): void {
      this.blogService.savePreviewArticle({} as Article);
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.isAdmin = user.role === 'admin';
    this.blogService.getAllArticles().subscribe((articles: Article[]) => {
      this.articles = articles;
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
