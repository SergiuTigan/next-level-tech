import {inject, Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {Article, Comment} from '../../shared/models/article.interface';
import {BehaviorSubject, from, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {orderBy, where, arrayUnion, arrayRemove, Timestamp} from '@angular/fire/firestore';

const COLLECTION = 'articles';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  readonly #baseService = inject(BaseService);

  previewArticle: BehaviorSubject<Article> = new BehaviorSubject({} as Article);
  currentPreviewArticle$ = this.previewArticle.asObservable();

  savePreviewArticle(article: Article): void {
    this.previewArticle.next(article);
  }

  getAllArticles(): Observable<Article[]> {
    return from(this.#baseService.getAll<Article>(
      COLLECTION,
      orderBy('createDate', 'desc')
    )).pipe(
      map(articles => articles.map(a => this.normalizeArticle(a)))
    );
  }

  getAllArticlesByTag(tag: string): Observable<Article[]> {
    return from(this.#baseService.getAll<Article>(
      COLLECTION,
      where('tags', 'array-contains', tag),
      orderBy('createDate', 'desc')
    )).pipe(
      map(articles => articles.map(a => this.normalizeArticle(a)))
    );
  }

  getArticleById(id: string): Observable<Article> {
    return from(this.#baseService.getById<Article>(COLLECTION, id)).pipe(
      map(article => {
        if (!article) throw new Error('Article not found');
        return this.normalizeArticle(article);
      })
    );
  }

  createArticle(formData: FormData): Observable<Article> {
    return from(this.createArticleAsync(formData));
  }

  private async createArticleAsync(formData: FormData): Promise<Article> {
    const articleData = this.formDataToArticle(formData);

    // Upload cover image if provided
    const coverImage = formData.get('coverImage') as File;
    if (coverImage && coverImage.size > 0) {
      const path = `articles/${Date.now()}_cover_${coverImage.name}`;
      articleData.coverImage = await this.#baseService.uploadFile(path, coverImage);
    }

    // Upload thumbnail if provided
    const thumbnail = formData.get('thumbnail') as File;
    if (thumbnail && thumbnail.size > 0) {
      const path = `articles/${Date.now()}_thumb_${thumbnail.name}`;
      articleData.thumbnail = await this.#baseService.uploadFile(path, thumbnail);
    }

    // Upload additional images
    const additionalImages = formData.getAll('additionalImages') as File[];
    const imageMetadata = JSON.parse(formData.get('imageMetadata') as string || '[]');
    articleData.additionalImages = [];

    for (let i = 0; i < additionalImages.length; i++) {
      const file = additionalImages[i];
      if (file && file.size > 0) {
        const path = `articles/${Date.now()}_${i}_${file.name}`;
        const url = await this.#baseService.uploadFile(path, file);
        articleData.additionalImages.push({
          url,
          description: imageMetadata[i]?.description || ''
        });
      }
    }

    articleData.createDate = new Date().toISOString();
    articleData.likes = [];
    articleData.comments = [];

    return this.#baseService.create<Article>(COLLECTION, articleData);
  }

  deletePost(id: string): Observable<void> {
    return from(this.#baseService.delete(COLLECTION, id));
  }

  updateArticle(id: string, formData: FormData): Observable<Article> {
    return from(this.updateArticleAsync(id, formData));
  }

  private async updateArticleAsync(id: string, formData: FormData): Promise<Article> {
    const articleData = this.formDataToArticle(formData);

    // Upload new cover image if provided
    const coverImage = formData.get('coverImage') as File;
    if (coverImage && coverImage.size > 0) {
      const path = `articles/${id}_cover_${coverImage.name}`;
      articleData.coverImage = await this.#baseService.uploadFile(path, coverImage);
    }

    // Upload new thumbnail if provided
    const thumbnail = formData.get('thumbnail') as File;
    if (thumbnail && thumbnail.size > 0) {
      const path = `articles/${id}_thumb_${thumbnail.name}`;
      articleData.thumbnail = await this.#baseService.uploadFile(path, thumbnail);
    }

    return this.#baseService.update<Article>(COLLECTION, id, articleData);
  }

  likePost(id: string, data: Partial<Article>): Observable<Article> {
    // Toggle like using arrayUnion/arrayRemove
    const userId = data.likes?.[0];
    if (!userId) return from(Promise.reject('No user ID provided'));

    return from(this.toggleLikeAsync(id, userId));
  }

  private async toggleLikeAsync(id: string, userId: string): Promise<Article> {
    const article = await this.#baseService.getById<Article>(COLLECTION, id);
    if (!article) throw new Error('Article not found');

    const hasLiked = article.likes?.includes(userId);
    const updateData = hasLiked
      ? { likes: article.likes.filter(u => u !== userId) }
      : { likes: [...(article.likes || []), userId] };

    return this.#baseService.update<Article>(COLLECTION, id, updateData);
  }

  commentPost(id: string, data: Partial<Article>): Observable<Article> {
    const newComment = data.comments?.[0];
    if (!newComment) return from(Promise.reject('No comment provided'));

    return from(this.addCommentAsync(id, newComment));
  }

  private async addCommentAsync(id: string, comment: Comment): Promise<Article> {
    const article = await this.#baseService.getById<Article>(COLLECTION, id);
    if (!article) throw new Error('Article not found');

    const newComment = {
      ...comment,
      id: `comment_${Date.now()}`,
      _id: `comment_${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    return this.#baseService.update<Article>(COLLECTION, id, {
      comments: [...(article.comments || []), newComment]
    });
  }

  removeComment(id: string, commentId: string): Observable<Article> {
    return from(this.removeCommentAsync(id, commentId));
  }

  private async removeCommentAsync(id: string, commentId: string): Promise<Article> {
    const article = await this.#baseService.getById<Article>(COLLECTION, id);
    if (!article) throw new Error('Article not found');

    const filteredComments = (article.comments || []).filter(
      c => c.id !== commentId && c._id !== commentId
    );

    return this.#baseService.update<Article>(COLLECTION, id, {
      comments: filteredComments
    });
  }

  updateComment(id: string, commentId: string, data: Partial<Article>): Observable<Article> {
    return from(this.updateCommentAsync(id, commentId, data));
  }

  private async updateCommentAsync(id: string, commentId: string, data: Partial<Article>): Promise<Article> {
    const article = await this.#baseService.getById<Article>(COLLECTION, id);
    if (!article) throw new Error('Article not found');

    const updatedComments = (article.comments || []).map(c => {
      if (c.id === commentId || c._id === commentId) {
        return { ...c, ...data.comments?.[0] };
      }
      return c;
    });

    return this.#baseService.update<Article>(COLLECTION, id, {
      comments: updatedComments
    });
  }

  private formDataToArticle(formData: FormData): Partial<Article> {
    const article: Partial<Article> = {};

    const title = formData.get('title');
    if (title) article.title = title as string;

    const published = formData.get('published');
    if (published !== null) article.published = published === 'true';

    const content = formData.get('content');
    if (content) article.content = content as string;

    const description = formData.get('description');
    if (description) article.description = description as string;

    const category = formData.get('category');
    if (category) article.category = category as string;

    const tags = formData.get('tags');
    if (tags) article.tags = (tags as string).split(',').map(t => t.trim());

    return article;
  }

  private normalizeArticle(article: Article): Article {
    return {
      ...article,
      _id: article.id || article._id,
      id: article.id || article._id
    };
  }
}
