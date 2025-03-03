import { Component, OnInit } from '@angular/core';
import { Article } from '../../../../shared/models/article.interface';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../../services/blog.service';
import { BlogCreateComponent } from '../blog-create/blog-create.component';
import { UsersService } from '../../../services/users.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-blog-grid',
  imports: [
    RouterLink,
    BlogCreateComponent,
    AsyncPipe
  ],
  providers: [],
  standalone: true,
  templateUrl: './blog-grid.component.html',
  styleUrl: './blog-grid.component.scss'
})
export class BlogGridComponent implements OnInit {
  articles: Article[] = [];
  showCreateModal = this.blogService.showCreateModalCurrent$;
  isAuth = this.userService.isAuthenticatedCurrent;
  isNotReader = this.userService.isNotReaderCurrent$;

  constructor(private blogService: BlogService,
              private userService: UsersService) {
  }

  ngOnInit(): void {
    this.blogService.getAllArticles().subscribe((articles: Article[]) => {
      this.articles = articles;
      //create some mock articles
      // Mock articles data
      //  this.articles = [
      //   {
      //     id: 1,
      //     title: "Getting Started with Angular 17",
      //     content: "Angular 17 brings significant improvements to the framework's performance, developer experience, and build system. This comprehensive guide explores key features and how to get started with the latest version.",
      //     description: "Learn how to get started with Angular 17's new features including standalone components, improved CLI, and performance enhancements.",
      //     category: "Web Development",
      //     createDate: "2025-02-15",
      //     coverImage: "assets/blog/angular17-cover.jpg",
      //     images: [
      //       "assets/blog/angular17-features.jpg",
      //       "assets/blog/angular17-performance.jpg"
      //     ],
      //     tags: ["Angular", "Web Development", "JavaScript", "Frontend"],
      //     likes: 127,
      //     comments: [
      //       "Great article! I've been waiting for a guide on Angular 17.",
      //       "The standalone components feature is a game-changer."
      //     ],
      //     thumbnail: "assets/blog/angular17-thumbnail.jpg",
      //     author: {
      //       firstName: 'Michael',
      //       email: 'michael.chen@example.com',
      //       bio: 'Backend architect specializing in Node.js microservices.',
      //       avatar: 'assets/authors/michael-chen.jpg',
      //       _id: '1',
      //       lastName: 'Chen',
      //       role: 'admin'
      //     }
      //   },
      //   {
      //     id: 2,
      //     title: "Building a Scalable Backend with Node.js",
      //     content: "Creating a backend that can scale with your application's growth is crucial for long-term success. This guide covers best practices for building scalable backends using Node.js and TypeScript.",
      //     description: "Discover best practices for creating robust and scalable backend systems using Node.js and TypeScript.",
      //     category: "Backend Development",
      //     createDate: "2025-02-27",
      //     coverImage: "assets/blog/nodejs-typescript-cover.jpg",
      //     images: [
      //       "assets/blog/nodejs-architecture.jpg",
      //       "assets/blog/typescript-backend.jpg"
      //     ],
      //     tags: ["Node.js", "TypeScript", "Backend", "API Development"],
      //     likes: 84,
      //     comments: [
      //       "This helped me reorganize my messy Express project. Thanks!",
      //       "Do you have any recommendations for handling database migrations?"
      //     ],
      //     thumbnail: "assets/blog/nodejs-typescript-thumbnail.jpg",
      //     author: {
      //       firstName: 'Michael',
      //       email: 'michael.chen@example.com',
      //       bio: 'Backend architect specializing in Node.js microservices.',
      //       avatar: 'assets/authors/michael-chen.jpg',
      //       _id: '1',
      //       lastName: 'Chen',
      //       role: 'admin'
      //     }
      //   },
      //   {
      //     id: 3,
      //     title: "Machine Learning for Web Developers",
      //     content: "Machine learning is no longer just for data scientists. As a web developer, incorporating ML capabilities into your applications can provide powerful features and enhanced user experiences.",
      //     description: "Explore how web developers can leverage machine learning libraries in JavaScript to add intelligent features to their applications.",
      //     category: "Artificial Intelligence",
      //     createDate: "2025-02-10",
      //     coverImage: "assets/blog/ml-webdev-cover.jpg",
      //     images: [
      //       "assets/blog/tensorflow-js.jpg",
      //       "assets/blog/ml-image-recognition.jpg"
      //     ],
      //     tags: ["Machine Learning", "JavaScript", "TensorFlow.js", "AI"],
      //     likes: 156,
      //     comments: [
      //       "I implemented the image recognition example and it worked great!",
      //       "How does the performance compare between browser and server ML?"
      //     ],
      //     thumbnail: "assets/blog/ml-webdev-thumbnail.jpg",
      //     author: {
      //       firstName: 'Michael',
      //       email: 'michael.chen@example.com',
      //       bio: 'Backend architect specializing in Node.js microservices.',
      //       avatar: 'assets/authors/michael-chen.jpg',
      //       _id: '2',
      //       lastName: 'Chen',
      //       role: 'admin'
      //     }
      //   },
      //   {
      //     id: 4,
      //     title: "Optimizing React Applications",
      //     content: "As React applications grow in complexity, performance optimization becomes increasingly important. This guide covers practical techniques to improve the performance of your React applications.",
      //     description: "Learn practical techniques to optimize React applications for better performance, including preventing unnecessary re-renders.",
      //     category: "Frontend Development",
      //     createDate: "2025-02-22",
      //     coverImage: "assets/blog/react-performance-cover.jpg",
      //     images: [
      //       "assets/blog/react-optimization.jpg",
      //       "assets/blog/code-splitting.jpg"
      //     ],
      //     tags: ["React", "Performance", "JavaScript", "Frontend"],
      //     likes: 118,
      //     comments: [
      //       "The useMemo and useCallback explanations finally helped me understand when to use them!",
      //       "Would love to see a follow-up on server-side rendering performance."
      //     ],
      //     thumbnail: "assets/blog/react-performance-thumbnail.jpg",
      //     author: {
      //       firstName: 'Michael',
      //       email: 'michael.chen@example.com',
      //       bio: 'Backend architect specializing in Node.js microservices.',
      //       avatar: 'assets/authors/michael-chen.jpg',
      //       _id: '3',
      //       lastName: 'Chen',
      //       role: 'admin'
      //     }
      //   },
      //   {
      //     id: 5,
      //     title: "Introduction to Docker for Developers",
      //     content: "Docker has revolutionized how we build, ship, and run applications. This introduction explains key Docker concepts and how to integrate containerization into your development workflow.",
      //     description: "Get started with Docker containerization and learn how it can streamline your development and deployment processes.",
      //     category: "DevOps",
      //     createDate: "2025-01-30",
      //     coverImage: "assets/blog/docker-cover.jpg",
      //     images: [
      //       "assets/blog/docker-architecture.jpg",
      //       "assets/blog/container-workflow.jpg"
      //     ],
      //     tags: ["Docker", "DevOps", "Containerization", "CI/CD"],
      //     likes: 93,
      //     comments: [
      //       "This finally helped me understand the difference between images and containers.",
      //       "Great primer on Docker! Any plans for a Kubernetes follow-up?"
      //     ],
      //     thumbnail: "assets/blog/docker-thumbnail.jpg",
      //     author: {
      //       firstName: 'Michael',
      //       email: 'michael.chen@example.com',
      //       bio: 'Backend architect specializing in Node.js microservices.',
      //       avatar: 'assets/authors/michael-chen.jpg',
      //       _id: '4',
      //       lastName: 'Chen',
      //       role: 'admin'
      //     }
      //   }
      // ];
    });
  }

  showModal(show: boolean): void {
    this.blogService.saveShowCreateModal(show);
  }

}
