import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { error } from 'console';
import { reject } from 'lodash';
import { resolve } from 'path';
import { Observable, catchError, throwError } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { AuthService } from 'src/app/auth/auth.service';
import { PaginatedResponse } from 'src/app/shared/models/Cams-new/PaginatedResponse';
import { User } from 'src/app/shared/models/Cams-new/User';

@Injectable({
  providedIn: 'root'
})
export class UserAccountService {

  constructor(private appService: AppService, private httpClient: HttpClient, private auth: AuthService, private router: Router) { }

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
    queryParams = queryParams.append("updatedBy", model.userId);

    return this.httpClient.put(`${this.apiUrl}/api/user`, model, {
      params: queryParams,
    });
  }

  validateSessionTokenFromUrl(sessionToken:any, loginUser: any) {
    /*const urlParams = new URLSearchParams(window.location.search);
    const sessionToken = urlParams.get('token');
    const loginUser = urlParams.get('userId');*/

    // const sessionToken = this.route.snapshot.queryParams['token'];
    // const loginUser = this.route.snapshot.queryParams['userId'];

    // console.log(sessionToken + " - " + loginUser);

    if (!sessionToken) {
      this.router.navigate(['/login']);
      return throwError('Session token not found in URL');
    }

    localStorage.setItem('sessionId', sessionToken);

    let queryParams = new HttpParams();
    const userId = parseInt(loginUser!, 10);

    queryParams = queryParams.append("sessionToken", sessionToken);
    queryParams = queryParams.append("userId", userId.toString());

    const url = `${this.apiUrl}/api/user/validateSessionToken`;

    return this.httpClient.post(url, {},
      {
        params:queryParams
      }).pipe(catchError(error=>{
        this.router.navigate(['/login']);
      return throwError('Session validation failed')
      }));
  }

  deleteSessionToken(userId: number, sessionToken: string){
    let queryParams = new HttpParams();

    queryParams = queryParams.append( 'sessionToken', sessionToken );
    queryParams = queryParams.append('userId', userId);

    return this.httpClient.delete(`${this.apiUrl}/api/user/deleteSession`,{
        params: queryParams
    });
}
}

