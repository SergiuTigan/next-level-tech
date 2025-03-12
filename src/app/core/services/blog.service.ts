import { Injectable } from '@angular/core';
import { environment } from '../../../assets/environment/environment';
import { BaseService } from './base.service';
import { Article, CreateArticleDto } from '../../shared/models/article.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  baseUrl = environment.baseUrl;
  showCreateModal: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  showCreateModalCurrent$ = this.showCreateModal.asObservable();

  constructor(
    private baseService: BaseService,
    private http: HttpClient
  ) {}

  saveShowCreateModal(show: boolean): void {
    this.showCreateModal.next(show);
  }

  getAllArticles(): Observable<Article[]> {
    return this.baseService.get<Article[]>(`${this.baseUrl}/blog-posts`);
  }

  getArticleById(id: string): Observable<Article> {
    return this.baseService.get<Article>(`${this.baseUrl}/blog-posts/${id}`);
  }

  createPost(formData: FormData): Observable<Article> {
    return this.http.post<Article>(`${this.baseUrl}/blog-posts`, formData);
  }

  uploadImage(imageFile: File): Observable<{url: string}> {
    const formData = new FormData();
    formData.append('image', imageFile);
    return this.http.post<{url: string}>(`${this.baseUrl}/upload`, formData);
  }

  deletePost(id: string): Observable<any> {
    return this.baseService.delete(`${this.baseUrl}/blog-posts/${id}`);
  }

  updatePost(id: string, data: Partial<Article>): Observable<Article> {
    return this.baseService.patch<Article>(`${this.baseUrl}/blog-posts/${id}`, data);
  }

  updatePostWithFiles(id: string, formData: FormData): Observable<Article> {
    return this.http.patch<Article>(`${this.baseUrl}/blog-posts/${id}`, formData);
  }
}
