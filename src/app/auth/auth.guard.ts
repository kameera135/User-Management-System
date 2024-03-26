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

    if (token && !this.jwtHelper.isTokenExpired(token)){
      return true;
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
