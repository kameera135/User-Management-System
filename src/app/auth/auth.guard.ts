import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  lastUrl:string | undefined;
  
    constructor(
      private service: AuthService,
      private router: Router
      ) {
    }
    
  canActivate(next: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      return this.service.isAuthenticated(state.url)
        .pipe(

            tap(authenticated => {

              if (!authenticated)
              {

                this.router.navigate(['/auth/login']);

              }

            }),

        );
        
  }
  
}
