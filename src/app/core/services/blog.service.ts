import { Injectable } from '@angular/core';
import { environment } from '../../../assets/environment/environment';
import { BaseService } from './base.service';
import { Article } from '../../shared/models/article.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  baseUrl = environment.baseUrl;
  showCreateModal: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  showCreateModalCurrent$ = this.showCreateModal.asObservable();
  constructor(private baseService: BaseService) {
  }

  saveShowCreateModal(show: boolean): void {
    this.showCreateModal.next(show);
  }
  getAllArticles(): Observable<Article[]> {
    return this.baseService.get<Article[]>(`${this.baseUrl}/blog-posts`);
  }
  getArticleById(id: string): Observable<Article> {
    return this.baseService.get<Article>(`${this.baseUrl}/blog-posts/${id}`);
  }
}
