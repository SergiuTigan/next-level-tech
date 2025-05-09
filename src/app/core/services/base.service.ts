import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, finalize} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  readonly #http = inject(HttpClient);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  get<T>(url: string): Observable<T> {
    this.setLoading(true);
    return this.#http.get<T>(url).pipe(
      finalize(() => this.setLoading(false))
    );
  }

  post<T>(url: string, body: any): Observable<T> {
    this.setLoading(true);
    return this.#http.post<T>(url, body).pipe(
      finalize(() => this.setLoading(false))
    );
  }

  put<T>(url: string, body: any): Observable<T> {
    this.setLoading(true);
    return this.#http.put<T>(url, body).pipe(
      finalize(() => this.setLoading(false))
    );
  }

  delete<T>(url: string): Observable<T> {
    this.setLoading(true);
    return this.#http.delete<T>(url).pipe(
      finalize(() => this.setLoading(false))
    );
  }

  patch<T>(url: string, body: any): Observable<T> {
    this.setLoading(true);
    return this.#http.patch<T>(url, body).pipe(
      finalize(() => this.setLoading(false))
    );
  }
}
