import {CommonModule} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {BlogService} from '../../../services/blog.service';
import {Article} from '../../../../shared/models/article.interface';
import {SafeHtmlPipe} from '../../../../shared/pipes/safe-html.pipe';
import {User} from "../../../../shared/models/user.interface";
import {SnackbarService} from "../../../../shared/services/snackbar.service";
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {
  ConfirmationModalComponent
} from '../../../../shared/components/modals/delete-confirmation-modal/confirmation-modal.component';
import {FormsModule} from '@angular/forms';
import {ScrollProgressComponent} from '../../../../shared/components/scroll-progress/scroll-progress.component';

@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe, MatDialogModule, FormsModule, RouterLink, ScrollProgressComponent],
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss']
})
export class BlogDetailsComponent implements OnInit {
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly blogService = inject(BlogService);
  readonly snackbarService = inject(SnackbarService);
  readonly matDialog = inject(MatDialog);

  user = JSON.parse(sessionStorage.getItem('user') || '{}') as User;
  article!: Article;
  isPreviewMode: boolean = false;
  isSignedIn!: boolean;
  editingComment: { index: number; text: string } | null = null;

  ngOnInit(): void {
    this.isPreviewMode = this.router.url.includes('preview');
    this.isSignedIn = sessionStorage.getItem('token') !== null;
    if (!this.isPreviewMode) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.blogService.getArticleById(id).subscribe((article: Article) => {
          this.article = article;
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

  likeArticle(): void {
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

  canEditComment(comment: any): boolean {
    return this.user._id === comment.userId;
  }

  canDeleteComment(comment: any): boolean {
    return this.user._id === comment.userId || this.user.role === 'admin';
  }

  editComment(index: number, currentCommentText: string): void {
    this.editingComment = {index, text: currentCommentText};
  }

  saveCommentEdit(commentId: string | null): void {
    if (!this.editingComment || !this.article?._id || !commentId) {
      console.error('Missing data for saving comment edit:', {
        editingComment: this.editingComment,
        articleId: this.article?._id,
        commentId,
      });
      return;
    }

    const originalComment = this.article.comments[this.editingComment.index];

    if (!originalComment) {
      console.error('Original comment not found at index:', this.editingComment.index);
      this.editingComment = null;
      return;
    }

    const updatePayload = {
      comment: this.editingComment.text,
      userName: originalComment.userName,
      userId: originalComment.userId,
      timestamp: originalComment.timestamp,
    };

    this.blogService.updateComment(this.article._id, commentId, updatePayload).subscribe(
      (updatedArticle: Article) => {
        this.article = updatedArticle;
        this.editingComment = null; // Clear the editing state.
        this.snackbarService.success('Comment updated successfully');
      },
      (error) => {
        console.error('Failed to update comment:', error);
        this.snackbarService.error('Failed to update comment. Please try again.');
      }
    );
  }

  cancelEdit(): void {
    this.editingComment = null;
  }

  deleteComment(commentId: string | null): void {
    if (!commentId || !this.article._id) {
      return;
    }
    const dialogRef = this.matDialog.open(ConfirmationModalComponent, {
      width: '400px',
      data: {
        title: 'Delete Comment',
        message: 'Are you sure you want to delete this comment? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result && this.article._id) {
        this.editingComment = null;
        this.blogService.removeComment(this.article._id, commentId).subscribe(
          (updatedArticle: Article) => {
            this.article = updatedArticle;
            this.snackbarService.success('Comment deleted successfully');
          },
          error => {
            this.snackbarService.error('Failed to delete comment');
          }
        );
      }
    });
  }
}
