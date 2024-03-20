import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const token = localStorage.getItem("jwt");

    if (token) {
      const cloned = req.clone({
          headers: req.headers.set("Authorization",
              "Bearer " + token)
      });

      return next.handle(cloned);
      }
      else {
          return next.handle(req);
      }
    
  //   return next.handle(req.clone({

  //     setHeaders: {

  //         Authorization: `Token ${this.auth.getUser()?.token}`

  //     }

  // }));

  }
  
}
