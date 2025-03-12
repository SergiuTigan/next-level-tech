import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../../services/blog.service';
import { Article } from '../../../../shared/models/article.interface';
import { User } from '../../../../shared/models/user.interface';
import { SafeHtmlPipe } from '../../../../shared/pipes/safe-html.pipe';

@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.css']
})
export class BlogDetailsComponent implements OnInit {
  article!: Article;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private blogService: BlogService) {
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.blogService.getArticleById(id).subscribe((article: Article) => {
        this.article = article;
        this.article.tags = this.article.tags[0].split(',');
        this.article.tags = this.article.tags.map(tag => tag.charAt(0).toUpperCase() + tag.slice(1));
        if (article && article.images && article.images.length > 0) {
          this.article.content = this.integrateImagesIntoContent(article.content, article.images);
        } else {
          this.article.content = article.content;
        }
      });
    }
  }

  private integrateImagesIntoContent(content: string, images: any[]): string {
    if (!content || !images || images.length === 0) {
      return content;
    }

    // Create paragraphs from content
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);

    // If not enough paragraphs or too short content, return original
    if (paragraphs.length <= 1 || content.length < 500) {
      return content;
    }

    // Determine how many images to place based on content length and available images
    const contentLength = content.length;
    const numImagesToPlace = Math.min(
      images.length,
      Math.floor(contentLength / 100) + 1, // One image per ~1000 chars
      Math.floor(paragraphs.length / 2)      // Or one image per ~3 paragraphs, whichever is smaller
    );

    // Create copy of images array to work with
    const availableImages = [...images];

    // Calculate optimal positions to insert images (evenly distributed)
    const positions = [];
    if (numImagesToPlace > 0) {
      const segmentSize = paragraphs.length / (numImagesToPlace + 1);

      for (let i = 1; i <= numImagesToPlace; i++) {
        const position = Math.floor(segmentSize * i);
        // Ensure we don't place images at the very beginning or end
        if (position > 0 && position < paragraphs.length - 1) {
          positions.push(position);
        }
      }
    }

    // Insert image HTML at calculated positions
    let processedParagraphs = [...paragraphs];

    // Sort positions in descending order to avoid index shifts
    positions.sort((a, b) => b - a).forEach(position => {
      if (availableImages.length > 0) {
        const image = availableImages.shift();
        const imageHtml = `
        <figure class="my-8">
          <img src="${image.url}" alt="${image.description || 'Article image'}"
               class="w-full h-auto rounded-lg shadow-md object-cover">
          ${image.description ? `<figcaption class="text-sm text-gray-600 mt-2 text-center">${image.description}</figcaption>` : ''}
        </figure>
      `;

        processedParagraphs.splice(position, 0, imageHtml);
      }
    });

    return processedParagraphs.join('\n\n');
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
  }

  goBack(): void {
    this.router.navigate(['/blog']);
  }
}
