import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppService } from '../app.service';
import { auth } from '../shared/models/Cams-new/auth';
import { catchError, map, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class UserInformationService {

  constructor(private appConfigService: AppService, private httpClient: HttpClient, private router: Router, private jwtHelper: JwtHelperService, private auth: AuthService) { }

  user =  this.auth.getUser()


  public basicUserInfo(userID: number, fistName: string, lastName: string, role: string, email: string) {

    //return this.httpClient.post(this.appConfigService.appConfig[0].apiUrl + '', {});
    let baseApi = this.appConfigService.appConfig[0].apiUrl;

    const apiUrl= this.appConfigService.appConfig[0].apiUrl;

    let rqURL: string = `${baseApi}/api/user/basic-user-info?userID=${userID}&firstName=${fistName}&lastName=${lastName}&email=${email}&role=${role}`;

    return this.httpClient.post(rqURL, {});

  }

  public getFreshAsseteTreeObject(userID: number) {

    return this.httpClient.post(this.appConfigService.appConfig[0].apiUrl + '/api/user/' + userID + '/get-assete-tree', {});

  }

  login(model: auth){
    let queryParams = new HttpParams();

    return this.httpClient.post(this.appConfigService.appConfig[0].apiUrl+`/api/user/login`,model,{
      params:queryParams
    });
  }

  public isLoggedIn(): boolean {
    //return moment().isBefore(this.getExpiration());
    return this.isJWTValid() && this.isSessionTokenValid();
  }

  public isJWTValid(): boolean {
    const userToken = localStorage.getItem('user');
    return userToken != null && !this.jwtHelper.isTokenExpired(userToken);
  }

  private isSessionTokenValid(): boolean {
    const sessionToken = localStorage.getItem('sessionId');
    return sessionToken != null && !this.isSessionExpired(sessionToken);
  }

  private isSessionExpired(sessionToken: string): boolean{
    if (!sessionToken) {
      return false; // Session token not found, consider it as not expired
    }
    else{
      this.validateSessionTokenFromUrl(sessionToken,this.user?.id).pipe(
        map((response:any)=>response.statusCode === 200),
        tap((isValid: boolean)=>{
          if(!isValid){
            //console.log("is valid")
            return false;
          }
          return true;
        })
      ).subscribe();
      return false;//we don't know yet if the session is valid or not so we say that it's expired to force a refresh of the page
    }
  }

  validateSessionTokenFromUrl(sessionToken:any, loginUser: any) {

    let queryParams = new HttpParams();
    const userId = parseInt(loginUser!, 10);

    queryParams = queryParams.append("sessionToken", sessionToken);
    queryParams = queryParams.append("userId", userId.toString());

    const url = this.appConfigService.appConfig[0].apiUrl+`/api/user/validateSessionToken`;

    return this.httpClient.post(url, {},
      {
        params:queryParams
      }).pipe(catchError(error=>{
        localStorage.clear();
        this.router.navigate(['/login']);
      return throwError('Session validation failed')
      }));
  }

}
