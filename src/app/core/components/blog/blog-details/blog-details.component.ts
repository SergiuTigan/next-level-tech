import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../../services/blog.service';
import { Article } from '../../../../shared/models/article.interface';

@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.css']
})
export class BlogDetailsComponent implements OnInit {
  blogPost!: Article;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private blogService: BlogService) {
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.blogService.getArticleById(id).subscribe((article: Article) => {
        this.blogPost = article;
      });
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
    this.blogPost.likes++;
    // In a real application, you would call a service to update the like count
  }

  sharePost(): void {
    // Implement share functionality
    navigator.clipboard.writeText(window.location.href);
    // You might want to add a toast notification here
    alert('Link copied to clipboard!');
  }

  goBack(): void {
    this.router.navigate(['/blog']);
  }
}
