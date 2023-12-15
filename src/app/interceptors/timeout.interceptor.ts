import { Inject, Injectable, InjectionToken } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

export const DEFAULT_TIMEOUT = new InjectionToken<number>('defaultTimeout');

@Injectable()
export class TimeoutInterceptor implements HttpInterceptor {

  constructor(@Inject(DEFAULT_TIMEOUT) protected defaultTimeout: number) {

  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    const timeoutValue = req.headers.get('timeout') || this.defaultTimeout;

    const timeoutValueNumeric = Number(timeoutValue);

    return next.handle(req).pipe(timeout(timeoutValueNumeric),catchError(err=>{

      if (err.status === 0 && err.error instanceof ProgressEvent) 

        err.message = 'Connection Error';

      return throwError(err);

    }));

  }
  
}
