import { Inject, Injectable, PLATFORM_ID, Pipe, PipeTransform } from '@angular/core';
import { User } from '../shared/models/User';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NavigationExtras, Router } from '@angular/router';
import { JsonPipe, isPlatformBrowser } from '@angular/common';
import { environment } from 'src/environments/environment';
import { Observable, firstValueFrom } from 'rxjs';
import { CrossStorageClient } from 'cross-storage';
import { UserInformationService } from './user-information.service';
import { map, shareReplay, tap } from "rxjs/operators";
import * as moment from "moment";
import { auth } from '../shared/models/Cams-new/auth';
import { AppService } from '../app.service';
import { appSettingModel } from '../shared/models/appSettingModel';
import { forgotPassword } from '../shared/models/Cams-new/forgotPassword';
import { resetPassword } from '../shared/models/Cams-new/resetPassword';
import { JwtHelperService } from '@auth0/angular-jwt';
import { config } from 'process';
import { UserAccountService } from '../services/cams-new/user-account.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private user!: User | any;
  public lastUrl: string = "/";

  private headers!: Headers;

  private appSettings: any = {};

  appConfig: appSettingModel[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private httpClient: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService,) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Access-Control-Allow-Origin', '*');
    this.getUser();
  }

  public isAuthenticated(url: any): Observable<boolean> {
    return new Observable<boolean>(ob => {
      if (url != "/") this.lastUrl = url;
      ob.next(this.user != undefined && this.user?.permissions != undefined);
    });
  }

  verifyTokenPlatform(user: any): Observable<any> {
    let url = environment.apiBase + '/api/central-auth/single-auth/verify';
    return this.httpClient.post(url, {
      token: user.token,
      behaviorString: "string"
    });
  }

  public getUser() {

    let user: User | null = null;
    try {
      const jwtToken = localStorage.getItem('user');
      if (jwtToken && this.isJWTValid()) {
        const decodedToken = this.decodeToken(jwtToken);
        if (decodedToken) {
          user = new User(decodedToken);
        }
      }
      else {
        localStorage.clear();
        //this.router.navigate(['/login']);
      }
    }
    catch (e) {
      console.log(e);
    }
    finally {
      return user;
    }
  }

  private decodeToken(token: string): any {

    if (token) {
      const payload = token.split('.')[1];
      const base64Payload = payload.replace(/-/g, "+").replace(/_/g, "/");
      const decodedPayload = atob(base64Payload);
      const parsedPayload = JSON.parse(decodedPayload);

      if (parsedPayload.UserDetails) {
        let userDetails = parsedPayload.UserDetails;

        // If userDetails is not an array, convert it to an array with a single element
        if (!Array.isArray(userDetails)) {
          userDetails = [userDetails];
        }

        // Remove the "UserDetails" claim from the parsed payload
        delete parsedPayload.UserDetails;

        // Deserialize each user detail JSON string within the array
        userDetails = userDetails.map((userDetailJson: string) => {
          try {
            return JSON.parse(userDetailJson);
          } catch (error) {
            console.warn('Invalid user details data in JWT payload.');
            return {};
          }
        });

        // Combine the parsed payload and the deserialized user details
        return { ...parsedPayload, UserDetails: userDetails };
      } else {
        return parsedPayload;
      }
    }
  }

  private userPayload: any;


  //to store token in session
  private setSession(authResult: any) {
    const expiresAt = moment().add(authResult.expiresIn, 'second');

    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
  }

  logout(): void {
    localStorage.clear();
    // Clear session storage
    sessionStorage.clear();

    // Redirect to the login page without adding the logout action to the browser's history
    const navigationExtras: NavigationExtras = {
      skipLocationChange: false
    };

    this.router.navigate(['/login'], navigationExtras);
  }

  public isLoggedIn(): boolean {
    //return moment().isBefore(this.getExpiration());
    return this.isJWTValid();
  }

  public isJWTValid(): boolean {
    const userToken = localStorage.getItem('user');
    return userToken != null && !this.jwtHelper.isTokenExpired(userToken);
  }

  private isSessionTokenValid(): boolean {
    const sessionToken = localStorage.getItem('sessionId');
    return sessionToken != null && !this.isSessionExpired(sessionToken);
  }

  private isSessionExpired(sessionToken: string): boolean {
    if (!sessionToken) {
      return false; // Session token not found, consider it as not expired
    }
    else {
      return true;
    }
  }

  isLoggedOut(): boolean {
    return !this.isLoggedIn();
  }

  getExpiration(): moment.Moment | null {
    const expiration = localStorage.getItem("expires_at");

    if (expiration) {
      const expiresAt = JSON.parse(expiration);
      return moment(expiresAt);
    }

    return null;
  }

  storeToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue)
  }
  storeRefreshToken(tokenValue: string) {
    localStorage.setItem('refreshToken', tokenValue)
  }

  getToken() {
    return localStorage.getItem('token')
  }
  getRefreshToken() {
    return localStorage.getItem('refreshToken')
  }

  // isLoggedIn(): boolean{
  //   return !!localStorage.getItem('token')
  // }

  // decodedToken(){
  //   const jwtHelper = new JwtHelperService();
  //   const token = localStorage.getItem('jwt');
  //   console.log(jwtHelper.decodeToken(token))
  //   return jwtHelper.decodeToken(token)
  // }

  getfullNameFromToken() {
    if (this.userPayload)
      return this.userPayload.name;
  }

  getRoleFromToken() {
    if (this.userPayload)
      return this.userPayload.role;
  }

  // renewToken(tokenApi : TokenApiModel){
  //   return this.http.post<any>(`${this.baseUrl}refresh`, tokenApi)
  // }
}
