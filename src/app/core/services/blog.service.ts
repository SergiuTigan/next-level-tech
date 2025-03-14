import { Injectable } from '@angular/core';
import { environment } from '../../../assets/environment/environment';
import { BaseService } from './base.service';
import { Article } from '../../shared/models/article.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  baseUrl = environment.baseUrl;
  previewArticle: BehaviorSubject<Article> = new BehaviorSubject({} as Article);
  currentPreviewArticle$ = this.previewArticle.asObservable();

  constructor(
    private baseService: BaseService,
    private http: HttpClient
  ) {
  }

  savePreviewArticle(article: Article): void {
    this.previewArticle.next(article);
  }

  getAllArticles(): Observable<Article[]> {
    return this.baseService.get<Article[]>(`${this.baseUrl}/article`);
  }

  getArticleById(id: string): Observable<Article> {
    return this.baseService.get<Article>(`${this.baseUrl}/article/${id}`);
  }

  createPost(formData: FormData): Observable<Article> {
    return this.http.post<Article>(`${this.baseUrl}/article`, formData);
  }

  deletePost(id: string): Observable<any> {
    return this.baseService.delete(`${this.baseUrl}/article/${id}`);
  }

  updatePost(id: string, data: FormData): Observable<Article> {
    return this.baseService.patch<Article>(`${this.baseUrl}/article/${id}`, data);
  }
}
