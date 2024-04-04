import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserAccountService } from '../services/cams-new/user-account.service';
import { error } from 'console';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  lastUrl:string | undefined;
  
    constructor(
      private service: AuthService,
      private router: Router,
      private jwtHelper: JwtHelperService,
      private sessionValidation: UserAccountService
      ) {
    }
    
  canActivate(next: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const token = localStorage.getItem("user");  
    const session = localStorage.getItem("sessionId")
    const user = this.service.getUser()?.id;
    const url = state.url;

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
          return this.sessionValidation.validateSessionTokenFromUrl(session, user).pipe(
            map((response: any) => response.statusCode === 200),
            tap((isValid: boolean) => {
              if (!isValid) {
                localStorage.clear();
                this.router.navigate(["/login"]);
                //return false;
              }
            })
          );
          //return true;
        }
        this.router.navigate(["/login"]);
        return false;
      }
    }

    // For other pages, validate the session token
    return this.sessionValidation.validateSessionTokenFromUrl(session, user).pipe(
      map((response: any) => response.statusCode == 200),
      tap((isValid: boolean) => {
        if (!isValid) {
          console.log("hello");
          localStorage.clear();
          this.router.navigate(["/login"]);
          //return false;
        }
      })
    );
  }
}