import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the token from session storage
    const token = sessionStorage.getItem('token');

    // Only add the authorization header if a token exists
    if (token) {
      // Clone the request and add the authorization header
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });

      // Pass the cloned request with the token to the next handler
      return next.handle(authReq);
    }

    // If no token exists, pass the original request
    return next.handle(req);
  }
}
