import { Component, OnInit } from '@angular/core';
import { Article } from '../../../../shared/models/article.interface';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../../services/blog.service';
import { BlogCreateComponent } from '../blog-create/blog-create.component';
import { UsersService } from '../../../services/users.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationModalComponent } from '../../../../shared/components/modals/delete-confirmation-modal/delete-confirmation-modal.component';
import { User } from '../../../../shared/models/user.interface';

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
              private matDialog: MatDialog) {
  }

  ngOnInit(): void {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.isAdmin = user.role === 'admin';
    this.blogService.getAllArticles().subscribe((articles: Article[]) => {
      this.articles = articles;
    });
  }

  deleteArticle(event: any,id?: string): void {
    event.stopPropagation();
    this.matDialog.open(DeleteConfirmationModalComponent, {

    });
    if(!id){
      return;
    }
    this.blogService.deletePost(id).subscribe(() => {
      this.articles = this.articles.filter(article => article._id !== id);
    });
  }
}
