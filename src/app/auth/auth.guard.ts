import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  lastUrl:string | undefined;
  
    constructor(
      private service: AuthService,
      private router: Router,
      private jwtHelper: JwtHelperService
      ) {
    }
    
  canActivate(next: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const token = localStorage.getItem("user");  
    const url = state.url;

    if (token && !this.jwtHelper.isTokenExpired(token)){
      return true;
    }

    if (url.startsWith("/user-account")) {
      // Check if the URL has the specific format
      const regex = /^\/user-account\?session=([^&]+)&user=(\d+)$/;
      const match = url.match(regex);

      if (match) {
        // URL has the correct format
        return true;
      } else {
        // URL does not have the correct format
        // Check JWT token as for other pages
        if (token && !this.jwtHelper.isTokenExpired(token)) {
          return true;
        }
        this.router.navigate(["/login"]);
        return false;
      }
    }
    this.router.navigate(["/login"]);
    return false;



      return this.service.isAuthenticated(state.url)
        .pipe(

            tap(authenticated => {

              if (!authenticated)
              {

                this.router.navigate(['/login']);

              }

            }),

        );
        
  }
  
}
