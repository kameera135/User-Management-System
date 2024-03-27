import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { AuthService } from 'src/app/auth/auth.service';
import { PaginatedResponse } from 'src/app/shared/models/Cams-new/PaginatedResponse';
import { User } from 'src/app/shared/models/Cams-new/User';

@Injectable({
  providedIn: 'root'
})
export class UserAccountService {

  constructor(private appService: AppService, private httpClient: HttpClient, private auth: AuthService, private router: Router, private route: ActivatedRoute) { }

  apiUrl = this.appService.appConfig[0].apiUrl;
  //user = this.appService.user;
  user = this.auth.getUser();

  getUserDetails(userId: string){
    let queryParams = new HttpParams();

    queryParams = queryParams.append("userId", userId);

    const url = `${this.apiUrl}/api/user/userDetails`;
    return this.httpClient.get(url, { params: queryParams });
  }

  putUser(model: User) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("updatedBy", this.user?.id);

    return this.httpClient.put(`${this.apiUrl}/api/user`, model, {
      params: queryParams,
    });
  }

  validateSessionTokenFromUrl(): Observable<any> {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionToken = urlParams.get('token');
    const loginUser = urlParams.get('userId');

    /*const sessionToken = this.route.snapshot.queryParams['token'];
    const loginUser = this.route.snapshot.queryParams['userId'];*/

    if (!sessionToken) {
      this.router.navigate(['/login']);
      return throwError('Session token not found in URL');
    }

    localStorage.setItem('sessionId', sessionToken);

    let queryParams = new HttpParams();
    const userId = parseInt(loginUser!, 10);

    queryParams = queryParams.append("userId", userId.toString());
    queryParams = queryParams.append("sessionId", sessionToken);

    return this.httpClient.post<any>(`${this.apiUrl}user/validateSessionToken`, {params:queryParams}).pipe(
      catchError(error => {
        this.router.navigate(['/login']);
        return throwError('Session validation failed');
      })
    );
  }

  handleSessionValidationResponse(response: any): void {
    if (response.statusCode === 200 && response.token) {
      const token = response.token;
      // Check if the token is a valid JWT
      if (this.isJWT(token)) {
        // Set JWT token to local storage
        localStorage.setItem('user', token);

      } else {
        // Redirect to login page if token is invalid
        this.router.navigate(['/login']);
        throw new Error('Invalid JWT token');
      }
    } else {
      // Redirect to login page if response does not contain a valid token
      this.router.navigate(['/login']);
      throw new Error('Session validation failed');
    }
  }

  private isJWT(token: string): boolean {
    const jwtParts = token.split('.');
    return jwtParts.length === 3; // JWT tokens contain three parts separated by dots
  }
}

