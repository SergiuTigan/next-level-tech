import { Component } from '@angular/core';
import { Article } from '../../../shared/models/article.interface';

@Component({
  selector: 'app-blog',
  imports: [],
  standalone: true,
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent {
  articles: Article[] = [];
  constructor(){
  }

}
