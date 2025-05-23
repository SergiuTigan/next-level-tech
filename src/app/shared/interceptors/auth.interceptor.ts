import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import {inject} from "@angular/core";
import {BaseService} from "../../core/services/base.service";

/**
 * Functional Http Interceptor to add Authorization Bearer token from sessionStorage.
 */
export const authInterceptorFn: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const baseService = inject(BaseService);

  baseService.setLoading(true);

  const token = sessionStorage.getItem('token');

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }
  return next(req);
};
