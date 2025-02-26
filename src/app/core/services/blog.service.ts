import { Injectable } from '@angular/core';
import { environment } from '../../../assets/environment/environment';
import { BaseService } from './base.service';
import { Article } from '../../shared/models/article.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  baseUrl = environment.baseUrl;

  constructor(private baseService: BaseService) {
  }

  getAllArticles(): Observable<Article[]> {
    return this.baseService.get<Article[]>(`${this.baseUrl}/blog-posts`);
  }
}
