import {inject, Injectable} from '@angular/core';
import {environment} from '../../../assets/environment/environment';
import {BaseService} from './base.service';
import {Article} from '../../shared/models/article.interface';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable()
export class BlogService {
  readonly #baseService = inject(BaseService);
  baseUrl = environment.baseUrl;
  previewArticle: BehaviorSubject<Article> = new BehaviorSubject({} as Article);
  currentPreviewArticle$ = this.previewArticle.asObservable();

  savePreviewArticle(article: Article): void {
    this.previewArticle.next(article);
  }

  getAllArticles(): Observable<Article[]> {
    return this.#baseService.get<Article[]>(`${this.baseUrl}/article`);
  }

  getAllArticlesByTag(tag: string): Observable<Article[]> {
    return this.#baseService.get<Article[]>(`${this.baseUrl}/article/tag/${tag}`);
  }

  getArticleById(id: string): Observable<Article> {
    return this.#baseService.get<Article>(`${this.baseUrl}/article/${id}`);
  }

  createArticle(article: FormData): Observable<Article> {
    return this.#baseService.post<Article>(`${this.baseUrl}/article`, article);
  }

  deletePost(id: string): Observable<any> {
    return this.#baseService.delete(`${this.baseUrl}/article/${id}`);
  }

  updateArticle(id: string, data: FormData): Observable<Article> {
    return this.#baseService.patch<Article>(`${this.baseUrl}/article/${id}`, data);
  }

  likePost(id: string, data: Partial<Article>): Observable<Article> {
    return this.#baseService.patch<Article>(`${this.baseUrl}/article/${id}/like`, data);
  }

  commentPost(id: string, data: Partial<Article>): Observable<Article> {
    return this.#baseService.patch<Article>(`${this.baseUrl}/article/${id}/comment`, data);
  }

  removeComment(id: string, commentId: string): Observable<Article> {
    return this.#baseService.delete<Article>(`${this.baseUrl}/article/${id}/comment/${commentId}`);
  }

  updateComment(id: string, commentId: string, data: Partial<Article>): Observable<Article> {
    return this.#baseService.patch<Article>(`${this.baseUrl}/article/${id}/comment/${commentId}`, data);
  }
}
