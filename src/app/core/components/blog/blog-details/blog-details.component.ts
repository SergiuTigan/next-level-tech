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
    this.blogPost = {
      id: 5,
      title: 'Introduction to Docker for Developers',
      content: 'Docker has revolutionized how we build, ship, and run applications. This introduction explains key Docker concepts and how to integrate containerization into your development workflow.',
      description: 'Get started with Docker containerization and learn how it can streamline your development and deployment processes.',
      category: 'DevOps',
      createDate: new Date().toISOString(),
      coverImage: 'assets/img/sergiu.jpg',
      images: [
        'assets/img/andreea.png',
        'assets/img/dobby.png'
      ],
      tags: ['Docker', 'DevOps', 'Containerization', 'CI/CD'],
      likes: 93,
      comments: [
        'This finally helped me understand the difference between images and containers.',
        'Great primer on Docker! Any plans for a Kubernetes follow-up?'
      ],
      thumbnail: 'assets/img/andreea.jpg',
      author: {
        firstName: 'Michael',
        email: 'michael.chen@example.com',
        bio: 'Backend architect specializing in Node.js microservices.',
        avatar: 'assets/img/sergiu.jpg',
        _id: '4',
        lastName: 'Chen',
        role: 'admin'
      }
    };

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
