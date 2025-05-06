import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ContactRequest, ContactResponse} from '../../shared/models/contact.interface';
import {environment} from '../../../assets/environment/environment';

@Injectable()
export class ContactService {
  readonly http = inject(HttpClient);
  private apiUrl = `${environment.baseUrl}/contact`;

  /**
   * Send a contact form submission to the API
   */
  submitContactForm(contactData: ContactRequest): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(this.apiUrl, contactData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Could not connect to the server. Please check your internet connection.';
      } else if (error.status === 400) {
        errorMessage = error.error?.message || 'Invalid form data. Please check your inputs.';
      } else if (error.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else {
        errorMessage = `Error ${error.status}: ${error.error?.message || error.statusText}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
