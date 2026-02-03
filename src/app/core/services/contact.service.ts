import {inject, Injectable} from '@angular/core';
import {from, Observable} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {ContactRequest, ContactResponse} from '../../shared/models/contact.interface';
import {BaseService} from './base.service';

const COLLECTION = 'contacts';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  readonly #baseService = inject(BaseService);

  /**
   * Send a contact form submission to Firestore
   */
  submitContactForm(contactData: ContactRequest): Observable<ContactResponse> {
    return from(this.submitAsync(contactData)).pipe(
      catchError(error => {
        throw new Error(this.handleError(error));
      })
    );
  }

  private async submitAsync(contactData: ContactRequest): Promise<ContactResponse> {
    const contact = {
      name: contactData.name,
      email: contactData.email,
      subject: contactData.subject,
      message: contactData.message,
      captchaToken: contactData.captchaToken,
      isRead: false
    };

    const created = await this.#baseService.create<ContactResponse>(COLLECTION, contact);
    return created;
  }

  /**
   * Get all contact submissions (for admin)
   */
  getAllContacts(): Observable<ContactResponse[]> {
    return from(this.#baseService.getAll<ContactResponse>(COLLECTION));
  }

  /**
   * Mark a contact as read
   */
  markAsRead(id: string): Observable<ContactResponse> {
    return from(this.#baseService.update<ContactResponse>(COLLECTION, id, { isRead: true }));
  }

  /**
   * Delete a contact submission
   */
  deleteContact(id: string): Observable<void> {
    return from(this.#baseService.delete(COLLECTION, id));
  }

  /**
   * Handle errors
   */
  private handleError(error: any): string {
    if (error?.code) {
      switch (error.code) {
        case 'permission-denied':
          return 'Permission denied. Please try again later.';
        case 'unavailable':
          return 'Service unavailable. Please check your internet connection.';
        default:
          return `Error: ${error.message || 'An unknown error occurred'}`;
      }
    }
    return error?.message || 'An unknown error occurred';
  }
}
